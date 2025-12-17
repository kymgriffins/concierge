"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Customer, MockAPI } from "@/lib/mock-api";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No customers found matching your criteria.</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(customer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{customer.name}</h3>
                      <Badge variant={customer.role === 'VIP' ? 'default' : 'secondary'} className="mt-1">
                        {customer.role}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => alert('View profile coming soon')}>View Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenEdit(customer)}>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(customer.id)}>Delete</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(customer.id, customer.status === 'active' ? 'inactive' : 'active')}>
                        {customer.status === 'active' ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Building className="h-4 w-4 mr-2" />
                    <span className="truncate">{customer.company}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{customer.phone}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t flex justify-between items-center text-sm">
                  <div>
                    <span className="block text-muted-foreground text-xs">Total Bookings</span>
                    <span className="font-semibold">{customer.totalBookings}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-muted-foreground text-xs">Last Booking</span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {customer.lastBookingDate}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
