import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Footer() {
  return (
    <footer className="bg-[#050B10] border-t border-[#D9A441]/15 relative z-10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#D9A441]/10">
          {/* Col 1: Brand & Provenance */}
          <div className="md:col-span-5 space-y-4">
            <BrandLogo size={42} />
            <p className="font-ui text-sm text-[#CFC5B5] max-w-sm leading-relaxed pt-2">
              An intimate AI emotional companion that listens without judgment,
              preserves authentic literature, and weaves your thoughts into the living
              novel of your life.
            </p>
            <div className="text-xs text-[#9AA8B0] font-medium pt-1">
              <span>A </span>
              <strong className="text-[#F5EBD6]">Concept Genius</strong>
              <span> startup project.</span>
            </div>
          </div>

          {/* Col 2: Sanctuaries */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#D9A441]">
              Sanctuaries
            </h4>
            <ul className="space-y-2 text-sm text-[#CFC5B5]">
              <li>
                <a href="#experiences" className="hover:text-[#F5EBD6] transition-colors">
                  Authentic Literature
                </a>
              </li>
              <li>
                <a href="#experiences" className="hover:text-[#F5EBD6] transition-colors">
                  Listening Presence
                </a>
              </li>
              <li>
                <a href="#experiences" className="hover:text-[#F5EBD6] transition-colors">
                  Living Scenes
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#F5EBD6] transition-colors">
                  The Life Novel
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Ethical Commitments */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#D9A441]">
              Ethics & Trust
            </h4>
            <ul className="space-y-2 text-sm text-[#CFC5B5]">
              <li>
                <a href="#safety" className="hover:text-[#F5EBD6] transition-colors">
                  Non-Clinical Boundaries
                </a>
              </li>
              <li>
                <a href="#safety" className="hover:text-[#F5EBD6] transition-colors">
                  Zero AI Model Training
                </a>
              </li>
              <li>
                <a href="#safety" className="hover:text-[#F5EBD6] transition-colors">
                  Memory Ownership & Purge
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#F5EBD6] transition-colors">
                  Dignity-First Monetization
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Ethical Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9AA8B0]">
          <p>
            &copy; {new Date().getFullYear()} EchoSoul. All rights reserved. Made with reverence by Concept Genius.
          </p>
          <div className="flex items-center gap-6">
            <a href="#safety" className="hover:text-[#F5EBD6] transition-colors">
              Privacy & Data Rights
            </a>
            <a href="#safety" className="hover:text-[#F5EBD6] transition-colors">
              Ethical Terms
            </a>
            <Link href="/login" className="text-[#D9A441] hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
