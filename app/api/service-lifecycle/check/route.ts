import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // For now, return no updates
    return NextResponse.json({
      updatedBookings: 0,
      message: 'No auto-transitions needed'
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
