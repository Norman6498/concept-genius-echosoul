# EchoSoul — Page 03 / Screen 02: Your Interests

## Status
This screen is the next approved onboarding screen after Page 03 / Screen 01: About You.
Use the attached reference image as the visual source of truth.

## Goal
Let the user select interests that personalize EchoSoul recommendations and experiences.
Selections must be real interactive controls and must persist to the authenticated user's profile/preferences in Supabase.

## Required interaction
- Multi-select interest tiles with clear selected/unselected/focus/hover/press states.
- Categories visible in the reference: Subjects & Learning; Creative Interests; Wellness & Life; Entertainment.
- Allow multiple selections in each category.
- Include an "Other" option and an optional free-text custom interest field.
- Include optional overall vibe selection.
- Back returns to Screen 01 without losing saved selections.
- Next validates, saves, and moves to Screen 03: Your World.
- Skip for now must be real and preserve sensible defaults.
- Progress indicator must update.
- Keyboard accessible; visible focus states; reduced-motion support.
- Mobile must reflow into a touch-friendly layout, not simply shrink the desktop layout.

## Personalization meaning
Selections should influence later experiences such as:
- Words/literature recommendations
- Music recommendations
- Scene/visual recommendations
- Conversation context
- Life Novel themes where relevant

## Visual rules
- Preserve the locked EchoSoul identity.
- Midnight Soul base with warm ivory/gold typography and accents.
- Use cinematic imagery, literary details, restrained glow, elegant serif display typography, clean sans-serif UI typography.
- Keep the six visual worlds as one unified universe; do not introduce a new unrelated theme.
- Avoid generic SaaS dashboard styling.
- Avoid neon AI gradients, excessive rounded cards, emoji-based brand icons, or decorative clutter.
- Motion must be subtle and purposeful.

## Important
Do not hard-code a user's personal name in production.
Do not invent authentication or persistence.
Do not build later onboarding screens yet.
Do not replace the attached visual reference with a generic template.
