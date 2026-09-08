"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { PrivacyIndicator } from "./PrivacyIndicator";
import { Settings, Sparkles } from "lucide-react";

export function TopBar() {
  const { profile } = useAuth();

  return (
    <header className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-4 border-b border-white/[0.06] bg-[#080c14]/60 backdrop-blur-md sticky top-0 z-20">
      {/* Mobile Brand Logo */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-amber-500/30 to-indigo-500/30 border border-amber-400/40 flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
        </div>
        <span className="font-serif-display text-base font-medium tracking-wide text-slate-100">
          EchoSoul
        </span>
      </div>

      {/* Desktop Context Title / Calm Status */}
      <div className="hidden lg:flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400/80 animate-pulse" />
        <span className="text-xs text-slate-400 font-light tracking-wide">
          Companion Sanctuary · Private & Adaptive
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <PrivacyIndicator />

        <Link
          href="/settings"
          className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/[0.06] transition-colors"
          title="Profile & Settings"
        >
          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-amber-500/30 to-indigo-500/30 border border-amber-400/30 flex items-center justify-center text-xs font-serif-display text-amber-200">
            {profile.name.slice(0, 1).toUpperCase()}
          </div>
          <Settings className="h-4 w-4 text-slate-400 hidden sm:block" />
        </Link>
      </div>
    </header>
  );
}
