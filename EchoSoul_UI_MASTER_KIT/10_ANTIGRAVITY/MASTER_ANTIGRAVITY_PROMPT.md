# MASTER ANTIGRAVITY IMPLEMENTATION PROMPT

You are implementing EchoSoul from the locked UI system. Treat the repository's existing infrastructure as the source of truth for technical setup and this UI kit as the source of truth for visual/interaction behavior.

## NON-NEGOTIABLE
1. Do not redesign locked pages.
2. Do not replace the EchoSoul identity with generic SaaS/dashboard UI.
3. Do not hard-code a user name. Use authenticated profile displayName with a safe fallback.
4. Do not invent literary quotes, authors, testimonials, statistics or social proof.
5. Do not use one flat JPG as a “living background”. Layer the environment.
6. Do not invent features that are not in the page spec.
7. Do not make search the primary UX for Music, Words or Scenes; recommendations are contextual first.
8. Preserve Hindi, Urdu-as-language-in-Devanagari, English and future language/script separation.
9. Core safety, privacy and essential emotional support are never paywalled.
10. Free ads must never use conversations, memories, mood or sensitive data for targeting.

## BUILD METHOD
For every page:
A. inspect existing code and assets
B. compare against page reference
C. write a mini implementation plan
D. implement only the approved page
E. typecheck/build
F. run browser visual check
G. verify responsive behavior
H. verify keyboard/focus/reduced-motion behavior
I. screenshot desktop + mobile
J. fix visual differences
K. report changed files and verification results

## LIVING ENVIRONMENT
Implement a reusable environment engine/component. It should support:
- time-of-day theme
- weather
- cloud drift
- foliage movement
- lamp/candle flicker
- glow
- parallax
- particles
- ambient sound
- cursor proximity
- reduced motion
- performance degradation

Do not duplicate the animation implementation separately on every page.

## SHELL
Desktop:
- collapsible left navigation
- main workspace
- collapsible right context/profile panel
Mobile:
- bottom navigation/drawer
- no shrunken desktop layout
Talk, Words, Music and Scenes can enter immersive mode with chrome minimized.

## RESPONSE EXPERIENCE
When EchoSoul answers, visually show the actual response—not only a listening waveform.
The answer may contain:
reflection → relevant literature/music/scene → practical next step.
Only show additional modules when relevant.

## LITERATURE
Retrieval output must preserve exact source text. Store/display author, work, language, source, rights status and provenance. Never allow the creative renderer to mutate source text.

## STORY
The Life Novel is generated from approved factual material. Separate:
- factual event
- user reflection
- narrative presentation.
Never invent life events.

## OUTPUT
After each implementation:
- changed files
- tests/typecheck/build
- browser verification
- remaining visual issues
- next smallest task
