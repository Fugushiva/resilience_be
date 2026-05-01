-- ============================================================
-- Resilience.be / Survikit — Initial Schema
-- Run this in Supabase SQL Editor or via supabase db push
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── PROFILES ───────────────────────────────────────────────
-- Future auth: links to Supabase auth.users via id
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Use (select auth.uid()) for init-plan optimization (avoids per-row re-evaluation)
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING ((select auth.uid()) = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING ((select auth.uid()) = id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = id);


-- ─── KITS ───────────────────────────────────────────────────
-- Stores computed kit results as JSONB
-- share_id is a URL-friendly unique slug for public sharing
CREATE TABLE IF NOT EXISTS kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  share_id TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(8), 'hex'),

  -- The full kit result as JSONB (profile, categories, totals)
  items JSONB NOT NULL DEFAULT '{}',

  -- Denormalized metadata for queries without JSONB parsing
  scenario TEXT,
  total_eur NUMERIC(10,2),
  total_weight_kg NUMERIC(10,2),
  essential_count INTEGER,
  coverage_hours INTEGER,
  persons INTEGER,

  -- Anonymous session tracking (before auth exists)
  session_id TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE kits ENABLE ROW LEVEL SECURITY;

-- Anyone can read a kit by share_id (public sharing)
CREATE POLICY "kits_select_by_share" ON kits
  FOR SELECT USING (true);

-- Allow anonymous and authenticated inserts (user_id optional)
CREATE POLICY "kits_insert_own" ON kits
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id OR user_id IS NULL);

CREATE POLICY "kits_update_own" ON kits
  FOR UPDATE USING ((select auth.uid()) = user_id OR user_id IS NULL);

CREATE POLICY "kits_delete_own" ON kits
  FOR DELETE USING ((select auth.uid()) = user_id);


-- ─── LEADS ──────────────────────────────────────────────────
-- Email capture for newsletter / follow-up
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  kit_id UUID REFERENCES kits(id) ON DELETE SET NULL,
  source TEXT DEFAULT 'kit_result',
  ip_hash TEXT,
  consent_given BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Anonymous inserts allowed, but must have consent + valid email
CREATE POLICY "leads_insert_anon" ON leads
  FOR INSERT WITH CHECK (
    consent_given = true
    AND email IS NOT NULL
    AND length(email) > 3
  );

-- Authenticated users can read leads linked to their kits (future)
CREATE POLICY "leads_select_own" ON leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM kits k
      WHERE k.id = leads.kit_id
      AND k.user_id = (select auth.uid())
    )
  );


-- ─── INDEXES ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_kits_share_id ON kits(share_id);
CREATE INDEX IF NOT EXISTS idx_kits_user_id ON kits(user_id);
CREATE INDEX IF NOT EXISTS idx_kits_session_id ON kits(session_id);
CREATE INDEX IF NOT EXISTS idx_kits_created_at ON kits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_kit_id ON leads(kit_id);


-- ─── UPDATED_AT TRIGGER ────────────────────────────────────
-- search_path locked to '' to prevent SQL injection via search_path mutable
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_kits_updated_at
  BEFORE UPDATE ON kits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
