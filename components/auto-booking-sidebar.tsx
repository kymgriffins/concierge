"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MockAPI,
  IncomingMessage,
  Booking,
  RosterShift,
  Agent,
} from "@/lib/mock-api";
import { MessageParser } from "@/lib/message-parser";
import { AutoBookingResult } from "@/app/api/messages/process/route";
import {
  MessageSquare,
  Send,
  CheckCircle,
  AlertTriangle,
  Eye,
  RefreshCw,
  Zap,
  User,
  Phone,
  Mail,
  Plane,
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  AlertCircle,
  UserCheck,
  CalendarDays,
  Target,
} from "lucide-react";

interface ParsedDataDisplayProps {
  data: any;
  confidence: "high" | "medium" | "low";
}

function ParsedDataDisplay({ data, confidence }: ParsedDataDisplayProps) {
  const getConfidenceColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getConfidenceIcon = (level: string) => {
    switch (level) {
      case "high":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "low":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Star className="h-4 w-4" />
        <span className="font-medium">Confidence:</span>
        <Badge
          variant={
            confidence === "high"
              ? "default"
              : confidence === "medium"
                ? "secondary"
                : "destructive"
          }
        >
          {confidence.toUpperCase()}
        </Badge>
        {getConfidenceIcon(confidence)}
      </div>

      <div className="grid gap-3">
        {data.passengerName && (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Passenger:</span>
            <span>{data.passengerName}</span>
          </div>
        )}

        {data.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Phone:</span>
            <span>{data.phone}</span>
          </div>
        )}

        {data.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Email:</span>
            <span>{data.email}</span>
          </div>
        )}

        {data.flightNumber && (
          <div className="flex items-center gap-2 text-sm">
            <Plane className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Flight:</span>
            <span>
              {data.flightNumber} {data.airline && `(${data.airline})`}
            </span>
          </div>
        )}

        {data.date && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Date:</span>
            <span>{data.date}</span>
          </div>
        )}

        {data.time && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Time:</span>
            <span>{data.time}</span>
          </div>
        )}

        {data.terminal && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Terminal:</span>
            <span>{data.terminal}</span>
          </div>
        )}

        {data.passengerCount && data.passengerCount > 1 && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Passengers:</span>
            <span>{data.passengerCount}</span>
          </div>
        )}

        {data.services && data.services.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <Zap className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="font-medium">Services:</span>
            <div className="flex flex-wrap gap-1">
              {data.services.map((service: string) => (
                <Badge key={service} variant="outline" className="text-xs">
                  {service.replace("_", " ")}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {data.specialRequests && (
          <div className="flex items-start gap-2 text-sm">
            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="font-medium">Requests:</span>
            <span className="text-muted-foreground">
              {data.specialRequests}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function AutoBookingSidebar() {
  const [inputMessage, setInputMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResult, setParseResult] = useState<any>(null);
  const [bookingResult, setBookingResult] = useState<AutoBookingResult | null>(
    null,
  );
  const [messages, setMessages] = useState<IncomingMessage[]>([]);
  const [selectedMessage, setSelectedMessage] =
    useState<IncomingMessage | null>(null);
  const [activeTab, setActiveTab] = useState<"input" | "messages">("input");

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const msgs = await MockAPI.getIncomingMessages(20);
      setMessages(msgs);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const testParseMessage = async () => {
    if (!inputMessage.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch("/api/messages/process", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage }),
      });

      const result = await response.json();
      setParseResult(result);
      setBookingResult(null);
    } catch (error) {
      console.error("Parse error:", error);
      setParseResult({ success: false, error: "Failed to parse message" });
    } finally {
      setIsProcessing(false);
    }
  };

  const createAutoBooking = async () => {
    if (!parseResult?.success || !parseResult?.data) return;

    setIsProcessing(true);
    try {
      // First create a mock message
      const mockMessage = await MockAPI.createIncomingMessage({
        source: "manual" as any,
        senderName: parseResult.data.passengerName || "Test User",
        senderContact:
          parseResult.data.phone ||
          parseResult.data.email ||
          "test@example.com",
        message: inputMessage,
      });

      // Then process it
      const response = await fetch("/api/messages/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: mockMessage.id }),
      });

      const result = await response.json();
      setBookingResult(result);

      if (result.success) {
        setInputMessage("");
        setParseResult(null);
        loadMessages(); // Refresh messages list
      }
    } catch (error) {
      console.error("Auto-booking error:", error);
      setBookingResult({
        success: false,
        messageId: "",
        confidence: "low",
        requiresReview: true,
        error: "Failed to create auto-booking",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processIncomingMessage = async (message: IncomingMessage) => {
    setSelectedMessage(message);
    setIsProcessing(true);

    try {
      const response = await fetch("/api/messages/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: message.id }),
      });

      const result = await response.json();
      setBookingResult(result);

      if (result.success) {
        loadMessages(); // Refresh to show processed status
      }
    } catch (error) {
      console.error("Message processing error:", error);
      setBookingResult({
        success: false,
        messageId: message.id,
        confidence: "low",
        requiresReview: true,
        error: "Failed to process message",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-96 h-full border-l bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Booking System</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Create bookings and assign to shifts & agents
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("input")}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === "input"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Test Input
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === "messages"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Messages ({messages.filter((m) => !m.processed).length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "input" ? (
          <div className="p-4 space-y-4">
            {/* Message Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Test Message
              </label>
              <Textarea
                placeholder="Enter a booking request message to test parsing..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={testParseMessage}
                disabled={!inputMessage.trim() || isProcessing}
                size="sm"
                className="flex-1"
              >
                {isProcessing ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                Parse Message
              </Button>
              {parseResult?.success && (
                <Button
                  onClick={createAutoBooking}
                  disabled={isProcessing}
                  size="sm"
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Create Booking
                </Button>
              )}
            </div>

            {/* Parse Results */}
            {parseResult && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {parseResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    Parse Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {parseResult.success ? (
                    <ParsedDataDisplay
                      data={parseResult.data}
                      confidence={
                        parseResult.data?.confidence?.overall || "low"
                      }
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="p-3 border border-red-200 bg-red-50 rounded-md">
                        <p className="text-sm text-red-800">
                          {parseResult.error}
                        </p>
                      </div>
                      {parseResult.suggestions && (
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Suggestions:
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {parseResult.suggestions.map(
                              (suggestion: string, i: number) => (
                                <li key={i}>• {suggestion}</li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Booking Result */}
            {bookingResult && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {bookingResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                    Booking Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bookingResult.success ? (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600 font-medium">
                        ✓ Booking created successfully!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Booking ID: {bookingResult.booking?.id}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Passenger: {bookingResult.booking?.passengerName}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-md">
                        <p className="text-sm text-yellow-800">
                          {bookingResult.error || "Booking creation failed"}
                        </p>
                      </div>
                      {bookingResult.requiresReview && (
                        <p className="text-sm text-muted-foreground">
                          This booking requires manual review.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ) : activeTab === "messages" ? (
          <div className="p-4 space-y-4">
            {/* Messages List */}
            <div className="space-y-2">
              {messages.map((message) => (
                <Card
                  key={message.id}
                  className={`cursor-pointer transition-colors ${
                    message.processed ? "opacity-60" : "hover:bg-muted/50"
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {message.source}
                          </Badge>
                          {message.processed && (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm font-medium truncate">
                          {message.senderName || "Unknown Sender"}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {message.message}
                        </p>
                      </div>
                      {!message.processed && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => processIncomingMessage(message)}
                          disabled={isProcessing}
                        >
                          <Zap className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {messages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No messages yet</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
