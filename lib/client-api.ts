export type BookingStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "pending_review";

export type Booking = {
  id: string;
  date: string;
  time?: string;
  createdAt?: string;
  updatedAt?: string;
  status: BookingStatus | string;
  passengerName?: string;
  flightNumber?: string;
  airline?: string;
  terminal?: string | number;
  phone?: string;
  email?: string;
  serviceId?: string;
  shiftId?: string | null;
  assignedAgentId?: string | null;
  totalRevenue?: number;
  serviceFee?: number;
  actualDuration?: number;
  customerSatisfaction?: number;
  [key: string]: any;
};

export type RosterShift = { id: string; date: string; startTime?: string; endTime?: string; agentId?: string | null };
export type Agent = { id: string; name?: string; email?: string; phone?: string; role?: string };
export type ActivityLog = { id: string; bookingId?: string | null; action: string; user?: string; details?: string; createdAt?: string };

interface APIResponse<T = unknown> {
  [key: string]: T;
}

interface BookingUpdatePayload {
  [key: string]: unknown;
}

interface ActivityLogPayload {
  [key: string]: unknown;
}

interface CreateBookingPayload {
  [key: string]: unknown;
}

const okJson = async <T = unknown>(res: Response): Promise<T> => {
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
};

export const ClientAPI = {
  async getBookingById(id: string) {
    const res = await fetch(`/api/bookings/${id}`);
    const data = await okJson(res);
    return data.booking || null;
  },

  async getAvailableShiftsForDate(_: string) {
    // Roster API not implemented yet — return empty array for now
    return [] as RosterShift[];
  },

  async getAgents() {
    const res = await fetch(`/api/profiles`);
    const data = await okJson(res);
    return data.profiles || [];
  },

  async getActivityLogs(limit = 50) {
    const res = await fetch(`/api/activity-logs?limit=${limit}`);
    const data = await okJson(res);
    return data.logs || [];
  },

  async getServiceOptions() {
    const res = await fetch(`/api/services`);
    const data = await okJson(res);
    return data.services || [];
  },

  async getPermissions() {
    // UI-friendly defaults; server should enforce permissions
    return { canCreateBooking: true, canDeleteBooking: true, canUpdateBooking: true };
  },

  async updateBooking(id: string, patch: BookingUpdatePayload) {
    const res = await fetch(`/api/bookings/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    const data = await okJson<APIResponse>(res);
    return data.booking || null;
  },

  async createActivityLog(payload: ActivityLogPayload) {
    const res = await fetch(`/api/activity-logs`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await okJson<APIResponse>(res);
    return data.log;
  },

  async deleteActivityLog(id: string) {
    const res = await fetch(`/api/activity-logs/${id}`, { method: "DELETE" });
    const data = await okJson<APIResponse>(res);
    return data.success === true;
  },

  async assignBookingToShift(bookingId: string, shiftId: string) {
    const res = await fetch(`/api/bookings/${bookingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shiftId }) });
    const data = await okJson<APIResponse>(res);
    return data.booking || null;
  },

  async deleteBooking(id: string) {
    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    const data = await okJson<APIResponse>(res);
    return data.success === true;
  },

  async createBooking(payload: CreateBookingPayload) {
    const res = await fetch(`/api/bookings`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await okJson(res);
    return data.booking;
  },

  async getBookings() {
    const res = await fetch(`/api/bookings`);
    const data = await okJson(res);
    return data.bookings || [];
  },

  async getServiceLifecycleStatus(bookingId: string) {
    const res = await fetch(`/api/service-lifecycle/${bookingId}`);
    const data = await okJson(res);
    return data.status;
  },

  async submitForSupervisorReview(bookingId: string, notes?: string) {
    const res = await fetch(`/api/service-lifecycle/${bookingId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "submit", notes }) });
    const data = await okJson(res);
    return data.booking || null;
  },

  async approveSupervisorReview(bookingId: string, notes?: string) {
    const res = await fetch(`/api/service-lifecycle/${bookingId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "approve", notes }) });
    const data = await okJson(res);
    return data.booking || null;
  },

  async checkAndUpdateServiceLifecycles() {
    const res = await fetch(`/api/service-lifecycle/check`, { method: "POST" });
    const data = await okJson(res);
    return data;
  },

  async getCurrentUser() {
    // No endpoint implemented; return null for now
    return null;
  },
};

export default ClientAPI;
