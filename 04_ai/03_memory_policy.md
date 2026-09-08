# EchoSoul — Memory Policy

## What qualifies for memory
Store items that are likely to be useful later: stable preferences, repeated themes, meaningful milestones, explicit goals, important relationship context when appropriate, and user-approved moments.

## What usually does not qualify
Temporary moods, throwaway statements, sensitive details not needed for future utility, credentials, secrets, and speculative inferences.

## Candidate -> policy
1. Extract candidate.
2. Score usefulness, stability, explicitness, sensitivity, and repetition.
3. Reject obviously temporary/trivial candidates.
4. Sensitive candidates require a higher threshold and may require user confirmation.
5. Private session: reject persistence.
6. User can always delete.

## Surfacing policy
`surface = relevance × usefulness × confidence × safety_factor`.
A high vector similarity is not enough. Strongly similar painful memories should be withheld when they are not clearly useful.

## Growth rule
When surfacing an older memory, the response should connect it to the current situation in a way that can teach or clarify, not simply reopen pain.

## Novel rule
Never convert an inference into a factual biography. Facts and reflections use separate storage/types and UI labels.
