"use client";

import React from "react";
import { BookOpen, Music, Landmark, Heart } from "lucide-react";

export function ValuePillars() {
  const pillars = [
    {
      icon: BookOpen,
      title: "Real Words",
      description: "Authentic poetry, shayari, and literature from real writers. Never AI-invented text.",
      accent: "text-amber-300",
      bg: "from-amber-500/15 to-transparent",
      border: "border-amber-400/20",
    },
    {
      icon: Music,
      title: "Real Music",
      description: "Atmospheric, instrumental soundscapes curated for your exact emotional state.",
      accent: "text-indigo-300",
      bg: "from-indigo-500/15 to-transparent",
      border: "border-indigo-400/20",
    },
    {
      icon: Landmark,
      title: "Real Places",
      description: "Cinematic, calming scenes translated from your feelings into soothing visual spaces.",
      accent: "text-sky-300",
      bg: "from-sky-500/15 to-transparent",
      border: "border-sky-400/20",
    },
    {
      icon: Heart,
      title: "A More You",
      description: "Your reflections woven into an evolving narrative. No clinical scores, only gentle growth.",
      accent: "text-rose-300",
      bg: "from-rose-500/15 to-transparent",
      border: "border-rose-400/20",
    },
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-20">
      {/* 4 Pillars Strip (Screen 1A Reference) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className={`p-5 rounded-2xl bg-[#0e1422]/80 backdrop-blur-xl border ${p.border} bg-gradient-to-b ${p.bg} flex flex-col items-center text-center space-y-2.5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40`}
            >
              <div className={`h-11 w-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center ${p.accent} shadow-sm`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-serif-display text-sm font-medium text-slate-100 tracking-wide">
                {p.title}
              </h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                {p.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
