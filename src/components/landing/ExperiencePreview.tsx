"use client";

import React, { useState } from "react";
import { Sparkles, Play, ShieldCheck } from "lucide-react";

export function ExperiencePreview() {
  const [activeTab, setActiveTab] = useState<"words" | "listening" | "scenes" | "novel">("words");

  return (
    <section id="experiences" className="py-20 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-serif-display uppercase tracking-widest text-amber-300">
            A Living Sanctuary
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-display font-medium text-slate-100">
            Four Intimate Experiences
          </h2>
          <p className="text-sm text-slate-400 font-light leading-relaxed">
            Move between listening, authentic literature, soothing imagery, and your personal story.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {[
            { id: "words", label: "Authentic Literature" },
            { id: "listening", label: "Listening Presence" },
            { id: "scenes", label: "Cinematic Scenes" },
            { id: "novel", label: "Living Story" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-amber-400/20 text-amber-200 border border-amber-400/40 shadow-sm"
                  : "bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-white/[0.06]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="max-w-3xl mx-auto rounded-3xl glass-panel p-6 sm:p-10 border-white/[0.1] relative overflow-hidden">
          {activeTab === "words" && (
            <div className="space-y-6 animate-fade-in">
              <div className="paper-canvas rounded-xl p-8 space-y-4 text-center">
                <div className="flex items-center justify-between text-xs text-stone-600 border-b border-stone-300 pb-2">
                  <span className="font-serif-display font-medium">Shayari · Raavi Paar</span>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-stone-200 px-2 py-0.5 rounded">
                    <ShieldCheck className="h-3 w-3 text-emerald-700" /> Provenance Verified
                  </span>
                </div>
                <p className="font-serif-display text-xl sm:text-2xl text-stone-900 leading-loose whitespace-pre-line py-4">
                  {`कभी कभी लगता है\nकि मैं भी खो सा गया हूँ,\nकि इस भीड़ में कहीं\nमैं ही तो नहीं रहा...`}
                </p>
                <p className="text-right text-xs font-serif-display text-stone-600">— Gulzar</p>
              </div>
              <p className="text-xs text-center text-slate-400 font-light italic">
                &ldquo;These lines reflect the feeling of being present, yet feeling lost.&rdquo;
              </p>
            </div>
          )}

          {activeTab === "listening" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-fade-in text-center">
              <div className="relative flex items-center justify-center">
                <div className="absolute h-44 w-44 rounded-full bg-amber-500/15 blur-2xl animate-breathe" />
                <div className="relative h-36 w-36 rounded-full border border-amber-400/40 bg-[#0c121e]/90 flex flex-col items-center justify-center shadow-xl shadow-amber-500/10">
                  <Sparkles className="h-5 w-5 text-amber-300 mb-1 opacity-80" />
                  <span className="text-xs font-serif-display text-slate-100">I&apos;m listening...</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 h-6">
                {[12, 24, 8, 20, 28, 16, 10, 22, 14].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1 rounded-full bg-gradient-to-t from-amber-500 to-amber-300 opacity-80"
                  />
                ))}
              </div>
              <p className="text-xs text-slate-400 font-light max-w-sm">
                No ticking timers or pressure to formulate sentences. Take all the quiet pauses you need.
              </p>
            </div>
          )}

          {activeTab === "scenes" && (
            <div className="aspect-video rounded-2xl bg-black relative flex items-center justify-center overflow-hidden animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-indigo-950/60 to-amber-900/30" />
              <div className="relative z-10 text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-amber-400/90 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25">
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                </div>
                <h4 className="text-sm font-serif-display text-slate-100">City Rooftop at Dawn</h4>
                <p className="text-[11px] text-slate-400 font-light">Anime Visual Treatment · 15s Ambient Loop</p>
              </div>
            </div>
          )}

          {activeTab === "novel" && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
                  Chapter 12 · Trying Again
                </span>
                <h4 className="text-sm font-serif-display text-slate-100">
                  The Decision to Send the Message
                </h4>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Decided to send the message instead of drafting it twelve times. Small bravery over prolonged hesitation.
                </p>
              </div>
              <p className="text-center text-xs text-slate-400 font-light italic">
                Reflections are composed into narrative chapters that respect your pace.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
