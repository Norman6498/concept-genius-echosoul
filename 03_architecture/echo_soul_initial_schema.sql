-- EchoSoul production-oriented Supabase/PostgreSQL starting schema.
-- Apply via migrations, review enums/index sizes for the chosen environment.

create extension if not exists pgcrypto;
create extension if not exists vector;

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_language text not null default 'en',
  preferred_support_style text not null default 'adaptive',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table user_settings (
  user_id uuid primary key references profiles(id) on delete cascade,
  voice_enabled boolean not null default true,
  memory_mode text not null default 'hybrid',
  default_private_session boolean not null default false,
  notification_preferences jsonb not null default '{}'::jsonb,
  visual_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  mode text not null default 'balanced',
  is_private boolean not null default false,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  summary text,
  language text,
  created_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  language text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table context_snapshots (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  primary_emotion text,
  secondary_emotions text[] not null default '{}',
  situation text,
  triggers text[] not null default '{}',
  core_thought text,
  need text,
  intensity smallint check (intensity between 0 and 10),
  support_mode text,
  people jsonb not null default '[]'::jsonb,
  unresolved_thread text,
  positive_movement text,
  safety_level smallint not null default 0,
  raw_model jsonb,
  created_at timestamptz not null default now()
);

create table memory_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  source_session_id uuid references sessions(id) on delete set null,
  memory_type text not null,
  content text not null,
  fact_or_reflection text not null default 'fact' check (fact_or_reflection in ('fact','reflection')),
  confidence numeric(4,3) check (confidence between 0 and 1),
  sensitivity text not null default 'normal',
  user_confirmed boolean not null default false,
  user_visible boolean not null default true,
  user_editable boolean not null default true,
  last_referenced_at timestamptz,
  review_at timestamptz,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index memory_items_user_idx on memory_items(user_id, created_at desc);
create index memory_items_embedding_idx on memory_items using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create table moments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  source_session_id uuid references sessions(id) on delete set null,
  title text,
  summary text,
  emotion text,
  intensity smallint check (intensity between 0 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table novel_chapters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  chapter_order integer not null,
  generated_narrative text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, chapter_order)
);

create table moment_memory_links (
  moment_id uuid not null references moments(id) on delete cascade,
  memory_id uuid not null references memory_items(id) on delete cascade,
  primary key(moment_id, memory_id)
);

create table literature_works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  language text not null,
  genre text,
  publication_year int,
  rights_status text not null check (rights_status in ('public_domain','licensed','restricted','unknown')),
  source_name text not null,
  source_url text,
  rights_evidence text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table literary_passages (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references literature_works(id) on delete cascade,
  passage_type text not null default 'passage',
  original_text text not null,
  chapter text,
  page_reference text,
  sequence_no integer,
  metadata jsonb not null default '{}'::jsonb,
  embedding vector(1536),
  source_checksum text not null,
  created_at timestamptz not null default now()
);

create index literary_passages_embedding_idx on literary_passages using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create table literature_tags (
  passage_id uuid not null references literary_passages(id) on delete cascade,
  tag_type text not null,
  tag_value text not null,
  weight numeric(4,3) default 1.0,
  primary key(passage_id, tag_type, tag_value)
);

create table literature_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  passage_id uuid not null references literary_passages(id) on delete cascade,
  feedback text not null check (feedback in ('beautiful','not_me','too_heavy','exactly_this','another')),
  created_at timestamptz not null default now()
);

create table saved_words (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  passage_id uuid not null references literary_passages(id) on delete cascade,
  note text,
  created_at timestamptz not null default now()
);

create table creative_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  moment_id uuid references moments(id) on delete set null,
  job_type text not null check (job_type in ('animation','scene','video')),
  status text not null default 'queued',
  input_spec jsonb not null,
  provider_job_id text,
  output_url text,
  error_message text,
  attempts integer not null default 0,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz
);

create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  cadence text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table entitlements (
  user_id uuid primary key references profiles(id) on delete cascade,
  plan text not null default 'free',
  valid_until timestamptz,
  usage jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table audit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  event_type text not null,
  object_type text,
  object_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- IMPORTANT: production migration must enable RLS on every user-owned table and add policies.
-- Use auth.uid() ownership checks; never rely on client-side filtering.
