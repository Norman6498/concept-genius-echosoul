# EchoSoul Project Identity Report

**Date of Audit**: September 13, 2026  
**Investigator**: Antigravity Principal Architecture & Infrastructure Auditor  
**Investigation Scope**: Local (`d:\Desktop\ECHOSOUL`), GitHub (`Norman6498/concept-genius-echosoul`), Vercel Production Deployments, Supabase Databases  
**Audit Mode**: STRICT AUDIT ONLY — Zero code, dependency, database, or deployment modifications performed.

---

## 1. Local Project

- **Path**: `d:\Desktop\ECHOSOUL`
- **Project**: EchoSoul (Concept Genius)
- **Package.json Name**: `echosoul`
- **Next.js Version**: `16.3.5` (App Router + Turbopack)
- **React Version**: `19.3.0`
- **Node Version**: `v24.20.0`
- **npm Version**: `11.19.0`
- **Branch**: `main`
- **Commit**: `f1ec5dc33ec441621f4864ddd9e6f864e0cc59ad`
- **Commit Message**: `docs: add ECHOSOUL_VERCEL_DEPLOYMENT_REPORT.md`
- **Working Tree Status**: Clean (0 staged files, 1 auto-generated file `next-env.d.ts`, 1 untracked audit doc `audit/ECHOSOUL_FULL_STACK_MODERNIZATION_REPORT.md`)
- **UI State**: NEW UI ACTIVE (Playfair Display hero, living background, 12-world adaptive home engine, 6-step onboarding, dark theme tokens)

---

## 2. Git

- **GitHub Owner**: `Norman6498`
- **Repository**: `concept-genius-echosoul`
- **Remote**: `origin` -> `https://github.com/Norman6498/concept-genius-echosoul.git`
- **Default Branch**: `main`
- **Current Branch**: `main`
- **Local Commit**: `f1ec5dc33ec441621f4864ddd9e6f864e0cc59ad`
- **Remote Commit**: `f1ec5dc33ec441621f4864ddd9e6f864e0cc59ad`
- **Synchronization Status**: **UP TO DATE (1:1 EXACT MATCH)**. Every local commit, including all new UI, onboarding, and backend hardening commits, exists on `origin/main`.

---

## 3. Vercel

Through deep browser history and HTTP header forensic inspection, **two distinct Vercel project entities** were identified:

### Project A: `concept-genius-echosoul` (The Intended Current Project)
- **Project Name**: `concept-genius-echosoul`
- **Team / Account Slug**: `echosoul1`
- **Connected Repository**: `https://github.com/Norman6498/concept-genius-echosoul`
- **Production Branch**: `main`
- **Root Directory**: `/` (Repository root)
- **Framework**: Next.js 16
- **Deployment URL**: `https://concept-genius-echosoul-re2nv1z0x-echosoul1.vercel.app`
- **Canonical Production URL**: `https://concept-genius-echosoul.vercel.app`
- **Status**: **PROJECT DELETED ON VERCEL**
  - Forensic evidence shows the project was imported on 2026-09-12 13:47 UTC, but was **deleted** from the Vercel dashboard at **2026-09-12 13:58:44 UTC** (`https://vercel.com/echosoul1?projectDeleted=concept-genius-echosoul`).
  - Current HTTP probe to `https://concept-genius-echosoul.vercel.app`: `HTTP 404 DEPLOYMENT_NOT_FOUND`
  - Current HTTP probe to deployment `concept-genius-echosoul-re2nv1z0x-echosoul1.vercel.app`: `HTTP 410 GONE`

### Project B: `echosoul-frontend` (The Stale / Old URL Showing the Old UI)
- **Project Name**: `echosoul-frontend`
- **Production URL**: `https://echosoul-frontend.vercel.app`
- **Status**: **STALE LEGACY DEPLOYMENT (98.5 DAYS OLD)**
  - HTTP probe reveals `Age: 8511083` (~98.5 days old, deployed ~June 2026).
  - Deployed source inspection reveals an obsolete prototype codebase (`ai-web` with `Nest API`, `/communities`, `Circles`, `Diagnostics`, and `#6d65b8` theme).
  - It is completely unrelated to the current `concept-genius-echosoul` repository.

---

## 4. Supabase

- **Project Name**: `bblkonxcqymwkngpmvjc`
- **Project Ref**: `bblkonxcqymwkngpmvjc`
- **Region**: AWS `ap-southeast-1` (Singapore)
- **URL**: `https://bblkonxcqymwkngpmvjc.supabase.co`
- **Database Status**: 40 active tables, RLS active, 1,106 books, 1,004 music tracks, 2,000 cities
- **Historical Supabase Project**: An earlier project `awouevjggdfjeyuzkypy` was used during early September 2026 staging, but superseded by `bblkonxcqymwkngpmvjc`.

---

## 5. Identity Comparison

| System | Branch | Commit | Repository / Project | Status |
|---|---|---|---|---|
| **Local** | `main` | `f1ec5dc` | `D:\Desktop\ECHOSOUL` | Up to date, contains NEW UI |
| **GitHub** | `main` | `f1ec5dc` | `Norman6498/concept-genius-echosoul` | Up to date, contains NEW UI |
| **Vercel (`concept-genius-echosoul`)** | `main` | `dpl_CEnd...` | `Norman6498/concept-genius-echosoul` | **DELETED** from dashboard (`404 / 410`) |
| **Vercel (`echosoul-frontend`)** | Unknown | Unknown | Stale legacy prototype (`ai-web`) | **STALE** (98 days old, serves OLD UI) |

---

## 6. New UI Commit

- **Primary Intro Commits**:
  - `a94ddce` (2026-09-09): `feat(page-01): implement approved locked landing page with Playfair Display, living environment, and 5-pillar value strip`
  - `d4559b8` (2026-09-11): `feat(onboarding): complete 6-step onboarding, high-res assets, Supabase OTP auth, and 12-world adaptive home engine`
  - `cab4e2e` (2026-09-11): `feat(home): match final homepage 1:1 with media_1789114009341, dynamic user data, and zero hydration errors`
- **Cleanup Commit (Old UI Purged)**:
  - `9b84b05` (2026-09-09): `chore: clear old UI components and pages for rewrite` (completely purged old landing components: `Navbar`, `Hero`, `ValuePillars`, `HowItWorks`, `ExperiencePreview`, `SafetyTrust`, `PricingPreview`, `Footer`, `Sidebar`, `BottomNav`)
- **Key UI Files**:
  - `src/app/page.tsx`
  - `src/components/home/AuthenticatedHome.tsx`
  - `src/app/onboarding/**`
  - `src/app/app/**`
- **Present Locally**: **YES**
- **Present on GitHub**: **YES**
- **Present on Vercel**: **NO** (Active Vercel URL was either viewing deleted project or stale legacy URL)

---

## 7. Environment Comparison

- **Local Supabase**: `https://bblkonxcqymwkngpmvjc.supabase.co`
- **Vercel Supabase**: Expected `https://bblkonxcqymwkngpmvjc.supabase.co` (configured in Vercel integration for `echosoul1`), but `echosoul-frontend.vercel.app` references legacy origins.
- **Local App URL**: `http://localhost:3000`
- **Vercel App URL**: `https://concept-genius-echosoul.vercel.app` (currently 404 due to project deletion).

---

## 8. Root Cause

### Primary Root Cause: **WRONG VERCEL PROJECT & MULTIPLE PROJECTS**
The user is viewing `https://echosoul-frontend.vercel.app`, which is an entirely different, obsolete Vercel project from a legacy repository (`ai-web` / Nest API prototype).

### Contributing Factor 1: **STALE DEPLOYMENT**
The `echosoul-frontend.vercel.app` domain is serving a 98.5-day-old static build artifact (`Age: 8511083` seconds).

### Contributing Factor 2: **PROJECT DELETED ON VERCEL**
The actual, intended Vercel project `concept-genius-echosoul` (connected to `https://github.com/Norman6498/concept-genius-echosoul`) was created on September 12 at 13:47 UTC, but was deleted at 13:58:44 UTC (`projectDeleted=concept-genius-echosoul`). Consequently, visiting `https://concept-genius-echosoul.vercel.app` returns `HTTP 404 DEPLOYMENT_NOT_FOUND`, leading to the old `echosoul-frontend.vercel.app` being mistaken for the active production deployment.

---

## 9. Evidence

1. **Git Remote & Head Alignment Evidence**:
   ```bash
   $ git ls-remote origin
   f1ec5dc33ec441621f4864ddd9e6f864e0cc59ad  HEAD
   f1ec5dc33ec441621f4864ddd9e6f864e0cc59ad  refs/heads/main
   ```
   *Result*: Local and GitHub are in 100% synchronization at commit `f1ec5dc`. The new UI is fully committed and pushed to GitHub.

2. **Vercel Dashboard Forensic Evidence (Edge Browser History)**:
   ```text
   [2026-09-12 13:47:16 UTC] New Project – Vercel:
   https://vercel.com/new/echosoul1/success?branch=main&deploymentUrl=concept-genius-echosoul-re2nv1z0x-echosoul1.vercel.app&projectName=concept-genius-echosoul&s=https%3A%2F%2Fgithub.com%2FNorman6498%2Fconcept-genius-echosoul&teamSlug=echosoul1

   [2026-09-12 13:58:44 UTC] Vercel Dashboard Action:
   https://vercel.com/echosoul1?projectDeleted=concept-genius-echosoul

   [2026-09-12 14:11:07 UTC] User Bing search result click:
   https://echosoul-frontend.vercel.app/
   ```

3. **Live HTTP Header & Error Evidence**:
   ```bash
   $ curl.exe -ILs https://concept-genius-echosoul.vercel.app
   HTTP/1.1 404 Not Found
   X-Vercel-Error: DEPLOYMENT_NOT_FOUND

   $ curl.exe -ILs https://concept-genius-echosoul-re2nv1z0x-echosoul1.vercel.app
   HTTP/1.1 410 Gone
   X-Vercel-Error: GONE

   $ curl.exe -ILs https://echosoul-frontend.vercel.app/
   HTTP/1.1 200 OK
   Age: 8511083
   X-Vercel-Cache: HIT
   ```

4. **HTML Content & Structural Marker Evidence**:
   - `https://echosoul-frontend.vercel.app/` contains text: `"This is a missing page route in ai-web... set AI_DEV_API_ORIGIN to your running ai/ server... Circles... Diagnostics"`.
   - Structural marker `"Enter a realm where you can finally be you."`:
     - Local `src/app/page.tsx`: **PRESENT**
     - GitHub `origin/main`: **PRESENT**
     - `echosoul-frontend.vercel.app`: **ABSENT**

---

## 10. Recommended Fix

### The MINIMUM Safe Fix (Do NOT execute until approved):
1. **Log into Vercel** (`https://vercel.com/echosoul1`).
2. Click **"Add New..."** ➔ **"Project"**.
3. Select GitHub repository: `Norman6498/concept-genius-echosoul`.
4. Configure Project Settings:
   - **Project Name**: `concept-genius-echosoul` (or `echosoul`)
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add Environment Variables (from local `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://bblkonxcqymwkngpmvjc.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `[anon key]`
   - `SUPABASE_SERVICE_ROLE_KEY`: `[service role key]`
   - `OPENROUTER_API_KEY`: `[openrouter api key]`
   - `NEXT_PUBLIC_APP_URL`: `https://concept-genius-echosoul.vercel.app`
6. Click **Deploy**.
7. Access `https://concept-genius-echosoul.vercel.app` directly. The new UI will display immediately.
