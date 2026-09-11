"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { IconSet } from "@/components/ui/IconSet";

interface AuthRealmProps {
  initialMode?: "signup" | "login";
}

const CAROUSEL_SLIDES = [
  {
    quote: "Not just an AI. A companion for your becoming.",
    author: "EchoSoul Sanctuary",
  },
  {
    quote: "Where your feelings aren't problems to fix, but stories to honor.",
    author: "Quiet Reflection",
  },
  {
    quote: "Real literature, music, and quiet wisdom when you need it most.",
    author: "Timeless Words",
  },
  {
    quote: "Your memories, your growth, held safely without judgment.",
    author: "The Journey",
  },
];

export function AuthRealm({ initialMode = "signup" }: AuthRealmProps) {
  const [mode, setMode] = useState<"signup" | "login">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Persist name for onboarding personalization
    if (name.trim()) {
      try {
        const existing = localStorage.getItem("echosoul_user_personalization");
        const parsed = existing ? JSON.parse(existing) : {};
        parsed.name = name.trim();
        localStorage.setItem("echosoul_user_personalization", JSON.stringify(parsed));
      } catch {
        // Ignore
      }
    }

    // Provide friendly simulated feedback and redirect to Page 3 Onboarding
    setTimeout(() => {
      setIsLoading(false);
      setMessage({
        type: "success",
        text: mode === "signup"
          ? "Welcome to your realm, " + (name || "friend") + ". Entering Step 1..."
          : "Welcome back. Opening your personalized space...",
      });
      setTimeout(() => {
        window.location.href = "/onboarding";
      }, 1000);
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0B0F14] text-[#FFF8E1] overflow-x-hidden select-none flex flex-col justify-between">
      {/* ── Background Visual Artwork (Clean with 0 duplicate text/boxes) ──────── */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 pointer-events-none"
        style={{
          backgroundImage: "url('/page2-clean.png')",
          backgroundPosition: "center center",
          backgroundSize: "cover",
        }}
      >
        {/* Soft atmospheric depth vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F14]/65 via-transparent to-[#0B0F14]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14]/70 via-transparent to-[#0B0F14]/40" />

        {/* Twinkling ambient star lights over the celestial window */}
        <div className="absolute top-[12%] left-[42%] w-1.5 h-1.5 rounded-full bg-white animate-star-twinkle shadow-[0_0_8px_white]" />
        <div className="absolute top-[8%] left-[46%] w-1 h-1 rounded-full bg-[#F2D78A] animate-star-twinkle shadow-[0_0_6px_#F2D78A]" style={{ animationDelay: "1.2s" }} />
        <div className="absolute top-[18%] left-[48%] w-1.5 h-1.5 rounded-full bg-white animate-star-twinkle shadow-[0_0_8px_white]" style={{ animationDelay: "2.4s" }} />
        <div className="absolute top-[14%] left-[38%] w-1 h-1 rounded-full bg-[#90E0EF] animate-star-twinkle shadow-[0_0_6px_#90E0EF]" style={{ animationDelay: "0.7s" }} />

        {/* Ambient Candle & Lantern warmth glow */}
        <div className="absolute bottom-[28%] left-[11%] w-24 h-24 rounded-full bg-[#FFB86B]/20 blur-2xl es-lamp-glow pointer-events-none" />
      </div>

      {/* ── Header Layer (80px height) ─────────────────────────────────── */}
      <header className="relative z-20 w-full max-w-[1440px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        {/* Brand Logo & Back to Home */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <BrandLogo size="md" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-ui text-xs sm:text-sm text-[#CFC5B5] hover:text-[#F2D78A] transition-colors group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F2D78A] rounded"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Right Switcher CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden sm:inline font-ui text-sm text-[#CFC5B5]">
            {mode === "signup" ? "Already have an account?" : "Don't have an account?"}
          </span>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "login" : "signup");
              setMessage(null);
            }}
            className="font-ui text-xs sm:text-sm font-medium text-[#FFF8E1] hover:text-[#F2D78A] border border-white/30 hover:border-[#F2D78A]/80 rounded-full px-5 sm:px-6 py-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D78A] shadow-sm hover:shadow-[0_0_15px_rgba(242,215,138,0.2)]"
          >
            {mode === "signup" ? "Sign in" : "Sign up"}
          </button>
        </div>
      </header>

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <main className="relative z-20 w-full max-w-[1440px] mx-auto px-6 sm:px-10 py-6 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* LEFT COLUMN: Editorial Headline, Subtitle, Lao Tzu Quote & Carousel */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 pr-0 lg:pr-6">
            {/* Headline — Playfair / Cormorant Display 72px */}
            <div>
              <h1 className="font-display font-normal text-[#FFF8E1] text-5xl sm:text-6xl lg:text-[74px] leading-[1.06] tracking-tight">
                Same you.<br />
                <span className="italic text-[#F2D78A]">A deeper</span><br />
                tomorrow.
              </h1>

              {/* Subheading */}
              <p className="mt-5 font-ui text-sm sm:text-base lg:text-[17px] text-[#CFC5B5] font-light leading-relaxed max-w-[480px]">
                Join EchoSoul, and take the first step towards understanding, healing, and becoming the story you&apos;re proud of.
              </p>
            </div>

            {/* Lao Tzu Quote Block */}
            <div className="relative pl-5 border-l-2 border-[#F2D78A]/40 max-w-[460px] py-1">
              <p className="font-display italic text-lg sm:text-xl text-[#FFF8E1] leading-snug">
                &ldquo;A journey of a thousand miles begins with a single conversation.&rdquo;
              </p>
              <p className="font-ui text-xs sm:text-sm text-[#F2D78A] font-medium mt-2">
                — Lao Tzu
              </p>
            </div>

            {/* Bottom Left Carousel with Dots & Arrows */}
            <div className="pt-4 sm:pt-8 flex flex-col gap-3">
              <div className="flex items-center gap-4">
                {/* 4 Carousel Indicator Dots */}
                <div className="flex items-center gap-2">
                  {CAROUSEL_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentSlide(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`transition-all duration-300 rounded-full ${
                        currentSlide === i
                          ? "w-2.5 h-2.5 bg-[#F2D78A] shadow-[0_0_8px_#F2D78A]"
                          : "w-2 h-2 border border-[#9AA8B0]/50 hover:border-[#FFF8E1]"
                      }`}
                    />
                  ))}
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="w-8 h-8 rounded-full border border-white/20 hover:border-[#F2D78A] text-[#FFF8E1] hover:text-[#F2D78A] flex items-center justify-center transition-colors focus:outline-none"
                  >
                    <span className="text-sm">←</span>
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="w-8 h-8 rounded-full border border-white/20 hover:border-[#F2D78A] text-[#FFF8E1] hover:text-[#F2D78A] flex items-center justify-center transition-colors focus:outline-none"
                  >
                    <span className="text-sm">→</span>
                  </button>
                </div>

                {/* Counter */}
                <span className="font-ui text-xs text-[#9AA8B0] font-mono tracking-wider">
                  {currentSlide + 1} / {CAROUSEL_SLIDES.length}
                </span>
              </div>

              {/* Dynamic Slide Reflection */}
              <div className="min-h-[36px]">
                <p className="font-display italic text-sm sm:text-base text-[#F2D78A]/90 es-fade-up">
                  &ldquo;{CAROUSEL_SLIDES[currentSlide].quote}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* CENTER-RIGHT: Floating Auth Card (Glassmorphic Modal) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[440px] rounded-[24px] p-7 sm:p-9 bg-[#0C1B25]/98 backdrop-blur-2xl border border-[#F2D78A]/30 shadow-[0_24px_64px_rgba(0,0,0,0.95),0_0_30px_rgba(242,215,138,0.15)] transition-all">

              {/* Top Moon & Cosmic Star Crest */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative w-14 h-14 flex items-center justify-center mb-3">
                  {/* Glowing background halo */}
                  <div className="absolute inset-0 rounded-full bg-[#F2D78A]/20 blur-xl es-moon-glow" />
                  <svg viewBox="0 0 54 54" fill="none" className="w-full h-full relative z-10 drop-shadow-[0_0_12px_rgba(242,215,138,0.5)]">
                    <circle cx="27" cy="27" r="25" stroke="#F2D78A" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                    <circle cx="27" cy="27" r="19" stroke="#F2D78A" strokeWidth="0.8" opacity="0.3" />
                    {/* Crescent moon */}
                    <path
                      d="M33 17a12 12 0 1 1-15 15 9 9 0 0 0 15-15z"
                      fill="url(#goldGradAuth)"
                    />
                    {/* Tiny star */}
                    <circle cx="23" cy="18" r="1.5" fill="#FFF8E1" />
                    <defs>
                      <linearGradient id="goldGradAuth" x1="18" y1="17" x2="33" y2="32" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FFF8E1" />
                        <stop offset="0.6" stopColor="#F2D78A" />
                        <stop offset="1" stopColor="#D9A441" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <span className="font-ui text-xs uppercase tracking-[0.24em] text-[#CFC5B5] font-medium">
                  {mode === "signup" ? "Welcome to" : "Welcome back to"}
                </span>
                <h2 className="font-display text-3xl sm:text-4xl text-[#FFF8E1] font-normal tracking-tight mt-1">
                  EchoSoul
                </h2>
                <p className="font-ui text-xs sm:text-[13px] text-[#9AA8B0] mt-1.5">
                  {mode === "signup"
                    ? "Create your account and enter your realm."
                    : "Enter your credentials to return to your sanctuary."}
                </p>
              </div>

              {/* Social Login Options */}
              <div className="space-y-2.5">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => {
                    setMessage({ type: "success", text: "Connecting to Google..." });
                    setTimeout(() => { window.location.href = "/onboarding"; }, 800);
                  }}
                  className="w-full h-11 px-4 rounded-xl border border-white/15 hover:border-[#F2D78A]/50 bg-[#08131B]/70 hover:bg-[#102531] flex items-center justify-center gap-3 transition-all duration-200 text-xs sm:text-sm font-medium text-[#FFF8E1] shadow-sm hover:shadow-[0_0_12px_rgba(242,215,138,0.12)] focus:outline-none"
                >
                  <IconSet name="google" className="w-4 h-4" />
                  <span>Continue with Google</span>
                </button>

                {/* Apple */}
                <button
                  type="button"
                  onClick={() => {
                    setMessage({ type: "success", text: "Connecting to Apple..." });
                    setTimeout(() => { window.location.href = "/onboarding"; }, 800);
                  }}
                  className="w-full h-11 px-4 rounded-xl border border-white/15 hover:border-[#F2D78A]/50 bg-[#08131B]/70 hover:bg-[#102531] flex items-center justify-center gap-3 transition-all duration-200 text-xs sm:text-sm font-medium text-[#FFF8E1] shadow-sm hover:shadow-[0_0_12px_rgba(242,215,138,0.12)] focus:outline-none"
                >
                  <IconSet name="apple" className="w-4 h-4 text-white" />
                  <span>Continue with Apple</span>
                </button>

                {/* Email (quick toggle) */}
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("auth-email-input");
                    el?.focus();
                  }}
                  className="w-full h-11 px-4 rounded-xl border border-white/15 hover:border-[#F2D78A]/50 bg-[#08131B]/70 hover:bg-[#102531] flex items-center justify-center gap-3 transition-all duration-200 text-xs sm:text-sm font-medium text-[#FFF8E1] shadow-sm hover:shadow-[0_0_12px_rgba(242,215,138,0.12)] focus:outline-none"
                >
                  <IconSet name="email" className="w-4 h-4 text-[#F2D78A]" />
                  <span>Continue with Email</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-5 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <span className="relative px-3 bg-[#0C1B25] text-[11px] uppercase tracking-widest text-[#9AA8B0]">
                  or
                </span>
              </div>

              {/* Notification Banner */}
              {message && (
                <div className={`mb-4 p-3 rounded-lg text-xs font-ui ${
                  message.type === "success"
                    ? "bg-[#8DBA8F]/15 border border-[#8DBA8F]/40 text-[#8DBA8F]"
                    : "bg-[#D97777]/15 border border-[#D97777]/40 text-[#D97777]"
                }`}>
                  {message.text}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Your name (only in signup mode) */}
                {mode === "signup" && (
                  <div>
                    <label className="block font-ui text-xs text-[#CFC5B5] mb-1.5">
                      Your name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9AA8B0]">
                        <IconSet name="user" className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Pratik Singh"
                        className="w-full h-11 pl-10 pr-3.5 input-field-dark text-xs sm:text-sm font-ui"
                      />
                    </div>
                  </div>
                )}

                {/* Email address */}
                <div>
                  <label className="block font-ui text-xs text-[#CFC5B5] mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9AA8B0]">
                      <IconSet name="email" className="w-4 h-4" />
                    </span>
                    <input
                      id="auth-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-11 pl-10 pr-3.5 input-field-dark text-xs sm:text-sm font-ui"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block font-ui text-xs text-[#CFC5B5] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9AA8B0]">
                      <IconSet name="lock" className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="w-full h-11 pl-10 pr-10 input-field-dark text-xs sm:text-sm font-ui"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9AA8B0] hover:text-[#FFF8E1] focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <IconSet name={showPassword ? "eye-off" : "eye"} className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 h-12 rounded-full font-ui text-sm font-semibold bg-[#F2D78A] hover:bg-[#FFB86B] text-[#0B0F14] transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(242,215,138,0.35)] hover:shadow-[0_0_35px_rgba(242,215,138,0.55)] hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D78A]"
                >
                  {isLoading ? (
                    <span>Entering your realm...</span>
                  ) : (
                    <>
                      <span>{mode === "signup" ? "Create my account" : "Sign in to EchoSoul"}</span>
                      <span className="text-base">→</span>
                    </>
                  )}
                </button>
              </form>

              {/* Legal disclaimer */}
              <p className="font-ui text-[11px] text-[#9AA8B0] text-center mt-5 leading-normal">
                By creating an account, you agree to our{" "}
                <Link href="#terms" className="text-[#F2D78A] hover:underline underline-offset-2">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#privacy" className="text-[#F2D78A] hover:underline underline-offset-2">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: 5 Features vertical badges + Handwritten note */}
          <div className="hidden xl:flex xl:col-span-1 flex-col items-center justify-between gap-6 py-4">
            <div className="flex flex-col items-center gap-7">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center gap-1.5 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#0C1B25]/80 border border-[#F2D78A]/20 flex items-center justify-center text-[#F2D78A] group-hover:border-[#F2D78A] group-hover:scale-105 transition-all shadow-sm">
                  <IconSet name="chat" className="w-5 h-5" />
                </div>
                <span className="font-ui text-[11px] text-[#CFC5B5] max-w-[70px] leading-tight">
                  A safe space to talk
                </span>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center gap-1.5 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#0C1B25]/80 border border-[#F2D78A]/20 flex items-center justify-center text-[#F2D78A] group-hover:border-[#F2D78A] group-hover:scale-105 transition-all shadow-sm">
                  <IconSet name="book" className="w-5 h-5" />
                </div>
                <span className="font-ui text-[11px] text-[#CFC5B5] max-w-[70px] leading-tight">
                  Real words that heal
                </span>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center gap-1.5 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#0C1B25]/80 border border-[#F2D78A]/20 flex items-center justify-center text-[#F2D78A] group-hover:border-[#F2D78A] group-hover:scale-105 transition-all shadow-sm">
                  <IconSet name="music" className="w-5 h-5" />
                </div>
                <span className="font-ui text-[11px] text-[#CFC5B5] max-w-[70px] leading-tight">
                  Music for your mind
                </span>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-center text-center gap-1.5 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#0C1B25]/80 border border-[#F2D78A]/20 flex items-center justify-center text-[#F2D78A] group-hover:border-[#F2D78A] group-hover:scale-105 transition-all shadow-sm">
                  <IconSet name="visual" className="w-5 h-5" />
                </div>
                <span className="font-ui text-[11px] text-[#CFC5B5] max-w-[70px] leading-tight">
                  Visual worlds to explore
                </span>
              </div>

              {/* Feature 5 */}
              <div className="flex flex-col items-center text-center gap-1.5 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#0C1B25]/80 border border-[#F2D78A]/20 flex items-center justify-center text-[#F2D78A] group-hover:border-[#F2D78A] group-hover:scale-105 transition-all shadow-sm">
                  <IconSet name="heart" className="w-5 h-5" />
                </div>
                <span className="font-ui text-[11px] text-[#CFC5B5] max-w-[70px] leading-tight">
                  Your story remembered
                </span>
              </div>
            </div>

            {/* Handwritten Note accent at bottom right */}
            <div className="text-center pt-2">
              <span className="font-display italic text-[#F2D78A] text-xl tracking-wide opacity-85">
                More than an AI.
              </span>
            </div>
          </div>

        </div>
      </main>

      {/* ── Bottom Trust & Safety Bar ─────────────────────────────────── */}
      <footer className="relative z-20 w-full border-t border-[#F2D78A]/15 bg-[#08131B]/80 backdrop-blur-md py-4">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-ui text-[#CFC5B5]">
          {/* Trust Pillar 1 */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0C1B25] border border-[#F2D78A]/30 flex items-center justify-center text-[#F2D78A]">
              <IconSet name="secure" className="w-4 h-4" />
            </div>
            <span>Your data stays private and secure</span>
          </div>

          {/* Trust Pillar 2 */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0C1B25] border border-[#F2D78A]/30 flex items-center justify-center text-[#F2D78A]">
              <IconSet name="control" className="w-4 h-4" />
            </div>
            <span>You control what is remembered</span>
          </div>

          {/* Trust Pillar 3 */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0C1B25] border border-[#F2D78A]/30 flex items-center justify-center text-[#F2D78A]">
              <IconSet name="support" className="w-4 h-4" />
            </div>
            <span>A supportive space, not a replacement for professional care</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
