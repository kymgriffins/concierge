import { NextResponse } from 'next/server';
import { neonAuth } from '@neondatabase/auth/next/server';
import { listProfiles, updateProfileRole, getOrCreateProfileForUser } from '../../../lib/db-adapter';

export async function GET() {
  try {
    const profiles = await listProfiles();
    return NextResponse.json({ profiles }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    // Temporarily bypass auth for development
    // const { session, user } = await neonAuth();
    // if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    // // Map to local profile and check role
    // const current = await getOrCreateProfileForUser({ id: user.id, email: user.email, name: user.name });
    // if (current.role !== 'super_admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { profileId, role } = body;
    if (!profileId || !role) return NextResponse.json({ error: 'Missing profileId or role' }, { status: 400 });

    const updated = await updateProfileRole(profileId, role);
    if (!updated) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    return NextResponse.json({ profile: updated }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
