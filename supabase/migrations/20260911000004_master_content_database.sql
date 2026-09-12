-- ============================================================
-- EchoSoul — Migration 004: Master Content & Personalization Database
-- ============================================================
-- Decouples language and script registries.
-- First-class multilingual music catalog with multidimensional mood/context.
-- Authoritative literature, authors, books, passages, shayari, poetry, and quotes.
-- Visual scenery, environment layers, and ambient sounds.
-- User behavior, music events, collections, and explainable recommendations.
-- ============================================================

-- ── 1. Language Registry ─────────────────────────────────────
create table if not exists languages (
  id              text primary key, -- e.g. 'hi', 'en', 'bn', 'ta', 'te', 'pa', 'ur'
  iso_code        text not null unique,
  name            text not null,
  native_name     text not null,
  region          text,
  script_default  text not null,
  active          boolean not null default true,
  created_at      timestamptz not null default now()
);

-- ── 2. Script Registry ───────────────────────────────────────
create table if not exists scripts (
  id              text primary key, -- e.g. 'devanagari', 'latin', 'arabic', 'gurmukhi', 'bengali', 'tamil', 'telugu'
  code            text not null unique,
  name            text not null,
  unicode_range   text,
  direction       text not null default 'ltr' check (direction in ('ltr', 'rtl')),
  created_at      timestamptz not null default now()
);

-- ── 3. Authors (Shared Across Books, Poetry, Shayari, Quotes) ──
create table if not exists authors (
  id                  uuid primary key default gen_random_uuid(),
  canonical_name      text not null,
  alternate_names     text[] default '{}',
  languages           text[] default '{}',
  scripts             text[] default '{}',
  birth_year          integer,
  death_year          integer,
  biography           text,
  source              text,
  verification_status text not null default 'verified' check (verification_status in ('verified', 'probable', 'disputed')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists authors_name_idx on authors(canonical_name);

-- ── 4. Music Artists ─────────────────────────────────────────
create table if not exists music_artists (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  normalized_name       text not null,
  alternate_names       text[] default '{}',
  artist_type           text not null default 'singer' check (artist_type in ('solo', 'band', 'group', 'composer', 'producer', 'singer', 'instrumentalist', 'classical')),
  languages             text[] default '{}',
  regions               text[] default '{}',
  country               text default 'IN',
  genres                text[] default '{}',
  biography             text,
  image_url             text,
  official_url          text,
  provider_ids          jsonb default '{}'::jsonb,
  musicbrainz_artist_id text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists music_artists_name_idx on music_artists(normalized_name);

-- ── 5. Music Albums ──────────────────────────────────────────
create table if not exists music_albums (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  artist_id       uuid references music_artists(id) on delete set null,
  release_date    date,
  release_year    integer,
  album_type      text default 'album' check (album_type in ('album', 'single', 'ep', 'soundtrack', 'compilation')),
  track_count     integer default 1,
  language        text default 'hi',
  languages       text[] default '{}',
  genre           text,
  artwork_url     text,
  provider_ids    jsonb default '{}'::jsonb,
  rights_status   text not null default 'provider_only' check (rights_status in ('public_domain', 'licensed', 'provider_only', 'restricted', 'unknown')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── 6. Music Tracks ──────────────────────────────────────────
create table if not exists music_tracks (
  id                        uuid primary key default gen_random_uuid(),
  title                     text not null,
  normalized_title          text not null,
  artist_id                 uuid references music_artists(id) on delete set null,
  album_id                  uuid references music_albums(id) on delete set null,
  primary_language          text not null default 'hi',
  languages                 text[] default '{}',
  script                    text default 'devanagari',
  release_date              date,
  release_year              integer,
  duration                  integer not null default 180, -- seconds
  genre                     text not null default 'Sufi',
  subgenres                 text[] default '{}',
  region                    text,
  country                   text default 'IN',
  energy                    numeric(3,2) default 0.50, -- 0.00 to 1.00
  tempo                     text default 'medium' check (tempo in ('very_slow', 'slow', 'medium', 'upbeat', 'fast')),
  mood_tags                 text[] default '{}', -- e.g. ['peace', 'warmth', 'nostalgia', 'focus']
  theme_tags                text[] default '{}', -- e.g. ['late_night', 'solitude', 'healing', 'travel']
  instrumentation           text[] default '{}', -- e.g. ['piano', 'acoustic_guitar', 'bansuri', 'sarangi']
  era                       text default '2010s',
  explicit_content          boolean default false,
  provider                  text default 'echosoul_native',
  provider_track_id         text,
  provider_url              text,
  isrc                      text,
  musicbrainz_recording_id  text,
  artwork_url               text,
  rights_status             text not null default 'provider_only' check (rights_status in ('public_domain', 'licensed', 'provider_only', 'restricted', 'unknown')),
  license                   text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index if not exists music_tracks_lang_idx on music_tracks(primary_language);
create index if not exists music_tracks_mood_idx on music_tracks using gin(mood_tags);
create index if not exists music_tracks_theme_idx on music_tracks using gin(theme_tags);

-- ── 7. Music Lyrics (Rights Controlled) ──────────────────────
create table if not exists music_lyrics (
  id                  uuid primary key default gen_random_uuid(),
  track_id            uuid not null references music_tracks(id) on delete cascade,
  language            text not null,
  script              text not null,
  text                text not null,
  rights_status       text not null default 'restricted' check (rights_status in ('public_domain', 'licensed', 'restricted', 'user_provided', 'unknown')),
  license             text,
  source              text,
  verification_status text default 'verified',
  checksum            text,
  created_at          timestamptz not null default now()
);

-- ── 8. User Music Events (Behavioral Personalization) ─────────
create table if not exists user_music_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  track_id    uuid not null references music_tracks(id) on delete cascade,
  event_type  text not null check (event_type in ('played', 'paused', 'completed', 'skipped', 'liked', 'disliked', 'saved', 'shared')),
  position    integer default 0,
  duration    integer default 0,
  source      text default 'music_page' check (source in ('home', 'talk', 'words', 'music_page', 'visuals', 'journey', 'recommendation')),
  context     text default 'meditation',
  created_at  timestamptz not null default now()
);

create index if not exists user_music_events_user_idx on user_music_events(user_id, created_at desc);

-- ── 9. Books & Literary Works ────────────────────────────────
create table if not exists books (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null,
  author_id             uuid references authors(id) on delete set null,
  description           text,
  language              text not null default 'en',
  script                text default 'latin',
  genre                 text not null,
  themes                text[] default '{}',
  publication_year      integer,
  publisher             text,
  isbn                  text,
  rights_status         text not null default 'public_domain' check (rights_status in ('public_domain', 'licensed', 'restricted', 'unknown')),
  license               text,
  source                text,
  cover_asset           text,
  full_text_available   boolean not null default false,
  passages_available    boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists books_lang_idx on books(language);
create index if not exists books_themes_idx on books using gin(themes);

-- ── 10. Literary Passages ─────────────────────────────────────
create table if not exists literary_passages (
  id                  uuid primary key default gen_random_uuid(),
  work_id             uuid references books(id) on delete cascade,
  author_id           uuid references authors(id) on delete set null,
  exact_text          text not null,
  language            text not null default 'en',
  script              text not null default 'latin',
  chapter             text,
  page_reference      text,
  line_reference      text,
  source              text,
  rights_status       text not null default 'public_domain' check (rights_status in ('public_domain', 'licensed', 'restricted', 'unknown')),
  license             text,
  verification_status text not null default 'verified' check (verification_status in ('verified', 'probable', 'disputed')),
  checksum            text,
  created_at          timestamptz not null default now()
);

-- ── 11. Shayari Database (Attributed & Script-Aware) ──────────
create table if not exists shayari (
  id                  uuid primary key default gen_random_uuid(),
  text                text not null,
  author_id           uuid references authors(id) on delete set null,
  attribution         text not null,
  language            text not null default 'ur',
  script              text not null default 'arabic', -- or 'devanagari'
  theme               text not null default 'life',
  emotion             text default 'reflective',
  tone                text default 'introspective',
  source              text,
  source_url          text,
  rights_status       text not null default 'public_domain' check (rights_status in ('public_domain', 'licensed', 'restricted', 'unknown')),
  license             text,
  verification_status text not null default 'verified' check (verification_status in ('verified', 'probable', 'disputed')),
  checksum            text,
  created_at          timestamptz not null default now()
);

create index if not exists shayari_theme_idx on shayari(theme);
create index if not exists shayari_script_idx on shayari(script);

-- ── 12. Poems Database ────────────────────────────────────────
create table if not exists poems (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  author_id           uuid references authors(id) on delete set null,
  exact_text          text not null,
  language            text not null default 'en',
  script              text not null default 'latin',
  work_id             uuid references books(id) on delete set null,
  theme               text not null,
  tone                text,
  source              text,
  rights_status       text not null default 'public_domain' check (rights_status in ('public_domain', 'licensed', 'restricted', 'unknown')),
  license             text,
  verification_status text not null default 'verified',
  checksum            text,
  created_at          timestamptz not null default now()
);

-- ── 13. Quotes Database ───────────────────────────────────────
create table if not exists quotes (
  id                  uuid primary key default gen_random_uuid(),
  exact_text          text not null,
  author_id           uuid references authors(id) on delete set null,
  author_name         text not null,
  work                text,
  language            text not null default 'en',
  script              text not null default 'latin',
  source              text,
  source_url          text,
  rights_status       text not null default 'public_domain' check (rights_status in ('public_domain', 'licensed', 'restricted', 'unknown')),
  verification_status text not null default 'verified' check (verification_status in ('verified', 'probable', 'uncertain', 'disputed')),
  theme               text not null default 'presence',
  checksum            text,
  created_at          timestamptz not null default now()
);

create index if not exists quotes_theme_idx on quotes(theme);

-- ── 14. Visual Scenes & Scenery Layers ────────────────────────
create table if not exists visual_scenes (
  id                    text primary key, -- e.g. 'mountain_calm', 'forest_retreat'
  title                 text not null,
  description           text not null,
  category              text not null default 'nature',
  theme                 text not null default 'Midnight Soul',
  layers                jsonb default '[]'::jsonb,
  thumbnail_url         text not null,
  environment_audio_id  text,
  rights_status         text not null default 'licensed',
  created_at            timestamptz not null default now()
);

-- ── 15. Ambient Sounds ────────────────────────────────────────
create table if not exists ambient_sounds (
  id              text primary key, -- e.g. 'rain', 'forest_birds', 'solfeggio_174'
  name            text not null,
  category        text not null default 'nature',
  loopable        boolean not null default true,
  duration        integer default 3600, -- seconds
  source          text default 'synthesizer',
  rights_status   text not null default 'licensed',
  license         text default 'EchoSoul Audio Labs',
  audio_url       text,
  volume_profile  jsonb default '{"default": 0.65}'::jsonb,
  created_at      timestamptz not null default now()
);

-- ── 16. Recommendation Events (Feedback & Reason Codes) ───────
create table if not exists recommendation_events (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references profiles(id) on delete cascade,
  content_id          text not null,
  content_type        text not null check (content_type in ('book', 'music', 'shayari', 'poem', 'quote', 'scene', 'guidance')),
  context_snapshot_id text,
  reason_codes        text[] not null default '{}', -- e.g. ['conversation_match', 'mood_match', 'time_match']
  rank_score          numeric(4,3) default 0.850,
  shown               boolean not null default true,
  clicked             boolean not null default false,
  saved               boolean not null default false,
  dismissed           boolean not null default false,
  feedback            text,
  created_at          timestamptz not null default now()
);

create index if not exists rec_events_user_idx on recommendation_events(user_id, created_at desc);

-- ── 17. User Collections (My Words, My Books, My Songs) ───────
create table if not exists user_collections (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles(id) on delete cascade,
  collection_name text not null, -- 'My Words', 'My Books', 'My Songs', 'My Scenes', 'My Moments'
  item_type       text not null check (item_type in ('book', 'music', 'shayari', 'poem', 'quote', 'scene', 'moment')),
  item_id         text not null,
  notes           text,
  display_order   integer default 0,
  created_at      timestamptz not null default now()
);

create index if not exists user_collections_idx on user_collections(user_id, collection_name);

-- ── 18. Decouple Music Languages from Literature Languages in user_settings ──
alter table if exists user_settings
  add column if not exists music_languages text[] default '{"hi", "en", "pa", "ta", "bn"}',
  add column if not exists literature_languages text[] default '{"hi", "ur", "en"}',
  add column if not exists literature_scripts text[] default '{"devanagari", "arabic", "latin"}';

-- ── 19. Row Level Security Policies ──────────────────────────
alter table languages enable row level security;
alter table scripts enable row level security;
alter table authors enable row level security;
alter table music_artists enable row level security;
alter table music_albums enable row level security;
alter table music_tracks enable row level security;
alter table music_lyrics enable row level security;
alter table books enable row level security;
alter table literary_passages enable row level security;
alter table shayari enable row level security;
alter table poems enable row level security;
alter table quotes enable row level security;
alter table visual_scenes enable row level security;
alter table ambient_sounds enable row level security;

alter table user_music_events enable row level security;
alter table recommendation_events enable row level security;
alter table user_collections enable row level security;

-- Public read for catalog
create policy "Public can view active languages" on languages for select using (active = true);
create policy "Public can view scripts" on scripts for select using (true);
create policy "Public can view authors" on authors for select using (true);
create policy "Public can view music artists" on music_artists for select using (true);
create policy "Public can view music albums" on music_albums for select using (true);
create policy "Public can view music tracks" on music_tracks for select using (true);
create policy "Public can view books" on books for select using (true);
create policy "Public can view literary passages" on literary_passages for select using (true);
create policy "Public can view shayari" on shayari for select using (true);
create policy "Public can view poems" on poems for select using (true);
create policy "Public can view quotes" on quotes for select using (true);
create policy "Public can view visual scenes" on visual_scenes for select using (true);
create policy "Public can view ambient sounds" on ambient_sounds for select using (true);

-- User-specific private policies
create policy "Users manage their own music events" on user_music_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own recommendation events" on recommendation_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own collections" on user_collections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
