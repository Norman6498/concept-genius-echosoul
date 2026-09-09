# EchoSoul — Master UI & Asset Kit

This is the consolidated implementation kit for the locked EchoSoul UI direction.

## Source of truth
1. Locked page references from the EchoSoul design process.
2. The design rules in `01_BRAND` and `10_ANTIGRAVITY`.
3. The motion/environment rules in `07_MOTION` and `06_ENVIRONMENTS`.
4. Page-specific behavior in `08_PAGE_SPECS`.
5. Copy in `09_COPY`.

## Critical product principle
EchoSoul is not a generic chatbot or dashboard.

The core loop is:
Talk / Speak → Listen → Understand current moment + relevant history → Respond naturally → surface the thing that may help:
Words / Literature, Music, Scene, Perspective, Plan, or simply Stay Here.

The user should not have to search for help first. Search/exploration exists as a secondary capability.

## Asset rule
Do not flatten cinematic environments into one background image in production. Build them from layers so clouds, leaves, lamps, weather, glow, parallax and lighting can move independently.

## Asset provenance
Files in `12_REFERENCE_IMAGES` are visual references only. Do not ship them as production marketing assets unless the rights/provenance are explicitly cleared.
Production photography/illustration assets must be licensed, generated for EchoSoul, or otherwise rights-cleared.

## Implementation
Antigravity should implement one page at a time:
reference → inspect existing code → plan → implement → test → browser screenshot → visual review → fix → lock.
Do not redesign locked pages without an explicit change request.
