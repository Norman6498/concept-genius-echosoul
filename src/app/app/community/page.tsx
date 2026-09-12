"use client";

import React, { useState } from "react";
import { EchoSoulShell } from "@/components/shell/EchoSoulShell";
import Image from "next/image";
import { Users, MessageCircle, Heart, Shield, Sparkles, Send } from "lucide-react";

export default function CommunityPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <EchoSoulShell activePath="/app/community">
      <div className="space-y-5">
        {/* Title Header */}
        <div>
          <h1 className="text-3xl font-editorial text-[#FFF8E1]">Community</h1>
          <p className="text-sm font-ui text-[#CFC5B5]">
            Connect, reflect, and walk forward together.
          </p>
        </div>

        {/* Center Coming Soon Hero Canvas */}
        <div className="rounded-3xl overflow-hidden border border-[#F2D78A]/20 bg-[#09141D] shadow-2xl relative min-h-[500px] flex flex-col items-center justify-center p-6 sm:p-12 text-center">
          <Image
            src="/tabs/community_bg.jpg"
            alt="Campfire community under the starry sky"
            fill
            className="object-cover opacity-35 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D12] via-[#070D12]/70 to-transparent pointer-events-none" />

          {/* Frosted Glass Floating Center Card */}
          <div className="relative z-10 max-w-xl w-full p-8 rounded-3xl bg-[#0C1B25]/85 border border-white/15 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F2D78A]/15 border border-[#F2D78A]/30 text-[#F2D78A] text-xs font-semibold font-ui">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Coming Soon</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-editorial text-[#FFF8E1]">
                Grow together. Talk. Share. Learn.
              </h2>
              <p className="text-xs sm:text-sm font-ui text-[#CFC5B5] leading-relaxed">
                A sanctuary extending beyond the self—a safe, gentle circle for authentic stories
                and quiet companionship.
              </p>
            </div>

            {/* 4 Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#F2D78A] shrink-0" />
                <span className="text-xs font-ui text-[#FFF8E1]">Meaningful discussions</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-[#F2D78A] shrink-0" />
                <span className="text-xs font-ui text-[#FFF8E1]">Shared interests</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#F2D78A] shrink-0" />
                <span className="text-xs font-ui text-[#FFF8E1]">Guided challenges</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#4ADE80] shrink-0" />
                <span className="text-xs font-ui text-[#FFF8E1]">A kinder, supportive space</span>
              </div>
            </div>

            {/* Notification Email Form */}
            {submitted ? (
              <div className="p-3.5 rounded-2xl bg-[#4ADE80]/15 border border-[#4ADE80]/30 text-[#4ADE80] text-xs font-ui">
                Thank you! You&apos;ll be the first to know when the sanctuary circle opens.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for early invite..."
                  required
                  className="w-full sm:flex-1 h-10 px-4 rounded-full bg-[#070D12] border border-white/15 text-xs text-[#FFF8E1] placeholder-[#9AA8B0]/60 focus:outline-none focus:border-[#F2D78A]/60"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 h-10 rounded-full bg-[#F2D78A] text-[#0B0F14] text-xs font-semibold hover:bg-[#E5C77A] transition-colors whitespace-nowrap shadow-md"
                >
                  Notify me when it&apos;s live
                </button>
              </form>
            )}

            <p className="font-display italic text-xs text-[#F2D78A] pt-2">
              &ldquo;Same stories. Different paths. A brighter together.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </EchoSoulShell>
  );
}
