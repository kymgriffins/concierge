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
  } | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load dashboard stats
      const statsResponse = await fetch("/api/dashboard-stats");
      const statsResult = await statsResponse.json();
      setStats(statsResult.stats);

      // Load recent bookings
      const bookingsResponse = await fetch("/api/bookings");
      const bookingsResult = await bookingsResponse.json();
      const bookings = bookingsResult.bookings.slice(0, 3); // Limit to 3 for minimalism

      const transformedBookings = bookings.map((b: any) => ({
        id: b.id,
        passengerName: b.traveler_name || "",
        flightNumber: b.flight_number || "",
        date: b.flight_date || "",
        time: "",
        status: b.status || "pending",
        createdAt: b.created_at || new Date().toISOString(),
      }));

      setRecentBookings(transformedBookings);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
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
        {/* Loading skeleton for system status */}
        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
            </CardContent>
          </Card>
        </div>
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
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
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
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedBookings || 0}</div>
            <p className="text-xs text-muted-foreground">
              Successfully fulfilled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid gap-4 md:grid-cols-1">
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
