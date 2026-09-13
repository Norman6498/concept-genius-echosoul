"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function PricingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setWaitlistSuccess(true);
      setTimeout(() => {
        setShowWaitlistModal(false);
        setWaitlistSuccess(false);
        setEmailInput("");
      }, 2000);
    }
  };

  const freeFeatures = [
    "Talk & Listen — whenever you need",
    "Core personalization",
    "Curated literature discovery",
    "Music experiences (basic)",
    "Visual environments (basic)",
    "Moments & simple journaling",
    "Journey (basic)",
    "Privacy and safety — always included",
  ];

  const premiumFeatures = [
    "Everything in Free",
    "Deeper memory & personalization",
    "Your complete Life Novel",
    "Advanced chapters & journey insights",
    "Richer music and visual experiences",
    "Advanced creative environments",
    "Higher usage limits",
    "Ad-free experience",
    "Early access to new features",
    "Priority support",
  ];

  const trustBadges = [
    {
      icon: (
        <svg className="w-6 h-6 text-[#F2D78A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Your privacy comes first",
      subtitle: "Your data is yours. Always.",
    },
    {
      icon: (
        <span className="text-2xl text-[#F2D78A]">🪷</span>
      ),
      title: "Support, not judgment",
      subtitle: "A safe, compassionate space.",
    },
    {
      icon: (
        <span className="text-2xl text-[#F2D78A]">🍃</span>
      ),
      title: "Real growth",
      subtitle: "Tools for a kinder, clearer you.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#F2D78A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Built for real life",
      subtitle: "For the moments that matter.",
    },
  ];

  return (
    <div className="bg-[#050B10] text-[#FFF8E1] min-h-screen relative selection:bg-[#F2D78A]/30 selection:text-[#FFF8E1] overflow-x-clip">
      {/* ── Top Navigation Bar ─────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0B0F14]/94 backdrop-blur-md border-b border-[#F2D78A]/15 shadow-lg shadow-black/40"
            : "bg-transparent border-b border-white/5"
        }`}
        style={{ height: "80px" }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
          <BrandLogo size="md" href="/" />

          <nav
            className="hidden md:flex items-center gap-8 lg:gap-10 font-ui text-[15px] font-medium text-[#CFC5B5]"
            aria-label="Pricing Page Navigation"
          >
            <Link
              href="/"
              className="hover:text-[#F2D78A] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D78A] rounded-sm"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-[#F2D78A] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D78A] rounded-sm"
            >
              About
            </Link>
            <Link
              href="/features"
              className="hover:text-[#F2D78A] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D78A] rounded-sm"
            >
              Features
            </Link>
            <Link
              href="/stories"
              className="hover:text-[#F2D78A] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D78A] rounded-sm"
            >
              Stories
            </Link>
            {/* Active Pricing Nav Item */}
            <Link
              href="/pricing"
              className="text-[#F2D78A] font-semibold py-1 border-b-2 border-[#F2D78A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D78A] rounded-sm transition-all"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="font-ui text-[14px] sm:text-[15px] font-medium text-[#FFF8E1] border border-white/25 hover:border-[#F2D78A]/80 rounded-full px-5 sm:px-7 h-10 sm:h-11 flex items-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D78A] hover:text-[#F2D78A]"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="font-ui text-[14px] sm:text-[15px] font-semibold text-[#0B0F14] bg-[#F2D78A] hover:bg-[#FFB86B] rounded-full px-5 sm:px-6 h-10 sm:h-11 flex items-center gap-1.5 shadow-[0_0_20px_rgba(242,215,138,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D78A]"
            >
              <span>Enter Solenne</span>
              <span className="text-base leading-none">→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section with Woman by Window Lake Twilight Backdrop ─────── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/pricing/hero_bg.jpg"
            alt="Woman resting in cozy window nook at sunset overlooking mountain lake"
            fill
            priority
            quality={95}
            className="object-cover object-center sm:object-right opacity-85"
          />
          {/* Radial Gradient Vignette for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B10] via-[#050B10]/85 to-[#050B10]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B10] via-transparent to-[#050B10]/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#D9A441]/15 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0C1B25]/85 border border-[#F2D78A]/30 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(242,215,138,0.15)]">
              <span className="font-ui text-xs font-semibold tracking-wider text-[#F2D78A] uppercase">
                Invest in a Kinder You
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-[#FFF8E1] tracking-tight leading-[1.08] mb-6">
              More Clarity.<br />
              A More You.
            </h1>

            {/* Subtitle */}
            <p className="font-ui text-base sm:text-lg text-[#CFC5B5] leading-relaxed mb-8 max-w-xl">
              Solenne is free to begin, and there when you&apos;re ready to go deeper. Choose the path that feels right for you.
            </p>

            {/* 3 Core Value Bullets */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-10 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🍃</span>
                <div className="font-ui text-xs sm:text-sm">
                  <span className="text-[#FFF8E1] font-medium block">A calmer mind</span>
                  <span className="text-[#9AA8B0]">for today</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📖</span>
                <div className="font-ui text-xs sm:text-sm">
                  <span className="text-[#FFF8E1] font-medium block">A deeper story</span>
                  <span className="text-[#9AA8B0]">for tomorrow</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xl">☀️</span>
                <div className="font-ui text-xs sm:text-sm">
                  <span className="text-[#FFF8E1] font-medium block">A kinder you</span>
                  <span className="text-[#9AA8B0]">always</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Choose Your Journey / Pricing Cards Section ────────────────── */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-10 py-16 sm:py-24">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="font-ui text-xs font-semibold uppercase tracking-[0.25em] text-[#F2D78A] block mb-3">
            Simple. Meaningful. Transparent.
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#FFF8E1] font-light">
            Choose Your Journey
          </h2>
        </div>

        {/* Pricing Layout: Cards + Floating Quote on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Free Tier Card (4.5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-[#09141D]/90 border border-white/10 p-8 sm:p-10 flex flex-col justify-between min-h-[640px] shadow-xl hover:border-white/20 transition-all duration-300">
            <div>
              <h3 className="font-display text-3xl text-[#FFF8E1] mb-2 font-light">
                Free
              </h3>
              <p className="font-ui text-sm text-[#F2D78A] mb-4">
                A beautiful place to begin
              </p>
              <p className="font-ui text-xs text-[#CFC5B5] leading-relaxed mb-6">
                Get started with Solenne and experience the core of what makes it special — always free.
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-8 pb-6 border-b border-white/10">
                <span className="font-display text-5xl font-light text-[#FFF8E1]">₹0</span>
                <span className="font-ui text-xs text-[#9AA8B0]">Always free</span>
              </div>

              {/* Features List */}
              <ul className="space-y-3.5 mb-8">
                {freeFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 font-ui text-xs sm:text-sm text-[#CFC5B5]">
                    <span className="w-4 h-4 rounded-full bg-white/10 text-[#CFC5B5] flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/signup"
              className="w-full py-3.5 rounded-full border border-white/30 hover:border-[#F2D78A] font-ui text-sm font-medium text-[#FFF8E1] hover:text-[#F2D78A] text-center transition-all"
            >
              Start for Free →
            </Link>
          </div>

          {/* Premium Tier Card (5 cols - Highlighted with Gold Border & Aura) */}
          <div className="lg:col-span-5 relative rounded-3xl bg-[#0C1B25]/95 border-2 border-[#F2D78A]/70 p-8 sm:p-10 flex flex-col justify-between min-h-[670px] shadow-[0_0_50px_rgba(242,215,138,0.2)] hover:shadow-[0_0_60px_rgba(242,215,138,0.3)] transition-all duration-300">
            {/* Most Loved Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#F2D78A] text-[#0B0F14] font-ui text-[11px] font-bold uppercase tracking-wider shadow-md">
              Most Loved
            </div>

            <div>
              <div className="flex items-center justify-between mt-1 mb-2">
                <h3 className="font-display text-3xl text-[#FFF8E1] font-light">
                  Solenne Premium
                </h3>
              </div>
              <p className="font-ui text-sm text-[#F2D78A] mb-4">
                A deeper journey, a richer you
              </p>
              <p className="font-ui text-xs text-[#CFC5B5] leading-relaxed mb-6">
                Go beyond the everyday. Unlock the full Solenne experience and build a more meaningful life.
              </p>

              {/* Price: Updated strictly to ₹199 / month */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-display text-5xl font-light text-[#FFF8E1]">₹199</span>
                <span className="font-ui text-xs text-[#9AA8B0]">/ month</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F2D78A]/20 border border-[#F2D78A]/40 text-[#F2D78A] font-ui text-[11px] font-medium">
                  Early Access
                </span>
              </div>
              <p className="font-ui text-[11px] text-[#F2D78A]/80 mb-6 pb-6 border-b border-white/10">
                Early Access Pricing • Cancel anytime
              </p>

              {/* Features List */}
              <ul className="space-y-3.5 mb-8">
                {premiumFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 font-ui text-xs sm:text-sm text-[#FFF8E1]">
                    <span className="w-4 h-4 rounded-full bg-[#F2D78A] text-[#0B0F14] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-sm">
                      ✓
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setShowWaitlistModal(true)}
              className="w-full py-4 rounded-full bg-[#F2D78A] hover:bg-[#FFB86B] text-[#0B0F14] font-ui text-sm font-semibold text-center shadow-[0_0_25px_rgba(242,215,138,0.45)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Join the Waitlist →
            </button>
          </div>

          {/* Right Floating Quote & Feather Accent (2 cols) */}
          <div className="lg:col-span-2 hidden lg:flex flex-col justify-between py-6 space-y-12">
            <div>
              <p className="font-serif italic text-sm text-[#F2D78A]/90 leading-snug">
                Start Free.<br />
                Go Deeper<br />
                When You&apos;re Ready. ♡
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-3xl text-[#F2D78A]/40">🪶</div>
              <blockquote className="font-display italic text-sm text-[#CFC5B5] leading-relaxed">
                &ldquo;Not just an AI. A companion for a more meaningful life.&rdquo;
              </blockquote>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10 text-xs font-ui text-[#9AA8B0]">
              <div className="flex items-center gap-2">
                <span>〰️</span>
                <span>More depth</span>
              </div>
              <div className="flex items-center gap-2">
                <span>♡</span>
                <span>More support</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✨</span>
                <span>More of you</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 Trust & Philosophy Badges ─────────────────────────────────── */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustBadges.map((badge) => (
            <div
              key={badge.title}
              className="p-6 rounded-2xl bg-[#09141D]/70 border border-white/10 flex items-start gap-4 hover:border-[#F2D78A]/30 transition-colors"
            >
              <div className="shrink-0 p-2.5 rounded-xl bg-[#0C1B25] border border-white/5">
                {badge.icon}
              </div>
              <div>
                <h4 className="font-ui text-sm font-semibold text-[#FFF8E1] mb-1">
                  {badge.title}
                </h4>
                <p className="font-ui text-xs text-[#9AA8B0]">
                  {badge.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonial Banner Section ──────────────────────────────────── */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-10 py-12">
        <div className="relative rounded-3xl overflow-hidden border border-white/15 min-h-[220px] flex items-center shadow-2xl">
          <Image
            src="/pricing/testimonial_bg.jpg"
            alt="Candlelit warm wooden desk with books"
            fill
            quality={95}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B10]/95 via-[#050B10]/85 to-[#050B10]/70" />

          <div className="relative z-10 p-8 sm:p-12 w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-md">
              <h3 className="font-display text-2xl sm:text-3xl text-[#FFF8E1] font-light leading-snug">
                &ldquo;The best investment I&apos;ve made in myself.&rdquo;
              </h3>
            </div>

            <div className="max-w-md space-y-3">
              <p className="font-ui text-xs sm:text-sm text-[#CFC5B5] leading-relaxed">
                &ldquo;It&apos;s more than the features — it&apos;s how Solenne makes me feel. More grounded. More hopeful. More myself.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#F2D78A]/20 border border-[#F2D78A]/40 flex items-center justify-center text-[10px] text-[#F2D78A] font-bold">
                  ES
                </div>
                <span className="font-ui text-[11px] uppercase tracking-widest text-[#9AA8B0]">
                  Early User (Beta)
                </span>
              </div>
            </div>

            <div className="hidden lg:block text-right">
              <span className="font-serif italic text-sm text-[#F2D78A]/90">
                Same Human<br />Different Brighter ♡
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Panoramic Bottom CTA Banner ─────────────────────────────────── */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-10 py-16 sm:py-24">
        <div className="relative rounded-3xl overflow-hidden border border-[#F2D78A]/25 min-h-[380px] sm:min-h-[420px] flex items-center shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
          <Image
            src="/pricing/cta_bg.jpg"
            alt="Panoramic alpine ridges with warm lanterns at twilight"
            fill
            quality={95}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B10]/95 via-[#050B10]/80 to-[#050B10]/60" />

          <div className="relative z-10 p-8 sm:p-14 lg:p-16 max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#FFF8E1] leading-tight mb-4">
              Your Next Chapter Can Be Brighter
            </h2>

            <p className="font-ui text-sm sm:text-base text-[#CFC5B5] mb-8 leading-relaxed">
              Start free today. Upgrade when you&apos;re ready. Experience a gentler, more compassionate relationship with yourself.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <Link
                href="/signup"
                className="font-ui text-sm sm:text-base font-semibold text-[#FFF8E1] border border-white/30 hover:border-[#F2D78A] rounded-full px-7 py-3.5 transition-all"
              >
                Start for Free →
              </Link>

              <button
                type="button"
                onClick={() => setShowWaitlistModal(true)}
                className="font-ui text-sm sm:text-base font-semibold text-[#0B0F14] bg-[#F2D78A] hover:bg-[#FFB86B] rounded-full px-7 py-3.5 shadow-[0_0_25px_rgba(242,215,138,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Join the Waitlist →
              </button>

              <span className="font-serif italic text-[#F2D78A]/90 text-xs sm:text-sm">
                A kinder you is a brighter tomorrow ♡
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Global Footer ──────────────────────────────────────────────── */}
      <footer className="relative z-30 w-full border-t border-[#F2D78A]/15 bg-[#050B10]/95 py-8">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-ui text-[#CFC5B5]">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <BrandLogo size="sm" href="/" />
            <nav className="flex items-center gap-6 text-[#9AA8B0]" aria-label="Footer navigation">
              <Link href="/" className="hover:text-[#F2D78A] transition-colors">Home</Link>
              <Link href="/about" className="hover:text-[#F2D78A] transition-colors">About</Link>
              <Link href="/features" className="hover:text-[#F2D78A] transition-colors">Features</Link>
              <Link href="/stories" className="hover:text-[#F2D78A] transition-colors">Stories</Link>
              <Link href="/pricing" className="text-[#F2D78A] font-medium transition-colors">Pricing</Link>
            </nav>
          </div>

          <div>
            <span>© 2026 Solenne. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* ── Interactive Waitlist Modal ──────────────────────────────────── */}
      {showWaitlistModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowWaitlistModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-[#0B0F14] border border-[#F2D78A]/40 shadow-2xl p-8 text-left"
          >
            <button
              type="button"
              onClick={() => setShowWaitlistModal(false)}
              className="absolute top-5 right-5 text-[#9AA8B0] hover:text-[#FFF8E1]"
            >
              ✕
            </button>

            <span className="font-ui text-xs uppercase tracking-widest text-[#F2D78A] font-semibold block mb-2">
              Early Access — ₹199 / month
            </span>
            <h3 className="font-display text-2xl text-[#FFF8E1] mb-2 font-light">
              Join the Solenne Premium Waitlist
            </h3>
            <p className="font-ui text-xs text-[#CFC5B5] mb-6 leading-relaxed">
              Lock in the founding early-access rate of ₹199/month. We&apos;ll notify you the moment your spot opens.
            </p>

            {waitlistSuccess ? (
              <div className="p-4 rounded-xl bg-[#F2D78A]/10 border border-[#F2D78A]/40 text-center">
                <span className="text-[#F2D78A] font-semibold text-sm">
                  You&apos;re on the list! Welcome to the journey. ♡
                </span>
              </div>
            ) : (
              <form onSubmit={handleJoinWaitlist} className="space-y-4">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-full bg-[#08131B] border border-white/20 text-xs font-ui text-[#FFF8E1] focus:outline-none focus:border-[#F2D78A]"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#F2D78A] text-[#0B0F14] font-ui font-semibold text-xs hover:bg-[#FFB86B] transition-all"
                >
                  Confirm Waitlist Spot →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
