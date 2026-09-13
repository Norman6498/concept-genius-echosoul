# ECHOSOUL / SOLENNE — GUEST EXPLORER ARCHITECTURE & FIX AUDIT REPORT

**Document ID:** SOLENNE-GUEST-FIX-2026-09-13  
**Project:** EchoSoul (Solenne)  
**Company:** Concept Genius  
**Target Feature:** "Continue directly as Guest Explorer →" Flow Repair  
**Status:** FULLY REPAIRED, TESTED & VERIFIED (GO)  

---

## 1. Root Cause

On `/login` and `/signup`, the button `"Continue directly as Guest Explorer →"` was implemented in [`src/components/auth/AuthRealm.tsx`](file:///d:/Desktop/ECHOSOUL/src/components/auth/AuthRealm.tsx#L674) as a static Next.js link pointing to `/onboarding`:

```tsx
<Link href="/onboarding" className="...">
  Continue directly as Guest Explorer →
</Link>
```

When clicked by an unauthenticated visitor:
1. The browser navigated to `/onboarding`.
2. `/onboarding` was protected by [`OnboardingRouteGuard`](file:///d:/Desktop/ECHOSOUL/src/lib/auth/guard.tsx#L73-L90):
   ```tsx
   if (authStatus === "UNAUTHENTICATED" && !isGuest) {
     router.replace("/login");
     return;
   }
   ```
3. Because no guest session was initiated and `isGuest` remained `false`, `OnboardingRouteGuard` instantly bounced the visitor back to `/login`.
4. To the user, clicking the button appeared completely broken and non-functional.

---

## 2. Existing Guest Architecture Prior to Fix

- `src/lib/auth/context.tsx` defined a synchronous stub `signInAsGuest()` that merely set local React state (`isGuest = true`, `authStatus = "GUEST"`).
- It was never called by `AuthRealm.tsx`.
- Because it was not backed by a real Supabase session or persistent storage token, any page refresh or hard reload would re-execute `supabase.auth.getUser()`, return `null`, and revert `authStatus` to `"UNAUTHENTICATED"`.
- `sessionBoundary.ts` already defined client storage partitioning logic for guests (`echosoul_guest_*`), but there was no persistent identity or database session to anchor it.

---

## 3. Chosen Guest Architecture

We implemented an authenticated, server-backed, isolated guest architecture:

```text
User clicks "Continue directly as Guest Explorer →"
                         ↓
                Button disables & shows
              "Entering Explorer Mode…"
                         ↓
        Client calls authContext.signInAsGuest()
                         ↓
  POST /api/auth/guest-session (Server-side service role)
  - Creates unique user: guest_<uuid>@guest.solenne.internal
  - Sets email_confirm = true (zero emails dispatched, immune to rate limits)
  - Sets user_metadata: { is_guest: true, display_name: "Guest Explorer" }
  - Upserts profiles row: onboarding_completed = true, role = "Guest Explorer"
  - Upserts entitlements row: plan = "free", trial credits = 3
                         ↓
 Client signs in via supabase.auth.signInWithPassword(credentials)
                         ↓
    Supabase sets real session cookie & emits SIGNED_IN
                         ↓
   Auth Context FSM enters "GUEST" state (isGuest = true)
                         ↓
       User storage scoped to echosoul_usr_<guestUuid>_*
                         ↓
              Router replaces to /app (Guest Home)
   - Welcome to Solenne. Take a moment. Explore your space.
   - Demo-safe recommendations & public catalog access
   - Account conversion banner ("Create Account → /signup")
```

---

## 4. Supabase Configuration Findings

- Programmatic verification via `supabase.auth.signInAnonymously()` confirmed:
  ```json
  {
    "name": "AuthApiError",
    "message": "Anonymous sign-ins are disabled",
    "status": 422,
    "code": "anonymous_provider_disabled"
  }
  ```
- **Supabase Dashboard Requirement (Optional Optimization)**: If Concept Genius wishes to enable native Supabase anonymous logins in the future, navigate to **Supabase Dashboard -> Authentication -> Providers -> Anonymous Sign-Ins** and toggle it **ON**.
- **Our Implementation Resilience**: Our architecture checks native `signInAnonymously()` first, but gracefully falls back to `/api/auth/guest-session`. Thus, it works seamlessly today **without requiring manual Supabase dashboard configuration**.

---

## 5. Files Changed

1. **[`src/app/api/auth/guest-session/route.ts`](file:///d:/Desktop/ECHOSOUL/src/app/api/auth/guest-session/route.ts)** [NEW]:
   - Server-side service-role endpoint provisioning unique, pre-confirmed guest identities.
2. **[`src/lib/auth/context.tsx`](file:///d:/Desktop/ECHOSOUL/src/lib/auth/context.tsx)** [MODIFIED]:
   - Made `signInAsGuest` an async method returning `Promise<{ success: boolean; error?: string }>`.
   - Added module-level `isUserGuestIdentity()` helper detecting `user.user_metadata?.is_guest === true`, anonymous flags, and guest domains.
   - Enhanced initial session restoration and `onAuthStateChange` to persist `GUEST` state across page reloads.
3. **[`src/lib/auth/guard.tsx`](file:///d:/Desktop/ECHOSOUL/src/lib/auth/guard.tsx)** [MODIFIED]:
   - Updated `AppRouteGuard` to permit `authStatus === "GUEST"` and `isGuest === true` without redirecting.
   - Updated `OnboardingRouteGuard` so guests visiting `/onboarding` are gracefully routed to `/app`.
4. **[`src/components/auth/AuthRealm.tsx`](file:///d:/Desktop/ECHOSOUL/src/components/auth/AuthRealm.tsx)** [MODIFIED]:
   - Replaced static `<Link>` with interactive button.
   - Added `isGuestLoading` state, double-click protection, loading spinner with `"Entering Explorer Mode…"`, and error banner.
5. **[`src/components/home/AuthenticatedHome.tsx`](file:///d:/Desktop/ECHOSOUL/src/components/home/AuthenticatedHome.tsx)** [MODIFIED]:
   - Added `isGuest` detection.
   - Replaced greeting for guests with: *"Welcome to Solenne. Take a moment. Explore your space."*
   - Added Guest Explorer Mode banner with *"Create Account →"* conversion link to `/signup`.
6. **[`scripts/test-guest-explorer.ts`](file:///d:/Desktop/ECHOSOUL/scripts/test-guest-explorer.ts)** [NEW]:
   - 22-step automated verification suite.
7. **[`scripts/test-browser-guest.mjs`](file:///d:/Desktop/ECHOSOUL/scripts/test-browser-guest.mjs)** [NEW]:
   - Real Playwright browser test validating complete user journey.
8. **[`package.json`](file:///d:/Desktop/ECHOSOUL/package.json)** [MODIFIED]:
   - Added `"test:guest": "npx tsx scripts/test-guest-explorer.ts"`.

---

## 6. Auth State Changes & FSM Integration

| State | Transition | Condition | Destination |
| :--- | :--- | :--- | :--- |
| `UNAUTHENTICATED` | User clicks Guest button | `handleGuestExplorer()` | Enters `AUTH_LOADING` |
| `AUTH_LOADING` | Credentials returned & signed in | `session.user` with `is_guest: true` | Enters `GUEST` |
| `GUEST` | `isGuest = true`, `onboardingCompleted = true` | Route guards evaluated | Allowed into `/app` |
| `GUEST` | User refreshes page (F5) | `supabase.auth.getUser()` restores session | Stays `GUEST` on `/app` |
| `GUEST` | User clicks Sign Out | `performSecureLogout()` | Clears storage, enters `UNAUTHENTICATED`, routes to `/login` |

---

## 7. RLS & Multi-Tenant Isolation Impact

- **Zero Weakened RLS**: Because every guest receives a distinct, real UUID in PostgreSQL `auth.users`, all Supabase Row Level Security policies `auth.uid() = user_id` operate natively.
- **Cross-Guest Isolation**:
  - Guest A receives UUID `usr_A`. Storage key: `echosoul_usr_<uuidA>_*`.
  - Guest B receives UUID `usr_B`. Storage key: `echosoul_usr_<uuidB>_*`.
  - Storage keys and database rows never collide.
- **Regular User Isolation**: Regular authenticated users cannot access guest rows, and guests cannot access regular users' private sessions, moments, or messages.

---

## 8. Guest Limitations & Gating

- **Guest Can Access**:
  - Home realm (`/app`)
  - Music catalog, player & frequencies (`/app/music`)
  - Words & literature catalog (`/app/words`)
  - Visual worlds & ambient landscapes (`/app/visuals`)
  - Talk sanctuary with limited conversation (`/app/talk`)
  - Thought guidance (`/app/guidance`)
  - Public pages (`/about`, `/pricing`, `/stories`, `/features`)
- **Guest Cannot Access**:
  - Another user's private reflections, moments, or conversation history
  - Admin console (`/admin/music-meaning` returns `403 Forbidden` via `isUserAdmin()`)
  - Bypass trial limits (receives 3 free music meaning trials; exhausts normally)

---

## 9. Conversion Path (Guest → Account)

- The guest Home features an intentional conversion banner:
  > *"Guest Explorer Mode: Take your time exploring books, music, and quiet reflection. Create an account anytime to save your sanctuary."*
- Clicking `"Create Account →"` routes to `/signup`.
- Upon sign up, `performSecureLogout()` cleanly clears the guest session and establishes the permanent account.

---

## 10. Automated Test Results

| Test Suite | Command | Result |
| :--- | :--- | :--- |
| **Guest Explorer Suite** | `npm run test:guest` | **22 / 22 PASSED** |
| **Auth Onboarding Lifecycle** | `node scripts/test-auth-onboarding-lifecycle.mjs` | **37 / 37 PASSED** |
| **Multi-User Isolation Attack** | `node scripts/test-multi-user-attack.mjs` | **23 / 23 PASSED** |
| **Row Level Security (RLS)** | `node scripts/test-rls-isolation.mjs` | **7 / 7 PASSED** |
| **Music Meaning Freemium Trials** | `npm run test:trial` | **18 / 18 PASSED** |
| **TypeScript Typecheck** | `npm run typecheck` | **0 ERRORS** |
| **Production Build** | `npm run build` | **CODE 0 (46/46 routes compiled)** |

---

## 11. Real Browser Validation (Playwright)

Executed via `node scripts/test-browser-guest.mjs`:
- ✅ Navigated to `/login`.
- ✅ Clicked `"Continue directly as Guest Explorer →"`.
- ✅ Observed button transition to `"Entering Explorer Mode…"`.
- ✅ Navigated to `http://localhost:3006/app`.
- ✅ Verified headline: *"Welcome to Solenne."*.
- ✅ Verified subtitle: *"Take a moment. Explore your space."*.
- ✅ Verified *"Guest Explorer Mode"* banner and *"Create Account →"* button.
- ✅ Reloaded page (hard refresh / F5) and confirmed guest session remained intact on `/app`.
- ✅ Verified screenshot captured at [`public/debug/guest_explorer_verified.png`](file:///d:/Desktop/ECHOSOUL/public/debug/guest_explorer_verified.png).
- ✅ Tested logout from profile and confirmed clean return to `/login`.
- ✅ Tested second guest entry and confirmed clean entry into `/app` with new session.
