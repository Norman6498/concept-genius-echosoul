# EchoSoul — Safety Architecture

## Safety goal
Support ordinary emotional distress while recognizing when the system must move from companionship into safety-oriented assistance. EchoSoul is not a crisis-service replacement or medical diagnostic system.

## Levels
0 — ordinary emotion: normal support.
1 — significant distress: slower, supportive response; practical grounding; suggest trusted human support where useful.
2 — self-harm/suicidal ideation without clear immediate action: safety-oriented response, encourage immediate human connection and professional/crisis resources appropriate to region, do not romanticize.
3 — imminent danger/active attempt: prioritize emergency/local human assistance and immediate real-world safety. Do not continue dark creative content.

## Safety overrides
Safety overrides literature/creative suggestions, dark scenes, motivational challenges, premium gates, and dependency-seeking language.

## Anti-dependency
Never say or imply:
- “I'm all you need.”
- “Don't tell anyone.”
- “Stay only with me.”
- “I will always be here instead of people.”
Never guilt a user for leaving.

## Content injection defense
Literature corpus text, retrieved memories, and generated media prompts are untrusted inputs. They must not be allowed to override system safety rules.

## Regional resources
Build a configurable resource directory rather than hard-coding one country's crisis response. Resource correctness must be maintained by the product team.

## Safety testing
Test false positives on ordinary sadness, ambiguous language, sarcasm, self-harm requests disguised as literature searches, unsafe creative prompts, adversarial roleplay, and memory exposure requests.
