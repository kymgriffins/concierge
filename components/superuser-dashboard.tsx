"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
// Removed db-adapter imports - using API routes instead
import { BookingCreationModal } from "./booking-creation-modal";
import { BookingDetailView } from "./booking-detail-view";
import { AssignmentModal } from "./assignment-modal";

interface DashboardStats {
  totalBookings: number;
  unassignedBookings: number;
  todayBookings: number;
  totalServices: number;
  totalTravelers: number;
  totalAgents: number;
  completedBookings: number;
  totalEarnings: number;
  monthlyEarnings: number;
  customersServiced: number;
  completionPercentage: number;
  missedBookings?: number;
}

interface AgentWorkload {
  id: string;
  name: string;
  active_bookings: number;
  urgent_bookings: number;
  avg_booking_age_hours: number;
}

interface SLAViolation {
  id: string;
  traveler_name: string;
  service_name: string;
  created_at: string;
  age_hours: number;
  agent_name: string;
}

interface BookingStreamItem {
  id: string;
  traveler_name: string;
  service_name: string;
  status: string;
  created_at: string;
  assigned_agent_profile_id: string | null;
  agent_name?: string;
}

export function SuperuserDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [agentWorkload, setAgentWorkload] = useState<AgentWorkload[]>([]);
  const [slaViolations, setSlaViolations] = useState<SLAViolation[]>([]);
  const [bookingStream, setBookingStream] = useState<BookingStreamItem[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsResult, workloadResult, slaResult, bookingsResult] = await Promise.allSettled([
        fetch("/api/dashboard-stats").then(r => r.ok ? r.json() : Promise.reject(r.status)),
        // TODO: Create API routes for agent workload and SLA violations
        Promise.resolve([]), // Placeholder for agent workload
        Promise.resolve([]), // Placeholder for SLA violations
        fetch("/api/bookings").then(r => r.ok ? r.json() : Promise.reject(r.status)),
      ]);

      if (statsResult.status === 'fulfilled') {
        setStats(statsResult.value);
      }

      if (workloadResult.status === 'fulfilled') {
        setAgentWorkload(workloadResult.value);
      }

      if (slaResult.status === 'fulfilled') {
        setSlaViolations(slaResult.value);
      }

      if (bookingsResult.status === 'fulfilled') {
        const rawBookings = bookingsResult.value?.bookings ?? [];
        const processedBookings = rawBookings.slice(0, 20).map((b: any) => ({
          id: b.id,
          traveler_name: b.traveler_name || 'Unknown',
          service_name: b.service_name || 'Unknown Service',
          status: b.status,
          created_at: b.created_at,
          assigned_agent_profile_id: b.assigned_agent_profile_id,
          agent_name: b.agent_name,
        }));
        setBookingStream(processedBookings);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.showToast({
        title: "Failed to load dashboard",
        description: "Could not fetch dashboard data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    try {
      await loadDashboardData();
      toast.showToast({
        title: "Dashboard refreshed",
        description: "Data updated successfully",
        type: "success",
      });
    } catch (error) {
      toast.showToast({
        title: "Refresh failed",
        description: "Failed to update dashboard data",
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

  const getPriorityColor = (ageHours: number) => {
    if (ageHours > 48) return 'border-l-4 border-red-500';
    if (ageHours > 24) return 'border-l-4 border-yellow-500';
    return '';
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-4">
            <div className="h-64 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-96 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-64 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh and create booking */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Operations Dashboard</h1>
          <p className="text-muted-foreground">Staff-only concierge & booking orchestration</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refresh}>
            Refresh
          </Button>
          <Button onClick={() => setShowBookingModal(true)}>
            Create Booking
          </Button>
        </div>
      </div>

      {/* Summary Bar - Always Visible */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total bookings in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.unassignedBookings || 0}</div>
            <p className="text-xs text-muted-foreground">
              Need assignment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{slaViolations.length}</div>
            <p className="text-xs text-muted-foreground">
              SLA violations {'>'}24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agents Online</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentWorkload.length}</div>
            <p className="text-xs text-muted-foreground">
              Active staff
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Layout - 3 Columns */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* LEFT - BOOKING STREAM */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Stream</CardTitle>
              <CardDescription>Live operational feed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {bookingStream.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${getPriorityColor(
                    (new Date().getTime() - new Date(booking.created_at).getTime()) / (1000 * 60 * 60)
                  )}`}
                  onClick={() => setSelectedBooking(booking.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{booking.traveler_name}</span>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>{booking.service_name}</div>
                    <div>{booking.agent_name ? `Agent: ${booking.agent_name}` : 'Unassigned'}</div>
                    <div>{new Date(booking.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
              {bookingStream.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No bookings in stream
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* CENTER - BOOKING DETAIL VIEW */}
        <div className="space-y-4">
          {selectedBooking ? (
            <BookingDetailView
              bookingId={selectedBooking}
              onAssign={() => setShowAssignmentModal(true)}
              onClose={() => setSelectedBooking(null)}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>Select a booking to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  Click on a booking in the stream to view its details here
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT - CONTROL & ASSIGNMENT PANEL */}
        <div className="space-y-4">
          {/* Agent Workload */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Workload</CardTitle>
              <CardDescription>Current distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {agentWorkload.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium text-sm">{agent.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {agent.active_bookings} active, {agent.urgent_bookings} urgent
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{agent.active_bookings}</div>
                    <div className="text-xs text-muted-foreground">
                      {agent.avg_booking_age_hours?.toFixed(1)}h avg
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* SLA Violations */}
          {slaViolations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">SLA Violations</CardTitle>
                <CardDescription>Bookings exceeding 24h</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {slaViolations.slice(0, 5).map((violation) => (
                  <div key={violation.id} className="p-2 border border-red-200 rounded bg-red-50">
                    <div className="font-medium text-sm">{violation.traveler_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {violation.service_name} • {violation.age_hours.toFixed(1)}h old
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Agent: {violation.agent_name || 'Unassigned'}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <BookingCreationModal
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSuccess={() => {
          setShowBookingModal(false);
          refresh();
        }}
      />

      {selectedBooking && (
        <AssignmentModal
          open={showAssignmentModal}
          bookingId={selectedBooking}
          onClose={() => setShowAssignmentModal(false)}
          onSuccess={() => {
            setShowAssignmentModal(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}
