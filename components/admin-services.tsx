"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MockAPI, ServiceOption } from "@/lib/mock-api";
import DataTable, { Column } from '@/components/ui/data-table/data-table';
import { useToast } from "@/components/ui/toast";

export function AdminServices() {
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<ServiceOption>>({});
  const toast = useToast();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await MockAPI.getServiceOptions();
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => setForm({});

  const openCreate = () => {
    reset();
    setEditing(false);
    setShowForm(true);
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await MockAPI.createServiceOption({
        name: form.name || '',
        description: form.description || '',
        icon: form.icon || '',
        price: form.price
      });
      await load();
      setShowForm(false);
      toast.showToast({ title: 'Service created', description: `${form.name} created`, type: 'success' });
    } catch (err) {
      console.error(err);
      toast.showToast({ title: 'Create failed', description: String(err), type: 'error' });
    }
  };

  const openEdit = (s: ServiceOption) => {
    setForm({ ...s });
    setEditing(true);
    setShowForm(true);
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id) return;
    try {
      await MockAPI.updateServiceOption(form.id, form as Partial<ServiceOption>);
      await load();
      setEditing(false);
      setShowForm(false);
      reset();
      toast.showToast({ title: 'Service updated', description: `${form.name} updated`, type: 'success' });
    } catch (err) {
      console.error(err);
      toast.showToast({ title: 'Update failed', description: String(err), type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete service option?')) return;
    try {
      await MockAPI.deleteServiceOption(id);
      await load();
      toast.showToast({ title: 'Service deleted', description: `Service ${id} removed`, type: 'success' });
    } catch (err) {
      console.error(err);
      toast.showToast({ title: 'Delete failed', description: String(err), type: 'error' });
    }
  };

  if (loading) return <div>Loading...</div>;

  const columns: Column<ServiceOption>[] = [
    { key: 'icon', header: '', accessor: (s) => s.icon, cell: (s) => (<div className="text-lg">{s.icon}</div>), width: 'w-16' },
    { key: 'name', header: 'Name', accessor: (s) => s.name, cell: (s) => <div className="font-medium">{s.name}</div>, sortable: true },
    { key: 'description', header: 'Description', accessor: (s) => s.description },
    { key: 'price', header: 'Price', accessor: (s) => s.price, cell: (s) => s.price ? `$${s.price}` : '-' , sortable: true },
    { key: 'actions', header: '', cell: (s) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>Edit</Button>
        <Button variant="destructive" size="sm" onClick={() => handleDelete(s.id)}>Delete</Button>
      </div>
    ) }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Service Options</h1>
          <p className="text-muted-foreground">Manage available services</p>
        </div>
        <Button onClick={openCreate}><span className="mr-2">+</span>New Service</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editing ? 'Edit Service' : 'Create Service'}</CardTitle>
            <CardDescription>{editing ? 'Update service option' : 'Add a new service option'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={editing ? submitEdit : submitCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input placeholder="Icon" value={form.icon || ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
                <Input placeholder="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <Input type="number" placeholder="Price" value={form.price?.toString() || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editing ? 'Save changes' : 'Create service'}</Button>
                <Button variant="outline" onClick={() => { setShowForm(false); setEditing(false); reset(); }}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <DataTable columns={columns} data={services} defaultPageSize={9} pageSizeOptions={[9,18,36]} onRowClick={(s) => openEdit(s)} />
    </div>
  );
}
