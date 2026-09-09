"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "How it works", href: "#how-it-works" },
    { label: "Experiences", href: "#experiences" },
    { label: "Safety", href: "#safety" },
    { label: "Pricing", href: "#pricing" },
    { label: "Blog", href: "#experiences" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#050B10]/80 border-b border-[#D9A441]/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Mark & Wordmark */}
        <BrandLogo href="/" />

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#CFC5B5]"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#F5EBD6] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions: Sign In + Enter EchoSoul CTA (Matching Reference) */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-[#F5EBD6] px-5 py-2 rounded-full border border-[#D9A441]/30 bg-[#0C1B25]/60 hover:bg-[#102531] hover:border-[#D9A441]/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9]"
          >
            Sign in
          </Link>
          <Button
            variant="primary"
            size="md"
            href="/signup"
            icon={
              <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            }
          >
            Enter EchoSoul
          </Button>
        </div>

        {/* Mobile Actions & Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            href="/signup"
            className="text-xs px-3 py-1.5"
          >
            Enter
          </Button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#CFC5B5] hover:text-[#F5EBD6] hover:bg-[#0C1B25] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 bg-[#050B10]/95 border-b border-[#D9A441]/20 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-medium text-[#CFC5B5] hover:text-[#F5EBD6] hover:bg-[#0C1B25]"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-[#D9A441]/15 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full border border-[#D9A441]/30 text-sm font-medium text-[#F5EBD6] hover:bg-[#0C1B25]"
            >
              Sign in
            </Link>
            <Button
              variant="primary"
              size="md"
              href="/signup"
              fullWidth
              onClick={() => setMobileMenuOpen(false)}
            >
              Enter EchoSoul
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
