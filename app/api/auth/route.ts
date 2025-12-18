import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { readDB, writeDB } from '../../../lib/json-db';

function createToken() {
  return 'mocksess-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function parseCookies(cookieHeader: string | null) {
  const map: Record<string, string> = {};
  if (!cookieHeader) return map;
  cookieHeader.split(';').forEach(pair => {
    const [k, v] = pair.split('=');
    if (k && v) map[k.trim()] = decodeURIComponent(v.trim());
  });
  return map;
}

export async function POST(req: NextRequest) {
  // login endpoint
  try {
    const body = await req.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'username and password required' }, { status: 400 });
    }

    const db = await readDB();
    const agent = db.agents.find((a: any) => a.username.toLowerCase() === username.toLowerCase() || a.email.toLowerCase() === username.toLowerCase());
    if (!agent || agent.password !== password) {
      return NextResponse.json({ success: false, error: 'invalid credentials' }, { status: 401 });
    }

    const token = createToken();
    const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24h

    db.sessions = db.sessions || [];
    db.sessions.push({ token, agentId: agent.id, expiresAt });
    await writeDB(db);

    const headers = new Headers();
    headers.set('Set-Cookie', `mock_sess=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24}`);

    const publicAgent = { ...agent };
    delete publicAgent.password;

    return NextResponse.json({ success: true, token, user: publicAgent }, { status: 200, headers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // me endpoint: return current user based on cookie
  try {
    const cookieHeader = req.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
    const token = cookies['mock_sess'];
    if (!token) return NextResponse.json({ user: null }, { status: 200 });

    const db = await readDB();
    const session = (db.sessions || []).find((s: any) => s.token === token && s.expiresAt > Date.now());
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    const agent = db.agents.find((a: any) => a.id === session.agentId);
    if (!agent) return NextResponse.json({ user: null }, { status: 200 });
    const publicAgent = { ...agent };
    delete publicAgent.password;
    return NextResponse.json({ user: publicAgent }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ user: null, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  // logout endpoint: clear session
  try {
    const cookieHeader = req.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
    const token = cookies['mock_sess'];

    if (token) {
      const db = await readDB();
      db.sessions = (db.sessions || []).filter((s: any) => s.token !== token);
      await writeDB(db);
    }

    const headers = new Headers();
    headers.set('Set-Cookie', `mock_sess=deleted; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);

    return NextResponse.json({ success: true }, { status: 200, headers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
