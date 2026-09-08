# Antigravity Stage Prompt Template

Use this structure when adding future stages:

## CONTEXT
Read the current PRD, architecture, schema, previous stage notes, and master prompt.

## TASK
Implement ONLY: [stage feature].

## CONSTRAINTS
- Preserve completed behavior.
- Use provider adapters.
- Validate AI outputs with schemas.
- No secrets in client.
- No fabricated literature/authorship.
- Maintain accessibility and error states.

## TESTS
Write/extend unit, integration, and UI tests relevant to the stage.

## DEFINITION OF DONE
Feature works locally, failure states work, tests pass, docs updated, no critical TODOs.

## OUTPUT REPORT
Return:
1. files changed;
2. behavior implemented;
3. tests run/results;
4. known limitations;
5. any decision that must be made before the next stage.
Then STOP.
