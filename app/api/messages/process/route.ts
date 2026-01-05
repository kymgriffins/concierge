import { NextRequest, NextResponse } from "next/server";
import { MessageParser, ParsedBookingData } from "@/lib/message-parser";

export interface AutoBookingResult {
  success: boolean;
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

    // Auto-booking functionality disabled - dummy data removed
    return NextResponse.json({
      success: false,
      messageId,
      error: "Auto-booking functionality is currently disabled. Message parsing only available via PUT endpoint.",
      requiresReview: true,
    } as AutoBookingResult);
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
