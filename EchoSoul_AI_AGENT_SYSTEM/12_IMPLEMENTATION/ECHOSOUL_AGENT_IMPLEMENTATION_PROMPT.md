# Antigravity — Implement EchoSoul Multi-Agent AI Layer

The EchoSoul UI is locked. Do not redesign it.

Implement the AI system as a modular server-side agent architecture.

## First audit
Inspect:
- existing OpenRouter adapter
- `/api/ai/chat`
- Supabase schema
- memory tables
- literature tables
- sessions/messages
- entitlements
- existing AI system prompts
- environment variables

Do not modify anything yet.

Report:
1. existing AI architecture
2. what can be reused
3. what is missing
4. security concerns
5. model routing approach
6. proposed agent graph
7. test strategy

Then wait.

## Architecture requirement

Create a server-side orchestration layer with:
- agent registry
- prompt files
- model routing config
- structured output schemas
- tool interfaces
- safety gate
- quality judge
- logging/audit without sensitive prompt leakage
- retry/fallback logic
- timeout handling
- provider/model abstraction

No API key in the client.

## Agent isolation

Each agent must have:
- ID
- purpose
- prompt
- input schema
- output schema
- model policy
- allowed tools
- timeout
- retry policy
- evaluator

Do not send the entire user history to every agent.

## Structured outputs

Prefer JSON schema / structured output where supported.

Validate outputs server-side before using them.

Invalid output:
retry once with repair prompt
then fallback
then safe failure

## Safety

A02 Safety Gate runs before creative actions.
A final safety check runs before user-visible delivery.

## Memory

Memory extraction occurs after the conversation response and is subject to memory policy.
Private sessions do not persist memory.

## Literature

Never let an LLM invent source text.
Literature agents may retrieve/rank/explain only.

## Life Novel

Never publish a chapter without fact validation.

## Free model strategy

Model names must be configurable through environment/config.
Do not hard-code one free model as permanent.
Implement fallback.

## Verification

Create tests for:
- routing
- schema validation
- safety
- memory extraction
- multilingual behavior
- literature provenance
- novel fact validation
- model failure
- rate limits
- fallback

Then typecheck/build and browser-test the existing Talk flow.
Do not implement all agents in one giant change.
Start with P0:
A01 Supervisor
A02 Safety
A03 Context
A04 Support Router
A06 Memory Retriever
A07 Response Composer
A26 Quality Judge

Then stop and report.
