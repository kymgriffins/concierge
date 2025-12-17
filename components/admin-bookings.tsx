"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DateTimePicker from "@/components/ui/date-time-picker";
import DatePicker from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MockAPI, Booking } from "@/lib/mock-api";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

export function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [sortBy, setSortBy] = useState<'date' | 'passenger' | 'flight'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [serviceOptions, setServiceOptions] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
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
  
  useEffect(() => {
    filterBookings();
  }, [startDate, endDate]);

  useEffect(() => {
    filterBookings();
  }, [sortBy, sortDir]);

  useEffect(() => {
    setPage(1); // reset page when filters change
  }, [searchTerm, statusFilter, startDate, endDate, perPage]);

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

    // Date range filter
    if (startDate) {
      filtered = filtered.filter(b => b.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(b => b.date <= endDate);
    }

    // sort
    filtered = filtered.sort((a, b) => {
      let v = 0;
      if (sortBy === 'date') v = a.date.localeCompare(b.date);
      if (sortBy === 'passenger') v = a.passengerName.localeCompare(b.passengerName);
      if (sortBy === 'flight') v = a.flightNumber.localeCompare(b.flightNumber);
      return sortDir === 'asc' ? v : -v;
    });

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

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / perPage));
  const paginated = filteredBookings.slice((page - 1) * perPage, page * perPage);

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
            <div className="flex gap-2">
              <DatePicker value={startDate} onChange={(v) => setStartDate(v)} />
              <DatePicker value={endDate} onChange={(v) => setEndDate(v)} />
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

      {/* Bookings Table */}
      {/* Create / Edit form (modal) */}
      <AlertDialog open={showCreate} onOpenChange={(open) => {
        setShowCreate(open);
        if (!open) {
          setEditing(false);
          setSelectedBooking(null);
          resetForm();
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{editing ? 'Edit Booking' : 'Create Booking'}</AlertDialogTitle>
            <AlertDialogDescription>{editing ? 'Update booking details' : 'Add a new booking to the system'}</AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={editing ? handleSubmitEdit : handleSubmitCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input placeholder="Passenger name" value={form.passengerName || ''} onChange={(e) => setForm({ ...form, passengerName: e.target.value })} />
              <Input placeholder="Company" value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              <Input placeholder="Phone" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input placeholder="Email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Flight number" value={form.flightNumber || ''} onChange={(e) => setForm({ ...form, flightNumber: e.target.value })} />
              <Input placeholder="Airline" value={form.airline || ''} onChange={(e) => setForm({ ...form, airline: e.target.value })} />
              <DateTimePicker date={form.date || null} time={form.time || null} onChange={(d, t) => setForm({ ...form, date: d || '', time: t || '' })} />
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
              <Button variant="outline" type="button" onClick={() => { setShowCreate(false); setEditing(false); setSelectedBooking(null); resetForm(); }}>Cancel</Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Per page:</label>
              <Select value={perPage.toString()} onValueChange={(v) => setPerPage(Number(v))}>
                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <div className="ml-4 flex items-center gap-2">
                <label className="text-sm">Sort:</label>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="passenger">Passenger</SelectItem>
                    <SelectItem value="flight">Flight</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" onClick={() => setSortDir(dir => dir === 'asc' ? 'desc' : 'asc')}>{sortDir === 'asc' ? '↑' : '↓'}</Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { setPage(p => Math.max(1, p - 1)); }}>Previous</Button>
              <div className="text-sm">Page {page} / {totalPages}</div>
              <Button variant="outline" size="sm" onClick={() => { setPage(p => Math.min(totalPages, p + 1)); }}>Next</Button>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b">
                    <th className="p-4">Passenger</th>
                      <th className="p-4">Flight</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Services</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Source</th>
                      <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No bookings found.</td></tr>
                ) : paginated.map(booking => (
                  <tr key={booking.id} className="border-b hover:bg-muted">
                    <td className="p-4 align-top">
                      <div className="font-medium">{booking.passengerName}</div>
                      <div className="text-sm text-muted-foreground">{booking.phone} • {booking.email}</div>
                    </td>
                    <td className="p-4 align-top">{booking.flightNumber} <div className="text-sm text-muted-foreground">{booking.airline} • {booking.time}</div></td>
                    <td className="p-4 align-top">{formatDate(booking.date)}</td>
                    <td className="p-4 align-top">{booking.company}</td>
                    <td className="p-4 align-top">
                      <div className="flex flex-wrap gap-1">
                        {booking.services.map(s => <Badge key={s} variant="outline" className="text-xs">{s.replace('_', ' ')}</Badge>)}
                      </div>
                    </td>
                    <td className="p-4 align-top"><Badge variant={getStatusColor(booking.status)}>{booking.status.replace('_', ' ')}</Badge></td>
                    <td className="p-4 align-top text-sm text-muted-foreground">{booking.source}</td>
                    <td className="p-4 align-top">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(booking)}>Edit</Button>
                        <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>View</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(booking.id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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

      {/* Selected booking details (modal) */}
      <AlertDialog open={!!selectedBooking && !editing} onOpenChange={(open) => { if (!open) setSelectedBooking(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Booking details</AlertDialogTitle>
            <AlertDialogDescription>Details for {selectedBooking?.passengerName}</AlertDialogDescription>
          </AlertDialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="flex gap-2 mt-2">
                <Button onClick={() => { handleOpenEdit(selectedBooking); }}>Edit</Button>
                <Button variant="destructive" onClick={() => { handleDelete(selectedBooking.id); setSelectedBooking(null); }}>Delete</Button>
                <Button variant="outline" onClick={() => setSelectedBooking(null)}>Close</Button>
              </div>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
