import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock data removed - using empty implementations

export async function GET(req: NextRequest) {
  // Return empty bookings array
  return NextResponse.json({ bookings: [] }, { status: 200 });
}

export async function POST(req: NextRequest) {
  // Mock data removed - return error
  return NextResponse.json({ error: 'Mock data removed - functionality disabled' }, { status: 501 });
}
