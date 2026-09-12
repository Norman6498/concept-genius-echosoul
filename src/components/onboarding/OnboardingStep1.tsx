"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { IconSet, type IconName } from "@/components/ui/IconSet";
import { createClient } from "@/lib/supabase/client";
import { getScopedStorageItem, setScopedStorageItem } from "@/lib/auth/sessionBoundary";

// ── Types ────────────────────────────────────────────────────────────────────
export type AgeRange = "Below 16" | "16 – 18" | "19 – 22" | "23 – 26" | "26+";
export type RoleOption = "Student" | "Working" | "Both" | "Other";

export interface GoalOption {
  id: string;
  label: string;
  icon: IconName;
}

export interface FocusOption {
  id: string;
  label: string;
  image: string;
}

export interface MoodOption {
  id: string;
  label: string;
  icon: IconName;
}

// ── Data Options ─────────────────────────────────────────────────────────────
const AGE_RANGES: AgeRange[] = ["Below 16", "16 – 18", "19 – 22", "23 – 26", "26+"];
const ROLES: RoleOption[] = ["Student", "Working", "Both", "Other"];

const GOALS: GoalOption[] = [
  { id: "talk",      label: "Talk & be heard",      icon: "chat" },
  { id: "words",     label: "Find the right words",  icon: "book" },
  { id: "music",     label: "Music for my mood",     icon: "music" },
  { id: "visual",    label: "Visual experiences",    icon: "visual" },
  { id: "guidance",  label: "Guidance & advice",     icon: "sprout" },
  { id: "track",     label: "Track my journey",      icon: "trend" },
  { id: "novel",     label: "Create my life novel",  icon: "quill" },
  { id: "exploring", label: "Just exploring",        icon: "star" },
];

const FOCUS_OPTIONS: FocusOption[] = [
  { id: "exploring",   label: "Exploring myself",         image: "/focus/focus-1.jpg" },
  { id: "studies",     label: "Focused on studies",       image: "/focus/focus-2.jpg" },
  { id: "goals",       label: "Working towards goals",    image: "/focus/focus-3.jpg" },
  { id: "overwhelmed", label: "Feeling overwhelmed",      image: "/focus/focus-4.jpg" },
  { id: "motivation",  label: "Seeking motivation",       image: "/focus/focus-5.jpg" },
  { id: "creative",    label: "Want to be more creative", image: "/focus/focus-6.jpg" },
  { id: "mental",      label: "Improve my mental health", image: "/focus/focus-7.jpg" },
  { id: "other",       label: "Other",                    image: "/focus/focus-8.jpg" },
];

const MOODS: MoodOption[] = [
  { id: "calm",       label: "Calm",       icon: "mood-calm" },
  { id: "happy",      label: "Happy",      icon: "mood-happy" },
  { id: "neutral",    label: "Neutral",    icon: "mood-neutral" },
  { id: "anxious",    label: "Anxious",    icon: "mood-anxious" },
  { id: "sad",        label: "Sad",        icon: "mood-sad" },
  { id: "stressed",   label: "Stressed",   icon: "mood-stressed" },
  { id: "motivated",  label: "Motivated",  icon: "mood-motivated" },
  { id: "tired",      label: "Tired",      icon: "mood-tired" },
];

const ONBOARDING_STEPS = [
  { number: 1, label: "About You" },
  { number: 2, label: "Interests" },
  { number: 3, label: "Your World" },
  { number: 4, label: "Preferences" },
  { number: 5, label: "Appearance" },
  { number: 6, label: "Complete" },
];

export function OnboardingStep1() {
  // Form state
  const [name, setName] = useState("");
  const [ageRange, setAgeRange] = useState<AgeRange>("16 – 18");
  const [role, setRole] = useState<RoleOption>("Student");
  const [customRole, setCustomRole] = useState<string>("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["talk", "words"]);
  const [selectedFocus, setSelectedFocus] = useState<string>("exploring");
  const [customFocus, setCustomFocus] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<string>("motivated");

  // Status & submission state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Load existing profile or personalization strictly scoped to current user
  useEffect(() => {
    let isMounted = true;

    async function loadUserData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (user) {
          // Check scoped local storage for this specific user
          const userScoped = getScopedStorageItem<any>(user.id, "personalization", null);
          let loadedName = user.user_metadata?.display_name ||
                           user.user_metadata?.full_name ||
                           userScoped?.name ||
                           "";

          // Fetch database profile row
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (!isMounted) return;

          if (profile?.display_name) loadedName = profile.display_name;
          if (loadedName) setName(loadedName);

          const source = profile || userScoped;
          if (source?.age_range || source?.ageRange) setAgeRange((source.age_range || source.ageRange) as AgeRange);
          if (source?.role) setRole(source.role as RoleOption);
          if (source?.custom_role || source?.customRole) setCustomRole(source.custom_role || source.customRole);
          if (source?.goals?.length) setSelectedGoals(source.goals);
          if (source?.current_focus || source?.currentFocus) setSelectedFocus(source.current_focus || source.currentFocus);
          if (source?.custom_focus || source?.customFocus) setCustomFocus(source.custom_focus || source.customFocus);
          if (source?.current_mood || source?.currentMood) setSelectedMood(source.current_mood || source.currentMood);
        } else {
          // Unauthenticated / Guest: read only guest-scoped storage
          const guestScoped = getScopedStorageItem<any>(null, "personalization", null);
          if (guestScoped) {
            if (guestScoped.name) setName(guestScoped.name);
            if (guestScoped.ageRange) setAgeRange(guestScoped.ageRange);
            if (guestScoped.role) setRole(guestScoped.role);
            if (guestScoped.customRole) setCustomRole(guestScoped.customRole);
            if (guestScoped.goals) setSelectedGoals(guestScoped.goals);
            if (guestScoped.currentFocus) setSelectedFocus(guestScoped.currentFocus);
            if (guestScoped.customFocus) setCustomFocus(guestScoped.customFocus);
            if (guestScoped.currentMood) setSelectedMood(guestScoped.currentMood);
          }
        }
      } catch (err) {
        console.warn("Error loading user profile in OnboardingStep1:", err);
      }
    }

    loadUserData();
    return () => { isMounted = false; };
  }, []);

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedbackMessage(null);

    const payload = {
      name: name.trim() || "Friend",
      ageRange,
      role,
      customRole: role === "Other" ? customRole.trim() : undefined,
      goals: selectedGoals,
      currentFocus: selectedFocus,
      customFocus: selectedFocus === "other" ? customFocus.trim() : undefined,
      currentMood: selectedMood,
      step: 1,
    };

    let activeUserId: string | null = null;
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        activeUserId = user.id;
        await supabase.auth.updateUser({
          data: {
            display_name: payload.name,
            personalization: payload,
          },
        });
        await supabase.from("profiles").upsert({
          id: user.id,
          display_name: payload.name,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn("Client Supabase sync notice:", err);
    }

    // 1. Save strictly scoped to this authenticated user
    setScopedStorageItem(activeUserId, "personalization", payload);

    // 2. Save via API route for server-side persistence
    try {
      await fetch("/api/personalization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // API call fallback
    }

    setIsSaving(false);
    setSaveSuccess(true);
    setFeedbackMessage("Your preferences have been saved to your profile.");

    // Advance to Step 2: Interests
    setTimeout(() => {
      window.location.href = "/onboarding/interests";
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0B0F14] text-[#FFF8E1] flex flex-col justify-between overflow-x-hidden select-none">
      {/* ── Background Artwork Layer (Page 3 clean with 0 duplicate text) ── */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-left-top sm:bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/page3-clean.png')",
          backgroundSize: "cover",
        }}
      >
        {/* Soft atmospheric gradient transitions */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0B0F14]/75 to-[#0B0F14]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-[#0B0F14]/50" />

        {/* Twinkling star lights above the night horizon */}
        <div className="absolute top-[9%] left-[23%] w-1.5 h-1.5 rounded-full bg-white animate-star-twinkle shadow-[0_0_8px_white]" />
        <div className="absolute top-[13%] left-[26%] w-1 h-1 rounded-full bg-[#F2D78A] animate-star-twinkle shadow-[0_0_6px_#F2D78A]" style={{ animationDelay: "1.4s" }} />
        <div className="absolute top-[6%] left-[20%] w-1.5 h-1.5 rounded-full bg-white animate-star-twinkle shadow-[0_0_8px_white]" style={{ animationDelay: "2.2s" }} />
      </div>

      {/* ── Top Header & Stepper Bar ─────────────────────────────────── */}
      <header className="relative z-30 w-full max-w-[1536px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <BrandLogo size="md" />
        </div>

        {/* Center: 6-step progress stepper */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {ONBOARDING_STEPS.map((step, idx) => {
            const isActive = step.number === 1;
            const isLast = idx === ONBOARDING_STEPS.length - 1;

            return (
              <React.Fragment key={step.number}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#F2D78A] text-[#0B0F14] shadow-[0_0_12px_rgba(242,215,138,0.6)]"
                        : "border border-white/25 text-[#9AA8B0] bg-[#0C1B25]/60"
                    }`}
                  >
                    {step.number}
                  </div>
                  <span
                    className={`font-ui text-xs tracking-wide ${
                      isActive ? "text-[#F2D78A] font-medium" : "text-[#9AA8B0]"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {!isLast && (
                  <div className="w-6 lg:w-9 h-px bg-white/15 mx-1" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Skip for now */}
        <div className="flex items-center">
          <Link
            href="/"
            className="font-ui text-xs sm:text-sm text-[#9AA8B0] hover:text-[#FFF8E1] transition-colors flex items-center gap-1.5 group"
          >
            <span>Skip for now</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </header>

      {/* ── Main Layout: Hero Art (Left) + Form (Right) ───────────────── */}
      <main className="relative z-20 w-full max-w-[1536px] mx-auto px-6 sm:px-10 py-4 flex-1 flex flex-col justify-center">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: Editorial headline, quote, and step badge ──────── */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-between h-full min-h-[420px] lg:pr-6 py-2">
            <div className="space-y-6">
              <h1 className="font-display font-normal text-4xl sm:text-5xl lg:text-[54px] leading-[1.08] tracking-tight text-[#FFF8E1]">
                Let&apos;s make<br />
                EchoSoul<br />
                <span className="italic text-[#F2D78A]">yours.</span>
              </h1>

              <p className="font-ui text-sm sm:text-base text-[#CFC5B5] font-light leading-relaxed max-w-[340px]">
                The more you share, the more EchoSoul understands you.
              </p>

              {/* Aristotle quote block */}
              <div className="pt-2">
                <p className="font-display italic text-base sm:text-lg text-[#FFF8E1]/90 leading-snug">
                  &ldquo;Knowing yourself is the beginning of all wisdom.&rdquo;
                </p>
                <p className="font-ui text-xs text-[#F2D78A] font-medium mt-1.5">
                  — Aristotle
                </p>
              </div>
            </div>

            {/* Bottom-left Step indicator & note */}
            <div className="pt-8 sm:pt-16 space-y-2">
              <div className="w-full max-w-[240px] h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="w-1/6 h-full bg-[#F2D78A] rounded-full shadow-[0_0_8px_#F2D78A]" />
              </div>
              <div className="font-ui text-xs text-[#9AA8B0]">
                <span className="text-[#FFF8E1] font-medium">Step 1 of 6</span>
                <span className="block text-[11px] text-[#CFC5B5]/70 mt-0.5">
                  A more meaningful tomorrow starts here.
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Form Content ──────────────────────── */}
          <div className="lg:col-span-8 xl:col-span-8 bg-[#0C1B25]/90 backdrop-blur-xl border border-[#F2D78A]/20 rounded-[28px] p-6 sm:p-8 lg:p-9 shadow-[0_24px_64px_rgba(0,0,0,0.9)] space-y-7">

            {/* Section Header */}
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-[#FFF8E1] font-normal">
                1. A little about you
              </h2>
              <p className="font-ui text-xs sm:text-sm text-[#9AA8B0] mt-1">
                This helps EchoSoul understand who you are.
              </p>
            </div>

            {/* Sub-grid: Fields 1-4 (Left) & Fields 5-6 (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

              {/* ── Sub-Column A: Name, Age, Role, Goals ────────────────── */}
              <div className="space-y-6">

                {/* Field 1: Name */}
                <div>
                  <label htmlFor="user-name-input" className="block font-ui text-xs text-[#CFC5B5] mb-2 font-medium">
                    What should we call you?
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9AA8B0]">
                      <IconSet name="user" className="w-4 h-4" />
                    </span>
                    <input
                      id="user-name-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full h-11 pl-10 pr-3.5 input-field-dark text-xs sm:text-sm font-ui rounded-xl border border-white/15 focus:border-[#F2D78A] transition-all bg-[#08131B]/70"
                    />
                  </div>
                </div>

                {/* Field 2: Age Range */}
                <div>
                  <label className="block font-ui text-xs text-[#CFC5B5] mb-2 font-medium">
                    Your age range
                  </label>
                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                    {AGE_RANGES.map((range) => {
                      const isSelected = ageRange === range;
                      return (
                        <button
                          key={range}
                          type="button"
                          onClick={() => setAgeRange(range)}
                          className={`h-9 rounded-lg font-ui text-[11px] sm:text-xs font-medium transition-all duration-200 flex items-center justify-center ${
                            isSelected
                              ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-[0_0_12px_rgba(242,215,138,0.4)]"
                              : "border border-white/15 hover:border-[#F2D78A]/40 bg-[#08131B]/60 text-[#CFC5B5] hover:text-[#FFF8E1]"
                          }`}
                        >
                          {range}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Field 3: Role */}
                <div>
                  <label className="block font-ui text-xs text-[#CFC5B5] mb-2 font-medium">
                    I am a
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {ROLES.map((r) => {
                      const isSelected = role === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`h-9 rounded-lg font-ui text-xs font-medium transition-all duration-200 flex items-center justify-center ${
                            isSelected
                              ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-[0_0_12px_rgba(242,215,138,0.4)]"
                              : "border border-white/15 hover:border-[#F2D78A]/40 bg-[#08131B]/60 text-[#CFC5B5] hover:text-[#FFF8E1]"
                          }`}
                        >
                          {r}
                        </button>
                      );
                    })}
                  </div>

                  {role === "Other" && (
                    <div className="mt-2.5 animate-fadeIn">
                      <input
                        type="text"
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        placeholder="Specify your role (e.g. Designer, Freelancer, Homemaker...)"
                        className="w-full h-10 px-3.5 input-field-dark text-xs font-ui rounded-xl border border-[#F2D78A]/40 bg-[#08131B]/80 text-[#FFF8E1] focus:border-[#F2D78A] placeholder-[#9AA8B0]/60 shadow-inner"
                      />
                    </div>
                  )}
                </div>

                {/* Field 4: Goals (Multi-select) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-ui text-xs text-[#CFC5B5] font-medium">
                      What are you here for?
                    </label>
                    <span className="font-ui text-[11px] text-[#9AA8B0]">
                      (Select as many as you like)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {GOALS.map((goal) => {
                      const isSelected = selectedGoals.includes(goal.id);
                      return (
                        <button
                          key={goal.id}
                          type="button"
                          onClick={() => toggleGoal(goal.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col items-start gap-1.5 ${
                            isSelected
                              ? "border-[#F2D78A] bg-[#F2D78A]/10 shadow-[0_0_12px_rgba(242,215,138,0.2)]"
                              : "border-white/10 hover:border-white/25 bg-[#08131B]/50 hover:bg-[#08131B]/80"
                          }`}
                        >
                          <div className={`transition-colors ${isSelected ? "text-[#F2D78A]" : "text-[#CFC5B5]"}`}>
                            <IconSet name={goal.icon} className="w-4 h-4" />
                          </div>
                          <span className={`font-ui text-[11px] sm:text-xs leading-tight ${isSelected ? "text-[#FFF8E1] font-medium" : "text-[#9AA8B0]"}`}>
                            {goal.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* ── Sub-Column B: Current Focus & Mood ──────────────────── */}
              <div className="space-y-6">

                {/* Field 5: Focus (Photographic cards) */}
                <div>
                  <label className="block font-ui text-xs text-[#CFC5B5] mb-2 font-medium">
                    What best describes you right now?
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {FOCUS_OPTIONS.map((opt) => {
                      const isSelected = selectedFocus === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedFocus(opt.id)}
                          className={`relative rounded-xl overflow-hidden border p-1.5 text-center transition-all duration-200 flex flex-col items-center justify-between group ${
                            isSelected
                              ? "border-[#F2D78A] shadow-[0_0_15px_rgba(242,215,138,0.35)] ring-1 ring-[#F2D78A]"
                              : "border-white/10 hover:border-white/30 bg-[#08131B]/60"
                          }`}
                        >
                          {/* Selected checkmark badge */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 z-10 w-4 h-4 rounded-full bg-[#F2D78A] text-[#0B0F14] flex items-center justify-center shadow-sm">
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}

                          {/* Image thumbnail */}
                          <div className="relative w-full h-12 sm:h-13 rounded-lg overflow-hidden mb-1.5 bg-[#08131B]">
                            <Image
                              src={opt.image}
                              alt={opt.label}
                              fill
                              unoptimized
                              sizes="120px"
                              className="object-cover transition-transform group-hover:scale-105 duration-300"
                            />
                          </div>

                          {/* Label */}
                          <span className={`font-ui text-[10px] leading-tight px-0.5 min-h-[26px] flex items-center justify-center text-center ${
                            isSelected ? "text-[#FFF8E1] font-medium" : "text-[#9AA8B0] group-hover:text-[#CFC5B5]"
                          }`}>
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {selectedFocus === "other" && (
                    <div className="mt-2.5 p-3 rounded-xl bg-[#0C1B25]/90 border border-[#F2D78A]/40 es-fade-up">
                      <label className="block font-ui text-[11px] text-[#F2D78A] mb-1 font-medium">
                        Please describe what best describes you:
                      </label>
                      <input
                        type="text"
                        value={customFocus}
                        onChange={(e) => setCustomFocus(e.target.value)}
                        placeholder="e.g. Taking a gap year, healing after a loss..."
                        className="w-full h-9 px-3 text-xs input-field-dark rounded-lg font-ui"
                      />
                    </div>
                  )}
                </div>

                {/* Field 6: Current Mood (8 face tiles) */}
                <div>
                  <label className="block font-ui text-xs text-[#CFC5B5] mb-2 font-medium">
                    How would you describe your current mood?
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {MOODS.map((m) => {
                      const isSelected = selectedMood === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSelectedMood(m.id)}
                          className={`relative rounded-xl border p-2 text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 group ${
                            isSelected
                              ? "border-[#F2D78A] bg-[#F2D78A]/10 shadow-[0_0_15px_rgba(242,215,138,0.3)] ring-1 ring-[#F2D78A]"
                              : "border-white/10 hover:border-white/30 bg-[#08131B]/50 hover:bg-[#08131B]/80"
                          }`}
                        >
                          {/* Selected badge */}
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#F2D78A] text-[#0B0F14] flex items-center justify-center">
                              <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}

                          <div className={`transition-colors ${isSelected ? "text-[#F2D78A]" : "text-[#CFC5B5] group-hover:text-[#FFF8E1]"}`}>
                            <IconSet name={m.icon} className="w-5 h-5" />
                          </div>
                          <span className={`font-ui text-[11px] leading-tight ${isSelected ? "text-[#FFF8E1] font-medium" : "text-[#9AA8B0]"}`}>
                            {m.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* ── Bottom Section: Carl Jung Banner & Next Button ────────── */}
            <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-5">

              {/* Carl Jung Banner (Clean, sharp asset) */}
              <div className="w-full md:max-w-[440px] rounded-2xl overflow-hidden border border-[#F2D78A]/30 shadow-md">
                <Image
                  src="/carl-jung-banner.png"
                  alt="“The privilege of a lifetime is to become truly who you are.” — Carl Jung"
                  width={852}
                  height={152}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Right: Next Step Button & Feedback */}
              <div className="flex flex-col items-center md:items-end w-full md:w-auto">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full md:w-auto h-12 px-9 rounded-full font-ui text-sm font-semibold bg-[#F2D78A] hover:bg-[#FFB86B] text-[#0B0F14] transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(242,215,138,0.4)] hover:shadow-[0_0_35px_rgba(242,215,138,0.6)] hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D78A]"
                >
                  {isSaving ? (
                    <span>Saving to EchoSoul...</span>
                  ) : saveSuccess ? (
                    <span>Saved! Continuing →</span>
                  ) : (
                    <>
                      <span>Next</span>
                      <span className="text-base">→</span>
                    </>
                  )}
                </button>
                <span className="font-ui text-[11px] text-[#9AA8B0] mt-1.5 text-center md:text-right">
                  Step 2: Your Interests
                </span>
                {feedbackMessage && (
                  <span className="font-ui text-[11px] text-[#8DBA8F] mt-1">
                    {feedbackMessage}
                  </span>
                )}
              </div>

            </div>

          </div>
        </form>
      </main>

      {/* ── Global Bottom Footer ─────────────────────────────────────── */}
      <footer className="relative z-30 w-full border-t border-[#F2D78A]/15 bg-[#08131B]/90 backdrop-blur-md py-4 mt-6">
        <div className="max-w-[1536px] mx-auto px-6 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-ui text-[#CFC5B5]">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <BrandLogo size="sm" />
            <nav className="hidden sm:flex items-center gap-5 text-[#9AA8B0]" aria-label="Footer navigation">
              <Link href="#how" className="hover:text-[#F2D78A] transition-colors">How it works</Link>
              <Link href="#experiences" className="hover:text-[#F2D78A] transition-colors">Experiences</Link>
              <Link href="#safety" className="hover:text-[#F2D78A] transition-colors">Safety</Link>
              <Link href="#pricing" className="hover:text-[#F2D78A] transition-colors">Pricing</Link>
              <Link href="#blog" className="hover:text-[#F2D78A] transition-colors">Blog</Link>
            </nav>
          </div>

          {/* Social and Copyright */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 text-[#9AA8B0]">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:text-[#F2D78A] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#F2D78A] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-[#F2D78A] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="hover:text-[#F2D78A] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </a>
            </div>
            <span>© 2026 EchoSoul. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
