"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MockAPI, Booking, DashboardStats } from "@/lib/mock-api";
import { useToast } from "@/components/ui/toast";
import { SupervisorReviewPanel } from "@/components/supervisor-review-panel";

export function AdminDashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [dashboardStats, bookings, schedule] = await Promise.all([
          MockAPI.getDashboardStats(),
          MockAPI.getBookings('all', 5),
          MockAPI.getTodaySchedule()
        ]);

        setStats(dashboardStats);
        setRecentBookings(bookings);
        setTodaySchedule(schedule);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const [dashboardStats, bookings, schedule] = await Promise.all([
        MockAPI.getDashboardStats(),
        MockAPI.getBookings('all', 5),
        MockAPI.getTodaySchedule()
      ]);
      setStats(dashboardStats);
      setRecentBookings(bookings);
      setTodaySchedule(schedule);
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
      toast.showToast({ title: 'Refresh failed', description: String(error), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      toast.showToast({ title: 'Sync started', description: 'Syncing data, this may take a moment', type: 'info' });
      await MockAPI.syncData();
      await refresh();
      toast.showToast({ title: 'Sync complete', description: 'Data synced successfully', type: 'success' });
    } catch (error) {
      console.error('Error syncing data:', error);
      toast.showToast({ title: 'Sync failed', description: String(error), type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Content Grid */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={refresh}>Refresh</Button>
        <Button className="ml-2" onClick={handleSync}>Sync Data</Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest booking requests and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.slice(0, 4).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {booking.passengerName}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {booking.flightNumber} • 1 service
                    </p>
                  </div>
                  <Badge variant={
                    booking.status === 'new' ? 'default' :
                    booking.status === 'confirmed' ? 'secondary' :
                    booking.status === 'completed' ? 'outline' : 'destructive'
                  }>
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <Button variant="outline" className="w-full" onClick={() => onNavigate?.('bookings')}>
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
              {todaySchedule.slice(0, 4).map((booking) => (
                <div key={booking.id} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{booking.passengerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.flightNumber} at {booking.time}
                    </p>
                  </div>
                  <Badge variant="outline">1 service</Badge>
                </div>
              ))}
              {todaySchedule.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No confirmed bookings for today
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supervisor Reviews */}
      <SupervisorReviewPanel />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            <Button className="h-16 sm:h-20 flex-col touch-manipulation" onClick={() => onNavigate?.('bookings')}>
              <span className="text-xl sm:text-2xl mb-1 sm:mb-2">✈️</span>
              <span className="text-xs sm:text-sm">New Booking</span>
            </Button>
            <Button variant="outline" className="h-16 sm:h-20 flex-col touch-manipulation">
              <span className="text-xl sm:text-2xl mb-1 sm:mb-2">🔍</span>
              <span className="text-xs sm:text-sm">Search Flights</span>
            </Button>
            <Button variant="outline" className="h-16 sm:h-20 flex-col touch-manipulation">
              <span className="text-xl sm:text-2xl mb-1 sm:mb-2">📋</span>
              <span className="text-xs sm:text-sm">View Reports</span>
            </Button>
            <Button variant="outline" className="h-16 sm:h-20 flex-col touch-manipulation">
              <span className="text-xl sm:text-2xl mb-1 sm:mb-2">⚙️</span>
              <span className="text-xs sm:text-sm">Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system health and sync status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Online - All systems operational</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{stats?.pendingSync || 0} items pending sync</p>
              <p className="text-xs text-muted-foreground">
                Last synced: {stats ? new Date(stats.lastSyncTime).toLocaleTimeString() : 'Never'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
