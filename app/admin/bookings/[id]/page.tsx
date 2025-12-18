"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/ui/date-picker";
import TimePicker from "@/components/ui/time-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MockAPI, Booking, RosterShift, Agent, ActivityLog } from "@/lib/mock-api";
import { useToast } from "@/components/ui/toast";
import { formatDateUTC, formatDateTimeUTC } from '@/lib/utils';
import { ArrowLeft, Edit, Save, X, Trash2, UserCheck, Calendar, Activity } from 'lucide-react';
import Link from "next/link";

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
  const [serviceOptions, setServiceOptions] = useState<{ id: string; name: string; description: string; icon: string; price?: number; active: boolean }[]>([]);
  const [permissions, setPermissions] = useState<{ canCreateBooking?: boolean; canDeleteBooking?: boolean; canUpdateBooking?: boolean } | null>(null);
  const toast = useToast();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingData, shiftsData, agentsData, logsData, servicesData, perms] = await Promise.all([
        MockAPI.getBookingById(id),
        MockAPI.getAvailableShiftsForDate(new Date().toISOString().split('T')[0]),
        MockAPI.getAgents(),
        MockAPI.getActivityLogs(100),
        MockAPI.getServiceOptions(),
        MockAPI.getPermissions()
      ]);

      if (bookingData) {
        setBooking(bookingData);
        setForm(bookingData);
      }
      setShifts(shiftsData);
      setAgents(agentsData);
      setActivityLogs(logsData.filter((log: ActivityLog) => log.bookingId === id));
      setServiceOptions(servicesData.map((o: any) => ({
        id: o.id,
        name: o.name,
        description: o.description,
        icon: o.icon,
        price: o.price,
        active: o.active
      })));
      setPermissions(perms);
    } catch (error) {
      console.error('Error loading booking:', error);
      toast.showToast({ title: 'Error', description: 'Failed to load booking details', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!booking) return;
    setSaving(true);
    try {
      await MockAPI.updateBooking(booking.id, form as Partial<Booking>);
      await MockAPI.createActivityLog({ bookingId: booking.id, action: 'Booking Updated', user: 'Staff', details: `Booking updated` });
      setBooking({ ...booking, ...form });
      setEditing(false);
      toast.showToast({ title: 'Updated', description: 'Booking updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.showToast({ title: 'Update failed', description: String(error), type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: Booking['status']) => {
    if (!booking) return;
    try {
      await MockAPI.updateBooking(booking.id, { status: newStatus });
      await MockAPI.createActivityLog({ bookingId: booking.id, action: 'Status changed', user: 'Staff', details: `Status changed to ${newStatus}` });
      setBooking({ ...booking, status: newStatus });
      toast.showToast({ title: 'Status updated', description: `Status changed to ${newStatus}`, type: 'success' });
    } catch (error) {
      console.error('Error updating status:', error);
      toast.showToast({ title: 'Update failed', description: String(error), type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAssignShift = async (shiftId: string) => {
    if (!booking) return;
    try {
      await MockAPI.assignBookingToShift(booking.id, shiftId);
      await MockAPI.createActivityLog({ bookingId: booking.id, action: 'Assigned to shift', user: 'Staff', details: `Assigned to shift ${shiftId}` });
      const updated = await MockAPI.getBookingById(id);
      setBooking(updated);
      toast.showToast({ title: 'Assigned', description: 'Booking assigned to shift', type: 'success' });
    } catch (error) {
      console.error('Error assigning shift:', error);
      toast.showToast({ title: 'Assignment failed', description: String(error), type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!booking || !confirm('Are you sure you want to delete this booking?')) return;
    try {
      await MockAPI.deleteBooking(booking.id);
      await MockAPI.createActivityLog({ bookingId: booking.id, action: 'Booking Deleted', user: 'Staff', details: `Booking ${booking.id} deleted` });
      toast.showToast({ title: 'Deleted', description: 'Booking deleted successfully', type: 'success' });
      router.push('/admin/bookings');
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.showToast({ title: 'Delete failed', description: String(error), type: 'error' });
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'new': return 'default';
      case 'contacted': return 'secondary';
      case 'confirmed': return 'outline';
      case 'in_progress': return 'destructive';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card><CardContent className="p-6"><div className="h-32 bg-muted rounded animate-pulse" /></CardContent></Card>
            <Card><CardContent className="p-6"><div className="h-32 bg-muted rounded animate-pulse" /></CardContent></Card>
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

  const assignedShift = shifts.find(s => s.id === booking.shiftId);
  const assignedAgent = agents.find(a => a.id === booking.assignedAgentId);

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
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <p className="text-muted-foreground">ID: {booking.id} • {booking.passengerName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {permissions?.canUpdateBooking && (
            <Button onClick={() => setEditing(!editing)} variant={editing ? "outline" : "default"}>
              {editing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
              {editing ? 'Cancel' : 'Edit'}
            </Button>
          )}
          {editing && (
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Passenger & Flight Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Passenger Name</label>
                  {editing ? (
                    <Input value={form.passengerName || ''} onChange={(e) => setForm({ ...form, passengerName: e.target.value })} />
                  ) : (
                    <p className="text-lg font-medium">{booking.passengerName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  {editing ? (
                    <Input value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                  ) : (
                    <p>{booking.company}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  {editing ? (
                    <Input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  ) : (
                    <p>{booking.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  {editing ? (
                    <Input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  ) : (
                    <p>{booking.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Flight Number</label>
                  {editing ? (
                    <Input value={form.flightNumber || ''} onChange={(e) => setForm({ ...form, flightNumber: e.target.value })} />
                  ) : (
                    <p className="font-medium">{booking.flightNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Airline</label>
                  {editing ? (
                    <Input value={form.airline || ''} onChange={(e) => setForm({ ...form, airline: e.target.value })} />
                  ) : (
                    <p>{booking.airline}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  {editing ? (
                    <DatePicker value={form.date || null} onChange={(d) => setForm({ ...form, date: d || '' })} />
                  ) : (
                    <p>{formatDateUTC(booking.date)}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  {editing ? (
                    <TimePicker value={form.time || null} onChange={(t) => setForm({ ...form, time: t || '' })} />
                  ) : (
                    <p>{booking.time}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Terminal</label>
                  {editing ? (
                    <Input value={form.terminal || ''} onChange={(e) => setForm({ ...form, terminal: e.target.value })} />
                  ) : (
                    <p>{booking.terminal}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Passengers</label>
                  {editing ? (
                    <Input type="number" min={1} value={form.passengerCount?.toString() || '1'} onChange={(e) => setForm({ ...form, passengerCount: Number(e.target.value) })} />
                  ) : (
                    <p>{booking.passengerCount}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Service</label>
                  {editing ? (
                    <Select value={form.serviceId || ''} onValueChange={(val) => setForm({ ...form, serviceId: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.filter(opt => opt.active).map(opt => (
                          <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="outline">{serviceOptions.find(s => s.id === booking.serviceId)?.name || booking.serviceId}</Badge>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  {editing ? (
                    <Select value={form.status || booking.status} onValueChange={(val) => setForm({ ...form, status: val as Booking['status'] })}>
                      <SelectTrigger>
                        <SelectValue />
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
                  ) : (
                    <Badge variant={getStatusColor(booking.status)}>{booking.status.replace('_', ' ')}</Badge>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Special Requests</label>
                {editing ? (
                  <Textarea value={form.specialRequests || ''} onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} />
                ) : (
                  <p className="text-sm">{booking.specialRequests || 'None'}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activityLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{log.action}</span>
                        <Badge variant="outline" className="text-xs">{log.user}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDateTimeUTC(log.timestamp)}</span>
                  </div>
                ))}
                {activityLogs.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No activity logs for this booking</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignedShift ? (
                <div>
                  <p className="text-sm font-medium">Assigned Shift</p>
                  <p className="text-sm">{assignedShift.shift} - {agents.find(a => a.id === assignedShift.agentId)?.name}</p>
                  <p className="text-xs text-muted-foreground">{assignedShift.date}</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Not assigned to a shift</p>
                  <Select onValueChange={handleAssignShift}>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign to shift" />
                    </SelectTrigger>
                    <SelectContent>
                      {shifts.map((shift) => (
                        <SelectItem key={shift.id} value={shift.id}>
                          {shift.shift} - {agents.find(a => a.id === shift.agentId)?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {assignedAgent && (
                <div>
                  <p className="text-sm font-medium">Assigned Agent</p>
                  <p className="text-sm">{assignedAgent.name}</p>
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
                onClick={() => handleStatusChange('contacted')}
                disabled={booking.status === 'contacted'}
              >
                Mark as Contacted
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleStatusChange('confirmed')}
                disabled={booking.status === 'confirmed'}
              >
                Mark as Confirmed
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleStatusChange('in_progress')}
                disabled={booking.status === 'in_progress'}
              >
                Mark as In Progress
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleStatusChange('completed')}
                disabled={booking.status === 'completed'}
              >
                Mark as Completed
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
