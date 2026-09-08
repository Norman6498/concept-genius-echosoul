# EchoSoul — OpenRouter Setup Guide

## What is OpenRouter?

OpenRouter is an AI API aggregator that routes requests to many models
(GPT-4o, Claude, Gemini, Llama, Mistral, Gemma, etc.) under one API key.

EchoSoul uses OpenRouter as the primary AI gateway to:
- Keep the application model-agnostic
- Start with free/low-cost models
- Switch models without rewriting logic

---

## Step 1: Create an OpenRouter account

1. Go to [openrouter.ai](https://openrouter.ai) and sign in
2. Navigate to [openrouter.ai/keys](https://openrouter.ai/keys)
3. Click **Create key**
4. Name it: `echosoul-dev`
5. Copy the key — you will only see it once

Add to `.env.local`:
```
OPENROUTER_API_KEY=sk-or-v1-...
```

**Never share this key or commit it to git.**

---

## Step 2: Configure models

EchoSoul uses separate model slots for different tasks.
Edit these in `.env.local`:

```env
# Primary conversational model
OPENROUTER_CHAT_MODEL=google/gemma-3-27b-it:free

# Fast/cheap model for classification and simple tasks
OPENROUTER_FAST_MODEL=google/gemma-3-12b-it:free

# Reasoning model for complex analysis
OPENROUTER_REASONING_MODEL=google/gemma-3-27b-it:free

# Embedding model (if using OpenRouter for embeddings)
# Note: OpenRouter does not currently expose a dedicated /embeddings endpoint.
# Use a dedicated embedding provider for Stage 4 (Memory).
OPENROUTER_EMBEDDING_MODEL=
```

---

## Free model strategy

EchoSoul is designed to minimize cost during development.

**Current recommended free models** (verify availability at openrouter.ai/models):

| Slot | Model | Notes |
|------|-------|-------|
| Chat | `google/gemma-3-27b-it:free` | Strong instruction following, multilingual |
| Fast | `google/gemma-3-12b-it:free` | Faster, cheaper for classification |
| Reasoning | `google/gemma-3-27b-it:free` | Use same as chat until a reasoning model is needed |

> **Important:** Free models may become unavailable or rate-limited.
> The model slot configuration allows switching models in `.env.local`
> without any code changes. This is by design.

---

## Provider abstraction

The application never calls OpenRouter directly from product code.
All AI calls go through:

```
Product code
  → getAIProvider()        (src/lib/ai/index.ts)
  → OpenRouterAdapter      (src/lib/ai/openrouter.ts)
  → /api/ai/chat           (server-side API route)
  → openrouter.ai/api/v1
```

The browser only calls `/api/ai/chat` — the API key never leaves the server.

---

## Embeddings

OpenRouter does not currently expose a `/v1/embeddings` endpoint.

For Stage 4 (Memory) vector search, use a dedicated embedding provider:
- **Voyage AI** — `voyage-multilingual-2` supports Hindi/Urdu/English
- **Cohere** — `embed-multilingual-v3.0`
- **OpenAI** — `text-embedding-3-small`

The `EmbeddingProvider` interface in `src/lib/ai/types.ts` is ready.
Add a new adapter when Stage 4 begins.

---

## Verifying the connection

```bash
npm run verify-infra
```

Or directly test the health endpoint after starting the dev server:
```bash
curl http://localhost:3000/api/ai/health
```

Expected response:
```json
{ "ok": true, "provider": "openrouter", "model": "...", "response": "ready" }
```

---

## Rotating the API key

1. Go to [openrouter.ai/keys](https://openrouter.ai/keys)
2. Delete the old key
3. Create a new key
4. Update `OPENROUTER_API_KEY` in `.env.local`
5. Update the production secret store if deployed

---

## Cost management

- Use the free-tier models during development
- Set spending limits in the OpenRouter dashboard
- The health check (`/api/ai/health`) uses ≤ 8 output tokens
- Monitor usage at [openrouter.ai/activity](https://openrouter.ai/activity)
