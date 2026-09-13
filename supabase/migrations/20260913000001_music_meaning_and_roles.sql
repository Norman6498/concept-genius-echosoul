-- ============================================================
-- EchoSoul — Migration 008: Music Meaning AI Pipeline & User Roles
-- ============================================================
-- 1. Table: user_roles (server-authoritative role-based access control)
-- 2. Initial Admin setup for singhpinky2989@gmail.com
-- 3. Table: song_meaning_results (canonical song meanings cache)
-- 4. Table: user_song_reflections (isolated user-specific reflections)
-- 5. RLS policies and performance indexes
-- ============================================================

-- ── 1. User Roles (RBAC) ──────────────────────────────────────
create table if not exists user_roles (
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null check (role in ('admin', 'curator', 'moderator', 'member')),
  created_at  timestamptz not null default now(),
  primary key (user_id, role)
);

create index if not exists user_roles_user_idx on user_roles(user_id);
create index if not exists user_roles_role_idx on user_roles(role);

alter table user_roles enable row level security;

-- Users can inspect their own assigned roles
create policy "Users can view own roles"
  on user_roles for select
  using (auth.uid() = user_id);

-- Helper function to check if a user is an admin server-side
create or replace function public.is_admin(check_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = check_user_id and role = 'admin'
  );
$$;

-- Trigger to automatically assign 'admin' role to primary admin upon registration
create or replace function handle_primary_admin_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(new.email) = 'singhpinky2989@gmail.com' then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_primary_admin_created on auth.users;
create trigger on_primary_admin_created
  after insert or update on auth.users
  for each row execute procedure handle_primary_admin_role();

-- Immediately grant admin role if singhpinky2989@gmail.com already exists in auth.users
do $$
declare
  v_admin_id uuid;
begin
  select id into v_admin_id from auth.users where lower(email) = 'singhpinky2989@gmail.com' limit 1;
  if v_admin_id is not null then
    insert into public.user_roles (user_id, role)
    values (v_admin_id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;
end;
$$;

-- ── 2. Song Meaning Results (Canonical Pipeline Cache) ─────────
create table if not exists song_meaning_results (
  id                        uuid primary key default gen_random_uuid(),
  track_id                  text not null, -- matches MusicTrack id (e.g. track_hi_03)
  status                    text not null default 'GENERATED'
                              check (status in ('PENDING', 'PROCESSING', 'GENERATED', 'NEEDS_REVIEW', 'APPROVED', 'REJECTED', 'FAILED', 'STALE')),
  language                  text not null default 'en',
  meaning_summary           text not null,
  emotional_themes          text[] default '{}',
  emotional_core            text not null,
  narrative_interpretation  text not null,
  key_themes                text[] default '{}',
  cultural_context          text,
  why_it_may_resonate       text not null,
  listener_reflection       text,
  confidence                numeric(3,2) default 0.90,
  source_type               text not null default 'METADATA_ONLY'
                              check (source_type in ('AVAILABLE', 'LICENSED', 'PUBLIC_DOMAIN', 'METADATA_ONLY', 'UNAVAILABLE')),
  source_reference          text,
  model                     text not null default 'openrouter',
  model_version             text not null default '1.0',
  prompt_version            text not null default 'echosoul_meaning_v1',
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  reviewed_at               timestamptz,
  reviewed_by               uuid references auth.users(id) on delete set null,
  error_code                text,
  error_message             text,
  constraint song_meaning_track_lang_key unique (track_id, language)
);

create index if not exists song_meaning_track_idx on song_meaning_results(track_id);
create index if not exists song_meaning_status_idx on song_meaning_results(status);
create index if not exists song_meaning_lang_idx on song_meaning_results(language);

alter table song_meaning_results enable row level security;

-- Read policy: Any authenticated or public user can view generated, approved, or needs_review meanings
create policy "Public can view valid song meanings"
  on song_meaning_results for select
  using (status in ('APPROVED', 'GENERATED', 'NEEDS_REVIEW'));

-- Write policy: Admins have full management privileges
create policy "Admins can manage all song meanings"
  on song_meaning_results for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ── 3. User Song Reflections (Isolated Personalization) ────────
create table if not exists user_song_reflections (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  track_id    text not null,
  reflection  text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint user_song_reflections_user_track_key unique (user_id, track_id)
);

create index if not exists user_song_reflections_user_idx on user_song_reflections(user_id);
create index if not exists user_song_reflections_track_idx on user_song_reflections(track_id);

alter table user_song_reflections enable row level security;

-- Strict isolation: Users can only see and manage their own reflections
create policy "Users own their song reflections"
  on user_song_reflections for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
