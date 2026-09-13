-- ============================================================
-- EchoSoul — Migration 009: 3 Free Music Meaning Trials & Waitlist
-- ============================================================
-- 1. Extend entitlements table with trial counters & waitlist flags
-- 2. Table: user_music_meaning_unlocks (idempotent track-level unlock tracking)
-- 3. Table: premium_waitlist (server-persisted feature waitlists)
-- 4. Atomic PostgreSQL functions:
--    - consume_music_meaning_credit(p_user_id, p_track_id)
--    - get_user_music_meaning_status(p_user_id, p_track_id)
-- 5. Auto-provision trigger for new profiles
-- 6. RLS policies and performance indexes
-- ============================================================

-- ── 1. Extend Entitlements Table ─────────────────────────────
alter table public.entitlements
  add column if not exists music_meaning_free_uses_total integer not null default 3,
  add column if not exists music_meaning_free_uses_used integer not null default 0,
  add column if not exists waitlist_requested boolean not null default false,
  add column if not exists waitlist_requested_at timestamptz;

-- Ensure constraint: used cannot exceed total and cannot be negative
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'entitlements_free_uses_check'
  ) then
    alter table public.entitlements
      add constraint entitlements_free_uses_check
      check (music_meaning_free_uses_used >= 0 and music_meaning_free_uses_used <= music_meaning_free_uses_total);
  end if;
end;
$$;

-- Seed entitlements row for any existing profiles that lack one
insert into public.entitlements (user_id, plan, music_meaning_free_uses_total, music_meaning_free_uses_used)
select id, 'free', 3, 0 from public.profiles
on conflict (user_id) do nothing;

-- Auto-provision trigger for new profiles
create or replace function handle_new_user_entitlement()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.entitlements (user_id, plan, music_meaning_free_uses_total, music_meaning_free_uses_used)
  values (new.id, 'free', 3, 0)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_created_entitlement on public.profiles;
create trigger on_profile_created_entitlement
  after insert on public.profiles
  for each row execute procedure handle_new_user_entitlement();

-- ── 2. Table: user_music_meaning_unlocks ───────────────────────
-- Tracks which tracks a user has unlocked.
-- Ensures a user is NEVER charged twice for looking at the same song.
create table if not exists public.user_music_meaning_unlocks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  track_id    text not null,
  unlocked_at timestamptz not null default now(),
  constraint user_music_meaning_unlocks_user_track unique (user_id, track_id)
);

create index if not exists idx_ummu_user_id on public.user_music_meaning_unlocks(user_id);
create index if not exists idx_ummu_track_id on public.user_music_meaning_unlocks(track_id);

alter table public.user_music_meaning_unlocks enable row level security;

-- Users can inspect their own unlocks; admins can inspect all
drop policy if exists "Users can view own unlocks" on public.user_music_meaning_unlocks;
create policy "Users can view own unlocks"
  on public.user_music_meaning_unlocks for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

-- ── 3. Table: premium_waitlist ─────────────────────────────────
-- Server-persisted waitlist intent.
-- Enforces auth.uid() = user_id and UNIQUE(user_id, feature)
create table if not exists public.premium_waitlist (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  feature       text not null default 'music_meaning_premium',
  requested_at  timestamptz not null default now(),
  notified      boolean not null default false,
  notified_at   timestamptz,
  constraint premium_waitlist_user_feature unique (user_id, feature)
);

create index if not exists idx_pw_user_id on public.premium_waitlist(user_id);
create index if not exists idx_pw_feature on public.premium_waitlist(feature);

alter table public.premium_waitlist enable row level security;

-- Users can view their own waitlist requests; admins can view all
drop policy if exists "Users can view own waitlist" on public.premium_waitlist;
create policy "Users can view own waitlist"
  on public.premium_waitlist for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

-- Users can insert their own waitlist request
drop policy if exists "Users can insert own waitlist" on public.premium_waitlist;
create policy "Users can insert own waitlist"
  on public.premium_waitlist for insert
  with check (auth.uid() = user_id);

-- ── 4. Atomic PostgreSQL Credit Consumption Function ───────────
-- Conceptually: consume_music_meaning_credit(user_id, track_id)
-- 1. Verifies remaining > 0 (or already unlocked or admin/premium)
-- 2. Prevents race conditions across concurrent tabs via FOR UPDATE lock
-- 3. Atomically increments usage by 1 and records unlock
-- 4. Prevents used > total and remaining < 0
-- 5. Safe idempotency: revisiting an unlocked track burns 0 credits
create or replace function public.consume_music_meaning_credit(
  p_user_id uuid,
  p_track_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total int;
  v_used int;
  v_plan text;
  v_is_admin boolean;
  v_already_unlocked boolean;
begin
  -- Check admin authorization
  select exists (
    select 1 from public.user_roles where user_id = p_user_id and role = 'admin'
  ) into v_is_admin;

  -- Ensure user has an entitlement row
  insert into public.entitlements (user_id, plan, music_meaning_free_uses_total, music_meaning_free_uses_used)
  values (p_user_id, 'free', 3, 0)
  on conflict (user_id) do nothing;

  -- Row lock on entitlements to serialize concurrent requests
  select plan, music_meaning_free_uses_total, music_meaning_free_uses_used
  into v_plan, v_total, v_used
  from public.entitlements
  where user_id = p_user_id
  for update;

  -- Check if this specific track was already unlocked by the user
  select exists (
    select 1 from public.user_music_meaning_unlocks
    where user_id = p_user_id and track_id = p_track_id
  ) into v_already_unlocked;

  if v_already_unlocked then
    return jsonb_build_object(
      'success', true,
      'credit_consumed', false,
      'already_unlocked', true,
      'is_premium', (v_is_admin or v_plan in ('premium', 'team')),
      'total', v_total,
      'used', v_used,
      'remaining', greatest(0, v_total - v_used)
    );
  end if;

  -- If user is admin or on premium/team plan, unlock without consuming trial credits
  if v_is_admin or v_plan in ('premium', 'team') then
    insert into public.user_music_meaning_unlocks (user_id, track_id)
    values (p_user_id, p_track_id)
    on conflict (user_id, track_id) do nothing;

    return jsonb_build_object(
      'success', true,
      'credit_consumed', false,
      'already_unlocked', false,
      'is_premium', true,
      'total', v_total,
      'used', v_used,
      'remaining', greatest(0, v_total - v_used)
    );
  end if;

  -- Check if free trial credits are exhausted
  if v_used >= v_total then
    return jsonb_build_object(
      'success', false,
      'credit_consumed', false,
      'already_unlocked', false,
      'is_premium', false,
      'error', 'trial_exhausted',
      'total', v_total,
      'used', v_used,
      'remaining', 0
    );
  end if;

  -- Atomically increment used and record unlock
  update public.entitlements
  set music_meaning_free_uses_used = music_meaning_free_uses_used + 1,
      updated_at = now()
  where user_id = p_user_id;

  insert into public.user_music_meaning_unlocks (user_id, track_id)
  values (p_user_id, p_track_id)
  on conflict (user_id, track_id) do nothing;

  return jsonb_build_object(
    'success', true,
    'credit_consumed', true,
    'already_unlocked', false,
    'is_premium', false,
    'total', v_total,
    'used', v_used + 1,
    'remaining', v_total - (v_used + 1)
  );
end;
$$;

-- ── 5. Status Helper Function ──────────────────────────────────
create or replace function public.get_user_music_meaning_status(
  p_user_id uuid,
  p_track_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total int;
  v_used int;
  v_plan text;
  v_is_admin boolean;
  v_already_unlocked boolean := false;
  v_waitlist_requested boolean := false;
begin
  select exists (
    select 1 from public.user_roles where user_id = p_user_id and role = 'admin'
  ) into v_is_admin;

  insert into public.entitlements (user_id, plan, music_meaning_free_uses_total, music_meaning_free_uses_used)
  values (p_user_id, 'free', 3, 0)
  on conflict (user_id) do nothing;

  select plan, music_meaning_free_uses_total, music_meaning_free_uses_used, waitlist_requested
  into v_plan, v_total, v_used, v_waitlist_requested
  from public.entitlements
  where user_id = p_user_id;

  if p_track_id is not null then
    select exists (
      select 1 from public.user_music_meaning_unlocks
      where user_id = p_user_id and track_id = p_track_id
    ) into v_already_unlocked;
  end if;

  return jsonb_build_object(
    'is_admin', v_is_admin,
    'is_premium', (v_is_admin or v_plan in ('premium', 'team')),
    'plan', coalesce(v_plan, 'free'),
    'total', coalesce(v_total, 3),
    'used', coalesce(v_used, 0),
    'remaining', greatest(0, coalesce(v_total, 3) - coalesce(v_used, 0)),
    'already_unlocked', v_already_unlocked,
    'waitlist_requested', coalesce(v_waitlist_requested, false)
  );
end;
$$;
