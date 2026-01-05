import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionByToken, listSessions } from '../../../lib/db-adapter';

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
  const token = cookies["sess"];
  if (!token) return null;
  return await getSessionByToken(token);
}

export async function GET(req: NextRequest) {
  try {
    const res = await getSession(req);
    if (!res)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!res.agent || res.agent.role !== "supervisor")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const sessions = await listSessions();
    return NextResponse.json({ sessions: sessions || [] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
