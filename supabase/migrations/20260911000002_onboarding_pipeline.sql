-- ============================================================
-- EchoSoul — Migration 005: Complete Onboarding & Personalization Pipeline
-- ============================================================
-- Tables created/updated:
-- 1. user_interests (category, interest per user)
-- 2. user_goals (reasons for joining EchoSoul per user)
-- 3. current_user_state (current_mood, overall_vibe)
-- 4. user_context (life_stage, current_focus, aspirations, context, custom_interests)
-- 5. user_settings extension (support_style, response_style, literature_preferences, music_preferences, etc.)
-- Strict Row Level Security (RLS) enabled on all tables
-- ============================================================

-- ── 1. User Interests ──────────────────────────────────────────
create table if not exists public.user_interests (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  category    text not null,
  interest    text not null,
  created_at  timestamptz not null default now(),
  unique(user_id, category, interest)
);

create index if not exists user_interests_user_idx on public.user_interests(user_id, category);

alter table public.user_interests enable row level security;

create policy "user_interests: owner access"
  on public.user_interests for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── 2. User Goals ──────────────────────────────────────────────
create table if not exists public.user_goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  goal        text not null,
  created_at  timestamptz not null default now(),
  unique(user_id, goal)
);

create index if not exists user_goals_user_idx on public.user_goals(user_id);

alter table public.user_goals enable row level security;

create policy "user_goals: owner access"
  on public.user_goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── 3. Current User State ──────────────────────────────────────
create table if not exists public.current_user_state (
  user_id       uuid primary key references public.profiles(id) on delete cascade,
  current_mood  text,
  overall_vibe  text,
  updated_at    timestamptz not null default now()
);

alter table public.current_user_state enable row level security;

create policy "current_user_state: owner access"
  on public.current_user_state for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── 4. User Context / World Profile ────────────────────────────
create table if not exists public.user_context (
  user_id           uuid primary key references public.profiles(id) on delete cascade,
  life_stage        text,
  current_focus     text,
  aspirations       text,
  context           text,
  custom_interests  text,
  updated_at        timestamptz not null default now()
);

alter table public.user_context enable row level security;

create policy "user_context: owner access"
  on public.user_context for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── 5. User Settings Extensions ────────────────────────────────
alter table public.user_settings
  add column if not exists support_style text default 'gentle',
  add column if not exists response_style text default 'reflective',
  add column if not exists literature_preferences text[] not null default '{}',
  add column if not exists music_preferences text[] not null default '{}',
  add column if not exists theme text default 'cinematic_dark',
  add column if not exists environment text default 'twilight_mountain',
  add column if not exists reduced_motion boolean not null default false;
