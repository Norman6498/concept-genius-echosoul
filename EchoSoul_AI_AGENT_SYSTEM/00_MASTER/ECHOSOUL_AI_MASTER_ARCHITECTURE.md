# EchoSoul AI Master Architecture

## Core principle

EchoSoul is not one giant prompt.

It is a coordinated system of specialized agents, deterministic services, retrieval systems, safety gates, and validators.

User:
Speak / Type
↓
Input normalization
↓
Safety pre-check
↓
Supervisor / Router
↓
Context + preference retrieval
↓
Specialized agents
↓
Evidence / retrieval tools
↓
Safety post-check
↓
Response composer
↓
Memory candidate extraction
↓
Persistence only if policy allows

## Agent philosophy

Each agent gets:
- one narrow responsibility
- a stable system prompt
- explicit input schema
- explicit output schema
- allowed tools
- forbidden behavior
- quality criteria
- evaluation set

Do not ask one LLM to simultaneously be therapist, memory database, literary search engine, music curator, scene director and novel writer.

## Important distinction

Some capabilities are NOT LLM agents:
- authentication
- Supabase RLS
- database writes
- entitlement checks
- rate limits
- ad policy enforcement
- provenance storage
- exact literary text storage
- audio playback
- billing
- deterministic time-of-day
- accessibility settings

Use code/services for those.

## Core agent graph

1. Supervisor / Conversation Orchestrator
2. Safety Gate
3. Context Interpreter
4. Support-Style Router
5. Memory Extractor
6. Memory Retriever / Relevance Judge
7. Response Composer
8. Reflection / Perspective Agent
9. Practical Plan Agent
10. Literature Query Agent
11. Literature Reranker
12. Literature Explanation Agent
13. Music Curator
14. Scene Director
15. Scene Personalization Agent
16. Journal/Moment Extractor
17. Mood/Gratitude/Dream Structurer
18. Journey Narrator
19. Life-Novel Architect
20. Life-Novel Chapter Writer
21. Life-Novel Fact Validator
22. Creative Continuity Editor
23. Personalization Agent
24. Voice Conversation Agent
25. Premium/Entitlement Explainer
26. Quality / Grounding Judge
27. Prompt-Injection / Untrusted-Content Guard

## MVP priority

P0:
Supervisor
Safety
Context
Memory
Response
Literature
Plan
Personalization

P1:
Music
Scenes
Moments
Journey
Voice

P2:
Life Novel
Cinematic story
Advanced creative continuity
Premium optimization

## Critical rule

Do not claim that each agent is “trained” merely because it has a prompt.

For the MVP, agents are specialized through:
- system prompts
- schemas
- tools
- retrieval
- examples
- deterministic guardrails
- evaluation datasets
- regression tests

Fine-tuning is a later optimization, not the foundation.
