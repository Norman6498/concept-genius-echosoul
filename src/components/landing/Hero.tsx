"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, ArrowRight, X, Sparkles } from "lucide-react";

export function Hero() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-16 md:py-24 overflow-hidden">
      {/* Twilight Mountain Lake Backdrop & Atmospheric Illumination (Screen 1A Reference) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep starry sky and moon glow */}
        <div className="absolute top-12 right-1/4 w-72 h-72 rounded-full bg-amber-200/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[450px] rounded-full bg-gradient-to-b from-indigo-900/25 via-amber-900/15 to-transparent blur-[120px]" />
        {/* Distant city glow on lake */}
        <div className="absolute bottom-0 inset-x-0 h-80 bg-gradient-to-t from-[#080c14] via-[#080c14]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Subtle Brand Ribbon */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-serif-display text-amber-200/90 shadow-sm backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>A place for all that you feel</span>
        </div>

        {/* Cinematic Primary Headline (Exact match from visual-references/01A_Landing.png) */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif-display font-medium tracking-tight text-slate-100 leading-[1.1] drop-shadow-md">
          A kinder world <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 bg-clip-text text-transparent">
            within you
          </span>
        </h1>

        {/* Tagline Statement */}
        <p className="text-lg sm:text-xl font-serif-display font-light text-amber-200/90 tracking-wide">
          Talk. Explore. Discover. Grow.
        </p>

        {/* Supporting Narrative */}
        <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-xl mx-auto">
          An AI companion for your thoughts, feelings, questions and the stories you&apos;re living. Real literature. Curated soundscapes. Zero judgment.
        </p>

        {/* Call to Actions (Exact match from visual-references/01A_Landing.png) */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Begin your journey</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            onClick={() => setVideoModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full text-sm text-slate-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] backdrop-blur-md active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="h-7 w-7 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
            </div>
            <span className="font-light tracking-wide">Watch the story</span>
          </button>
        </div>
      </div>

      {/* "Watch the Story" Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl glass-panel border-white/20 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-300 font-serif-display text-sm">EchoSoul Narrative</span>
                <span className="text-xs text-slate-400">· 90 seconds</span>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="aspect-video rounded-xl bg-[#0b101c] border border-white/10 flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-indigo-500/20 to-transparent" />
              <div className="relative z-10 space-y-2 max-w-md">
                <span className="text-xs uppercase font-mono tracking-widest text-amber-300">
                  Concept Film
                </span>
                <h3 className="text-lg font-serif-display text-slate-100">
                  &ldquo;A companion that listens before it speaks.&rdquo;
                </h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  EchoSoul pairs attentive listening with authentic poetry, quiet music, and visual scenes to give your inner world room to breathe.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/signup">
                <button
                  onClick={() => setVideoModalOpen(false)}
                  className="px-5 py-2 rounded-full text-xs font-medium bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors"
                >
                  Start your experience
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
