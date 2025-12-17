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

describe('MockAPI messages, roster and tasks', () => {
  it('can list and mark incoming messages processed', async () => {
    const messages = await MockAPI.getIncomingMessages();
    expect(messages.length).toBeGreaterThan(0);
    const m = await MockAPI.createIncomingMessage({ source: 'sms', message: 'Test message', senderContact: '000' });
    expect(m).toBeDefined();
    const updated = await MockAPI.markMessageProcessed(m.id, true);
    expect(updated?.processed).toBe(true);
  });

  it('can create and manage roster shifts', async () => {
    const before = await MockAPI.getRoster();
    const s = await MockAPI.createRosterShift({ date: '2025-12-20', shift: 'night', agentId: 'a1', notes: 'Test' });
    expect(s).toBeDefined();
    const updated = await MockAPI.updateRosterShift(s.id, { notes: 'Updated' });
    expect(updated?.notes).toBe('Updated');
    const deleted = await MockAPI.deleteRosterShift(s.id);
    expect(deleted).toBe(true);
    const after = await MockAPI.getRoster();
    expect(after.length).toBeGreaterThanOrEqual(before.length);
  });

  it('can create and manage tasks', async () => {
    const t = await MockAPI.createTask({ title: 'Test Task', status: 'open', createdAt: new Date().toISOString() } as any);
    expect(t).toBeDefined();
    const u = await MockAPI.updateTask(t.id, { status: 'in_progress' });
    expect(u?.status).toBe('in_progress');
    const d = await MockAPI.deleteTask(t.id);
    expect(d).toBe(true);
  });
});
