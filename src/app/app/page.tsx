"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Mic,
  PenTool,
  BookOpen,
  Music,
  Film,
  Calendar,
  ChevronRight,
  Sparkles,
  HeartHandshake,
} from "lucide-react";

export default function HomePage() {
  const { profile } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
      {/* 1. Header Greeting Section (Screen 3 Reference) */}
      <section className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs font-serif-display text-amber-300">
            <Sparkles className="h-3 w-3" />
            <span>Evening Sanctuary</span>
          </div>
          <span className="text-xs text-slate-400 font-light">
            Today · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-serif-display font-medium tracking-tight text-slate-100 pt-1">
          Good Evening, {profile.name}
        </h1>
        <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed max-w-xl">
          Some days are heavy, but you&apos;re still here. And that matters.
        </p>
      </section>

      {/* 2. Visual Atmospheric Sanctuary Card */}
      <GlassCard className="relative overflow-hidden border-amber-500/15 p-6 md:p-8 bg-gradient-to-br from-[#121a2c] via-[#0d1424] to-[#080d18]">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-md">
            <span className="text-xs uppercase tracking-widest font-semibold text-amber-400/80">
              Your Companion Space
            </span>
            <h2 className="text-xl md:text-2xl font-serif-display text-slate-100">
              How are you, really?
            </h2>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              No advice unless you want it. Speak or write — we&apos;ll sit with whatever you bring.
            </p>

            {/* Talk & Type CTAs */}
            <div className="flex items-center gap-3 pt-2">
              <Link href="/app/talk">
                <Button variant="primary" size="md" className="gap-2">
                  <Mic className="h-4 w-4" />
                  <span>Talk</span>
                </Button>
              </Link>
              <Link href="/app/talk?mode=type">
                <Button variant="secondary" size="md" className="gap-2">
                  <PenTool className="h-4 w-4" />
                  <span>Type</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Calming Quote Card */}
          <div className="w-full md:w-56 p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-center space-y-2">
            <HeartHandshake className="h-5 w-5 text-amber-300 mx-auto opacity-75" />
            <p className="text-xs italic font-serif-display text-amber-200/90 leading-relaxed">
              &ldquo;A brighter chapter is still yours.&rdquo;
            </p>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              EchoSoul Note
            </p>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      </GlassCard>

      {/* 3. Continue Your Story Card */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Continue Your Story
          </h3>
          <Link href="/app/moments" className="text-xs text-amber-400/90 hover:text-amber-300 flex items-center gap-1">
            <span>View chapters</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <Link href="/app/moments">
          <GlassCard hoverable className="flex items-center justify-between gap-4 p-4 md:p-5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/15 border border-amber-400/20 flex flex-col items-center justify-center text-amber-300 shrink-0">
                <span className="text-[9px] uppercase font-mono tracking-tighter">Ch.</span>
                <span className="text-base font-serif-display font-semibold leading-none">12</span>
              </div>
              <div>
                <h4 className="text-sm font-serif-display font-medium text-slate-100">
                  Chapter 12: Trying Again
                </h4>
                <p className="text-xs text-slate-400 font-light mt-0.5">
                  Last moment: Yesterday, 10:42 PM · A difficult conversation
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />
          </GlassCard>
        </Link>
      </section>

      {/* 4. Something for you today (Action Pills Grid) */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          Something for you today
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/app/words">
            <GlassCard hoverable className="p-4 text-center space-y-2 flex flex-col items-center justify-center">
              <div className="h-9 w-9 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-slate-200">Words</span>
              <span className="text-[10px] text-slate-400 font-light">Authentic poetry</span>
            </GlassCard>
          </Link>

          <Link href="/app/scenes">
            <GlassCard hoverable className="p-4 text-center space-y-2 flex flex-col items-center justify-center">
              <div className="h-9 w-9 rounded-full bg-indigo-400/10 border border-indigo-400/20 flex items-center justify-center text-indigo-300">
                <Music className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-slate-200">Music</span>
              <span className="text-[10px] text-slate-400 font-light">Calm ambience</span>
            </GlassCard>
          </Link>

          <Link href="/app/scenes">
            <GlassCard hoverable className="p-4 text-center space-y-2 flex flex-col items-center justify-center">
              <div className="h-9 w-9 rounded-full bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-300">
                <Film className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-slate-200">A Scene</span>
              <span className="text-[10px] text-slate-400 font-light">Visual feeling</span>
            </GlassCard>
          </Link>

          <Link href="/app/journey">
            <GlassCard hoverable className="p-4 text-center space-y-2 flex flex-col items-center justify-center">
              <div className="h-9 w-9 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-300">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-slate-200">A Plan</span>
              <span className="text-[10px] text-slate-400 font-light">Gentle step</span>
            </GlassCard>
          </Link>
        </div>
      </section>
    </div>
  );
}
