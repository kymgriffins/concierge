import { NextResponse } from 'next/server';
import { neonAuth } from '@neondatabase/auth/next/server';
import { deleteProfile, getOrCreateProfileForUser } from '../../../../lib/db-adapter';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Temporarily bypass auth for development
    // const { session, user } = await neonAuth();
    // if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    // const current = await getOrCreateProfileForUser({ id: user.id, email: user.email, name: user.name });
    // if (current.role !== 'super_admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const profileId = params.id;
    const ok = await deleteProfile(profileId);
    if (!ok) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
