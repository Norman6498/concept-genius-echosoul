# EchoSoul — Layer-by-Layer Antigravity UI Build Pack

This pack splits the authenticated/public experience into eight implementation layers. Build one layer, verify it, then stop before starting the next.

## Design rule
Do not copy the reference artwork literally. Use it as visual direction for hierarchy, atmosphere, typography, layout, motion and product storytelling.

## User identity rule
Never hard-code a demo person's name such as Aarav. Use the authenticated user's profile/display name with a safe fallback.

## Build order
1A Landing → 1B Login/Signup → 1C Personalization → 1D App Shell → 1E Home → 1F Talk/Post-Listening → 1G Words/Music/Scenes → 1H Moments/Journey/Settings

## Stage 1A — Public Landing Website

**Reference image:** `visual-references/01A_Landing.png`

**Goal:** Build the public marketing website: premium first impression, clear value proposition, trust, and a strong conversion path into the journey.

```text
Build Stage 1A of EchoSoul: the PUBLIC LANDING WEBSITE only.

IMPORTANT PRODUCT RULE:
This is NOT the logged-in product dashboard. Do not show the authenticated application sidebar, memories, private conversations, or user-specific data.

Use the supplied Stage 1A reference image as visual direction, not as a pixel-copy target.

Build a premium consumer-tech landing page with:
- elegant EchoSoul brand mark/wordmark
- top navigation: How it works, Experiences, Safety, Pricing
- Sign in
- Begin your journey CTA
- large cinematic hero section
- strong statement: "A kinder world within you"
- supporting message about listening, literature, music, visual experiences, and growth
- primary CTA
- secondary "watch the story" experience
- feature/value strip below hero
- responsive desktop/tablet/mobile layouts
- premium typography hierarchy
- atmospheric imagery
- restrained motion
- accessible contrast and keyboard navigation

Do NOT use fake statistics, fake testimonials, fake logos, or invented customer claims.

The page must feel like a serious consumer startup website, not a SaaS admin template.

Create reusable components for:
Navbar, Hero, CTA buttons, Value pillars, Experience preview, Safety/trust section, Pricing preview, Footer.

Implement actual routing:
/
/how-it-works
/experiences
/safety
/pricing
/login

The CTA "Begin your journey" should route to /signup or the first onboarding step as appropriate.

Use user-neutral copy. Never hard-code a person's name.
```

## Stage 1B — Login / Sign Up

**Reference image:** `visual-references/01B_Login_Signup.png`

**Goal:** Build a trustworthy authentication experience with clear separation between marketing pages and the private product.

```text
Build Stage 1B of EchoSoul: Login / Sign Up.

Use the supplied Stage 1B visual reference.

Requirements:
- clean split layout on desktop
- immersive EchoSoul visual on one side
- authentication panel on the other
- Sign in and Create account modes
- email/password flow
- OAuth buttons only if real providers are configured; otherwise clearly marked disabled/provider-ready controls
- password visibility control
- forgot password
- terms/privacy links
- clear error states
- loading states
- mobile-first responsive behavior
- accessibility
- no fake authentication
- use the actual Supabase auth architecture already present in the repository

Important:
Do not expose Supabase service-role credentials.
Do not hard-code a user name.
After successful authentication, route the user to onboarding when profile personalization is incomplete, otherwise route to the authenticated application.

Create reusable AuthLayout, AuthForm, OAuthButtons, PasswordField, AuthMessage components.

Keep visual language consistent with Stage 1A.
```

## Stage 1C — Personalization / Onboarding

**Reference image:** `visual-references/01C_Onboarding.png`

**Goal:** Build the multi-step setup that makes EchoSoul feel personal without becoming a long boring survey.

```text
Build Stage 1C: EchoSoul Personalization / Onboarding.

Use the supplied Stage 1C/Stage 1C concepts as reference.

This is a REAL customization system, not decorative UI.

Create a short progressive onboarding flow with:
1. What should we call you?
2. Preferred language(s): English, Hindi, Hinglish, plus extensible future languages
3. How should EchoSoul speak? Supportive, Thoughtful, Playful, Direct
4. Literature preferences: languages, genres, writers/poets
5. Music preferences: ambient, lo-fi, Indian classical, cinematic, acoustic, instrumental, vocals
6. Visual preferences: cinematic, anime, nature, minimal, fantasy
7. Privacy/memory preference
8. Completion

Rules:
- user can skip optional personalization
- user can change every preference later
- show progress clearly
- save real profile/preferences to Supabase
- do not create a fake "mental profile" from a checkbox survey
- no clinical diagnosis
- explain briefly why personalization improves recommendations
- preserve user control over memory
- provide back/next controls
- use elegant progressive transitions
- responsive mobile/desktop
- keyboard accessible

The onboarding should feel like a premium consumer app setup, not a questionnaire dashboard.

Do not ask for sensitive information that the product does not need.
```

## Stage 1D — Authenticated Application Shell

**Reference image:** `visual-references/01D_App_Shell.png`

**Goal:** Build the real product frame with desktop side navigation, mobile navigation, top controls, content workspace, profile, and responsive behavior.

```text
Build Stage 1D: authenticated EchoSoul application shell.

This is the PRIVATE PRODUCT, separate from the public landing site.

Desktop:
- persistent left navigation/sidebar
- main content workspace
- compact top bar
- profile/menu area
- search/notification utilities as appropriate
- clear active navigation state

Primary navigation:
Home
Moments
Talk
Words
Music
Scenes
Journey

Secondary:
Search
Notifications
Settings

Include a small privacy/memory status indicator only if useful; do not turn it into a dashboard metric.

Mobile:
- do NOT merely shrink the desktop sidebar
- use appropriate bottom navigation / drawer patterns
- keep Talk easily accessible
- preserve hierarchy and thumb reachability

Create route/layout structure so feature pages plug into the shell cleanly.

Use user-specific profile data from Supabase; never hard-code "Aarav" or any demo person's name.

The visual design should be premium, cinematic, editorial, and calm.

Avoid:
- oversized admin dashboards
- equal-weight tiles everywhere
- excessive badges
- generic SaaS gradients
- emoji as primary navigation icons.

Build reusable:
AppShell
Sidebar
Topbar
MobileNav
PageContainer
SectionHeader
UserMenu
Breadcrumb/back primitives where required.

Do not implement deep feature logic yet.
```

## Stage 1E — Personalized Home

**Reference image:** `visual-references/01E_Home.png`

**Goal:** Create the true home experience with a cinematic hero, conversation entry, story continuity, contextual experiences, and journey preview.

```text
Build Stage 1E: the authenticated EchoSoul Home page.

This is the first screen inside the real product after login/onboarding.

Use the supplied Stage 1E reference image as design direction.

HOME HIERARCHY:
1. Personalized greeting using the actual user profile
2. Dynamic emotional/contextual headline
3. Large cinematic hero area
4. Dominant "Talk to EchoSoul" CTA
5. Secondary "Just listen" and "Write instead"
6. Continue Your Story
7. For This Moment
8. Because You Mentioned...
9. Your Journey preview

Important:
- do not use "Aarav", "Pratik", or any fixed demo name
- use profile display name with a safe fallback
- mock data must be clearly isolated if live data is not ready
- home should feel personalized but never imply invented memories
- recommendations must be labeled mock/demo until real engines are connected

For This Moment can visually preview:
Find your words
Play music
Show a page
Create a scene
Take a small step

These are navigation/trigger surfaces only at this stage.

Home must have strong visual hierarchy:
hero > primary action > meaningful story > experiences > journey.

Do not make every section a small equal-sized card grid.

Implement responsive versions intentionally for desktop and mobile.
```

## Stage 1F — Talk + Post-Listening

**Reference image:** `visual-references/01F_Talk_PostListening.png`

**Goal:** Create the immersive listening experience and the critical transition from conversation into contextual actions.

```text
Build Stage 1F: Talk + Post-Listening.

Use the supplied reference.

PART A — LISTENING:
Create an immersive conversation mode:
- minimal UI
- centered listening presence
- microphone/voice affordance
- waveform/audio visualization placeholder
- pause/end controls
- text mode fallback
- clear status: listening / processing / ready
- accessible keyboard and screen-reader states
- no distracting sidebar in immersive mode

PART B — POST-LISTENING:
After a session ends, create:
"I heard you."

Then display:
- contextual emotional themes as non-diagnostic labels
- a short thoughtful reflection placeholder
- clear "save moment" control
- choices for what to do next:

Find my words
Play music
Show me a page
Make a scene
Help me with a plan
Just stay with me

These should feel like premium experiences, not generic dashboard cards.

The screen must support a future real AI orchestration result without redesigning the UI.

Important:
Do not implement emotional diagnosis.
Do not fabricate memories.
Do not claim the AI knows more than it was told.

Use mock adapter data only for this stage.
```

## Stage 1G — Words / Music / Scenes

**Reference image:** `visual-references/01G_Words_Music_Scenes.png`

**Goal:** Build the three creative destinations with their own product-specific interfaces.

```text
Build Stage 1G: Words, Music, and Scenes.

Use the supplied visual reference.

A) WORDS
Build a literary discovery interface:
- tabs such as Discover / My Library / Saved / Handwriting
- large literary work presentation
- original-language text support
- author/work/source metadata
- save/read/source actions
- clear distinction between authentic source text and UI explanation
- prepare the UI for future handwriting animation
- do not generate fake poetry
- mock literature data must clearly indicate it is demo content

B) MUSIC
Build a premium music experience:
- large artwork
- contextual "Music for your moment" heading
- player controls
- progress
- current track
- recommendations
- mood/context chips
- user preference integration ready
- no fake streaming claims

C) SCENES
Build a visual storytelling experience:
- cinematic large media area
- explore/create tabs
- scene metadata
- emotion/context
- create experience CTA
- future video/image job status support

Each destination needs its own visual hierarchy, not the same generic card grid.

Use consistent EchoSoul design language but let Words feel literary, Music feel immersive, and Scenes feel cinematic.

Do not implement real provider generation in this stage.
```

## Stage 1H — Moments / Journey / Settings

**Reference image:** `visual-references/01H_Moments_Journey_Settings.png`

**Goal:** Build the user's long-term story, growth view, and complete customization/privacy control center.

```text
Build Stage 1H: Moments, Journey, and Settings.

A) MOMENTS
Make this feel like a personal archive/novel rather than chat history.
Include:
- Timeline
- Chapters
- meaningful moments
- chapter cards with imagery
- saved words/music/scenes references
- contextual dates
- chapter detail view

B) JOURNEY
Do NOT build a clinical mental-health analytics dashboard.
Use narrative progression:
Beginning
Challenges
Clarity
Growth
You are here

Show:
- moments
- milestones
- reflections
- selected user-confirmed observations
- chapter progression

C) SETTINGS
Create a serious settings/control center with:
Personalization
Language
Voice
Conversation style
Literature preferences
Music preferences
Visual style
Memory controls
Privacy & data
Appearance
Accessibility
Subscription/entitlements

Memory controls must include:
- view memories
- edit memory
- delete memory
- disable automatic remembering
- "Do not remember this" session concept

Use real Supabase profile/preferences when available.

No invented memories.
No diagnosis.
No fake growth claims.

The UI should feel like a polished consumer application, not a settings table.

All routes must be responsive and accessible.
```
