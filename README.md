# EchoSoul — Concept Genius

**Tagline:** Say what hurts. Find the words. Make the moment. Take the next step.

EchoSoul is a real-startup product concept for an adaptive AI emotional companion. It listens to a person, understands their present context, remembers meaningful parts of their journey with user control, retrieves authentic poetry/shayari/literature that fits the moment, presents those original lines in cinematic handwriting animation, and lets the user request a scene, animation, or video. It can also provide adaptive practical guidance, plans, goals, and reflective insights.

## Product principles
1. Listen before advising.
2. Authentic literature is retrieved, never presented as AI-written quotation.
3. Original literary text stays in its source language and is preserved exactly.
4. Literary presentation should feel alive: ink/handwriting reveal on a paper-like canvas, not a static quote card.
5. After listening, the user stays in control of what happens next.
6. Remember meaning, not surveillance.
7. Surface memories only when relevant, useful, and unlikely to hurt the user.
8. The user's life can be viewed as a private evolving novel, with facts separated from reflections.
9. Support adapts to the individual rather than forcing one conversational personality.
10. Safety overrides entertainment/creative modes and is never paywalled.

## Locked product decisions
- Name: EchoSoul
- Audience: broad consumer audience / everyone
- Launch languages: English, Hindi, Hinglish; architecture ready for additional Indian languages
- Conversation: balanced; voice + text in MVP
- Just Listen mode: yes
- User controls features after a listening session: yes
- Memory: hybrid automatic important-memory detection + explicit user control
- Old memory resurfacing: only when strongly relevant, emotionally safe, and potentially useful for learning/growth
- Memory presentation: novel-like private life story
- Literature: Hindi, Urdu, English, books/prose, poems/shayari
- Author selection: user may choose; otherwise EchoSoul selects the strongest match
- Initial rights model: public-domain / explicitly licensed content only; no unauthorized corpus copying
- User-contributed writers: later phase
- Literary display: original language + animated handwriting/ink-on-paper presentation
- Scene/video generation: user-triggered after listening; AI may suggest but must not force it
- Video duration: variable
- Visual style: EchoSoul chooses what it predicts will be comforting; user can influence later
- Guidance: adaptive; system learns preferences without diagnosing mental states
- Daily plans + goals/habits: yes
- Private session / do-not-remember mode: yes
- Data model: cloud-first hybrid; local cache/private session handling + secure cloud persistence
- Business: freemium; advanced creative/memory features premium
- Goal: real startup
- Build workflow: agentic staged coding in Antigravity

## Package map
- `01_product/` — PRD, feature specification, product rules
- `02_ux/` — screen map, user flows, interaction details
- `03_architecture/` — system architecture and production database/RLS design
- `04_ai/` — prompts, schemas, orchestration, memory policy
- `05_content/` — authentic literature retrieval/provenance/content operations
- `06_safety/` — safety architecture and red-team cases
- `07_build/` — Antigravity master prompt + stage-by-stage coding prompts
- `08_pitch/` — pitch deck content
- `09_project_docs/` — testing, launch checklist, decision log, documentation template

## Build rule
Antigravity must work one stage at a time. It must inspect the repository, implement only the requested stage, run tests, verify the feature, update docs, and stop. Never silently jump ahead.
