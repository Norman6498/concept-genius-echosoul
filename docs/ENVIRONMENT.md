# EchoSoul — Environment Variables Reference

## Files

| File | Committed | Purpose |
|------|-----------|---------|
| `.env.example` | ✅ Yes | Template with placeholders — no real values |
| `.env.local` | ❌ No (git-ignored) | Local development credentials |
| `.env.production` | ❌ No | Production secrets (deployment platform only) |

**Never commit any file with real credentials.**

---

## Variable Reference

### Supabase — Browser-safe (NEXT_PUBLIC_*)

These values are intentionally exposed to the browser. They are safe because
Supabase's Row Level Security (RLS) enforces authorization — the anon key alone
cannot bypass RLS policies.

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL, e.g. `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public anon key from Supabase Dashboard → Settings → API |

**Where to find them:** Supabase Dashboard → Project Settings → API

---

### Supabase — Server-only (NEVER expose to browser)

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service-role key — bypasses RLS. Never use in client code. |

**Where to find it:** Supabase Dashboard → Project Settings → API → service_role key

> [!CAUTION]
> If this key reaches the browser or a public git commit, rotate it immediately
> in the Supabase Dashboard → Settings → API → Regenerate keys.

---

### OpenRouter — Server-only (NEVER expose to browser)

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | ✅ | Your OpenRouter API key from openrouter.ai/keys |
| `OPENROUTER_CHAT_MODEL` | Recommended | Primary chat model ID. Default: `google/gemma-3-27b-it:free` |
| `OPENROUTER_FAST_MODEL` | Optional | Fast/cheap model for classification. Default: `google/gemma-3-12b-it:free` |
| `OPENROUTER_REASONING_MODEL` | Optional | Reasoning model for complex tasks |
| `OPENROUTER_EMBEDDING_MODEL` | Optional | Embedding model (if using OpenRouter for embeddings) |

**Where to find/create the key:** [openrouter.ai/keys](https://openrouter.ai/keys)

> [!CAUTION]
> `OPENROUTER_API_KEY` must never appear in:
> - Client-side JavaScript (anything under `src/app/` imported from client components)
> - `NEXT_PUBLIC_*` variables
> - Source code or configuration files
> - Git commits or pull requests

---

### Application

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Recommended | App URL. `http://localhost:3000` for local dev |
| `NODE_ENV` | Auto | Set by Next.js. `development` / `production` |
| `AI_PROVIDER` | Optional | AI provider to use. Default: `openrouter` |

---

## How to rotate credentials

### Rotate Supabase service-role key

1. Supabase Dashboard → Project Settings → API
2. Click "Regenerate" next to the service_role key
3. Update `.env.local` with the new key
4. If deployed: update the deployment platform secret store
5. Verify the application still works

### Rotate OpenRouter API key

1. [openrouter.ai/keys](https://openrouter.ai/keys) → Delete old key → Create new
2. Update `OPENROUTER_API_KEY` in `.env.local`
3. If deployed: update the deployment platform secret store

---

## Deployment secrets

Do not use `.env.local` for production. Use your deployment platform's secret manager:
- **Vercel:** Project Settings → Environment Variables
- **Railway:** Service Variables
- **Fly.io:** `fly secrets set KEY=value`

Never store production secrets in version control.
