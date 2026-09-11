"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";

const ONBOARDING_STEPS = [
  { number: 1, label: "About You",   href: "/onboarding" },
  { number: 2, label: "Interests",   href: "/onboarding/interests" },
  { number: 3, label: "Your World",  href: "/onboarding/world" },
  { number: 4, label: "Preferences", href: "/onboarding/preferences" },
  { number: 5, label: "Appearance",  href: "/onboarding/appearance" },
  { number: 6, label: "Complete",    href: "/onboarding/complete" },
];

const WHERE_YOU_LIVE = [
  { id: "city", label: "City", image: "/locations/city.jpg" },
  { id: "town", label: "Town", image: "/locations/town.jpg" },
  { id: "rural", label: "Rural Area", image: "/locations/rural.jpg" },
  { id: "unspecified", label: "Prefer not to say", icon: "globe" },
];

const FOCUS_OPTIONS = [
  { id: "studies", label: "Studies", icon: "book" },
  { id: "career", label: "Career / Work", icon: "laptop" },
  { id: "growth", label: "Personal Growth", icon: "feather" },
  { id: "creative", label: "Creative Projects", icon: "palette" },
  { id: "wellness", label: "Health & Wellness", icon: "dumbbell" },
  { id: "exploring", label: "Exploring Life", icon: "compass" },
  { id: "other", label: "Other", icon: "dots" },
];

const ENVIRONMENTS = [
  { id: "supportive", label: "Supportive", icon: "leaf" },
  { id: "neutral", label: "Neutral", icon: "stones" },
  { id: "challenging", label: "Challenging", icon: "cloud" },
  { id: "unspecified", label: "Prefer not to say", icon: "eye-off" },
];

const PEOPLE_AROUND = [
  { id: "family", label: "Family", icon: "home" },
  { id: "friends", label: "Friends", icon: "users" },
  { id: "both", label: "Both", icon: "both" },
  { id: "mostly_alone", label: "Mostly alone", icon: "user" },
  { id: "unspecified", label: "Prefer not to say", icon: "eye-off" },
];

const VISUAL_WORLDS = [
  { id: "mountain_calm", label: "Mountain Calm", image: "/visual-worlds/mountain_calm.jpg" },
  { id: "forest_retreat", label: "Forest Retreat", image: "/visual-worlds/forest_retreat.jpg" },
  { id: "ocean_breeze", label: "Ocean Breeze", image: "/visual-worlds/ocean_breeze.jpg" },
  { id: "city_lights", label: "City Lights", image: "/visual-worlds/city_lights.jpg" },
  { id: "starry_skies", label: "Starry Skies", image: "/visual-worlds/starry_skies.jpg" },
  { id: "cozy_room", label: "Cozy Room", image: "/visual-worlds/cozy_room.jpg" },
  { id: "fantasy_realm", label: "Fantasy Realm", image: "/visual-worlds/fantasy_realm.jpg" },
  { id: "minimal_space", label: "Minimal Space", image: "/visual-worlds/minimal_space.jpg" },
  { id: "anime_aesthetic", label: "Anime Aesthetic", image: "/visual-worlds/anime_aesthetic.jpg" },
  { id: "nature_wildlife", label: "Nature & Wildlife", image: "/visual-worlds/nature_wildlife.jpg" },
  { id: "space_cosmos", label: "Space & Cosmos", image: "/visual-worlds/space_cosmos.jpg" },
  { id: "classic_vintage", label: "Classic & Vintage", image: "/visual-worlds/classic_vintage.jpg" },
];

const DAILY_SCHEDULES = [
  { id: "early_riser", label: "Early Riser", icon: "sun-rise" },
  { id: "balanced", label: "Balanced", icon: "sun" },
  { id: "night_owl", label: "Night Owl", icon: "moon" },
  { id: "varies", label: "Varies", icon: "waves" },
];

export function OnboardingStep3() {
  const [whereYouLive, setWhereYouLive] = useState("city");
  const [currentFocus, setCurrentFocus] = useState("studies");
  const [customFocus, setCustomFocus] = useState("");
  const [environmentTone, setEnvironmentTone] = useState("supportive");
  const [peopleAround, setPeopleAround] = useState("family");
  const [worldNotes, setWorldNotes] = useState("");
  const [visualWorld, setVisualWorld] = useState("mountain_calm");
  const [dailySchedule, setDailySchedule] = useState("balanced");

  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Restore saved state
  useEffect(() => {
    try {
      const saved = localStorage.getItem("echosoul_user_world");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.whereYouLive) setWhereYouLive(p.whereYouLive);
        if (p.currentFocus) setCurrentFocus(p.currentFocus);
        if (p.customFocus) setCustomFocus(p.customFocus);
        if (p.environmentTone) setEnvironmentTone(p.environmentTone);
        if (p.peopleAround) setPeopleAround(p.peopleAround);
        if (p.worldNotes) setWorldNotes(p.worldNotes);
        if (p.visualWorld) setVisualWorld(p.visualWorld);
        if (p.dailySchedule) setDailySchedule(p.dailySchedule);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedbackMessage(null);

    const payload = {
      whereYouLive,
      currentFocus,
      customFocus: currentFocus === "other" ? customFocus.trim() : undefined,
      environmentTone,
      peopleAround,
      worldNotes,
      visualWorld,
      dailySchedule,
      step: 3,
    };

    // Save locally
    try {
      localStorage.setItem("echosoul_user_world", JSON.stringify(payload));
    } catch {
      // Ignore
    }

    // Persist to Supabase
    try {
      await fetch("/api/personalization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Ignore
    }

    setIsSaving(false);
    setTimeout(() => {
      window.location.href = "/onboarding/preferences";
    }, 400);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0B0F14] text-[#FFF8E1] flex flex-col justify-between overflow-x-hidden select-none">
      {/* ── Top Header & Stepper Bar ─────────────────────────────── */}
      <header className="relative z-30 w-full max-w-[1536px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        <BrandLogo size="md" />

        {/* 6-step progress stepper */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {ONBOARDING_STEPS.map((step, idx) => {
            const isActive = step.number === 3;
            const isCompleted = step.number < 3;
            const isLast = idx === ONBOARDING_STEPS.length - 1;

            return (
              <React.Fragment key={step.number}>
                <Link
                  href={step.href}
                  className="flex items-center gap-2 group focus:outline-none"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-ui text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#F2D78A] text-[#0B0F14] shadow-[0_0_12px_rgba(242,215,138,0.5)] ring-2 ring-[#F2D78A]/40"
                        : isCompleted
                        ? "bg-[#F2D78A]/20 border border-[#F2D78A]/60 text-[#F2D78A]"
                        : "border border-white/20 text-[#9AA8B0]"
                    }`}
                  >
                    {isCompleted ? "✓" : step.number}
                  </div>
                  <span
                    className={`font-ui text-xs tracking-wide transition-colors ${
                      isActive
                        ? "text-[#F2D78A] font-semibold underline underline-offset-4 decoration-[#F2D78A]"
                        : isCompleted
                        ? "text-[#CFC5B5]"
                        : "text-[#9AA8B0]"
                    }`}
                  >
                    {step.label}
                  </span>
                </Link>

                {!isLast && (
                  <div
                    className={`w-4 lg:w-8 h-[1px] transition-colors ${
                      isCompleted ? "bg-[#F2D78A]/50" : "bg-white/10"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Skip action */}
        <Link
          href="/onboarding/preferences"
          className="font-ui text-xs sm:text-sm text-[#CFC5B5] hover:text-[#F2D78A] transition-colors flex items-center gap-1"
        >
          <span>Skip for now</span>
          <span>→</span>
        </Link>
      </header>

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-[1536px] mx-auto px-4 sm:px-8 py-4 sm:py-6 flex-1 flex flex-col justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

          {/* ── LEFT COLUMN: Illustrated Panel ───────────────────────────── */}
          <div className="lg:col-span-3 hidden lg:flex flex-col justify-between rounded-[24px] overflow-hidden border border-[#F2D78A]/25 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative min-h-[640px] bg-[#0C1B25]">
            <Image
              src="/page3_left_panel.jpg"
              alt="Cozy window overlooking scenic mountains"
              fill
              unoptimized
              sizes="380px"
              className="object-cover object-center pointer-events-none"
              priority
            />
            <div className="sr-only">
              <h3>Your world shapes your story.</h3>
              <p>Where you are. What you see. How you live. It all helps EchoSoul understand you better.</p>
              <blockquote>&ldquo;The world you live in influences the stories you carry within.&rdquo;</blockquote>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Form Controls & Visual Worlds ─────────────── */}
          <div className="lg:col-span-9 flex flex-col justify-between rounded-[24px] p-6 sm:p-8 bg-[#0C1B25]/95 backdrop-blur-2xl border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.9)]">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Title Section */}
              <div>
                <h1 className="font-display text-2xl sm:text-3xl lg:text-[32px] text-[#FFF8E1] font-normal tracking-tight">
                  3. Your world
                </h1>
                <p className="font-ui text-xs sm:text-sm text-[#9AA8B0] mt-1">
                  Tell us a bit about your world so EchoSoul can understand your context and give more meaningful support.
                </p>
              </div>

              {/* 2-Column Grid: Context Details (Left) & Visual Worlds (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* SUB-COLUMN 1: World Context (7 Cols) */}
                <div className="lg:col-span-7 space-y-5">

                  {/* 1. Where do you live? */}
                  <div>
                    <label className="block font-ui text-xs text-[#CFC5B5] mb-2 font-medium">
                      Where do you live?
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {WHERE_YOU_LIVE.map((loc) => {
                        const isSelected = whereYouLive === loc.id;
                        return (
                          <button
                            key={loc.id}
                            type="button"
                            onClick={() => setWhereYouLive(loc.id)}
                            className={`relative rounded-xl overflow-hidden border p-1.5 transition-all text-center flex flex-col items-center justify-between ${
                              isSelected
                                ? "border-[#F2D78A] ring-1 ring-[#F2D78A] bg-[#F2D78A]/10 shadow-[0_0_12px_rgba(242,215,138,0.3)]"
                                : "border-white/10 hover:border-white/30 bg-[#08131B]/60"
                            }`}
                          >
                            {loc.image ? (
                              <div className="relative w-full h-10 rounded-lg overflow-hidden mb-1 bg-[#08131B]">
                                <Image
                                  src={loc.image}
                                  alt={loc.label}
                                  fill
                                  unoptimized
                                  sizes="100px"
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-full h-10 rounded-lg flex items-center justify-center text-[#F2D78A] mb-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                                  <path strokeWidth="1.5" d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 0 0 18M12 3a14 14 0 0 1 0 18" />
                                </svg>
                              </div>
                            )}
                            <span className={`font-ui text-[10px] leading-tight ${isSelected ? "text-[#FFF8E1] font-semibold" : "text-[#9AA8B0]"}`}>
                              {loc.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Your current focus */}
                  <div>
                    <label className="block font-ui text-xs text-[#CFC5B5] mb-2 font-medium">
                      Your current focus
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                      {FOCUS_OPTIONS.map((f) => {
                        const isSelected = currentFocus === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setCurrentFocus(f.id)}
                            className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                              isSelected
                                ? "border-[#F2D78A] bg-[#F2D78A]/10 shadow-[0_0_12px_rgba(242,215,138,0.3)] ring-1 ring-[#F2D78A]"
                                : "border-white/10 hover:border-white/30 bg-[#08131B]/50"
                            }`}
                          >
                            <span className={`text-base ${isSelected ? "text-[#F2D78A]" : "text-[#CFC5B5]"}`}>
                              {f.icon === "book" && "📖"}
                              {f.icon === "laptop" && "💻"}
                              {f.icon === "feather" && "🌱"}
                              {f.icon === "palette" && "🎨"}
                              {f.icon === "dumbbell" && "⚡"}
                              {f.icon === "compass" && "🧭"}
                              {f.icon === "dots" && "•••"}
                            </span>
                            <span className={`font-ui text-[9px] leading-tight ${isSelected ? "text-[#FFF8E1] font-semibold" : "text-[#9AA8B0]"}`}>
                              {f.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Interactive "Other" Focus Input */}
                    {currentFocus === "other" && (
                      <div className="mt-2 p-2.5 rounded-xl bg-[#08131B]/90 border border-[#F2D78A]/40 es-fade-up">
                        <label className="block font-ui text-[11px] text-[#F2D78A] mb-1 font-medium">
                          What is your current focus?
                        </label>
                        <input
                          type="text"
                          value={customFocus}
                          onChange={(e) => setCustomFocus(e.target.value)}
                          placeholder="e.g. Preparing for exams, launching a startup..."
                          className="w-full h-8 px-3 text-xs input-field-dark rounded-lg font-ui"
                        />
                      </div>
                    )}
                  </div>

                  {/* 3. Your environment */}
                  <div>
                    <label className="block font-ui text-xs text-[#CFC5B5] mb-2 font-medium">
                      Your environment
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {ENVIRONMENTS.map((env) => {
                        const isSelected = environmentTone === env.id;
                        return (
                          <button
                            key={env.id}
                            type="button"
                            onClick={() => setEnvironmentTone(env.id)}
                            className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                              isSelected
                                ? "border-[#F2D78A] bg-[#F2D78A]/10 shadow-[0_0_12px_rgba(242,215,138,0.3)] ring-1 ring-[#F2D78A]"
                                : "border-white/10 hover:border-white/30 bg-[#08131B]/50"
                            }`}
                          >
                            <span className="text-sm">
                              {env.icon === "leaf" && "🌿"}
                              {env.icon === "stones" && "🧘"}
                              {env.icon === "cloud" && "🌧️"}
                              {env.icon === "eye-off" && "👁️‍🗨️"}
                            </span>
                            <span className={`font-ui text-[10px] leading-tight ${isSelected ? "text-[#FFF8E1] font-semibold" : "text-[#9AA8B0]"}`}>
                              {env.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. People around you */}
                  <div>
                    <label className="block font-ui text-xs text-[#CFC5B5] mb-2 font-medium">
                      People around you
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {PEOPLE_AROUND.map((p) => {
                        const isSelected = peopleAround === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setPeopleAround(p.id)}
                            className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                              isSelected
                                ? "border-[#F2D78A] bg-[#F2D78A]/10 shadow-[0_0_12px_rgba(242,215,138,0.3)] ring-1 ring-[#F2D78A]"
                                : "border-white/10 hover:border-white/30 bg-[#08131B]/50"
                            }`}
                          >
                            <span className="text-sm">
                              {p.icon === "home" && "🏠"}
                              {p.icon === "users" && "👥"}
                              {p.icon === "both" && "✨"}
                              {p.icon === "user" && "👤"}
                              {p.icon === "eye-off" && "👁️‍🗨️"}
                            </span>
                            <span className={`font-ui text-[9px] leading-tight ${isSelected ? "text-[#FFF8E1] font-semibold" : "text-[#9AA8B0]"}`}>
                              {p.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. Notes / Anything else */}
                  <div>
                    <label className="block font-ui text-xs text-[#CFC5B5] mb-1.5 font-medium">
                      Anything else about your world you&apos;d like to share? (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={worldNotes}
                      onChange={(e) => setWorldNotes(e.target.value)}
                      placeholder="Type here..."
                      className="w-full px-3.5 py-2 text-xs input-field-dark rounded-xl font-ui resize-none"
                    />
                  </div>

                  {/* Quote Banner */}
                  <div className="relative p-3.5 rounded-xl bg-gradient-to-r from-[#F2D78A]/10 via-[#F2D78A]/5 to-transparent border border-[#F2D78A]/25 flex items-center justify-center text-center">
                    <p className="font-display italic text-xs sm:text-sm text-[#F2D78A]">
                      &ldquo;Every environment holds a story. Yours matters too.&rdquo;{" "}
                      <span className="font-ui not-italic text-[11px] text-[#CFC5B5]">— EchoSoul</span>
                    </p>
                  </div>
                </div>

                {/* SUB-COLUMN 2: 12 Visual Worlds & Schedule (5 Cols) */}
                <div className="lg:col-span-5 space-y-5">

                  {/* Visual World Selector (12 Cards) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-ui text-xs text-[#CFC5B5] font-medium">
                        Choose a visual world you feel most connected to
                      </label>
                    </div>
                    <p className="font-ui text-[11px] text-[#9AA8B0] mb-2.5">
                      This helps us personalize your experience with themes, visuals and music.
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      {VISUAL_WORLDS.map((vw) => {
                        const isSelected = visualWorld === vw.id;
                        return (
                          <button
                            key={vw.id}
                            type="button"
                            onClick={() => setVisualWorld(vw.id)}
                            className={`relative rounded-xl overflow-hidden border p-1 text-center transition-all group flex flex-col items-center ${
                              isSelected
                                ? "border-[#F2D78A] shadow-[0_0_15px_rgba(242,215,138,0.4)] ring-1 ring-[#F2D78A]"
                                : "border-white/10 hover:border-white/30 bg-[#08131B]/60"
                            }`}
                          >
                            {/* Selected badge */}
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 z-10 w-4 h-4 rounded-full bg-[#F2D78A] text-[#0B0F14] flex items-center justify-center shadow-sm">
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}

                            {/* Image Thumbnail */}
                            <div className="relative w-full h-11 rounded-lg overflow-hidden mb-1 bg-[#08131B]">
                              <Image
                                src={vw.image}
                                alt={vw.label}
                                fill
                                unoptimized
                                sizes="100px"
                                className="object-cover transition-transform group-hover:scale-105 duration-300"
                              />
                            </div>

                            <span className={`font-ui text-[10px] leading-tight px-0.5 text-center ${
                              isSelected ? "text-[#FFF8E1] font-semibold" : "text-[#9AA8B0]"
                            }`}>
                              {vw.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Daily Schedule */}
                  <div>
                    <label className="block font-ui text-xs text-[#CFC5B5] mb-1 font-medium">
                      Your daily schedule (Optional)
                    </label>
                    <p className="font-ui text-[11px] text-[#9AA8B0] mb-2">
                      This helps with better time-based suggestions (e.g., focus, relaxation, etc.).
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {DAILY_SCHEDULES.map((sched) => {
                        const isSelected = dailySchedule === sched.id;
                        return (
                          <button
                            key={sched.id}
                            type="button"
                            onClick={() => setDailySchedule(sched.id)}
                            className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                              isSelected
                                ? "border-[#F2D78A] bg-[#F2D78A]/10 shadow-[0_0_12px_rgba(242,215,138,0.3)] ring-1 ring-[#F2D78A]"
                                : "border-white/10 hover:border-white/30 bg-[#08131B]/50"
                            }`}
                          >
                            <span className="text-base">
                              {sched.icon === "sun-rise" && "🌅"}
                              {sched.icon === "sun" && "☀️"}
                              {sched.icon === "moon" && "🌙"}
                              {sched.icon === "waves" && "〰️"}
                            </span>
                            <span className={`font-ui text-[9px] leading-tight ${isSelected ? "text-[#FFF8E1] font-semibold" : "text-[#9AA8B0]"}`}>
                              {sched.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Navigation */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/onboarding/interests"
                  className="px-6 py-2.5 rounded-full border border-white/20 hover:border-white/40 text-xs font-ui text-[#CFC5B5] hover:text-[#FFF8E1] transition-all"
                >
                  ← Back
                </Link>

                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline font-display italic text-xs text-[#F2D78A]/80">
                    &ldquo;More than an AI. A place for you.&rdquo;
                  </span>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-8 py-2.5 rounded-full btn-gold-primary text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <span>Next → (Step 4: Preferences)</span>
                  </button>
                </div>
              </div>

            </form>
          </div>

        </div>
      </main>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="relative z-20 w-full max-w-[1536px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between border-t border-white/5 font-ui text-[11px] text-[#9AA8B0]">
        <span>© 2026 EchoSoul. All rights reserved.</span>
        <span>A Concept Genius Project</span>
      </footer>
    </div>
  );
}
