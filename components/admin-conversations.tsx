"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MockAPI, IncomingMessage, Booking } from "@/lib/mock-api";
import { formatDateTimeUTC } from '@/lib/utils';
import DataTable, { Column } from '@/components/ui/data-table/data-table';
import { useToast } from "@/components/ui/toast";
import DateTimePicker from "@/components/ui/date-time-picker";

export function AdminConversations() {
  const [messages, setMessages] = useState<IncomingMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSource, setFilterSource] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<IncomingMessage | null>(null);
  const [creating, setCreating] = useState(false);
  const [parsed, setParsed] = useState<Partial<Booking>>({});
  const toast = useToast();

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const data = await MockAPI.getIncomingMessages(100);
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = messages.filter(m => (filterSource === 'all' || m.source === filterSource) && (
    !search || m.message.toLowerCase().includes(search.toLowerCase()) || (m.senderName || '').toLowerCase().includes(search.toLowerCase())
  ));

  const columns: Column<IncomingMessage>[] = [
    { key: 'sender', header: 'Sender', accessor: (m) => m.senderName || m.senderContact, cell: (m) => (<div><div className="font-medium">{m.senderName || m.senderContact}</div><div className="text-sm text-muted-foreground">{m.senderContact}</div></div>), sortable: true },
    { key: 'message', header: 'Message', accessor: (m) => m.message, cell: (m) => <div className="text-sm">{m.message}</div> },
    { key: 'source', header: 'Source', accessor: (m) => m.source, sortable: true },
    { key: 'receivedAt', header: 'Received', accessor: (m) => m.receivedAt, cell: (m) => formatDateTimeUTC(m.receivedAt), sortable: true },
    { key: 'processed', header: 'Processed', accessor: (m) => m.processed, cell: (m) => m.processed ? 'Yes' : 'No' },
    { key: 'actions', header: '', cell: (m) => (
      <div className="flex gap-2">
        <Button onClick={() => parseMessageToBooking(m)}>Parse & Book</Button>
        <Button variant="outline" onClick={async () => { await MockAPI.markMessageProcessed(m.id, !m.processed); await load(); }}>{m.processed ? 'Unmark' : 'Mark'}</Button>
        <Button variant="ghost" onClick={() => { setSelected(m); setParsed({}); }}>View</Button>
      </div>
    ) }
  ];

  const parseMessageToBooking = (msg: IncomingMessage) => {
    // Simple heuristics for mock parsing: extract date YYYY-MM-DD and time HH:MM and flight code
    const dateMatch = msg.message.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
    const timeMatch = msg.message.match(/\b(\d{1,2}:\d{2})\b/);
    const flightMatch = msg.message.match(/([A-Z]{2}\s?\d{2,4})/i);

    const parsed: Partial<Booking> = {
      passengerName: msg.senderName || 'Unknown',
      phone: msg.senderContact || '',
      email: '',
      flightNumber: flightMatch ? flightMatch[0].replace(/\s+/g, ' ').toUpperCase() : '',
      date: dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0],
      time: timeMatch ? timeMatch[1] : '00:00',
      company: '',
      airline: '',
      passengerCount: 1,
      serviceId: '',
      specialRequests: msg.message,
      status: 'new',
      source: (msg.source === 'whatsapp' || msg.source === 'email') ? msg.source : 'manual'
    };

    setParsed(parsed);
    setSelected(msg);
  };

  const createBookingFromMessage = async () => {
    if (!selected) return;
    setCreating(true);
    try {
      // Minimal payload required by MockAPI.createBooking
      const payload: any = {
        passengerName: parsed.passengerName || selected.senderName || 'Guest',
        company: parsed.company || '',
        phone: parsed.phone || selected.senderContact || '',
        email: parsed.email || '',
        flightNumber: parsed.flightNumber || '',
        airline: parsed.airline || '',
        date: parsed.date || new Date().toISOString().split('T')[0],
        time: parsed.time || '00:00',
        terminal: '',
        passengerCount: parsed.passengerCount || 1,
        serviceId: parsed.serviceId || '',
        specialRequests: parsed.specialRequests || '',
        status: parsed.status || 'new',
        source: parsed.source || 'manual'
      };

      const booking = await MockAPI.createBooking(payload);
      await MockAPI.createActivityLog({ bookingId: booking.id, action: 'Booking created from message', user: 'Agent', details: `Created from message ${selected.id}` });
      await MockAPI.markMessageProcessed(selected.id, true);
      await load();
      setSelected(null);
      setParsed({});
      toast.showToast({ title: 'Booking created', description: `Created ${booking.passengerName}`, type: 'success' });
    } catch (err) {
      console.error(err);
      toast.showToast({ title: 'Create failed', description: String(err), type: 'error' });
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div>Loading conversations...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Incoming Conversations</h1>
          <p className="text-muted-foreground">Messages from WhatsApp, Email, Calls - convert to bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Search messages or sender..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable columns={columns} data={filtered} defaultPageSize={10} pageSizeOptions={[5,10,20]} onRowClick={(r) => setSelected(r)} />

      {selected && (
        <Card>
          <CardHeader>
            <CardTitle>Create booking from message</CardTitle>
            <CardDescription>Message from {selected.senderName || selected.senderContact}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder="Passenger name" value={parsed.passengerName || ''} onChange={(e) => setParsed({ ...parsed, passengerName: e.target.value })} />
              <Input placeholder="Phone" value={parsed.phone || ''} onChange={(e) => setParsed({ ...parsed, phone: e.target.value })} />
              <Input placeholder="Flight number" value={parsed.flightNumber || ''} onChange={(e) => setParsed({ ...parsed, flightNumber: e.target.value })} />
              <DateTimePicker date={parsed.date || null} time={parsed.time || null} onChange={(d, t) => setParsed({ ...parsed, date: d || '', time: t || '' })} />
              <Input placeholder="Special requests" value={parsed.specialRequests || ''} onChange={(e) => setParsed({ ...parsed, specialRequests: e.target.value })} />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={createBookingFromMessage} disabled={creating}>{creating ? 'Creating...' : 'Create Booking'}</Button>
              <Button variant="outline" onClick={() => { setSelected(null); setParsed({}); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AdminConversations;
