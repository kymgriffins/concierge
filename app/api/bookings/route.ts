import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readDB, writeDB } from "../../../lib/json-db";

function parseCookies(cookieHeader: string | null) {
  const map: Record<string, string> = {};
  if (!cookieHeader) return map;
  cookieHeader.split(";").forEach((pair) => {
    const [k, v] = pair.split("=");
    if (k && v) map[k.trim()] = decodeURIComponent(v.trim());
  });
  return map;
}

async function getSession(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie");
  const cookies = parseCookies(cookieHeader);
  const token = cookies["mock_sess"];
  if (!token) return null;
  const db = await readDB();
  const session = (db.sessions || []).find(
    (s: any) => s.token === token && s.expiresAt > Date.now(),
  );
  if (!session) return null;
  const agent = db.agents.find((a: any) => a.id === session.agentId);
  return { session, agent };
}

export async function GET(req: NextRequest) {
  try {
    const db = await readDB();
    return NextResponse.json({ bookings: db.bookings || [] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const res = await getSession(req);
    if (!res)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const { agent } = res;
    if (!["concierge", "supervisor"].includes(agent.role))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const db = await readDB();
    db.bookings = db.bookings || [];

    const newBooking = {
      ...body,
      id: (db.bookings.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [],
    };
    db.bookings.push(newBooking);
    await writeDB(db);

    return NextResponse.json({ booking: newBooking }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
