"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

import { useToast } from "@/components/ui/toast";

interface Booking {
  id: string;
  passengerName?: string;
  flightNumber?: string;
  airline?: string;
  date?: string;
  time?: string;
  status?: "new" | "contacted" | "confirmed" | "in_progress" | "completed" | "pending_review" | "cancelled" | "pending";
  serviceId?: string;
  company?: string;
  phone?: string;
  email?: string;
  terminal?: string;
  passengerCount?: number;
  source?: "email" | "whatsapp" | "call" | "app" | "sms";
  specialRequests?: string;
}

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  price?: number;
  active: boolean;
}

export default function NewBookingPage() {
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<Booking>>({});
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    loadServiceOptions();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare payload for database API
      const payload: any = {
        traveler_name: form.passengerName || "",
        traveler_email: form.email || "",
        traveler_phone: form.phone || "",
        flight_number: form.flightNumber || "",
        flight_date: form.date || new Date().toISOString().split("T")[0],
        flight_time: form.time || null,
        airport: form.terminal || "",
        flight_type: "arrival",
        special_requests: form.specialRequests || "",
        status: (form.status as Booking["status"]) || "pending",
        service_id: form.serviceId || null,
        communication_channel: (form.source as Booking["source"]) || "manual",
      };

      // Post to real database API
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create booking");
      }

      const result = await response.json();
      toast.showToast({
        title: "Booking created",
        description: `Booking for ${payload.traveler_name} created successfully`,
        type: "success",
      });

      // Redirect to bookings list
      router.push("/admin/bookings");
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.showToast({
        title: "Create failed",
        description: String(error),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Create New Booking</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Add a new booking to the system
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/bookings")}
        >
          Back to Bookings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>
            Fill in the booking information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Passenger name *"
                value={form.passengerName || ""}
                onChange={(e) =>
                  setForm({ ...form, passengerName: e.target.value })
                }
                required
              />
              <Input
                placeholder="Company"
                value={form.company || ""}
                onChange={(e) =>
                  setForm({ ...form, company: e.target.value })
                }
              />
              <Input
                placeholder="Phone *"
                value={form.phone || ""}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={form.email || ""}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
              <Input
                placeholder="Flight number *"
                value={form.flightNumber || ""}
                onChange={(e) =>
                  setForm({ ...form, flightNumber: e.target.value })
                }
                required
              />
              <Input
                placeholder="Airline *"
                value={form.airline || ""}
                onChange={(e) =>
                  setForm({ ...form, airline: e.target.value })
                }
                required
              />
              <DatePicker
                value={form.date || null}
                onChange={(d) => setForm({ ...form, date: d || "" })}
                placeholder="Select date *"
              />
              <TimePicker
                value={form.time || null}
                onChange={(t) => setForm({ ...form, time: t || "" })}
                placeholder="Select time *"
              />
              <Input
                placeholder="Terminal"
                value={form.terminal || ""}
                onChange={(e) =>
                  setForm({ ...form, terminal: e.target.value })
                }
              />
              <Input
                type="number"
                min={1}
                placeholder="Passengers"
                value={form.passengerCount?.toString() || "1"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    passengerCount: Number(e.target.value),
                  })
                }
              />
              <Select
                value={form.status || "new"}
                onValueChange={(val: string) =>
                  setForm({ ...form, status: val as Booking["status"] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={form.source || "email"}
                onValueChange={(val: string) =>
                  setForm({ ...form, source: val as Booking["source"] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="app">App</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Service *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {serviceOptions
                  .filter((opt) => opt.active)
                  .map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="service"
                        value={opt.id}
                        checked={form.serviceId === opt.id}
                        onChange={(e) =>
                          setForm({ ...form, serviceId: e.target.value })
                        }
                        required
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{opt.icon}</span>
                          <span className="text-sm font-medium">
                            {opt.name}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {opt.description}
                        </p>
                        <p className="text-xs font-semibold text-primary mt-1">
                          ${opt.price}
                        </p>
                      </div>
                    </label>
                  ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Special Requests
              </label>
              <Input
                placeholder="Any special requests or notes"
                value={form.specialRequests || ""}
                onChange={(e) =>
                  setForm({ ...form, specialRequests: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Booking"}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/admin/bookings")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
