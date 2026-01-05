"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  ArrowLeft,
  Plane,
  Calendar,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  FileText,
  Activity,
} from "lucide-react";

import ClientAPI, {
  Booking,
  ActivityLog,
} from "@/lib/client-api";
import { formatDateTimeUTC, formatDateUTC } from "@/lib/utils";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [serviceOptions, setServiceOptions] = useState<{
    id: string;
    name: string;
    description: string;
    icon: string;
    price?: number;
    active: boolean;
  }[]>([]);
  const [agents, setAgents] = useState<{
    id: string;
    name?: string;
    email?: string;
  }[]>([]);
  const toast = useToast();

  useEffect(() => {
    loadBooking();
    loadServiceOptions();
    loadAgents();
  }, [id]);

  const loadBooking = async () => {
    try {
      const bookingData = await ClientAPI.getBookingById(id);
      if (bookingData) {
        const transformedBooking = {
          ...bookingData,
          passengerName: bookingData.traveler_name || "",
          email: bookingData.traveler_email || "",
          phone: bookingData.traveler_phone || "",
          flightNumber: bookingData.flight_number || "",
          airline: bookingData.airline || "",
          date: bookingData.flight_date || "",
          time: bookingData.flight_time || bookingData.time || "",
          terminal: bookingData.airport || "",
          serviceId: bookingData.service_id || "",
          specialRequests: bookingData.special_requests || "",
          source: bookingData.communication_channel || "manual",
          createdAt: bookingData.created_at || new Date().toISOString(),
          updatedAt: bookingData.updated_at || new Date().toISOString(),
          createdBy: bookingData.created_by || "",
          assignedAgentId: bookingData.assigned_agent_profile_id || null,
          travelerProfileId: bookingData.traveler_profile_id || null,
        };
        setBooking(transformedBooking);
      }
    } catch (error) {
      console.error("Error loading booking:", error);
      toast.showToast({
        title: "Error",
        description: "Failed to load booking details",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadServiceOptions = async () => {
    try {
      const response = await fetch("/api/services");
      if (!response.ok) return;
      const result = await response.json();
      setServiceOptions(
        result.services.map((o: any) => ({
          id: o.id,
          name: o.name,
          description: o.description,
          icon: o.icon,
          price: o.price,
          active: o.active,
        })),
      );
    } catch (error) {
      console.error("Error loading service options:", error);
    }
  };

  const loadAgents = async () => {
    try {
      const response = await fetch("/api/agents");
      if (!response.ok) return;
      const result = await response.json();
      setAgents(result.agents);
    } catch (error) {
      console.error("Error loading agents:", error);
    }
  };

  const handleStatusChange = async (newStatus: Booking["status"]) => {
    if (!booking) return;
    setUpdating(true);
    try {
      await ClientAPI.updateBooking(booking.id, { status: newStatus });
      setBooking({ ...booking, status: newStatus });
      toast.showToast({
        title: "Status Updated",
        description: `Booking status changed to ${newStatus.replace("_", " ")}`,
        type: "success",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast.showToast({
        title: "Update Failed",
        description: "Failed to update booking status",
        type: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "new":
        return "default";
      case "contacted":
        return "secondary";
      case "confirmed":
        return "outline";
      case "in_progress":
        return "destructive";
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getServiceName = (serviceId: string) => {
    const serviceNames: Record<string, string> = {
      "arrival": "Airport Arrival Assistance",
      "departure": "Airport Departure Assistance",
      "transit": "Airport Transit Assistance",
      "vip": "VIP Airport Services",
      "business": "Business Class Services",
      "group": "Group Travel Services"
    };
    return serviceNames[serviceId] || serviceId.charAt(0).toUpperCase() + serviceId.slice(1);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-muted rounded" />
              <div className="h-48 bg-muted rounded" />
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-muted rounded" />
              <div className="h-48 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Status Change Actions */}
        <div className="flex gap-2">
          {booking.status !== "completed" && booking.status !== "cancelled" && (
            <>
              <Button
                onClick={() => handleStatusChange("completed")}
                disabled={updating}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {updating ? "Updating..." : "Complete Booking"}
              </Button>
              <Button
                onClick={() => handleStatusChange("cancelled")}
                disabled={updating}
                variant="destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Booking
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Booking Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Plane className="h-8 w-8" />
            {booking.passengerName}
          </h1>
          <p className="text-muted-foreground text-lg">
            {booking.flightNumber} • {booking.airline} • Terminal {booking.terminal}
          </p>
        </div>
        <Badge variant={getStatusColor(booking.status)} className="text-lg px-4 py-2">
          {booking.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Passenger & Flight Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Passenger & Flight Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Passenger Name</label>
                  <p className="text-lg font-medium">{booking.passengerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Company</label>
                  <p className="text-lg">{booking.company || "Individual"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Phone</label>
                  <p className="flex items-center gap-2 text-lg">
                    <Phone className="h-4 w-4" />
                    {booking.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Email</label>
                  <p className="flex items-center gap-2 text-lg">
                    <Mail className="h-4 w-4" />
                    {booking.email}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">Flight</label>
                    <p className="flex items-center gap-2 text-lg">
                      <Plane className="h-4 w-4" />
                      {booking.flightNumber} - {booking.airline}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">Service Date & Time</label>
                    <p className="flex items-center gap-2 text-lg">
                      <Calendar className="h-4 w-4" />
                      {formatDateUTC(booking.date)} at {booking.time}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">Location</label>
                    <p className="flex items-center gap-2 text-lg">
                      <MapPin className="h-4 w-4" />
                      Terminal {booking.terminal}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">Service Type</label>
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {serviceOptions.find((s) => s.id === booking.serviceId)?.name ||
                        getServiceName(booking.serviceId || "")}
                    </Badge>
                  </div>
                </div>
              </div>

              {booking.specialRequests && (
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Special Requests</label>
                  <p className="text-base bg-muted p-4 rounded-lg">{booking.specialRequests}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Status Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Created</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDateTimeUTC(booking.createdAt || "")}
                  </span>
                </div>

                {booking.status !== "new" && (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium capitalize">
                        {booking.status.replace("_", " ")}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDateTimeUTC(booking.updatedAt || "")}
                    </span>
                  </div>
                )}

                {booking.status === "completed" && (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Completed</span>
                    </div>
                    <span className="text-sm text-green-700">
                      Service delivered successfully
                    </span>
                  </div>
                )}

                {booking.status === "cancelled" && (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-800">Cancelled</span>
                    </div>
                    <span className="text-sm text-red-700">
                      Booking was cancelled
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          {booking.status !== "completed" && booking.status !== "cancelled" && (
            <Card className="border-2 border-dashed">
              <CardHeader>
                <CardTitle className="text-center">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleStatusChange("completed")}
                  disabled={updating}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  {updating ? "Completing..." : "Mark as Completed"}
                </Button>
                <Button
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={updating}
                  variant="destructive"
                  className="w-full"
                  size="lg"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Cancel Booking
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Audit Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Audit Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">Created By</label>
                <p className="text-sm">
                  {agents.find((a) => a.id === booking.createdBy)?.name || booking.createdBy || "Unknown"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">Created</label>
                <p className="text-sm">{formatDateTimeUTC(booking.createdAt || "")}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">Last Modified By</label>
                <p className="text-sm">
                  {agents.find((a) => a.id === booking.assignedAgentId)?.name || "System"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">Last Updated</label>
                <p className="text-sm">{formatDateTimeUTC(booking.updatedAt || "")}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">Source</label>
                <Badge variant="outline">{booking.source}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Service Fee</span>
                <span className="text-lg font-bold">${booking.serviceFee}</span>
              </div>
              {(booking.additionalCharges && booking.additionalCharges > 0) && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Additional Charges</span>
                  <span className="text-sm">${booking.additionalCharges}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-sm font-medium">Total</span>
                <span className="text-xl font-bold text-green-600">
                  ${booking.totalRevenue || booking.serviceFee}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
