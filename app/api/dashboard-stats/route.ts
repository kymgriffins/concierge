import { NextResponse } from 'next/server';
import {
  getDashboardStats,
} from '../../../lib/db-adapter';

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json({ stats }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
