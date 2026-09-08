# EchoSoul UI Specification

## Product
EchoSoul — Concept Genius Project
Tagline: Feel · Reflect · Heal · Grow

## Design North Star
A private literary room + personal journal + cinema experience. The interface must not resemble a generic chatbot or clinical mental-health dashboard.

Primary qualities: intimate, calm, literary, cinematic, adaptive, trustworthy.

## Core UI Decisions
- Responsive web app first; mobile-first layout, desktop expansion.
- Hybrid visual theme: dark cinematic shell with warm paper/literary surfaces.
- Adaptive emotional presentation: motion, density, lighting and visual treatment can change with context, but never reduce a person to a simplistic color/status.
- No human-like AI avatar. Use an abstract listening presence/orb.
- Adaptive home greeting.
- Main nav: Home / Moments / Talk / Words / Journey.
- Scenes and Music are major experiences reachable from Talk and Moments; Profile/Settings is secondary navigation.
- Returning-user opening behavior is adaptive based on relevant recent context.

## Primary Navigation
Desktop sidebar:
Home
Moments
Talk
Words
Journey

Secondary:
Scenes
Music
Memory
Profile / Settings

Mobile bottom navigation:
Home | Moments | Talk | Words | Journey

The Talk control is visually emphasized but not intrusive.

# Screen Inventory

## 01 — Splash
Purpose: establish emotional identity.
Elements:
- EchoSoul logo/symbol
- atmospheric night visual
- tagline
- subtle ambient motion
- Begin CTA

## 02 — Onboarding
Purpose: explain what EchoSoul does without sounding like a medical product.
Core statements:
- Talk freely — I'll listen.
- Real words — from real writers.
- Music for your moment.
- Visuals for your feelings.
- A story of you — your moments, your growth.
Actions:
Continue / Skip

## 03 — Dynamic Home
Hero:
- personalized time/greeting
- adaptive question such as “How are you, really?”
- Talk / Type CTAs

Sections:
- Continue Your Story
- Something for you today: Words / Music / Scene / Plan
- relevant recent moment
- optional gentle follow-up

Avoid dashboard overload.

## 04 — Listening Screen
Full-screen immersive mode.
Components:
- abstract listening orb
- subtle audio waveform
- live transcript optionally visible
- Pause
- End
- Just stay

The system should visually feel attentive rather than “processing.”

## 05 — Post-Listening Reflection
Header: “I heard you.”
Show:
- concise interpretation
- emotional/context chips
- one-sentence reflection

Primary choices:
- Just stay with me
- Find my words
- Give me a plan
- Make a scene
- Play some music
- Show me a book page

More options can reveal secondary actions.

## 06 — Words / Literature Match
Header: “Found for this moment”
Controls:
- Shayari
- Poetry
- Quotes
- Books

Result card must distinguish:
- authentic excerpt/work
- writer
- book/collection
- source/provenance
- public-domain status for MVP

Actions:
Read / Listen / Save / More

Never label AI-generated text as a writer's work.

## 07 — Handwriting Poetry Experience
Full-screen visual reading mode.
Paper surface + authentic original script.

Animation:
- paper settles into place
- pen/ink stroke begins
- letters appear sequentially as if physically written
- line breaks preserved
- deliberate pauses between lines
- complete piece remains visible after writing finishes

Script-aware visual treatment:
- Devanagari handwriting
- Urdu/Persian calligraphy treatment where appropriate
- Latin handwriting

Do not alter the author's wording to make it “prettier.” Visual presentation is the creative layer; text remains authentic.

## 08 — Book Page Experience
Book-like reading surface.
Elements:
- page texture
- book title
- author
- chapter/page metadata where available
- permitted excerpt
- Why this fits you
- Read Quietly / Listen / Save

MVP library: public-domain works only unless explicit licensing exists.

## 09 — Music for Your Moment
Header: “Music for this moment”
Mood choices may include:
Calm / Sad / Hope / Motivation / Focus / Release / Sleep

Music card:
- artwork/scene
- title
- type: ambient / instrumental / licensed / connected service
- duration
- play state

Player:
play/pause, seek, previous/next where applicable, favorite, queue.

Music should be selected using emotional context + user preferences, not just generic mood labels.

## 10 — Scenes
Header: “Turn your feelings into a scene.”
Inputs:
- desired emotional outcome: Comfort / Motivation / Acceptance / Hope / Reflection / Surprise
- style: Anime / Cinematic / Nature / Minimal / Fantasy / Adaptive
- duration: variable

Output:
- preview frame
- play
- short description
- create another

The AI chooses the most comforting visual treatment by default, while allowing user override.

## 11 — Moments / Your Story
This is not a chat-history list.
Present meaningful events as a narrative timeline.

Views:
- Timeline
- Chapters

Each moment can contain:
- date/time
- title
- short summary
- emotional theme
- saved words
- generated scene
- music experience
- practical step
- outcome/follow-up

AI may suggest chapter names; user can rename/edit.

## 12 — Journey
Focus on change, not simplistic mood scores.
Show:
- meaningful milestones
- repeated themes
- challenges
- actions taken
- changes noticed over time

Example wording:
“You've moved from describing the problem to taking small actions.”

Avoid pseudo-clinical analytics.

## 13 — Memory
Memory feels like an archive/novel index.
Categories:
- People
- Patterns
- Preferences
- Important Moments
- Goals
- Growth

Each memory shows:
- what is remembered
- when learned
- why it was saved
- edit
- delete

Global controls:
- Don't remember this conversation
- Delete selected memory
- Clear all memories

## 14 — Special Mode: Stay With Me
Minimal UI.
No advice unless requested.
Large listening presence.
Gentle ambient sound controls.
Optional poetry/music/ambient/breathing tools.
Primary text:
“You don't have to explain more.”

## 15 — Complete Experience
A user can request multiple elements after listening.
Example flow:
Poetry → Music → Scene → Reflection → Next step

This should feel like a curated emotional experience, not a multi-step wizard.

## 16 — Profile / Settings
Sections:
- My Story
- My Memories
- My Words
- My Scenes
- Music Preferences
- Voice & Language
- Visual Preferences
- Privacy & Data
- Safety
- Premium

# UI Components

## Buttons
Primary: warm paper/amber accent with dark text.
Secondary: translucent dark surface.
Icon button: compact, circular, high contrast.

## Chips
Used for emotional/context labels, not as diagnoses.
Examples: Lonely, Pressured, Uncertain, Hopeful, Tired.

## Cards
Use sparingly. Prefer layered surfaces rather than a grid of generic SaaS cards.

## Typography
Headlines: refined serif or literary display face.
Body/UI: highly legible sans-serif.
Handwritten/calligraphic face only for decorative/animated literary presentation.

## Surface hierarchy
1. Cinematic background
2. Glass/dark content surface
3. Warm paper reading surface
4. Highlight/CTA surface

# Motion System

Listening: slow breathing/pulse.
Thinking/loading: organic movement; avoid generic spinner.
Literature search: page/ink transition.
Poetry: handwriting reveal.
Memory: subtle page-turn/chapter transition.
Scene generation: storyboard-to-frame progression.
Success: soft light bloom, no confetti.

Motion should be slower for reflective states and simpler when overwhelmed.

# Accessibility
- Keyboard navigation.
- Screen-reader labels for all icon buttons.
- Captions/transcripts for voice/video.
- Reduced-motion mode.
- Sufficient contrast.
- Scalable text.
- Never communicate important meaning by color alone.

# Responsive Rules
Mobile:
- single-column immersive experience
- bottom nav
- full-screen listening and literature modes
- sticky primary action where helpful

Desktop:
- persistent sidebar
- centered content canvas
- optional split-pane reading/chat layouts
- wide cinematic media cards

# Design Tokens
Primary background: near-black/navy.
Secondary surface: blue-black.
Literary surface: warm ivory/aged paper.
Accent: muted warm gold/amber.
Secondary accent: soft lavender/blue for selected emotional experiences.
Danger: reserved, accessible red only for safety/system warnings.

Corner radius: medium-to-large for modern surfaces; page surfaces can use subtle irregularity.
Shadows: soft and atmospheric.

# UX Principles
1. Listen before advising.
2. Never overwhelm a distressed user with choices.
3. Let the user request a creative feature after listening.
4. Real literature remains authentic and sourced.
5. Generated visuals are clearly identified as generated.
6. Memory is visible, editable and deletable.
7. Old memories appear only when relevant and emotionally safe.
8. The UI should create emotional space, not demand engagement.
9. Avoid clinical labels and fake certainty.
10. The experience should feel like a companionable literary studio, not a productivity dashboard.

# Antigravity UI Build Sequence
Stage 1: app shell + routing + design tokens.
Stage 2: splash + onboarding.
Stage 3: dynamic home.
Stage 4: talk/listening experience.
Stage 5: post-listening action surface.
Stage 6: Words + literature result UI.
Stage 7: handwriting reading experience.
Stage 8: music screen/player.
Stage 9: scenes/video experience.
Stage 10: moments/story.
Stage 11: journey.
Stage 12: memory.
Stage 13: Stay With Me.
Stage 14: profile/settings.
Stage 15: accessibility, motion, responsive polish and visual QA.

# Acceptance Criteria
The UI is not considered complete until:
- every primary screen has empty/loading/error/success states;
- voice interactions work responsively;
- the poetry animation preserves authentic text and source attribution;
- music and creative features can be launched from the post-listening screen;
- the Story/Novel view feels narrative rather than database-like;
- memory controls are obvious;
- reduced motion is respected;
- mobile and desktop layouts are both usable;
- no screen looks like a generic AI chat template.
