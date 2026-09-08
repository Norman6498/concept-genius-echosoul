# EchoSoul — Antigravity Staged Build Plan

## How to use this plan
Run one stage at a time. Paste the master prompt into Antigravity once, then paste the current stage prompt. Do not ask it to build all stages in one pass.

## Global completion gate
After each stage Antigravity must:
1. run the app;
2. run typecheck/lint/tests;
3. test the intended user flow manually when UI is involved;
4. inspect logs/errors;
5. fix regressions;
6. update docs and environment examples;
7. report what is complete and what is intentionally not built yet;
8. stop.

## Stage 0 — Foundation
Repo structure, frontend/backend baseline, shared types, environment config, testing, CI-ready scripts, Supabase migration system.

## Stage 1 — Product shell
Auth, profile/settings, six-area navigation, responsive shell, privacy indicators, feature placeholders with excellent empty/loading/error states.

## Stage 2 — Conversation
Text chat, streaming responses, session persistence, Just Listen, support-mode chips, post-listening choice screen.

## Stage 3 — Voice
STT, TTS, interruption, replay, recording states, permission handling, fallback to text.

## Stage 4 — Memory
Context extraction, memory candidates, policy gate, hybrid semantic retrieval, user review/edit/delete, Private Session, Do Not Remember.

## Stage 5 — Novel
Moments, chapters, people/themes, turning points, growth view, fact-vs-reflection separation, safe memory surfacing.

## Stage 6 — Authentic literature
Public-domain corpus ingestion, provenance, checksum/source validation, tags, embeddings, hybrid retrieval, author/language filtering, feedback.

## Stage 7 — Animated words
Exact source rendering, handwriting reveal, paper canvas, timing controls, attribution, audio reading.

## Stage 8 — Creative scene/animation
Concept builder, user approval/editing, image/short-animation provider adapter, private storage, save-to-moment.

## Stage 9 — Video
Storyboard, async job queue/adapter, progress states, retry/cancel, preview, save/discard.

## Stage 10 — Plans/goals/habits
Adaptive daily plan, goal tracking, habit tracking, progress evidence, reminders only with consent.

## Stage 11 — Safety hardening
Safety evaluator, override architecture, red-team suite, safe creative gating, anti-dependency checks, regional resource configuration.

## Stage 12 — Premium
Server-side entitlements, usage counters, billing adapter, plan UX. Never gate safety/privacy/essential deletion behind premium.

## Stage 13 — Evaluation
Offline datasets and eval harnesses for memory, literature ranking, attribution, safety, hallucination, latency, and core UX.

## Stage 14 — Production
Security review, RLS verification, rate limits, observability, backups, deployment, incident runbook, privacy/data deletion verification.

## Stop condition
Do not move forward if the current stage has failing tests, unresolved security defects, broken core flows, or undocumented tradeoffs.
