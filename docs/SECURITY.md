# EchoSoul — Security Guide

## Critical rules (non-negotiable)

1. **Never commit secrets to git.** Not in code, not in docs, not in config files.
2. **Never expose the OpenRouter API key to the browser.** Server-side only.
3. **Never expose the Supabase service-role key to the browser.** Server-side only.
4. **Never log private user content** (messages, memories, emotional context).
5. **Never bypass RLS** without explicit, server-side authorization checks.
6. **Safety features are never paywalled.** No entitlement check on safety responses.

---

## What must never be committed

| Item | Pattern | Risk |
|------|---------|------|
| OpenRouter API key | `sk-or-v1-*` | Unauthorized AI usage, cost |
| Supabase service-role key | `eyJ...` (JWT, long) | Full database access bypassing RLS |
| Supabase anon key | `eyJ...` (JWT) | Not a secret — but misleading to hardcode |
| Database password | any | Direct database access |
| `.env.local` | any | All of the above |
| Private keys / certificates | `*.pem`, `*.key` | Identity/encryption compromise |

The `.gitignore` blocks all of these. Always verify with `git status` before committing.

---

## Pre-commit secret scan

Before any `git commit`, run:

```bash
# Check for common secret patterns in staged files
git diff --cached | grep -E "(sk-|api_key|apikey|password=|secret=|token=|service_role|OPENROUTER_API_KEY=|SUPABASE_SERVICE_ROLE_KEY=)"

# List all tracked files
git ls-files | head -40

# Verify .env files are ignored
git check-ignore -v .env .env.local
```

---

## Server-side secret boundary

```
Browser (PUBLIC)          Server (PRIVATE)
─────────────────────     ──────────────────────────────
NEXT_PUBLIC_SUPABASE_URL  SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SUPABASE_ANON_KEY  OPENROUTER_API_KEY
NEXT_PUBLIC_APP_URL       OPENROUTER_*_MODEL (configurable)
```

The `NEXT_PUBLIC_` prefix is a build-time signal to Next.js that the value
is intentionally public. Never use this prefix on secrets.

---

## Row Level Security (RLS)

Every user-owned Supabase table has RLS enabled with `auth.uid()` policies.

**Policy patterns used:**
- Owner direct: `auth.uid() = user_id`
- Owner via parent: existence check on parent row that the user owns
- Public read-only: `auth.role() = 'authenticated'` (literature tables)
- Server-only write: no client write policy; service-role key bypasses RLS for ingestion

**Verify RLS status:**
```sql
-- Should return 'on' for all listed tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## Sensitive data handling

| Data type | Storage | Logging | Retention |
|-----------|---------|---------|-----------|
| User messages | Supabase `messages` table (encrypted at rest) | Never logged | Until account deletion |
| Context snapshots | Supabase `context_snapshots` | Never logged | Until account deletion |
| Memory items | Supabase `memory_items` | Never logged | Until user delete or account deletion |
| Emotional state | Context extraction only — not stored raw | Never logged | Not stored |
| Audio recordings | Not stored server-side (STT only) | Never logged | Not stored |

---

## Prompt injection protection

- Literary corpus text is treated as untrusted content in prompts.
- User messages are never interpolated directly into system prompts.
- AI JSON responses are validated with Zod schemas before use.
- Provider error messages are never forwarded to the client.

---

## Account deletion

Account deletion must:
1. Cascade-delete all user rows via PostgreSQL `on delete cascade`
2. Delete Supabase Storage objects in user path
3. Write an audit event before deletion
4. Verify embedding vectors are also removed
5. Respect any backup retention window (document this before production)

---

## Security check checklist (before each push)

```
[ ] git status — only intended files are staged
[ ] No .env files in tracked files
[ ] No API keys or tokens in tracked files
[ ] .env.example has only placeholders
[ ] No console.log() with user message content
[ ] RLS enabled on all user-owned tables
[ ] Service-role key used only in server files
[ ] OPENROUTER_API_KEY not in any client file
```

---

## If a secret is accidentally committed

1. **Rotate the compromised key immediately** (before anything else)
2. Rewrite git history: `git filter-repo --path <file> --invert-paths`
3. Force-push: `git push --force`
4. Contact GitHub support to purge caches if the repo was ever public
5. Audit who may have cloned the repository
6. Document the incident in audit_events
