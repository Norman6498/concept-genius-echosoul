"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { createClient } from "@/lib/supabase/client";

interface UserPersonalization {
  userName: string;
  role: string;
  currentMood: string;
  currentFocus: string;
  overallVibe: string;
  visualWorld: string;
  theme: string;
  accentColor: string;
  interests: string[];
}

const SHAYARI_LIBRARY = [
  {
    quote: "Even the darkest nights end with a brighter dawn.",
    author: "Rumi",
    meaning: "This means that no matter how difficult your current situation is, it will eventually get better.",
    whyItMatters: "You've been through a lot recently. This is a reminder that this phase is not the end, but a part of your growth.",
    category: "calm",
  },
  {
    quote: "Hazaaron khwahishen aisi ke har khwahish pe dam nikle...",
    author: "Mirza Ghalib",
    meaning: "Thousands of desires, each so profound that life itself feels consumed by the yearning.",
    whyItMatters: "Your creative mind holds countless aspirations. Do not rush them; each curiosity is shaping the depth of who you are.",
    category: "creative",
  },
  {
    quote: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marcus Aurelius",
    meaning: "Every obstacle you encounter is not a dead end, but the very catalyst that trains your strength.",
    whyItMatters: "The resistance you feel today is quietly teaching you the resilience you will rely on tomorrow.",
    category: "career",
  },
  {
    quote: "Let everything happen to you: beauty and terror. Just keep going. No feeling is final.",
    author: "Rainer Maria Rilke",
    meaning: "Allow all waves of emotion to wash through without judgment. Emotions are transient; your core is lasting.",
    whyItMatters: "When overwhelm knocks, take a step back. Nothing you are experiencing right now is permanent.",
    category: "wellness",
  },
  {
    quote: "Sitaron se aage jahan aur bhi hain, abhi ishq ke imtihan aur bhi hain.",
    author: "Allama Iqbal",
    meaning: "There are worlds beyond the stars yet to explore; your potential is boundless and your journey has just begun.",
    whyItMatters: "When current horizons feel small or restrictive, remember your inner capacity to expand beyond current boundaries.",
    category: "studies",
  },
];

const QUICK_PROMPTS = [
  { label: "I'm feeling stressed", query: "I'm feeling overwhelmed and stressed today, help me find calm.", icon: "🎯" },
  { label: "Help me focus", query: "I have tasks to do but my mind is wandering, help me focus.", icon: "🎯" },
  { label: "Suggest a book", query: "Can you recommend a thoughtful book based on my journey?", icon: "📖" },
  { label: "Give me a visualization", query: "Guide me through a brief peaceful nature visualization.", icon: "🎨" },
  { label: "I need guidance", query: "I need some gentle perspective on where to direct my energy today.", icon: "🧭" },
];

export function AuthenticatedHome() {
  const [profile, setProfile] = useState<UserPersonalization>({
    userName: "Pratik",
    role: "Explorer",
    currentMood: "calm",
    currentFocus: "studies",
    overallVibe: "Creative",
    visualWorld: "mountain_calm",
    theme: "midnight_soul",
    accentColor: "#F2D78A",
    interests: ["Literature", "Philosophy", "Music"],
  });

  const [activeMood, setActiveMood] = useState("Calm");
  const [moodSaved, setMoodSaved] = useState(false);
  const [thoughtIndex, setThoughtIndex] = useState(0);

  // Talk Interactive State with Paper Writing Words Animation
  const [talkInput, setTalkInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [paperOutput, setPaperOutput] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load Saved Personalization from Supabase & LocalStorage
  useEffect(() => {
    try {
      const p1 = localStorage.getItem("echosoul_user_personalization");
      const p2 = localStorage.getItem("echosoul_user_interests");
      const p3 = localStorage.getItem("echosoul_user_world");
      const p5 = localStorage.getItem("echosoul_user_appearance");

      let name = "Pratik";
      let role = "Explorer";
      let mood = "calm";
      let focus = "studies";

      if (p1) {
        const parsed = JSON.parse(p1);
        if (parsed.name) name = parsed.name;
        if (parsed.role) role = parsed.role;
        if (parsed.currentMood) mood = parsed.currentMood;
        if (parsed.currentFocus) focus = parsed.currentFocus;
      }

      let vibe = "Creative";
      let interests = ["Literature", "Philosophy", "Music"];
      if (p2) {
        try {
          const parsed = JSON.parse(p2);
          if (parsed.vibe) vibe = parsed.vibe;
          if (Array.isArray(parsed.interests) && parsed.interests.length > 0) {
            interests = parsed.interests;
          }
        } catch {
          // Ignore
        }
      }

      let visualWorld = "mountain_calm";
      if (p3) {
        try {
          const parsed = JSON.parse(p3);
          if (parsed.visualWorld) visualWorld = parsed.visualWorld;
        } catch {
          // Ignore
        }
      }

      let theme = "midnight_soul";
      let accentColor = "#F2D78A";
      if (p5) {
        try {
          const parsed = JSON.parse(p5);
          if (parsed.theme) theme = parsed.theme;
          if (parsed.accentColor) accentColor = parsed.accentColor;
        } catch {
          // Ignore
        }
      }

      setProfile({
        userName: name,
        role,
        currentMood: mood,
        currentFocus: focus,
        overallVibe: vibe,
        visualWorld,
        theme,
        accentColor,
        interests,
      });

      // Match thought index to focus if possible
      if (focus === "creative") setThoughtIndex(1);
      else if (focus === "career") setThoughtIndex(2);
      else if (focus === "wellness") setThoughtIndex(3);
      else if (focus === "studies") setThoughtIndex(0);
    } catch {
      // Fallback defaults
    }
  }, []);

  // Paper writing letter-by-letter animation effect
  const triggerPaperWriting = (fullResponse: string) => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setIsListening(false);
    setIsWriting(true);
    setPaperOutput(fullResponse);
    setDisplayedText("");

    let charIdx = 0;
    typingTimerRef.current = setInterval(() => {
      charIdx++;
      setDisplayedText(fullResponse.slice(0, charIdx));
      if (charIdx >= fullResponse.length) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setIsWriting(false);
      }
    }, 20);
  };

  const handleSendTalk = (customQuery?: string) => {
    const query = customQuery || talkInput;
    if (!query.trim()) return;

    setTalkInput("");
    setIsListening(true);
    setPaperOutput(null);

    // Simulate thoughtful listening and letter-by-letter handwritten paper output
    setTimeout(() => {
      let response = "";
      const lower = query.toLowerCase();

      if (lower.includes("stress") || lower.includes("overwhelm")) {
        response = `Take a slow, deep breath, ${profile.userName}. Right now, in this moment, you are safe. Close your eyes for three seconds and let your shoulders drop. Whatever is demanding your urgency can pause. We will take it one gentle breath at a time.`;
      } else if (lower.includes("focus") || lower.includes("concentrate")) {
        response = `Let's clear the horizon, ${profile.userName}. Pick just one single task for the next 25 minutes. Silence notifications, set aside secondary worries, and give yourself the quiet gift of doing one thing with full devotion.`;
      } else if (lower.includes("book") || lower.includes("read")) {
        response = `Based on your love for ${profile.interests.slice(0, 2).join(" and ") || "reflection"}, I recommend 'Atomic Habits' by James Clear and 'The Prophet' by Kahlil Gibran. Both will offer you grounding anchors of perspective.`;
      } else if (lower.includes("visual") || lower.includes("calm")) {
        response = `Picture an early morning alpine lake. The surface is glassy and still, mirroring the snow-capped peaks in the dawn light. The air is crisp, carrying the scent of pine. You are standing on the shore, unhurried, whole, and at peace.`;
      } else {
        response = `I hear you clearly, ${profile.userName}. Sometimes just speaking our unspoken thoughts aloud begins to unravel their weight. Whatever direction today takes, remember that your worth is not measured by relentless output, but by the kindness you offer yourself along the way.`;
      }

      triggerPaperWriting(response);
    }, 600);
  };

  const handleSaveMood = async (mood: string) => {
    setActiveMood(mood);
    setMoodSaved(true);
    setTimeout(() => setMoodSaved(false), 2500);

    try {
      const p = localStorage.getItem("echosoul_user_personalization");
      if (p) {
        const parsed = JSON.parse(p);
        parsed.currentMood = mood.toLowerCase();
        localStorage.setItem("echosoul_user_personalization", JSON.stringify(parsed));
      }
      await fetch("/api/personalization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentMood: mood.toLowerCase() }),
      });
    } catch {
      // Local fallback
    }
  };

  const currentThought = SHAYARI_LIBRARY[thoughtIndex];

  // Dynamic recommendation based on user onboarding data
  const getDynamicBook = () => {
    const hasPhil = profile.interests.some((i) => i.toLowerCase().includes("philosophy"));
    const hasLit = profile.interests.some((i) => i.toLowerCase().includes("literature") || i.toLowerCase().includes("poetry"));
    const isWellness = profile.currentFocus === "wellness" || profile.currentMood === "anxious";
    const isCareer = profile.currentFocus === "career";

    if (hasPhil) {
      return {
        title: "Meditations",
        author: "Marcus Aurelius",
        coverImage: "/home/book_atomic_habits.jpg",
        reason: "Because you seek timeless stoic wisdom and clarity.",
      };
    }
    if (hasLit) {
      return {
        title: "The Prophet",
        author: "Kahlil Gibran",
        coverImage: "/home/book_atomic_habits.jpg",
        reason: "Because you appreciate soulful poetic reflection.",
      };
    }
    if (isWellness) {
      return {
        title: "The Power of Now",
        author: "Eckhart Tolle",
        coverImage: "/home/book_atomic_habits.jpg",
        reason: "Because you value presence and inner calm.",
      };
    }
    if (isCareer) {
      return {
        title: "Essentialism",
        author: "Greg McKeown",
        coverImage: "/home/book_atomic_habits.jpg",
        reason: "Because you're focusing on what truly matters.",
      };
    }
    // Default studies / productivity
    return {
      title: "Atomic Habits",
      author: "James Clear",
      coverImage: "/home/book_atomic_habits.jpg",
      reason: "Because you asked about building better routines.",
    };
  };

  const userBook = getDynamicBook();

  // Visual World Scenery Image
  const getVisualWorldInfo = () => {
    switch (profile.visualWorld) {
      case "ocean_breeze":
        return {
          title: "Ocean Breeze",
          desc: "Crisp waves and peaceful morning horizon.",
          image: "/visual-worlds/ocean_breeze.jpg",
        };
      case "forest_retreat":
        return {
          title: "Forest Retreat",
          desc: "Sunlit canopies and grounding woodland stillness.",
          image: "/visual-worlds/forest_retreat.jpg",
        };
      case "starry_skies":
        return {
          title: "Starry Skies",
          desc: "Infinite cosmos and peaceful starry night.",
          image: "/visual-worlds/starry_skies.jpg",
        };
      case "cozy_room":
        return {
          title: "Cozy Room",
          desc: "Warm hearth and rain softly tapping against glass.",
          image: "/visual-worlds/cozy_room.jpg",
        };
      case "city_lights":
        return {
          title: "City Lights",
          desc: "Luminous skyline glowing in evening stillness.",
          image: "/visual-worlds/city_lights.jpg",
        };
      default:
        return {
          title: "Mountain Calm",
          desc: "A peaceful space to breathe and reset.",
          image: "/visual-worlds/mountain_calm.jpg",
        };
    }
  };

  const visualWorldInfo = getVisualWorldInfo();

  // Dynamic guidance recommendation
  const getDynamicGuidance = () => {
    if (profile.currentMood === "anxious" || profile.currentMood === "tired") {
      return {
        title: "Overcoming Overthinking",
        desc: "Practical steps based on our recent chats.",
      };
    }
    if (profile.currentFocus === "studies") {
      return {
        title: "Sustaining Gentle Focus",
        desc: "Balancing high ambition with daily mental peace.",
      };
    }
    if (profile.currentFocus === "career") {
      return {
        title: "Navigating Career Crossroads",
        desc: "Grounding truths when stepping into the unknown.",
      };
    }
    if (profile.currentFocus === "creative") {
      return {
        title: "Unlocking Creative Flow",
        desc: "Expressing freely without fear of imperfection.",
      };
    }
    return {
      title: "Overcoming Overthinking",
      desc: "Practical steps based on our recent chats.",
    };
  };

  const userGuidance = getDynamicGuidance();

  // Date formatting
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative min-h-screen bg-[#070D12] text-[#FFF8E1] flex flex-col justify-between overflow-x-hidden select-none">
      
      {/* ── Top Header Navigation Bar ────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#070D12]/95 backdrop-blur-md border-b border-white/10 h-16">
        <div className="w-full max-w-[1740px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
          
          {/* Brand Wordmark & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <BrandLogo size="sm" />
          </div>

          {/* Center Search Input */}
          <div className="flex-1 max-w-xl mx-auto relative hidden md:block">
            <svg
              className="w-4 h-4 text-[#9AA8B0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search anything... (books, feelings, music, questions)"
              className="w-full h-9 pl-10 pr-4 rounded-full bg-[#0C1B25] border border-white/10 text-xs text-[#FFF8E1] placeholder-[#9AA8B0]/60 focus:outline-none focus:border-[#F2D78A]/60 transition-colors"
            />
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Sun / Moon Theme Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-[#0C1B25] border border-white/10">
              <button
                type="button"
                className="w-6 h-6 rounded-full flex items-center justify-center text-[#F2D78A] hover:bg-white/5 transition-colors"
                title="Theme Settings"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="4" strokeWidth="2" />
                  <path strokeLinecap="round" strokeWidth="2" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              </button>
            </div>

            {/* Notification Bell with Badge */}
            <button
              type="button"
              className="relative p-2 rounded-full hover:bg-white/5 text-[#CFC5B5] transition-colors focus:outline-none"
              aria-label="Notifications"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E57373]" />
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#F2D78A] text-[#0B0F14] font-bold text-xs flex items-center justify-center shadow-md">
                <Image
                  src="/home/user_avatar.jpg"
                  alt={profile.userName}
                  fill
                  sizes="32px"
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to initial
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <span>{profile.userName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-ui text-xs font-semibold text-[#FFF8E1]">
                  {profile.userName}
                </span>
                <span className="text-[10px] text-[#F2D78A] mt-0.5">Keep going</span>
              </div>
              <svg className="w-3.5 h-3.5 text-[#9AA8B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Layout: 3 Columns (Left Sidebar + Center Realm + Right Column) ── */}
      <div className="w-full max-w-[1740px] mx-auto px-3 sm:px-6 lg:px-8 py-4 flex-1 flex gap-4 xl:gap-5">
        
        {/* ── 1. LEFT SIDEBAR NAVIGATION ────────────────────────────────── */}
        <aside className="hidden xl:flex w-56 shrink-0 flex-col justify-between py-2 space-y-6">
          <div className="space-y-1">
            <Link
              href="/app"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#F2D78A]/15 text-[#F2D78A] font-semibold text-xs border-l-2 border-[#F2D78A] shadow-sm transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span>Home</span>
            </Link>

            {[
              { label: "Talk", icon: "💬", href: "/app/talk" },
              { label: "Words", icon: "📜", href: "/app/words" },
              { label: "Music", icon: "🎵", href: "/app/music" },
              { label: "Visuals", icon: "🤍", href: "/app/visuals" },
              { label: "Journey", icon: "🧭", href: "/app/journey" },
              { label: "Journal", icon: "📓", href: "/app/journal" },
              { label: "Guidance", icon: "🍃", href: "/app/guidance" },
              { label: "Moments", icon: "✨", href: "/app/moments" },
              { label: "Community", icon: "👥", href: "#", badge: "Soon" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-ui text-[#CFC5B5] hover:text-[#FFF8E1] hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm opacity-80 group-hover:opacity-100">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-[#F2D78A]/20 text-[#F2D78A]">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            <div className="pt-2 my-2 border-t border-white/10" />

            <Link
              href="/app/profile"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-ui text-[#CFC5B5] hover:text-[#FFF8E1] hover:bg-white/5 transition-all"
            >
              <span className="text-sm">👤</span>
              <span>Profile</span>
            </Link>
            <Link
              href="/app/settings"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-ui text-[#CFC5B5] hover:text-[#FFF8E1] hover:bg-white/5 transition-all"
            >
              <span className="text-sm">⚙️</span>
              <span>Settings</span>
            </Link>
          </div>

          {/* Bottom Card: Display Personalization */}
          <div className="p-3.5 rounded-2xl bg-[#0C1B25]/80 border border-white/10 space-y-2.5 text-[11px] font-ui">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#FFF8E1]">Display Personalization</span>
              <span className="w-6 h-3.5 rounded-full bg-[#F2D78A] flex items-center justify-end px-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0B0F14]" />
              </span>
            </div>
            <p className="text-[#9AA8B0] text-[10px] leading-tight">
              Show or hide personal data, history and recommendations from Home.
            </p>
            <div className="space-y-1.5 pt-1 text-[#CFC5B5] text-[10px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-[#F2D78A]" />
                <span>Show my recent conversations</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-[#F2D78A]" />
                <span>Show my personalized recommendations</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-[#F2D78A]" />
                <span>Show my moments &amp; journey</span>
              </label>
            </div>
            <div className="pt-1">
              <span className="text-[10px] text-[#F2D78A] hover:underline cursor-pointer">
                Manage what&apos;s shown →
              </span>
            </div>
          </div>

          {/* Decorative Sidebar Quote with Lantern accent */}
          <div className="pt-2 text-center text-[10px] font-display italic text-[#F2D78A]/85 border-t border-white/5">
            &ldquo;A brighter tomorrow begins with a kinder you.&rdquo;
          </div>
        </aside>

        {/* ── 2. CENTER & MAIN DASHBOARD AREA ───────────────────────────── */}
        <main className="flex-1 space-y-5 min-w-0">
          
          {/* Top Hero Banner with Mountain Lake Landscape & Deckled Parchment Card ── */}
          <div className="relative rounded-3xl overflow-hidden border border-[#F2D78A]/20 shadow-[0_20px_50px_rgba(0,0,0,0.85)] min-h-[380px] p-5 sm:p-7 bg-[#09141D] flex flex-col justify-between">
            {/* Background Photography */}
            <Image
              src={visualWorldInfo.image}
              alt="Sanctuary Landscape"
              fill
              priority
              loading="eager"
              sizes="(max-width: 1440px) 100vw, 1080px"
              className="object-cover object-center opacity-70 pointer-events-none"
            />
            {/* Subtle Gradient Overlays for perfect legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#070D12]/95 via-[#070D12]/75 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070D12] via-transparent to-black/30 pointer-events-none" />

            {/* Inner Content Grid: Left side text/talk + Right side Deckled Parchment Card */}
            <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-6">
              
              {/* Left Column of Hero: Greetings, Date, Quote, Talk Bar */}
              <div className="flex-1 max-w-xl space-y-4">
                <div className="space-y-1">
                  <span suppressHydrationWarning className="font-ui text-[11px] text-[#9AA8B0] tracking-wider uppercase">
                    {formattedDate}
                  </span>
                  <h1 className="font-editorial text-2xl sm:text-4xl text-[#FFF8E1] font-normal tracking-tight">
                    Good evening, {profile.userName} <span className="text-[#F2D78A]">✨</span>
                  </h1>
                  <p className="font-ui text-xs sm:text-sm text-[#CFC5B5] font-light">
                    A calmer mind creates a stronger you.
                  </p>
                </div>

                {/* Scenic Floating Quote over the mountain landscape */}
                <div className="pt-2">
                  <p className="font-display italic text-xs sm:text-sm text-[#F2D78A]/95 leading-snug">
                    &ldquo;The right words find you at exactly the right time.&rdquo;
                  </p>
                  <span className="font-ui text-[10px] text-[#9AA8B0] block mt-0.5">— EchoSoul</span>
                </div>

                {/* Talk to EchoSoul Input Pill */}
                <div className="pt-2 space-y-2.5">
                  <div className="relative flex items-center rounded-full bg-[#070D12]/90 border border-[#F2D78A]/45 backdrop-blur-xl p-1 shadow-2xl focus-within:ring-2 focus-within:ring-[#F2D78A]/50">
                    <div className="pl-3.5 pr-2 text-[#F2D78A]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={talkInput}
                      onChange={(e) => setTalkInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSendTalk();
                        }
                      }}
                      placeholder="Talk to EchoSoul..."
                      className="w-full h-10 bg-transparent text-xs sm:text-sm text-[#FFF8E1] placeholder-[#9AA8B0]/70 focus:outline-none pr-2"
                    />

                    {/* Soundwave animation & Gold Action button */}
                    <div className="flex items-center gap-2 pr-1">
                      {isListening ? (
                        <div className="flex items-center gap-1 px-2 text-[#F2D78A] text-xs font-mono animate-pulse">
                          <span>Listening...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-0.5 px-2">
                          <span className="w-0.5 h-3 bg-[#F2D78A]/70 rounded-full animate-pulse" />
                          <span className="w-0.5 h-4 bg-[#F2D78A] rounded-full animate-pulse" />
                          <span className="w-0.5 h-2 bg-[#F2D78A]/70 rounded-full animate-pulse" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSendTalk()}
                        aria-label="Send query"
                        className="w-9 h-9 rounded-full btn-gold-primary flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <svg className="w-4 h-4 text-[#0B0F14]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Quick Prompt Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-ui">
                    {QUICK_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendTalk(prompt.query)}
                        className="shrink-0 flex items-center gap-1 px-3 py-1 rounded-full bg-[#0C1B25]/85 border border-white/10 hover:border-[#F2D78A]/40 text-[#CFC5B5] hover:text-[#FFF8E1] transition-all hover:scale-102"
                      >
                        <span className="text-[10px]">{prompt.icon}</span>
                        <span>{prompt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column of Hero: The Deckled Parchment Note Card ("A thought for you") */}
              <div className="w-full sm:w-[310px] shrink-0 self-stretch flex flex-col">
                <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/50 shadow-2xl p-5 text-[#2C241D] flex-1 flex flex-col justify-between bg-[#F4E8D2] transition-all">
                  
                  {/* Clean Parchment Background Texture */}
                  <Image
                    src="/parchment_clean.jpg"
                    alt="Authentic Parchment"
                    fill
                    sizes="320px"
                    className="object-cover pointer-events-none opacity-95"
                  />

                  {/* Header Row: Title and Refresh Button */}
                  <div className="relative z-10 flex items-center justify-between border-b border-[#2C241D]/15 pb-2">
                    <span className="font-editorial text-sm font-semibold tracking-wide text-[#2C241D]">
                      A thought for you
                    </span>
                    <button
                      type="button"
                      onClick={() => setThoughtIndex((prev) => (prev + 1) % SHAYARI_LIBRARY.length)}
                      className="w-5 h-5 flex items-center justify-center text-xs text-[#2C241D]/80 hover:text-[#2C241D] hover:rotate-180 transition-transform duration-300"
                      title="Next thought"
                    >
                      🔄
                    </button>
                  </div>

                  {/* Dynamic Quote & Author */}
                  <div className="relative z-10 space-y-1.5 py-2">
                    <p className="font-display italic text-sm sm:text-base leading-snug font-medium text-[#1A1510]">
                      &ldquo;{currentThought.quote}&rdquo;
                    </p>
                    <p className="font-ui text-xs text-[#8A5A1A] font-semibold text-right">
                      — {currentThought.author}
                    </p>
                  </div>

                  {/* Meaning Section */}
                  <div className="relative z-10 space-y-1 pt-1.5 text-[11px] font-ui border-t border-[#2C241D]/10">
                    <p className="font-bold text-[#423326]">Meaning</p>
                    <p className="text-[#594738] leading-relaxed line-clamp-2">
                      {currentThought.meaning}
                    </p>
                  </div>

                  {/* Why this may matter to you Section */}
                  <div className="relative z-10 space-y-1 pt-1.5 text-[11px] font-ui">
                    <p className="font-bold text-[#423326]">Why this may matter to you</p>
                    <p className="text-[#594738] leading-relaxed line-clamp-3">
                      {currentThought.whyItMatters}
                    </p>
                  </div>

                  {/* Bottom Controls: Save, Share */}
                  <div className="relative z-10 flex items-center justify-between pt-2 border-t border-[#2C241D]/10 text-xs font-ui font-medium">
                    <span className="text-[#8A5A1A] hover:underline cursor-pointer">Save</span>
                    <span className="text-[#8A5A1A] hover:underline cursor-pointer">&lt; Share →</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── Paper Writing Words Animation Section (Interactive Talk Response) ── */}
          {(isWriting || paperOutput) && (
            <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/50 bg-[#15120C] p-6 shadow-2xl transition-all duration-500 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2D78A]/20">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F2D78A] animate-pulse" />
                  <span className="font-ui text-xs uppercase tracking-widest text-[#F2D78A] font-medium">
                    EchoSoul Parchment Reflection
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPaperOutput(null)}
                  className="text-xs text-[#9AA8B0] hover:text-[#FFF8E1] transition-colors"
                >
                  ✕ Close
                </button>
              </div>

              {/* Lined Parchment Writing Area */}
              <div className="pt-4 space-y-2">
                <p className="font-display italic text-base sm:text-lg text-[#FFF8E1] leading-relaxed tracking-wide min-h-[50px]">
                  &ldquo;{displayedText}&rdquo;
                  {isWriting && (
                    <span className="inline-block w-2 h-4 ml-1 bg-[#F2D78A] animate-pulse align-middle" />
                  )}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-ui text-[#9AA8B0]">
                  <span>Written authentically for {profile.userName}</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSendTalk("Tell me more about this")}
                      className="hover:text-[#F2D78A] transition-colors"
                    >
                      Ask follow-up →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Personalized for You (4 Recommended Cards) ──────────────── */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-editorial text-xl sm:text-2xl text-[#FFF8E1] font-medium">
                  Personalized for You
                </h2>
                <p className="font-ui text-xs text-[#9AA8B0]">
                  Based on your conversations, interests, mood, and goals. These recommendations are unique to you.
                </p>
              </div>
              <Link href="/app/recommendations" className="font-ui text-xs text-[#F2D78A] hover:underline flex items-center gap-1">
                <span>See all</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              
              {/* Card 1: Book for You (Dynamic HTML/CSS & Cover) */}
              <div className="p-3.5 rounded-2xl bg-[#0C1B25]/90 border border-white/10 hover:border-[#F2D78A]/40 transition-all flex flex-col justify-between shadow-lg group">
                <div className="flex items-start gap-3">
                  {/* Book Cover Image */}
                  <div className="relative w-16 h-24 rounded-md overflow-hidden bg-[#101F2B] border border-white/15 shrink-0 shadow-md">
                    <Image
                      src={userBook.coverImage}
                      alt={userBook.title}
                      fill
                      sizes="80px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="text-[10px] font-ui uppercase tracking-wider text-[#F2D78A] font-semibold flex items-center justify-between">
                      <span>Book for You</span>
                      <span>🔖</span>
                    </div>
                    <h3 className="font-editorial text-sm font-semibold text-[#FFF8E1] group-hover:text-[#F2D78A] transition-colors truncate">
                      {userBook.title}
                    </h3>
                    <p className="text-[10px] text-[#CFC5B5] font-ui">{userBook.author}</p>
                    <p className="font-ui text-[11px] text-[#9AA8B0] leading-snug line-clamp-2">
                      {userBook.reason}
                    </p>
                  </div>
                </div>
                <div className="pt-2.5 flex items-center justify-between text-[11px] font-ui border-t border-white/5 mt-2">
                  <span className="text-[#CFC5B5] truncate">{userBook.author}</span>
                  <span className="text-[#F2D78A] group-hover:translate-x-0.5 transition-transform shrink-0">Read →</span>
                </div>
              </div>

              {/* Card 2: Music for Your Mood */}
              <div className="p-3.5 rounded-2xl bg-[#0C1B25]/90 border border-white/10 hover:border-[#F2D78A]/40 transition-all flex flex-col justify-between shadow-lg group">
                <div className="relative w-full h-24 rounded-xl overflow-hidden bg-[#08131B] mb-2">
                  <Image
                    src="/home/music_focus_flow.jpg"
                    alt="Music for Your Mood"
                    fill
                    sizes="260px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C1B25] via-transparent to-black/20" />
                  <button
                    type="button"
                    aria-label="Play music"
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-[#0B0F14] flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  >
                    <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#F2D78A] font-ui">
                    <span>🎵</span>
                    <span>Music for Your Mood</span>
                  </div>
                  <h3 className="font-editorial text-sm font-semibold text-[#FFF8E1] group-hover:text-[#F2D78A] transition-colors mt-0.5">
                    Focus Flow
                  </h3>
                  <p className="text-[10px] text-[#CFC5B5] font-ui">Lofi • 45 min</p>
                  <p className="font-ui text-[11px] text-[#9AA8B0] mt-0.5 leading-snug line-clamp-2">
                    Calm, steady, and focused for your study session.
                  </p>
                </div>
              </div>

              {/* Card 3: Visual for You */}
              <div className="p-3.5 rounded-2xl bg-[#0C1B25]/90 border border-white/10 hover:border-[#F2D78A]/40 transition-all flex flex-col justify-between shadow-lg group">
                <div className="relative w-full h-24 rounded-xl overflow-hidden bg-[#08131B] mb-2">
                  <Image
                    src={visualWorldInfo.image}
                    alt={visualWorldInfo.title}
                    fill
                    sizes="260px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C1B25] via-transparent to-black/20" />
                  <button
                    type="button"
                    aria-label="Play visual"
                    className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 text-[#0B0F14] flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  >
                    <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#F2D78A] font-ui">
                    <span>🖼️</span>
                    <span>Visual for You</span>
                  </div>
                  <h3 className="font-editorial text-sm font-semibold text-[#FFF8E1] group-hover:text-[#F2D78A] transition-colors mt-0.5">
                    {visualWorldInfo.title}
                  </h3>
                  <p className="font-ui text-[11px] text-[#9AA8B0] mt-0.5 leading-snug line-clamp-2">
                    {visualWorldInfo.desc}
                  </p>
                </div>
              </div>

              {/* Card 4: Guidance for You */}
              <div className="p-3.5 rounded-2xl bg-[#0C1B25]/90 border border-white/10 hover:border-[#F2D78A]/40 transition-all flex flex-col justify-between shadow-lg group">
                <div className="relative w-full h-24 rounded-xl overflow-hidden bg-[#08131B] mb-2">
                  <Image
                    src="/home/guidance_overthinking.jpg"
                    alt={userGuidance.title}
                    fill
                    sizes="260px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C1B25] via-transparent to-black/20" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#F2D78A] font-ui">
                    <span>👤</span>
                    <span>Guidance for You</span>
                  </div>
                  <h3 className="font-editorial text-sm font-semibold text-[#FFF8E1] group-hover:text-[#F2D78A] transition-colors mt-0.5">
                    {userGuidance.title}
                  </h3>
                  <p className="font-ui text-[11px] text-[#9AA8B0] mt-0.5 leading-snug line-clamp-2">
                    {userGuidance.desc}
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* ── Main Content Bottom 3 Columns ───────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            {/* Column 1: Recent Conversations */}
            <div className="p-4 rounded-2xl bg-[#0C1B25]/90 border border-white/10 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="font-editorial text-base text-[#FFF8E1] font-medium">
                  Recent Conversations
                </h3>
                <span className="text-[11px] font-ui text-[#F2D78A] cursor-pointer hover:underline">
                  See all →
                </span>
              </div>

              <div className="space-y-2">
                {[
                  { title: "How to stay consistent?", time: "Today, 9:12 AM" },
                  { title: "Fear of the future", time: "Yesterday, 8:45 PM" },
                  { title: "Dealing with overthinking", time: "8 Sep, 10:30 AM" },
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleSendTalk(item.title)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#F2D78A]/30 transition-all cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <p className="text-[#FFF8E1] font-medium leading-tight">{item.title}</p>
                      <span className="text-[10px] text-[#9AA8B0]">{item.time}</span>
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-[#112431] flex items-center justify-center text-xs text-[#F2D78A]">
                      💬
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Your Moments (3 Photo Cards) */}
            <div className="p-4 rounded-2xl bg-[#0C1B25]/90 border border-white/10 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#F2D78A] text-xs">✨</span>
                  <h3 className="font-editorial text-base text-[#FFF8E1] font-medium">
                    Your Moments
                  </h3>
                </div>
                <span className="text-[11px] font-ui text-[#F2D78A] cursor-pointer hover:underline">
                  See all →
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { title: "That peaceful evening", date: "9 Sep 2026", image: "/home/moment_1.jpg" },
                  { title: "A step forward", date: "7 Sep 2026", image: "/home/moment_2.jpg" },
                  { title: "Clarity after a chat", date: "4 Sep 2026", image: "/home/moment_3.jpg" },
                ].map((moment, idx) => (
                  <div key={idx} className="space-y-1 group cursor-pointer">
                    <div className="relative h-20 rounded-lg overflow-hidden bg-[#08131B] border border-white/10">
                      <Image
                        src={moment.image}
                        alt={moment.title}
                        fill
                        sizes="110px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-[10px] text-[#FFF8E1] font-medium leading-tight truncate">
                      {moment.title}
                    </p>
                    <span className="text-[9px] text-[#9AA8B0] block">{moment.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Your Journey */}
            <div className="p-4 rounded-2xl bg-[#0C1B25]/90 border border-white/10 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#F2D78A] text-xs">🧭</span>
                  <h3 className="font-editorial text-base text-[#FFF8E1] font-medium">
                    Your Journey
                  </h3>
                </div>
                <span className="text-[11px] font-ui text-[#F2D78A] cursor-pointer hover:underline">
                  See all →
                </span>
              </div>

              <div className="space-y-2 text-xs font-ui">
                <div className="p-2 rounded-xl bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">👤</span>
                    <span className="text-[#FFF8E1]">Goals</span>
                  </div>
                  <span className="text-[11px] text-[#F2D78A] font-medium">3 active goals</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">😊</span>
                    <span className="text-[#FFF8E1]">Emotions</span>
                  </div>
                  <span className="text-[11px] text-[#9AA8B0]">Mood patterns &gt;</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📖</span>
                    <span className="text-[#FFF8E1]">Reflections</span>
                  </div>
                  <span className="text-[11px] text-[#F2D78A] font-medium">12 journal entries</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📚</span>
                    <span className="text-[#FFF8E1]">Life Novel</span>
                  </div>
                  <span className="text-[11px] text-[#9AA8B0]">Your story in progress &gt;</span>
                </div>
              </div>
            </div>

          </div>
        </main>

        {/* ── 3. RIGHT COLUMN (Today's Insights, Daily Check-in, Quick Actions, Leafy Card) ── */}
        <aside className="w-72 xl:w-80 shrink-0 space-y-4 hidden lg:block">
          
          {/* Today's Insights Card */}
          <div className="p-4 rounded-2xl bg-[#0C1B25]/90 border border-white/10 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="font-editorial text-sm font-semibold text-[#FFF8E1]">
                Today&apos;s Insights
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] font-ui text-[#9AA8B0]">
                <span>Show details</span>
                <span className="w-5 h-3 rounded-full bg-[#F2D78A] flex items-center justify-end px-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#0B0F14]" />
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-ui text-[#CFC5B5]">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5">
                <span className="text-base text-[#F2D78A]">✨</span>
                <p className="leading-tight">Your mood seems more stable this week.</p>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5">
                <span className="text-base text-[#4ADE80]">🍃</span>
                <p className="leading-tight">You&apos;re talking more about your goals.</p>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5">
                <span className="text-base text-[#F2D78A]">💛</span>
                <p className="leading-tight">You&apos;ve been more consistent. Keep going!</p>
              </div>
            </div>
          </div>

          {/* Daily Check-in Card (5 Mood Smileys) */}
          <div className="p-4 rounded-2xl bg-[#0C1B25]/90 border border-white/10 space-y-3 shadow-lg">
            <div className="border-b border-white/10 pb-1.5">
              <h3 className="font-editorial text-sm font-semibold text-[#FFF8E1]">
                Daily Check-in
              </h3>
              <p className="text-[11px] font-ui text-[#9AA8B0]">
                How are you feeling right now?
              </p>
            </div>

            <div className="grid grid-cols-5 gap-1 text-center font-ui text-[10px]">
              {[
                { label: "Calm", face: "😊", color: "text-[#F2D78A]" },
                { label: "Good", face: "🟢", color: "text-[#4ADE80]" },
                { label: "Neutral", face: "😐", color: "text-[#CBD5E1]" },
                { label: "Tired", face: "🙁", color: "text-[#F472B6]" },
                { label: "Anxious", face: "🌧️", color: "text-[#A78BFA]" },
              ].map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => handleSaveMood(m.label)}
                  className={`p-1.5 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                    activeMood === m.label
                      ? "border-[#F2D78A] bg-[#F2D78A]/20 shadow-md ring-1 ring-[#F2D78A]"
                      : "border-white/5 hover:border-white/20 bg-white/5"
                  }`}
                >
                  <span className="text-base">{m.face}</span>
                  <span className={m.color}>{m.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] text-[#9AA8B0]">
                {moodSaved ? "Saved to profile ✓" : "Your feelings are always valid."}
              </span>
              <button
                type="button"
                onClick={() => handleSaveMood(activeMood)}
                className="px-3.5 py-1 rounded-full btn-gold-primary text-[10px] font-semibold cursor-pointer shadow-md"
              >
                Save
              </button>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="p-4 rounded-2xl bg-[#0C1B25]/90 border border-white/10 space-y-2.5 shadow-lg">
            <h3 className="font-editorial text-sm font-semibold text-[#FFF8E1] border-b border-white/10 pb-1.5">
              Quick Actions
            </h3>
            <div className="space-y-2 text-xs font-ui">
              {[
                { title: "Continue Last Conversation", desc: "You: How to manage time?", icon: "💬", iconBg: "bg-teal-950/60 border-teal-500/40 text-teal-300", href: "/app/talk" },
                { title: "Open Your Journal", desc: "Write your thoughts", icon: "📓", iconBg: "bg-emerald-950/60 border-emerald-500/40 text-emerald-300", href: "/app/journal" },
                { title: "Explore Moments", desc: "See your recent highlights", icon: "🖼️", iconBg: "bg-rose-950/60 border-rose-500/40 text-rose-300", href: "/app/moments" },
                { title: "Generate a Visualization", desc: "A calm space for you", icon: "🌌", iconBg: "bg-blue-950/60 border-blue-500/40 text-blue-300", href: "/app/visuals" },
              ].map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border text-sm ${action.iconBg}`}>
                      {action.icon}
                    </div>
                    <div>
                      <p className="text-[#FFF8E1] font-medium leading-tight group-hover:text-[#F2D78A] transition-colors">{action.title}</p>
                      <span className="text-[10px] text-[#9AA8B0]">{action.desc}</span>
                    </div>
                  </div>
                  <span className="text-[#9AA8B0] group-hover:translate-x-0.5 transition-transform">&gt;</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom Card: Every step you take matters (Leafy Botanical Card) */}
          <div className="relative rounded-2xl overflow-hidden border border-[#F2D78A]/30 shadow-xl p-5 min-h-[140px] flex flex-col justify-between items-center text-center bg-[#08161C]">
            <Image
              src="/home/leafy_card_bg.jpg"
              alt="Botanical Leaf Foliage"
              fill
              sizes="320px"
              className="object-cover pointer-events-none opacity-90"
            />
            <div className="relative z-10 space-y-3 w-full">
              <p className="font-display italic text-base text-[#FFF8E1] pt-1">
                &ldquo;Every step you take matters.&rdquo;
              </p>
              <Link
                href="/app/talk"
                className="inline-flex items-center justify-center w-full py-2 rounded-full btn-gold-primary text-xs font-semibold shadow-lg hover:scale-102 transition-transform"
              >
                Keep Going →
              </Link>
            </div>
          </div>

        </aside>

      </div>

      {/* ── Global Footer ────────────────────────────────────────────── */}
      <footer className="relative z-20 w-full border-t border-white/10 bg-[#050B10] py-6 mt-6">
        <div className="max-w-[1740px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-ui text-[#9AA8B0]">
          <div className="flex items-center gap-6">
            <BrandLogo size="sm" />
            <nav className="flex items-center gap-4 text-xs">
              <Link href="/about" className="hover:text-[#F2D78A] transition-colors">About</Link>
              <Link href="/features" className="hover:text-[#F2D78A] transition-colors">Features</Link>
              <Link href="/#stories" className="hover:text-[#F2D78A] transition-colors">Stories</Link>
              <Link href="/#pricing" className="hover:text-[#F2D78A] transition-colors">Pricing</Link>
              <Link href="/#help" className="hover:text-[#F2D78A] transition-colors">Help</Link>
              <Link href="/privacy" className="hover:text-[#F2D78A] transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-[#F2D78A] transition-colors">Terms</Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <span className="italic text-[#F2D78A]">More than an AI. A place for what you feel.</span>
            <span>© 2026 EchoSoul. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
