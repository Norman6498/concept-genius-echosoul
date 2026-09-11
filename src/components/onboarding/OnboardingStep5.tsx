"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import {
  useOnboardingPreview,
  ThemeMode,
  AccentColor,
  BackgroundEnvironment,
  LayoutMode,
  FontStyle,
} from "@/lib/onboarding/preview-context";
import { LiveEchoSoulPreview } from "@/components/onboarding/LiveEchoSoulPreview";
import { createClient } from "@/lib/supabase/client";

const ONBOARDING_STEPS = [
  { number: 1, label: "About You",   href: "/onboarding" },
  { number: 2, label: "Interests",   href: "/onboarding/interests" },
  { number: 3, label: "Your World",  href: "/onboarding/world" },
  { number: 4, label: "Preferences", href: "/onboarding/preferences" },
  { number: 5, label: "Appearance",  href: "/onboarding/appearance" },
  { number: 6, label: "Complete",    href: "/onboarding/complete" },
];

const THEMES: { id: ThemeMode; label: string; desc: string; image: string }[] = [
  {
    id: "midnight_soul",
    label: "Midnight Soul",
    desc: "Deep, calm, focused",
    image: "/themes/midnight_soul.jpg",
  },
  {
    id: "sunrise_calm",
    label: "Sunrise Calm",
    desc: "Warm, bright, uplifting",
    image: "/themes/sunrise_calm.jpg",
  },
  {
    id: "forest_green",
    label: "Forest Green",
    desc: "Natural, peaceful",
    image: "/themes/forest_green.jpg",
  },
  {
    id: "minimal_light",
    label: "Minimal Light",
    desc: "Clean, simple, modern",
    image: "/themes/minimal_light.jpg",
  },
];

const ACCENT_COLORS: { id: AccentColor; label: string; hex: string }[] = [
  { id: "gold",   label: "Gold",   hex: "#F2D78A" },
  { id: "purple", label: "Purple", hex: "#A78BFA" },
  { id: "blue",   label: "Blue",   hex: "#60A5FA" },
  { id: "green",  label: "Green",  hex: "#4ADE80" },
  { id: "pink",   label: "Pink",   hex: "#F472B6" },
  { id: "orange", label: "Orange", hex: "#FB923C" },
  { id: "red",    label: "Red",    hex: "#F87171" },
  { id: "gray",   label: "Gray",   hex: "#CBD5E1" },
];

const ENVIRONMENTS: { id: BackgroundEnvironment; label: string; image: string }[] = [
  { id: "cozy_room",     label: "Cozy Room",     image: "/environments/cozy_room.jpg" },
  { id: "mountain_view", label: "Mountain View", image: "/environments/mountain_view.jpg" },
  { id: "forest_cabin",  label: "Forest Cabin",  image: "/environments/forest_cabin.jpg" },
  { id: "ocean_view",    label: "Ocean View",    image: "/environments/ocean_view.jpg" },
  { id: "city_nights",   label: "City Nights",   image: "/environments/city_nights.jpg" },
  { id: "starry_sky",    label: "Starry Sky",    image: "/environments/starry_sky.jpg" },
];

const LAYOUTS: { id: LayoutMode; label: string; desc: string }[] = [
  { id: "focused",     label: "Focused",     desc: "Minimal, distraction-free" },
  { id: "explorative", label: "Explorative", desc: "Richer visuals and elements" },
];

const FONTS: { id: FontStyle; label: string; desc: string; sample: string }[] = [
  { id: "serif",   label: "Serif",      desc: "Classic & elegant", sample: "Aa" },
  { id: "sans",    label: "Sans Serif", desc: "Clean & modern",    sample: "Aa" },
  { id: "rounded", label: "Rounded",    desc: "Soft & friendly",   sample: "Aa" },
];

export function OnboardingStep5() {
  const router = useRouter();
  const { appearance, updateAppearance } = useOnboardingPreview();
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Save locally
      localStorage.setItem("echosoul_user_appearance", JSON.stringify(appearance));

      // Save to Supabase user_settings
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("user_settings").upsert({
          user_id: user.id,
          theme_mode: appearance.theme,
          accent_color: appearance.accentColor,
          font_family: appearance.fontStyle,
          sound_enabled: appearance.backgroundMusic,
          updated_at: new Date().toISOString(),
        });
      }

      router.push("/onboarding/complete");
    } catch {
      router.push("/onboarding/complete");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050B10] text-[#FFF8E1] flex flex-col justify-between overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(242,215,138,0.06),transparent_70%)]" />

      {/* ── Top Header Bar ────────────────────────────────────────────── */}
      <header className="relative z-20 w-full max-w-[1536px] mx-auto px-6 sm:px-10 py-5 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <BrandLogo size="md" />
        </Link>

        {/* 6-Step Stepper */}
        <div className="hidden md:flex items-center gap-2">
          {ONBOARDING_STEPS.map((step, idx) => {
            const isActive = step.number === 5;
            const isCompleted = step.number < 5;
            const isLast = idx === ONBOARDING_STEPS.length - 1;

            return (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-ui text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#F2D78A] text-[#0B0F14] shadow-[0_0_12px_rgba(242,215,138,0.6)]"
                        : isCompleted
                        ? "bg-[#F2D78A]/20 text-[#F2D78A] border border-[#F2D78A]/40"
                        : "bg-white/5 text-[#9AA8B0] border border-white/10"
                    }`}
                  >
                    {isCompleted ? "✓" : step.number}
                  </div>
                  <span
                    className={`font-ui text-[10px] mt-1 ${
                      isActive ? "text-[#F2D78A] font-medium" : "text-[#9AA8B0]"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {!isLast && <div className="w-5 lg:w-8 h-px bg-white/15 mx-1" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Skip for now */}
        <Link
          href="/app"
          className="font-ui text-xs sm:text-sm text-[#9AA8B0] hover:text-[#FFF8E1] transition-colors flex items-center gap-1.5 group"
        >
          <span>Skip for now</span>
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </header>

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <main className="relative z-20 w-full max-w-[1536px] mx-auto px-6 sm:px-10 py-4 flex-1 flex flex-col justify-between">
        <form onSubmit={handleNext} className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

            {/* ── Left Column: Atmospheric Window Artwork ─────────────────── */}
            <div className="lg:col-span-4 xl:col-span-3 relative rounded-3xl overflow-hidden border border-[#F2D78A]/20 shadow-2xl min-h-[580px] lg:min-h-[750px] bg-[#050B10] flex flex-col justify-between p-6 sm:p-8">
              <Image
                src={`/environments/${appearance.backgroundEnvironment || "cozy_room"}.jpg`}
                alt="A space that feels like you."
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 360px"
                className="object-cover object-center opacity-45 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B10] via-transparent to-[#050B10]/80 pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08131B]/80 border border-[#F2D78A]/30 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F2D78A] animate-pulse" />
                  <span className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#F2D78A] font-medium">
                    Visual Atmosphere
                  </span>
                </div>

                <h1 className="font-editorial text-3xl sm:text-4xl text-[#FFF8E1] font-normal leading-tight">
                  A space<br />
                  that feels<br />
                  <span className="italic text-[#F2D78A]">like you.</span>
                </h1>

                <p className="font-ui text-xs sm:text-sm text-[#CFC5B5] leading-relaxed">
                  Shapes, colors, and environments can make a space feel more like home. Customize your EchoSoul experience.
                </p>
              </div>

              <div className="relative z-10 p-4 rounded-2xl bg-[#08131B]/80 border border-white/10 backdrop-blur-md">
                <p className="font-display italic text-xs sm:text-sm text-[#F2D78A] leading-relaxed">
                  &ldquo;Beauty isn&apos;t a luxury, it&apos;s a form of care.&rdquo;
                </p>
                <p className="font-ui text-[11px] text-[#CFC5B5] mt-1 text-right">— Rupi Kaur</p>
              </div>
            </div>

            {/* ── Center & Right Area: Controls & Live Preview ────────────── */}
            <div className="lg:col-span-8 xl:col-span-9 grid grid-cols-1 xl:grid-cols-12 gap-6 rounded-3xl border border-white/10 bg-[#0C1B25]/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">

              {/* CENTER COLUMN: Interactive Controls (7 Cols) */}
              <div className="xl:col-span-7 space-y-5">

                {/* Section Header */}
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="font-editorial text-2xl sm:text-3xl text-[#FFF8E1] font-medium">
                      5. Appearance
                    </h2>
                    <span className="hidden sm:inline font-script text-lg text-[#F2D78A]">
                      Different moods. Same you.
                    </span>
                  </div>
                  <p className="font-ui text-xs text-[#9AA8B0] mt-1">
                    Customize the look and feel of EchoSoul. You can always change this later.
                  </p>
                </div>

                {/* 1. Choose a Theme (4 Cards) */}
                <div>
                  <label className="block font-ui text-xs text-[#CFC5B5] mb-0.5 font-medium">
                    Choose a theme
                  </label>
                  <p className="font-ui text-[11px] text-[#9AA8B0] mb-2">
                    This changes the overall look and color mood.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {THEMES.map((th) => {
                      const isSelected = appearance.theme === th.id;
                      return (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => updateAppearance({ theme: th.id })}
                          className={`relative rounded-xl overflow-hidden border p-1 text-center transition-all group flex flex-col items-center ${
                            isSelected
                              ? "border-[#F2D78A] shadow-[0_0_15px_rgba(242,215,138,0.4)] ring-1 ring-[#F2D78A]"
                              : "border-white/10 hover:border-white/30 bg-[#08131B]/60"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 z-10 w-3.5 h-3.5 rounded-full bg-[#F2D78A] text-[#0B0F14] flex items-center justify-center shadow-sm">
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
                              sizes="100px"
                              className="object-cover transition-transform group-hover:scale-105 duration-200"
                            />
                          </div>
                          <span className={`font-ui text-[11px] leading-tight font-medium ${
                            isSelected ? "text-[#FFF8E1]" : "text-[#CFC5B5]"
                          }`}>
                            {th.label}
                          </span>
                          <span className="font-ui text-[9px] text-[#9AA8B0] line-clamp-1">
                            {th.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Choose Accent Color (8 Circles) */}
                <div>
                  <label className="block font-ui text-xs text-[#CFC5B5] mb-0.5 font-medium">
                    Choose your accent color
                  </label>
                  <p className="font-ui text-[11px] text-[#9AA8B0] mb-2">
                    This color will be used for highlights, buttons and personal touches.
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    {ACCENT_COLORS.map((c) => {
                      const isSelected = appearance.accentColor === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => updateAppearance({ accentColor: c.id })}
                          aria-label={c.label}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-200 relative flex items-center justify-center ${
                            isSelected
                              ? "ring-2 ring-white scale-110 shadow-lg"
                              : "hover:scale-105 opacity-80 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        >
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0B0F14]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Choose Background Environment (6 Cards) */}
                <div>
                  <label className="block font-ui text-xs text-[#CFC5B5] mb-0.5 font-medium">
                    Choose a background environment
                  </label>
                  <p className="font-ui text-[11px] text-[#9AA8B0] mb-2">
                    This sets the visual atmosphere of your space.
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {ENVIRONMENTS.map((env) => {
                      const isSelected = appearance.backgroundEnvironment === env.id;
                      return (
                        <button
                          key={env.id}
                          type="button"
                          onClick={() => updateAppearance({ backgroundEnvironment: env.id })}
                          className={`relative rounded-xl overflow-hidden border p-1 text-center transition-all group flex flex-col items-center ${
                            isSelected
                              ? "border-[#F2D78A] shadow-[0_0_12px_rgba(242,215,138,0.4)] ring-1 ring-[#F2D78A]"
                              : "border-white/10 hover:border-white/30 bg-[#08131B]/60"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-1 right-1 z-10 w-3 h-3 rounded-full bg-[#F2D78A] text-[#0B0F14] flex items-center justify-center shadow-sm">
                              <svg className="w-1.5 h-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          <div className="relative w-full h-10 rounded-lg overflow-hidden mb-1 bg-[#08131B]">
                            <Image
                              src={env.image}
                              alt={env.label}
                              fill
                              unoptimized
                              sizes="80px"
                              className="object-cover transition-transform group-hover:scale-105 duration-200"
                            />
                          </div>
                          <span className={`font-ui text-[10px] leading-tight px-0.5 line-clamp-1 ${
                            isSelected ? "text-[#FFF8E1] font-semibold" : "text-[#9AA8B0]"
                          }`}>
                            {env.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Choose Layout & Font Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Layout */}
                  <div>
                    <label className="block font-ui text-xs text-[#CFC5B5] mb-1 font-medium">
                      Choose a layout
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {LAYOUTS.map((layout) => {
                        const isSelected = appearance.layout === layout.id;
                        return (
                          <button
                            key={layout.id}
                            type="button"
                            onClick={() => updateAppearance({ layout: layout.id })}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              isSelected
                                ? "border-[#F2D78A] bg-[#F2D78A]/10 shadow-sm ring-1 ring-[#F2D78A]"
                                : "border-white/10 hover:border-white/30 bg-[#08131B]/60"
                            }`}
                          >
                            <div className={`font-ui text-xs font-semibold ${isSelected ? "text-[#FFF8E1]" : "text-[#CFC5B5]"}`}>
                              {layout.label}
                            </div>
                            <div className="font-ui text-[10px] text-[#9AA8B0] line-clamp-1 mt-0.5">
                              {layout.desc}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Font */}
                  <div>
                    <label className="block font-ui text-xs text-[#CFC5B5] mb-1 font-medium">
                      Choose a font style
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {FONTS.map((font) => {
                        const isSelected = appearance.fontStyle === font.id;
                        return (
                          <button
                            key={font.id}
                            type="button"
                            onClick={() => updateAppearance({ fontStyle: font.id })}
                            className={`p-2 rounded-xl border text-center transition-all ${
                              isSelected
                                ? "border-[#F2D78A] bg-[#F2D78A]/10 shadow-sm ring-1 ring-[#F2D78A]"
                                : "border-white/10 hover:border-white/30 bg-[#08131B]/60"
                            }`}
                          >
                            <span className="font-display text-sm block mb-0.5 text-[#F2D78A]">
                              {font.sample}
                            </span>
                            <span className={`font-ui text-[10px] block leading-tight font-medium ${
                              isSelected ? "text-[#FFF8E1]" : "text-[#CFC5B5]"
                            }`}>
                              {font.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Quote Banner */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#F2D78A]/10 via-[#F2D78A]/5 to-transparent border border-[#F2D78A]/25 text-center">
                  <p className="font-display italic text-xs sm:text-sm text-[#F2D78A]">
                    &ldquo;Surround yourself with what feels like you.&rdquo;{" "}
                    <span className="font-ui not-italic text-[11px] text-[#CFC5B5]">— EchoSoul</span>
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: Live Reactive Preview & Display Toggles (5 Cols) */}
              <div className="xl:col-span-5 space-y-5 flex flex-col justify-between">

                {/* Shared Live EchoSoul Preview */}
                <LiveEchoSoulPreview />

                {/* Additional Display Options Toggles */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <h3 className="font-ui text-xs font-semibold text-[#FFF8E1]">
                    Additional display options
                  </h3>

                  <div className="space-y-2 text-xs font-ui text-[#CFC5B5]">
                    {[
                      { key: "ambientAnimations" as const,   label: "Show ambient animations (e.g., particles, stars)", icon: "✨" },
                      { key: "backgroundMusic" as const,     label: "Enable background music (optional)",               icon: "🎵" },
                      { key: "timeBasedEnvironment" as const,label: "Show time-based environments (e.g., day/night)",   icon: "🕒" },
                      { key: "reducedMotion" as const,       label: "Reduced motion (for accessibility)",               icon: "👁️" },
                    ].map((opt) => (
                      <div key={opt.key} className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span>{opt.icon}</span>
                          <span>{opt.label}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => updateAppearance({ [opt.key]: !appearance[opt.key] })}
                          className={`w-9 h-5 rounded-full transition-colors relative flex items-center ${
                            appearance[opt.key] ? "bg-[#F2D78A]" : "bg-white/20"
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full bg-[#0B0F14] transition-transform ${
                              appearance[opt.key] ? "translate-x-4.5" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Link
                    href="/onboarding/preferences"
                    className="h-11 px-6 rounded-xl border border-white/20 hover:border-[#F2D78A] text-[#FFF8E1] hover:text-[#F2D78A] text-xs sm:text-sm font-ui font-medium flex items-center justify-center transition-colors"
                  >
                    ← Back
                  </Link>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 h-11 rounded-xl btn-gold-primary text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {isSaving ? "Finalizing..." : "Next → Step 6: Complete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="relative z-20 w-full max-w-[1536px] mx-auto px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 text-xs font-ui text-[#9AA8B0] gap-2">
        <div className="flex items-center gap-4">
          <Link href="/about" className="hover:text-[#FFF8E1] transition-colors">How it works</Link>
          <Link href="/about" className="hover:text-[#FFF8E1] transition-colors">Experiences</Link>
          <Link href="/about" className="hover:text-[#FFF8E1] transition-colors">Privacy</Link>
          <Link href="/about" className="hover:text-[#FFF8E1] transition-colors">Terms</Link>
        </div>
        <div>
          © 2026 EchoSoul. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
