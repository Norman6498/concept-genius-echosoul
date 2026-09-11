"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { createClient } from "@/lib/supabase/client";

interface InterestItem {
  id: string;
  label: string;
  iconImage: string;
}

interface InterestCategory {
  id: "subjects" | "creative" | "wellness" | "entertainment";
  title: string;
  items: InterestItem[];
}

const CATEGORIES: InterestCategory[] = [
  {
    id: "subjects",
    title: "Subjects & Learning",
    items: [
      { id: "science",      label: "Science",      iconImage: "/interests/subjects_science.jpg" },
      { id: "technology",   label: "Technology",   iconImage: "/interests/subjects_technology.jpg" },
      { id: "mathematics",  label: "Mathematics",  iconImage: "/interests/subjects_mathematics.jpg" },
      { id: "biology",      label: "Biology",      iconImage: "/interests/subjects_biology.jpg" },
      { id: "history",      label: "History",      iconImage: "/interests/subjects_history.jpg" },
      { id: "psychology",   label: "Psychology",   iconImage: "/interests/subjects_psychology.jpg" },
      { id: "philosophy",   label: "Philosophy",   iconImage: "/interests/subjects_philosophy.jpg" },
      { id: "literature",   label: "Literature",   iconImage: "/interests/subjects_literature.jpg" },
      { id: "art",          label: "Art",          iconImage: "/interests/subjects_art.jpg" },
      { id: "other_sub",    label: "Other",        iconImage: "/interests/subjects_other.jpg" },
    ],
  },
  {
    id: "creative",
    title: "Creative Interests",
    items: [
      { id: "writing",          label: "Writing",          iconImage: "/interests/creative_writing.jpg" },
      { id: "music",            label: "Music",            iconImage: "/interests/creative_music.jpg" },
      { id: "drawing_art",      label: "Drawing / Art",    iconImage: "/interests/creative_drawing_art.jpg" },
      { id: "photography",      label: "Photography",      iconImage: "/interests/creative_photography.jpg" },
      { id: "video_animation",  label: "Video / Animation",iconImage: "/interests/creative_video_animation.jpg" },
      { id: "storytelling",     label: "Storytelling",     iconImage: "/interests/creative_storytelling.jpg" },
      { id: "design",           label: "Design",           iconImage: "/interests/creative_design.jpg" },
      { id: "gaming",           label: "Gaming",           iconImage: "/interests/creative_gaming.jpg" },
      { id: "other_creat",      label: "Other",            iconImage: "/interests/creative_other.jpg" },
    ],
  },
  {
    id: "wellness",
    title: "Wellness & Life",
    items: [
      { id: "mental_health",    label: "Mental Health",    iconImage: "/interests/wellness_mental_health.jpg" },
      { id: "fitness",          label: "Fitness",          iconImage: "/interests/wellness_fitness.jpg" },
      { id: "productivity",     label: "Productivity",     iconImage: "/interests/wellness_productivity.jpg" },
      { id: "career_guidance",  label: "Career Guidance",  iconImage: "/interests/wellness_career_guidance.jpg" },
      { id: "relationships",    label: "Relationships",    iconImage: "/interests/wellness_relationships.jpg" },
      { id: "spirituality",     label: "Spirituality",     iconImage: "/interests/wellness_spirituality.jpg" },
      { id: "nature",           label: "Nature",           iconImage: "/interests/wellness_nature.jpg" },
      { id: "travel",           label: "Travel",           iconImage: "/interests/wellness_travel.jpg" },
      { id: "self_improvement", label: "Self-improvement",iconImage: "/interests/wellness_self_improvement.jpg" },
      { id: "other_well",       label: "Other",            iconImage: "/interests/wellness_other.jpg" },
    ],
  },
  {
    id: "entertainment",
    title: "Entertainment",
    items: [
      { id: "anime",        label: "Anime",        iconImage: "/interests/entertainment_anime.jpg" },
      { id: "movies",       label: "Movies",       iconImage: "/interests/entertainment_movies.jpg" },
      { id: "books",        label: "Books",        iconImage: "/interests/entertainment_books.jpg" },
      { id: "poetry",       label: "Poetry",       iconImage: "/interests/entertainment_poetry.jpg" },
      { id: "podcasts",     label: "Podcasts",     iconImage: "/interests/entertainment_podcasts.jpg" },
      { id: "web_series",   label: "Web Series",   iconImage: "/interests/entertainment_web_series.jpg" },
      { id: "music_ent",    label: "Music",        iconImage: "/interests/entertainment_music.jpg" },
      { id: "games",        label: "Games",        iconImage: "/interests/entertainment_games.jpg" },
      { id: "manga",        label: "Manga",        iconImage: "/interests/entertainment_manga.jpg" },
      { id: "other_ent",    label: "Other",        iconImage: "/interests/entertainment_other.jpg" },
    ],
  },
];

const VIBES = [
  "Curious",
  "Creative",
  "Analytical",
  "Adventurous",
  "Calm",
  "Focused",
  "Dreamer",
  "Other",
];

const ONBOARDING_STEPS = [
  { number: 1, label: "About You",   href: "/onboarding" },
  { number: 2, label: "Interests",   href: "/onboarding/interests" },
  { number: 3, label: "Your World",  href: "/onboarding/world" },
  { number: 4, label: "Preferences", href: "/onboarding/preferences" },
  { number: 5, label: "Appearance",  href: "/onboarding/appearance" },
  { number: 6, label: "Complete",    href: "/onboarding/complete" },
];

export function OnboardingStep2() {
  // Preselected defaults matching reference UI: Literature, Music, Books, and Vibe: Creative
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "literature",
    "music",
    "books",
  ]);
  const [customInterest, setCustomInterest] = useState("");
  const [selectedVibe, setSelectedVibe] = useState("Creative");

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Restore existing saved interests from localStorage or Supabase session
  useEffect(() => {
    try {
      const savedLocal = localStorage.getItem("echosoul_user_interests");
      if (savedLocal) {
        const parsed = JSON.parse(savedLocal);
        if (Array.isArray(parsed.interests)) setSelectedInterests(parsed.interests);
        if (parsed.vibe) setSelectedVibe(parsed.vibe);
        if (parsed.custom) setCustomInterest(parsed.custom);
      }
    } catch {
      // Fallback to defaults
    }
  }, []);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedbackMessage(null);

    // Build structured payload
    const interestItems = selectedInterests.map((interestId) => {
      // Find category
      let category = "subjects";
      for (const cat of CATEGORIES) {
        if (cat.items.some((i) => i.id === interestId)) {
          category = cat.id;
          break;
        }
      }
      return { category, interest: interestId };
    });

    if (customInterest.trim()) {
      interestItems.push({ category: "custom", interest: customInterest.trim() });
    }

    const payload = {
      interests: interestItems,
      customInterests: customInterest,
      overallVibe: selectedVibe,
      step: 2,
    };

    // Save locally
    try {
      localStorage.setItem(
        "echosoul_user_interests",
        JSON.stringify({
          interests: selectedInterests,
          vibe: selectedVibe,
          custom: customInterest,
        })
      );
    } catch {
      // LocalStorage access
    }

    // Persist via Supabase API
    try {
      await fetch("/api/personalization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Network fallback
    }

    setIsSaving(false);
    setSaveSuccess(true);
    setFeedbackMessage("Your interests have been saved to your EchoSoul profile.");

    // Advance to Step 3 (Your World)
    setTimeout(() => {
      window.location.href = "/onboarding/world";
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0B0F14] text-[#FFF8E1] flex flex-col justify-between overflow-x-hidden select-none">
      {/* ── Top Header & 6-Step Stepper Bar ─────────────────────────────── */}
      <header className="relative z-30 w-full max-w-[1536px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        <BrandLogo size="md" />

        {/* 6-step progress stepper */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {ONBOARDING_STEPS.map((step, idx) => {
            const isActive = step.number === 2;
            const isCompleted = step.number < 2;
            const isLast = idx === ONBOARDING_STEPS.length - 1;

            return (
              <React.Fragment key={step.number}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#F2D78A] text-[#0B0F14] shadow-[0_0_12px_rgba(242,215,138,0.6)]"
                        : isCompleted
                        ? "border border-[#F2D78A]/60 bg-[#F2D78A]/15 text-[#F2D78A]"
                        : "border border-white/25 text-[#9AA8B0] bg-[#0C1B25]/60"
                    }`}
                  >
                    {isCompleted ? "✓" : step.number}
                  </div>
                  <span
                    className={`font-ui text-xs tracking-wide ${
                      isActive ? "text-[#F2D78A] font-semibold" : "text-[#9AA8B0]"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {!isLast && <div className="w-6 lg:w-9 h-px bg-white/15 mx-1" />}
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

      {/* ── Main Two-Column Layout ────────────────────────────────────── */}
      <main className="relative z-20 w-full max-w-[1536px] mx-auto px-6 sm:px-10 py-2 flex-1 flex flex-col justify-between">
        <form onSubmit={handleNext} className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* ── Left Column: Scenic Night Window Panel ──────────────────── */}
            <div className="lg:col-span-4 xl:col-span-3 relative rounded-3xl overflow-hidden border border-[#F2D78A]/20 shadow-2xl min-h-[580px] lg:min-h-[720px] bg-[#050B10]">
              <Image
                src="/page4_left_panel.jpg"
                alt="Different interests. A deeper you. Tell us what you love, and we'll bring a more meaningful world to you."
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 360px"
                className="object-cover object-top"
              />
              <span className="sr-only">
                Different interests. A deeper you. Tell us what you love, and we will bring a more meaningful world to you. Real People, Real Stories, A Brighter You.
              </span>
            </div>

            {/* ── Right Column: 4 Interest Grids & Preferences ────────────── */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-5 rounded-3xl border border-white/10 bg-[#0C1B25]/60 backdrop-blur-xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <h1 className="font-editorial text-2xl sm:text-3xl text-[#FFF8E1] font-medium">
                    2. Your interests
                  </h1>
                  <p className="font-ui text-xs text-[#9AA8B0] mt-1 max-w-[560px]">
                    Select what you&apos;re interested in. This helps EchoSoul bring you
                    better conversations, recommendations, and experiences.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-script text-xl sm:text-2xl text-[#F2D78A]">
                    Your interests open new worlds.
                  </span>
                  <div className="hidden sm:block w-8 h-px bg-[#F2D78A]/40" />
                </div>
              </div>

              {/* ── 4 Interest Categories ──────────────────────────────────── */}
              <div className="space-y-4">
                {CATEGORIES.map((category) => (
                  <div key={category.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-ui text-xs font-semibold text-[#FFF8E1] tracking-wide">
                        {category.title}
                      </h3>
                      <span className="font-ui text-[11px] text-[#9AA8B0] flex items-center gap-1">
                        Select multiple <span className="text-[#F2D78A] font-bold">(+)</span>
                      </span>
                    </div>

                    {/* Scrollable / Responsive horizontal card grid */}
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
                      {category.items.map((item) => {
                        const isSelected = selectedInterests.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleInterest(item.id)}
                            className={`relative rounded-xl border p-1 text-center transition-all duration-200 flex flex-col items-center justify-between group ${
                              isSelected
                                ? "border-[#F2D78A] bg-[#F2D78A]/10 shadow-[0_0_15px_rgba(242,215,138,0.35)] ring-1 ring-[#F2D78A]"
                                : "border-white/10 hover:border-white/30 bg-[#08131B]/70"
                            }`}
                          >
                            {/* Checkmark badge when selected */}
                            {isSelected && (
                              <div className="absolute top-1 right-1 z-10 w-3.5 h-3.5 rounded-full bg-[#F2D78A] text-[#0B0F14] flex items-center justify-center shadow-sm">
                                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}

                            {/* Thumbnail Icon Artwork */}
                            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden mb-1 bg-[#08131B] flex items-center justify-center">
                              <Image
                                src={item.iconImage}
                                alt={item.label}
                                fill
                                sizes="40px"
                                className="object-cover transition-transform group-hover:scale-105 duration-200"
                              />
                            </div>

                            {/* Label */}
                            <span
                              className={`font-ui text-[10px] leading-tight px-0.5 line-clamp-1 ${
                                isSelected ? "text-[#FFF8E1] font-semibold" : "text-[#9AA8B0] group-hover:text-[#CFC5B5]"
                              }`}
                            >
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Additional Inputs: Custom Interests & Overall Vibe ──────── */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-white/10 items-end">
                {/* Custom Interest Input */}
                <div className="md:col-span-6 space-y-1.5">
                  <label className="block font-ui text-xs font-medium text-[#CFC5B5]">
                    Any other interests you&apos;d like to add?
                  </label>
                  <input
                    type="text"
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    placeholder="Type here..."
                    className="w-full h-10 px-4 rounded-xl border border-white/15 bg-[#08131B]/70 font-ui text-xs text-[#FFF8E1] placeholder-[#9AA8B0] focus:outline-none focus:border-[#F2D78A] transition-colors"
                  />
                </div>

                {/* Overall Vibe Selector */}
                <div className="md:col-span-6 space-y-1.5">
                  <label className="block font-ui text-xs font-medium text-[#CFC5B5]">
                    How would you describe your overall vibe? (Optional)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {VIBES.map((vibe) => {
                      const isSelected = selectedVibe === vibe;
                      return (
                        <button
                          key={vibe}
                          type="button"
                          onClick={() => setSelectedVibe(vibe)}
                          className={`h-7 px-3 rounded-full font-ui text-[11px] transition-all duration-200 ${
                            isSelected
                              ? "bg-[#FFF8E1] text-[#0B0F14] font-semibold shadow-[0_0_10px_rgba(255,248,225,0.4)]"
                              : "border border-white/15 bg-[#08131B]/60 text-[#CFC5B5] hover:text-[#FFF8E1] hover:border-white/30"
                          }`}
                        >
                          {vibe}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── Actions & Joseph Campbell Quote ────────────────────────── */}
              <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Back Button */}
                <Link
                  href="/onboarding"
                  className="h-10 px-6 rounded-full border border-white/20 hover:border-white/40 bg-[#08131B]/60 text-[#CFC5B5] hover:text-[#FFF8E1] font-ui text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <span>←</span>
                  <span>Back</span>
                </Link>

                {/* Joseph Campbell Quote */}
                <div className="text-center px-2">
                  <p className="font-editorial italic text-xs sm:text-sm text-[#F2D78A] leading-tight">
                    &ldquo;The more you explore, the more you find yourself.&rdquo;
                  </p>
                  <span className="block font-ui text-[10px] text-[#9AA8B0] mt-0.5">
                    — Joseph Campbell
                  </span>
                </div>

                {/* Next Button */}
                <div className="flex flex-col items-center md:items-end w-full md:w-auto">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full md:w-auto h-11 px-8 rounded-full font-ui text-xs sm:text-sm font-semibold bg-[#F2D78A] hover:bg-[#FFB86B] text-[#0B0F14] transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(242,215,138,0.4)] hover:shadow-[0_0_30px_rgba(242,215,138,0.6)] disabled:opacity-60"
                  >
                    {isSaving ? (
                      <span>Saving preferences...</span>
                    ) : saveSuccess ? (
                      <span>Saved! Entering EchoSoul →</span>
                    ) : (
                      <>
                        <span>Next</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                  <span className="font-ui text-[10px] text-[#9AA8B0] mt-1 text-center md:text-right">
                    Step 3: Your World
                  </span>
                  {feedbackMessage && (
                    <span className="font-ui text-[10px] text-[#8DBA8F] mt-0.5">
                      {feedbackMessage}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* ── Global Footer ──────────────────────────────────────────────── */}
      <footer className="relative z-30 w-full border-t border-[#F2D78A]/15 bg-[#08131B]/90 backdrop-blur-md py-4 mt-6">
        <div className="max-w-[1536px] mx-auto px-6 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-ui text-[#CFC5B5]">
          <div className="flex items-center gap-6">
            <BrandLogo size="sm" />
            <nav className="hidden sm:flex items-center gap-5 text-[#9AA8B0]" aria-label="Footer navigation">
              <Link href="/" className="hover:text-[#F2D78A] transition-colors">How it works</Link>
              <Link href="/about" className="hover:text-[#F2D78A] transition-colors">Experiences</Link>
              <Link href="/about" className="hover:text-[#F2D78A] transition-colors">Safety</Link>
              <Link href="/#pricing" className="hover:text-[#F2D78A] transition-colors">Pricing</Link>
              <Link href="/#stories" className="hover:text-[#F2D78A] transition-colors">Blog</Link>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 text-[#9AA8B0]">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-[#F2D78A] transition-colors">
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
