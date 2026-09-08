-- ============================================================
-- EchoSoul — Migration 001: Foundation Schema
-- ============================================================
-- Tables: profiles, user_settings, sessions, messages, context_snapshots
-- Extensions: pgcrypto, vector (pgvector)
-- RLS: enabled on all user-owned tables
-- ============================================================

-- ── Extensions ────────────────────────────────────────────────────────────
-- pgcrypto: gen_random_uuid() and password hashing utilities
create extension if not exists pgcrypto;

-- vector: pgvector for embedding storage and similarity search
-- Requires pgvector to be enabled in your Supabase project settings
-- (Dashboard → Extensions → vector)
create extension if not exists vector;

-- ── Profiles ─────────────────────────────────────────────────────────────
-- One row per authenticated user. Created via trigger on auth.users.
create table if not exists profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  display_name          text,
  preferred_language    text not null default 'en',
  preferred_support_style text not null default 'adaptive',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Auto-create a profile when a new user signs up
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── User Settings ─────────────────────────────────────────────────────────
create table if not exists user_settings (
  user_id                   uuid primary key references profiles(id) on delete cascade,
  voice_enabled             boolean not null default true,
  memory_mode               text not null default 'hybrid'
                              check (memory_mode in ('hybrid','automatic','manual','off')),
  default_private_session   boolean not null default false,
  notification_preferences  jsonb not null default '{}'::jsonb,
  visual_preferences        jsonb not null default '{}'::jsonb,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

-- ── Sessions ──────────────────────────────────────────────────────────────
-- A conversation session. is_private sessions produce no memory.
create table if not exists sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  mode        text not null default 'balanced'
                check (mode in ('balanced','just_listen','reflect','plan','creative','perspective')),
  is_private  boolean not null default false,
  started_at  timestamptz not null default now(),
  ended_at    timestamptz,
  summary     text,
  language    text,
  created_at  timestamptz not null default now()
);

create index if not exists sessions_user_id_idx on sessions(user_id, started_at desc);

-- ── Messages ─────────────────────────────────────────────────────────────
create table if not exists messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references sessions(id) on delete cascade,
  role        text not null check (role in ('user','assistant','system')),
  content     text not null,
  language    text,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists messages_session_idx on messages(session_id, created_at asc);

-- ── Context Snapshots ────────────────────────────────────────────────────
-- Structured emotional context extracted by the AI from each turn.
-- Never contains raw message content — only derived schema fields.
create table if not exists context_snapshots (
  id                  uuid primary key default gen_random_uuid(),
  session_id          uuid not null references sessions(id) on delete cascade,
  primary_emotion     text,
  secondary_emotions  text[] not null default '{}',
  situation           text,
  triggers            text[] not null default '{}',
  core_thought        text,
  need                text,
  intensity           smallint check (intensity between 0 and 10),
  support_mode        text check (support_mode in ('listen','reflect','literature','creative','plan','perspective')),
  people              jsonb not null default '[]'::jsonb,
  unresolved_thread   text,
  positive_movement   text,
  safety_level        smallint not null default 0 check (safety_level between 0 and 5),
  raw_model           jsonb,
  created_at          timestamptz not null default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────

alter table profiles enable row level security;
alter table user_settings enable row level security;
alter table sessions enable row level security;
alter table messages enable row level security;
alter table context_snapshots enable row level security;

-- profiles: users can only read/write their own row
create policy "profiles: owner access"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- user_settings: owner only
create policy "user_settings: owner access"
  on user_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- sessions: owner only
create policy "sessions: owner access"
  on sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- messages: accessible only through session ownership
create policy "messages: owner via session"
  on messages for all
  using (
    exists (
      select 1 from sessions s
      where s.id = messages.session_id
        and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from sessions s
      where s.id = messages.session_id
        and s.user_id = auth.uid()
    )
  );

-- context_snapshots: owner via session
create policy "context_snapshots: owner via session"
  on context_snapshots for all
  using (
    exists (
      select 1 from sessions s
      where s.id = context_snapshots.session_id
        and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from sessions s
      where s.id = context_snapshots.session_id
        and s.user_id = auth.uid()
    )
  );
