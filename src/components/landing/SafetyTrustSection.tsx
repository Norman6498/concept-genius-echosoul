"use client";

import React from "react";
import { Icon } from "@/components/ui/Icon";

export function SafetyTrustSection() {
  const trustPillars = [
    {
      icon: "shield" as const,
      title: "Zero Model Training",
      badge: "Absolute Privacy",
      description:
        "Your private confessions, novel chapters, and midnight conversations are never used to train or fine-tune public AI models. Your words belong solely to you.",
    },
    {
      icon: "lock" as const,
      title: "100% Data Sovereignty",
      badge: "Encrypted Vault",
      description:
        "Your memories are stored with enterprise AES-256 encryption. Download your entire history in one click as a private archive, or purge it permanently at any time.",
    },
    {
      icon: "heart" as const,
      title: "No Emotional Gamification",
      badge: "Ethical Technology",
      description:
        "No streak guilt, no artificial dependency loops, and no dopamine notifications designed to hook you. EchoSoul is here when you need to exhale, and respects your real life.",
    },
    {
      icon: "sparkles" as const,
      title: "Human Authenticity First",
      badge: "Careful Limits",
      description:
        "EchoSoul is honest about what it is: an empathetic AI companion and literary haven. It never pretends to be a biological human or an omniscient authority.",
    },
  ];

  const crisisLines = [
    {
      region: "United States & Canada",
      service: "988 Suicide & Crisis Lifeline",
      contact: "Call or text 988",
      availability: "24/7, Free & Confidential",
    },
    {
      region: "United Kingdom",
      service: "Samaritans Helpline",
      contact: "Call 116 123",
      availability: "24/7, Free from any phone",
    },
    {
      region: "India",
      service: "Vandrevala Foundation Helpline",
      contact: "+91 9999 666 555",
      availability: "24/7, Multilingual Support",
    },
    {
      region: "International Emergency",
      service: "Global Emergency Services",
      contact: "Call 112 (EU) or 911 (US)",
      availability: "Immediate emergency response",
    },
  ];

  return (
    <section id="safety" className="relative py-20 sm:py-28 bg-[#050B10] border-t border-[#D9A441]/15 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D9A441] block mb-3">
            Safety, Ethics & Trust
          </span>
          <h2 className="font-display text-3xl sm:text-5xl text-[#F5EBD6] font-normal tracking-tight">
            A sanctuary built on
            <br />
            <span className="italic text-[#F2C86A] font-light">sacred privacy & clear boundaries.</span>
          </h2>
          <p className="mt-4 font-ui text-sm sm:text-base text-[#CFC5B5] font-light leading-relaxed">
            Trust is not an afterthought in emotional spaces. It is the foundation.
            Here is our unwavering pledge to your heart and privacy.
          </p>
        </div>

        {/* 4 Trust Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPillars.map((pillar) => (
            <div
              key={pillar.title}
              className="glass-panel p-6 sm:p-7 border border-[#D9A441]/20 hover:border-[#D9A441]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#D9A441]/15 border border-[#D9A441]/30 flex items-center justify-center text-[#F2C86A]">
                    <Icon name={pillar.icon} size={18} />
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#D9A441] bg-[#D9A441]/10 px-2 py-0.5 rounded-full">
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl text-[#F5EBD6] font-medium mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#CFC5B5] font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Ethical Non-Clinical Boundary Notice (GitHub Alert Style Box) */}
        <div className="rounded-2xl bg-[#0C1B25]/90 border border-[#D9A441]/35 p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="w-12 h-12 rounded-2xl bg-[#D9A441]/20 border border-[#D9A441]/40 flex items-center justify-center text-[#F2C86A] shrink-0">
              <Icon name="heart" size={22} />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#D9A441]">
                  Important Ethical & Medical Boundary
                </span>
              </div>
              <h4 className="font-display text-xl text-[#F5EBD6] font-medium">
                EchoSoul is an emotional companion, not clinical therapy.
              </h4>
              <p className="font-ui text-xs sm:text-sm text-[#CFC5B5] leading-relaxed font-light">
                EchoSoul is designed to offer solace, reflective space, and literary companionship. It cannot diagnose, treat, or replace licensed medical care, psychiatric therapy, or emergency crisis response. If you are experiencing acute mental health distress or crisis, human help is available immediately.
              </p>
            </div>
          </div>

          {/* Crisis Hotlines Grid */}
          <div className="mt-8 pt-6 border-t border-[#D9A441]/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {crisisLines.map((line) => (
                <div
                  key={line.region}
                  className="p-4 rounded-xl bg-[#050B10]/70 border border-white/5 space-y-1"
                >
                  <span className="text-[11px] text-[#9AA8B0] block uppercase font-mono tracking-wider">
                    {line.region}
                  </span>
                  <p className="text-xs font-semibold text-[#F5EBD6]">{line.service}</p>
                  <p className="text-sm font-bold text-[#F2C86A] font-mono pt-1">{line.contact}</p>
                  <p className="text-[11px] text-[#9AA8B0]">{line.availability}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
