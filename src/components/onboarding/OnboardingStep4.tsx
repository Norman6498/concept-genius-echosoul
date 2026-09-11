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

const SUPPORT_STYLES = [
  {
    id: "gentle",
    title: "Gentle & Empathetic",
    description: "Warm, reassuring, and comforting presence without judgment.",
    icon: "🕊️",
  },
  {
    id: "balanced",
    title: "Balanced & Thoughtful",
    description: "Reflective, considerate, and emotionally grounding dialogue.",
    icon: "⚖️",
  },
  {
    id: "direct",
    title: "Direct & Clear",
    description: "Honest, concise, and straightforward perspective.",
    icon: "🎯",
  },
  {
    id: "practical",
    title: "Practical & Action-Oriented",
    description: "Solution-focused with structured steps and daily clarity.",
    icon: "🧭",
  },
];

const OVERWHELMED_HELPERS = [
  {
    id: "words",
    title: "Timeless Words & Poetry",
    description: "Archival literature, couplets, and philosophical excerpts.",
    icon: "📜",
  },
  {
    id: "music",
    title: "Ambient Music & Soundscapes",
    description: "432Hz resonance, acoustic guitar, rain, and soft piano.",
    icon: "🎵",
  },
  {
    id: "talk",
    title: "Calming Conversation",
    description: "A patient listener to talk through your thoughts freely.",
    icon: "💬",
  },
  {
    id: "breathing",
    title: "Quiet Space & Breathing",
    description: "Minimal words, soothing breathing pacing, and still room.",
    icon: "✨",
  },
];

const RESPONSE_DEPTHS = [
  { id: "concise", label: "Short & Concise", sub: "Quick thoughts, brief reflections" },
  { id: "thoughtful", label: "Thoughtful & Conversational", sub: "Natural balanced dialogue" },
  { id: "poetic", label: "Deep & Poetic", sub: "Rich, literary, and evocative" },
];

const MEMORY_OPTIONS = [
  {
    id: "remember",
    title: "Remember My Journey",
    sub: "Preserves your reflections, growth moments, and preferences safely.",
    badge: "Recommended",
  },
  {
    id: "session_only",
    title: "Session-Only Privacy",
    sub: "Fresh start on every visit. Zero long-term memory stored.",
    badge: "Ephemeral",
  },
];

export function OnboardingStep4() {
  const [supportStyle, setSupportStyle] = useState("balanced");
  const [overwhelmedHelper, setOverwhelmedHelper] = useState("words");
  const [responseDepth, setResponseDepth] = useState("thoughtful");
  const [memoryPreference, setMemoryPreference] = useState("remember");
  const [customGuidance, setCustomGuidance] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  // Restore saved state
  useEffect(() => {
    try {
      const saved = localStorage.getItem("echosoul_user_preferences");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.supportStyle) setSupportStyle(p.supportStyle);
        if (p.overwhelmedHelper) setOverwhelmedHelper(p.overwhelmedHelper);
        if (p.responseDepth) setResponseDepth(p.responseDepth);
        if (p.memoryPreference) setMemoryPreference(p.memoryPreference);
        if (p.customGuidance) setCustomGuidance(p.customGuidance);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      supportStyle,
      overwhelmedHelper,
      responseDepth,
      memoryPreference,
      customGuidance,
      step: 4,
    };

    // Save locally
    try {
      localStorage.setItem("echosoul_user_preferences", JSON.stringify(payload));
    } catch {
      // Ignore
    }

    // Persist via API
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
      window.location.href = "/onboarding/appearance";
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
            const isActive = step.number === 4;
            const isCompleted = step.number < 4;
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
          href="/onboarding/appearance"
          className="font-ui text-xs sm:text-sm text-[#CFC5B5] hover:text-[#F2D78A] transition-colors flex items-center gap-1"
        >
          <span>Skip for now</span>
          <span>→</span>
        </Link>
      </header>

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-[1536px] mx-auto px-4 sm:px-8 py-4 sm:py-6 flex-1 flex flex-col justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

          {/* ── LEFT COLUMN: Illustrated Sanctuary Panel ─────────────────── */}
          <div className="lg:col-span-4 hidden lg:flex flex-col justify-between rounded-[24px] overflow-hidden border border-[#F2D78A]/25 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative min-h-[640px] bg-[#0C1B25]">
            <Image
              src="/page4_left_panel.jpg"
              alt="Quiet night study desk with books and sleeping cat"
              fill
              unoptimized
              sizes="420px"
              className="object-cover object-center pointer-events-none"
              priority
            />
            <div className="sr-only">
              <h3>Different perspectives. A deeper you.</h3>
              <p>Personalized care means meeting you where you are. Tell us how you prefer to communicate and reflect.</p>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Preferences Form ───────────────────────────── */}
          <div className="lg:col-span-8 flex flex-col justify-between rounded-[24px] p-6 sm:p-8 bg-[#0C1B25]/95 backdrop-blur-2xl border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.9)]">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Title Section */}
              <div>
                <h1 className="font-display text-2xl sm:text-3xl lg:text-[32px] text-[#FFF8E1] font-normal tracking-tight">
                  4. Preferences
                </h1>
                <p className="font-ui text-xs sm:text-sm text-[#9AA8B0] mt-1">
                  Customize how EchoSoul responds, guides, and holds space for you.
                </p>
              </div>

              {/* 1. Support & Communication Style */}
              <div>
                <label className="block font-ui text-xs text-[#CFC5B5] mb-2 font-medium">
                  How would you like EchoSoul to respond to you?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SUPPORT_STYLES.map((style) => {
                    const isSelected = supportStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setSupportStyle(style.id)}
                        className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-start gap-3 ${
                          isSelected
                            ? "border-[#F2D78A] bg-[#F2D78A]/10 shadow-[0_0_15px_rgba(242,215,138,0.25)] ring-1 ring-[#F2D78A]"
                            : "border-white/10 hover:border-white/30 bg-[#08131B]/50"
                        }`}
                      >
                        <span className="text-xl mt-0.5">{style.icon}</span>
                        <div>
                          <p className={`font-ui text-xs font-semibold ${isSelected ? "text-[#F2D78A]" : "text-[#FFF8E1]"}`}>
                            {style.title}
                          </p>
                          <p className="font-ui text-[11px] text-[#9AA8B0] mt-0.5 leading-tight">
                            {style.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Overwhelmed Helper Mode */}
              <div>
                <label className="block font-ui text-xs text-[#CFC5B5] mb-2 font-medium">
                  In difficult or overwhelming moments, what helps you most?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {OVERWHELMED_HELPERS.map((helper) => {
                    const isSelected = overwhelmedHelper === helper.id;
                    return (
                      <button
                        key={helper.id}
                        type="button"
                        onClick={() => setOverwhelmedHelper(helper.id)}
                        className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-start gap-3 ${
                          isSelected
                            ? "border-[#F2D78A] bg-[#F2D78A]/10 shadow-[0_0_15px_rgba(242,215,138,0.25)] ring-1 ring-[#F2D78A]"
                            : "border-white/10 hover:border-white/30 bg-[#08131B]/50"
                        }`}
                      >
                        <span className="text-xl mt-0.5">{helper.icon}</span>
                        <div>
                          <p className={`font-ui text-xs font-semibold ${isSelected ? "text-[#F2D78A]" : "text-[#FFF8E1]"}`}>
                            {helper.title}
                          </p>
                          <p className="font-ui text-[11px] text-[#9AA8B0] mt-0.5 leading-tight">
                            {helper.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Response Depth & Pace */}
              <div>
                <label className="block font-ui text-xs text-[#CFC5B5] mb-2 font-medium">
                  Response length and depth
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {RESPONSE_DEPTHS.map((depth) => {
                    const isSelected = responseDepth === depth.id;
                    return (
                      <button
                        key={depth.id}
                        type="button"
                        onClick={() => setResponseDepth(depth.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? "border-[#F2D78A] bg-[#F2D78A]/10 shadow-[0_0_12px_rgba(242,215,138,0.25)] ring-1 ring-[#F2D78A]"
                            : "border-white/10 hover:border-white/30 bg-[#08131B]/50"
                        }`}
                      >
                        <p className={`font-ui text-xs font-medium ${isSelected ? "text-[#FFF8E1]" : "text-[#CFC5B5]"}`}>
                          {depth.label}
                        </p>
                        <p className="font-ui text-[10px] text-[#9AA8B0] mt-0.5">
                          {depth.sub}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Memory & Privacy */}
              <div>
                <label className="block font-ui text-xs text-[#CFC5B5] mb-2 font-medium">
                  Memory and privacy style
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MEMORY_OPTIONS.map((mem) => {
                    const isSelected = memoryPreference === mem.id;
                    return (
                      <button
                        key={mem.id}
                        type="button"
                        onClick={() => setMemoryPreference(mem.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-[#F2D78A] bg-[#F2D78A]/10 shadow-[0_0_12px_rgba(242,215,138,0.25)] ring-1 ring-[#F2D78A]"
                            : "border-white/10 hover:border-white/30 bg-[#08131B]/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-ui text-xs font-semibold ${isSelected ? "text-[#F2D78A]" : "text-[#FFF8E1]"}`}>
                            {mem.title}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#CFC5B5]">
                            {mem.badge}
                          </span>
                        </div>
                        <p className="font-ui text-[11px] text-[#9AA8B0] leading-tight">
                          {mem.sub}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quote Banner */}
              <div className="relative p-3.5 rounded-xl bg-gradient-to-r from-[#F2D78A]/10 via-[#F2D78A]/5 to-transparent border border-[#F2D78A]/25 flex items-center justify-center text-center">
                <p className="font-display italic text-xs sm:text-sm text-[#F2D78A]">
                  &ldquo;To understand another human being is the highest form of companionship.&rdquo;{" "}
                  <span className="font-ui not-italic text-[11px] text-[#CFC5B5]">— EchoSoul</span>
                </p>
              </div>

              {/* Navigation Controls */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/onboarding/world"
                  className="px-6 py-2.5 rounded-full border border-white/20 hover:border-white/40 text-xs font-ui text-[#CFC5B5] hover:text-[#FFF8E1] transition-all"
                >
                  ← Back
                </Link>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-2.5 rounded-full btn-gold-primary text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <span>Next → (Step 5: Appearance)</span>
                </button>
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
