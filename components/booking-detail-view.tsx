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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { getBookingWithDetails, getActivityLogs, updateBookingById, createActivityLog } from "@/lib/db-adapter";

interface BookingDetailViewProps {
  bookingId: string;
  onAssign: () => void;
  onClose: () => void;
}

interface BookingDetails {
  id: string;
  traveler_name: string;
  traveler_email: string;
  traveler_phone: string;
  service_name: string;
  service_icon: string;
  flight_date: string;
  flight_number: string;
  airport: string;
  flight_type: string;
  special_requests: string;
  status: string;
  created_at: string;
  updated_at: string;
  creator_name: string;
  agent_name: string;
  last_action: string;
  last_message: string;
  last_activity_at: string;
}

interface ActivityLog {
  id: string;
  action: string;
  message: string;
  created_at: string;
  actor_name: string;
}

export function BookingDetailView({ bookingId, onAssign, onClose }: BookingDetailViewProps) {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    setLoading(true);
    try {
      const [bookingResult, logsResult] = await Promise.all([
        getBookingWithDetails(bookingId),
        getActivityLogs(bookingId, 10),
      ]);

      if (bookingResult) {
        setBooking(bookingResult);
      }
      setActivityLogs(logsResult);
    } catch (error) {
      console.error("Error loading booking details:", error);
      toast.showToast({
        title: "Failed to load booking details",
        description: "Please try again",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string, message: string) => {
    try {
      await updateBookingById(bookingId, { status: newStatus });

      // Create activity log
      await createActivityLog({
        bookingId,
        actorProfileId: 'superuser', // Should come from auth context
        action: 'status_update',
        message,
        meta: { old_status: booking?.status, new_status: newStatus },
      });

      toast.showToast({
        title: "Status updated",
        description: `Booking status changed to ${newStatus.replace('_', ' ')}`,
        type: "success",
      });

      loadBookingDetails(); // Refresh data
    } catch (error) {
      console.error("Error updating status:", error);
      toast.showToast({
        title: "Failed to update status",
        description: "Please try again",
        type: "error",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created': return 'bg-gray-100 text-gray-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'waiting': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!booking) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booking Not Found</CardTitle>
          <CardDescription>The requested booking could not be found</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onClose}>Close</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{booking.traveler_name}</h3>
          <p className="text-sm text-muted-foreground">
            Created {new Date(booking.created_at).toLocaleDateString()} by {booking.creator_name}
          </p>
        </div>
        <div className="flex gap-2">
          {booking.status === 'created' && (
            <Button onClick={onAssign}>
              Assign Agent
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Status and Actions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Status</CardTitle>
            <Badge className={getStatusColor(booking.status)}>
              {booking.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {booking.status === 'assigned' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateStatus('in_progress', 'Started working on booking')}
              >
                Start Work
              </Button>
            )}
            {booking.status === 'in_progress' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus('waiting', 'Waiting for external dependency')}
                >
                  Mark Waiting
                </Button>
                <Button
                  size="sm"
                  onClick={() => updateStatus('completed', 'Booking completed successfully')}
                >
                  Complete
                </Button>
              </>
            )}
            {booking.status === 'waiting' && (
              <Button
                size="sm"
                onClick={() => updateStatus('in_progress', 'Resumed work on booking')}
              >
                Resume Work
              </Button>
            )}
            {booking.status !== 'completed' && booking.status !== 'cancelled' && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => updateStatus('cancelled', 'Booking cancelled by superuser')}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Client</label>
              <p className="text-sm text-muted-foreground">{booking.traveler_name}</p>
              <p className="text-sm text-muted-foreground">{booking.traveler_email}</p>
              {booking.traveler_phone && (
                <p className="text-sm text-muted-foreground">{booking.traveler_phone}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Service</label>
              <p className="text-sm text-muted-foreground">{booking.service_name}</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Flight</label>
              <p className="text-sm text-muted-foreground">
                {booking.flight_number} on {new Date(booking.flight_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {booking.flight_type} • {booking.airport}
              </p>
            </div>

            {booking.agent_name && (
              <div>
                <label className="text-sm font-medium">Assigned Agent</label>
                <p className="text-sm text-muted-foreground">{booking.agent_name}</p>
              </div>
            )}
          </div>

          {booking.special_requests && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium">Special Requests</label>
                <p className="text-sm text-muted-foreground">{booking.special_requests}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activityLogs.length > 0 ? (
              activityLogs.map((log) => (
                <div key={log.id} className="flex gap-3">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{log.actor_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No activity logs yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}