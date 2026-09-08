"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmotionChip } from "@/components/ui/EmotionChip";
import {
  Pause,
  Play,
  PhoneOff,
  Sparkles,
  HeartHandshake,
  BookOpen,
  Calendar,
  Film,
  Music,
  ArrowRight,
} from "lucide-react";

export default function TalkPage() {
  const [isPaused, setIsPaused] = useState(false);
  const [showReflection, setShowReflection] = useState(false);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-between max-w-xl mx-auto text-center animate-fade-in py-6">
      {/* Top Presence Header */}
      <div className="space-y-1">
        <span className="text-[11px] font-serif-display uppercase tracking-widest text-amber-300/80">
          EchoSoul Sanctuary
        </span>
        <h1 className="text-xl font-serif-display font-medium text-slate-100">
          Listening Presence
        </h1>
      </div>

      {!showReflection ? (
        /* Listening State (Screen 4 Reference) */
        <div className="my-auto space-y-8 w-full flex flex-col items-center">
          {/* Glowing Abstract Listening Orb */}
          <div className="relative flex items-center justify-center">
            {/* Outer soft aura */}
            <div className="absolute h-52 w-52 rounded-full bg-gradient-to-tr from-amber-500/15 via-indigo-500/20 to-sky-400/15 blur-2xl animate-breathe" />

            {/* Inner listening circle */}
            <div className="relative h-44 w-44 rounded-full border border-amber-400/30 bg-[#0c121e]/80 backdrop-blur-xl flex flex-col items-center justify-center p-4 shadow-2xl shadow-amber-500/10">
              <Sparkles className="h-5 w-5 text-amber-300 mb-2 opacity-80" />
              <span className="text-sm font-serif-display text-slate-100 font-light tracking-wide">
                {isPaused ? "Paused" : "I'm listening..."}
              </span>
            </div>
          </div>

          {/* Audio Waveform Placeholder */}
          <div className="flex items-center justify-center gap-1.5 h-10 w-48">
            {[14, 28, 8, 22, 34, 18, 10, 26, 30, 16, 24, 12, 20].map((h, i) => (
              <div
                key={i}
                style={{
                  height: isPaused ? "4px" : `${h}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
                className="w-1 rounded-full bg-gradient-to-t from-amber-500 to-amber-300 transition-all duration-300 opacity-80"
              />
            ))}
          </div>

          {/* Calming Prompt */}
          <div className="space-y-1">
            <p className="text-sm font-serif-display text-slate-200">
              Take your time.
            </p>
            <p className="text-xs text-slate-400 font-light">
              There&apos;s no rush here. Speak as you are.
            </p>
          </div>

          {/* Interactive Controls (Screen 4 Reference) */}
          <div className="flex items-center justify-center gap-6 pt-4">
            {/* Pause button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <div className="h-11 w-11 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
                {isPaused ? <Play className="h-4 w-4 fill-current ml-0.5" /> : <Pause className="h-4 w-4" />}
              </div>
              <span className="text-[10px] font-light">{isPaused ? "Resume" : "Pause"}</span>
            </button>

            {/* End session button */}
            <button
              onClick={() => setShowReflection(true)}
              className="flex flex-col items-center gap-1.5 text-red-300 hover:text-red-200 transition-colors cursor-pointer group"
            >
              <div className="h-14 w-14 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-300 group-hover:scale-105 transition-transform shadow-lg shadow-red-500/10">
                <PhoneOff className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium text-red-300">End</span>
            </button>

            {/* Just stay button */}
            <button
              onClick={() => alert("Just Stay mode: silent accompaniment without conversational pressure.")}
              className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <div className="h-11 w-11 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
                <HeartHandshake className="h-4 w-4 text-amber-300" />
              </div>
              <span className="text-[10px] font-light">Just stay</span>
            </button>
          </div>
        </div>
      ) : (
        /* Post-Listening Reflection Surface (Screen 5 Reference) */
        <div className="my-auto space-y-6 w-full text-left animate-fade-in">
          <GlassCard className="space-y-4 p-6 border-amber-500/20">
            <div>
              <span className="text-xs font-serif-display uppercase tracking-wider text-amber-300">
                Reflection
              </span>
              <h2 className="text-xl font-serif-display font-medium text-slate-100 mt-1">
                &ldquo;I heard you.&rdquo;
              </h2>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                Here is what resonated from your conversation:
              </p>
            </div>

            {/* Emotional Context Chips */}
            <div className="flex flex-wrap gap-2">
              <EmotionChip label="Vulnerability" variant="tender" />
              <EmotionChip label="Overthinking" variant="heavy" />
              <EmotionChip label="Pressure" variant="heavy" />
              <EmotionChip label="Hope" variant="hopeful" />
            </div>

            <blockquote className="text-sm font-serif-display italic text-slate-200 pl-3 border-l-2 border-amber-400/40">
              &ldquo;You seem to be struggling with feeling replaceable at work. You don&apos;t have to carry this alone.&rdquo;
            </blockquote>

            <div className="pt-2">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-3">
                What do you need now?
              </p>

              {/* Action Choices Grid (Screen 5 Reference) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <Link href="/words" className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex flex-col items-center text-center gap-1.5 transition-colors">
                  <BookOpen className="h-4 w-4 text-amber-300" />
                  <span className="text-xs font-medium text-slate-200">Find my words</span>
                </Link>

                <Link href="/scenes" className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex flex-col items-center text-center gap-1.5 transition-colors">
                  <Film className="h-4 w-4 text-indigo-300" />
                  <span className="text-xs font-medium text-slate-200">Make a scene</span>
                </Link>

                <Link href="/scenes" className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex flex-col items-center text-center gap-1.5 transition-colors">
                  <Music className="h-4 w-4 text-sky-300" />
                  <span className="text-xs font-medium text-slate-200">Play music</span>
                </Link>

                <Link href="/journey" className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex flex-col items-center text-center gap-1.5 transition-colors">
                  <Calendar className="h-4 w-4 text-emerald-300" />
                  <span className="text-xs font-medium text-slate-200">Give me a plan</span>
                </Link>

                <Link href="/words" className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex flex-col items-center text-center gap-1.5 transition-colors">
                  <BookOpen className="h-4 w-4 text-purple-300" />
                  <span className="text-xs font-medium text-slate-200">Book page</span>
                </Link>

                <button
                  onClick={() => setShowReflection(false)}
                  className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex flex-col items-center text-center gap-1.5 transition-colors cursor-pointer"
                >
                  <HeartHandshake className="h-4 w-4 text-amber-300" />
                  <span className="text-xs font-medium text-slate-200">Just stay with me</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <button
                onClick={() => setShowReflection(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ← Return to listening
              </button>
              <Link href="/moments">
                <Button variant="primary" size="sm" className="text-xs gap-1.5">
                  <span>Save to moments</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Footer reassurance */}
      <div className="text-[11px] text-slate-400 font-light">
        Audio is processed strictly in-memory during conversation and never permanently recorded.
      </div>
    </div>
  );
}
