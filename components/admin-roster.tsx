"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MockAPI, RosterShift, Agent } from "@/lib/mock-api";

export function AdminRoster() {
  const [roster, setRoster] = useState<RosterShift[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<Partial<RosterShift>>({ date: new Date().toISOString().split('T')[0], shift: 'morning' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => { load(); loadAgents(); }, []);

  const load = async () => {
    try {
      const data = await MockAPI.getRoster();
      setRoster(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAgents = async () => {
    try { const a = await MockAPI.getAgents(); setAgents(a); } catch (err) { console.error(err); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await MockAPI.updateRosterShift(editingId, form as Partial<RosterShift>);
      } else {
        await MockAPI.createRosterShift(form as Omit<RosterShift, 'id'>);
      }
      setFormOpen(false);
      setEditingId(null);
      setForm({ date: new Date().toISOString().split('T')[0], shift: 'morning' });
      await load();
    } catch (err) { console.error(err); }
  };

  const edit = (r: RosterShift) => { setFormOpen(true); setEditingId(r.id); setForm({ ...r }); };

  const remove = async (id: string) => {
    if (!confirm('Delete shift?')) return;
    await MockAPI.deleteRosterShift(id);
    await load();
  };

  if (loading) return <div>Loading roster...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Duty Roster</h1>
          <p className="text-muted-foreground">Schedule staff shifts and assign responsibilities</p>
        </div>
        <div>
          <Button onClick={() => setFormOpen(true)}>Add shift</Button>
        </div>
      </div>

      {formOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit shift' : 'Create shift'}</CardTitle>
            <CardDescription>Assign agent to a date and shift</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input type="date" value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <Select value={form.shift || 'morning'} onValueChange={(v) => setForm({ ...form, shift: v as RosterShift['shift'] })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
              <Select value={form.agentId || ''} onValueChange={(v) => setForm({ ...form, agentId: v })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {agents.map(a => <SelectItem value={a.id} key={a.id}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input placeholder="Notes" value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <div />
              <div className="flex gap-2">
                <Button type="submit">Save</Button>
                <Button variant="outline" onClick={() => { setFormOpen(false); setEditingId(null); setForm({ date: new Date().toISOString().split('T')[0], shift: 'morning' }); }}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {roster.map(r => (
          <Card key={r.id}>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="font-medium">{r.date} • {r.shift}</div>
                <div className="text-sm text-muted-foreground">Assigned: {agents.find(a => a.id === r.agentId)?.name || r.agentId}</div>
                {r.notes && <div className="text-sm">{r.notes}</div>}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => edit(r)}>Edit</Button>
                <Button variant="destructive" onClick={() => remove(r.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdminRoster;
