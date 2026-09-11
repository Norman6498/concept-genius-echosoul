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
          const localWorld = localStorage.getItem("echosoul_user_world");
          const localAppearance = localStorage.getItem("echosoul_user_appearance");

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
          let parsedInterests: string[] = [];
          if (localInterests) {
            try {
              const i = JSON.parse(localInterests);
              if (i.vibe) vibe = i.vibe;
              if (Array.isArray(i.interests)) parsedInterests = i.interests;
            } catch {
              // Ignore
            }
          }

          let visualWorld = "mountain_calm";
          let dailySchedule = "balanced";
          if (localWorld) {
            try {
              const w = JSON.parse(localWorld);
              if (w.visualWorld) visualWorld = w.visualWorld;
              if (w.dailySchedule) dailySchedule = w.dailySchedule;
            } catch {
              // Ignore
            }
          }

          let theme: "midnight_soul" | "sunrise_calm" | "forest_green" | "minimal_light" = "midnight_soul";
          let accentColor = "#F2D78A";
          let backgroundEnvironment: any = "cozy_room";
          let layoutMode: "focused" | "explorative" = "focused";
          let fontStyle: "serif" | "sans" | "rounded" = "serif";

          if (localAppearance) {
            try {
              const a = JSON.parse(localAppearance);
              if (a.theme) theme = a.theme;
              if (a.accentColor) accentColor = a.accentColor;
              if (a.backgroundEnvironment) backgroundEnvironment = a.backgroundEnvironment;
              if (a.layoutMode) layoutMode = a.layoutMode;
              if (a.fontStyle) fontStyle = a.fontStyle;
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
            visualWorld,
            theme,
            accentColor,
            backgroundEnvironment,
            layoutMode,
            fontStyle,
            dailySchedule,
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
        visualWorld: homeData.homeTheme.environment,
        theme: homeData.homeTheme.theme,
        accentColor: homeData.homeTheme.accent,
        layoutMode: "focused",
        fontStyle: homeData.homeTheme.typographyMode,
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

  const isLight = homeData.homeTheme.theme === "minimal_light";
  const isSunrise = homeData.homeTheme.theme === "sunrise_calm";
  const isForest = homeData.homeTheme.theme === "forest_green";

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden select-none transition-colors duration-700 ${
        isLight
          ? "bg-[#F7F5F0] text-[#1C1714]"
          : isSunrise
          ? "bg-[#181315] text-[#FFF8E1]"
          : isForest
          ? "bg-[#091410] text-[#FFF8E1]"
          : "bg-[#0B0F14] text-[#FFF8E1]"
      }`}
    >
      {/* ── Background Atmosphere (Selected 12 Visual World) ───────────── */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none transition-all duration-700 opacity-30"
        style={{
          backgroundImage: `url('${homeData.homeTheme.background}')`,
        }}
      >
        <div
          className={`absolute inset-0 ${
            isLight
              ? "bg-gradient-to-b from-[#F7F5F0]/90 via-[#F7F5F0]/80 to-[#F7F5F0]"
              : isSunrise
              ? "bg-gradient-to-b from-[#181315]/90 via-[#181315]/80 to-[#181315]"
              : isForest
              ? "bg-gradient-to-b from-[#091410]/90 via-[#091410]/80 to-[#091410]"
              : "bg-gradient-to-b from-[#0B0F14]/90 via-[#0B0F14]/80 to-[#0B0F14]"
          }`}
        />
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
            <Link href="/app/guidance" className="hover:text-[#F2D78A] transition-colors">
              Guidance
            </Link>
          </nav>
        </div>

        {/* User Identity & Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#0C1B25]/80 shadow-sm">
            <div
              className="w-6 h-6 rounded-full text-[#0B0F14] font-bold text-xs flex items-center justify-center shadow-sm"
              style={{ backgroundColor: homeData.homeTheme.accent }}
            >
              {homeData.userName.charAt(0).toUpperCase()}
            </div>
            <span className={`font-ui text-xs font-medium ${isLight ? "text-[#1C1714]" : "text-[#FFF8E1]"}`}>
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
            <span
              className="w-2 h-2 rounded-full shadow-sm"
              style={{ backgroundColor: homeData.homeTheme.accent }}
            />
            <span
              className="font-ui text-[11px] font-semibold tracking-widest uppercase"
              style={{ color: homeData.homeTheme.accent }}
            >
              {homeData.homeTheme.environmentTitle} &bull; {homeData.homeTheme.ambience}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight font-normal">
            {homeData.heroGreeting}
          </h1>

          <p className="font-ui text-base sm:text-lg opacity-85 leading-relaxed">
            {homeData.heroMessage}
          </p>

          {/* Quick Action CTA Button */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={homeData.primaryAction.href}
              className="h-12 px-8 rounded-full font-ui text-sm font-semibold transition-all flex items-center gap-2 shadow-lg"
              style={{ backgroundColor: homeData.homeTheme.accent, color: "#0B0F14" }}
            >
              <span>{homeData.primaryAction.title}</span>
              <span>→</span>
            </Link>

            {homeData.secondaryActions.map((sec) => (
              <Link
                key={sec.id}
                href={sec.href}
                className="h-12 px-6 rounded-full font-ui text-xs font-medium border border-white/20 hover:border-white/40 bg-black/20 transition-colors flex items-center gap-2"
              >
                <span>{sec.title}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 2. Daily Check-in Widget */}
        <section className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-5 max-w-[900px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="font-ui text-xs font-bold tracking-wide">
                Daily Check-in
              </h2>
              <p className="font-ui text-[11px] opacity-75">
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
                    ? "font-semibold shadow-md"
                    : "border border-white/10 hover:border-white/25 bg-black/20 opacity-80"
                }`}
                style={
                  activeMood === m.id
                    ? { backgroundColor: homeData.homeTheme.accent, color: "#0B0F14" }
                    : {}
                }
              >
                {m.label}
              </button>
            ))}
          </div>
        </section>

        {/* 3. Personalized Content Grid: Words, Music, Sanctuary */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Authentic Words Recommendation */}
          <div className="md:col-span-6 lg:col-span-5 rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className="font-ui text-[10px] font-semibold tracking-wider uppercase"
                  style={{ color: homeData.homeTheme.accent }}
                >
                  {homeData.recommendedWords.category}
                </span>
                <span className="font-ui text-[10px] opacity-65">
                  Authentic Literary Source
                </span>
              </div>
              <h3 className="font-display text-2xl">
                {homeData.recommendedWords.title}
              </h3>
              <span className="block font-ui text-xs opacity-75">
                by {homeData.recommendedWords.author}
              </span>
              <p className="font-display italic text-sm opacity-85 leading-relaxed pt-2">
                &ldquo;{homeData.recommendedWords.excerpt}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <Link
                href="/app/words"
                className="font-ui text-xs font-medium hover:underline flex items-center gap-1"
                style={{ color: homeData.homeTheme.accent }}
              >
                <span>Read full text & reflection</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Mindful Music Soundscape */}
          <div className="md:col-span-6 lg:col-span-4 rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-ui text-[10px] font-semibold tracking-wider text-[#8DBA8F] uppercase">
                  {homeData.recommendedMusic.category}
                </span>
                <span className="font-ui text-[10px] opacity-65">
                  {homeData.recommendedMusic.duration}
                </span>
              </div>
              <h3 className="font-display text-2xl">
                {homeData.recommendedMusic.title}
              </h3>
              <p className="font-ui text-xs opacity-85 leading-relaxed">
                Atmosphere composed for your current state:{" "}
                <span className="font-medium">
                  {homeData.recommendedMusic.vibe}
                </span>
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <Link
                href="/app/music"
                className="h-9 px-5 rounded-full font-ui text-xs font-semibold bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <span>Listen Now</span>
                <span>▶</span>
              </Link>
            </div>
          </div>

          {/* Environmental Quote Banner */}
          <div className="md:col-span-12 lg:col-span-3 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 space-y-3 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div
                className="inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-ui font-semibold tracking-wider uppercase"
                style={{
                  borderColor: `${homeData.homeTheme.accent}60`,
                  backgroundColor: `${homeData.homeTheme.accent}15`,
                  color: homeData.homeTheme.accent,
                }}
              >
                World Reflection
              </div>
              <h4 className="font-display italic text-sm leading-relaxed pt-1">
                &ldquo;{homeData.homeTheme.quoteStyle}&rdquo;
              </h4>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] opacity-75">
              <span>Selected World: {homeData.homeTheme.environmentTitle}</span>
              <Link href="/onboarding/appearance" className="hover:underline text-[10px]">
                Change Theme ⚙
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Global Footer ──────────────────────────────────────────────── */}
      <footer className="relative z-30 w-full border-t border-white/10 bg-black/40 backdrop-blur-md py-4 mt-10">
        <div className="max-w-[1536px] mx-auto px-6 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-ui opacity-75">
          <span>EchoSoul Sanctuary &bull; Personalized for {homeData.userName}</span>
          <span>© 2026 EchoSoul. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
