"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MockAPI, ServiceOption } from "@/lib/mock-api";

export function AdminServices() {
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<ServiceOption>>({});

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
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete service option?')) return;
    try {
      await MockAPI.deleteServiceOption(id);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(s => (
          <Card key={s.id} className="hover:shadow-md">
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="text-lg">{s.icon}</div>
                    <div>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-sm text-muted-foreground">{s.description}</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(s.id)}>Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
