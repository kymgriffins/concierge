"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MockAPI, Booking } from "@/lib/mock-api";

export function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [serviceOptions, setServiceOptions] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Booking>>({});

  useEffect(() => {
    loadBookings();
    loadServiceOptions();
  }, []);

  const loadServiceOptions = async () => {
    try {
      const opts = await MockAPI.getServiceOptions();
      setServiceOptions(opts.map(o => ({ id: o.id, name: o.name })));
    } catch (error) {
      console.error('Error loading service options:', error);
    }
  };

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const loadBookings = async () => {
    try {
      const data = await MockAPI.getBookings('all', 50);
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  };

  const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      await MockAPI.updateBooking(bookingId, { status: newStatus });
      await MockAPI.createActivityLog({ bookingId, action: 'Status changed', user: 'Staff', details: `Status changed to ${newStatus}` });
      await loadBookings(); // Reload to get updated data
    } catch (error) {
      console.error('Error updating booking status:', error);
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

  const resetForm = () => setForm({});

  const handleOpenCreate = () => {
    resetForm();
    setShowCreate(true);
    setEditing(false);
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      // Required fields for createBooking signature
      const payload: any = {
        passengerName: form.passengerName || '',
        company: form.company || '',
        phone: form.phone || '',
        email: form.email || '',
        flightNumber: form.flightNumber || '',
        airline: form.airline || '',
        date: form.date || new Date().toISOString().split('T')[0],
        time: form.time || '00:00',
        terminal: form.terminal || '',
        passengerCount: form.passengerCount || 1,
        services: form.services || [],
        specialRequests: form.specialRequests || '',
        status: (form.status as Booking['status']) || 'new',
        source: (form.source as Booking['source']) || 'manual'
      };

      await MockAPI.createBooking(payload);
      await MockAPI.createActivityLog({ bookingId: (bookings.length + 1).toString(), action: 'Booking Created', user: 'Staff', details: `Booking created for ${payload.passengerName}` });
      await loadBookings();
      setShowCreate(false);
      resetForm();
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEdit = (booking: Booking) => {
    setForm({ ...booking });
    setSelectedBooking(booking);
    setEditing(true);
    setShowCreate(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setCreating(true);
    try {
      await MockAPI.updateBooking(selectedBooking.id, form as Partial<Booking>);
      await MockAPI.createActivityLog({ bookingId: selectedBooking.id, action: 'Booking Updated', user: 'Staff', details: `Booking updated for ${form.passengerName || selectedBooking.passengerName}` });
      await loadBookings();
      setShowCreate(false);
      setEditing(false);
      setSelectedBooking(null);
      resetForm();
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      await MockAPI.deleteBooking(id);
      await MockAPI.createActivityLog({ bookingId: id, action: 'Booking Deleted', user: 'Staff', details: `Booking ${id} deleted` });
      await loadBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bookings Management</h1>
          <p className="text-muted-foreground">Manage all airport concierge bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleOpenCreate}>
            <span className="mr-2">+</span>
            New Booking
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by passenger name, flight, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      {/* Create / Edit form */}
      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>{editing ? 'Edit Booking' : 'Create Booking'}</CardTitle>
            <CardDescription>{editing ? 'Update booking details' : 'Add a new booking to the system'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={editing ? handleSubmitEdit : handleSubmitCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Passenger name" value={form.passengerName || ''} onChange={(e) => setForm({ ...form, passengerName: e.target.value })} />
                <Input placeholder="Company" value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                <Input placeholder="Phone" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input placeholder="Email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Input placeholder="Flight number" value={form.flightNumber || ''} onChange={(e) => setForm({ ...form, flightNumber: e.target.value })} />
                <Input placeholder="Airline" value={form.airline || ''} onChange={(e) => setForm({ ...form, airline: e.target.value })} />
                <Input type="date" value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <Input type="time" value={form.time || ''} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                <Input placeholder="Terminal" value={form.terminal || ''} onChange={(e) => setForm({ ...form, terminal: e.target.value })} />
                <Input type="number" min={1} placeholder="Passengers" value={form.passengerCount?.toString() || '1'} onChange={(e) => setForm({ ...form, passengerCount: Number(e.target.value) })} />
                <Select value={form.status || 'new'} onValueChange={(val) => setForm({ ...form, status: val as Booking['status'] })}>
                  <SelectTrigger className="w-full">
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Services</label>
                <div className="flex flex-wrap gap-2">
                  {serviceOptions.map(opt => {
                    const checked = (form.services || []).includes(opt.id);
                    return (
                      <label key={opt.id} className="inline-flex items-center gap-2">
                        <input type="checkbox" checked={checked} onChange={(e) => {
                          const next = new Set(form.services || []);
                          if (e.target.checked) next.add(opt.id); else next.delete(opt.id);
                          setForm({ ...form, services: Array.from(next) });
                        }} />
                        <span className="text-sm">{opt.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <Input placeholder="Special requests" value={form.specialRequests || ''} onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={creating}>{creating ? 'Saving...' : (editing ? 'Update booking' : 'Create booking')}</Button>
                <Button variant="outline" onClick={() => { setShowCreate(false); setEditing(false); setSelectedBooking(null); resetForm(); }}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No bookings found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{booking.passengerName}</h3>
                      <Badge variant={getStatusColor(booking.status)}>
                        {booking.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Flight:</span> {booking.flightNumber} ({booking.airline})
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {formatDate(booking.date)} at {booking.time}
                      </div>
                      <div>
                        <span className="font-medium">Company:</span> {booking.company}
                      </div>
                      <div>
                        <span className="font-medium">Passengers:</span> {booking.passengerCount}
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="font-medium text-sm">Services:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {booking.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {booking.specialRequests && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Special Requests:</span> {booking.specialRequests}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 lg:flex-col lg:w-48">
                    <Select
                      value={booking.status}
                      onValueChange={(value: string) => handleStatusChange(booking.id, value as Booking['status'])}
                    >
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

                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(booking)}>Edit</Button>
                      <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>View</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(booking.id)}>Delete</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination placeholder */}
      {filteredBookings.length > 0 && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page 1 of {Math.ceil(filteredBookings.length / 10)}
            </span>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Selected booking details */}
      {selectedBooking && !editing && (
        <Card>
          <CardHeader>
            <CardTitle>Booking details</CardTitle>
            <CardDescription>Details for {selectedBooking.passengerName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><strong>Flight:</strong> {selectedBooking.flightNumber} ({selectedBooking.airline})</div>
              <div><strong>Date:</strong> {formatDate(selectedBooking.date)} at {selectedBooking.time}</div>
              <div><strong>Company:</strong> {selectedBooking.company}</div>
              <div><strong>Passengers:</strong> {selectedBooking.passengerCount}</div>
              <div><strong>Phone:</strong> {selectedBooking.phone}</div>
              <div><strong>Email:</strong> {selectedBooking.email}</div>
              <div><strong>Terminal:</strong> {selectedBooking.terminal}</div>
              <div><strong>Services:</strong> {(selectedBooking.services || []).join(', ')}</div>
              {selectedBooking.specialRequests && <div><strong>Special Requests:</strong> {selectedBooking.specialRequests}</div>}
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => handleOpenEdit(selectedBooking)}>Edit</Button>
              <Button variant="destructive" onClick={() => { handleDelete(selectedBooking.id); setSelectedBooking(null); }}>Delete</Button>
              <Button variant="outline" onClick={() => setSelectedBooking(null)}>Close</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
