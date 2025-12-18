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
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/ui/date-picker";
import TimePicker from "@/components/ui/time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  MockAPI,
  Booking,
  RosterShift,
  Agent,
  ActivityLog,
} from "@/lib/mock-api";
import { useToast } from "@/components/ui/toast";
import { formatDateUTC, formatDateTimeUTC, formatRelativeTime } from "@/lib/utils";
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Trash2,
  UserCheck,
  Calendar,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Phone,
  Mail,
  Plane,
  MapPin,
  DollarSign,
  Timer,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Star,
  MessageSquare,
  FileText,
  BarChart3,
  Target,
} from "lucide-react";
import Link from "next/link";
import { ServiceLifecycleManager } from "@/components/service-lifecycle-manager";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Booking>>({});
  const [shifts, setShifts] = useState<RosterShift[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [serviceOptions, setServiceOptions] = useState<
    {
      id: string;
      name: string;
      description: string;
      icon: string;
      price?: number;
      active: boolean;
    }[]
  >([]);
  const [permissions, setPermissions] = useState<{
    canCreateBooking?: boolean;
    canDeleteBooking?: boolean;
    canUpdateBooking?: boolean;
  } | null>(null);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityLog | null>(
    null,
  );
  const [activityForm, setActivityForm] = useState({
    action: "",
    user: "",
    details: "",
  });
  const toast = useToast();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        bookingData,
        shiftsData,
        agentsData,
        logsData,
        servicesData,
        perms,
      ] = await Promise.all([
        MockAPI.getBookingById(id),
        MockAPI.getAvailableShiftsForDate(
          new Date().toISOString().split("T")[0],
        ),
        MockAPI.getAgents(),
        MockAPI.getActivityLogs(100),
        MockAPI.getServiceOptions(),
        MockAPI.getPermissions(),
      ]);

      if (bookingData) {
        setBooking(bookingData);
        setForm(bookingData);
      }
      setShifts(shiftsData);
      setAgents(agentsData);
      setActivityLogs(
        logsData.filter((log: ActivityLog) => log.bookingId === id),
      );
      setServiceOptions(
        servicesData.map((o: any) => ({
          id: o.id,
          name: o.name,
          description: o.description,
          icon: o.icon,
          price: o.price,
          active: o.active,
        })),
      );
      setPermissions(perms);
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

  const handleSave = async () => {
    if (!booking) return;
    setSaving(true);
    try {
      await MockAPI.updateBooking(booking.id, form as Partial<Booking>);
      await MockAPI.createActivityLog({
        bookingId: booking.id,
        action: "Booking Updated",
        user: "Staff",
        details: `Booking updated`,
      });
      setBooking({ ...booking, ...form });
      setEditing(false);
      toast.showToast({
        title: "Updated",
        description: "Booking updated successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.showToast({
        title: "Update failed",
        description: String(error),
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: Booking["status"]) => {
    if (!booking) return;
    try {
      await MockAPI.updateBooking(booking.id, { status: newStatus });
      await MockAPI.createActivityLog({
        bookingId: booking.id,
        action: "Status changed",
        user: "Staff",
        details: `Status changed to ${newStatus}`,
      });
      setBooking({ ...booking, status: newStatus });
      toast.showToast({
        title: "Status updated",
        description: `Status changed to ${newStatus}`,
        type: "success",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast.showToast({
        title: "Update failed",
        description: String(error),
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAssignShift = async (shiftId: string) => {
    if (!booking) return;
    try {
      await MockAPI.assignBookingToShift(booking.id, shiftId);
      await MockAPI.createActivityLog({
        bookingId: booking.id,
        action: "Assigned to shift",
        user: "Staff",
        details: `Assigned to shift ${shiftId}`,
      });
      const updated = await MockAPI.getBookingById(id);
      setBooking(updated);
      toast.showToast({
        title: "Assigned",
        description: "Booking assigned to shift",
        type: "success",
      });
    } catch (error) {
      console.error("Error assigning shift:", error);
      toast.showToast({
        title: "Assignment failed",
        description: String(error),
        type: "error",
      });
    }
  };

  const handleDelete = async () => {
    if (!booking || !confirm("Are you sure you want to delete this booking?"))
      return;
    try {
      await MockAPI.deleteBooking(booking.id);
      await MockAPI.createActivityLog({
        bookingId: booking.id,
        action: "Booking Deleted",
        user: "Staff",
        details: `Booking ${booking.id} deleted`,
      });
      toast.showToast({
        title: "Deleted",
        description: "Booking deleted successfully",
        type: "success",
      });
      router.push("/admin/bookings");
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.showToast({
        title: "Delete failed",
        description: String(error),
        type: "error",
      });
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    try {
      await MockAPI.createActivityLog({
        bookingId: booking.id,
        action: activityForm.action,
        user: activityForm.user || "Staff",
        details: activityForm.details,
      });
      setActivityForm({ action: "", user: "", details: "" });
      setShowAddActivity(false);
      await loadData(); // Reload to get updated logs
      toast.showToast({
        title: "Added",
        description: "Activity log added successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding activity log:", error);
      toast.showToast({
        title: "Add failed",
        description: String(error),
        type: "error",
      });
    }
  };

  const handleEditActivity = (log: ActivityLog) => {
    setEditingActivity(log);
    setActivityForm({
      action: log.action,
      user: log.user,
      details: log.details,
    });
    setShowAddActivity(true);
  };

  const handleUpdateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity || !booking) return;
    try {
      // Note: MockAPI might not have updateActivityLog, so we'll delete and create new
      await MockAPI.deleteActivityLog(editingActivity.id);
      await MockAPI.createActivityLog({
        bookingId: booking.id,
        action: activityForm.action,
        user: activityForm.user,
        details: activityForm.details,
      });
      setActivityForm({ action: "", user: "", details: "" });
      setEditingActivity(null);
      setShowAddActivity(false);
      await loadData();
      toast.showToast({
        title: "Updated",
        description: "Activity log updated successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating activity log:", error);
      toast.showToast({
        title: "Update failed",
        description: String(error),
        type: "error",
      });
    }
  };

  const handleDeleteActivity = async (logId: string) => {
    if (!confirm("Are you sure you want to delete this activity log?")) return;
    try {
      await MockAPI.deleteActivityLog(logId);
      await loadData();
      toast.showToast({
        title: "Deleted",
        description: "Activity log deleted successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting activity log:", error);
      toast.showToast({
        title: "Delete failed",
        description: String(error),
        type: "error",
      });
    }
  };

  const resetActivityForm = () => {
    setActivityForm({ action: "", user: "", details: "" });
    setEditingActivity(null);
    setShowAddActivity(false);
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
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Alert for upcoming bookings
  useEffect(() => {
    if (
      booking &&
      booking.status !== "completed" &&
      booking.status !== "cancelled"
    ) {
      const bookingTime = new Date(`${booking.date}T${booking.time}`);
      const now = new Date();
      const timeDiff = bookingTime.getTime() - now.getTime();
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

      if (daysDiff <= 1 && daysDiff > 0) {
        toast.showToast({
          title: "Upcoming Booking Alert",
          description: `Booking for ${booking.passengerName} (${booking.flightNumber}) is in ${Math.ceil(daysDiff * 24)} hours`,
          type: "info",
        });
      } else if (daysDiff <= 0 && booking.status === "new") {
        toast.showToast({
          title: "Overdue Booking",
          description: `Booking for ${booking.passengerName} (${booking.flightNumber}) has passed scheduled time`,
          type: "error",
        });
      }
    }
  }, [booking, toast]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
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

  const assignedShift = shifts.find((s) => s.id === booking.shiftId);
  const assignedAgent = agents.find((a) => a.id === booking.assignedAgentId);

  // Calculate insights based on dates
  const createdAt = new Date(booking.createdAt);
  const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
  const now = new Date();

  const daysSinceCreated = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilBooking = Math.floor((bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const hoursUntilBooking = Math.floor((bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60));

  const isOverdue = bookingDateTime < now && booking.status !== "completed" && booking.status !== "cancelled";
  const isUpcoming = daysUntilBooking <= 7 && daysUntilBooking >= 0;
  const isToday = daysUntilBooking === 0;

  // Status-based insights and UI
  const getStatusInsights = () => {
    switch (booking.status) {
      case "new":
        return {
          title: "New Booking - Requires Attention",
          icon: AlertCircle,
          color: "text-orange-600",
          bgColor: "bg-orange-50 border-orange-200",
          insights: [
            `Created ${daysSinceCreated} days ago`,
            daysUntilBooking > 0 ? `${daysUntilBooking} days until service` : "Service date has passed",
            "Passenger needs to be contacted",
            "Assignment required"
          ],
          actions: ["Contact Passenger", "Assign to Agent", "Confirm Details"]
        };
      case "contacted":
        return {
          title: "Passenger Contacted - Awaiting Confirmation",
          icon: Phone,
          color: "text-blue-600",
          bgColor: "bg-blue-50 border-blue-200",
          insights: [
            `Created ${daysSinceCreated} days ago`,
            daysUntilBooking > 0 ? `${daysUntilBooking} days until service` : "Service date has passed",
            "Initial contact made",
            "Waiting for passenger confirmation"
          ],
          actions: ["Send Confirmation Reminder", "Update Contact Notes", "Assign Agent"]
        };
      case "confirmed":
        return {
          title: "Booking Confirmed - Ready for Service",
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50 border-green-200",
          insights: [
            `Created ${daysSinceCreated} days ago`,
            daysUntilBooking > 0 ? `${daysUntilBooking} days until service` : "Service date has passed",
            "All details confirmed",
            "Agent assignment recommended"
          ],
          actions: ["Assign to Shift", "Prepare Service Kit", "Send Pre-Service Info"]
        };
      case "in_progress":
        return {
          title: "Service In Progress - Active Support",
          icon: Clock,
          color: "text-purple-600",
          bgColor: "bg-purple-50 border-purple-200",
          insights: [
            `Created ${daysSinceCreated} days ago`,
            "Service currently active",
            "Monitor service quality",
            "Track completion status"
          ],
          actions: ["Update Progress", "Handle Issues", "Complete Service"]
        };
      case "completed":
        return {
          title: "Service Completed - Follow Up Required",
          icon: CheckCircle2,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50 border-emerald-200",
          insights: [
            `Created ${daysSinceCreated} days ago`,
            `Service completed ${booking.actualDuration ? `${booking.actualDuration} minutes` : 'duration unknown'}`,
            booking.customerSatisfaction ? `Customer satisfaction: ${booking.customerSatisfaction}/5` : "Satisfaction survey pending",
            "Follow-up recommended"
          ],
          actions: ["Send Satisfaction Survey", "Process Payment", "Schedule Follow-up"]
        };
      case "cancelled":
        return {
          title: "Booking Cancelled",
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50 border-red-200",
          insights: [
            `Created ${daysSinceCreated} days ago`,
            "Booking was cancelled",
            "Review cancellation reason",
            "Consider rebooking opportunity"
          ],
          actions: ["Review Cancellation", "Contact for Rebooking", "Archive Record"]
        };
      default:
        return {
          title: "Booking Status",
          icon: Info,
          color: "text-gray-600",
          bgColor: "bg-gray-50 border-gray-200",
          insights: [`Created ${daysSinceCreated} days ago`],
          actions: []
        };
    }
  };

  const statusInsights = getStatusInsights();
  const StatusIcon = statusInsights.icon;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Plane className="h-6 w-6" />
              {booking.passengerName}
            </h1>
            <p className="text-muted-foreground">
              {booking.flightNumber} • {booking.airline} • Terminal {booking.terminal}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {permissions?.canUpdateBooking && (
            <Button
              onClick={() => setEditing(!editing)}
              variant={editing ? "outline" : "default"}
            >
              {editing ? (
                <X className="h-4 w-4 mr-2" />
              ) : (
                <Edit className="h-4 w-4 mr-2" />
              )}
              {editing ? "Cancel" : "Edit"}
            </Button>
          )}
          {editing && (
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save"}
            </Button>
          )}
          {permissions?.canDeleteBooking && (
            <Button onClick={handleDelete} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Status-Based Insights Card */}
      <Card className={statusInsights.bgColor}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${statusInsights.color}`}>
            <StatusIcon className="h-5 w-5" />
            {statusInsights.title}
          </CardTitle>
          <CardDescription>
            Booking ID: {booking.id} • Created {formatDateTimeUTC(booking.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-xs text-muted-foreground">{daysSinceCreated} days ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Service Date</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateUTC(booking.date)} at {booking.time}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {daysUntilBooking >= 0 ? "Days Until" : "Days Since"}
                </p>
                <p className={`text-xs ${daysUntilBooking < 0 ? "text-red-600" : daysUntilBooking <= 1 ? "text-orange-600" : "text-green-600"}`}>
                  {Math.abs(daysUntilBooking)} days
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Revenue</p>
                <p className="text-xs text-muted-foreground">${booking.totalRevenue || booking.serviceFee}</p>
              </div>
            </div>
          </div>

          {/* Status-specific alerts */}
          {isOverdue && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">This booking is overdue - service date has passed</span>
            </div>
          )}
          {isToday && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">Service is scheduled for today</span>
            </div>
          )}
          {isUpcoming && !isToday && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
              <Calendar className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">Service is coming up in {daysUntilBooking} days</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Key Insights</h4>
              <ul className="space-y-1">
                {statusInsights.insights.map((insight, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recommended Actions</h4>
              <div className="space-y-2">
                {statusInsights.actions.map((action, index) => (
                  <Button key={index} variant="outline" size="sm" className="w-full justify-start">
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Lifecycle Manager */}
      {booking && (
        <ServiceLifecycleManager
          booking={booking}
          onStatusChange={(updatedBooking) => {
            setBooking(updatedBooking);
            loadData();
          }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Passenger & Service Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Passenger & Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Passenger Name</label>
                  {editing ? (
                    <Input
                      value={form.passengerName || ""}
                      onChange={(e) => setForm({ ...form, passengerName: e.target.value })}
                    />
                  ) : (
                    <p className="text-lg font-medium">{booking.passengerName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  {editing ? (
                    <Input
                      value={form.company || ""}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  ) : (
                    <p>{booking.company || "Individual"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  {editing ? (
                    <Input
                      value={form.phone || ""}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  ) : (
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {booking.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  {editing ? (
                    <Input
                      value={form.email || ""}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  ) : (
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {booking.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Flight</label>
                  <p className="flex items-center gap-2">
                    <Plane className="h-4 w-4" />
                    {booking.flightNumber} - {booking.airline}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Service Date & Time</label>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDateUTC(booking.date)} at {booking.time}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Terminal {booking.terminal}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Service Type</label>
                  <Badge variant="outline">
                    {serviceOptions.find((s) => s.id === booking.serviceId)?.name || booking.serviceId}
                  </Badge>
                </div>
              </div>

              {booking.specialRequests && (
                <div>
                  <label className="block text-sm font-medium mb-1">Special Requests</label>
                  <p className="text-sm bg-muted p-3 rounded-lg">{booking.specialRequests}</p>
                </div>
              )}

              {/* Status-specific additional info */}
              {booking.status === "completed" && booking.actualDuration && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium mb-1">Actual Duration</label>
                    <p className="text-lg font-medium">{booking.actualDuration} min</p>
                  </div>
                  {booking.customerSatisfaction && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Satisfaction</label>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < booking.customerSatisfaction! ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="ml-2 text-sm">{booking.customerSatisfaction}/5</span>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Processing Time</label>
                    <p className="text-sm">{booking.processingTime ? `${Math.round(booking.processingTime / 1000 / 60)} min` : "N/A"}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Timeline
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddActivity(true)}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Add Activity
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Add/Edit Activity Form */}
              {(showAddActivity || editingActivity) && (
                <Card className="mb-4">
                  <CardContent className="pt-4">
                    <form
                      onSubmit={
                        editingActivity
                          ? handleUpdateActivity
                          : handleAddActivity
                      }
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Action (e.g., 'Passenger Met', 'Status Updated')"
                          value={activityForm.action}
                          onChange={(e) =>
                            setActivityForm({
                              ...activityForm,
                              action: e.target.value,
                            })
                          }
                          required
                        />
                        <Input
                          placeholder="User (e.g., 'Staff Member A')"
                          value={activityForm.user}
                          onChange={(e) =>
                            setActivityForm({
                              ...activityForm,
                              user: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Textarea
                        placeholder="Details"
                        value={activityForm.details}
                        onChange={(e) =>
                          setActivityForm({
                            ...activityForm,
                            details: e.target.value,
                          })
                        }
                        required
                      />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm">
                          {editingActivity ? "Update Activity" : "Add Activity"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={resetActivityForm}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {activityLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No activity logs yet</p>
                    <p className="text-sm text-muted-foreground">Activities will appear here as the booking progresses</p>
                  </div>
                ) : (
                  activityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 border rounded-lg group hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {log.action}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {log.user}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {log.details}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDateTimeUTC(log.timestamp)}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleEditActivity(log)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteActivity(log.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Priority */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Status & Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Status</label>
                <Badge variant={getStatusColor(booking.status)} className="text-sm px-3 py-1">
                  {booking.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <Badge variant={booking.priority === "high" ? "destructive" : booking.priority === "normal" ? "secondary" : "outline"}>
                  {booking.priority}
                </Badge>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Customer Type</label>
                <Badge variant="outline">{booking.customerType}</Badge>
              </div>

              {/* Quick Status Actions */}
              <div className="pt-4 border-t">
                <label className="block text-sm font-medium mb-2">Quick Actions</label>
                <div className="space-y-2">
                  {booking.status === "new" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStatusChange("contacted")}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Mark as Contacted
                    </Button>
                  )}
                  {booking.status === "contacted" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStatusChange("confirmed")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Booking
                    </Button>
                  )}
                  {booking.status === "confirmed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStatusChange("in_progress")}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Start Service
                    </Button>
                  )}
                  {booking.status === "in_progress" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStatusChange("completed")}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Complete Service
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment & Equipment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Assignment & Equipment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignedAgent ? (
                <div>
                  <p className="text-sm font-medium">Assigned Agent</p>
                  <p className="text-sm">{assignedAgent.name}</p>
                  <p className="text-xs text-muted-foreground">{assignedAgent.role}</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">No agent assigned</p>
                  <Select onValueChange={handleAssignShift}>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {shifts.map((shift) => (
                        <SelectItem key={shift.id} value={shift.id}>
                          {shift.shift} - {agents.find((a) => a.id === shift.agentId)?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {booking.equipmentNeeded && booking.equipmentNeeded.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Equipment Needed</p>
                  <div className="flex flex-wrap gap-1">
                    {booking.equipmentNeeded.map((equipment, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {equipment}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {booking.specialHandling && booking.specialHandling.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Special Handling</p>
                  <div className="flex flex-wrap gap-1">
                    {booking.specialHandling.map((handling, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {handling}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Audit Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Audit Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Created By</p>
                <p className="text-sm text-muted-foreground">
                  {agents.find((a) => a.id === booking.createdBy)?.name || booking.createdBy || "Unknown"}
                </p>
              </div>
              {booking.supervisedBy && (
                <div>
                  <p className="text-sm font-medium">Supervised By</p>
                  <p className="text-sm text-muted-foreground">
                    {agents.find((a) => a.id === booking.supervisedBy)?.name || booking.supervisedBy}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">Created Date</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTimeUTC(booking.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTimeUTC(booking.updatedAt)}
                </p>
              </div>
              {booking.lastModifiedBy && booking.lastModifiedBy !== booking.createdBy && (
                <div>
                  <p className="text-sm font-medium">Last Modified By</p>
                  <p className="text-sm text-muted-foreground">
                    {agents.find((a) => a.id === booking.lastModifiedBy)?.name || booking.lastModifiedBy}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Service Fee</span>
                <span className="text-sm font-medium">${booking.serviceFee}</span>
              </div>
              {(booking.additionalCharges && booking.additionalCharges > 0) && (
                <div className="flex justify-between">
                  <span className="text-sm">Additional Charges</span>
                  <span className="text-sm font-medium">${booking.additionalCharges}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">Total Revenue</span>
                <span className="text-sm font-bold">${booking.totalRevenue || booking.serviceFee}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
