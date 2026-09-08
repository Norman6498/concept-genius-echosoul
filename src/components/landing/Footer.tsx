"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#05080e] py-16 text-slate-400 text-xs font-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-amber-500/30 to-indigo-500/30 border border-amber-400/40 flex items-center justify-center">
                <span className="text-amber-300 text-xs select-none">☾</span>
              </div>
              <span className="font-serif-display text-lg font-medium text-slate-100">
                EchoSoul
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              An adaptive AI emotional companion that listens, pairs genuine literature, and narrates your growth.
            </p>
            <div className="text-[11px] text-amber-300/80 font-serif-display">
              A Concept Genius Project · 2026
            </div>
          </div>

          {/* Navigation Col */}
          <div className="space-y-3">
            <h4 className="font-serif-display text-slate-200 text-sm font-medium">Sanctuary</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/how-it-works" className="hover:text-amber-200 transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="hover:text-amber-200 transition-colors">
                  Experiences
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-amber-200 transition-colors">
                  Safety & Ethics
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-amber-200 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Ethics Col */}
          <div className="space-y-3">
            <h4 className="font-serif-display text-slate-200 text-sm font-medium">Commitments</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-400">Zero AI Training on Chats</span>
              </li>
              <li>
                <span className="text-slate-400">Authentic Literature Provenance</span>
              </li>
              <li>
                <span className="text-slate-400">Client Memory Controls</span>
              </li>
              <li>
                <span className="text-slate-400">Encrypted at Rest</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Concept Genius. All rights reserved. Built with quiet care.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Designed for human peace & presence</span>
            <Heart className="h-3 w-3 text-rose-400/60 ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
}
