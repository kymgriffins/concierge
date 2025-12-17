import { describe, it, expect } from 'vitest';
import { MockAPI } from '@/lib/mock-api';

describe('MockAPI basic operations', () => {
  it('can create and delete a booking', async () => {
    const before = await MockAPI.getBookings('all', 100);
    const payload = {
      passengerName: 'Test User',
      company: 'Test Co',
      phone: '123',
      email: 'test@example.com',
      flightNumber: 'TST 100',
      airline: 'TestAir',
      date: '2025-12-18',
      time: '12:00',
      terminal: 'T1',
      passengerCount: 1,
      services: [],
      specialRequests: '',
      status: 'new' as const,
      source: 'manual' as const,
    };

    const created = await MockAPI.createBooking(payload as any);
    expect(created).toBeDefined();

    const after = await MockAPI.getBookings('all', 200);
    expect(after.length).toBeGreaterThan(before.length);

    const deleted = await MockAPI.deleteBooking(created.id);
    expect(deleted).toBe(true);
  });
});
