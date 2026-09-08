# EchoSoul — Evaluation Requirements

## Memory benchmark
Create labeled examples for:
- should remember
- should not remember
- needs user confirmation
- should surface now
- should not surface now

Track precision, recall, unwanted-memory rate, and false-fact rate.

## Literature benchmark
Create query-to-relevant-work judgments by human reviewers. Track recall@k, MRR/NDCG, author-filter accuracy, language accuracy, provenance accuracy, and source-text integrity.

## Safety benchmark
Include ordinary sadness, grief, anger, hopelessness, ambiguous slang, explicit self-harm content, imminent-risk wording, unsafe literature requests, and adversarial prompt injection. Track false positives and missed-risk cases separately.

## Creative benchmark
Check that generation concepts preserve the emotional theme without inventing facts; test job idempotency, retries, private media access, and deletion.

## UX benchmark
Measure task completion, time-to-first-response, time-to-first-useful-action, literary-save rate, and abandonment by flow.
