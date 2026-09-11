"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { IconSet } from "@/components/ui/IconSet";
import { createClient } from "@/lib/supabase/client";
import type { HomePersonalizationViewModel } from "@/lib/personalization/types";
import { buildHomeViewModel } from "@/lib/personalization/view-model";

export function AuthenticatedHome() {
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState<HomePersonalizationViewModel | null>(null);
  const [activeMood, setActiveMood] = useState<string>("calm");
  const [checkInSubmitted, setCheckInSubmitted] = useState(false);

  // Fetch real personalized data
  useEffect(() => {
    let mounted = true;

    async function loadPersonalization() {
      try {
        const res = await fetch("/api/personalization");
        const json = await res.json();

        if (mounted && json.homeView) {
          setHomeData(json.homeView);
          setActiveMood(json.homeView.currentMood);
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to local storage for guests
      }

      // Check localStorage for personalization saved during onboarding
      if (mounted) {
        try {
          const localProfile = localStorage.getItem("echosoul_user_personalization");
          const localInterests = localStorage.getItem("echosoul_user_interests");
          let name = "Friend";
          let mood = "calm";
          let focus = "exploring";

          if (localProfile) {
            const p = JSON.parse(localProfile);
            if (p.name) name = p.name;
            if (p.currentMood) mood = p.currentMood;
            if (p.currentFocus) focus = p.currentFocus;
          }

          let vibe = "Creative";
          if (localInterests) {
            const i = JSON.parse(localInterests);
            if (i.vibe) vibe = i.vibe;
          }

          let parsedInterests: string[] = [];
          if (localInterests) {
            try {
              const i = JSON.parse(localInterests);
              if (Array.isArray(i.interests)) parsedInterests = i.interests;
            } catch {
              // Ignore
            }
          }

          const vm = buildHomeViewModel({
            name,
            currentMood: mood,
            currentFocus: focus,
            overallVibe: vibe,
            interests: parsedInterests,
          });

          setHomeData(vm);
          setActiveMood(vm.currentMood);
        } catch {
          // Fallback handled
        }
      }

      if (mounted) setLoading(false);
    }

    loadPersonalization();

    return () => {
      mounted = false;
    };
  }, []);

  // Real-time check-in mood update
  const handleCheckIn = async (mood: string) => {
    setActiveMood(mood);
    setCheckInSubmitted(true);

    if (homeData) {
      const updated = buildHomeViewModel({
        name: homeData.userName,
        currentMood: mood,
        currentFocus: homeData.currentFocus,
        overallVibe: homeData.overallVibe,
      });
      setHomeData(updated);
    }

    try {
      const localProfile = localStorage.getItem("echosoul_user_personalization");
      if (localProfile) {
        const p = JSON.parse(localProfile);
        p.currentMood = mood;
        localStorage.setItem("echosoul_user_personalization", JSON.stringify(p));
      }
    } catch {
      // Ignore
    }

    try {
      await fetch("/api/personalization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentMood: mood }),
      });
    } catch {
      // Local fallback
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    window.location.href = "/";
  };

  if (loading || !homeData) {
    return (
      <div className="min-h-screen w-full bg-[#0B0F14] text-[#FFF8E1] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#F2D78A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-ui text-xs tracking-wider text-[#9AA8B0] uppercase">
            Entering EchoSoul sanctuary...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#0B0F14] text-[#FFF8E1] flex flex-col justify-between overflow-x-hidden select-none">
      {/* ── Background Atmosphere ────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none transition-all duration-700 opacity-35"
        style={{
          backgroundImage: `url('${homeData.visualAtmosphere.backgroundImage}')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F14]/90 via-[#0B0F14]/80 to-[#0B0F14]" />
      </div>

      {/* ── Authenticated Header ──────────────────────────────────────── */}
      <header className="relative z-30 w-full max-w-[1536px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <BrandLogo size="md" />

          {/* Navigation to Authenticated Experiences */}
          <nav className="hidden lg:flex items-center gap-7 font-ui text-xs font-medium text-[#CFC5B5]">
            <Link href="/app/talk" className="hover:text-[#F2D78A] transition-colors">
              Talk
            </Link>
            <Link href="/app/words" className="hover:text-[#F2D78A] transition-colors">
              Words
            </Link>
            <Link href="/app/music" className="hover:text-[#F2D78A] transition-colors">
              Music
            </Link>
            <Link href="/app/visuals" className="hover:text-[#F2D78A] transition-colors">
              Visuals
            </Link>
            <Link href="/app/journey" className="hover:text-[#F2D78A] transition-colors">
              Journey
            </Link>
            <Link href="/app/journal" className="hover:text-[#F2D78A] transition-colors">
              Journal
            </Link>
            <Link href="/app/guidance" className="hover:text-[#F2D78A] transition-colors">
              Guidance
            </Link>
          </nav>
        </div>

        {/* User Identity & Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#0C1B25]/80 shadow-sm">
            <div className="w-6 h-6 rounded-full bg-[#F2D78A] text-[#0B0F14] font-bold text-xs flex items-center justify-center shadow-[0_0_8px_rgba(242,215,138,0.4)]">
              {homeData.userName.charAt(0).toUpperCase()}
            </div>
            <span className="font-ui text-xs font-medium text-[#FFF8E1]">
              {homeData.userName}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="font-ui text-xs text-[#9AA8B0] hover:text-[#FFF8E1] transition-colors px-2 py-1"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* ── Main Personalized Sanctuary Content ───────────────────────── */}
      <main className="relative z-20 w-full max-w-[1536px] mx-auto px-6 sm:px-10 py-6 flex-1 space-y-10">
        {/* 1. Hero Dynamic Greeting Section */}
        <section className="space-y-4 max-w-[820px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F2D78A] shadow-[0_0_8px_#F2D78A]" />
            <span className="font-ui text-[11px] font-semibold tracking-widest text-[#F2D78A] uppercase">
              {homeData.visualAtmosphere.environmentTitle}
            </span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#FFF8E1] leading-tight font-normal">
            {homeData.heroGreeting}
          </h1>

          <p className="font-ui text-base sm:text-lg text-[#CFC5B5] leading-relaxed">
            {homeData.heroMessage}
          </p>

          {/* Quick Action CTA Button */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={homeData.primaryAction.href}
              className="h-12 px-8 rounded-full font-ui text-sm font-semibold bg-[#F2D78A] hover:bg-[#FFB86B] text-[#0B0F14] transition-all flex items-center gap-2 shadow-[0_0_22px_rgba(242,215,138,0.35)]"
            >
              <span>{homeData.primaryAction.title}</span>
              <span>→</span>
            </Link>

            {homeData.secondaryActions.map((sec) => (
              <Link
                key={sec.id}
                href={sec.href}
                className="h-12 px-6 rounded-full font-ui text-xs font-medium border border-white/20 hover:border-white/40 bg-[#08131B]/60 text-[#CFC5B5] hover:text-[#FFF8E1] transition-colors flex items-center gap-2"
              >
                <span>{sec.title}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 2. Daily Check-in Widget */}
        <section className="rounded-2xl border border-white/10 bg-[#0C1B25]/60 backdrop-blur-md p-5 max-w-[900px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="font-ui text-xs font-bold text-[#FFF8E1] tracking-wide">
                Daily Check-in
              </h2>
              <p className="font-ui text-[11px] text-[#9AA8B0]">
                {homeData.checkInSuggestion}
              </p>
            </div>
            {checkInSubmitted && (
              <span className="font-ui text-[11px] text-[#8DBA8F]">
                ✓ Check-in saved for today
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "calm", label: "Calm" },
              { id: "happy", label: "Good" },
              { id: "sad", label: "Heavy" },
              { id: "motivated", label: "Focused" },
              { id: "tired", label: "Tired" },
              { id: "stressed", label: "Stressed" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleCheckIn(m.id)}
                className={`h-8 px-4 rounded-full font-ui text-xs transition-all duration-200 ${
                  activeMood === m.id
                    ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-[0_0_12px_rgba(242,215,138,0.4)]"
                    : "border border-white/10 hover:border-white/25 bg-[#08131B]/60 text-[#CFC5B5]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </section>

        {/* 3. Personalized Content Grid: Words, Music, Journey */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Authentic Words Recommendation */}
          <div className="md:col-span-6 lg:col-span-5 rounded-3xl border border-white/10 bg-[#0C1B25]/65 backdrop-blur-md p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-ui text-[10px] font-semibold tracking-wider text-[#F2D78A] uppercase">
                  {homeData.recommendedWords.category}
                </span>
                <span className="font-ui text-[10px] text-[#9AA8B0]">
                  Authentic Literary Source
                </span>
              </div>
              <h3 className="font-editorial text-2xl text-[#FFF8E1]">
                {homeData.recommendedWords.title}
              </h3>
              <span className="block font-ui text-xs text-[#9AA8B0]">
                by {homeData.recommendedWords.author}
              </span>
              <p className="font-editorial italic text-sm text-[#CFC5B5] leading-relaxed pt-2">
                &ldquo;{homeData.recommendedWords.excerpt}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <Link
                href="/app/words"
                className="font-ui text-xs font-medium text-[#F2D78A] hover:underline flex items-center gap-1"
              >
                <span>Read full text & reflection</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Mindful Music Soundscape */}
          <div className="md:col-span-6 lg:col-span-4 rounded-3xl border border-white/10 bg-[#0C1B25]/65 backdrop-blur-md p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-ui text-[10px] font-semibold tracking-wider text-[#8DBA8F] uppercase">
                  {homeData.recommendedMusic.category}
                </span>
                <span className="font-ui text-[10px] text-[#9AA8B0]">
                  {homeData.recommendedMusic.duration}
                </span>
              </div>
              <h3 className="font-editorial text-2xl text-[#FFF8E1]">
                {homeData.recommendedMusic.title}
              </h3>
              <p className="font-ui text-xs text-[#CFC5B5] leading-relaxed">
                Atmosphere composed for your current state:{" "}
                <span className="text-[#FFF8E1] font-medium">
                  {homeData.recommendedMusic.vibe}
                </span>
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <Link
                href="/app/music"
                className="h-9 px-5 rounded-full font-ui text-xs font-semibold bg-white/10 hover:bg-white/20 text-[#FFF8E1] transition-all flex items-center gap-2"
              >
                <span>Listen Now</span>
                <span>▶</span>
              </Link>
            </div>
          </div>

          {/* Community Coming Soon Banner */}
          <div className="md:col-span-12 lg:col-span-3 rounded-3xl border border-white/10 bg-[#08131B]/80 backdrop-blur-md p-6 space-y-3 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="inline-block px-2.5 py-0.5 rounded-full border border-[#F2D78A]/40 bg-[#F2D78A]/10 text-[#F2D78A] font-ui text-[10px] font-semibold tracking-wider uppercase">
                Community Coming Soon
              </div>
              <h4 className="font-ui text-sm font-bold text-[#FFF8E1]">
                Grow together. Talk. Share. Learn.
              </h4>
              <p className="font-ui text-xs text-[#9AA8B0] leading-relaxed">
                A private sanctuary for moderated circles and growth challenges. Your personal memories remain private.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10">
              <span className="font-ui text-[11px] text-[#9AA8B0]">
                Available in next release
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* ── Global Footer ──────────────────────────────────────────────── */}
      <footer className="relative z-30 w-full border-t border-white/10 bg-[#08131B]/90 backdrop-blur-md py-4 mt-10">
        <div className="max-w-[1536px] mx-auto px-6 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-ui text-[#9AA8B0]">
          <span>EchoSoul Sanctuary · Personalized for {homeData.userName}</span>
          <span>© 2026 EchoSoul. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
