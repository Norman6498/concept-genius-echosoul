# EchoSoul — Copy/Paste Antigravity Stage Prompts

## Stage 0 — Foundation
Read the PRD, architecture, schema, and master prompt. Inspect the repo. Create or refine a clean modular-monolith structure, shared types, environment configuration, lint/format/typecheck/test scripts, migration setup, and documentation. Add `.env.example` with placeholders only. Do not implement real AI behavior. Finish by proving the project starts and all checks pass.

## Stage 1 — Shell
Implement auth, protected routes, profile/settings, and the six primary areas: Home, Moments, Words, Scenes, Journey, Memory. Build a polished responsive shell. Add privacy/memory status indicators and placeholders for later features. Mock data must be clearly isolated. Test auth and route protection.

## Stage 2 — Conversation
Implement text chat with persistence and streaming. Add session creation/continuation, Just Listen, and a post-listening choice surface containing: Find My Words, Find a Book/Page, Make an Animation, Make a Scene, Make a Video, Give Perspective, Give Me a Plan, Just Stay Here. Keep the user in control. Add tests for routing and Just Listen behavior.

## Stage 3 — Voice
Implement a provider-neutral STT/TTS layer. Add microphone permission handling, recording state, transcription, playback, interrupt, replay, and text fallback. Do not leak credentials to the client. Add provider mocks for tests.

## Stage 4 — Memory
Implement context extraction with strict runtime validation. Extract candidate memories and route them through a memory policy. Add user confirmation, edit/delete, Private Session, Do Not Remember, relevance retrieval, and safe surfacing. Never store every message as memory. Test false-memory and unwanted-memory scenarios.

## Stage 5 — Novel
Implement Moments and Journey as an evolving private novel. Create chapter/moment composition from approved memory only. Separate facts from reflections in both schema and UI. Allow users to correct reflection text. Test that unapproved facts are never invented into the novel.

## Stage 6 — Authentic literature
Implement a small public-domain corpus ingestion pipeline. Require provenance, rights status, source checksum, source metadata, exact text capture, segmentation, tags, embeddings, hybrid search, language filter, author filter, and relevance ranking. Build a small test corpus in fixtures. Test exact source integrity and attribution. Do not scrape modern copyrighted books.

## Stage 7 — Animated Words
Implement the literary player. It must render source text exactly, preserve line breaks, and animate it as handwriting/ink appearing on a paper-like surface. Add pause/replay/speed/read-aloud/save/another-match controls. Choose typography per script. Test character preservation against source checksums.

## Stage 8 — Creative Scene + Animation
Implement the concept-preview flow. The model creates a structured scene specification; the user reviews/edits/accepts; then an image/animation provider adapter runs asynchronously. Add progress, error, retry, cancellation where supported, private storage, and save-to-moment.

## Stage 9 — Video
Implement storyboard -> queued job -> processing -> preview. Use provider adapters. Store job state in the DB. Add retries with bounded attempts and idempotency. Keep UI useful while jobs run. Never block chat on generation completion.

## Stage 10 — Plans/Goals/Habits
Implement adaptive daily plans, user-created goals, and habits. Prioritize a small next action. Do not turn casual statements into commitments without confirmation. Add progress and completion feedback.

## Stage 11 — Safety
Implement an independently callable safety evaluator with override authority before final response and before creative generation. Add safety states, crisis-oriented UX hooks, anti-dependency checks, and red-team regression tests. Make resource content configurable by region. Never overreact to ordinary sadness.

## Stage 12 — Premium
Implement server-side plan/entitlement checks, usage counters, premium UI, and a billing adapter interface. Free tier remains usable. Safety, privacy, deletion, and basic support cannot be gated.

## Stage 13 — Evaluation
Create evaluation fixtures and scripts for memory precision, memory surfacing safety, literature relevance, source integrity, attribution accuracy, safety recall, response latency, and creative job reliability. Produce machine-readable and human-readable reports.

## Stage 14 — Production
Perform security review, RLS verification, rate limiting, privacy-safe telemetry, backups, deployment configuration, health checks, incident runbook, deletion verification, and production documentation. Perform a final end-to-end acceptance test.
