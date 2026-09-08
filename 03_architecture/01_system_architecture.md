# EchoSoul — System Architecture

## Architecture goal
Provider-agnostic, secure, testable system that can start small and scale without locking the product to one AI vendor.

## Recommended baseline
- Frontend: TypeScript web app initially; mobile-friendly architecture
- Backend/API: TypeScript service
- Auth + relational data: Supabase/PostgreSQL
- Vector retrieval: pgvector
- Object/media storage: S3-compatible or Supabase Storage
- Background jobs: provider-neutral queue abstraction
- AI providers: adapter interfaces for LLM, STT, TTS, image, animation/video
- Observability: structured logs + privacy-safe events

## Logical services
1. Auth/Profile
2. Conversation/Session
3. Safety
4. Context extraction
5. Memory
6. Literature retrieval
7. Literary renderer
8. Creative jobs
9. Plans/goals/habits
10. Journey/Novel
11. Entitlements/Billing
12. Audit/Privacy

## Request pipeline
Client -> auth/rate limit -> STT if needed -> safety pre-check -> context extraction -> memory retrieval -> orchestrator -> response -> optional retrieval/creative action -> safety post-check -> response -> memory candidate extraction -> memory policy -> persistence.

## Important separation
Safety must be independently callable. Literature retrieval must be separate from the generative model so provenance is not hallucinated. Creative prompt generation must be separated from media execution. Memory storage must be policy-gated.

## Provider interfaces
Define interfaces such as:
- `LLMProvider.generate()`
- `STTProvider.transcribe()`
- `TTSProvider.synthesize()`
- `ImageProvider.generate()`
- `VideoProvider.createJob()` / `getJob()`
- `EmbeddingProvider.embed()`

The UI should never know provider-specific credentials.

## Data flow rules
- Never expose provider secrets to browser code.
- Validate all AI JSON with runtime schemas.
- Treat literature corpus text as untrusted content; protect prompts from injection.
- Generated media is private by default.
- Every literary result carries source provenance.

## Scalability
Start as a modular monolith if speed is needed. Split services only when load, team boundaries, or reliability justify it. Do not create microservices for appearance.
