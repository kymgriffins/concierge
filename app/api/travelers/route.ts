import { NextResponse } from 'next/server';
import { neonAuth } from '@neondatabase/auth/next/server';
import {
  getOrCreateProfileForUser,
  getTravelers,
} from '../../../lib/db-adapter';

export async function GET() {
  try {
    const travelers = await getTravelers();
    return NextResponse.json({ travelers }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
