-- ============================================================
-- EchoSoul — Migration 004: Onboarding & Personalization
-- ============================================================
-- Adds personalization columns to profiles and user_settings
-- to store user answers from Page 03 Onboarding (About You).
-- ============================================================

-- 1. Profiles Table Extension
alter table public.profiles
  add column if not exists age_range text,
  add column if not exists role text,
  add column if not exists goals text[] not null default '{}',
  add column if not exists current_focus text,
  add column if not exists current_mood text,
  add column if not exists onboarding_step integer not null default 1,
  add column if not exists onboarding_completed boolean not null default false;

-- 2. Index for quick retrieval
create index if not exists profiles_onboarding_step_idx on public.profiles(onboarding_step);

-- 3. User Settings Personalization jsonb fallback
alter table public.user_settings
  add column if not exists personalization jsonb not null default '{}'::jsonb;
