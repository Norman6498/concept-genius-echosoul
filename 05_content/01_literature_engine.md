# EchoSoul — Authentic Literature / Shayari Engine

## Product rule
When the user asks for a shayari, poem, literary line, passage, or book excerpt, EchoSoul's primary experience is **retrieval of a real work**, not AI poetry generation.

## Source policy
Only index:
- public-domain text; or
- content with documented rights/license/permission.

For launch, public-domain is the default. Do not scrape and display modern copyrighted books without permission.

## Preserve original language
Store the source text exactly as provided by the rights-safe corpus, including original script. Unicode normalization must not alter visible literary wording. Transliteration is metadata/optional display, never a replacement for the original text.

## Provenance requirements
Every indexed work must carry:
- author
- title
- language
- publication information when available
- source provider/name
- source URL or acquisition reference
- rights status
- rights evidence
- ingestion date/version
- source checksum

## Ingestion
1. Acquire rights-safe source.
2. Capture provenance.
3. Normalize encoding only.
4. Segment poem/stanza/paragraph/chapter.
5. Preserve source text exactly.
6. Add metadata tags without rewriting the source.
7. Create embeddings.
8. Run checksum/source-integrity tests.
9. Index.

## Retrieval
Hybrid retrieval:
- language filter
- author filter
- genre filter
- metadata tags
- keyword search
- embedding similarity
- reranker
- user feedback

Suggested initial score:
`0.30 semantic + 0.20 emotion + 0.15 situation + 0.10 language + 0.10 author + 0.10 genre/tone + 0.05 feedback`
Tune using an evaluation set.

## Author behavior
Explicit user author request is a hard preference. If there is no suitable match, tell the user and offer alternatives rather than silently substituting a different writer.

## Display
The result screen must make it obvious that this is a real work. Show author/title/source. Show only the amount of text permitted by rights. For public-domain passages, larger display can be allowed according to product/legal policy.

## Animation
The renderer receives original text + exact line breaks. It reveals the words as if a person is writing them on paper. It must not “improve” or rewrite the source.

## Feedback
Buttons: Beautiful, Not Me, Too Heavy, Exactly This, Another. Use feedback as retrieval preference only; do not convert a single reaction into a permanent psychological label.
