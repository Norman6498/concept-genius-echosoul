# EchoSoul Agent Routing Rules

## Default conversation

A01 Supervisor
→ A02 Safety
→ A03 Context
→ A04 Support Router
→ A06 Memory Retriever (only if useful)
→ selected specialist(s)
→ A07 Response Composer
→ A26 Quality Judge
→ final safety check
→ A05 Memory Extractor after response, not before, when persistence is allowed

## Literature request
A10 Query
→ provenance-backed retrieval
→ A11 Reranker
→ A12 Explainer
→ A07 Composer
→ A26 Judge

## Music request
A13 Music Curator
→ catalog/API
→ A07 Composer

## Scene request
A14 Scene Director
→ A15 Scene Personalizer
→ deterministic renderer/config
→ A07 Composer

## Journal
A16 Moment Extractor or A17 Structurer
→ memory policy
→ optional user approval
→ persistence

## Life Novel
A19 Architect
→ A20 Writer
→ A21 Validator
→ A22 Continuity Editor
→ A21 Validator again
→ publish/export only after pass

## Safety
A02 Safety can override every route.
