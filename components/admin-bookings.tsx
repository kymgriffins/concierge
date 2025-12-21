"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/ui/date-picker";
import TimePicker from "@/components/ui/time-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Mock data removed - using empty implementations
// Define interfaces locally since MockAPI is removed
interface Booking {
  id: string;
  passengerName: string;
  company: string;
  phone: string;
  email: string;
  flightNumber: string;
  airline: string;
  date: string;
  time: string;
  terminal?: string;
  passengerCount: number;
  services: string[];
  specialRequests: string;
  status: 'new' | 'contacted' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  source: 'manual' | 'whatsapp' | 'email';
  createdAt: string;
  updatedAt: string;
  notes: string[];
}

import { useToast } from "@/components/ui/toast";
import { formatDateUTC } from '@/lib/utils';
import DataTable, { Column } from '@/components/ui/data-table/data-table';
import { List, Plus, Clock, CheckCircle } from 'lucide-react';
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
  const toast = useToast();
  const [permissions, setPermissions] = useState<{ canCreateBooking?: boolean; canDeleteBooking?: boolean; canUpdateBooking?: boolean } | null>(null);

  useEffect(() => {
    loadBookings();
    loadServiceOptions();
    // Mock data removed - set empty permissions
    setPermissions({ canCreateBooking: false, canDeleteBooking: false, canUpdateBooking: false });
  }, []);

  const loadServiceOptions = async () => {
    // Mock data removed - set empty service options
    setServiceOptions([]);
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
      // Mock data removed - set empty bookings
      setBookings([]);
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
      await // MockAPI call removed: updateBooking(bookingId, { status: newStatus });
      await // MockAPI call removed: createActivityLog({ bookingId, action: 'Status changed', user: 'Staff', details: `Status changed to ${newStatus}` });
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
    if (permissions && !permissions.canCreateBooking) {
      toast.showToast({ title: 'Permission denied', description: 'You are not allowed to create bookings', type: 'error' });
      return;
    }

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

      await // MockAPI call removed: createBooking(payload);
      await // MockAPI call removed: createActivityLog({ bookingId: (bookings.length + 1).toString(), action: 'Booking Created', user: 'Staff', details: `Booking created for ${payload.passengerName}` });
      await loadBookings();
      setShowCreate(false);
      resetForm();
      toast.showToast({ title: 'Booking created', description: `${payload.passengerName} created`, type: 'success' });
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.showToast({ title: 'Create failed', description: String(error), type: 'error' });
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
      await // MockAPI call removed: updateBooking(selectedBooking.id, form as Partial<Booking>);
      await // MockAPI call removed: createActivityLog({ bookingId: selectedBooking.id, action: 'Booking Updated', user: 'Staff', details: `Booking updated for ${form.passengerName || selectedBooking.passengerName}` });
      await loadBookings();
      setShowCreate(false);
      setEditing(false);
      setSelectedBooking(null);
      resetForm();
      toast.showToast({ title: 'Booking updated', description: `${form.passengerName || selectedBooking.passengerName} updated`, type: 'success' });
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.showToast({ title: 'Update failed', description: String(error), type: 'error' });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      await // MockAPI call removed: deleteBooking(id);
      await // MockAPI call removed: createActivityLog({ bookingId: id, action: 'Booking Deleted', user: 'Staff', details: `Booking ${id} deleted` });
      await loadBookings();
      toast.showToast({ title: 'Booking deleted', description: `Booking ${id} removed`, type: 'success' });
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.showToast({ title: 'Delete failed', description: String(error), type: 'error' });
    }
  };

  const formatDate = (dateString: string) => {
    return formatDateUTC(dateString);
  };

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / perPage));
  const paginated = filteredBookings.slice((page - 1) * perPage, page * perPage);

  // DataTable columns
  const columns: Column<Booking>[] = [
    {
      key: 'passenger',
      header: 'Passenger',
      accessor: (r) => r.passengerName,
      cell: (r) => (
        <div>
          <div className="font-medium">{r.passengerName}</div>
          <div className="text-sm text-muted-foreground">{r.phone} • {r.email}</div>
        </div>
      ),
      sortable: true
    },
    { key: 'flight', header: 'Flight', accessor: (r) => r.flightNumber, cell: (r) => (<div>{r.flightNumber}<div className="text-sm text-muted-foreground">{r.airline} • {r.time}</div></div>), sortable: true },
    { key: 'date', header: 'Date', accessor: (r) => r.date, cell: (r) => formatDateUTC(r.date), sortable: true },
    { key: 'company', header: 'Company', accessor: (r) => r.company },
    { key: 'services', header: 'Services', cell: (r) => (<div className="flex flex-wrap gap-1">{r.services.map(s => <Badge key={s} variant="outline" className="text-xs">{s.replace('_', ' ')}</Badge>)}</div>) },
    { key: 'status', header: 'Status', cell: (r) => (<Badge variant={getStatusColor(r.status)}>{r.status.replace('_', ' ')}</Badge>), sortable: true },
    { key: 'source', header: 'Source', accessor: (r) => r.source },
    { key: 'actions', header: '', cell: (r) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(r)}>Edit</Button>
        <Button variant="outline" size="sm" onClick={() => setSelectedBooking(r)}>View</Button>
        <Button variant="destructive" size="sm" onClick={() => handleDelete(r.id)}>Delete</Button>
      </div>
    ) }
  ];

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

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { status: 'all', label: 'All', count: bookings.length, icon: List, color: 'default' },
          { status: 'new', label: 'New', count: bookings.filter(b => b.status === 'new').length, icon: Plus, color: 'secondary' },
          { status: 'in_progress', label: 'In Progress', count: bookings.filter(b => b.status === 'in_progress').length, icon: Clock, color: 'destructive' },
          { status: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length, icon: CheckCircle, color: 'default' }
        ].map(({ status, label, count, icon: Icon, color }) => (
          <Card
            key={status}
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === status ? 'ring-2 ring-primary shadow-md' : ''
            }`}
            onClick={() => setStatusFilter(status)}
          >
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">{count}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      

      {/* Bookings Table */}
      {/* Create / Edit form (full-screen modal) */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{editing ? 'Edit Booking' : 'Create Booking'}</h2>
                    <p className="text-muted-foreground">{editing ? 'Update booking details' : 'Add a new booking to the system'}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setShowCreate(false); setEditing(false); setSelectedBooking(null); resetForm(); }}
                  >
                    ✕
                  </Button>
                </div>

                <form onSubmit={editing ? handleSubmitEdit : handleSubmitCreate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input placeholder="Passenger name" value={form.passengerName || ''} onChange={(e) => setForm({ ...form, passengerName: e.target.value })} />
                    <Input placeholder="Company" value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                    <Input placeholder="Phone" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    <Input placeholder="Email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <Input placeholder="Flight number" value={form.flightNumber || ''} onChange={(e) => setForm({ ...form, flightNumber: e.target.value })} />
                    <Input placeholder="Airline" value={form.airline || ''} onChange={(e) => setForm({ ...form, airline: e.target.value })} />
                    <DatePicker value={form.date || null} onChange={(d) => setForm({ ...form, date: d || '' })} placeholder="Select date" />
                    <TimePicker value={form.time || null} onChange={(t) => setForm({ ...form, time: t || '' })} placeholder="Select time" />
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
                    <label className="block text-sm font-medium mb-3">Services</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {serviceOptions.map(opt => {
                        const checked = (form.services || []).includes(opt.id);
                        return (
                          <label key={opt.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                            <input type="checkbox" checked={checked} onChange={(e) => {
                              const next = new Set(form.services || []);
                              if (e.target.checked) next.add(opt.id); else next.delete(opt.id);
                              setForm({ ...form, services: Array.from(next) });
                            }} className="rounded" />
                            <span className="text-sm font-medium">{opt.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Special Requests</label>
                    <Input placeholder="Special requests" value={form.specialRequests || ''} onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={creating} size="lg">
                      {creating ? 'Saving...' : (editing ? 'Update booking' : 'Create booking')}
                    </Button>
                    <Button variant="outline" type="button" onClick={() => { setShowCreate(false); setEditing(false); setSelectedBooking(null); resetForm(); }}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
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

          <div>
            <DataTable
        columns={columns}
        data={filteredBookings}
        defaultPageSize={perPage}
        pageSizeOptions={[10,25,50,100]}
        onRowClick={(r) => setSelectedBooking(r)}
        searchable={true}
        exportable={true}
        emptyMessage="No bookings found matching your criteria"
      />
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
