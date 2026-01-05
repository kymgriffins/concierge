import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

interface ProfileRow {
  id: string;
  user_id: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface BookingPayload {
  traveler_name?: string;
  passengerName?: string;
  traveler_email?: string;
  email?: string;
  traveler_phone?: string;
  phone?: string;
  service_id?: string;
  communication_channel?: string;
  flight_date?: string;
  date?: string;
  flight_number?: string;
  flightNumber?: string;
  airport?: string;
  flight_type?: string;
  flightType?: string;
  special_requests?: string;
  specialRequests?: string;
  status?: string;
  assigned_agent_profile_id?: string;
}

interface ServiceData {
  slug: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  active?: boolean;
}

interface ActivityLogData {
  bookingId?: string;
  actorProfileId?: string;
  action: string;
  message: string;
  meta?: Record<string, unknown>;
}

interface MessageData {
  bookingId?: string;
  profileId?: string;
  channel: string;
  origin: string;
  content: string;
  metadata?: Record<string, unknown>;
}

function mapProfileRow(row: ProfileRow): ProfileRow {
  return {
    id: row.id,
    user_id: row.user_id,
    role: row.role,
    name: row.name,
    email: row.email,
    phone: row.phone,
    created_at: row.created_at,
  };
}

export async function getOrCreateProfileForUser(user: { id?: string; email?: string; name?: string }) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT * FROM profiles WHERE user_id = $1 OR email = $2 LIMIT 1`,
      [user.id || null, user.email || null],
    );
    if (res.rowCount > 0) return mapProfileRow(res.rows[0]);

    const role = process.env.SUPER_ADMIN_EMAIL && user.email === process.env.SUPER_ADMIN_EMAIL ? 'super_admin' : 'traveler';
    const insert = await client.query(
      `INSERT INTO profiles (user_id, role, name, email, phone, created_at) VALUES ($1, $2, $3, $4, $5, now()) RETURNING *`,
      [user.id || null, role, user.name || user.email || 'Guest', user.email || null, null],
    );
    return mapProfileRow(insert.rows[0]);
  } finally {
    client.release();
  }
}

export async function listBookingsForProfile(profile: ProfileRow | null) {
  const client = await pool.connect();
  try {
    if (!profile) {
      const res = await client.query(`SELECT * FROM bookings ORDER BY created_at DESC LIMIT 1000`);
      return res.rows;
    }
    if (profile.role === 'super_admin' || profile.role === 'agent') {
      const res = await client.query(`SELECT * FROM bookings ORDER BY created_at DESC LIMIT 1000`);
      return res.rows;
    }
    const res = await client.query(
      `SELECT * FROM bookings WHERE created_by = $1 OR traveler_email = $2 ORDER BY created_at DESC`,
      [profile.id, profile.email || null],
    );
    return res.rows;
  } finally {
    client.release();
  }
}

export async function createBookingForProfile(profile: ProfileRow | null, payload: BookingPayload) {
  const client = await pool.connect();
  try {
    const query = `INSERT INTO bookings (
      traveler_profile_id, traveler_name, traveler_email, traveler_phone, service_id, communication_channel,
      flight_date, flight_number, airport, flight_type, special_requests, status, assigned_agent_profile_id, created_at, updated_at, created_by
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13, now(), now(), $14) RETURNING *`;
    const vals = [
      profile?.id || null,
      payload.traveler_name || payload.passengerName || null,
      payload.traveler_email || payload.email || null,
      payload.traveler_phone || payload.phone || null,
      payload.service_id || null,
      payload.communication_channel || null,
      payload.flight_date || payload.date || null,
      payload.flight_number || payload.flightNumber || null,
      payload.airport || null,
      payload.flight_type || payload.flightType || null,
      payload.special_requests || payload.specialRequests || null,
      payload.status || 'pending',
      payload.assigned_agent_profile_id || null,
      profile?.id || null,
    ];
    const res = await client.query(query, vals);
    return res.rows[0];
  } finally {
    client.release();
  }
}

export async function getBookingById(id: string) {
  const client = await pool.connect();
  try {
    const res = await client.query(`SELECT * FROM bookings WHERE id = $1 LIMIT 1`, [id]);
    return res.rowCount ? res.rows[0] : null;
  } finally {
    client.release();
  }
}

export async function updateBookingById(id: string, patch: Partial<BookingPayload>) {
  const client = await pool.connect();
  try {
    const fields: string[] = [];
    const vals: any[] = [];
    let idx = 1;
    const allowed = [
      'traveler_name', 'traveler_email', 'traveler_phone', 'flight_date', 'flight_number', 'airport', 'flight_type',
      'special_requests', 'status', 'assigned_agent_profile_id', 'service_id', 'communication_channel'
    ];
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(patch, k)) {
        fields.push(`${k} = $${idx++}`);
        vals.push((patch as any)[k]);
      }
    }
    if (fields.length === 0) return await getBookingById(id);
    fields.push(`updated_at = now()`);
    const q = `UPDATE bookings SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    vals.push(id);
    const res = await client.query(q, vals);
    return res.rowCount ? res.rows[0] : null;
  } finally {
    client.release();
  }
}

export async function deleteBookingById(id: string) {
  const client = await pool.connect();
  try {
    const res = await client.query(`DELETE FROM bookings WHERE id = $1`, [id]);
    return res.rowCount > 0;
  } finally {
    client.release();
  }
}

export async function listProfiles() {
  const client = await pool.connect();
  try {
    const res = await client.query(`SELECT id, id as user_id, email, raw_user_meta_data->>'name' as name, raw_user_meta_data->>'phone' as phone, raw_user_meta_data->>'role' as role, created_at FROM auth.users ORDER BY created_at DESC`);
    return res.rows.map(row => ({
      id: row.user_id,
      user_id: row.user_id,
      role: row.role || 'traveler',
      name: row.name || row.email || 'Guest',
      email: row.email,
      phone: row.phone,
      created_at: row.created_at,
    }));
  } finally {
    client.release();
  }
}

export async function updateProfileRole(profileId: string, role: string) {
  const client = await pool.connect();
  try {
    await client.query(`UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || $2::jsonb WHERE id = $1`, [profileId, JSON.stringify({ role })]);
    const res = await client.query(`SELECT id, id as user_id, email, raw_user_meta_data->>'name' as name, raw_user_meta_data->>'phone' as phone, raw_user_meta_data->>'role' as role, created_at FROM auth.users WHERE id = $1`, [profileId]);
    if (res.rowCount === 0) return null;
    const row = res.rows[0];
    return {
      id: row.user_id,
      user_id: row.user_id,
      role: row.role || 'traveler',
      name: row.name || row.email || 'Guest',
      email: row.email,
      phone: row.phone,
      created_at: row.created_at,
    };
  } finally {
    client.release();
  }
}

export async function deleteProfile(profileId: string) {
  // Since we're not using profiles table, perhaps just return true or update metadata
  return true;
}

// Services functions
export async function getServices() {
  const client = await pool.connect();
  try {
    const res = await client.query(`SELECT * FROM services WHERE active = true ORDER BY name`);
    return res.rows;
  } finally {
    client.release();
  }
}

export async function getServiceById(id: string) {
  const client = await pool.connect();
  try {
    const res = await client.query(`SELECT * FROM services WHERE id = $1`, [id]);
    return res.rowCount ? res.rows[0] : null;
  } finally {
    client.release();
  }
}

export async function createService(service: ServiceData) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `INSERT INTO services (slug, name, description, icon, price, active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [service.slug, service.name, service.description, service.icon, service.price, service.active ?? true]
    );
    return res.rows[0];
  } finally {
    client.release();
  }
}

export async function updateService(id: string, updates: Partial<ServiceData>) {
  const client = await pool.connect();
  try {
    const fields: string[] = [];
    const vals: any[] = [];
    let idx = 1;
    for (const k of ['slug', 'name', 'description', 'icon', 'price', 'active'] as const) {
      if (Object.prototype.hasOwnProperty.call(updates, k)) {
        fields.push(`${k} = $${idx++}`);
        vals.push(updates[k]);
      }
    }
    if (fields.length === 0) return await getServiceById(id);
    fields.push(`updated_at = now()`);
    const q = `UPDATE services SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    vals.push(id);
    const res = await client.query(q, vals);
    return res.rowCount ? res.rows[0] : null;
  } finally {
    client.release();
  }
}

export async function deleteService(id: string) {
  const client = await pool.connect();
  try {
    const res = await client.query(`DELETE FROM services WHERE id = $1`, [id]);
    return res.rowCount > 0;
  } finally {
    client.release();
  }
}

// Activity logs functions
export async function getActivityLogs(bookingId?: string, limit = 50) {
  const client = await pool.connect();
  try {
    let query = `SELECT al.*, p.name as actor_name FROM activity_logs al LEFT JOIN profiles p ON al.actor_profile_id = p.id`;
    const vals: any[] = [];
    if (bookingId) {
      query += ` WHERE al.booking_id = $1`;
      vals.push(bookingId);
    }
    query += ` ORDER BY al.created_at DESC LIMIT $${vals.length + 1}`;
    vals.push(limit);
    const res = await client.query(query, vals);
    return res.rows;
  } finally {
    client.release();
  }
}

export async function createActivityLog(log: ActivityLogData) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `INSERT INTO activity_logs (booking_id, actor_profile_id, action, message, meta) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [log.bookingId, log.actorProfileId, log.action, log.message, log.meta || {}]
    );
    return res.rows[0];
  } finally {
    client.release();
  }
}

// Agents (profiles with role 'agent' or 'admin')
export async function getAgents() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT
        au.id,
        au.id as user_id,
        au.email,
        au.raw_user_meta_data->>'name' as name,
        au.raw_user_meta_data->>'phone' as phone,
        au.created_at,
        COALESCE(p.role, 'traveler') as role
      FROM auth.users au
      LEFT JOIN profiles p ON au.id = p.user_id
      WHERE COALESCE(p.role, 'traveler') IN ('agent', 'admin', 'super_admin')
      ORDER BY COALESCE(au.raw_user_meta_data->>'name', au.email) ASC
    `);
    return res.rows.map(row => ({
      id: row.user_id,
      user_id: row.user_id,
      role: row.role,
      name: row.name || row.email || 'Guest',
      email: row.email,
      phone: row.phone,
      created_at: row.created_at,
    }));
  } finally {
    client.release();
  }
}

// Travelers (profiles with role 'traveler')
export async function getTravelers() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT
        au.id,
        au.id as user_id,
        au.email,
        au.raw_user_meta_data->>'name' as name,
        au.raw_user_meta_data->>'phone' as phone,
        au.created_at,
        COALESCE(p.role, 'traveler') as role
      FROM auth.users au
      LEFT JOIN profiles p ON au.id = p.user_id
      WHERE COALESCE(p.role, 'traveler') = 'traveler'
      ORDER BY COALESCE(au.raw_user_meta_data->>'name', au.email) ASC
    `);
    return res.rows.map(row => ({
      id: row.user_id,
      user_id: row.user_id,
      role: row.role,
      name: row.name || row.email || 'Guest',
      email: row.email,
      phone: row.phone,
      created_at: row.created_at,
    }));
  } finally {
    client.release();
  }
}

// Messages functions
export async function getMessages(bookingId?: string, limit = 50) {
  const client = await pool.connect();
  try {
    let query = `SELECT m.*, p.name as profile_name FROM messages m LEFT JOIN profiles p ON m.profile_id = p.id`;
    const vals: any[] = [];
    if (bookingId) {
      query += ` WHERE m.booking_id = $1`;
      vals.push(bookingId);
    }
    query += ` ORDER BY m.created_at DESC LIMIT $${vals.length + 1}`;
    vals.push(limit);
    const res = await client.query(query, vals);
    return res.rows;
  } finally {
    client.release();
  }
}

export async function createMessage(message: MessageData) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `INSERT INTO messages (booking_id, profile_id, channel, origin, content, metadata) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [message.bookingId, message.profileId, message.channel, message.origin, message.content, message.metadata || {}]
    );
    return res.rows[0];
  } finally {
    client.release();
  }
}

// Dashboard stats
export async function getDashboardStats() {
  const client = await pool.connect();
  try {
    const [bookingsRes, pendingRes] = await Promise.all([
      client.query(`SELECT COUNT(*) as total FROM bookings`),
      client.query(`SELECT COUNT(*) as pending FROM bookings WHERE status = 'pending'`)
    ]);
    return {
      totalBookings: parseInt(bookingsRes.rows[0].total),
      pendingBookings: parseInt(pendingRes.rows[0].pending),
    };
  } finally {
    client.release();
  }
}

// Sessions helper used by app/api/sessions
export async function getSessionByToken(token: string) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT s.*, p.id as agent_id, p.name as agent_name, p.email as agent_email, p.role as agent_role
       FROM sessions s LEFT JOIN profiles p ON p.id = s.agent_profile_id WHERE s.token = $1 AND s.expires_at > now() LIMIT 1`,
      [token],
    );
    if (!res.rowCount) return null;
    const row = res.rows[0];
    return {
      session: {
        id: row.id,
        token: row.token,
        expires_at: row.expires_at,
        data: row.data,
        created_at: row.created_at,
      },
      agent: row.agent_id ? { id: row.agent_id, name: row.agent_name, email: row.agent_email, role: row.agent_role } : null,
    };
  } finally {
    client.release();
  }
}

export async function listSessions() {
  const client = await pool.connect();
  try {
    const res = await client.query(`SELECT * FROM sessions ORDER BY created_at DESC`);
    return res.rows;
  } finally {
    client.release();
  }
}

export default {};
