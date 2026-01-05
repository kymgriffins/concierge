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
import { Separator } from "@/components/ui/separator";
import { Booking } from "@/lib/client-api";
import { useToast } from "@/components/ui/toast";

export function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<{
    totalBookings: number;
    pendingBookings: number;
    todayBookings: number;
    totalServices: number;
    totalTravelers: number;
    totalAgents: number;
    completedBookings: number;
    totalEarnings: number;
    monthlyEarnings: number;
    customersServiced: number;
    completionPercentage: number;
  } | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    console.log("Starting loadDashboardData");
    setLoading(true);
    try {
      // Fetch all raw data
      const [bookingsResult, servicesResult, agentsResult] = await Promise.allSettled([
        fetch("/api/bookings").then(r => r.ok ? r.json() : Promise.reject(r.status)),
        fetch("/api/services").then(r => r.ok ? r.json() : Promise.reject(r.status)),
        fetch("/api/agents").then(r => r.ok ? r.json() : Promise.reject(r.status)),
      ]);

      // Process bookings
      let bookings = [];
      if (bookingsResult.status === 'fulfilled') {
        bookings = bookingsResult.value?.bookings ?? [];
        console.log("Fetched bookings:", bookings.length);
      } else {
        console.error("Failed to fetch bookings:", bookingsResult.reason);
        toast.showToast({
          title: "Failed to load bookings",
          description: "Could not fetch booking data",
          type: "error",
        });
      }

      // Process services
      let services = [];
      if (servicesResult.status === 'fulfilled') {
        services = servicesResult.value?.services ?? [];
        console.log("Fetched services:", services.length);
      } else {
        console.error("Failed to fetch services:", servicesResult.reason);
        toast.showToast({
          title: "Failed to load services",
          description: "Could not fetch service data",
          type: "error",
        });
      }

      // Process agents
      let agents: any[] = [];
      if (agentsResult.status === 'fulfilled') {
        agents = agentsResult.value?.agents ?? [];
        console.log("Fetched agents:", agents.length);
      } else {
        console.warn("Failed to fetch agents (expected with Neon Auth setup):", agentsResult.reason);
        // Continue with empty agents array - dashboard will show 0 for user counts
        console.log("Continuing with empty agents data");
      }

      // Calculate stats from raw data
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentMonth = now.toISOString().slice(0, 7);

      const totalBookings = bookings.length;
      const pendingBookings = bookings.filter((b: any) => b.status === 'pending').length;
      const todayBookings = bookings.filter((b: any) => b.created_at?.startsWith(today)).length;
      const totalServices = services.length;
      const totalTravelers = agents.filter((a: any) => a.role === 'traveler').length;
      const totalAgents = agents.filter((a: any) => a.role === 'agent' || a.role === 'super_admin').length;

      const completedBookings = bookings.filter((b: any) => b.status === 'completed').length;
      const cancelledBookings = bookings.filter((b: any) => b.status === 'cancelled').length;

      // Calculate earnings
      const completedBookingsData = bookings.filter((b: any) => b.status === 'completed');
      const totalEarnings = completedBookingsData.reduce((sum: number, booking: any) => {
        const service = services.find((s: any) => s.id === booking.service_id);
        return sum + (Number(service?.price) || 0);
      }, 0);

      const monthlyCompletedBookings = completedBookingsData.filter((booking: any) => {
        const bookingDate = new Date(booking.created_at);
        const bookingMonth = bookingDate.toISOString().slice(0, 7);
        return bookingMonth === currentMonth;
      });

      const monthlyEarnings = monthlyCompletedBookings.reduce((sum: number, booking: any) => {
        const service = services.find((s: any) => s.id === booking.service_id);
        return sum + (Number(service?.price) || 0);
      }, 0);

      // Unique customers
      const uniqueEmails = new Set(
        completedBookingsData
          .map((b: any) => b.traveler_email)
          .filter((email: any) => email)
      );
      const customersServiced = uniqueEmails.size;

      // Completion percentage
      const totalProcessed = completedBookings + cancelledBookings;
      const completionPercentage = totalProcessed > 0 ? Math.round((completedBookings / totalProcessed) * 10000) / 100 : 0;

      const calculatedStats = {
        totalBookings,
        pendingBookings,
        todayBookings,
        totalServices,
        totalTravelers,
        totalAgents,
        completedBookings,
        totalEarnings,
        monthlyEarnings,
        customersServiced,
        completionPercentage,
      };

      console.log("Calculated stats:", calculatedStats);
      setStats(calculatedStats);

      // Fetch bookings with robust checks and resilient mapping
      try {
        const bookingsResponse = await fetch("/api/bookings");
        if (!bookingsResponse.ok) throw new Error(`Bookings fetch failed: ${bookingsResponse.status}`);
        const bookingsResult = await bookingsResponse.json();
        console.log("Bookings response:", bookingsResult);
        const rawBookings = bookingsResult?.bookings ?? bookingsResult ?? [];
        const bookings = Array.isArray(rawBookings) ? rawBookings.slice(0, 3) : [];

        const transformedBookings = bookings.map((b: any) => {
          const passengerName = b.traveler_name ?? b.travelerName ?? b.passengerName ?? b.passenger_name ?? b.name ?? "";
          const flightNumber = b.flight_number ?? b.flightNumber ?? b.flight ?? "";
          const date = b.flight_date ?? b.flightDate ?? b.date ?? "";
          const time = b.flight_time ?? b.flightTime ?? b.time ?? "";
          const status = b.status ?? b.state ?? "pending";
          return {
            id: b.id ?? b.booking_id ?? Math.random().toString(36).slice(2, 9),
            passengerName,
            flightNumber,
            date,
            time,
            status,
            createdAt: b.created_at ?? b.createdAt ?? new Date().toISOString(),
          };
        });

        setRecentBookings(transformedBookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        toast.showToast({
          title: "Failed to load bookings",
          description: String(err),
          type: "error",
        });
      }
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

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Loading skeleton for bookings overview */}
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
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
        {/* Loading skeleton for earnings overview */}
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
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
        {/* Loading skeleton for performance metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
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
        {/* Loading skeleton for AI insights */}
        <Card>
          <CardHeader>
            <div className="h-5 bg-muted rounded animate-pulse w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="p-3 bg-muted rounded-md animate-pulse">
                  <div className="h-4 bg-muted-foreground/20 rounded mb-2" />
                  <div className="h-3 bg-muted-foreground/20 rounded w-3/4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Loading skeleton for recent bookings */}
        <Card>
          <CardHeader>
            <div className="h-5 bg-muted rounded animate-pulse w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded animate-pulse mb-1" />
                    <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                  </div>
                  <div className="h-6 bg-muted rounded animate-pulse w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Business overview at a glance</p>
        </div>
        <Button variant="outline" onClick={refresh}>
          Refresh
        </Button>
      </div>

      {/* Bookings Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingBookings || 0}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.todayBookings || 0}</div>
            <p className="text-xs text-muted-foreground">
              Bookings created today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Number(stats?.monthlyEarnings || 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              This month's earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Number(stats?.totalEarnings || 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              All time earnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers Serviced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.customersServiced || 0}</div>
            <p className="text-xs text-muted-foreground">
              Unique customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completionPercentage || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Completed vs cancelled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalServices || 0}</div>
            <p className="text-xs text-muted-foreground">
              Available services
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>Automated analysis and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats && (
              <>
                {stats.completionPercentage < 75 && stats.totalBookings > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm font-medium text-yellow-800">Low Completion Rate Alert</p>
                    <p className="text-sm text-yellow-700">
                      Your completion rate is {stats.completionPercentage}%. Consider reviewing cancellation patterns to improve service delivery.
                    </p>
                  </div>
                )}
                {stats.pendingBookings > 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm font-medium text-blue-800">High Pending Bookings</p>
                    <p className="text-sm text-blue-700">
                      You have {stats.pendingBookings} pending bookings. Consider prioritizing these to improve customer satisfaction.
                    </p>
                  </div>
                )}
                {stats.monthlyEarnings > 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm font-medium text-green-800">Strong Monthly Performance</p>
                    <p className="text-sm text-green-700">
                      Excellent earnings this month at ${(stats.monthlyEarnings || 0).toFixed(2)}. Keep up the great work!
                    </p>
                  </div>
                )}
                {stats.customersServiced === 0 && stats.totalBookings > 0 && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                    <p className="text-sm font-medium text-orange-800">Customer Acquisition</p>
                    <p className="text-sm text-orange-700">
                      You have bookings but no completed services. Focus on processing pending bookings to start earning.
                    </p>
                  </div>
                )}
                {stats.totalBookings === 0 && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-sm font-medium text-gray-800">Getting Started</p>
                    <p className="text-sm text-gray-700">
                      Welcome! Start by setting up your services and processing your first bookings.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest booking activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {booking.passengerName || "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.flightNumber || "N/A"} • {booking.date ? new Date(booking.date).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <Badge
                    variant={
                      booking.status === "pending"
                        ? "default"
                        : booking.status === "confirmed"
                          ? "secondary"
                          : booking.status === "completed"
                            ? "outline"
                            : "destructive"
                    }
                  >
                    {booking.status || "pending"}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent bookings
              </p>
            )}
          </div>
          {recentBookings.length > 0 && (
            <>
              <Separator className="my-4" />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/bookings")}
              >
                View All Bookings
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
