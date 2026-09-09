# Context Contract

Every agent receives only the minimum context it needs.

Do not pass the entire lifetime conversation to every agent.

Suggested context layers:
1. current user turn
2. recent conversation window
3. relevant preferences
4. relevant memories
5. task-specific retrieved evidence
6. safety decision
7. entitlement state

This reduces cost, latency and accidental exposure.
