# EchoSoul — Supabase Setup Guide

## Project Details

| Property | Value |
|----------|-------|
| Project name | `echosoul` |
| Region | Choose closest to your users (India: `ap-south-1`) |
| Database password | Generate a strong password; store it in a password manager |

---

## Step 1: Create the Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project**
3. Name: `echosoul`
4. Choose your region
5. Set a strong database password (save it — you'll need it for direct DB connections)
6. Wait for provisioning (~2 minutes)

---

## Step 2: Enable the vector extension

Required for semantic memory search and literature retrieval.

1. Go to: Dashboard → Database → Extensions
2. Search for `vector`
3. Enable it

Or run in the SQL editor:
```sql
create extension if not exists vector;
```

---

## Step 3: Get API credentials

Dashboard → Project Settings → API

Copy to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...   (anon/public key)
SUPABASE_SERVICE_ROLE_KEY=eyJ...       (service_role — NEVER commit)
```

---

## Step 4: Apply database migrations

Open the SQL editor: Dashboard → SQL Editor

Run each migration file **in order**:

1. `supabase/migrations/20260908000001_foundation.sql`  
   — profiles, user_settings, sessions, messages, context_snapshots

2. `supabase/migrations/20260908000002_memory_and_content.sql`  
   — memory_items (with vector embedding), moments, novel_chapters, literature tables

3. `supabase/migrations/20260908000003_jobs_and_entitlements.sql`  
   — creative_jobs, goals, habits, entitlements, audit_events, journey_events

Paste each file's contents into the SQL editor and click **Run**.

Verify after each migration: check that the tables appear in Dashboard → Table Editor.

---

## Step 5: Configure Authentication

Dashboard → Authentication → Settings

Recommended for Stage 0:
- Enable **Email** provider (email + magic link)
- Disable **Confirm email** for local dev (re-enable for production)
- Add `http://localhost:3000` to the **Site URL**
- Add `http://localhost:3000/**` to **Redirect URLs**

Future OAuth providers (Stage 1+):
- Google, GitHub, Apple — add Client ID and Secret from each provider

---

## Step 6: Configure Storage Buckets

Dashboard → Storage → New bucket

Create these buckets:

| Bucket name | Public? | Purpose |
|-------------|---------|---------|
| `user-media` | ❌ Private | Profile photos, user uploads |
| `generated-scenes` | ❌ Private | AI-generated scene images |
| `generated-videos` | ❌ Private | AI-generated videos |
| `generated-audio` | ❌ Private | TTS audio, experience audio |
| `literature-assets` | ✅ Public | Cover images for literary works (no PII) |

For each **private** bucket, set the access policy:
- No public access
- Authenticated users can only access their own objects
  (path format: `user_id/filename`)

---

## RLS Architecture

All user-owned tables have Row Level Security enabled with `auth.uid()` policies.

| Table | Access rule |
|-------|-------------|
| profiles | `auth.uid() = id` |
| user_settings | `auth.uid() = user_id` |
| sessions | `auth.uid() = user_id` |
| messages | owner via session |
| context_snapshots | owner via session |
| memory_items | `auth.uid() = user_id` |
| moments | `auth.uid() = user_id` |
| novel_chapters | `auth.uid() = user_id` |
| literature_works | authenticated read-only |
| literary_passages | authenticated read-only |
| literature_feedback | `auth.uid() = user_id` |
| saved_words | `auth.uid() = user_id` |
| creative_jobs | `auth.uid() = user_id` |
| goals | `auth.uid() = user_id` |
| habits | `auth.uid() = user_id` |
| entitlements | owner read-only (server writes) |
| audit_events | owner read-only (server appends) |

---

## Verifying the setup

After running migrations, check:

```bash
npm run verify-infra
```

Expected output: Supabase connection ✅, database ✅

---

## How to rotate the database password

1. Supabase Dashboard → Project Settings → Database
2. Reset database password
3. Update any direct database connection strings (not the API keys)
4. Note: The anon key and service-role key are separate from the DB password

## How to rotate the service-role key

1. Dashboard → Project Settings → API → Regenerate service_role key
2. Update `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
3. Update the production secret store if deployed
