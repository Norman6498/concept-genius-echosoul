"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { VISUAL_WORLDS_CONFIG } from "@/lib/personalization/view-model";
import { createClient } from "@/lib/supabase/client";
import { getScopedStorageItem } from "@/lib/auth/sessionBoundary";

const ONBOARDING_STEPS = [
  { number: 1, label: "About You",   href: "/onboarding" },
  { number: 2, label: "Interests",   href: "/onboarding/interests" },
  { number: 3, label: "Your World",  href: "/onboarding/world" },
  { number: 4, label: "Preferences", href: "/onboarding/preferences" },
  { number: 5, label: "Appearance",  href: "/onboarding/appearance" },
  { number: 6, label: "Complete",    href: "/onboarding/complete" },
];

const FEATURES_LIST = [
  { id: "talk", title: "Talk", desc: "Share what's on your mind", icon: "💬", href: "/app/talk" },
  { id: "music", title: "Explore Music", desc: "Find sounds that feel like you", icon: "🎵", href: "/app/music" },
  { id: "words", title: "Read & Discover", desc: "Find words that fit you", icon: "📜", href: "/app/words" },
  { id: "visuals", title: "Visual Experiences", desc: "Step into spaces you love", icon: "🌌", href: "/app/visuals" },
  { id: "journey", title: "Track Your Journey", desc: "See how far you've come", icon: "🧭", href: "/app/journey" },
  { id: "features", title: "Explore All Features", desc: "There's more waiting for you", icon: "✨", href: "/app" },
];

export function OnboardingStep6() {
  const [userName, setUserName] = useState("Friend");
  const [visualWorld, setVisualWorld] = useState("mountain_calm");
  const [theme, setTheme] = useState("midnight_soul");
  const [accentColor, setAccentColor] = useState("#F2D78A");
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadSummary() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!isMounted) return;

        const p1 = getScopedStorageItem<any>(user?.id, "personalization", null);
        const p3 = getScopedStorageItem<any>(user?.id, "world", null);
        const p5 = getScopedStorageItem<any>(user?.id, "appearance", null);

        if (user?.user_metadata?.display_name) {
          setUserName(user.user_metadata.display_name);
        } else if (p1?.name) {
          setUserName(p1.name);
        }

        if (p3?.visualWorld) setVisualWorld(p3.visualWorld);
        if (p5?.theme) setTheme(p5.theme);
        if (p5?.accentColor) setAccentColor(p5.accentColor);
      } catch {
        // Fallback defaults
      }
    }
    loadSummary();
    return () => { isMounted = false; };
  }, []);

  const worldConfig = VISUAL_WORLDS_CONFIG[visualWorld] || VISUAL_WORLDS_CONFIG.mountain_calm;

  const handleFinish = async () => {
    setIsFinishing(true);
    // Mark onboarding as completed
    try {
      await fetch("/api/personalization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          onboardingCompleted: true,
          step: 6,
        }),
      });
    } catch {
      // Ignore
    }

    setTimeout(() => {
      window.location.href = "/app";
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
            const isActive = step.number === 6;
            const isCompleted = step.number < 6;
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

        <span className="font-display italic text-xs text-[#F2D78A]">
          A more meaningful tomorrow.
        </span>
      </header>

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-10 flex-1 flex flex-col justify-center">
        <div className="w-full rounded-[28px] p-6 sm:p-10 bg-[#0C1B25]/95 backdrop-blur-2xl border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.95)]">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* LEFT COLUMN: Editorial Reflection & Personalized Heading */}
            <div className="lg:col-span-4 space-y-5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2D78A]/10 border border-[#F2D78A]/30 text-[11px] font-ui text-[#F2D78A] font-semibold uppercase tracking-wider">
                Personalized for {userName}
              </span>

              <h1 className="font-display text-3xl sm:text-4xl text-[#FFF8E1] font-normal leading-tight">
                {visualWorld === "mountain_calm" && "A brighter mind for a brighter you."}
                {visualWorld === "forest_retreat" && "A calmer mind lives deeper."}
                {visualWorld === "ocean_breeze" && "New days. Same you. Stronger tomorrow."}
                {visualWorld === "city_lights" && "Bigger dreams belong here."}
                {visualWorld === "starry_skies" && "Even in the dark, your story shines."}
                {visualWorld === "cozy_room" && "Good stories make a kinder you."}
                {visualWorld === "fantasy_realm" && "Your imagination is part of the journey."}
                {visualWorld === "minimal_space" && "Less noise. A deeper you."}
                {visualWorld === "anime_aesthetic" && "Same you. A brighter horizon."}
                {visualWorld === "nature_wildlife" && "A wilder you is still a kinder you."}
                {visualWorld === "space_cosmos" && "A wider universe lives within you."}
                {visualWorld === "classic_vintage" && "Great stories live in quiet minds."}
              </h1>

              <div className="pl-4 border-l-2 border-[#F2D78A]/40 py-1">
                <p className="font-display italic text-sm sm:text-base text-[#CFC5B5] leading-relaxed">
                  &ldquo;{worldConfig.quote}&rdquo;
                </p>
                <p className="font-ui text-xs text-[#F2D78A] font-medium mt-1">
                  — {worldConfig.quoteAuthor}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs font-ui text-[#9AA8B0] leading-relaxed">
                <p className="text-[#FFF8E1] font-medium mb-1">
                  You are in control.
                </p>
                You can change all your preferences anytime in Settings. Themes, sources, communication style, and more are always in your control.
              </div>
            </div>

            {/* CENTER COLUMN: Central Arched Portal */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[300px] h-[380px] sm:h-[420px] rounded-t-full rounded-b-2xl overflow-hidden border-2 border-[#F2D78A]/40 shadow-[0_0_35px_rgba(242,215,138,0.25)] bg-[#08131B]">
                {/* Background Image of chosen visual world */}
                <Image
                  src={worldConfig.background}
                  alt={worldConfig.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />

                {/* Atmospheric Vignette & Star Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-black/30" />

                {/* Arched Border Glow */}
                <div className="absolute inset-0 rounded-t-full rounded-b-2xl pointer-events-none ring-1 ring-inset ring-[#F2D78A]/40" />

                {/* Welcome Overlay */}
                <div className="absolute inset-x-0 bottom-6 px-4 text-center z-10">
                  <span className="font-ui text-[10px] uppercase tracking-[0.25em] text-[#F2D78A] font-semibold block mb-1">
                    Welcome to
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl text-[#FFF8E1] font-normal drop-shadow-md">
                    EchoSoul
                  </h2>
                  <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#CFC5B5]/90 mt-1 block">
                    A Brighter You Awaits
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: What You Can Do Now & Launch Button */}
            <div className="lg:col-span-4 space-y-4">
              <div>
                <h3 className="font-display text-lg sm:text-xl text-[#FFF8E1] font-normal">
                  What you can do now
                </h3>
                <p className="font-ui text-xs text-[#9AA8B0] mt-0.5">
                  Here are a few places to begin. You can explore everything anytime.
                </p>
              </div>

              {/* 6 Actions Menu */}
              <div className="space-y-2">
                {FEATURES_LIST.map((feat) => (
                  <Link
                    key={feat.id}
                    href={feat.href}
                    className="group p-2.5 rounded-xl border border-white/10 hover:border-[#F2D78A]/50 bg-[#08131B]/60 hover:bg-[#08131B]/90 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{feat.icon}</span>
                      <div>
                        <p className="font-ui text-xs font-semibold text-[#FFF8E1] group-hover:text-[#F2D78A] transition-colors">
                          {feat.title}
                        </p>
                        <p className="font-ui text-[10px] text-[#9AA8B0] leading-tight">
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[#9AA8B0] group-hover:text-[#F2D78A] transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                ))}
              </div>

              {/* Primary CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isFinishing}
                  onClick={handleFinish}
                  className="w-full py-3.5 px-6 rounded-full btn-gold-primary text-xs sm:text-sm font-semibold tracking-wide flex flex-col items-center justify-center gap-0.5 shadow-xl disabled:opacity-50"
                  style={{ backgroundColor: accentColor, color: "#0B0F14" }}
                >
                  <span className="font-bold">Enter EchoSoul →</span>
                  <span className="font-ui text-[10px] opacity-85 font-normal">
                    Start your journey to a more meaningful tomorrow.
                  </span>
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Quote Banner */}
          <div className="mt-8 pt-4 border-t border-white/10 text-center">
            <p className="font-display italic text-xs sm:text-sm text-[#F2D78A]">
              &ldquo;Different worlds. The same you.&rdquo;{" "}
              <span className="font-ui not-italic text-[11px] text-[#CFC5B5]">— EchoSoul</span>
            </p>
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
