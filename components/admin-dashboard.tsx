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
import { MockAPI, Booking } from "@/lib/mock-api";
import { useToast } from "@/components/ui/toast";
import { formatRelativeTime } from "@/lib/utils";

export function AdminDashboard() {
  const router = useRouter();
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load recent bookings from database API
        const bookingsResponse = await fetch("/api/bookings");
        const bookingsResult = await bookingsResponse.json();
        const bookings = bookingsResult.bookings.slice(0, 5);

        // Transform database format to component format
        const transformedBookings = bookings.map((b: any) => ({
          id: b.id,
          passengerName: b.traveler_name || "",
          flightNumber: b.flight_number || "",
          date: b.flight_date || "",
          time: "",
          status: b.status || "pending",
          createdAt: b.created_at || new Date().toISOString(),
        }));

        // For today schedule, filter bookings for today
        const today = new Date().toISOString().split('T')[0];
        const todayBookings = bookingsResult.bookings
          .filter((b: any) => b.flight_date === today && b.status === 'confirmed')
          .slice(0, 5);

        const transformedTodayBookings = todayBookings.map((b: any) => ({
          id: b.id,
          passengerName: b.traveler_name || "",
          flightNumber: b.flight_number || "",
          date: b.flight_date || "",
          time: "",
          status: b.status || "confirmed",
        }));

        setRecentBookings(transformedBookings);
        setTodaySchedule(transformedTodayBookings);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      // Load recent bookings from database API
      const bookingsResponse = await fetch("/api/bookings");
      const bookingsResult = await bookingsResponse.json();
      const bookings = bookingsResult.bookings.slice(0, 5);

      // Transform database format to component format
      const transformedBookings = bookings.map((b: any) => ({
        id: b.id,
        passengerName: b.traveler_name || "",
        flightNumber: b.flight_number || "",
        date: b.flight_date || "",
        time: "",
        status: b.status || "pending",
        createdAt: b.created_at || new Date().toISOString(),
      }));

      // For today schedule, filter bookings for today
      const today = new Date().toISOString().split('T')[0];
      const todayBookings = bookingsResult.bookings
        .filter((b: any) => b.flight_date === today && b.status === 'confirmed')
        .slice(0, 5);

      const transformedTodayBookings = todayBookings.map((b: any) => ({
        id: b.id,
        passengerName: b.traveler_name || "",
        flightNumber: b.flight_number || "",
        date: b.flight_date || "",
        time: "",
        status: b.status || "confirmed",
      }));

      setRecentBookings(transformedBookings);
      setTodaySchedule(transformedTodayBookings);
    } catch (error) {
      console.error("Error refreshing dashboard data:", error);
      toast.showToast({
        title: "Refresh failed",
        description: String(error),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Content Grid */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={refresh}>
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              Latest booking requests and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.slice(0, 4).map((booking) => {
                const { text: createdTimeText, color: createdTimeColor } = formatRelativeTime(
                  booking.createdAt?.split('T')[0] || booking.date || new Date().toISOString().split('T')[0],
                  booking.status || "new"
                );
                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between space-x-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {booking.passengerName}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {booking.flightNumber} • <span className={createdTimeColor}>{createdTimeText}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <Badge
                      variant={
                        booking.status === "new"
                          ? "default"
                          : booking.status === "confirmed"
                            ? "secondary"
                            : booking.status === "completed"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {booking.status?.replace("_", " ")}
                    </Badge>
                  </div>
                );
              })}
            </div>
            <Separator className="my-4" />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/admin/bookings")}
            >
              View All Bookings
            </Button>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Confirmed bookings for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaySchedule.slice(0, 4).map((booking) => {
                const { text: bookingTimeText, color: bookingTimeColor } = formatRelativeTime(
                  booking.date || new Date().toISOString().split('T')[0],
                  booking.status || "new"
                );
                return (
                  <div key={booking.id} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {booking.passengerName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.flightNumber} • <span className={bookingTimeColor}>{bookingTimeText}</span> at {booking.time}
                      </p>
                    </div>
                    <Badge variant="outline">1 service</Badge>
                  </div>
                );
              })}
              {todaySchedule.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No confirmed bookings for today
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - MVP Focused */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Essential booking management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            <Button
              className="h-16 flex-col"
              onClick={() => router.push("/admin/bookings")}
            >
              <span className="text-xl mb-2">✈️</span>
              <span className="text-sm">Manage Bookings</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col"
              onClick={() => router.push("/admin/customers")}
            >
              <span className="text-xl mb-2">👥</span>
              <span className="text-sm">View Customers</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
