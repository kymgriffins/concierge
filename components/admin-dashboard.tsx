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
   
      {/* Earnings Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats?.monthlyEarnings || 0).toFixed(2)}</div>
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
            <div className="text-2xl font-bold">${(stats?.totalEarnings || 0).toFixed(2)}</div>
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
                {stats.completionPercentage < 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm font-medium text-yellow-800">Completion Rate Alert</p>
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
                {stats.customersServiced < 0 && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                    <p className="text-sm font-medium text-orange-800">Customer Acquisition</p>
                    <p className="text-sm text-orange-700">
                      Only {stats.customersServiced} unique customers serviced. Consider marketing strategies to attract more clients.
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
