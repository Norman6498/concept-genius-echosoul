# EchoSoul Database & PostgreSQL Schema Audit

**Date of Audit**: 2026-09-11  
**Target Environment**: Remote Supabase PostgreSQL 15 Instance (`awouevjggdfjeyuzkypy.supabase.co`)  
**Evaluator**: Antigravity Full Project Audit Engine  

---

## 1. Executive Database Summary

An empirical audit of the remote Supabase database via the PostgREST management API and service role introspection revealed a **severe disconnect between local migration definitions and remote database state**.

- **Exposed PostgREST Tables**: 20 tables exist.
- **Total Rows Across Entire Database**: **1 row** (in `profiles`).
- **Empty Tables**: **19 tables** contain **0 rows**.
- **Unapplied Migration Tables**: **18 tables** defined in local migrations have **never been created remotely**.
- **Schema Drift**: Remote `profiles` table is missing 5 critical columns expected by the application code (`full_name`, `role`, `interests`, `current_focus`, `current_mood`).
- **Vector Database**: `pgvector` extension is active with `vector(1536)` on `memory_items.embedding`, but 0 embeddings exist.

---

## 2. Table-by-Table Inventory & Live Status

| Table Name | Remote Status | Live Row Count | Primary Key | Key Foreign Keys | Empirical Finding |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `profiles` | `🟡 PARTIALLY WORKING` | **1** | `id` (UUID $\to$ `auth.users`) | None | Only stores `display_name`, `preferred_language`, `preferred_support_style`. Missing `full_name`, `role`, `interests`. |
| `user_settings` | `🟠 IMPLEMENTED BUT UNVERIFIED` | **0** | `user_id` | `user_id` $\to$ `profiles(id)` | Table exists; zero user settings rows recorded. |
| `sessions` | `🟠 IMPLEMENTED BUT UNVERIFIED` | **0** | `id` (UUID) | `user_id` $\to$ `profiles(id)` | Intended for chat sessions; 0 active or historical records. |
| `messages` | `🔴 BROKEN` | **0** | `id` (UUID) | `session_id` $\to$ `sessions(id)` | RLS permits anon select when empty; zero chat messages persisted. |
| `context_snapshots` | `🟠 IMPLEMENTED BUT UNVERIFIED` | **0** | `id` (UUID) | `user_id` $\to$ `profiles(id)` | Intended for AI context window management; 0 snapshots saved. |
| `memory_items` | `⚫ BLOCKED` | **0** | `id` (UUID) | `user_id` $\to$ `profiles(id)` | Has `embedding vector(1536)`; 0 rows. Blocked by missing embedding model configuration. |
| `moments` | `🔴 BROKEN` | **0** | `id` (UUID) | `user_id` $\to$ `profiles(id)` | Intended for life milestones; 0 moments saved in DB. Frontend falls back to hardcoded items. |
| `novel_chapters` | `⚪ NOT IMPLEMENTED` | **0** | `id` (UUID) | `user_id` $\to$ `profiles(id)` | Intended for "Life Novel" feature; 0 chapters generated or saved. |
| `moment_memory_links` | `⚪ NOT IMPLEMENTED` | **0** | Composite | `moment_id`, `memory_id` | Junction table; 0 rows. |
| `literature_works` | `🔴 BROKEN` | **0** | `id` (UUID) | None | Core literature table; 0 rows. Frontend forced to read TypeScript memory arrays. |
| `literary_passages` | `🔴 BROKEN` | **0** | `id` (UUID) | `work_id` $\to$ `literature_works(id)` | Core quotes/passages table; 0 rows. |
| `literature_tags` | `⚪ NOT IMPLEMENTED` | **0** | `id` (UUID) | None | 0 rows. |
| `literature_feedback` | `⚪ NOT IMPLEMENTED` | **0** | `id` (UUID) | `user_id`, `passage_id` | 0 rows. |
| `saved_words` | `⚪ NOT IMPLEMENTED` | **0** | `id` (UUID) | `user_id` $\to$ `profiles(id)` | User bookmarks table; 0 rows. |
| `creative_jobs` | `⚪ NOT IMPLEMENTED` | **0** | `id` (UUID) | `user_id` $\to$ `profiles(id)` | Background media generation queue; 0 jobs logged. |
| `goals` | `⚪ NOT IMPLEMENTED` | **0** | `id` (UUID) | `user_id` $\to$ `profiles(id)` | Journey goals; 0 rows. Journey tab renders static mockup goals. |
| `habits` | `⚪ NOT IMPLEMENTED` | **0** | `id` (UUID) | `user_id` $\to$ `profiles(id)` | 0 rows. |
| `entitlements` | `⚪ NOT IMPLEMENTED` | **0** | `id` (UUID) | `user_id` $\to$ `profiles(id)` | Premium tier flags; 0 rows. |
| `audit_events` | `⚪ NOT IMPLEMENTED` | **0** | `id` (UUID) | `user_id` $\to$ `profiles(id)` | System audit trail; 0 rows. |
| `journey_events` | `⚪ NOT IMPLEMENTED` | **0** | `id` (UUID) | `user_id` $\to$ `profiles(id)` | Milestone logs; 0 rows. |

---

## 3. Unapplied Migrations & Missing Remote Tables

Local migration files in `supabase/migrations/` define 18 additional tables that do **NOT exist** on the remote Supabase database:

### Migration: `20260911000004_master_content_database.sql` (UNAPPLIED)
1. `music_tracks` — `⚪ NOT IMPLEMENTED` (Remote: 404 / doesn't exist)
2. `master_music_catalog` — `⚪ NOT IMPLEMENTED` (Remote: 404 / doesn't exist)
3. `melodies` — `⚪ NOT IMPLEMENTED` (Remote: 404 / doesn't exist)
4. `meditations` — `⚪ NOT IMPLEMENTED` (Remote: 404 / doesn't exist)
5. `visual_scenes` — `⚪ NOT IMPLEMENTED` (Remote: 404 / doesn't exist)
6. `scenes` — `⚪ NOT IMPLEMENTED` (Remote: 404 / doesn't exist)
7. `ambient_audio` — `⚪ NOT IMPLEMENTED` (Remote: 404 / doesn't exist)
8. `books` — `⚪ NOT IMPLEMENTED` (Remote: 404 / doesn't exist)
9. `shayari` — `⚪ NOT IMPLEMENTED` (Remote: 404 / doesn't exist)
10. `poetry` — `⚪ NOT IMPLEMENTED` (Remote: 404 / doesn't exist)
11. `quotes` — `⚪ NOT IMPLEMENTED` (Remote: 404 / doesn't exist)
12. `authors` — `⚪ NOT IMPLEMENTED` (Remote: 404 / doesn't exist)
13. `content_sources` — `⚪ NOT IMPLEMENTED` (Remote: 404 / doesn't exist)
14. `recommendation_events` — `⚪ NOT IMPLEMENTED` (Remote: 404 / doesn't exist)
15. `experience_sessions` — `⚪ NOT IMPLEMENTED` (Remote: 404 / doesn't exist)
16. `user_collections` — `⚪ NOT IMPLEMENTED` (Remote: 404 / doesn't exist)
17. `user_onboarding` — `⚪ NOT IMPLEMENTED` (Remote: 404 / doesn't exist)
18. `chat_sessions` — `⚪ NOT IMPLEMENTED` (Remote: 404 / doesn't exist)

---

## 4. Empirical Schema Drift Details

### The `profiles` Column Mismatch
When the Next.js API route `/api/ai/chat` (lines 95–99) queries Supabase:
```typescript
const { data: prof } = await supabase
  .from("profiles")
  .select("full_name, role, interests, current_focus, current_mood")
  .eq("id", user.id)
  .single();
```
PostgREST throws a schema error:
```json
{
  "code": "42703",
  "message": "column profiles.full_name does not exist",
  "details": null,
  "hint": null
}
```
**Cause**: The remote database was only initialized with migration `20260908000001_foundation.sql`. Migration `20260911000001_onboarding_personalization.sql`, which adds `full_name`, `role`, `interests`, `current_focus`, and `current_mood` via `ALTER TABLE profiles ADD COLUMN ...`, has never been executed against the production database.

---

## 5. Vector Database & Embeddings Health
- **Extension**: `pgvector` extension is enabled in PostgreSQL.
- **Column**: `memory_items.embedding vector(1536)` exists in the table definition.
- **Distance Metric**: Cosine similarity (`vector_cosine_ops`) index defined in SQL.
- **Current Vector Count**: **0 vectors**.
- **Blocker**: The embedding ingestion pipeline requires `OPENROUTER_EMBEDDING_MODEL` or OpenAI `text-embedding-3-small`. In `.env.local`, no embedding model is configured. Consequently, semantic search across user memories and literature cannot function.
