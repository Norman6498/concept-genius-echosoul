"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/how-it-works", label: "How it works" },
    { href: "/experiences", label: "Experiences" },
    { href: "/safety", label: "Safety" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080c14]/80 backdrop-blur-xl border-b border-white/[0.06] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Mark (Crescent Moon + Leaf + EchoSoul) */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500/30 via-indigo-500/20 to-amber-300/30 border border-amber-400/40 flex items-center justify-center shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform">
            <span className="text-amber-300 text-sm font-serif-display select-none">☾</span>
          </div>
          <span className="font-serif-display text-xl font-medium tracking-wide text-slate-100 group-hover:text-amber-200 transition-colors">
            EchoSoul
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-light">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-amber-200 transition-colors tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-full transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 hover:brightness-105 active:scale-95 transition-all"
          >
            <span>Begin your journey</span>
            <ArrowRight className="h-3 w-3 ml-0.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#070b12]/95 backdrop-blur-2xl px-6 py-6 space-y-4 animate-fade-in">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base text-slate-200 py-1 font-light hover:text-amber-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 text-sm text-slate-300 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
            >
              <span>Begin your journey</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
