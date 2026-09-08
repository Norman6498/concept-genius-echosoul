"use client";

import React from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

export function PricingPreview() {
  const tiers = [
    {
      name: "Free Sanctuary",
      price: "$0",
      period: "forever",
      description: "Everything you need to talk, reflect, and keep your thoughts safe.",
      features: [
        "Attentive voice and text listening",
        "Full authentic poetry and literature library",
        "Private novel chapters and timeline",
        "Transparent memory archive and full deletion",
        "Private session mode (no memory stored)",
      ],
      cta: "Begin for free",
      href: "/signup",
      highlight: false,
    },
    {
      name: "EchoSoul Patron",
      price: "$9",
      period: "per month",
      description: "For members who want advanced cinematic scene generation and bespoke soundscapes.",
      features: [
        "Everything in Free Sanctuary",
        "Generative video scenes and anime animations",
        "Extended high-fidelity ambient soundscapes",
        "Continuous literary preservation support",
        "Early access to new creative adapters",
      ],
      cta: "Become a Patron",
      href: "/signup",
      highlight: true,
    },
  ];

  return (
    <section id="pricing" className="py-20 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-serif-display uppercase tracking-widest text-amber-300">
            Fair & Transparent Access
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-display font-medium text-slate-100">
            An Open Sanctuary for Everyone
          </h2>
          <p className="text-sm text-slate-400 font-light leading-relaxed">
            Privacy, safety, and personal memories are never locked behind a paywall.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`p-8 rounded-3xl backdrop-blur-xl flex flex-col justify-between space-y-6 transition-all ${
                t.highlight
                  ? "bg-gradient-to-b from-[#161f36] to-[#0d1424] border-2 border-amber-400/40 shadow-2xl shadow-amber-500/10"
                  : "bg-white/[0.02] border border-white/[0.08]"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-display text-lg font-medium text-slate-100">
                    {t.name}
                  </h3>
                  {t.highlight && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      <Sparkles className="h-2.5 w-2.5" /> Recommended
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-serif-display font-semibold text-slate-100">
                    {t.price}
                  </span>
                  <span className="text-xs text-slate-400 font-light">/{t.period}</span>
                </div>

                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  {t.description}
                </p>

                <div className="pt-4 border-t border-white/[0.06] space-y-2.5">
                  {t.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-xs text-slate-300 font-light">
                      <Check className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link href={t.href} className="w-full">
                <button
                  className={`w-full py-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    t.highlight
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 hover:brightness-105"
                      : "bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1]"
                  }`}
                >
                  {t.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
