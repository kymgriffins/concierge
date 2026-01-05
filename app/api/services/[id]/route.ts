import { NextResponse } from 'next/server';
import { neonAuth } from '@neondatabase/auth/next/server';
import {
  getOrCreateProfileForUser,
  getServiceById,
  updateService,
  deleteService,
} from '../../../../lib/db-adapter';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const service = await getServiceById(id);
    if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ service }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, user } = await neonAuth();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const profile = await getOrCreateProfileForUser({ id: user.id, email: user.email, name: user.name });
    // Only admins can update services
    if (profile.role !== 'admin' && profile.role !== 'super_admin')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const existing = await getServiceById(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await req.json();
    const updated = await updateService(id, body);
    return NextResponse.json({ service: updated }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, user } = await neonAuth();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const profile = await getOrCreateProfileForUser({ id: user.id, email: user.email, name: user.name });
    // Only admins can delete services
    if (profile.role !== 'admin' && profile.role !== 'super_admin')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const existing = await getServiceById(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const ok = await deleteService(id);
    return NextResponse.json({ success: ok }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
