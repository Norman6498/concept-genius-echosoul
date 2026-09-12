-- ============================================================
-- EchoSoul — Migration 005: Profiles Schema Remediation & Strict RLS
-- ============================================================
-- 1. Adds missing full_name, role, and interests to public.profiles
-- 2. Synchronizes full_name with display_name for existing profiles
-- 3. Adds user_id to messages with backfill from sessions
-- 4. Hardens Row Level Security (RLS) on messages and moments with strict user isolation
-- ============================================================

-- ── 1. Fix Profiles Schema Drift ─────────────────────────────
alter table public.profiles
  add column if not exists full_name text,
  add column if not exists role text,
  add column if not exists interests text[] not null default '{}',
  add column if not exists current_focus text,
  add column if not exists current_mood text;

-- Backfill full_name from display_name if missing
update public.profiles
set full_name = display_name
where full_name is null and display_name is not null;

-- ── 2. Add user_id directly to messages for fast indexed RLS ──
alter table public.messages
  add column if not exists user_id uuid references public.profiles(id) on delete cascade;

-- Backfill user_id from sessions if any exist
update public.messages m
set user_id = s.user_id
from public.sessions s
where m.session_id = s.id and m.user_id is null;

create index if not exists messages_user_idx on public.messages(user_id, created_at desc);

-- ── 3. Strict Row-Level Security for Messages ─────────────────
alter table public.messages enable row level security;

drop policy if exists "Users can view own messages" on public.messages;
drop policy if exists "Users can insert own messages" on public.messages;
drop policy if exists "messages: user isolation select" on public.messages;
drop policy if exists "messages: user isolation insert" on public.messages;
drop policy if exists "messages: user isolation update" on public.messages;
drop policy if exists "messages: user isolation delete" on public.messages;
drop policy if exists "messages: owner via session" on public.messages;

create policy "messages: user isolation select" on public.messages
  for select using (
    auth.uid() = user_id or
    exists (select 1 from public.sessions s where s.id = messages.session_id and s.user_id = auth.uid())
  );

create policy "messages: user isolation insert" on public.messages
  for insert with check (
    auth.uid() = user_id or
    exists (select 1 from public.sessions s where s.id = messages.session_id and s.user_id = auth.uid())
  );

create policy "messages: user isolation update" on public.messages
  for update using (
    auth.uid() = user_id or
    exists (select 1 from public.sessions s where s.id = messages.session_id and s.user_id = auth.uid())
  ) with check (
    auth.uid() = user_id or
    exists (select 1 from public.sessions s where s.id = messages.session_id and s.user_id = auth.uid())
  );

create policy "messages: user isolation delete" on public.messages
  for delete using (
    auth.uid() = user_id or
    exists (select 1 from public.sessions s where s.id = messages.session_id and s.user_id = auth.uid())
  );

-- ── 4. Strict Row-Level Security for Moments ──────────────────
alter table public.moments enable row level security;

drop policy if exists "Users can view own moments" on public.moments;
drop policy if exists "Users can insert own moments" on public.moments;
drop policy if exists "moments: user isolation select" on public.moments;
drop policy if exists "moments: user isolation insert" on public.moments;
drop policy if exists "moments: user isolation update" on public.moments;
drop policy if exists "moments: user isolation delete" on public.moments;
drop policy if exists "moments: owner only" on public.moments;

create policy "moments: user isolation select" on public.moments
  for select using (auth.uid() = user_id);

create policy "moments: user isolation insert" on public.moments
  for insert with check (auth.uid() = user_id);

create policy "moments: user isolation update" on public.moments
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "moments: user isolation delete" on public.moments
  for delete using (auth.uid() = user_id);
