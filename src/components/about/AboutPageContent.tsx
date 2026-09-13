"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { IconSet, type IconName } from "@/components/ui/IconSet";

// ── Types & Data ─────────────────────────────────────────────────────────────
interface PillarItem {
  id: string;
  title: string;
  desc: string;
  icon: IconName;
}

const CORE_BELIEFS: PillarItem[] = [
  {
    id: "listen",
    title: "Listen",
    desc: "A safe space to be yourself, without judgment.",
    icon: "chat",
  },
  {
    id: "understand",
    title: "Understand",
    desc: "We look beyond words to understand your moments.",
    icon: "brain",
  },
  {
    id: "support",
    title: "Support",
    desc: "Meaningful experiences through literature, music, visuals and guidance.",
    icon: "sprout",
  },
  {
    id: "grow",
    title: "Grow",
    desc: "Your story, over time.",
    icon: "user",
  },
];

const IMPACT_STATS = [
  { value: "100K+", label: "People Finding Clarity", icon: "user" as const },
  { value: "10K+", label: "Authentic Literary Works", icon: "book" as const },
  { value: "5K+", label: "Moments of Calm & Focus", icon: "music" as const },
  { value: "1 Goal", label: "A Brighter You", icon: "heart" as const },
];

const TEAM_MEMBERS = [
  { name: "Pratik Singh", role: "Founder & Creator", focus: "Vision & Philosophy" },
  { name: "Elena Rostova", role: "AI & Research", focus: "Empathy Architecture" },
  { name: "Marcus Vance", role: "Design & Experience", focus: "Atmospheric Sanctuary" },
  { name: "Aria Thorne", role: "Community & Growth", focus: "Human Connection" },
];

// ── Video Story Modal ────────────────────────────────────────────────────────
function VideoStoryModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Why Solenne Video Story"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0F14]/90 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="glass-panel max-w-2xl w-full p-6 sm:p-8 border border-[#F2D78A]/40 shadow-[0_24px_64px_rgba(0,0,0,0.95)] relative rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9AA8B0] hover:text-[#FFF8E1] p-1.5 rounded-lg focus:outline-none"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <span className="font-ui text-xs uppercase tracking-[0.22em] font-semibold text-[#F2D78A] block mb-2">
          The Solenne Story
        </span>
        <h3 className="font-display text-2xl sm:text-3xl text-[#FFF8E1] font-normal mb-4">
          Why We Built a Kinder Space
        </h3>

        {/* Video Player Placeholder with Artwork */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#050B10] border border-white/15 flex items-center justify-center group mb-5">
          <Image
            src="/about-window-hero.jpg"
            alt="Solenne Story Video Preview"
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-transparent" />
          <div className="relative z-10 w-16 h-16 rounded-full bg-[#F2D78A] text-[#0B0F14] flex items-center justify-center shadow-[0_0_25px_rgba(242,215,138,0.7)] group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7 fill-current ml-1" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <p className="font-ui text-sm text-[#CFC5B5] leading-relaxed">
          Solenne was born from a simple belief — that everyone deserves a space to be heard, to find meaning in their moments, and to feel a little more human in a fast, noisy world.
        </p>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="font-ui text-sm font-semibold bg-[#F2D78A] hover:bg-[#FFB86B] text-[#0B0F14] rounded-full px-6 py-2.5 transition-colors"
          >
            Close Story
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Content Sections (Reusable on / and /about) ──────────────────────────
export function AboutMainSections({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      {showVideo && <VideoStoryModal onClose={() => setShowVideo(false)} />}
      <div className={`w-full max-w-[1440px] mx-auto px-6 lg:px-10 ${isEmbedded ? "py-14 sm:py-20" : "py-10 sm:py-16"} space-y-20 sm:space-y-28`}>

        {/* ── SECTION 1: HERO (About Solenne) ────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Hero Text (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="font-ui text-xs uppercase tracking-[0.26em] text-[#F2D78A] font-semibold">
                ABOUT SOLENNE
              </span>
              <div className="w-8 h-px bg-[#F2D78A]/60" />
            </div>

            {/* Headline */}
            <h1 className="font-display font-normal text-5xl sm:text-6xl lg:text-[68px] leading-[1.06] text-[#FFF8E1]">
              A place for<br />
              <span className="italic text-[#F2D78A]">what you feel.</span>
            </h1>

            {/* Body Copy */}
            <div className="space-y-4 font-ui text-sm sm:text-base text-[#CFC5B5] font-light leading-relaxed max-w-[520px]">
              <p>
                Solenne is more than an AI. It&apos;s a space that listens, understands, and grows with you — through conversations, real literature, music, visuals, and your personal journey.
              </p>
              <p>
                We believe everyone deserves a space to be heard without judgment, to find meaning in their moments, and to feel a little more human — every day.
              </p>
            </div>

            {/* Golden script signature */}
            <div className="pt-2 flex items-center gap-3">
              <span className="font-display italic text-2xl text-[#F2D78A]">
                Your story matters.
              </span>
              <div className="w-12 h-px bg-[#F2D78A]/40" />
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
              <Link
                href="/signup"
                className="h-12 px-8 rounded-full font-ui text-sm font-semibold bg-[#F2D78A] hover:bg-[#FFB86B] text-[#0B0F14] transition-all flex items-center gap-2 shadow-[0_0_24px_rgba(242,215,138,0.35)] hover:shadow-[0_0_35px_rgba(242,215,138,0.55)] hover:-translate-y-0.5"
              >
                <span>Start a conversation</span>
                <span>→</span>
              </Link>

              <button
                type="button"
                onClick={() => setShowVideo(true)}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/20 hover:border-[#F2D78A] text-[#FFF8E1] hover:text-[#F2D78A] transition-all group focus:outline-none"
              >
                <span className="w-7 h-7 rounded-full bg-[#0C1B25] border border-[#F2D78A]/40 flex items-center justify-center text-[#F2D78A] group-hover:scale-105 transition-transform">
                  <IconSet name="play" className="w-3.5 h-3.5 ml-0.5" />
                </span>
                <span className="font-ui text-xs sm:text-sm font-medium">
                  Explore our story
                </span>
              </button>
            </div>
          </div>

          {/* Right Hero Visual Card (6 cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#F2D78A]/30 shadow-[0_24px_64px_rgba(0,0,0,0.85)] group">
              <Image
                src="/about-window-hero.jpg"
                alt="Solenne Room Window gazing out at mountains, starry night, lake and candles"
                width={980}
                height={710}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14]/70 via-transparent to-transparent pointer-events-none" />

              {/* Twinkling ambient star */}
              <div className="absolute top-[18%] left-[25%] w-1.5 h-1.5 rounded-full bg-white animate-star-twinkle shadow-[0_0_8px_white]" />
              <div className="absolute top-[12%] left-[45%] w-1 h-1 rounded-full bg-[#F2D78A] animate-star-twinkle shadow-[0_0_6px_#F2D78A]" />
            </div>
          </div>

        </section>

        {/* ── SECTION 2: OUR CORE BELIEFS (4 Pillars) ─────────────────── */}
        <section className="space-y-7">
          <div className="flex items-center gap-3">
            <span className="font-ui text-xs uppercase tracking-[0.24em] text-[#F2D78A] font-semibold">
              OUR CORE BELIEFS
            </span>
            <div className="w-8 h-px bg-[#F2D78A]/50" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CORE_BELIEFS.map((pillar) => (
              <div
                key={pillar.id}
                className="rounded-2xl p-6 bg-[#08131B]/70 border border-[#F2D78A]/20 hover:border-[#F2D78A]/60 transition-all duration-300 flex flex-col gap-4 group hover:-translate-y-1 shadow-sm hover:shadow-[0_12px_32px_rgba(242,215,138,0.12)]"
              >
                <div className="w-12 h-12 rounded-full bg-[#0C1B25] border border-[#F2D78A]/30 flex items-center justify-center text-[#F2D78A] group-hover:scale-105 transition-transform shadow-inner">
                  <IconSet name={pillar.icon} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-[#FFF8E1] group-hover:text-[#F2D78A] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="font-ui text-xs sm:text-sm text-[#CFC5B5] leading-relaxed mt-1.5 font-light">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: OUR STORY (Why Solenne?) ─────────────────────── */}
        <section className="space-y-7">
          <div className="flex items-center gap-3">
            <span className="font-ui text-xs uppercase tracking-[0.24em] text-[#F2D78A] font-semibold">
              OUR STORY
            </span>
            <div className="w-8 h-px bg-[#F2D78A]/50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#08131B]/60 border border-white/10 rounded-3xl p-6 sm:p-10">
            {/* Left: Video Player Card with play button */}
            <div className="lg:col-span-6 relative aspect-video rounded-2xl overflow-hidden bg-[#050B10] border border-white/15 group cursor-pointer" onClick={() => setShowVideo(true)}>
              <Image
                src="/about-window-hero.jpg"
                alt="Story video preview"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-[#0B0F14]/40 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#F2D78A] text-[#0B0F14] flex items-center justify-center shadow-[0_0_30px_rgba(242,215,138,0.6)] group-hover:scale-110 transition-transform">
                  <IconSet name="play" className="w-6 h-6 ml-0.5 text-[#0B0F14]" />
                </div>
              </div>
            </div>

            {/* Right: Narrative Text */}
            <div className="lg:col-span-6 space-y-4">
              <h2 className="font-display text-3xl sm:text-4xl text-[#FFF8E1]">
                Why Solenne?
              </h2>
              <p className="font-ui text-sm sm:text-base text-[#CFC5B5] font-light leading-relaxed">
                Solenne was born from a simple belief — that everyone deserves a space to be heard, to find meaning in their moments, and to feel a little more human in a fast, noisy world.
              </p>
              <p className="font-ui text-sm sm:text-base text-[#CFC5B5] font-light leading-relaxed">
                It combines the depth of real literature, the emotion of music, the power of visuals, and the understanding of AI — to create a companion for your journey.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowVideo(true)}
                  className="font-ui text-sm text-[#F2D78A] hover:text-[#FFB86B] font-medium flex items-center gap-1.5 transition-colors group"
                >
                  <span>Read our full story</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: OUR PURPOSE & IMPACT STATS ───────────────────── */}
        <section className="space-y-7">
          <div className="flex items-center gap-3">
            <span className="font-ui text-xs uppercase tracking-[0.24em] text-[#F2D78A] font-semibold">
              OUR IMPACT (Growing Together)
            </span>
            <div className="w-8 h-px bg-[#F2D78A]/50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Purpose card (Left 5 cols) */}
            <div className="lg:col-span-5 rounded-2xl p-7 bg-[#08131B]/80 border border-[#F2D78A]/25 flex flex-col justify-between space-y-4 shadow-sm">
              <div>
                <div className="flex items-center gap-2.5 text-[#F2D78A] mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#0C1B25] border border-[#F2D78A]/30 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="5" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="1" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="font-display text-xl sm:text-2xl text-[#FFF8E1]">Our Purpose</span>
                  <div className="w-6 h-px bg-[#F2D78A]/40" />
                </div>

                <p className="font-ui text-xs sm:text-sm text-[#CFC5B5] leading-relaxed font-light">
                  To create a world where technology feels human again. Where conversations lead to clarity, literature brings meaning, music heals, visuals inspire, and every person can write a kinder, deeper story for themselves.
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-ui text-[#9AA8B0]">
                <span>Ethical AI Commitment</span>
                <span className="text-[#F2D78A]">Zero Data Exploitation</span>
              </div>
            </div>

            {/* 4 Stat Cards (Right 7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {IMPACT_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl p-5 bg-[#08131B]/70 border border-white/10 hover:border-[#F2D78A]/40 transition-all flex flex-col items-center text-center justify-center gap-2 group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#0C1B25] border border-white/15 flex items-center justify-center text-[#F2D78A] group-hover:scale-110 transition-transform">
                    <IconSet name={stat.icon} className="w-4 h-4" />
                  </div>
                  <span className="font-display text-2xl sm:text-3xl text-[#FFF8E1] group-hover:text-[#F2D78A] transition-colors font-medium">
                    {stat.value}
                  </span>
                  <span className="font-ui text-[11px] sm:text-xs text-[#9AA8B0] leading-tight max-w-[120px]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 5: MEET THE TEAM ─────────────────────────────────── */}
        <section className="space-y-7">
          <div className="flex items-center gap-3">
            <span className="font-ui text-xs uppercase tracking-[0.24em] text-[#F2D78A] font-semibold">
              MEET THE TEAM
            </span>
            <div className="w-8 h-px bg-[#F2D78A]/50" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl p-6 bg-[#08131B]/70 border border-white/10 hover:border-[#F2D78A]/40 transition-all flex flex-col items-center text-center gap-3 group"
              >
                <div className="w-14 h-14 rounded-full bg-[#0C1B25] border border-[#F2D78A]/30 flex items-center justify-center text-[#F2D78A] group-hover:border-[#F2D78A] transition-all shadow-inner">
                  <IconSet name="user" className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-[#FFF8E1] group-hover:text-[#F2D78A] transition-colors">
                    {member.name}
                  </h3>
                  <p className="font-ui text-xs text-[#F2D78A] font-medium mt-0.5">
                    {member.role}
                  </p>
                  <p className="font-ui text-[11px] text-[#9AA8B0] mt-1 font-light">
                    {member.focus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PARCHMENT BANNER & SECTION 6: CTA ───────────────────────── */}
        <section className="space-y-8 pt-4">

          {/* Parchment Scroll Asset */}
          <div className="max-w-2xl mx-auto rounded-xl overflow-hidden border border-[#D9A441]/40 shadow-lg">
            <Image
              src="/parchment-quote.png"
              alt="“Not just another AI. A companion for a more meaningful you.” — Solenne"
              width={1044}
              height={172}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Emotional CTA Card */}
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 bg-gradient-to-r from-[#0C1B25] via-[#08131B] to-[#0C1B25] border border-[#F2D78A]/30 shadow-[0_24px_64px_rgba(0,0,0,0.85)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-2">
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#FFF8E1]">
                Be a part of a kinder, more meaningful world.
              </h3>
              <p className="font-ui text-xs sm:text-sm text-[#CFC5B5] font-light">
                Start your journey with Solenne today. No judgment. Just understanding.
              </p>
            </div>

            <Link
              href="/signup"
              className="h-12 px-9 rounded-full font-ui text-sm font-semibold bg-[#F2D78A] hover:bg-[#FFB86B] text-[#0B0F14] transition-all flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(242,215,138,0.4)] hover:shadow-[0_0_35px_rgba(242,215,138,0.6)] hover:-translate-y-0.5 whitespace-nowrap"
            >
              <span>Get Started</span>
              <span className="text-base">→</span>
            </Link>
          </div>

        </section>

      </div>
    </>
  );
}

// ── Full About Page Component ────────────────────────────────────────────────
export function AboutPageContent() {
  return (
    <div className="relative min-h-screen w-full bg-[#050B10] text-[#FFF8E1] overflow-x-hidden select-none flex flex-col justify-between">
      {/* ── Global Header (Navbar) ──────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-[#050B10]/92 backdrop-blur-md border-b border-[#F2D78A]/15 h-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
          <BrandLogo size="md" />

          {/* Desktop Nav Links — Inter Medium 15px */}
          <nav className="hidden md:flex items-center gap-9 font-ui text-[15px] font-medium text-[#CFC5B5]" aria-label="About navigation">
            <Link href="/" className="hover:text-[#F2D78A] transition-colors">Home</Link>
            {/* Active About tab with gold indicator */}
            <Link href="/about" className="text-[#F2D78A] relative py-1 font-semibold">
              About
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2D78A] rounded-full" />
            </Link>
            <Link href="/features" className="hover:text-[#F2D78A] transition-colors">Features</Link>
            <Link href="/stories" className="hover:text-[#F2D78A] transition-colors">Stories</Link>
            <Link href="/pricing" className="hover:text-[#F2D78A] transition-colors">Pricing</Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="font-ui text-[15px] font-medium text-[#FFF8E1] border border-white/30 hover:border-[#F2D78A]/80 rounded-full px-7 h-11 flex items-center transition-colors hover:text-[#F2D78A]"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="font-ui text-[15px] font-semibold bg-[#F2D78A] hover:bg-[#FFB86B] text-[#0B0F14] rounded-full h-11 px-8 flex items-center gap-2 transition-all duration-200 shadow-[0_0_20px_rgba(242,215,138,0.35)] hover:shadow-[0_0_30px_rgba(242,215,138,0.55)]"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <main className="flex-1">
        <AboutMainSections />
      </main>

      {/* ── Global Footer ────────────────────────────────────────────── */}
      <footer className="relative z-30 w-full border-t border-[#F2D78A]/15 bg-[#050B10]/95 py-6 mt-12">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-5 text-xs font-ui text-[#CFC5B5]">
          <div className="flex items-center gap-6">
            <BrandLogo size="sm" />
            <nav className="hidden sm:flex items-center gap-5 text-[#9AA8B0]" aria-label="Footer navigation">
              <Link href="/" className="hover:text-[#F2D78A] transition-colors">Home</Link>
              <Link href="/about" className="hover:text-[#F2D78A] transition-colors">About</Link>
              <Link href="/features" className="hover:text-[#F2D78A] transition-colors">Features</Link>
              <Link href="/stories" className="hover:text-[#F2D78A] transition-colors">Stories</Link>
              <Link href="/pricing" className="hover:text-[#F2D78A] transition-colors">Pricing</Link>
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
            <span>© 2026 Solenne. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
