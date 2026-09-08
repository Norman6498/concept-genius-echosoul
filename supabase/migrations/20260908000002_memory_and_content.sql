-- ============================================================
-- EchoSoul — Migration 002: Memory, Moments & Literature
-- ============================================================
-- Tables: memory_items, moments, novel_chapters, moment_memory_links,
--         literature_works, literary_passages, literature_tags,
--         literature_feedback, saved_words
-- RLS: enabled on all user-owned tables
-- ============================================================

-- ── Memory Items ──────────────────────────────────────────────────────────
-- Stores meaningful facts and reflections extracted from conversations.
-- Private sessions produce no memory_items (enforced at application layer).
-- embedding: 1536-dim vector — provider-agnostic dimension, works with
--   OpenAI text-embedding-3-small, Voyage AI, Cohere, etc.
--   Change the dimension in this migration if a different provider is used.
create table if not exists memory_items (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references profiles(id) on delete cascade,
  source_session_id     uuid references sessions(id) on delete set null,
  memory_type           text not null
                          check (memory_type in ('fact','reflection','goal','relationship','preference','event','growth')),
  content               text not null,
  fact_or_reflection    text not null default 'fact'
                          check (fact_or_reflection in ('fact','reflection')),
  confidence            numeric(4,3) check (confidence between 0 and 1),
  sensitivity           text not null default 'normal'
                          check (sensitivity in ('normal','sensitive','highly_sensitive')),
  user_confirmed        boolean not null default false,
  user_visible          boolean not null default true,
  user_editable         boolean not null default true,
  last_referenced_at    timestamptz,
  review_at             timestamptz,
  -- Vector embedding for semantic similarity search.
  -- Dimension 1536 matches common embedding model output.
  -- Prepare for vector search without hard-coding a specific provider.
  embedding             vector(1536),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  deleted_at            timestamptz   -- soft delete; hard delete on account erasure
);

create index if not exists memory_items_user_idx
  on memory_items(user_id, created_at desc)
  where deleted_at is null;

-- IVFFlat index for fast approximate nearest-neighbour cosine search.
-- Requires at least ~1000 rows per list for production; tune lists accordingly.
-- This index is created here for structure; it becomes effective once
-- embedding data is populated in Stage 4 (Memory).
create index if not exists memory_items_embedding_idx
  on memory_items using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ── Moments ───────────────────────────────────────────────────────────────
-- A moment is a meaningful emotional snapshot — a pivotal conversation, a
-- turning point, a day to remember. Used by the Novel of You feature.
create table if not exists moments (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references profiles(id) on delete cascade,
  source_session_id uuid references sessions(id) on delete set null,
  title             text,
  summary           text,
  emotion           text,
  intensity         smallint check (intensity between 0 and 10),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists moments_user_idx on moments(user_id, created_at desc);

-- ── Novel Chapters ────────────────────────────────────────────────────────
-- The user's life story, organized as chapters by the Novel of You feature.
-- Generated narrative is a private AI reflection, labeled as such.
create table if not exists novel_chapters (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references profiles(id) on delete cascade,
  title               text not null,
  chapter_order       integer not null,
  generated_narrative text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (user_id, chapter_order)
);

-- ── Moment ↔ Memory Links ─────────────────────────────────────────────────
create table if not exists moment_memory_links (
  moment_id   uuid not null references moments(id) on delete cascade,
  memory_id   uuid not null references memory_items(id) on delete cascade,
  primary key (moment_id, memory_id)
);

-- ── Literature Works ──────────────────────────────────────────────────────
-- Shared catalogue of source works. Read-only to normal clients.
-- Only corpus ingestion (privileged server role) may insert/update.
create table if not exists literature_works (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  author            text not null,
  language          text not null,
  genre             text,
  publication_year  int,
  rights_status     text not null
                      check (rights_status in ('public_domain','licensed','restricted','unknown')),
  source_name       text not null,
  source_url        text,
  rights_evidence   text,
  metadata          jsonb not null default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists literature_works_language_idx on literature_works(language);
create index if not exists literature_works_author_idx on literature_works(author);

-- ── Literary Passages ─────────────────────────────────────────────────────
-- Individual passages/stanzas from works in the corpus.
-- source_checksum: SHA-256 of original_text — used to detect tampering.
-- original_text must never be modified after ingestion.
create table if not exists literary_passages (
  id              uuid primary key default gen_random_uuid(),
  work_id         uuid not null references literature_works(id) on delete cascade,
  passage_type    text not null default 'passage'
                    check (passage_type in ('passage','stanza','verse','section','couplet','ghazal')),
  original_text   text not null,
  chapter         text,
  page_reference  text,
  sequence_no     integer,
  metadata        jsonb not null default '{}'::jsonb,
  -- Embedding for semantic similarity retrieval.
  embedding       vector(1536),
  -- Checksum of original_text at ingestion time.
  -- Verify before displaying to detect corruption or injection attempts.
  source_checksum text not null,
  created_at      timestamptz not null default now()
);

-- IVFFlat similarity index
create index if not exists literary_passages_embedding_idx
  on literary_passages using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create index if not exists literary_passages_work_idx on literary_passages(work_id);

-- ── Literature Tags ───────────────────────────────────────────────────────
-- Thematic/emotional/stylistic tags for retrieval filtering.
create table if not exists literature_tags (
  passage_id  uuid not null references literary_passages(id) on delete cascade,
  tag_type    text not null
                check (tag_type in ('emotion','theme','style','language_register','intensity_range','era')),
  tag_value   text not null,
  weight      numeric(4,3) default 1.0,
  primary key (passage_id, tag_type, tag_value)
);

-- ── Literature Feedback ───────────────────────────────────────────────────
-- User feedback on literary passages — used for ranking improvement.
create table if not exists literature_feedback (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  passage_id  uuid not null references literary_passages(id) on delete cascade,
  feedback    text not null
                check (feedback in ('beautiful','not_me','too_heavy','exactly_this','another')),
  created_at  timestamptz not null default now(),
  unique (user_id, passage_id) -- one feedback per user per passage
);

-- ── Saved Words ───────────────────────────────────────────────────────────
-- Passages the user explicitly saves to their collection.
create table if not exists saved_words (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  passage_id  uuid not null references literary_passages(id) on delete cascade,
  note        text,
  created_at  timestamptz not null default now(),
  unique (user_id, passage_id)
);

-- ── Row Level Security ────────────────────────────────────────────────────

alter table memory_items enable row level security;
alter table moments enable row level security;
alter table novel_chapters enable row level security;
alter table moment_memory_links enable row level security;
alter table literature_works enable row level security;
alter table literary_passages enable row level security;
alter table literature_tags enable row level security;
alter table literature_feedback enable row level security;
alter table saved_words enable row level security;

-- memory_items: owner only (soft-deleted rows excluded)
create policy "memory_items: owner access"
  on memory_items for all
  using (auth.uid() = user_id and deleted_at is null)
  with check (auth.uid() = user_id);

-- moments: owner only
create policy "moments: owner access"
  on moments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- novel_chapters: owner only
create policy "novel_chapters: owner access"
  on novel_chapters for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- moment_memory_links: accessible only if user owns the moment
create policy "moment_memory_links: owner via moment"
  on moment_memory_links for all
  using (
    exists (
      select 1 from moments m
      where m.id = moment_memory_links.moment_id
        and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from moments m
      where m.id = moment_memory_links.moment_id
        and m.user_id = auth.uid()
    )
  );

-- literature_works, literary_passages, literature_tags:
-- READ-ONLY to authenticated clients. Writes require service-role key.
create policy "literature_works: authenticated read"
  on literature_works for select
  using (auth.role() = 'authenticated');

create policy "literary_passages: authenticated read"
  on literary_passages for select
  using (auth.role() = 'authenticated');

create policy "literature_tags: authenticated read"
  on literature_tags for select
  using (auth.role() = 'authenticated');

-- literature_feedback: owner only
create policy "literature_feedback: owner access"
  on literature_feedback for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- saved_words: owner only
create policy "saved_words: owner access"
  on saved_words for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
