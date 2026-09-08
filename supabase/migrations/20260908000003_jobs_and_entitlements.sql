-- ============================================================
-- EchoSoul — Migration 003: Jobs, Entitlements & Audit
-- ============================================================
-- Tables: creative_jobs, goals, habits, entitlements, audit_events
-- Storage buckets: documented here; created via Supabase Dashboard
--                  or Storage API (see docs/SUPABASE.md)
-- RLS: enabled on all tables
-- ============================================================

-- ── Creative Jobs ─────────────────────────────────────────────────────────
-- Async jobs for scene/animation/video generation.
-- Status machine: queued → processing → completed | failed | cancelled
create table if not exists creative_jobs (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references profiles(id) on delete cascade,
  moment_id         uuid references moments(id) on delete set null,
  job_type          text not null check (job_type in ('animation','scene','video','image')),
  status            text not null default 'queued'
                      check (status in ('queued','processing','completed','failed','cancelled')),
  input_spec        jsonb not null,   -- concept description — never user PII
  provider_job_id   text,             -- external provider job reference
  output_url        text,             -- private storage URL when complete
  error_message     text,
  attempts          integer not null default 0,
  created_at        timestamptz not null default now(),
  started_at        timestamptz,
  completed_at      timestamptz
);

create index if not exists creative_jobs_user_idx on creative_jobs(user_id, created_at desc);
create index if not exists creative_jobs_status_idx on creative_jobs(status)
  where status in ('queued','processing');

-- ── Goals ────────────────────────────────────────────────────────────────
create table if not exists goals (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  title         text not null,
  description   text,
  status        text not null default 'active'
                  check (status in ('active','paused','completed','abandoned')),
  created_at    timestamptz not null default now(),
  completed_at  timestamptz
);

create index if not exists goals_user_idx on goals(user_id, created_at desc);

-- ── Habits ────────────────────────────────────────────────────────────────
create table if not exists habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  title       text not null,
  cadence     text check (cadence in ('daily','weekly','custom')),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── Entitlements ──────────────────────────────────────────────────────────
-- Server-authoritative plan record. Clients receive this via a secure view
-- or RPC, never via a direct join they could manipulate.
-- IMPORTANT: Safety features must NEVER be gated behind entitlements.
create table if not exists entitlements (
  user_id       uuid primary key references profiles(id) on delete cascade,
  plan          text not null default 'free'
                  check (plan in ('free','premium','team')),
  valid_until   timestamptz,
  usage         jsonb not null default '{}'::jsonb,  -- usage counters
  updated_at    timestamptz not null default now()
);

-- ── Audit Events ─────────────────────────────────────────────────────────
-- Server-append-only. Clients may NOT insert/update/delete audit records.
-- Used for: account deletion, memory edits, data exports, safety events.
-- object_id stores the referenced row UUID; object_type is the table name.
create table if not exists audit_events (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references profiles(id) on delete set null,
  event_type    text not null,
  object_type   text,
  object_id     uuid,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists audit_events_user_idx on audit_events(user_id, created_at desc);
create index if not exists audit_events_type_idx on audit_events(event_type, created_at desc);

-- ── Row Level Security ────────────────────────────────────────────────────

alter table creative_jobs enable row level security;
alter table goals enable row level security;
alter table habits enable row level security;
alter table entitlements enable row level security;
alter table audit_events enable row level security;

-- creative_jobs: owner only
create policy "creative_jobs: owner access"
  on creative_jobs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- goals: owner only
create policy "goals: owner access"
  on goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- habits: owner only
create policy "habits: owner access"
  on habits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- entitlements: owner read-only (server writes via service-role key)
create policy "entitlements: owner read"
  on entitlements for select
  using (auth.uid() = user_id);

-- audit_events: owner read-only (server appends via service-role key)
create policy "audit_events: owner read"
  on audit_events for select
  using (auth.uid() = user_id);

-- ── Journey Events (placeholder for Stage 5) ─────────────────────────────
-- Temporal events from the user's story timeline.
-- Created here as a placeholder; populated in Stage 5 (Novel of You).
create table if not exists journey_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  moment_id   uuid references moments(id) on delete set null,
  event_date  date,
  title       text not null,
  description text,
  emotion     text,
  created_at  timestamptz not null default now()
);

alter table journey_events enable row level security;

create policy "journey_events: owner access"
  on journey_events for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKETS — Intended Architecture
-- ============================================================
-- Buckets must be created via the Supabase Dashboard or Storage API.
-- All personal user data buckets are PRIVATE by default.
--
-- Intended buckets (see docs/SUPABASE.md for access policies):
--
-- user-media        PRIVATE  Profile photos, user-uploaded files
-- generated-scenes  PRIVATE  AI-generated scene images
-- generated-videos  PRIVATE  AI-generated video outputs
-- generated-audio   PRIVATE  TTS audio, experience audio
-- literature-assets PRIVATE  Controlled literature assets (rights & provenance gated)
--
-- Storage bucket policies are configured via Supabase Dashboard →
-- Storage → Policies, or via the Supabase CLI.
-- See docs/SUPABASE.md for the full storage policy specification.
-- ============================================================
