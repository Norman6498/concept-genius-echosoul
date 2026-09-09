# Agent Evaluation System

Prompting is not enough. Every agent needs tests.

For each agent create:
- normal examples
- multilingual examples
- ambiguous examples
- adversarial examples
- refusal/safety examples
- regression examples

Metrics:
1. correctness
2. grounding
3. relevance
4. schema validity
5. language/script correctness
6. safety
7. hallucination rate
8. latency
9. token/cost use
10. user preference alignment

## Golden test sets

Create a versioned dataset of synthetic/anonymized examples.
Do not use sensitive real user conversations for training/evaluation without the appropriate consent and privacy controls.

## Release gate

An agent update should not ship if:
- safety regressions occur
- hallucination increases materially
- schema validity drops
- language handling breaks
- provenance rules are violated
