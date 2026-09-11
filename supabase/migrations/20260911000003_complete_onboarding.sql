-- ============================================================
-- EchoSoul — Migration 000003: Complete Onboarding & Theme System
-- ============================================================

-- 1. Extend user_context with Step 3 (Your World) columns
alter table if exists public.user_context
  add column if not exists where_you_live text,
  add column if not exists custom_focus text,
  add column if not exists environment_tone text,
  add column if not exists people_around text,
  add column if not exists world_notes text,
  add column if not exists visual_world text default 'mountain_calm',
  add column if not exists daily_schedule text default 'balanced';

-- 2. Extend user_settings with Step 4 (Preferences) and Step 5 (Appearance) columns
alter table if exists public.user_settings
  add column if not exists support_style text default 'balanced',
  add column if not exists overwhelmed_helper text default 'words',
  add column if not exists response_depth text default 'thoughtful',
  add column if not exists memory_preference text default 'remember',
  add column if not exists theme text default 'midnight_soul',
  add column if not exists accent_color text default '#F2D78A',
  add column if not exists background_environment text default 'cozy_room',
  add column if not exists layout_mode text default 'focused',
  add column if not exists font_style text default 'serif',
  add column if not exists ambient_animations boolean default true,
  add column if not exists enable_music boolean default false,
  add column if not exists time_based_env boolean default true,
  add column if not exists reduced_motion boolean default false;

-- 3. Ensure RLS policies exist
alter table if exists public.user_context enable row level security;
alter table if exists public.user_settings enable row level security;
