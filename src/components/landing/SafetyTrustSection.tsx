import React from "react";
import { Icon } from "@/components/ui/Icon";

export function SafetyTrustSection() {
  const trustPillars = [
    {
      title: "Non-Clinical Companion",
      description:
        "EchoSoul is a reflective and creative companion, not a licensed therapist, psychologist, or medical provider. If you are in crisis, we transparently connect you with 24/7 human crisis support services.",
    },
    {
      title: "Zero Model Training",
      description:
        "Your private conversations, vulnerabilities, memories, and personal writings are never sold, never used for advertising, and never fed into public AI model training datasets.",
    },
    {
      title: "Complete Memory Ownership",
      description:
        "You decide what EchoSoul remembers and what is forgotten. Every saved memory carries provenance, and you can edit, export, or permanently wipe your memory vault with a single click.",
    },
    {
      title: "Encrypted & Row-Level Secured",
      description:
        "Built on Supabase enterprise architecture with PostgreSQL Row Level Security (RLS). Only your authenticated account holds the cryptographic keys to read your personal reflections.",
    },
  ];

  return (
    <section id="safety" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden">
      <div className="glass-panel p-6 sm:p-12 border border-[#D9A441]/25 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-[#8DBA8F]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8DBA8F] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#8DBA8F]" />
            <span>Ethical Architecture & Trust</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-light text-[#F5EBD6] tracking-tight mb-5">
            A Sacred, Private Space
          </h2>
          <p className="font-ui text-base text-[#CFC5B5] leading-relaxed">
            Emotional vulnerability requires uncompromising respect. We built EchoSoul with
            strict ethical boundaries so you never have to wonder if your trust is being monetized.
          </p>
        </div>

        {/* 4 Trust Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trustPillars.map((pillar) => (
            <div
              key={pillar.title}
              className="p-6 rounded-[14px] bg-[#07131B]/70 border border-[#D9A441]/15 hover:border-[#D9A441]/35 transition-colors"
            >
              <h3 className="font-display text-xl text-[#F5EBD6] mb-2.5 font-normal">
                {pillar.title}
              </h3>
              <p className="font-ui text-sm text-[#CFC5B5] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Emergency Crisis Disclaimer Banner */}
        <div className="mt-10 pt-8 border-t border-[#D9A441]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#9AA8B0]">
          <p className="max-w-2xl leading-relaxed">
            <strong className="text-[#F5EBD6]">Important Notice:</strong> EchoSoul does not provide
            medical diagnosis or therapy. If you or someone you know is in acute emotional crisis, please reach out to
            the National Suicide and Crisis Lifeline by dialing <strong className="text-[#F2C86A]">988</strong> (US/Canada),
            <strong className="text-[#F2C86A]"> 112</strong> (EU), or your local emergency healthcare services.
          </p>
          <span className="px-3 py-1.5 rounded-full bg-[#102531] text-[#8DBA8F] font-medium shrink-0">
            Dignity First Pledged
          </span>
        </div>
      </div>
    </section>
  );
}
