# How We "Train" EchoSoul Agents

For MVP, do not fine-tune first.

Use a five-layer training-like loop:

1. Prompt
Stable system prompt + task schema.

2. Examples
Few-shot examples covering correct and incorrect behavior.

3. Tools
Retrieval/database/catalog tools constrain the model to real evidence.

4. Evaluator
A26 judges outputs against explicit criteria.

5. Regression set
Every bug becomes a test case.

Then:
prompt revision → test → compare → deploy.

Fine-tuning is considered only after enough high-quality, legally usable training data exists and prompting/RAG/tooling has reached its limit.
