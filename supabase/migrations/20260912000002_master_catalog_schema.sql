-- ============================================================
-- EchoSoul — Migration 007: Master Content & Geographic Catalog
-- ============================================================
-- Scalable master content catalog architecture supporting:
-- 1. Provenance registry: catalog_sources
-- 2. Extended books catalog with Project Gutenberg and Open Library metadata
-- 3. Extended music tracks with MusicBrainz identifiers & provider metadata
-- 4. Geographic backbone: geography_countries & geography_cities (GeoNames)
-- 5. Full public read RLS policies + service role writes
-- ============================================================

-- ── 1. Catalog Sources Registry (Provenance & Versioning) ──────
create table if not exists catalog_sources (
  id           uuid primary key default gen_random_uuid(),
  source_name  text not null,     -- 'gutenberg', 'musicbrainz', 'geonames', 'owc', 'wikidata', 'manual'
  source_url   text,
  version      text,
  license      text not null,     -- 'public_domain', 'CC0', 'CC-BY-4.0', 'ODbL', etc.
  record_count integer default 0,
  notes        text,
  ingested_at  timestamptz not null default now()
);

-- ── 2. Extend Books Table with Provenance & External IDs ──────
alter table if exists books
  add column if not exists source_name    text default 'manual',
  add column if not exists source_id      text,
  add column if not exists source_version text,
  add column if not exists gutenberg_id   integer,
  add column if not exists openlibrary_id text,
  add column if not exists subjects       text[] default '{}',
  add column if not exists downloads_30d  integer default 0,
  add column if not exists ingested_at    timestamptz default now();

create index if not exists books_gutenberg_idx on books(gutenberg_id) where gutenberg_id is not null;
create index if not exists books_openlibrary_idx on books(openlibrary_id) where openlibrary_id is not null;
create index if not exists books_subjects_idx on books using gin(subjects);

-- ── 3. Extend Music Tracks Table with Provenance ──────────────
alter table if exists music_tracks
  add column if not exists source_name          text default 'manual',
  add column if not exists source_id            text,
  add column if not exists ingested_at          timestamptz default now();

create index if not exists music_tracks_mb_idx on music_tracks(musicbrainz_recording_id) where musicbrainz_recording_id is not null;
create index if not exists music_tracks_isrc_idx on music_tracks(isrc) where isrc is not null;

-- ── 4. Geography: Countries & Cities ──────────────────────────
create table if not exists geography_countries (
  iso2        text primary key,     -- 'IN', 'US', 'GB'
  iso3        text not null unique, -- 'IND', 'USA', 'GBR'
  name        text not null,
  native_name text,
  continent   text,
  capital     text,
  phone_code  text,
  currency    text,
  languages   text[] default '{}',
  source_name text not null default 'geonames',
  created_at  timestamptz not null default now()
);

create table if not exists geography_cities (
  id               uuid primary key default gen_random_uuid(),
  geonames_id      bigint unique,
  name             text not null,
  ascii_name       text not null,
  alternate_names  text[] default '{}',
  country_iso2     text not null references geography_countries(iso2) on delete cascade,
  admin1_name      text,           -- state/province
  latitude         numeric(9,6),
  longitude        numeric(9,6),
  population       bigint default 0,
  timezone         text,
  feature_class    text,
  feature_code     text,
  elevation        integer,
  source_name      text not null default 'geonames',
  ingested_at      timestamptz not null default now(),
  created_at       timestamptz not null default now()
);

create index if not exists cities_country_idx on geography_cities(country_iso2);
create index if not exists cities_name_idx on geography_cities(ascii_name);
create index if not exists cities_population_idx on geography_cities(population desc);
create index if not exists cities_geonames_idx on geography_cities(geonames_id);

-- ── 5. Row Level Security Policies ────────────────────────────
alter table catalog_sources enable row level security;
alter table geography_countries enable row level security;
alter table geography_cities enable row level security;

create policy "Public can view catalog sources" on catalog_sources for select using (true);
create policy "Public can view countries" on geography_countries for select using (true);
create policy "Public can view cities" on geography_cities for select using (true);
