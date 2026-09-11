"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function RealAboutPage() {
  const pillars = [
    {
      title: "Listen",
      subtitle: "A safe space to be yourself.",
      icon: (
        <svg className="w-5 h-5 text-[#F2D78A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      title: "Understand",
      subtitle: "We look beyond words.",
      icon: (
        <svg className="w-5 h-5 text-[#F2D78A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: "Support",
      subtitle: "Meaningful experiences for your moment.",
      icon: (
        <svg className="w-5 h-5 text-[#F2D78A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: "Grow",
      subtitle: "Your story, over time.",
      icon: (
        <svg className="w-5 h-5 text-[#F2D78A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  const stats = [
    {
      value: "100K+",
      label: "People Finding Clarity",
      icon: (
        <svg className="w-4 h-4 text-[#F2D78A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      value: "10K+",
      label: "Authentic Literary Works",
      icon: (
        <svg className="w-4 h-4 text-[#F2D78A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      value: "5K+",
      label: "Moments of Calm & Focus",
      icon: (
        <svg className="w-4 h-4 text-[#F2D78A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
    },
    {
      value: "1 Goal",
      label: "A Brighter You",
      icon: (
        <svg className="w-4 h-4 text-[#F2D78A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#050B10] text-[#FFF8E1] flex flex-col justify-between overflow-x-hidden select-none">
      {/* ── Photographic Atmosphere Layer (media_1789094812501.jpg backdrop) ── */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-right sm:bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/about-backdrop.jpg')",
          backgroundSize: "cover",
        }}
      >
        {/* Deep ambient vignette for readability on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050B10] via-[#050B10]/80 to-transparent w-full md:w-[62%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B10] via-transparent to-[#050B10]/40" />

        {/* Twinkling star lights in the night sky */}
        <div className="absolute top-[16%] right-[32%] w-1.5 h-1.5 rounded-full bg-white animate-star-twinkle shadow-[0_0_8px_white]" />
        <div className="absolute top-[22%] right-[28%] w-1 h-1 rounded-full bg-[#F2D78A] animate-star-twinkle shadow-[0_0_6px_#F2D78A]" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-[12%] right-[36%] w-1.5 h-1.5 rounded-full bg-white animate-star-twinkle shadow-[0_0_8px_white]" style={{ animationDelay: "2.5s" }} />
      </div>

      {/* ── Top Header Bar ────────────────────────────────────────────── */}
      <header className="relative z-30 w-full max-w-[1536px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        <BrandLogo size="md" />

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-9 font-ui text-[15px] font-medium text-[#CFC5B5]">
          <Link href="/" className="hover:text-[#F2D78A] transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-[#F2D78A] font-semibold border-b-2 border-[#F2D78A] pb-0.5">
            About
          </Link>
          <Link href="/#features" className="hover:text-[#F2D78A] transition-colors">
            Features
          </Link>
          <Link href="/#stories" className="hover:text-[#F2D78A] transition-colors">
            Stories
          </Link>
          <Link href="/#pricing" className="hover:text-[#F2D78A] transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Primary CTA */}
        <Link
          href="/signup"
          className="h-10 px-6 rounded-full font-ui text-sm font-semibold bg-[#F2D78A] hover:bg-[#FFB86B] text-[#0B0F14] transition-all flex items-center gap-1.5 shadow-[0_0_18px_rgba(242,215,138,0.35)]"
        >
          <span>Get Started</span>
          <span>→</span>
        </Link>
      </header>

      {/* ── Main Content Body (Single-screen composition) ─────────────── */}
      <main className="relative z-20 w-full max-w-[1536px] mx-auto px-6 sm:px-10 py-4 flex-1 flex flex-col justify-between">
        {/* Top & Middle section: Editorial narrative + Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* Left Column: Editorial philosophy */}
          <div className="lg:col-span-7 xl:col-span-6 space-y-5">
            {/* Category tag */}
            <div className="flex items-center gap-3">
              <span className="font-ui text-xs font-semibold tracking-[0.25em] text-[#F2D78A] uppercase">
                ABOUT ECHOSOUL
              </span>
              <div className="w-10 h-px bg-[#F2D78A]/40" />
            </div>

            {/* Headline */}
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[52px] leading-[1.12] text-[#FFF8E1] font-normal">
              A place for{" "}
              <span className="font-editorial italic font-normal text-[#F2D78A]">
                what you feel.
              </span>
            </h1>

            {/* Paragraphs */}
            <div className="space-y-3.5 font-ui text-sm sm:text-[15px] leading-relaxed text-[#CFC5B5] max-w-[540px]">
              <p>
                EchoSoul is more than an AI. It&apos;s a space that listens, understands,
                and grows with you — through conversations, real literature,
                music, visuals, and your personal journey.
              </p>
              <p>
                We believe everyone deserves a space to be heard without judgment,
                to find meaning in their moments, and to feel a little more human
                — every day.
              </p>
            </div>

            {/* Script sign-off */}
            <div className="flex items-center gap-3 pt-1">
              <span className="font-script text-2xl text-[#F2D78A]">
                Your story matters.
              </span>
              <div className="w-10 h-px bg-[#F2D78A]/40" />
            </div>

            {/* 4 Pillars row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
              {pillars.map((p) => (
                <div key={p.title} className="flex flex-col items-start gap-1.5">
                  <div className="w-10 h-10 rounded-full border border-[#F2D78A]/35 bg-[#0C1B25]/60 flex items-center justify-center mb-0.5 shadow-sm">
                    {p.icon}
                  </div>
                  <h3 className="font-ui text-xs font-bold text-[#FFF8E1] tracking-wide">
                    {p.title}
                  </h3>
                  <p className="font-ui text-[11px] leading-snug text-[#9AA8B0]">
                    {p.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* ── Bottom Cards & Parchment Banner ──────────────────────────── */}
        <div className="space-y-4 pt-8 pb-4">
          {/* Card row: Our Purpose + 4 Stat Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
            {/* Our Purpose card (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#08131B]/75 backdrop-blur-md p-4 sm:p-5 flex flex-col justify-between shadow-lg">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-6 h-6 rounded-full border border-[#F2D78A]/50 bg-[#F2D78A]/10 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#F2D78A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                    <circle cx="12" cy="12" r="5" strokeWidth="1.8" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <span className="font-ui text-xs font-bold text-[#FFF8E1] tracking-wide">
                  Our Purpose —
                </span>
              </div>
              <p className="font-ui text-xs leading-relaxed text-[#CFC5B5]">
                To create a world where technology feels human again.
                Where conversations lead to clarity, literature brings meaning,
                music heals, visuals inspire, and every person can write a
                kinder, deeper story for themselves.
              </p>
            </div>

            {/* 4 Stat Cards (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-[#08131B]/75 backdrop-blur-md p-3.5 flex flex-col items-center justify-center text-center shadow-lg hover:border-[#F2D78A]/35 transition-colors"
                >
                  <div className="mb-1.5">{s.icon}</div>
                  <span className="font-editorial text-lg sm:text-xl text-[#F2D78A] font-semibold leading-tight">
                    {s.value}
                  </span>
                  <span className="font-ui text-[10px] leading-tight text-[#9AA8B0] mt-1">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Parchment Quote Banner (Bottom Center) */}
          <div className="max-w-[880px] mx-auto rounded-xl overflow-hidden shadow-2xl border border-[#D4A373]/30">
            <Image
              src="/parchment-quote.png"
              alt="“Not just another AI. A companion for a more meaningful you.” — EchoSoul"
              width={1024}
              height={140}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
}
