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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MockAPI, Booking } from "@/lib/mock-api";
import { useToast } from "@/components/ui/toast";
import { formatDateUTC } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  UserCheck,
  Shield,
  Check,
  X,
} from "lucide-react";

export function SupervisorReviewPanel() {
  const [pendingReviews, setPendingReviews] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<{ [key: string]: string }>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const toast = useToast();

  useEffect(() => {
    loadPendingReviews();
    loadCurrentUser();
  }, []);

  const loadPendingReviews = async () => {
    try {
      const reviews = await MockAPI.getBookingsPendingReview();
      setPendingReviews(reviews);
    } catch (error) {
      console.error("Error loading pending reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const user = await MockAPI.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading current user:", error);
    }
  };

  const handleApprove = async (bookingId: string) => {
    if (currentUser?.role !== "supervisor") {
      toast.showToast({
        title: "Permission Denied",
        description: "Only supervisors can approve reviews",
        type: "error",
      });
      return;
    }

    setProcessingId(bookingId);
    try {
      await MockAPI.approveSupervisorReview(bookingId, reviewNotes[bookingId]);
      await loadPendingReviews();
      setReviewNotes((prev) => ({ ...prev, [bookingId]: "" }));
      toast.showToast({
        title: "Review Approved",
        description: "Service has been completed and approved",
        type: "success",
      });
    } catch (error) {
      console.error("Error approving review:", error);
      toast.showToast({
        title: "Approval Failed",
        description: String(error),
        type: "error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getServiceTypeIcon = (serviceId: string) => {
    const icons = {
      arrival: "🛬",
      departure: "🛫",
      transit: "🔄",
    };
    return icons[serviceId as keyof typeof icons] || "✈️";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Supervisor Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Supervisor Reviews
          <Badge variant="secondary">{pendingReviews.length}</Badge>
        </CardTitle>
        <CardDescription>Review and approve completed services</CardDescription>
      </CardHeader>
      <CardContent>
        {pendingReviews.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No services pending supervisor review
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingReviews.map((booking) => (
              <Card key={booking.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {getServiceTypeIcon(booking.serviceId)}
                      </span>
                      <div>
                        <h4 className="font-medium">{booking.passengerName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {booking.flightNumber} • {booking.airline} •{" "}
                          {formatDateUTC(booking.date)} {booking.time}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending Review
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm">
                      <span className="font-medium">Service:</span>{" "}
                      {booking.serviceId} •
                      <span className="font-medium ml-2">Company:</span>{" "}
                      {booking.company}
                    </p>
                    {booking.specialRequests && (
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-medium">Requests:</span>{" "}
                        {booking.specialRequests}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add approval notes (optional)..."
                      value={reviewNotes[booking.id] || ""}
                      onChange={(e) =>
                        setReviewNotes((prev) => ({
                          ...prev,
                          [booking.id]: e.target.value,
                        }))
                      }
                      className="min-h-[60px]"
                    />

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(booking.id)}
                        disabled={
                          processingId === booking.id ||
                          currentUser?.role !== "supervisor"
                        }
                        size="sm"
                        className="flex-1"
                      >
                        {processingId === booking.id ? (
                          "Approving..."
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Approve & Complete
                          </>
                        )}
                      </Button>
                      {currentUser?.role !== "supervisor" && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Shield className="w-3 h-3 mr-1" />
                          Supervisor access required
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
