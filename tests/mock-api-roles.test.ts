import { describe, it, expect, beforeEach } from "vitest";
import { MockAPI } from "@/lib/mock-api";

describe("MockAPI role-based permissions", () => {
  beforeEach(async () => {
    // ensure a fresh session
    await MockAPI.logout();
  });

  it("prevents agent from creating bookings", async () => {
    const res = await MockAPI.login("annabelle@airport.com", "pw");
    expect(res.success).toBe(true);
    await expect(
      MockAPI.createBooking({
        passengerName: "Test",
        company: "X",
        phone: "1",
        email: "a@b.com",
        flightNumber: "T1",
        airline: "X",
        date: "2025-01-01",
        time: "12:00",
        passengerCount: 1,
        services: [],
        specialRequests: "",
        status: "new",
        source: "manual",
      } as any),
    ).rejects.toThrow(/Forbidden/);
  });

  it("allows concierge to create bookings", async () => {
    const res = await MockAPI.login("waithera@airport.com", "pw");
    expect(res.success).toBe(true);
    const b = await MockAPI.createBooking({
      passengerName: "Concierge Test",
      company: "Y",
      phone: "1",
      email: "b@b.com",
      flightNumber: "C1",
      airline: "Y",
      date: "2025-01-02",
      time: "15:00",
      passengerCount: 1,
      services: [],
      specialRequests: "",
      status: "new",
      source: "manual",
    } as any);
    expect(b).toBeDefined();
  });

  it("agent may update status but not other fields", async () => {
    await MockAPI.login("annabelle@airport.com", "pw");
    // create a booking as concierge first
    await MockAPI.login("waithera@airport.com", "pw");
    const created = await MockAPI.createBooking({
      passengerName: "ToUpdate",
      company: "Z",
      phone: "1",
      email: "c@c.com",
      flightNumber: "U1",
      airline: "Z",
      date: "2025-01-03",
      time: "16:00",
      passengerCount: 1,
      services: [],
      specialRequests: "",
      status: "new",
      source: "manual",
    } as any);
    await MockAPI.login("annabelle@airport.com", "pw");
    // allowed: status
    const ok = await MockAPI.updateBooking(created.id, {
      status: "contacted",
    } as any);
    expect(ok?.status).toBe("contacted");
    // forbidden: passengerName
    await expect(
      MockAPI.updateBooking(created.id, { passengerName: "Hacker" } as any),
    ).rejects.toThrow(/Forbidden/);
  });

  it("impersonate helper sets current user", async () => {
    const a = await MockAPI.impersonate("s1");
    expect(a).toBeDefined();
    const u = await MockAPI.getCurrentUser();
    expect(u?.id).toBe("s1");
    expect(u?.role).toBe("supervisor");
  });
});
