# EchoSoul — Orchestration Logic

```text
USER INPUT
  -> Speech-to-text (if voice)
  -> Auth + rate limit
  -> Safety pre-check
  -> Context extraction
  -> Retrieve approved relevant memory
  -> Support-mode router
      |-> listen/reflect -> conversational response
      |-> literature -> retrieval service
      |-> creative -> concept builder -> user approval -> media job
      |-> plan -> action planner
      |-> perspective -> reflection/perspective response
  -> Safety post-check
  -> Response
  -> Candidate memory extraction
  -> Memory policy
      |-> discard
      |-> propose
      |-> store
```

## Routing precedence
1. Safety override.
2. Explicit user request.
3. Just Listen mode.
4. Strong contextual need.
5. Default balanced support.

Examples:
- “bas meri suno” -> Just Listen.
- “shayari suna do” -> literature retrieval.
- “book ki line chahiye” -> literature retrieval.
- “ispe animation bana” -> creative.
- “ab main kya karun?” -> plan/perspective.

## Critical rule
After a listening exchange, show the user a choice set. Do not autonomously create a costly video unless the user explicitly selected it.
