# EchoSoul — RLS, Privacy and Security Requirements

## Row Level Security
Enable RLS on all user-owned tables. A user may read/write only rows owned by `auth.uid()` directly or through a verified parent relation.

## Tables needing user ownership controls
profiles, user_settings, sessions, messages, context_snapshots, memory_items, moments, novel_chapters, moment_memory_links (via moment ownership), literature_feedback, saved_words, creative_jobs, goals, habits, entitlements (read-only to client through safe view/function), audit_events (append via server only).

## Public/shared content
`literature_works`, `literary_passages`, and `literature_tags` are shared content and should be read-only to normal clients. Corpus ingestion requires privileged server role.

## Secrets
Provider API keys exist only in server/edge secrets. Never commit `.env`, keys, service-role tokens, or provider credentials.

## Sensitive text
Minimize logging of message content. Prefer event metadata such as `feature_used=true` over raw emotional text. Debug logs containing private content must be opt-in and short-lived.

## Deletion
Account deletion must cascade or execute an explicit erasure workflow covering messages, memory, moments, media, feedback, and derived embeddings where required. Backups must have documented retention/erasure behavior.

## Memory transparency
Every visible memory should have a traceable source session and a user-facing explanation of why it exists.
