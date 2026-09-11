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

const THEMES = [
  {
    id: "midnight_soul",
    label: "Midnight Soul",
    desc: "Deep, calm, focused",
    image: "/themes/midnight_soul.jpg",
    previewBg: "#0B0F14",
  },
  {
    id: "sunrise_calm",
    label: "Sunrise Calm",
    desc: "Warm, bright, uplifting",
    image: "/themes/sunrise_calm.jpg",
    previewBg: "#1C1714",
  },
  {
    id: "forest_green",
    label: "Forest Green",
    desc: "Natural, peaceful",
    image: "/themes/forest_green.jpg",
    previewBg: "#0C1713",
  },
  {
    id: "minimal_light",
    label: "Minimal Light",
    desc: "Clean, simple, modern",
    image: "/themes/minimal_light.jpg",
    previewBg: "#F7F5F0",
  },
];

const ACCENT_COLORS = [
  { id: "#F2D78A", label: "Gold", hex: "#F2D78A" },
  { id: "#A78BFA", label: "Purple", hex: "#A78BFA" },
  { id: "#60A5FA", label: "Blue", hex: "#60A5FA" },
  { id: "#4ADE80", label: "Green", hex: "#4ADE80" },
  { id: "#F472B6", label: "Pink", hex: "#F472B6" },
  { id: "#FB923C", label: "Amber", hex: "#FB923C" },
  { id: "#F87171", label: "Red", hex: "#F87171" },
  { id: "#E2E8F0", label: "Silver", hex: "#E2E8F0" },
];

const ENVIRONMENTS = [
  { id: "cozy_room", label: "Cozy Room", image: "/environments/cozy_room.jpg" },
  { id: "mountain_view", label: "Mountain View", image: "/environments/mountain_view.jpg" },
  { id: "forest_cabin", label: "Forest Cabin", image: "/environments/forest_cabin.jpg" },
  { id: "ocean_view", label: "Ocean View", image: "/environments/ocean_view.jpg" },
  { id: "city_nights", label: "City Nights", image: "/environments/city_nights.jpg" },
  { id: "starry_sky", label: "Starry Sky", image: "/environments/starry_sky.jpg" },
];

const LAYOUTS = [
  { id: "focused", label: "Focused", desc: "Minimal, distraction-free" },
  { id: "explorative", label: "Explorative", desc: "Richer visuals and elements" },
];

const FONTS = [
  { id: "serif", label: "Serif", desc: "Classic & elegant", sample: "Aa", fontClass: "font-display" },
  { id: "sans", label: "Sans Serif", desc: "Clean & modern", sample: "Aa", fontClass: "font-ui" },
  { id: "rounded", label: "Rounded", desc: "Soft & friendly", sample: "Aa", fontClass: "font-sans" },
];

export function OnboardingStep5() {
  const [selectedTheme, setSelectedTheme] = useState("midnight_soul");
  const [accentColor, setAccentColor] = useState("#F2D78A");
  const [backgroundEnvironment, setBackgroundEnvironment] = useState("cozy_room");
  const [layoutMode, setLayoutMode] = useState<"focused" | "explorative">("focused");
  const [fontStyle, setFontStyle] = useState<"serif" | "sans" | "rounded">("serif");

  const [ambientAnimations, setAmbientAnimations] = useState(true);
  const [enableMusic, setEnableMusic] = useState(false);
  const [timeBasedEnv, setTimeBasedEnv] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  // Restore saved state
  useEffect(() => {
    try {
      const saved = localStorage.getItem("echosoul_user_appearance");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.theme) setSelectedTheme(p.theme);
        if (p.accentColor) setAccentColor(p.accentColor);
        if (p.backgroundEnvironment) setBackgroundEnvironment(p.backgroundEnvironment);
        if (p.layoutMode) setLayoutMode(p.layoutMode);
        if (p.fontStyle) setFontStyle(p.fontStyle);
        if (p.ambientAnimations !== undefined) setAmbientAnimations(p.ambientAnimations);
        if (p.enableMusic !== undefined) setEnableMusic(p.enableMusic);
        if (p.timeBasedEnv !== undefined) setTimeBasedEnv(p.timeBasedEnv);
        if (p.reducedMotion !== undefined) setReducedMotion(p.reducedMotion);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      theme: selectedTheme,
      accentColor,
      backgroundEnvironment,
      layoutMode,
      fontStyle,
      ambientAnimations,
      enableMusic,
      timeBasedEnv,
      reducedMotion,
      step: 5,
    };

    // Save locally
    try {
      localStorage.setItem("echosoul_user_appearance", JSON.stringify(payload));
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
      window.location.href = "/onboarding/complete";
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
            const isActive = step.number === 5;
            const isCompleted = step.number < 5;
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
          href="/onboarding/complete"
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
              src="/page5_left_panel.jpg"
              alt="Quiet starry window with sleeping cat and lantern"
              fill
              unoptimized
              sizes="380px"
              className="object-cover object-center pointer-events-none"
              priority
            />
            <div className="sr-only">
              <h3>A space that feels like you.</h3>
              <p>Shapes, colors, and environments can make a space feel more like home. Customize your EchoSoul experience.</p>
              <blockquote>&ldquo;Beauty isn&apos;t a luxury, it&apos;s a form of care.&rdquo; — Rupi Kaur</blockquote>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Appearance Controls & Live Preview ─────────── */}
          <div className="lg:col-span-9 flex flex-col justify-between rounded-[24px] p-6 sm:p-8 bg-[#0C1B25]/95 backdrop-blur-2xl border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.9)]">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Title Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl lg:text-[32px] text-[#FFF8E1] font-normal tracking-tight">
                    5. Appearance
                  </h1>
                  <p className="font-ui text-xs sm:text-sm text-[#9AA8B0] mt-1">
                    Customize the look and feel of EchoSoul. You can always change this later.
                  </p>
                </div>
                <span className="hidden sm:inline font-display italic text-xs text-[#F2D78A]/90">
                  Different moods. Same you.
                </span>
              </div>

              {/* 2-Column Split: Controls (Left 8 cols) & Live Preview (Right 4 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* CONTROLS (8 Cols) */}
                <div className="lg:col-span-8 space-y-5">

                  {/* 1. Choose a Theme */}
                  <div>
                    <label className="block font-ui text-xs text-[#CFC5B5] mb-1 font-medium">
                      Choose a theme
                    </label>
                    <p className="font-ui text-[11px] text-[#9AA8B0] mb-2">
                      This changes the overall look and color mood.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {THEMES.map((th) => {
                        const isSelected = selectedTheme === th.id;
                        return (
                          <button
                            key={th.id}
                            type="button"
                            onClick={() => setSelectedTheme(th.id)}
                            className={`relative rounded-xl overflow-hidden border p-1.5 transition-all text-center flex flex-col items-center justify-between ${
                              isSelected
                                ? "border-[#F2D78A] shadow-[0_0_15px_rgba(242,215,138,0.35)] ring-1 ring-[#F2D78A] bg-[#F2D78A]/10"
                                : "border-white/10 hover:border-white/30 bg-[#08131B]/60"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 z-10 w-3.5 h-3.5 rounded-full bg-[#F2D78A] text-[#0B0F14] flex items-center justify-center">
                                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}

                            <div className="relative w-full h-11 rounded-lg overflow-hidden mb-1 bg-[#08131B]">
                              <Image
                                src={th.image}
                                alt={th.label}
                                fill
                                unoptimized
                                sizes="120px"
                                className="object-cover"
                              />
                            </div>
                            <span className={`font-ui text-[11px] font-medium leading-tight ${isSelected ? "text-[#FFF8E1]" : "text-[#CFC5B5]"}`}>
                              {th.label}
                            </span>
                            <span className="font-ui text-[9px] text-[#9AA8B0] leading-tight mt-0.5">
                              {th.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Choose Accent Color */}
                  <div>
                    <label className="block font-ui text-xs text-[#CFC5B5] mb-1 font-medium">
                      Choose your accent color
                    </label>
                    <p className="font-ui text-[11px] text-[#9AA8B0] mb-2">
                      This color will be used for highlights, buttons and personal touches.
                    </p>
                    <div className="flex items-center gap-3">
                      {ACCENT_COLORS.map((col) => {
                        const isSelected = accentColor === col.hex;
                        return (
                          <button
                            key={col.id}
                            type="button"
                            onClick={() => setAccentColor(col.hex)}
                            aria-label={col.label}
                            className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${
                              isSelected
                                ? "ring-2 ring-white ring-offset-2 ring-offset-[#0B0F14] scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                                : "hover:scale-105 opacity-80 hover:opacity-100"
                            }`}
                            style={{ backgroundColor: col.hex }}
                          >
                            {isSelected && (
                              <span className="text-[10px] text-[#0B0F14] font-bold">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Choose Background Environment */}
                  <div>
                    <label className="block font-ui text-xs text-[#CFC5B5] mb-1 font-medium">
                      Choose a background environment
                    </label>
                    <p className="font-ui text-[11px] text-[#9AA8B0] mb-2">
                      This sets the visual atmosphere of your space.
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {ENVIRONMENTS.map((env) => {
                        const isSelected = backgroundEnvironment === env.id;
                        return (
                          <button
                            key={env.id}
                            type="button"
                            onClick={() => setBackgroundEnvironment(env.id)}
                            className={`relative rounded-xl overflow-hidden border p-1 text-center transition-all ${
                              isSelected
                                ? "border-[#F2D78A] shadow-[0_0_12px_rgba(242,215,138,0.35)] ring-1 ring-[#F2D78A]"
                                : "border-white/10 hover:border-white/30 bg-[#08131B]/60"
                            }`}
                          >
                            <div className="relative w-full h-11 rounded-lg overflow-hidden mb-1 bg-[#08131B]">
                              <Image
                                src={env.image}
                                alt={env.label}
                                fill
                                unoptimized
                                sizes="100px"
                                className="object-cover"
                              />
                            </div>
                            <span className={`font-ui text-[10px] leading-tight ${isSelected ? "text-[#FFF8E1] font-semibold" : "text-[#9AA8B0]"}`}>
                              {env.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Layout & Font Style */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Layout */}
                    <div>
                      <label className="block font-ui text-xs text-[#CFC5B5] mb-2 font-medium">
                        Choose a layout
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {LAYOUTS.map((lay) => {
                          const isSelected = layoutMode === lay.id;
                          return (
                            <button
                              key={lay.id}
                              type="button"
                              onClick={() => setLayoutMode(lay.id as "focused" | "explorative")}
                              className={`p-2.5 rounded-xl border text-center transition-all ${
                                isSelected
                                  ? "border-[#F2D78A] bg-[#F2D78A]/10 shadow-[0_0_12px_rgba(242,215,138,0.25)] ring-1 ring-[#F2D78A]"
                                  : "border-white/10 hover:border-white/30 bg-[#08131B]/50"
                              }`}
                            >
                              <span className="text-base mb-1 block">
                                {lay.id === "focused" ? "🔲" : "📑"}
                              </span>
                              <p className={`font-ui text-xs font-semibold ${isSelected ? "text-[#FFF8E1]" : "text-[#CFC5B5]"}`}>
                                {lay.label}
                              </p>
                              <p className="font-ui text-[10px] text-[#9AA8B0] mt-0.5">
                                {lay.desc}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Font Style */}
                    <div>
                      <label className="block font-ui text-xs text-[#CFC5B5] mb-2 font-medium">
                        Choose a font style
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {FONTS.map((f) => {
                          const isSelected = fontStyle === f.id;
                          return (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setFontStyle(f.id as "serif" | "sans" | "rounded")}
                              className={`p-2 rounded-xl border text-center transition-all ${
                                isSelected
                                  ? "border-[#F2D78A] bg-[#F2D78A]/10 shadow-[0_0_12px_rgba(242,215,138,0.25)] ring-1 ring-[#F2D78A]"
                                  : "border-white/10 hover:border-white/30 bg-[#08131B]/50"
                              }`}
                            >
                              <span className={`text-base block mb-0.5 ${f.fontClass} ${isSelected ? "text-[#F2D78A]" : "text-[#FFF8E1]"}`}>
                                {f.sample}
                              </span>
                              <p className={`font-ui text-[11px] font-medium leading-tight ${isSelected ? "text-[#FFF8E1]" : "text-[#CFC5B5]"}`}>
                                {f.label}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>

                {/* LIVE INTERACTIVE PREVIEW & TOGGLES (4 Cols) */}
                <div className="lg:col-span-4 space-y-4">

                  {/* Live Preview Box */}
                  <div className="rounded-2xl p-4 border border-[#F2D78A]/30 shadow-xl overflow-hidden relative" style={{ backgroundColor: selectedTheme === "minimal_light" ? "#F7F5F0" : "#08131B" }}>
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                      <span className="font-ui text-[11px] uppercase tracking-wider font-semibold text-[#9AA8B0]">
                        Preview
                      </span>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                    </div>

                    {/* Preview Message Bubble */}
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-3 backdrop-blur-md">
                      <div className="flex items-center gap-2 mb-1.5">
                        <BrandLogo size="sm" showText={false} />
                        <span className="font-ui text-xs font-semibold text-[#FFF8E1]">
                          EchoSoul
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${fontStyle === "serif" ? "font-display" : "font-ui"} ${selectedTheme === "minimal_light" ? "text-[#1C1714]" : "text-[#CFC5B5]"}`}>
                        Hey there ✨<br />
                        This is how your space could look. Calm, personal, and made for you.<br />
                        <span className="italic" style={{ color: accentColor }}>
                          Your story matters, and so does the way you experience it.
                        </span>
                      </p>
                    </div>

                    {/* Miniature Artwork Preview */}
                    <div className="relative w-full h-24 rounded-xl overflow-hidden border border-white/10 mb-2">
                      <Image
                        src={`/environments/${backgroundEnvironment}.jpg`}
                        alt="Environment sample"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
                        <span className="font-display italic text-[11px] text-[#FFF8E1]">
                          A more you. Every time you return.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Display Option Toggles */}
                  <div className="space-y-2 text-xs font-ui">
                    <span className="block text-[11px] uppercase tracking-wider text-[#9AA8B0] font-medium mb-1">
                      Additional display options
                    </span>

                    {/* Toggle 1: Ambient animations */}
                    <label className="flex items-center justify-between p-2 rounded-lg bg-[#08131B]/60 border border-white/5 cursor-pointer">
                      <span className="text-[#CFC5B5] text-[11px]">Show ambient animations</span>
                      <input
                        type="checkbox"
                        checked={ambientAnimations}
                        onChange={(e) => setAmbientAnimations(e.target.checked)}
                        className="accent-[#F2D78A] w-4 h-4 cursor-pointer"
                      />
                    </label>

                    {/* Toggle 2: Background music */}
                    <label className="flex items-center justify-between p-2 rounded-lg bg-[#08131B]/60 border border-white/5 cursor-pointer">
                      <span className="text-[#CFC5B5] text-[11px]">Enable background music</span>
                      <input
                        type="checkbox"
                        checked={enableMusic}
                        onChange={(e) => setEnableMusic(e.target.checked)}
                        className="accent-[#F2D78A] w-4 h-4 cursor-pointer"
                      />
                    </label>

                    {/* Toggle 3: Time-based environments */}
                    <label className="flex items-center justify-between p-2 rounded-lg bg-[#08131B]/60 border border-white/5 cursor-pointer">
                      <span className="text-[#CFC5B5] text-[11px]">Show time-based environments</span>
                      <input
                        type="checkbox"
                        checked={timeBasedEnv}
                        onChange={(e) => setTimeBasedEnv(e.target.checked)}
                        className="accent-[#F2D78A] w-4 h-4 cursor-pointer"
                      />
                    </label>

                    {/* Toggle 4: Reduced motion */}
                    <label className="flex items-center justify-between p-2 rounded-lg bg-[#08131B]/60 border border-white/5 cursor-pointer">
                      <span className="text-[#CFC5B5] text-[11px]">Reduced motion (accessibility)</span>
                      <input
                        type="checkbox"
                        checked={reducedMotion}
                        onChange={(e) => setReducedMotion(e.target.checked)}
                        className="accent-[#F2D78A] w-4 h-4 cursor-pointer"
                      />
                    </label>
                  </div>

                </div>

              </div>

              {/* Quote Banner */}
              <div className="relative p-3.5 rounded-xl bg-gradient-to-r from-[#F2D78A]/10 via-[#F2D78A]/5 to-transparent border border-[#F2D78A]/25 flex items-center justify-center text-center">
                <p className="font-display italic text-xs sm:text-sm text-[#F2D78A]">
                  &ldquo;Surround yourself with what feels like you.&rdquo;{" "}
                  <span className="font-ui not-italic text-[11px] text-[#CFC5B5]">— EchoSoul</span>
                </p>
              </div>

              {/* Navigation Controls */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/onboarding/preferences"
                  className="px-6 py-2.5 rounded-full border border-white/20 hover:border-white/40 text-xs font-ui text-[#CFC5B5] hover:text-[#FFF8E1] transition-all"
                >
                  ← Back
                </Link>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-2.5 rounded-full btn-gold-primary text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2 shadow-lg disabled:opacity-50"
                  style={{ backgroundColor: accentColor, color: "#0B0F14" }}
                >
                  <span>Next → (Step 6: Complete)</span>
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
