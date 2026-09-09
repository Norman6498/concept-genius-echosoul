"use client";

import React, { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

export function PricingPreviewSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Can I cancel my membership at any time?",
      a: "Yes, instantly with one click from your account settings. There are no cancellation fees or retention friction. If you cancel, your access continues until the end of your billing period.",
    },
    {
      q: "How is my privacy and personal journal protected?",
      a: "All personal entries and chapters are encrypted at rest with AES-256 and never sold or fed into public machine learning corpuses. You can export or delete your data anytime.",
    },
    {
      q: "What makes EchoSoul different from standard AI chatbots?",
      a: "Standard chatbots rush to fix you, lecture you, or generate endless generic text. EchoSoul offers silence, authentic archival literature (Ghalib, Tagore, Rumi), acoustic soundscapes, and synthesizes your real journey into your private Life Novel.",
    },
  ];

  return (
    <section id="pricing" className="relative py-20 sm:py-28 bg-[#08131B] border-t border-[#D9A441]/15 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D9A441]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D9A441] block mb-3">
            Honest Membership
          </span>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-[#F5EBD6] font-normal tracking-tight">
            Sanctuary within
            <br />
            <span className="italic text-[#F2C86A] font-light">reach of every heart.</span>
          </h2>
          <p className="mt-4 font-ui text-sm sm:text-base text-[#CFC5B5] font-light leading-relaxed">
            Choose the path that fits your life. No hidden tiers, no advertisements, and no commercial tracking.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-[#050B10] border border-[#D9A441]/25">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-xs font-ui font-medium transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-[#D9A441] text-[#050B10] font-semibold shadow-[0_0_15px_rgba(217,164,65,0.4)]"
                  : "text-[#CFC5B5] hover:text-[#F5EBD6]"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2 rounded-full text-xs font-ui font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-[#D9A441] text-[#050B10] font-semibold shadow-[0_0_15px_rgba(217,164,65,0.4)]"
                  : "text-[#CFC5B5] hover:text-[#F5EBD6]"
              }`}
            >
              <span>Annual</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F2C86A] text-[#050B10] font-bold">
                Save 18%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch mb-20">
          {/* Plan 1: Free Sanctuary */}
          <div className="glass-panel p-8 sm:p-10 border border-[#D9A441]/20 flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-2xl text-[#F5EBD6] font-medium">Free Sanctuary</h3>
                <span className="text-xs uppercase font-mono tracking-wider text-[#9AA8B0] bg-white/5 px-2.5 py-1 rounded-full">
                  Forever Free
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#9AA8B0] font-light mb-6">
                Gentle, essential companion space for quiet daily reflections and solace.
              </p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-display text-5xl text-[#F5EBD6] font-normal">$0</span>
                <span className="text-xs text-[#9AA8B0]">/ month</span>
              </div>

              <ul className="space-y-3.5 mb-8">
                {[
                  "Gentle daily companion conversations",
                  "Core literature library (100+ classics)",
                  "Default Living Night atmosphere",
                  "Private journal with basic reflection summaries",
                  "Zero data selling or model training",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-[#CFC5B5]">
                    <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[#F5EBD6] shrink-0">
                      <Icon name="check" size={10} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button variant="secondary" size="lg" href="/signup" fullWidth>
              Begin Free Journey
            </Button>
          </div>

          {/* Plan 2: EchoSoul Patron (Featured) */}
          <div className="glass-panel p-8 sm:p-10 border-2 border-[#D9A441] shadow-[0_12px_45px_rgba(217,164,65,0.22)] flex flex-col justify-between relative">
            {/* Luminous Ribbon */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#D9A441] to-[#F2C86A] text-[#050B10] text-[11px] font-bold uppercase tracking-wider shadow-[0_2px_12px_rgba(217,164,65,0.5)]">
              Most Resonant
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-2xl text-[#F2C86A] font-medium">EchoSoul Patron</h3>
                <span className="text-xs uppercase font-mono tracking-wider text-[#D9A441] bg-[#D9A441]/15 px-2.5 py-1 rounded-full font-semibold">
                  Full Sanctum
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#CFC5B5] font-light mb-6">
                Complete, unrestricted access to every living room, acoustic soundscape, and your evolving Life Novel.
              </p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-display text-5xl text-[#F2C86A] font-normal">
                  {billingCycle === "monthly" ? "$9" : "$89"}
                </span>
                <span className="text-xs text-[#9AA8B0]">
                  {billingCycle === "monthly" ? "/ month" : "/ year (2 months free)"}
                </span>
              </div>

              <ul className="space-y-3.5 mb-8">
                {[
                  "Unlimited real-time voice sessions with breathing orb",
                  "Full global archival literature (thousands of verses & ghazals)",
                  "All 8 living parallax environments with day-night cycles",
                  "Automated 'Life Novel' chapters with memory tapestry",
                  "High-fidelity ambient soundscapes (rain, fire, acoustic piano)",
                  "Priority server capacity & future room expansions",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-[#F5EBD6]">
                    <span className="w-4 h-4 rounded-full bg-[#D9A441] flex items-center justify-center text-[#050B10] shrink-0">
                      <Icon name="check" size={10} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button variant="primary" size="lg" href="/signup" fullWidth>
              Become an EchoSoul Patron
            </Button>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="max-w-2xl mx-auto">
          <h3 className="font-display text-2xl text-[#F5EBD6] font-normal text-center mb-6">
            Questions & Clarifications
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl bg-[#050B10]/70 border border-[#D9A441]/15 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between text-sm sm:text-base font-display text-[#F5EBD6] hover:text-[#F2C86A] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-[#D9A441] text-xs font-mono ml-4">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#CFC5B5] font-ui leading-relaxed border-t border-[#D9A441]/10 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
