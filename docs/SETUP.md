# EchoSoul — Setup Guide

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | ≥ 22 (24.x recommended) | [nodejs.org](https://nodejs.org) |
| npm | ≥ 10 | bundled with Node |
| Git | ≥ 2.40 | [git-scm.com](https://git-scm.com) |
| Supabase account | — | [supabase.com](https://supabase.com) |
| OpenRouter account | — | [openrouter.ai](https://openrouter.ai) |

---

## Setup Sequence

### 1. Clone the repository

```bash
git clone git@github.com:<your-github-username>/concept-genius-echosoul.git
cd concept-genius-echosoul
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in all values. See [ENVIRONMENT.md](ENVIRONMENT.md) for full documentation.

**Never commit `.env.local`.** It is git-ignored.

### 4. Set up Supabase

See [SUPABASE.md](SUPABASE.md) for detailed instructions.

Short version:
1. Create a project at [supabase.com](https://supabase.com) named `echosoul`
2. Copy the Project URL and anon key into `.env.local`
3. Copy the service-role key into `.env.local`
4. Run the migrations (paste each file into the Supabase SQL editor in order):
   - `supabase/migrations/20260908000001_foundation.sql`
   - `supabase/migrations/20260908000002_memory_and_content.sql`
   - `supabase/migrations/20260908000003_jobs_and_entitlements.sql`

### 5. Configure OpenRouter

See [OPENROUTER.md](OPENROUTER.md).

1. Create an API key at [openrouter.ai/keys](https://openrouter.ai/keys)
2. Add it to `.env.local` as `OPENROUTER_API_KEY`

### 6. Verify infrastructure

```bash
npm run verify-infra
```

All checks should pass before proceeding.

### 7. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the Stage 0 infrastructure placeholder.

---

## Build and typecheck

```bash
npm run typecheck   # TypeScript — no emitted files
npm run lint        # ESLint
npm run build       # production build
```

---

## Stage plan

EchoSoul is built in 15 stages. See [07_build/01_antigravity_stage_plan.md](../07_build/01_antigravity_stage_plan.md) for the full plan.

**Current stage:** Stage 0 — Infrastructure  
**Do not begin Stage 1** until this setup is verified and approved.

---

## Known limitations (Stage 0)

- The home page shows a placeholder — product UI starts at Stage 1.
- Voice (STT/TTS) is stubbed — Stage 3.
- Memory/embeddings need a real embedding provider — Stage 4.
- Literature corpus is empty — Stage 6.
- Video generation is stubbed — Stage 9.
