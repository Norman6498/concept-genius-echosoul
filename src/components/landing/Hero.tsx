"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LivingEnvironment } from "@/components/environment/LivingEnvironment";

export function Hero() {
  const [showStoryModal, setShowStoryModal] = useState(false);

  return (
    <section className="relative w-full overflow-hidden">
      <LivingEnvironment className="min-h-[88vh] flex flex-col justify-between pt-8 sm:pt-14 pb-8 sm:pb-12">
        {/* Main 2-Column Grid Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">
            {/* Left Column: Editorial Headline & Narrative (approx 58% width on desktop) */}
            <div className="lg:col-span-7 xl:col-span-7 text-left space-y-6 max-w-2xl pt-4">
              {/* Main Headline (Playfair Display) */}
              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal text-[#F5EBD6] tracking-tight leading-[1.08] break-words">
                Enter a realm
                <br />
                where you can
                <br />
                <span className="italic text-[#F2C86A] font-light">finally be you.</span>
              </h1>

              {/* Subtitle from Master Reference */}
              <p className="font-display text-lg sm:text-xl md:text-2xl text-[#E8DEC8] font-normal tracking-wide leading-snug">
                Talk. Be understood. Discover the right words.
                <br className="hidden sm:inline" />{" "}
                See your story. Find clarity. Grow.
              </p>

              {/* Narrative Description from Copy Deck */}
              <p className="font-ui text-sm sm:text-base md:text-lg text-[#CFC5B5] leading-relaxed max-w-xl font-light">
                EchoSoul is your companion, teacher and guide — bringing together meaningful
                conversations, real literature, music, visuals and your life&apos;s journey in one place.
              </p>

              {/* Action Buttons: Golden Pill CTA + Watch the Story */}
              <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
                <Button
                  variant="primary"
                  size="lg"
                  href="/signup"
                  className="px-8 py-3.5 text-base font-semibold rounded-full shadow-[0_4px_30px_rgba(217,164,65,0.42)]"
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
                  Enter EchoSoul
                </Button>

                <button
                  type="button"
                  onClick={() => setShowStoryModal(true)}
                  className="inline-flex items-center justify-center sm:justify-start gap-3 text-sm text-[#E8DEC8] hover:text-[#F2C86A] transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] rounded-full px-3 py-2 cursor-pointer"
                >
                  <span className="w-10 h-10 rounded-full border border-[#D9A441]/40 flex items-center justify-center text-[#F2C86A] group-hover:border-[#D9A441] group-hover:bg-[#D9A441]/15 group-hover:scale-105 transition-all shadow-[0_0_16px_rgba(217,164,65,0.2)]">
                    <Icon name="play" size={13} />
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="font-medium text-sm">Watch the story</span>
                    <span className="text-[11px] text-[#9AA8B0]">2 min</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Right Column: Kept open to showcase the living sky, crescent moon, mountains, lake, and window ledge */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-5 h-full min-h-[460px] pointer-events-none" />
          </div>
        </div>

        {/* Value Pillars Horizontal Strip (Matching Bottom of Master Reference 01A) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12 sm:mt-16 pt-8 border-t border-[#D9A441]/15">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 text-center">
            {/* 1. Speak Freely */}
            <a
              href="#experiences"
              className="flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] rounded-xl p-2.5 transition-transform hover:-translate-y-1"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] bg-[#0C1B25]/80 border border-[#D9A441]/25 flex items-center justify-center text-[#F2C86A] mb-2.5 group-hover:border-[#D9A441] group-hover:shadow-[0_0_20px_rgba(217,164,65,0.3)] transition-all">
                <Icon name="talk" size={20} />
              </div>
              <span className="font-display text-sm sm:text-base text-[#F5EBD6] group-hover:text-[#F2C86A] transition-colors font-medium">
                Speak Freely
              </span>
              <span className="text-[11px] sm:text-xs text-[#9AA8B0] mt-0.5">
                A space without judgment.
              </span>
            </a>

            {/* 2. Find Your Words */}
            <a
              href="#experiences"
              className="flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] rounded-xl p-2.5 transition-transform hover:-translate-y-1"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] bg-[#0C1B25]/80 border border-[#D9A441]/25 flex items-center justify-center text-[#F2C86A] mb-2.5 group-hover:border-[#D9A441] group-hover:shadow-[0_0_20px_rgba(217,164,65,0.3)] transition-all">
                <Icon name="words" size={20} />
              </div>
              <span className="font-display text-sm sm:text-base text-[#F5EBD6] group-hover:text-[#F2C86A] transition-colors font-medium">
                Find Your Words
              </span>
              <span className="text-[11px] sm:text-xs text-[#9AA8B0] mt-0.5">
                Real literature. Real meaning.
              </span>
            </a>

            {/* 3. Music for the Moment */}
            <a
              href="#experiences"
              className="flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] rounded-xl p-2.5 transition-transform hover:-translate-y-1"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] bg-[#0C1B25]/80 border border-[#D9A441]/25 flex items-center justify-center text-[#F2C86A] mb-2.5 group-hover:border-[#D9A441] group-hover:shadow-[0_0_20px_rgba(217,164,65,0.3)] transition-all">
                <Icon name="music" size={20} />
              </div>
              <span className="font-display text-sm sm:text-base text-[#F5EBD6] group-hover:text-[#F2C86A] transition-colors font-medium">
                Music for the Moment
              </span>
              <span className="text-[11px] sm:text-xs text-[#9AA8B0] mt-0.5">
                A soundtrack for what you feel.
              </span>
            </a>

            {/* 4. Visual Experiences */}
            <a
              href="#experiences"
              className="flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] rounded-xl p-2.5 transition-transform hover:-translate-y-1"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] bg-[#0C1B25]/80 border border-[#D9A441]/25 flex items-center justify-center text-[#F2C86A] mb-2.5 group-hover:border-[#D9A441] group-hover:shadow-[0_0_20px_rgba(217,164,65,0.3)] transition-all">
                <Icon name="scenes" size={20} />
              </div>
              <span className="font-display text-sm sm:text-base text-[#F5EBD6] group-hover:text-[#F2C86A] transition-colors font-medium">
                Visual Experiences
              </span>
              <span className="text-[11px] sm:text-xs text-[#9AA8B0] mt-0.5">
                Turn emotions into worlds.
              </span>
            </a>

            {/* 5. Your Life Novel */}
            <a
              href="#experiences"
              className="flex flex-col items-center col-span-2 md:col-span-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] rounded-xl p-2.5 transition-transform hover:-translate-y-1"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] bg-[#0C1B25]/80 border border-[#D9A441]/25 flex items-center justify-center text-[#F2C86A] mb-2.5 group-hover:border-[#D9A441] group-hover:shadow-[0_0_20px_rgba(217,164,65,0.3)] transition-all">
                <Icon name="leaf" size={20} />
              </div>
              <span className="font-display text-sm sm:text-base text-[#F5EBD6] group-hover:text-[#F2C86A] transition-colors font-medium">
                Your Life Novel
              </span>
              <span className="text-[11px] sm:text-xs text-[#9AA8B0] mt-0.5">
                Your memories. Your growth.
              </span>
            </a>
          </div>
        </div>

        {/* Section Transition Anchor (Matching Reference: MORE THAN AN AI. A place for what you feel.) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-14 sm:mt-20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left relative">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#D9A441] font-semibold block mb-1">
              More than an AI.
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-light text-[#F5EBD6] tracking-tight">
              A place for what you feel.
            </h2>
            <div className="w-12 h-0.5 bg-[#D9A441] mt-3 mx-auto sm:mx-0 rounded-full" />
          </div>

          {/* Mouse Scroll Indicator */}
          <div className="flex items-center gap-3 text-xs text-[#9AA8B0] font-ui">
            <div className="w-5 h-8 rounded-full border border-[#D9A441]/40 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-[#F2C86A] animate-bounce" />
            </div>
            <span className="tracking-wider uppercase text-[10px]">Scroll to explore</span>
          </div>
        </div>
      </LivingEnvironment>

      {/* Watch the Story Video/Narrative Modal */}
      {showStoryModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="The EchoSoul Story"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050B10]/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          <div className="glass-panel max-w-2xl w-full p-8 sm:p-10 border border-[#D9A441]/40 shadow-[0_24px_64px_rgba(0,0,0,0.8)] relative">
            <button
              onClick={() => setShowStoryModal(false)}
              className="absolute top-5 right-5 text-[#9AA8B0] hover:text-[#F5EBD6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] rounded-lg p-1 cursor-pointer"
              aria-label="Close story modal"
            >
              <Icon name="close" size={20} />
            </button>

            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D9A441] block mb-2">
              The EchoSoul Origin Story
            </span>
            <h3 className="font-display text-3xl sm:text-4xl text-[#F5EBD6] font-normal mb-4">
              Why We Built a Kinder Space
            </h3>

            <div className="space-y-4 text-sm text-[#CFC5B5] font-ui leading-relaxed">
              <p>
                In a world that demands instant answers, endless productivity, and hurried solutions,
                most people don&apos;t need another analytical dashboard or robotic chatbot.
              </p>
              <p>
                They need a quiet room. A place to exhale without judgment. A companion that
                knows when to offer silence, when to offer timeless literature that honors their exact grief,
                and when to turn their private lessons into the evolving novel of their life.
              </p>
              <div className="p-4 rounded-xl bg-[#08131B] border border-[#D9A441]/20 my-4 text-xs italic text-[#F2C86A] font-display">
                &ldquo;Sometimes the right words find you at exactly the right time.&rdquo;
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={() => setShowStoryModal(false)}
              >
                Close & Explore
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
