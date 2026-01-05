"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${id}`);
      const data = await res.json();
      setBooking(data.booking || null);
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  async function save() {
    if (!booking) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(booking) });
      if (!res.ok) throw new Error('Save failed');
      await load();
      alert('Saved');
    } catch (err) { console.error(err); alert('Save failed'); }
    setSaving(false);
  }

  async function remove() {
    if (!confirm('Delete booking?')) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      router.push('/admin/manage/bookings');
    } catch (err) { console.error(err); alert('Delete failed'); }
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (!booking) return <div className="p-6">Booking not found</div>;

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Booking #{booking.id}</h1>
      <div className="space-y-3">
        <label className="block">Passenger
          <input className="border p-2 w-full" value={booking.passengerName || ''} onChange={e => setBooking({ ...booking, passengerName: e.target.value })} />
        </label>
        <label className="block">Flight
          <input className="border p-2 w-full" value={booking.flightNumber || ''} onChange={e => setBooking({ ...booking, flightNumber: e.target.value })} />
        </label>
        <label className="block">Date
          <input type="date" className="border p-2 w-full" value={booking.date || ''} onChange={e => setBooking({ ...booking, date: e.target.value })} />
        </label>
        <label className="block">Time
          <input type="time" className="border p-2 w-full" value={booking.time || ''} onChange={e => setBooking({ ...booking, time: e.target.value })} />
        </label>
        <div className="flex gap-2">
          <button onClick={save} className="btn" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <button onClick={remove} className="btn btn-danger">Delete</button>
          <button onClick={() => router.push('/admin/manage/bookings')} className="btn">Back</button>
        </div>
      </div>
    </div>
  );
}
