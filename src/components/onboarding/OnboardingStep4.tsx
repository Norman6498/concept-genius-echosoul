"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useOnboardingPreview, CommunicationStyle, ResponseLength } from "@/lib/onboarding/preview-context";
import { LiveEchoSoulPreview } from "@/components/onboarding/LiveEchoSoulPreview";
import { createClient } from "@/lib/supabase/client";
import { setScopedStorageItem } from "@/lib/auth/sessionBoundary";

const ONBOARDING_STEPS = [
  { number: 1, label: "About You",   href: "/onboarding" },
  { number: 2, label: "Interests",   href: "/onboarding/interests" },
  { number: 3, label: "Your World",  href: "/onboarding/world" },
  { number: 4, label: "Preferences", href: "/onboarding/preferences" },
  { number: 5, label: "Appearance",  href: "/onboarding/appearance" },
  { number: 6, label: "Complete",    href: "/onboarding/complete" },
];

const COMMUNICATION_STYLES: { id: CommunicationStyle; label: string; iconSvg: React.ReactNode }[] = [
  {
    id: "warm",
    label: "Warm & supportive",
    iconSvg: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: "calm",
    label: "Calm & thoughtful",
    iconSvg: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    id: "direct",
    label: "Direct & honest",
    iconSvg: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    id: "deep",
    label: "Deep & reflective",
    iconSvg: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 3c-4.97 0-9 4.03-9 9 0 3.31 1.79 6.2 4.45 7.74L12 21l4.55-1.26C19.21 18.2 21 15.31 21 12c0-4.97-4.03-9-9-9z" />
      </svg>
    ),
  },
  {
    id: "light",
    label: "Light & casual",
    iconSvg: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
        <path strokeLinecap="round" strokeWidth="1.8" d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
      </svg>
    ),
  },
];

const RESPONSE_LENGTHS: { id: ResponseLength; label: string }[] = [
  { id: "short", label: "Short & simple" },
  { id: "balanced", label: "Balanced" },
  { id: "detailed", label: "Detailed" },
  { id: "varies", label: "Varies" },
];

const TOPICS = [
  { id: "mental_health",    label: "Mental health",      icon: "🌱" },
  { id: "motivation",       label: "Motivation",         icon: "🏔️" },
  { id: "studies_learning", label: "Studies & learning", icon: "🎓" },
  { id: "creativity",       label: "Creativity",         icon: "🎨" },
  { id: "relationships",    label: "Relationships",      icon: "🤍" },
  { id: "life_advice",      label: "Life advice",        icon: "🌿" },
  { id: "philosophy",       label: "Philosophy",         icon: "🏛️" },
  { id: "science_ideas",    label: "Science & ideas",    icon: "⚛️" },
  { id: "stories_writing",  label: "Stories & writing",  icon: "📖" },
  { id: "music_emotions",   label: "Music & emotions",   icon: "🎵" },
  { id: "nature_life",      label: "Nature & life",      icon: "🌲" },
  { id: "career_future",    label: "Career & future",    icon: "💼" },
  { id: "spirituality",     label: "Spirituality",       icon: "✨" },
  { id: "art_aesthetics",   label: "Art & aesthetics",   icon: "🖌️" },
  { id: "other",            label: "Other",              icon: "•••" },
];

const AVOID_TOPICS = [
  { id: "heavy_negativity",       label: "Heavy negativity" },
  { id: "clinical_medical",       label: "Clinical/medical advice" },
  { id: "political_debates",      label: "Political debates" },
  { id: "violence_disturbing",    label: "Violence / disturbing content" },
  { id: "other_avoid",            label: "Other" },
];

export function OnboardingStep4() {
  const router = useRouter();
  const { preferences, updatePreferences, toggleTopic, toggleAvoided } = useOnboardingPreview();

  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Custom topic and avoid inline text inputs
  const [customTopicInput, setCustomTopicInput] = useState(preferences.customTopic || "");
  const [customAvoidInput, setCustomAvoidInput] = useState(preferences.customAvoid || "");

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedbackMessage(null);

    const payload = {
      ...preferences,
      customTopic: customTopicInput.trim(),
      customAvoid: customAvoidInput.trim(),
      step: 4,
    };

    updatePreferences(payload);

    try {
      // Save to Supabase user_settings / user_context
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Save scoped locally
      setScopedStorageItem(user?.id, "preferences", payload);

      if (user) {
        await supabase.from("user_settings").upsert({
          user_id: user.id,
          support_style: preferences.communicationStyle,
          response_depth: preferences.responseLength,
          sound_enabled: preferences.musicRecommendations,
          updated_at: new Date().toISOString(),
        });
        await supabase.from("user_context").upsert({
          user_id: user.id,
          support_needs: preferences.selectedTopics,
          privacy_mode: preferences.privacyPreference ? "strict" : "standard",
          updated_at: new Date().toISOString(),
        });
      }

      router.push("/onboarding/appearance");
    } catch {
      router.push("/onboarding/appearance");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050B10] text-[#FFF8E1] flex flex-col justify-between overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(242,215,138,0.06),transparent_70%)]" />

      {/* ── Top Header Bar ────────────────────────────────────────────── */}
      <header className="relative z-20 w-full max-w-[1536px] mx-auto px-6 sm:px-10 py-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <BrandLogo size="md" />
        </div>

        {/* 6-Step Stepper */}
        <div className="hidden md:flex items-center gap-2">
          {ONBOARDING_STEPS.map((step, idx) => {
            const isActive = step.number === 4;
            const isCompleted = step.number < 4;
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

            {/* ── Left Column: Cinematic Window Artwork ───────────────────── */}
            <div className="lg:col-span-4 xl:col-span-3 relative rounded-3xl overflow-hidden border border-[#F2D78A]/20 shadow-2xl min-h-[580px] lg:min-h-[750px] bg-[#050B10] flex flex-col justify-between p-6 sm:p-8">
              <Image
                src="/environments/starry_sky.jpg"
                alt="Your preferences. A more you."
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 360px"
                className="object-cover object-center opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B10] via-transparent to-[#050B10]/80 pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08131B]/80 border border-[#F2D78A]/30 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F2D78A] animate-pulse" />
                  <span className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#F2D78A] font-medium">
                    Personalized For You
                  </span>
                </div>

                <h1 className="font-editorial text-3xl sm:text-4xl text-[#FFF8E1] font-normal leading-tight">
                  Your preferences.<br />
                  <span className="italic text-[#F2D78A]">A more you.</span>
                </h1>

                <p className="font-ui text-xs sm:text-sm text-[#CFC5B5] leading-relaxed">
                  Choose how you want to experience EchoSoul. You can change these anytime.
                </p>
              </div>

              <div className="relative z-10 p-4 rounded-2xl bg-[#08131B]/80 border border-white/10 backdrop-blur-md">
                <p className="font-display italic text-xs sm:text-sm text-[#F2D78A] leading-relaxed">
                  &ldquo;It&apos;s not about what you like, but how you feel alive.&rdquo;
                </p>
                <p className="font-ui text-[11px] text-[#CFC5B5] mt-1 text-right">— Rumi</p>
              </div>
            </div>

            {/* ── Center & Right Area: Form & Live Preview ────────────────── */}
            <div className="lg:col-span-8 xl:col-span-9 grid grid-cols-1 xl:grid-cols-12 gap-6 rounded-3xl border border-white/10 bg-[#0C1B25]/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">

              {/* CENTER COLUMN: Interactive Preferences Form (7 Cols) */}
              <div className="xl:col-span-7 space-y-6">

                {/* Section Header */}
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="font-editorial text-2xl sm:text-3xl text-[#FFF8E1] font-medium">
                      4. Your preferences
                    </h2>
                    <span className="hidden sm:inline font-script text-lg text-[#F2D78A]">
                      Your space. Your rules. Always.
                    </span>
                  </div>
                  <p className="font-ui text-xs text-[#9AA8B0] mt-1">
                    Tell us how you&apos;d like to experience EchoSoul. This helps us personalize your conversations,
                    recommendations, and creative experiences.
                  </p>
                </div>

                {/* 1. Communication Style (5 Options) */}
                <div>
                  <label className="block font-ui text-xs text-[#CFC5B5] mb-1 font-medium">
                    Communication style
                  </label>
                  <p className="font-ui text-[11px] text-[#9AA8B0] mb-2.5">
                    How would you like EchoSoul to talk with you?
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {COMMUNICATION_STYLES.map((style) => {
                      const isSelected = preferences.communicationStyle === style.id;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => updatePreferences({ communicationStyle: style.id })}
                          className={`relative p-2.5 rounded-xl border text-center flex flex-col items-center justify-between gap-1.5 transition-all ${
                            isSelected
                              ? "border-[#F2D78A] bg-[#F2D78A]/10 shadow-[0_0_15px_rgba(242,215,138,0.35)] ring-1 ring-[#F2D78A]"
                              : "border-white/10 hover:border-white/30 bg-[#08131B]/60"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#F2D78A] text-[#0B0F14] flex items-center justify-center shadow-sm">
                              <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          <div className={`transition-colors ${isSelected ? "text-[#F2D78A]" : "text-[#CFC5B5]"}`}>
                            {style.iconSvg}
                          </div>
                          <span className={`font-ui text-[11px] leading-tight ${isSelected ? "text-[#FFF8E1] font-semibold" : "text-[#9AA8B0]"}`}>
                            {style.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Response Length (4 Pills) */}
                <div>
                  <label className="block font-ui text-xs text-[#CFC5B5] mb-1 font-medium">
                    Response length
                  </label>
                  <p className="font-ui text-[11px] text-[#9AA8B0] mb-2.5">
                    How detailed do you want responses to be?
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {RESPONSE_LENGTHS.map((len) => {
                      const isSelected = preferences.responseLength === len.id;
                      return (
                        <button
                          key={len.id}
                          type="button"
                          onClick={() => updatePreferences({ responseLength: len.id })}
                          className={`relative h-9 rounded-xl border font-ui text-xs transition-all flex items-center justify-center px-3 ${
                            isSelected
                              ? "border-[#F2D78A] bg-[#F2D78A]/10 text-[#F2D78A] font-semibold shadow-[0_0_12px_rgba(242,215,138,0.3)] ring-1 ring-[#F2D78A]"
                              : "border-white/10 hover:border-white/30 bg-[#08131B]/60 text-[#9AA8B0]"
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-[#F2D78A]" />
                          )}
                          {len.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Topics You Want More Of (3x5 Grid) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-ui text-xs text-[#CFC5B5] font-medium">
                      Topics you want more of
                    </label>
                    <span className="font-ui text-[11px] text-[#9AA8B0]">Select topics to focus on</span>
                  </div>
                  <p className="font-ui text-[11px] text-[#9AA8B0] mb-2.5">
                    EchoSoul will weave these themes into guidance and conversations.
                  </p>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {TOPICS.map((topic) => {
                      const isSelected = preferences.selectedTopics.includes(topic.id);
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => toggleTopic(topic.id)}
                          className={`relative p-2 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                            isSelected
                              ? "border-[#F2D78A] bg-[#F2D78A]/10 shadow-[0_0_12px_rgba(242,215,138,0.3)] ring-1 ring-[#F2D78A]"
                              : "border-white/10 hover:border-white/30 bg-[#08131B]/60"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#F2D78A] text-[#0B0F14] flex items-center justify-center shadow-sm">
                              <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          <span className="text-sm">{topic.icon}</span>
                          <span className={`font-ui text-[10px] leading-tight line-clamp-1 ${
                            isSelected ? "text-[#FFF8E1] font-semibold" : "text-[#9AA8B0]"
                          }`}>
                            {topic.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Inline Custom Topic Input if "Other" is active */}
                  {preferences.selectedTopics.includes("other") && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-[#08131B]/90 border border-[#F2D78A]/40 animate-fadeIn">
                      <label className="block text-[11px] text-[#F2D78A] font-medium mb-1 font-ui">
                        What other topics would you like EchoSoul to focus on?
                      </label>
                      <input
                        type="text"
                        value={customTopicInput}
                        onChange={(e) => {
                          setCustomTopicInput(e.target.value);
                          updatePreferences({ customTopic: e.target.value });
                        }}
                        placeholder="e.g. Astrophysics, Architecture, Creative Non-Fiction..."
                        className="w-full h-8 px-3 input-field-dark text-xs font-ui rounded-lg border border-white/15 bg-[#050B10] text-[#FFF8E1] placeholder-[#9AA8B0]/60 focus:border-[#F2D78A]"
                      />
                    </div>
                  )}
                </div>

                {/* 4. What Would You Like to Avoid? */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-ui text-xs text-[#CFC5B5] font-medium">
                      What would you like to avoid?
                    </label>
                    <span className="font-ui text-[11px] text-[#9AA8B0]">Select any you don&apos;t want to focus on</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {AVOID_TOPICS.map((avoid) => {
                      const isSelected = preferences.avoidedTopics.includes(avoid.id);
                      return (
                        <button
                          key={avoid.id}
                          type="button"
                          onClick={() => toggleAvoided(avoid.id)}
                          className={`h-8 px-3 rounded-xl border font-ui text-xs transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? "border-[#F2D78A] bg-[#F2D78A]/10 text-[#F2D78A] font-semibold shadow-sm ring-1 ring-[#F2D78A]"
                              : "border-white/10 hover:border-white/30 bg-[#08131B]/60 text-[#9AA8B0]"
                          }`}
                        >
                          {isSelected && <span>✓</span>}
                          <span>{avoid.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Inline Custom Avoid Input if "Other" is selected */}
                  {preferences.avoidedTopics.includes("other_avoid") && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-[#08131B]/90 border border-[#F2D78A]/40 animate-fadeIn">
                      <label className="block text-[11px] text-[#F2D78A] font-medium mb-1 font-ui">
                        Specify any custom topic you&apos;d like to avoid:
                      </label>
                      <input
                        type="text"
                        value={customAvoidInput}
                        onChange={(e) => {
                          setCustomAvoidInput(e.target.value);
                          updatePreferences({ customAvoid: e.target.value });
                        }}
                        placeholder="e.g. Work stress, Unsolicited advice..."
                        className="w-full h-8 px-3 input-field-dark text-xs font-ui rounded-lg border border-white/15 bg-[#050B10] text-[#FFF8E1] placeholder-[#9AA8B0]/60 focus:border-[#F2D78A]"
                      />
                    </div>
                  )}
                </div>

                {/* Quote Banner */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#F2D78A]/10 via-[#F2D78A]/5 to-transparent border border-[#F2D78A]/25 text-center">
                  <p className="font-display italic text-xs sm:text-sm text-[#F2D78A]">
                    &ldquo;You get to choose what enters your world.&rdquo;{" "}
                    <span className="font-ui not-italic text-[11px] text-[#CFC5B5]">— EchoSoul</span>
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: Live Reactive Preview & Toggles (5 Cols) */}
              <div className="xl:col-span-5 space-y-5 flex flex-col justify-between">

                {/* Live Reactive Preview Panel */}
                <LiveEchoSoulPreview />

                {/* Additional Preferences Toggles */}
                <div className="space-y-2.5 pt-2 border-t border-white/10">
                  <h3 className="font-ui text-xs font-semibold text-[#FFF8E1]">
                    Additional preferences
                  </h3>

                  <div className="space-y-2 text-xs font-ui text-[#CFC5B5]">
                    {[
                      { key: "musicRecommendations" as const, label: "Include music recommendations", icon: "🎵" },
                      { key: "visualExperiences" as const,    label: "Include visual experiences",   icon: "🎨" },
                      { key: "bookRecommendations" as const,  label: "Suggest books & literary content", icon: "📖" },
                      { key: "journeyTracking" as const,      label: "Help me track my journey",     icon: "🧭" },
                      { key: "gentleReminders" as const,      label: "Gentle check-ins and reminders", icon: "🔔" },
                      { key: "languageSupport" as const,      label: "Multi-language support (e.g. Hindi + English)", icon: "🌐" },
                    ].map((pref) => (
                      <div key={pref.key} className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span>{pref.icon}</span>
                          <span>{pref.label}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => updatePreferences({ [pref.key]: !preferences[pref.key] })}
                          className={`w-9 h-5 rounded-full transition-colors relative flex items-center ${
                            preferences[pref.key] ? "bg-[#F2D78A]" : "bg-white/20"
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full bg-[#0B0F14] transition-transform ${
                              preferences[pref.key] ? "translate-x-4.5" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy Preference Toggle */}
                <div className="p-3 rounded-2xl bg-[#08131B]/80 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🔒</span>
                    <div>
                      <div className="font-ui text-xs font-medium text-[#FFF8E1]">
                        Keep my data private (recommended)
                      </div>
                      <div className="font-ui text-[10px] text-[#9AA8B0]">
                        Your conversations and preferences remain private.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updatePreferences({ privacyPreference: !preferences.privacyPreference })}
                    className={`w-9 h-5 rounded-full transition-colors relative flex items-center shrink-0 ${
                      preferences.privacyPreference ? "bg-[#F2D78A]" : "bg-white/20"
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full bg-[#0B0F14] transition-transform ${
                        preferences.privacyPreference ? "translate-x-4.5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Link
                    href="/onboarding/world"
                    className="h-11 px-6 rounded-xl border border-white/20 hover:border-[#F2D78A] text-[#FFF8E1] hover:text-[#F2D78A] text-xs sm:text-sm font-ui font-medium flex items-center justify-center transition-colors"
                  >
                    ← Back
                  </Link>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 h-11 rounded-xl btn-gold-primary text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Next → Step 5: Appearance"}
                  </button>
                </div>

                {feedbackMessage && (
                  <p className="text-xs font-ui text-[#F2D78A] text-center">{feedbackMessage}</p>
                )}
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
