import { NextResponse } from 'next/server';
import { neonAuth } from '@neondatabase/auth/next/server';
import {
  getOrCreateProfileForUser,
  getAgents,
} from '../../../lib/db-adapter';

export async function GET() {
  try {
    const agents = await getAgents();
    return NextResponse.json({ agents }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
