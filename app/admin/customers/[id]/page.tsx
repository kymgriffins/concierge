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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MockAPI, Customer, Booking } from "@/lib/mock-api";
import { useToast } from "@/components/ui/toast";
import { formatDateUTC } from "@/lib/utils";
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Trash2,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
} from "lucide-react";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Customer>>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const toast = useToast();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [customerData, bookingsData] = await Promise.all([
        MockAPI.getCustomerById(id),
        MockAPI.getBookings(),
      ]);

      if (customerData) {
        setCustomer(customerData);
        setForm(customerData);
      }
      // Filter bookings for this customer
      setBookings(
        bookingsData.filter(
          (booking: Booking) =>
            booking.passengerName === customerData?.name ||
            booking.email === customerData?.email,
        ),
      );
    } catch (error) {
      console.error("Error loading customer:", error);
      toast.showToast({
        title: "Error",
        description: "Failed to load customer details",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!customer) return;
    setSaving(true);
    try {
      await MockAPI.updateCustomer(customer.id, form as Partial<Customer>);
      setCustomer({ ...customer, ...form });
      setEditing(false);
      toast.showToast({
        title: "Updated",
        description: "Customer updated successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.showToast({
        title: "Update failed",
        description: String(error),
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: Customer["status"]) => {
    if (!customer) return;
    try {
      await MockAPI.updateCustomer(customer.id, { status: newStatus });
      setCustomer({ ...customer, status: newStatus });
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
    }
  };

  const handleDelete = async () => {
    if (!customer || !confirm("Are you sure you want to delete this customer?"))
      return;
    try {
      await MockAPI.deleteCustomer(customer.id);
      toast.showToast({
        title: "Deleted",
        description: "Customer deleted successfully",
        type: "success",
      });
      router.push("/admin/customers");
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.showToast({
        title: "Delete failed",
        description: String(error),
        type: "error",
      });
    }
  };

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

  if (!customer) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Customer not found</h1>
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
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Customer Details</h1>
            <p className="text-muted-foreground">
              ID: {customer.id} • {customer.name}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
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
          {editing && (
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save"}
            </Button>
          )}
          <Button onClick={handleDelete} variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  {editing ? (
                    <Input
                      value={form.name || ""}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-lg font-medium">{customer.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Company
                  </label>
                  {editing ? (
                    <Input
                      value={form.company || ""}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                    />
                  ) : (
                    <p>{customer.company}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  {editing ? (
                    <Input
                      value={form.email || ""}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  ) : (
                    <p>{customer.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  {editing ? (
                    <Input
                      value={form.phone || ""}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  ) : (
                    <p>{customer.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  {editing ? (
                    <Input
                      value={form.role || ""}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                    />
                  ) : (
                    <p>{customer.role}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  {editing ? (
                    <Select
                      value={form.status || customer.status}
                      onValueChange={(val) =>
                        setForm({ ...form, status: val as Customer["status"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      variant={
                        customer.status === "active" ? "default" : "secondary"
                      }
                    >
                      {customer.status}
                    </Badge>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Total Bookings
                  </label>
                  {editing ? (
                    <Input
                      type="number"
                      value={form.totalBookings?.toString() || "0"}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          totalBookings: Number(e.target.value),
                        })
                      }
                    />
                  ) : (
                    <p className="font-semibold">{customer.totalBookings}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Booking Date
                  </label>
                  {editing ? (
                    <Input
                      value={form.lastBookingDate || ""}
                      onChange={(e) =>
                        setForm({ ...form, lastBookingDate: e.target.value })
                      }
                    />
                  ) : (
                    <p>
                      {customer.lastBookingDate
                        ? formatDateUTC(customer.lastBookingDate)
                        : "Never"}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                {editing ? (
                  <Textarea
                    value={form.notes || ""}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-sm">{customer.notes || "No notes"}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Bookings ({bookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length > 0 ? (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {booking.flightNumber} - {booking.airline}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateUTC(booking.date)} at {booking.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">
                          {booking.status.replace("_", " ")}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={() =>
                            router.push(`/admin/bookings/${booking.id}`)
                          }
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                  {bookings.length > 5 && (
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      And {bookings.length - 5} more bookings...
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No bookings found for this customer
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.email}
                  </p>
                </div>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.phone}
                    </p>
                  </div>
                </div>
              )}
              {customer.company && (
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Company</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.company}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  handleStatusChange(
                    customer.status === "active" ? "inactive" : "active",
                  )
                }
              >
                {customer.status === "active" ? "Deactivate" : "Activate"}{" "}
                Customer
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  router.push(`/admin/conversations?customer=${customer.id}`)
                }
              >
                View Conversations
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  router.push(`/admin/bookings?customer=${customer.id}`)
                }
              >
                View All Bookings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
