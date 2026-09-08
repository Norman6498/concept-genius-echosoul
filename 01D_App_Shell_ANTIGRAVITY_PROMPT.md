# Stage 1D — Authenticated Application Shell

Reference: `visual-references/01D_App_Shell.png`

Goal: Build the real product frame with desktop side navigation, mobile navigation, top controls, content workspace, profile, and responsive behavior.

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
