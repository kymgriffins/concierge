import { NextResponse } from 'next/server';
import { neonAuth } from '@neondatabase/auth/next/server';
import {
  getOrCreateProfileForUser,
  listBookingsForProfile,
  createBookingForProfile,
} from '../../../lib/db-adapter';

export async function GET() {
  try {
    const { session, user } = await neonAuth();
    const profile = user ? await getOrCreateProfileForUser({ id: user.id, email: user.email, name: user.name }) : null;
    const bookings = await listBookingsForProfile(profile);
    return NextResponse.json({ bookings }, { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { session, user } = await neonAuth();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const profile = await getOrCreateProfileForUser({ id: user.id, email: user.email, name: user.name });
    // allow agents and travellers to create bookings; stricter rules can be added
    const body = await req.json();
    const booking = await createBookingForProfile(profile, body);
    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
