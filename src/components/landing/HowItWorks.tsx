"use client";

import React from "react";
import { Mic, HeartHandshake, BookOpen, Compass } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: Mic,
      title: "Talk or Write Freely",
      description:
        "Speak in voice or type thoughts in quiet privacy. EchoSoul listens without interruptions, unsolicited advice, or medical assessments.",
    },
    {
      num: "02",
      icon: HeartHandshake,
      title: "Resonate, Not Analyze",
      description:
        "Instead of assigning clinical labels or simplistic scores, EchoSoul pauses to acknowledge what is heavy, tender, or unresolved.",
    },
    {
      num: "03",
      icon: BookOpen,
      title: "Encounter Real Art",
      description:
        "When you ask for comfort, EchoSoul searches authentic literature, shayari, and ambient music that matches your exact emotional frequency.",
    },
    {
      num: "04",
      icon: Compass,
      title: "Weave Your Living Novel",
      description:
        "Over time, approved memories and reflections transform into a private, beautifully written chronicle of your personal growth.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 border-t border-white/[0.06] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-serif-display uppercase tracking-widest text-amber-300">
            The Rhythm of Accompaniment
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-display font-medium text-slate-100">
            How EchoSoul Walks With You
          </h2>
          <p className="text-sm text-slate-400 font-light leading-relaxed">
            Designed to create emotional space rather than demanding constant screen engagement.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="p-6 rounded-2xl bg-[#0b101c]/60 border border-white/[0.06] backdrop-blur-md space-y-4 hover:border-amber-400/20 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600 group-hover:text-amber-400/60 transition-colors">
                    {s.num}
                  </span>
                </div>
                <h3 className="text-base font-serif-display font-medium text-slate-100">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
