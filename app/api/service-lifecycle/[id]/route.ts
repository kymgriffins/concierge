import { NextResponse } from 'next/server';
import { getBookingById } from '../../../../lib/db-adapter';

type BookingStatus = 'new' | 'contacted' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'pending_review';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const booking = await getBookingById(id);
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const currentStatus = booking.status as BookingStatus;

    // Define status flow
    const statusFlow: Record<BookingStatus, BookingStatus[]> = {
      new: ['contacted'],
      contacted: ['confirmed'],
      confirmed: ['in_progress'],
      in_progress: ['completed'],
      completed: [],
      cancelled: [],
      pending_review: ['completed'],
    };

    const nextPossibleStatuses = statusFlow[currentStatus] || [];

    // For simplicity, no auto-transition logic yet
    const canAutoTransition = false;
    const requiresSupervisorApproval = currentStatus === 'pending_review';

    return NextResponse.json({
      currentStatus,
      nextPossibleStatuses,
      canAutoTransition,
      requiresSupervisorApproval,
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { action } = await req.json();
    const booking = await getBookingById(id);
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Handle actions like submit, approve
    // For now, just return success
    return NextResponse.json({ booking }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
