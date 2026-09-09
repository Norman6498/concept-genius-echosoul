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
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#050B10]/75 border-b border-[#D9A441]/15 transition-all">
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
              key={link.href}
              href={link.href}
              className="hover:text-[#F5EBD6] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions: Sign In + Begin Your Journey CTA */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/login"
            className="text-sm font-medium text-[#CFC5B5] hover:text-[#F5EBD6] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] rounded px-2 py-1"
          >
            Sign in
          </Link>
          <Button
            variant="primary"
            size="md"
            href="/signup"
            className="shadow-[0_4px_24px_rgba(217,164,65,0.3)]"
          >
            Begin your journey
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            href="/signup"
            className="text-[11px] px-2.5 py-1"
          >
            Begin
          </Button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-[#CFC5B5] hover:text-[#F5EBD6] hover:bg-[#0C1B25] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9]"
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
        <div className="md:hidden bg-[#07131B]/95 backdrop-blur-xl border-b border-[#D9A441]/20 px-4 pt-4 pb-6 space-y-4 animate-in fade-in duration-200">
          <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#CFC5B5] hover:text-[#F5EBD6] px-3 py-2 rounded-lg hover:bg-[#0C1B25]/60 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-[#D9A441]/15 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-sm font-medium text-[#CFC5B5] hover:text-[#F5EBD6] py-2"
            >
              Sign in
            </Link>
            <Button
              variant="primary"
              size="md"
              fullWidth
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
            >
              Begin your journey
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
