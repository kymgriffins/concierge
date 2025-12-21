import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock data removed - using empty implementations

export async function GET(req: NextRequest, { params }: { params: any }) {
  // Mock data removed - return not found
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function PUT(req: NextRequest, { params }: { params: any }) {
  // Mock data removed - return error
  return NextResponse.json({ error: 'Mock data removed - functionality disabled' }, { status: 501 });
}

export async function DELETE(req: NextRequest, { params }: { params: any }) {
  // Mock data removed - return error
  return NextResponse.json({ error: 'Mock data removed - functionality disabled' }, { status: 501 });
}
