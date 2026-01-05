import { NextResponse } from 'next/server';
import { neonAuth } from '@neondatabase/auth/next/server';
import {
  getOrCreateProfileForUser,
  getServices,
  createService,
} from '../../../lib/db-adapter';

export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json({ services }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { session, user } = await neonAuth();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const profile = await getOrCreateProfileForUser({ id: user.id, email: user.email, name: user.name });
    // All authenticated users can create services
    const body = await req.json();
    const service = await createService(body);
    return NextResponse.json({ service }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
