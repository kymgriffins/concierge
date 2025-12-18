import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { readDB, writeDB } from '../../../../lib/json-db';

function parseCookies(cookieHeader: string | null) {
  const map: Record<string, string> = {};
  if (!cookieHeader) return map;
  cookieHeader.split(';').forEach(pair => {
    const [k, v] = pair.split('=');
    if (k && v) map[k.trim()] = decodeURIComponent(v.trim());
  });
  return map;
}

async function getSession(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie');
  const cookies = parseCookies(cookieHeader);
  const token = cookies['mock_sess'];
  if (!token) return null;
  const db = await readDB();
  const session = (db.sessions || []).find((s: any) => s.token === token && s.expiresAt > Date.now());
  if (!session) return null;
  const agent = db.agents.find((a: any) => a.id === session.agentId);
  return { session, agent };
}

export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    const db = await readDB();
    const booking = (db.bookings || []).find((b: any) => b.id === params.id) || null;
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ booking }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: any }) {
  try {
    const res = await getSession(req);
    if (!res) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { agent } = res;
    const db = await readDB();

    const idx = (db.bookings || []).findIndex((b: any) => b.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updates = await req.json();

    // If agent role is 'agent', only allow status and notes
    if (agent.role === 'agent') {
      const allowed = ['status', 'notes'];
      const keys = Object.keys(updates);
      const unauthorized = keys.some(k => !allowed.includes(k));
      if (unauthorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    db.bookings[idx] = { ...db.bookings[idx], ...updates, updatedAt: new Date().toISOString() };
    await writeDB(db);
    return NextResponse.json({ booking: db.bookings[idx] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: any }) {
  try {
    const res = await getSession(req);
    if (!res) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { agent } = res;
    if (agent.role !== 'supervisor') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const db = await readDB();
    const idx = (db.bookings || []).findIndex((b: any) => b.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    db.bookings.splice(idx, 1);
    await writeDB(db);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
