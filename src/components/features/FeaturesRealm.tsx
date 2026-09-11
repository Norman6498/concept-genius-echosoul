"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";

interface FeatureCard {
  id: string;
  title: string;
  desc: string;
  image: string;
  icon: string;
  href: string;
  badge?: string;
}

const FEATURES: FeatureCard[] = [
  {
    id: "talk",
    title: "Talk",
    desc: "Be heard without judgment.",
    image: "/environments/cozy_room.jpg",
    icon: "💬",
    href: "/app?explore=talk",
  },
  {
    id: "words",
    title: "Words",
    desc: "Real literature. Real meaning.",
    image: "/visual-worlds/classic_vintage.jpg",
    icon: "📖",
    href: "/app?explore=words",
  },
  {
    id: "music",
    title: "Music",
    desc: "A soundtrack for what you feel.",
    image: "/environments/starry_sky.jpg",
    icon: "🎵",
    href: "/app?explore=music",
  },
  {
    id: "visuals",
    title: "Visuals",
    desc: "Turn emotions into immersive worlds.",
    image: "/environments/mountain_view.jpg",
    icon: "🖼️",
    href: "/app?explore=visuals",
  },
  {
    id: "journey",
    title: "Journey",
    desc: "Your memories. Your growth.",
    image: "/environments/forest_cabin.jpg",
    icon: "🧭",
    href: "/app?explore=journey",
  },
  {
    id: "journal",
    title: "Journal",
    desc: "Write. Reflect. Grow.",
    image: "/visual-worlds/minimal_space.jpg",
    icon: "📄",
    href: "/app?explore=journal",
  },
  {
    id: "guidance",
    title: "Guidance",
    desc: "Insights for a better you.",
    image: "/visual-worlds/forest_retreat.jpg",
    icon: "🍃",
    href: "/app?explore=guidance",
  },
  {
    id: "life_novel",
    title: "Life Novel",
    desc: "Your story, beautifully written.",
    image: "/visual-worlds/fantasy_realm.jpg",
    icon: "⭐",
    href: "/app?explore=life_novel",
  },
  {
    id: "moments",
    title: "Moments",
    desc: "Meaningful experiences, remembered.",
    image: "/environments/ocean_view.jpg",
    icon: "⊞",
    href: "/app?explore=moments",
  },
  {
    id: "community",
    title: "Community",
    desc: "Grow together. Talk, share, learn.",
    image: "/visual-worlds/anime_aesthetic.jpg",
    icon: "👥",
    href: "#",
    badge: "Coming Soon",
  },
];

const STATS = [
  {
    count: "100K+",
    label: "People finding clarity",
    icon: (
      <svg className="w-5 h-5 text-[#F2D78A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    count: "10K+",
    label: "Authentic literary works",
    icon: (
      <svg className="w-5 h-5 text-[#F2D78A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    count: "5K+",
    label: "Moments of calm & focus",
    icon: (
      <svg className="w-5 h-5 text-[#F2D78A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
  {
    count: "1 Goal",
    label: "A brighter you",
    icon: (
      <svg className="w-5 h-5 text-[#F2D78A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

export function FeaturesRealm() {
  const [userName, setUserName] = useState("Friend");

  useEffect(() => {
    try {
      const p = localStorage.getItem("echosoul_user_personalization");
      if (p) {
        const parsed = JSON.parse(p);
        if (parsed.name) setUserName(parsed.name);
      }
    } catch {
      // Ignore
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050B10] text-[#FFF8E1] overflow-x-hidden select-none">
      {/* ── Top Fixed Navigation Bar ──────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F14]/90 backdrop-blur-md border-b border-[#F2D78A]/15 h-20">
        <div className="max-w-[1536px] mx-auto px-6 lg:px-10 h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <BrandLogo size="md" />

            <nav className="hidden md:flex items-center gap-7 font-ui text-sm font-medium text-[#CFC5B5]">
              <Link href="/" className="hover:text-[#F2D78A] transition-colors">
                Home
              </Link>
              <Link href="/about" className="hover:text-[#F2D78A] transition-colors">
                About
              </Link>
              <Link
                href="/features"
                className="text-[#F2D78A] font-semibold flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2D78A]/10 border border-[#F2D78A]/30"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F2D78A] animate-pulse" />
                Features
              </Link>
              <Link href="/#stories" className="hover:text-[#F2D78A] transition-colors">
                Stories
              </Link>
              <Link href="/#pricing" className="hover:text-[#F2D78A] transition-colors">
                Pricing
              </Link>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="hidden lg:flex items-center relative w-64 xl:w-72">
              <svg className="w-4 h-4 text-[#9AA8B0] absolute left-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search feelings, books, music..."
                className="w-full h-9 pl-9 pr-3 rounded-full bg-[#08131B] border border-white/15 text-xs text-[#FFF8E1] placeholder-[#9AA8B0]/60 focus:outline-none focus:border-[#F2D78A]/60"
              />
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2 rounded-full hover:bg-white/5 text-[#CFC5B5] transition-colors focus:outline-none"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E57373] animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E57373]" />
            </button>

            {/* User Profile Pill */}
            <Link
              href="/app"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0C1B25]/80 border border-white/10 hover:border-[#F2D78A]/40 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-[#F2D78A] text-[#0B0F14] font-bold text-xs flex items-center justify-center shadow-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="font-ui text-xs font-semibold text-[#FFF8E1]">{userName}</span>
                <span className="text-[10px] text-[#F2D78A] mt-0.5">Keep going</span>
              </div>
              <svg className="w-3.5 h-3.5 text-[#9AA8B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Container ────────────────────────────────────────────── */}
      <main className="relative z-10 pt-24 pb-16 max-w-[1536px] mx-auto px-6 lg:px-10 space-y-10">
        
        {/* ── Hero Window Banner ──────────────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden border border-[#F2D78A]/25 shadow-[0_24px_64px_rgba(0,0,0,0.85)] min-h-[340px] sm:min-h-[400px] flex flex-col justify-between p-8 sm:p-12">
          {/* Alpine Sunrise Photography Background */}
          <Image
            src="/environments/mountain_view.jpg"
            alt="Scenic alpine mountain sunrise with window atmosphere"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center pointer-events-none"
          />
          {/* Subtle Vignette & Lighting */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B10]/95 via-[#050B10]/75 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B10] via-transparent to-black/20 pointer-events-none" />

          {/* Hero Content Overlays */}
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F2D78A] animate-pulse" />
              <span className="font-ui text-xs uppercase tracking-[0.25em] text-[#F2D78A] font-semibold">
                FEATURES —
              </span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl text-[#FFF8E1] font-normal leading-[1.1]">
              Tools for a more<br />
              <span className="italic text-[#F2D78A]">meaningful you.</span>
            </h1>

            <p className="font-ui text-sm sm:text-base text-[#CFC5B5] leading-relaxed max-w-xl">
              Explore everything EchoSoul offers to help you feel, reflect, and grow — through
              conversations, real literature, music, visuals, and your personal journey.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 text-xs font-display italic text-[#F2D78A]">
            <span>&ldquo;A brighter tomorrow begins with a kinder you.&rdquo;</span>
            <span className="hidden sm:inline font-ui not-italic text-[11px] text-[#9AA8B0]">EchoSoul Sanctuary Features</span>
          </div>
        </div>

        {/* ── 10 Feature Cards (2 Rows of 5) ───────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#FFF8E1]">
              Sanctuary Capabilities
            </h2>
            <span className="font-ui text-xs text-[#9AA8B0]">
              10 Crafted Spaces For Inner Clarity
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {FEATURES.map((feat) => (
              <Link
                key={feat.id}
                href={feat.href}
                className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#F2D78A]/60 bg-[#0C1B25]/85 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_12px_28px_rgba(242,215,138,0.2)] flex flex-col justify-between min-h-[220px]"
              >
                {/* Photographic Header */}
                <div className="relative w-full h-28 overflow-hidden bg-[#08131B]">
                  <Image
                    src={feat.image}
                    alt={feat.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C1B25] via-transparent to-black/20" />
                  
                  {feat.badge && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-ui font-semibold bg-[#F2D78A] text-[#0B0F14] shadow-sm">
                      {feat.badge}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{feat.icon}</span>
                      <h3 className="font-editorial text-lg text-[#FFF8E1] group-hover:text-[#F2D78A] transition-colors font-medium">
                        {feat.title}
                      </h3>
                    </div>
                    <p className="font-ui text-xs text-[#9AA8B0] leading-snug">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center text-xs font-ui text-[#F2D78A] font-medium group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <span className="ml-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Stats Bar ───────────────────────────────────────────────── */}
        <section className="rounded-2xl border border-white/10 bg-[#0C1B25]/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {STATS.map((stat, i) => (
              <div key={i} className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F2D78A]/10 border border-[#F2D78A]/30 flex items-center justify-center shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <span className="font-editorial text-2xl sm:text-3xl text-[#FFF8E1] font-semibold block leading-tight">
                    {stat.count}
                  </span>
                  <span className="font-ui text-xs text-[#9AA8B0]">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Quote Banner & CTA ──────────────────────────────────────── */}
        <div className="relative rounded-2xl overflow-hidden border border-[#F2D78A]/30 bg-gradient-to-r from-[#0C1B25] via-[#102431] to-[#0C1B25] p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center lg:text-left">
            <p className="font-display italic text-lg sm:text-xl lg:text-2xl text-[#FFF8E1]">
              &ldquo;Not just another AI. A companion for a more meaningful you.&rdquo;
            </p>
            <p className="font-ui text-xs text-[#F2D78A] tracking-wider uppercase font-semibold">
              — EchoSoul Sanctuary
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="text-center sm:text-right">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full btn-gold-primary text-sm font-semibold tracking-wide shadow-lg"
              >
                Start Your Journey →
              </Link>
              <span className="block font-ui text-[11px] text-[#9AA8B0] mt-1.5">
                Explore. Reflect. Grow. Belong.
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* ── Global Footer ────────────────────────────────────────────── */}
      <footer className="relative z-30 w-full border-t border-white/10 bg-[#050B10] py-8">
        <div className="max-w-[1536px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-ui text-[#9AA8B0]">
          <div className="flex items-center gap-6">
            <BrandLogo size="sm" />
            <nav className="flex items-center gap-4 text-xs">
              <Link href="/" className="hover:text-[#F2D78A] transition-colors">Home</Link>
              <Link href="/about" className="hover:text-[#F2D78A] transition-colors">About</Link>
              <Link href="/features" className="text-[#F2D78A] font-medium">Features</Link>
              <Link href="/#stories" className="hover:text-[#F2D78A] transition-colors">Stories</Link>
              <Link href="/#pricing" className="hover:text-[#F2D78A] transition-colors">Pricing</Link>
            </nav>
          </div>

          <div>
            <span>© 2026 EchoSoul. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
