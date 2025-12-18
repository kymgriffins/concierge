"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MockAPI, Booking, RosterShift, Agent } from "@/lib/mock-api";
import { useToast } from "@/components/ui/toast";
import {
  Target,
  CalendarDays,
  UserCheck,
  Users,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Plane,
  Clock,
  MapPin
} from "lucide-react";

export function AdminBookingAssignments() {
  const [unassignedBookings, setUnassignedBookings] = useState<Booking[]>([]);
  const [availableShifts, setAvailableShifts] = useState<RosterShift[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);
  const [selectedShiftId, setSelectedShiftId] = useState<string>("");
  const [assignmentResult, setAssignmentResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [serviceOptions, setServiceOptions] = useState<{ id: string; name: string; description: string; icon: string; price?: number; active: boolean }[]>([]);
  const toast = useToast();

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  useEffect(() => {
    const loadServiceOptions = async () => {
      try {
        const opts = await MockAPI.getServiceOptions();
        setServiceOptions(opts.map(o => ({
          id: o.id,
          name: o.name,
          description: o.description,
          icon: o.icon,
          price: o.price,
          active: o.active
        })));
      } catch (error) {
        console.error('Error loading service options:', error);
      }
    };
    loadServiceOptions();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookings, shifts, agentList] = await Promise.all([
        MockAPI.getBookings(),
        MockAPI.getAvailableShiftsForDate(selectedDate),
        MockAPI.getAgents()
      ]);

      const unassigned = bookings.filter(b => !b.shiftId && !b.assignedAgentId);
      setUnassignedBookings(unassigned);
      setAvailableShifts(shifts);
      setAgents(agentList);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.showToast({ title: 'Error', description: 'Failed to load booking assignment data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const assignBookingsToShift = async () => {
    if (selectedBookingIds.length === 0 || !selectedShiftId) return;

    setProcessing(true);
    try {
      // Assign each selected booking to the shift
      const results = await Promise.allSettled(
        selectedBookingIds.map(bookingId => MockAPI.assignBookingToShift(bookingId, selectedShiftId))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      setAssignmentResult({
        success: failed === 0,
        message: `Assigned ${successful} booking${successful !== 1 ? 's' : ''} successfully${failed > 0 ? `, ${failed} failed` : ''}!`
      });

      setSelectedBookingIds([]);
      setSelectedShiftId("");
      await loadData(); // Refresh data

      toast.showToast({
        title: 'Assignment Complete',
        description: `Assigned ${successful} booking${successful !== 1 ? 's' : ''} to shift${failed > 0 ? ` (${failed} failed)` : ''}`,
        type: successful > 0 ? 'success' : 'error'
      });
    } catch (error) {
      console.error('Assignment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Assignment failed';
      setAssignmentResult({ success: false, message: errorMessage });

      toast.showToast({
        title: 'Assignment Failed',
        description: errorMessage,
        type: 'error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const getAssignedBookingsCount = (shiftId: string) => {
    // This would need to be implemented in the API to get real counts
    // For now, return a mock count
    return Math.floor(Math.random() * 3);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Booking Assignments</h1>
            <p className="text-muted-foreground">Assign bookings to shifts and agents</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded animate-pulse mb-2" />
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Booking Assignments</h1>
          <p className="text-muted-foreground">Assign bookings to shifts and specific agents</p>
        </div>
        <Button onClick={loadData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Date Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Date</CardTitle>
          <CardDescription>Choose the date to view available shifts and assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="max-w-xs"
          />
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{unassignedBookings.length}</div>
            <div className="text-sm text-muted-foreground">Unassigned Bookings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CalendarDays className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{availableShifts.length}</div>
            <div className="text-sm text-muted-foreground">Available Shifts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserCheck className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">
              {availableShifts.reduce((acc, shift) => acc + getAssignedBookingsCount(shift.id), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Assignments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-600">
              {Math.round((availableShifts.reduce((acc, shift) => acc + getAssignedBookingsCount(shift.id), 0) / Math.max(unassignedBookings.length + availableShifts.reduce((acc, shift) => acc + getAssignedBookingsCount(shift.id), 0), 1)) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Assignment Rate</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Shifts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Available Shifts ({availableShifts.length})
            </CardTitle>
            <CardDescription>Scheduled shifts with assigned agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableShifts.map((shift) => {
                const agent = agents.find(a => a.id === shift.agentId);
                const assignedCount = getAssignedBookingsCount(shift.id);
                return (
                  <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">
                          {shift.shift.charAt(0).toUpperCase() + shift.shift.slice(1)}
                        </Badge>
                        <Badge variant="secondary">{assignedCount} assigned</Badge>
                      </div>
                      <p className="text-sm font-medium">
                        Agent: {agent?.name || 'Unknown'}
                      </p>
                      {shift.notes && (
                        <p className="text-xs text-muted-foreground">{shift.notes}</p>
                      )}
                    </div>
                  </div>
                );
              })}
              {availableShifts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No shifts available for selected date</p>
                  <p className="text-xs mt-1">Try selecting a different date</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Unassigned Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Unassigned Bookings ({unassignedBookings.length})
            </CardTitle>
            <CardDescription>Bookings waiting to be assigned to shifts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {unassignedBookings.map((booking) => (
                <div key={booking.id} className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedBookingIds.includes(booking.id) ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                }`} onClick={() => {
                  setSelectedBookingIds(prev =>
                    prev.includes(booking.id)
                      ? prev.filter(id => id !== booking.id)
                      : [...prev, booking.id]
                  );
                }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedBookingIds.includes(booking.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          setSelectedBookingIds(prev =>
                            prev.includes(booking.id)
                              ? prev.filter(id => id !== booking.id)
                              : [...prev, booking.id]
                          );
                        }}
                        className="rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{booking.passengerName}</p>
                        <p className="text-xs text-muted-foreground">{booking.company}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{booking.id}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Plane className="h-3 w-3" />
                      {booking.flightNumber}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {booking.time}
                    </div>
                    {booking.terminal && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {booking.terminal}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {serviceOptions.find(s => s.id === booking.serviceId)?.name || booking.serviceId}
                    </Badge>
                  </div>
                </div>
              ))}
              {unassignedBookings.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">All bookings are assigned!</p>
                  <p className="text-xs mt-1">No unassigned bookings for this date</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Controls */}
      {(unassignedBookings.length > 0 && availableShifts.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Assign Bookings to Shift
            </CardTitle>
            <CardDescription>Select multiple bookings and assign them to a shift</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedBookingIds.length > 0 && (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm font-medium">
                  {selectedBookingIds.length} booking{selectedBookingIds.length !== 1 ? 's' : ''} selected
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedBookingIds.map(id => {
                    const booking = unassignedBookings.find(b => b.id === id);
                    return booking ? (
                      <Badge key={id} variant="secondary" className="text-xs">
                        {booking.passengerName}
                        <button
                          onClick={() => setSelectedBookingIds(prev => prev.filter(bid => bid !== id))}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Shift ({selectedBookingIds.length > 0 ? `${selectedBookingIds.length} booking${selectedBookingIds.length !== 1 ? 's' : ''} ready` : 'Select bookings first'})
                </label>
                <Select value={selectedShiftId} onValueChange={setSelectedShiftId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a shift..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableShifts.map((shift) => {
                      const agent = agents.find(a => a.id === shift.agentId);
                      const assignedCount = getAssignedBookingsCount(shift.id);
                      return (
                        <SelectItem key={shift.id} value={shift.id}>
                          {shift.shift.charAt(0).toUpperCase() + shift.shift.slice(1)} - {agent?.name || 'Unknown'} ({assignedCount} assigned)
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <div className="flex gap-2 w-full">
                  <Button
                    onClick={assignBookingsToShift}
                    disabled={selectedBookingIds.length === 0 || !selectedShiftId || processing}
                    className="flex-1"
                  >
                    {processing ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <UserCheck className="h-4 w-4 mr-2" />
                    )}
                    Assign {selectedBookingIds.length > 0 ? `${selectedBookingIds.length} Booking${selectedBookingIds.length !== 1 ? 's' : ''}` : 'Bookings'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedBookingIds([]);
                      setSelectedShiftId("");
                      setAssignmentResult(null);
                    }}
                    disabled={selectedBookingIds.length === 0 && !selectedShiftId}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignment Result */}
      {assignmentResult && (
        <Card className={assignmentResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {assignmentResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              <p className={`font-medium ${assignmentResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {assignmentResult.message}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Data States */}
      {unassignedBookings.length === 0 && availableShifts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Data Available</h3>
            <p className="text-muted-foreground mb-4">
              There are no unassigned bookings or available shifts for the selected date.
            </p>
            <p className="text-sm text-muted-foreground">
              Try selecting a different date or check if shifts have been scheduled.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
