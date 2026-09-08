# EchoSoul — API Contracts (Initial)

These are logical contracts. Antigravity may adapt naming to the selected framework, but behavior and validation should remain equivalent.

## POST /sessions
Input: `{ mode, is_private, language }`
Output: `{ session_id, mode, is_private }`

## POST /sessions/:id/messages
Input: `{ content, input_type, language }`
Behavior: safety pre-check -> context -> memory -> orchestration.
Output stream/event types may include `token`, `state`, `action_choices`, `safety`, `done`.

## POST /sessions/:id/voice/transcribe
Input: audio upload/reference.
Output: `{ transcript, language, confidence }`.

## POST /speech/synthesize
Input: `{ text, language, voice_profile }`.
Output: audio reference.

## GET /memory
Query: search/filter/category.
Output: paginated memory objects.

## POST /memory/candidates/:id/decision
Input: `{ decision: approve|reject|edit, edited_content? }`.

## PATCH /memory/:id
Input: editable fields only.

## DELETE /memory/:id
Soft-delete, with audit event.

## POST /literature/search
Input: `{ query_context, language, author_id?, genre?, limit }`.
Output: ranked source-backed passages.

## POST /creative/jobs
Input: `{ moment_id, job_type, concept_spec, provider_preferences? }`.
Output: `{ job_id, status }`.

## GET /creative/jobs/:id
Output: status + safe media reference when complete.

## POST /plans/daily
Input: `{ goals?, constraints?, date }`.
Output: structured small-action plan.

## Error contract
Return machine-readable error code + human-safe message. Never expose provider stack traces, secrets, database internals, or private prompts.
