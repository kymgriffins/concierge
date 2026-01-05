import { NextResponse } from 'next/server';
import { neonAuth } from '@neondatabase/auth/next/server';
import {
  getOrCreateProfileForUser,
  getActivityLogs,
  createActivityLog,
} from '../../../lib/db-adapter';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const bookingId = url.searchParams.get('bookingId');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    const logs = await getActivityLogs(bookingId || undefined, limit);
    return NextResponse.json({ logs }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { session, user } = await neonAuth();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const profile = await getOrCreateProfileForUser({ id: user.id, email: user.email, name: user.name });

    const body = await req.json();
    const log = await createActivityLog({
      ...body,
      actorProfileId: profile.id,
    });
    return NextResponse.json({ log }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
