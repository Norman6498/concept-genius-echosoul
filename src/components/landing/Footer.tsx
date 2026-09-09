"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Footer() {
  return (
    <footer className="w-full bg-[#050B10] border-t border-[#D9A441]/20 text-[#CFC5B5] font-ui pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand Column (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo href="/" />
            <p className="text-xs sm:text-sm text-[#9AA8B0] font-light max-w-sm leading-relaxed">
              EchoSoul brings together deep listening, authentic world literature, ambient soundscapes,
              and your private life chronicle in a space designed to hold what you feel.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0C1B25] border border-[#D9A441]/25 text-xs text-[#F2C86A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F2C86A]" />
                <span className="font-medium tracking-wide">A Concept Genius Creation</span>
              </div>
            </div>
          </div>

          {/* Col 1: Sanctuaries */}
          <div>
            <h4 className="font-display text-sm text-[#F5EBD6] font-semibold uppercase tracking-wider mb-4">
              Sanctuaries
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#experiences" className="hover:text-[#F2C86A] transition-colors">
                  Speak Freely (Voice)
                </a>
              </li>
              <li>
                <a href="#experiences" className="hover:text-[#F2C86A] transition-colors">
                  Find Your Words (Literature)
                </a>
              </li>
              <li>
                <a href="#experiences" className="hover:text-[#F2C86A] transition-colors">
                  Music for the Moment
                </a>
              </li>
              <li>
                <a href="#experiences" className="hover:text-[#F2C86A] transition-colors">
                  Living Scenes & Rooms
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#F2C86A] transition-colors">
                  Your Life Novel
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Principles */}
          <div>
            <h4 className="font-display text-sm text-[#F5EBD6] font-semibold uppercase tracking-wider mb-4">
              Trust & Ethics
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#safety" className="hover:text-[#F2C86A] transition-colors">
                  Zero Model Training
                </a>
              </li>
              <li>
                <a href="#safety" className="hover:text-[#F2C86A] transition-colors">
                  Non-Clinical Charter
                </a>
              </li>
              <li>
                <a href="#safety" className="hover:text-[#F2C86A] transition-colors">
                  Data Sovereignty
                </a>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#F2C86A] transition-colors">
                  Privacy Architecture
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#F2C86A] transition-colors">
                  Terms of Sanctuary
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Crisis & Lifelines */}
          <div>
            <h4 className="font-display text-sm text-[#F5EBD6] font-semibold uppercase tracking-wider mb-4">
              Crisis & Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="text-[#F2C86A] font-semibold">
                <span>988 Lifeline (US/CA)</span>
              </li>
              <li className="text-[#F2C86A] font-semibold">
                <span>112 Emergency (EU)</span>
              </li>
              <li className="text-[#F2C86A] font-semibold">
                <span>+91 9999 666 555 (IN)</span>
              </li>
              <li className="pt-1 text-[#9AA8B0]">
                Text HOME to 741741
              </li>
              <li>
                <a href="mailto:support@echosoul.space" className="hover:text-[#F2C86A] transition-colors">
                  support@echosoul.space
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Ethical Non-Clinical Disclaimer Strip */}
        <div className="p-4 rounded-xl bg-[#08131B] border border-[#D9A441]/20 my-8 text-center text-xs text-[#9AA8B0] leading-relaxed max-w-4xl mx-auto">
          <span className="text-[#F2C86A] font-medium">Non-Clinical Notice:</span> EchoSoul is an empathetic AI sanctuary and literary space, not a medical clinic, licensed psychotherapist, or crisis helpline. If you are experiencing acute psychological distress or thoughts of harm, please reach out directly to 988 or your local medical professional.
        </div>

        {/* Bottom Copyright & Links */}
        <div className="pt-6 border-t border-[#D9A441]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9AA8B0]">
          <p>&copy; {new Date().getFullYear()} Concept Genius Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#F5EBD6] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#F5EBD6] transition-colors">
              Terms
            </Link>
            <a href="#how-it-works" className="hover:text-[#F5EBD6] transition-colors">
              Philosophy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
