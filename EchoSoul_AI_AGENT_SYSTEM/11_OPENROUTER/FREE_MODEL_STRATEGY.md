# Free Model Strategy

OpenRouter's free catalog changes over time. Do not hard-code one “forever free” model.

Use a provider abstraction:

AGENT_ID → CAPABILITY_PROFILE → MODEL_POLICY → ROUTER

Candidate models visible in September 2026 include:
- NVIDIA Nemotron 3 Ultra (free): long-context reasoning/orchestration
- Thinking Machines Inkling / Inkling Small (free): reasoning, agentic, multilingual, multimodal
- OpenAI gpt-oss-20b (free): structured outputs, function calling, agentic workflows
- NVIDIA Nemotron Nano 9B V2 (free): reasoning/non-reasoning
- OpenRouter free router: `openrouter/free`

These are candidates, not permanent assignments. Benchmark them for each agent.

OpenRouter's current free catalog includes many changing models and a free router that dynamically selects among eligible free models. Free availability and limits can change. citeturn0search0turn0search1

## Privacy warning

A free model is not automatically appropriate for sensitive user conversations.

For example, the current OpenRouter free-model page states that Poolside Laguna S 2.1 free inputs/outputs may be used to train/improve models. Do not route sensitive EchoSoul data to a provider/model with an incompatible data policy. citeturn0search0

For early development, use synthetic/anonymized test data for model benchmarking.

For production private conversations, choose providers/models with a data policy compatible with EchoSoul's privacy promises, or self-host an appropriate open model.

## Rate limits

OpenRouter currently lists 50 requests/day on its free platform plan. Model/provider-specific availability can differ, so the architecture must support fallback and quota-aware routing. citeturn0search11
