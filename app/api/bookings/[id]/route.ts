import { NextResponse } from 'next/server';
import { neonAuth } from '@neondatabase/auth/next/server';
import {
  getOrCreateProfileForUser,
  getBookingById,
  updateBookingById,
  deleteBookingById,
} from '../../../../lib/db-adapter';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const booking = await getBookingById(id);
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ booking }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, user } = await neonAuth();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const profile = await getOrCreateProfileForUser({ id: user.id, email: user.email, name: user.name });

    const { id } = await params;
    const existing = await getBookingById(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // All authenticated users can update bookings
    const body = await req.json();
    const updated = await updateBookingById(id, body);
    return NextResponse.json({ booking: updated }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, user } = await neonAuth();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const profile = await getOrCreateProfileForUser({ id: user.id, email: user.email, name: user.name });

    const { id } = await params;
    const existing = await getBookingById(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // All authenticated users can delete bookings
    const ok = await deleteBookingById(id);
    return NextResponse.json({ success: ok }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
