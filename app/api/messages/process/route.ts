import { NextRequest, NextResponse } from "next/server";
import { MessageParser, ParsedBookingData } from "@/lib/message-parser";
import { MockAPI, Booking } from "@/lib/mock-api";

export interface AutoBookingResult {
  success: boolean;
  booking?: Booking;
  parsedData?: ParsedBookingData;
  messageId: string;
  confidence: "high" | "medium" | "low";
  requiresReview: boolean;
  error?: string;
  suggestions?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { messageId } = await req.json();

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 },
      );
    }

    // Get the message from the database
    const messages = await MockAPI.getIncomingMessages(100);
    const message = messages.find((m) => m.id === messageId);

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (message.processed) {
      return NextResponse.json(
        { error: "Message already processed" },
        { status: 400 },
      );
    }

    // Get active services to filter parsing
    const allServices = await MockAPI.getServiceOptions();
    const activeServiceIds = allServices
      .filter((s) => s.active)
      .map((s) => s.id);

    // Parse the message
    const parseResult = MessageParser.parse(message.message);

    if (!parseResult.success || !parseResult.data) {
      // Mark message as processed but failed
      await MockAPI.markMessageProcessed(messageId, true);

      return NextResponse.json({
        success: false,
        messageId,
        error: parseResult.error,
        suggestions: parseResult.suggestions,
        requiresReview: true,
      } as AutoBookingResult);
    }

    const parsedData = parseResult.data;

    // Determine if booking should be auto-created or require review
    const requiresReview = parsedData.confidence.overall !== "high";

    if (requiresReview) {
      // Mark as processed but queue for manual review
      await MockAPI.markMessageProcessed(messageId, true);

      return NextResponse.json({
        success: false,
        messageId,
        parsedData,
        confidence: parsedData.confidence.overall,
        requiresReview: true,
        error: "Low confidence - requires manual review",
      } as AutoBookingResult);
    }

    // Map message source to booking source
    const mapMessageSource = (source: string): Booking["source"] => {
      switch (source) {
        case "email":
        case "whatsapp":
          return source as Booking["source"];
        case "call":
        case "sms":
          return "manual"; // Map call/sms to manual for now
        default:
          return "manual";
      }
    };

    // Auto-create the booking
    try {
      const serviceId =
        parsedData.services && parsedData.services.length > 0
          ? parsedData.services[0]
          : "arrival";
      const servicePrices = { arrival: 150, departure: 175, transit: 200 };
      const serviceFee =
        servicePrices[serviceId as keyof typeof servicePrices] || 150;

      const bookingData: Omit<
        Booking,
        "id" | "createdAt" | "updatedAt" | "notes"
      > = {
        passengerName: parsedData.passengerName || "Unknown Passenger",
        company: parsedData.company || "",
        phone: parsedData.phone || "",
        email: parsedData.email || "",
        flightNumber: parsedData.flightNumber!,
        airline: parsedData.airline || "",
        date: parsedData.date || new Date().toISOString().split("T")[0],
        time: parsedData.time || "00:00",
        terminal: parsedData.terminal || "",
        passengerCount: parsedData.passengerCount || 1,
        serviceId,
        specialRequests: parsedData.specialRequests || "",
        status: "new" as const,
        source: mapMessageSource(message.source),
        // Required admin fields
        priority: "normal" as const,
        customerType: "individual" as const,
        estimatedDuration: 60,
        serviceFee,
        additionalCharges: 0,
        totalRevenue: serviceFee,
      };

      const booking = await MockAPI.createBooking(bookingData);

      // Mark message as processed
      await MockAPI.markMessageProcessed(messageId, true);

      // Create activity log
      await MockAPI.createActivityLog({
        bookingId: booking.id,
        action: "Auto-booking Created",
        user: "Auto-Booking System",
        details: `Auto-created from ${message.source} message. Confidence: ${parsedData.confidence.overall}`,
      });

      return NextResponse.json({
        success: true,
        booking,
        parsedData,
        messageId,
        confidence: parsedData.confidence.overall,
        requiresReview: false,
      } as AutoBookingResult);
    } catch (bookingError) {
      // Mark message as processed but failed
      await MockAPI.markMessageProcessed(messageId, true);

      return NextResponse.json({
        success: false,
        messageId,
        parsedData,
        confidence: parsedData.confidence.overall,
        requiresReview: true,
        error: `Failed to create booking: ${bookingError instanceof Error ? bookingError.message : "Unknown error"}`,
      } as AutoBookingResult);
    }
  } catch (error) {
    console.error("Auto-booking processing error:", error);
    return NextResponse.json(
      {
        error: `Processing failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}

// Test endpoint - parse a message without creating booking
export async function PUT(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const parseResult = MessageParser.parse(message);

    return NextResponse.json({
      success: parseResult.success,
      data: parseResult.data,
      error: parseResult.error,
      suggestions: parseResult.suggestions,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Test parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}
