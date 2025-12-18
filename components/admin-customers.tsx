"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Customer, MockAPI } from "@/lib/mock-api";
import DataTable, { Column } from '@/components/ui/data-table/data-table';
import { formatDateUTC } from '@/lib/utils';
import { Building, Calendar, Mail, MoreHorizontal, Phone } from "lucide-react";
import { useEffect, useState } from "react";

export function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Customer>>({});

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, statusFilter]);

  const loadCustomers = async () => {
    try {
      const data = await MockAPI.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(lowerTerm) ||
        customer.email.toLowerCase().includes(lowerTerm) ||
        customer.company.toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredCustomers(filtered);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleStatusChange = async (customerId: string, newStatus: Customer['status']) => {
    try {
      await MockAPI.updateCustomer(customerId, { status: newStatus });
      await loadCustomers();
    } catch (error) {
      console.error('Error updating customer status:', error);
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
      const payload: any = {
        name: form.name || '',
        email: form.email || '',
        phone: form.phone || '',
        company: form.company || '',
        role: form.role || 'Regular',
        status: (form.status as Customer['status']) || 'active',
        totalBookings: form.totalBookings || 0,
        lastBookingDate: form.lastBookingDate || '',
        notes: form.notes || ''
      };
      await MockAPI.createCustomer(payload);
      await loadCustomers();
      setShowCreate(false);
      resetForm();
    } catch (error) {
      console.error('Error creating customer:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEdit = (customer: Customer) => {
    setForm({ ...customer });
    setEditing(true);
    setShowCreate(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id) return;
    setCreating(true);
    try {
      await MockAPI.updateCustomer(form.id, form as Partial<Customer>);
      await loadCustomers();
      setShowCreate(false);
      setEditing(false);
      resetForm();
    } catch (error) {
      console.error('Error updating customer:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete customer?')) return;
    try {
      await MockAPI.deleteCustomer(id);
      await loadCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </div>
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
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your relationships with passengers and bookers</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <span className="mr-2">+</span>
          Add Customer
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, or company..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      {/* Create/Edit form */}
      {showCreate && (
        <Card>
          <CardContent>
            <form onSubmit={editing ? handleSubmitEdit : handleSubmitCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input placeholder="Company" value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                <Input placeholder="Email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Input placeholder="Phone" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Select value={form.status || 'active'} onValueChange={(v) => setForm({ ...form, status: v as Customer['status'] })}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={creating}>{creating ? 'Saving...' : (editing ? 'Save changes' : 'Create customer')}</Button>
                <Button variant="outline" onClick={() => { setShowCreate(false); setEditing(false); resetForm(); }}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <div>
        <DataTable
          columns={[
            { key: 'avatar', header: '', cell: (c) => (<div className="flex items-center gap-3"><Avatar className="h-8 w-8"><AvatarFallback>{getInitials(c.name)}</AvatarFallback></Avatar></div>), width: 'w-12' },
            { key: 'name', header: 'Name', accessor: (c) => c.name, cell: (c) => (<div><div className="font-medium">{c.name}</div><div className="text-sm text-muted-foreground">{c.role}</div></div>), sortable: true },
            { key: 'company', header: 'Company', accessor: (c) => c.company },
            { key: 'email', header: 'Email', accessor: (c) => c.email },
            { key: 'phone', header: 'Phone', accessor: (c) => c.phone },
            { key: 'bookings', header: 'Bookings', accessor: (c) => c.totalBookings, cell: (c) => <div className="font-semibold">{c.totalBookings}</div>, sortable: true },
            { key: 'last', header: 'Last Booking', accessor: (c) => c.lastBookingDate, cell: (c) => c.lastBookingDate ? formatDateUTC(c.lastBookingDate) : '-' },
            { key: 'actions', header: '', cell: (c) => (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(c)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(c.id)}>Delete</Button>
                <Button variant="outline" size="sm" onClick={() => handleStatusChange(c.id, c.status === 'active' ? 'inactive' : 'active')}>{c.status === 'active' ? 'Deactivate' : 'Activate'}</Button>
              </div>
            ) }
          ] as Column<Customer>[]}
          data={filteredCustomers}
          defaultPageSize={10}
          pageSizeOptions={[10,25,50]}
        />
      </div>
    </div>
  );
}
