"use client";

import React from "react";
import { ShieldCheck, EyeOff, Lock, UserCheck } from "lucide-react";

export function SafetyTrust() {
  const principles = [
    {
      icon: EyeOff,
      title: "Zero Model Training",
      description: "Your voice recordings, reflections, and thoughts are never used to train public AI models.",
    },
    {
      icon: Lock,
      title: "Encrypted & Isolated",
      description: "Every session is secured with Row Level Security. Data is encrypted at rest and in transit.",
    },
    {
      icon: UserCheck,
      title: "You Own Every Memory",
      description: "You can view, edit, or wipe memories at any time. Or run completely private sessions.",
    },
    {
      icon: ShieldCheck,
      title: "Dignity Over Diagnosis",
      description: "EchoSoul is an emotional companion, not a clinical doctor. We never assign medical pathology.",
    },
  ];

  return (
    <section id="safety" className="py-20 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-serif-display uppercase tracking-widest text-emerald-300">
            Trust & Responsibility
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-display font-medium text-slate-100">
            Built for Privacy, Not Advertising
          </h2>
          <p className="text-sm text-slate-400 font-light leading-relaxed">
            EchoSoul was created around one bedrock conviction: your private vulnerabilities must remain inviolable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3 hover:border-emerald-500/20 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif-display text-sm font-medium text-slate-100">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
