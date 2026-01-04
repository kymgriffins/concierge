-- Willis Protocol Concierge MVP schema for Neon (Postgres)
-- Apply with: psql "$DATABASE_URL" -f db/schema.sql

-- Enable pgcrypto for uuid generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users: rely on Neon Auth's users table (auth.users). We'll store light profile links.
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL, -- optional link to auth.users (Neon Auth)
  role TEXT NOT NULL DEFAULT 'traveler', -- traveler | agent | admin
  name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bookings / Requests
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  traveler_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  traveler_name TEXT,
  traveler_email TEXT,
  traveler_phone TEXT,
  flight_date DATE NOT NULL,
  flight_number TEXT,
  airport TEXT,
  flight_type TEXT, -- arrival | departure | transit
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | active | complete | cancelled
  assigned_agent_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activity logs for bookings
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  actor_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT,
  message TEXT,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Optional payments provisioning (Stripe session IDs, status)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  amount NUMERIC(10,2),
  currency TEXT DEFAULT 'USD',
  stripe_session_id TEXT,
  status TEXT DEFAULT 'pending', -- pending | paid | failed
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications/logs for auditing
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  type TEXT,
  payload JSONB,
  sent_at TIMESTAMPTZ
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_bookings_flight_date ON bookings(flight_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- MVP security: grant basic privileges to PUBLIC for quick dev iteration.
-- NOTE: For production, lock this down and enable RLS policies tied to Neon Auth claims.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO PUBLIC;
