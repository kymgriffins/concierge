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

-- Services catalogue: the services travellers can request
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  price NUMERIC(10,2),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- Bookings / Requests
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  traveler_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  traveler_name TEXT,
  traveler_email TEXT,
  traveler_phone TEXT,
  -- which service the traveler requested (references services table)
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  -- where the traveler sent the concierge request from: email|whatsapp|call|app|sms
  communication_channel TEXT,
  -- who created this booking (local profile id)
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
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

-- Messages: records of inbound messages or requests from travellers
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  channel TEXT, -- email | whatsapp | call | app | sms
  origin TEXT, -- optional raw origin identifier (e.g. phone number, email)
  content TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sessions (simple device/session store used by the mock backend)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  agent_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_bookings_flight_date ON bookings(flight_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel);

-- Row Level Security (RLS) helper functions and policies
-- These functions attempt to read JWT claims provided by Neon Auth integration.
-- They try multiple current_setting keys used by various proxy setups.

-- Returns the JWT 'sub' claim as UUID when available
CREATE OR REPLACE FUNCTION current_user_id() RETURNS uuid AS $$
DECLARE
  claims_text text;
  subj text;
BEGIN
  claims_text := current_setting('jwt.claims', true);
  IF claims_text IS NULL THEN
    claims_text := current_setting('neon.jwt.claims', true);
  END IF;
  IF claims_text IS NULL THEN
    claims_text := current_setting('request.jwt.claims', true);
  END IF;
  IF claims_text IS NULL THEN
    RETURN NULL;
  END IF;
  BEGIN
    subj := (claims_text::json ->> 'sub');
    RETURN subj::uuid;
  EXCEPTION WHEN others THEN
    RETURN NULL;
  END;
END;
$$ LANGUAGE plpgsql STABLE;

-- Map current user's Neon Auth user_id to a local profile id (if one exists)
CREATE OR REPLACE FUNCTION current_profile_id() RETURNS uuid AS $$
DECLARE
  uid uuid;
BEGIN
  uid := current_user_id();
  IF uid IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN (SELECT id FROM profiles WHERE user_id = uid LIMIT 1);
END;
$$ LANGUAGE plpgsql STABLE;

-- Convenience: is the current user an admin according to profiles.role
CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean AS $$
DECLARE p uuid; BEGIN
  p := current_profile_id();
  IF p IS NULL THEN RETURN false; END IF;
  RETURN EXISTS (SELECT 1 FROM profiles WHERE id = p AND role = 'admin');
END; $$ LANGUAGE plpgsql STABLE;

-- Enable RLS and create policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_select_policy ON profiles FOR SELECT USING (user_id = current_user_id() OR is_admin());
CREATE POLICY profiles_update_policy ON profiles FOR UPDATE USING (user_id = current_user_id() OR is_admin()) WITH CHECK (user_id = current_user_id() OR is_admin());
CREATE POLICY profiles_insert_policy ON profiles FOR INSERT WITH CHECK (user_id = current_user_id() OR is_admin());
CREATE POLICY profiles_delete_policy ON profiles FOR DELETE USING (is_admin());

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY bookings_select_policy ON bookings FOR SELECT USING (
  traveler_profile_id = current_profile_id() OR assigned_agent_profile_id = current_profile_id() OR is_admin()
);
CREATE POLICY bookings_update_policy ON bookings FOR UPDATE USING (
  traveler_profile_id = current_profile_id() OR assigned_agent_profile_id = current_profile_id() OR is_admin()
) WITH CHECK (
  traveler_profile_id = current_profile_id() OR assigned_agent_profile_id = current_profile_id() OR is_admin()
);
CREATE POLICY bookings_insert_policy ON bookings FOR INSERT WITH CHECK (
  traveler_profile_id = current_profile_id() OR is_admin()
);
CREATE POLICY bookings_delete_policy ON bookings FOR DELETE USING (is_admin());

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY activity_logs_select_policy ON activity_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM bookings b WHERE b.id = activity_logs.booking_id AND (
      b.traveler_profile_id = current_profile_id() OR b.assigned_agent_profile_id = current_profile_id()
    )
  ) OR is_admin()
);
CREATE POLICY activity_logs_insert_policy ON activity_logs FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM bookings b WHERE b.id = activity_logs.booking_id AND (
      b.traveler_profile_id = current_profile_id() OR b.assigned_agent_profile_id = current_profile_id()
    )
  ) OR is_admin()
);
CREATE POLICY activity_logs_delete_policy ON activity_logs FOR DELETE USING (is_admin());

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY payments_select_policy ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM bookings b WHERE b.id = payments.booking_id AND (
    b.traveler_profile_id = current_profile_id() OR b.assigned_agent_profile_id = current_profile_id()
  )) OR is_admin()
);
CREATE POLICY payments_insert_policy ON payments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM bookings b WHERE b.id = payments.booking_id AND (
    b.traveler_profile_id = current_profile_id() OR b.assigned_agent_profile_id = current_profile_id()
  )) OR is_admin()
);
CREATE POLICY payments_delete_policy ON payments FOR DELETE USING (is_admin());

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY notifications_select_policy ON notifications FOR SELECT USING (
  profile_id = current_profile_id() OR is_admin()
);
CREATE POLICY notifications_insert_policy ON notifications FOR INSERT WITH CHECK (
  profile_id = current_profile_id() OR is_admin()
);
CREATE POLICY notifications_delete_policy ON notifications FOR DELETE USING (is_admin());

