"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { IconSet } from "@/components/ui/IconSet";

// ── Navbar ────────────────────────────────────────────────────────────────────
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Home",        href: "/" },
    { label: "About",       href: "/about" },
    { label: "Features",    href: "/features" },
    { label: "Stories",     href: "/stories" },
    { label: "Pricing",     href: "/pricing" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0B0F14]/92 backdrop-blur-md border-b border-[#F2D78A]/15" : "bg-transparent"
      }`}
      style={{ height: "80px" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
        {/* Brand */}
        <BrandLogo size="md" />

        {/* Desktop Nav Links — Inter Medium 16px, gap 36px */}
        <nav className="hidden md:flex items-center gap-9 font-ui text-[15px] font-medium text-[#CFC5B5]" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#F2D78A] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D78A] rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Secondary — Ghost / Outline, height 44px */}
          <Link
            href="/login"
            className="font-ui text-[15px] font-medium text-[#FFF8E1] border border-white/30 hover:border-[#F2D78A]/80 rounded-full px-7 h-11 flex items-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D78A] hover:text-[#F2D78A]"
          >
            Sign in
          </Link>

          {/* Primary — Gold Filled, height 44px, padding 24px 32px */}
          <Link
            href="/signup"
            className="font-ui text-[15px] font-semibold bg-[#F2D78A] hover:bg-[#FFB86B] text-[#0B0F14] rounded-full h-11 px-8 flex items-center gap-2 transition-all duration-200 shadow-[0_0_20px_rgba(242,215,138,0.35)] hover:shadow-[0_0_30px_rgba(242,215,138,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D78A]"
          >
            Enter Solenne
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 text-[#CFC5B5] hover:text-[#FFF8E1] focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0B0F14]/98 border-b border-[#F2D78A]/20 px-6 py-5 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block font-ui text-base font-medium text-[#CFC5B5] hover:text-[#FFF8E1] py-2"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-[#F2D78A]/15 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileOpen(false)} className="w-full text-center font-ui text-sm font-medium text-[#FFF8E1] border border-white/30 rounded-full py-2.5">Sign in</Link>
            <Link href="/signup" onClick={() => setMobileOpen(false)} className="w-full text-center font-ui text-sm font-semibold bg-[#F2D78A] text-[#0B0F14] rounded-full py-2.5">Enter Solenne →</Link>
          </div>
        </div>
      )}
    </header>
  );
}

// ── Story Modal ───────────────────────────────────────────────────────────────
function StoryModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="The Solenne Story"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0F14]/85 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="glass-panel max-w-xl w-full p-8 sm:p-10 border border-[#F2D78A]/40 shadow-[0_24px_64px_rgba(0,0,0,0.85)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9AA8B0] hover:text-[#FFF8E1] p-1.5 rounded-lg focus:outline-none"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <span className="font-ui text-xs uppercase tracking-[0.22em] font-semibold text-[#F2D78A] block mb-2">The Solenne Origin Story</span>
        <h3 className="font-display text-3xl sm:text-4xl text-[#FFF8E1] font-normal mb-5">Why We Built a Kinder Space</h3>

        <div className="space-y-4 font-ui text-sm text-[#CFC5B5] leading-relaxed">
          <p>In a world that demands instant answers, endless productivity, and hurried solutions, most people don&apos;t need another analytical dashboard.</p>
          <p>They need a quiet room. A place to exhale without judgment. A companion that knows when to offer silence, when to offer timeless literature that honours their exact feelings.</p>
          <div className="p-4 rounded-xl bg-[#08131B] border border-[#F2D78A]/20 italic text-[#F2D78A] font-display text-lg">
            &ldquo;Sometimes the right words find you at exactly the right time.&rdquo;
          </div>
        </div>

        <div className="mt-7 flex justify-end">
          <button
            onClick={onClose}
            className="font-ui text-sm font-semibold bg-[#F2D78A] hover:bg-[#FFB86B] text-[#0B0F14] rounded-full px-6 py-2.5 transition-colors"
          >
            Close &amp; Explore
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────
export function HeroPage() {
  const [showModal, setShowModal] = useState(false);

  const featurePillars = [
    { icon: "chat" as const,    label: "A safe space to talk",     sub: "Always here for you." },
    { icon: "book" as const,    label: "Real words that heal",     sub: "Timeless wisdom." },
    { icon: "music" as const,   label: "Music for your mind",      sub: "Curated for you." },
    { icon: "visual" as const,  label: "Visual worlds to explore", sub: "Immerse and reflect." },
    { icon: "heart" as const,   label: "Your story remembered",    sub: "A more meaningful you." },
  ];

  return (
    <>
      {showModal && <StoryModal onClose={() => setShowModal(false)} />}

      {/* ── Hero Viewport ───────────────────────────────────────────── */}
      <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">

        {/* BACKGROUND ARTWORK: High-Resolution Visual Artwork (Clean with 0 duplicate text) */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: "url('/page1-clean.png')",
            backgroundPosition: "center 25%",
            backgroundSize: "cover",
          }}
        >
          {/* Subtle atmospheric vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F14]/60 via-transparent to-[#0B0F14]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-[#0B0F14]/40" />

          {/* Twinkling ambient celestial stars */}
          <div className="absolute top-[8%] left-[22%] w-1.5 h-1.5 rounded-full bg-white animate-star-twinkle shadow-[0_0_8px_white]" />
          <div className="absolute top-[12%] left-[35%] w-1 h-1 rounded-full bg-[#F2D78A] animate-star-twinkle shadow-[0_0_6px_#F2D78A]" style={{ animationDelay: "1s" }} />
          <div className="absolute top-[6%] left-[68%] w-1.5 h-1.5 rounded-full bg-white animate-star-twinkle shadow-[0_0_8px_white]" style={{ animationDelay: "2s" }} />
          <div className="absolute top-[15%] left-[82%] w-1 h-1 rounded-full bg-[#90E0EF] animate-star-twinkle shadow-[0_0_6px_#90E0EF]" style={{ animationDelay: "0.5s" }} />

          {/* Glowing pulse aura on crescent moon */}
          <div className="absolute top-[7%] left-[61%] w-24 h-24 rounded-full bg-[#F2D78A]/15 blur-2xl es-moon-glow" />

          {/* Warm candle glow on right interior */}
          <div className="absolute bottom-[35%] right-[12%] w-20 h-20 rounded-full bg-[#FFB86B]/20 blur-2xl es-lamp-glow" />
        </div>

        {/* ── CONTENT LAYER ──────────────────────────────────────────── */}
        <div className="relative z-10 flex-1 flex flex-col justify-between pt-24 sm:pt-28">

          {/* Hero Main Block */}
          <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 py-6 sm:py-12 my-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

              {/* Left Column — Text content (7 cols) */}
              <div className="lg:col-span-7 space-y-6">

                {/* Headline — Cormorant / Playfair 72–96px, line-height 1.08 */}
                <h1
                  className="font-display font-normal text-[#FFF8E1] leading-[1.06] tracking-tight"
                  style={{ fontSize: "clamp(48px, 6vw, 92px)" }}
                >
                  Enter a realm<br />
                  where you can<br />
                  <span className="italic text-[#F2D78A]">finally be you.</span>
                </h1>

                {/* Subheading */}
                <p
                  className="font-ui text-[#E8DEC8] font-normal leading-[1.6]"
                  style={{ fontSize: "clamp(16px, 1.4vw, 22px)" }}
                >
                  Talk. Be understood. Discover the right words.<br className="hidden sm:inline" />
                  {" "}See your story. Find clarity. Grow.
                </p>

                {/* Description */}
                <p
                  className="font-ui text-[#CFC5B5] font-light leading-[1.7] max-w-[560px]"
                  style={{ fontSize: "clamp(14px, 1.05vw, 17px)" }}
                >
                  Solenne is your companion, teacher and guide —<br className="hidden sm:inline" />
                  bringing together meaningful conversations, real literature,<br className="hidden sm:inline" />
                  music, visuals and your life&apos;s journey in one place.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2">
                  {/* Primary — height 52px, padding 28px 36px, radius 33px */}
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2.5 font-ui font-semibold bg-[#F2D78A] hover:bg-[#FFB86B] text-[#0B0F14] rounded-full transition-all duration-200 shadow-[0_0_25px_rgba(242,215,138,0.4)] hover:shadow-[0_0_35px_rgba(242,215,138,0.6)] hover:-translate-y-0.5"
                    style={{ fontSize: "16px", height: "52px", padding: "0 36px", borderRadius: "33px" }}
                  >
                    Enter Solenne
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>

                  {/* Secondary — Watch the story */}
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-3 group focus:outline-none"
                  >
                    <span className="w-12 h-12 rounded-full border border-[#FFF8E1]/60 flex items-center justify-center text-[#FFF8E1] group-hover:border-[#F2D78A] group-hover:text-[#F2D78A] transition-all duration-200 shadow-[0_0_12px_rgba(245,235,214,0.1)] group-hover:scale-105">
                      <IconSet name="play" className="w-4 h-4 ml-0.5" />
                    </span>
                    <div className="text-left">
                      <div className="font-ui text-[15px] font-medium text-[#FFF8E1] group-hover:text-[#F2D78A] transition-colors">Watch the story</div>
                      <div className="font-ui text-[12px] text-[#9AA8B0]">2 min</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Right Column — Top-Right Quote Block (5 cols) */}
              <div className="hidden lg:flex lg:col-span-5 justify-end">
                <div className="max-w-[240px] text-right space-y-2 bg-[#0C1B25]/95 backdrop-blur-md p-4 rounded-xl border border-[#F2D78A]/20 shadow-lg">
                  <p className="font-display italic text-[#FFF8E1] leading-snug" style={{ fontSize: "clamp(15px, 1.2vw, 19px)" }}>
                    &ldquo;Sometimes the right words find you at exactly the right time.&rdquo;
                  </p>
                  <div className="w-8 h-px bg-[#F2D78A] ml-auto" />
                  <p className="font-ui text-[11px] text-[#F2D78A] tracking-wider uppercase font-medium">Solenne</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Feature Row Strip (5 items, equal spacing, centered) ───── */}
          <div className="relative z-10 w-full bg-[#08131B]/85 backdrop-blur-md border-t border-[#F2D78A]/15">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-7">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
                {featurePillars.map((pillar) => (
                  <Link
                    key={pillar.label}
                    href="/signup"
                    className="flex flex-col items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D78A] rounded-xl p-2 transition-transform hover:-translate-y-1"
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-full bg-[#0C1B25]/60 border border-[#F2D78A]/20 flex items-center justify-center text-[#F2D78A] group-hover:border-[#F2D78A] group-hover:shadow-[0_0_12px_rgba(242,215,138,0.3)] transition-all">
                      <IconSet name={pillar.icon} className="w-5 h-5" />
                    </div>
                    {/* Title */}
                    <span className="font-display text-[17px] sm:text-[18px] font-medium text-[#FFF8E1] group-hover:text-[#F2D78A] transition-colors leading-tight">
                      {pillar.label}
                    </span>
                    {/* Subtitle */}
                    <span className="font-ui text-[12px] sm:text-[13px] text-[#9AA8B0] leading-snug">
                      {pillar.sub}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
