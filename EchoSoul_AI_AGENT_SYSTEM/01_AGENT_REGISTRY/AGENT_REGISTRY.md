# EchoSoul Agent Registry

| ID | Agent | Main job | Priority | Output |
|---|---|---|---|---|
| A01 | Supervisor | Orchestrate each turn | P0 | action plan |
| A02 | Safety Gate | Risk classification + intervention routing | P0 | risk decision |
| A03 | Context Interpreter | Understand situation/theme/need | P0 | context JSON |
| A04 | Support Router | Decide response style | P0 | style JSON |
| A05 | Memory Extractor | Identify worthwhile memory candidates | P0 | memory candidates |
| A06 | Memory Retriever | Retrieve useful memories | P0 | ranked memories |
| A07 | Response Composer | Produce core EchoSoul reply | P0 | response |
| A08 | Reflection Agent | Perspective/meaning without diagnosis | P0 | reflection |
| A09 | Plan Agent | Practical next step / plan | P0 | plan |
| A10 | Literature Query Agent | Turn moment into retrieval query | P0 | retrieval query |
| A11 | Literature Reranker | Rank authentic passages | P0 | ranked passages |
| A12 | Literature Explainer | Explain relevance | P1 | explanation |
| A13 | Music Curator | Recommend music | P1 | recommendations |
| A14 | Scene Director | Select/design scene | P1 | scene spec |
| A15 | Scene Personalizer | Adapt environment controls | P1 | environment config |
| A16 | Moment Extractor | Convert journal/speech to moment draft | P1 | moment |
| A17 | Mood/Gratitude/Dream Structurer | Structure reflective entries | P1 | entry |
| A18 | Journey Narrator | Explain growth as story | P1 | journey insight |
| A19 | Novel Architect | Plan chapters/themes | P2 | novel outline |
| A20 | Novel Writer | Write chapter from approved facts | P2 | chapter draft |
| A21 | Novel Fact Validator | Prevent invented life events | P2 | validation report |
| A22 | Creative Continuity Editor | Keep story/visual continuity | P2 | continuity edits |
| A23 | Personalization Agent | Convert onboarding choices into profile config | P0 | preferences |
| A24 | Voice Agent | Conversational voice turn handling | P1 | turn response |
| A25 | Entitlement Agent | Explain feature availability | P1 | entitlement explanation |
| A26 | Quality Judge | Score grounding/style/relevance | P0 | quality score |
| A27 | Untrusted Content Guard | Detect prompt injection in retrieved/user content | P0 | trust decision |

## Non-agent services

Auth, RLS, storage, billing, ad enforcement, provenance, audio playback, time-of-day, weather APIs, rate limits, audit logging and data deletion must remain deterministic services.
