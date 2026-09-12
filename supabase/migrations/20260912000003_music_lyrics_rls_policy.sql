-- ============================================================
-- EchoSoul — Migration 008: Music Lyrics Row Level Security Policy
-- ============================================================
-- Resolution for Supabase Database Linter: rls_enabled_no_policy (0008_rls_enabled_no_policy)
-- Table `public.music_lyrics` had RLS enabled in Migration 004,
-- but the corresponding SELECT policy was inadvertently omitted.
-- ============================================================

-- Ensure RLS is active on public.music_lyrics
alter table if exists public.music_lyrics enable row level security;

-- Drop if previously exists to allow clean idempotent re-runs
drop policy if exists "Public can view music lyrics" on public.music_lyrics;

-- Allow public read access to music lyrics (consistent with music_tracks, books, etc.)
-- Writes remain strictly restricted to the service role.
create policy "Public can view music lyrics"
  on public.music_lyrics
  for select
  using (true);
