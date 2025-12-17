"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MockAPI, TaskItem, Agent, Booking } from "@/lib/mock-api";

export function AdminTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<Partial<TaskItem>>({ status: 'open' });

  useEffect(() => { load(); loadAgents(); loadBookings(); }, []);

  const load = async () => {
    try {
      const data = await MockAPI.getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const loadAgents = async () => { try { setAgents(await MockAPI.getAgents()); } catch (err) { console.error(err); } };
  const loadBookings = async () => { try { setBookings(await MockAPI.getBookings('all', 200)); } catch (err) { console.error(err); } };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await MockAPI.createTask(form as Omit<TaskItem, 'id' | 'createdAt'>);
      setFormOpen(false);
      setForm({ status: 'open' });
      await load();
    } catch (err) { console.error(err); }
  };

  const updateStatus = async (id: string, status: TaskItem['status']) => {
    try { await MockAPI.updateTask(id, { status }); await load(); } catch (err) { console.error(err); }
  };

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks & Assignments</h1>
          <p className="text-muted-foreground">Create tasks and assign them to agents</p>
        </div>
        <div>
          <Button onClick={() => setFormOpen(true)}>New Task</Button>
        </div>
      </div>

      {formOpen && (
        <Card>
          <CardHeader>
            <CardTitle>New Task</CardTitle>
            <CardDescription>Assign an action to an agent</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input placeholder="Title" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input placeholder="Due (ISO)" type="datetime-local" value={form.dueDate || ''} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              <Select value={form.assignedTo || ''} onValueChange={(v) => setForm({ ...form, assignedTo: v })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {agents.map(a => <SelectItem value={a.id} key={a.id}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={form.relatedBookingId || ''} onValueChange={(v) => setForm({ ...form, relatedBookingId: v })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No booking</SelectItem>
                  {bookings.map(b => <SelectItem value={b.id} key={b.id}>{b.passengerName} • {b.flightNumber}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input placeholder="Status" value={form.status || 'open'} onChange={(e) => setForm({ ...form, status: e.target.value as TaskItem['status'] })} />
              <Input placeholder="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="flex gap-2">
                <Button type="submit">Create</Button>
                <Button variant="outline" onClick={() => { setFormOpen(false); setForm({ status: 'open' }); }}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {tasks.map(t => (
          <Card key={t.id}>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t.title}</div>
                <div className="text-sm text-muted-foreground">Assigned to: {agents.find(a => a.id === t.assignedTo)?.name || 'Unassigned'}</div>
                {t.relatedBookingId && <div className="text-sm">Related: {bookings.find(b => b.id === t.relatedBookingId)?.passengerName}</div>}
              </div>
              <div className="flex items-center gap-2">
                <Select value={t.status} onValueChange={(v) => updateStatus(t.id, v as TaskItem['status'])}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={async () => { await MockAPI.deleteTask(t.id); await load(); }}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdminTasks;
