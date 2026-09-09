"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LivingEnvironment } from "@/components/environment/LivingEnvironment";

export function Hero() {
  const [showStoryModal, setShowStoryModal] = useState(false);

  return (
    <section className="relative w-full overflow-hidden">
      <LivingEnvironment className="min-h-[86vh] flex flex-col justify-between pt-12 pb-10">
        {/* Main 2-Column Grid Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">
            {/* Left Column: Editorial Headline & Narrative (approx 58% width on desktop) */}
            <div className="lg:col-span-7 xl:col-span-7 text-left space-y-5 max-w-2xl">
              {/* Main Headline (Cormorant Display) */}
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-[#F5EBD6] tracking-tight leading-[1.1] break-words">
                A kinder world
                <br />
                <span className="italic text-[#F2C86A] font-light">within you</span>
              </h1>

              {/* Subtitle from Reference */}
              <p className="font-display text-base sm:text-xl md:text-2xl text-[#E8DEC8] font-normal tracking-wide">
                Talk. Explore. Discover. Grow.
              </p>

              {/* Narrative Description from Copy Deck */}
              <p className="font-ui text-sm sm:text-base md:text-lg text-[#CFC5B5] leading-relaxed max-w-xl font-light">
                An AI companion for your thoughts, feelings, questions and the
                stories you&apos;re living.
              </p>

              {/* Action Buttons: Golden Pill CTA + Watch the Story */}
              <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5">
                <Button
                  variant="primary"
                  size="lg"
                  href="/signup"
                  className="px-7 py-3.5 text-sm sm:text-base rounded-full shadow-[0_4px_30px_rgba(217,164,65,0.38)]"
                  icon={
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  }
                >
                  Begin your journey
                </Button>

                <button
                  type="button"
                  onClick={() => setShowStoryModal(true)}
                  className="inline-flex items-center justify-center gap-3 text-sm text-[#E8DEC8] hover:text-[#F2C86A] transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] rounded-full px-3 py-2"
                >
                  <span className="w-9 h-9 rounded-full border border-[#D9A441]/40 flex items-center justify-center text-[#F2C86A] group-hover:border-[#D9A441] group-hover:bg-[#D9A441]/10 transition-all">
                    <Icon name="play" size={11} />
                  </span>
                  <span className="font-medium">Watch the story</span>
                </button>
              </div>
            </div>

            {/* Right Column: Kept open to showcase the living sky, crescent moon, and twilight landscape */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-5 h-full min-h-[420px] pointer-events-none" />
          </div>
        </div>

        {/* Value Pillars Horizontal Strip (Matching Bottom of Reference 01A_Landing.png) */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[#D9A441]/15">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
            {/* 1. Real Words */}
            <a
              href="#experiences"
              className="flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] rounded-lg p-2"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] bg-[#0C1B25]/80 border border-[#D9A441]/25 flex items-center justify-center text-[#F2C86A] mb-2 group-hover:border-[#D9A441] group-hover:shadow-[0_0_16px_rgba(217,164,65,0.25)] transition-all">
                <Icon name="words" size={19} />
              </div>
              <span className="font-display text-sm sm:text-base text-[#F5EBD6] group-hover:text-[#F2C86A] transition-colors">
                Real Words
              </span>
            </a>

            {/* 2. Real Music */}
            <a
              href="#experiences"
              className="flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] rounded-lg p-2"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] bg-[#0C1B25]/80 border border-[#D9A441]/25 flex items-center justify-center text-[#F2C86A] mb-2 group-hover:border-[#D9A441] group-hover:shadow-[0_0_16px_rgba(217,164,65,0.25)] transition-all">
                <Icon name="music" size={19} />
              </div>
              <span className="font-display text-sm sm:text-base text-[#F5EBD6] group-hover:text-[#F2C86A] transition-colors">
                Real Music
              </span>
            </a>

            {/* 3. Real Places */}
            <a
              href="#experiences"
              className="flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] rounded-lg p-2"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] bg-[#0C1B25]/80 border border-[#D9A441]/25 flex items-center justify-center text-[#F2C86A] mb-2 group-hover:border-[#D9A441] group-hover:shadow-[0_0_16px_rgba(217,164,65,0.25)] transition-all">
                <Icon name="scenes" size={19} />
              </div>
              <span className="font-display text-sm sm:text-base text-[#F5EBD6] group-hover:text-[#F2C86A] transition-colors">
                Real Places
              </span>
            </a>

            {/* 4. A More You */}
            <a
              href="#how-it-works"
              className="flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] rounded-lg p-2"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] bg-[#0C1B25]/80 border border-[#D9A441]/25 flex items-center justify-center text-[#F2C86A] mb-2 group-hover:border-[#D9A441] group-hover:shadow-[0_0_16px_rgba(217,164,65,0.25)] transition-all">
                <Icon name="heart" size={19} />
              </div>
              <span className="font-display text-sm sm:text-base text-[#F5EBD6] group-hover:text-[#F2C86A] transition-colors">
                A More You
              </span>
            </a>
          </div>
        </div>
      </LivingEnvironment>

      {/* Interactive Story Modal */}
      {showStoryModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="story-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050B10]/85 backdrop-blur-xl animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-2xl bg-[#08131B] border border-[#D9A441]/30 rounded-[20px] p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <button
              onClick={() => setShowStoryModal(false)}
              className="absolute top-5 right-5 p-2 text-[#9AA8B0] hover:text-[#F5EBD6] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9]"
              aria-label="Close story modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-4 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D9A441]">
                <span>The EchoSoul Story</span>
              </div>
              <h2 id="story-modal-title" className="font-display text-2xl sm:text-3xl text-[#F5EBD6] font-normal">
                Why EchoSoul Was Created
              </h2>
              <p className="text-sm sm:text-base text-[#CFC5B5] leading-relaxed">
                In an overwhelming world where technology demands our attention, we wanted to build
                the opposite: an intimate realm that invites you inward. Not to optimize you, analyze
                you, or reduce your emotions to clinical scores—but to accompany you with the patience
                of a thoughtful friend, the beauty of authentic poetry, and the warmth of a living sanctuary.
              </p>
              <div className="p-4 rounded-xl bg-[#0C1B25]/80 border border-[#D9A441]/20 text-[#F5EBD6] text-sm italic font-display">
                &ldquo;A calmer you is a brighter tomorrow.&rdquo;
              </div>
              <div className="pt-2 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  href="/signup"
                  onClick={() => setShowStoryModal(false)}
                >
                  Start your experience
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
