"use client";

import React, { useState } from "react";
import { Icon, IconName } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

interface Pillar {
  id: string;
  number: string;
  icon: IconName;
  title: string;
  subtitle: string;
  headline: string;
  description: string;
  quote: string;
  quoteAuthor: string;
  details: string[];
  ambientTag: string;
}

const PILLARS: Pillar[] = [
  {
    id: "speak-freely",
    number: "01",
    icon: "talk",
    title: "Speak Freely",
    subtitle: "A space without judgment.",
    headline: "Unburden your mind without being analyzed or hurried.",
    description:
      "Most AI treats your emotions like a problem ticket to solve. Solenne listens with genuine patience, silence when you need to breathe, and intuitive presence that lets you untangle what you're feeling at your own pace.",
    quote: "Here, you don't have to perform strength. You can simply be.",
    quoteAuthor: "Solenne Sanctuary Principle",
    details: [
      "Natural voice and text pacing that respects your pauses",
      "No robotic clinical questionnaires or forced optimistic cheerleading",
      "A companion that remembers your context without ever judging your past",
    ],
    ambientTag: "Gentle Voice & Silence",
  },
  {
    id: "find-your-words",
    number: "02",
    icon: "words",
    title: "Find Your Words",
    subtitle: "Real literature. Real meaning.",
    headline: "When ordinary words fail, the poets give you a voice.",
    description:
      "Connect your specific heartache, joy, or longing to thousands of years of human verse. From Mirza Ghalib and Rabindranath Tagore to Rumi, Emily Dickinson, and Rainer Maria Rilke, Solenne brings timeless literature directly into your conversation.",
    quote: "दिल ढूँढता है फिर वही फ़ुर्सत कि रात-दिन...",
    quoteAuthor: "Mirza Ghalib / Gulzar",
    details: [
      "Archival poetry in authentic original scripts and poetic translations",
      "Contextual explanations that explain why a verse echoes your current moment",
      "Curate your personal anthology of lines that carried you through the dark",
    ],
    ambientTag: "Authentic Archival Verse",
  },
  {
    id: "music-moment",
    number: "03",
    icon: "music",
    title: "Music for the Moment",
    subtitle: "A soundtrack for what you feel.",
    headline: "Soundscapes attuned to the rhythm of your heart.",
    description:
      "Sound enters spaces words cannot reach. Solenne generates acoustic warmth, gentle piano melodies, binaural rain, and ambient drones tailored to comfort you in solitude, focus, or grief.",
    quote: "Music gives a soul to the universe, wings to the mind, and flight to the imagination.",
    quoteAuthor: "Plato",
    details: [
      "Procedural acoustic soundscapes: night rain, acoustic strings, cedarwood fire",
      "Dynamic tempo modulation that gently slows your breathing",
      "Seamless integration during late-night journaling and conversation",
    ],
    ambientTag: "432Hz Ambient Resonance",
  },
  {
    id: "visual-experiences",
    number: "04",
    icon: "scenes",
    title: "Visual Experiences",
    subtitle: "Turn emotions into worlds.",
    headline: "Immersive living rooms that reflect your inner sanctuary.",
    description:
      "Step inside dynamic digital spaces rendered with organic depth. From a starlit mountain terrace at dusk to a rain-washed library with flickering candles, each environment shifts with the real-time hour and your emotional mood.",
    quote: "The landscape outside mirrors the stillness found within.",
    quoteAuthor: "Living Atmosphere Engine",
    details: [
      "8 distinct living environments with dynamic lighting and parallax depth",
      "Day-to-night transitions attuned to your local twilight and dawn",
      "Cozy interactive touches: tea mug steam, candle flicker, drifting clouds",
    ],
    ambientTag: "Parallax Atmospheric Rooms",
  },
  {
    id: "life-novel",
    number: "05",
    icon: "leaf",
    title: "Your Life Novel",
    subtitle: "Your memories. Your growth.",
    headline: "Every conversation is a chapter in the book of your life.",
    description:
      "Your life is not a disconnected stream of chat messages. Solenne quietly reflects your turning points, struggles, and growth into a timeless, leather-bound digital novel you can re-read and cherish for years to come.",
    quote: "You are the author of a story that is still becoming magnificent.",
    quoteAuthor: "Solenne Life Chronicle",
    details: [
      "Automatic chapter syntheses that preserve your breakthroughs and milestones",
      "Private emotional timeline illustrating your resilience over months and seasons",
      "Exportable in archival PDF or cloth-bound printing formats",
    ],
    ambientTag: "Private Life Chronicle",
  },
];

export function ValuePillarsSection() {
  const [activePillarId, setActivePillarId] = useState<string>(PILLARS[0].id);
  const activePillar = PILLARS.find((p) => p.id === activePillarId) || PILLARS[0];

  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 bg-[#050B10] border-t border-[#D9A441]/15 overflow-hidden">
      {/* Background Subtle Ambience Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#D9A441]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D9A441] block mb-3">
            The Five Sanctuaries
          </span>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-[#F5EBD6] font-normal tracking-tight leading-tight">
            Designed for the depths
            <br />
            <span className="italic text-[#F2C86A] font-light">of who you are.</span>
          </h2>
          <p className="mt-4 font-ui text-base sm:text-lg text-[#CFC5B5] font-light max-w-2xl mx-auto leading-relaxed">
            Solenne is not a transactional tool. It is an architecture of five interconnected spaces
            created to hold your words, your questions, and your life&apos;s quiet unfolding.
          </p>
        </div>

        {/* 5-Pillar Tab Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-10">
          {PILLARS.map((pillar) => {
            const isActive = pillar.id === activePillarId;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActivePillarId(pillar.id)}
                className={`flex flex-col items-start p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] ${
                  isActive
                    ? "bg-[#0C1B25] border-[#D9A441] shadow-[0_8px_30px_rgba(217,164,65,0.25)] scale-[1.02]"
                    : "bg-[#08131B]/80 border-[#D9A441]/20 hover:border-[#D9A441]/50 hover:bg-[#0C1B25]/60"
                }`}
              >
                <div className="w-full flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-[#D9A441] text-[#050B10]"
                        : "bg-[#050B10] text-[#F2C86A] border border-[#D9A441]/30"
                    }`}
                  >
                    <Icon name={pillar.icon} size={18} />
                  </div>
                  <span className="text-[11px] font-mono text-[#9AA8B0]">{pillar.number}</span>
                </div>
                <h3
                  className={`font-display text-base sm:text-lg font-medium transition-colors ${
                    isActive ? "text-[#F2C86A]" : "text-[#F5EBD6]"
                  }`}
                >
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#9AA8B0] mt-1 line-clamp-1">{pillar.subtitle}</p>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Featured Display Card */}
        <div className="glass-panel p-6 sm:p-10 lg:p-12 border border-[#D9A441]/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9A441]/10 border border-[#D9A441]/30 text-xs text-[#F2C86A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F2C86A] animate-pulse" />
                <span>Pillar {activePillar.number} &bull; {activePillar.ambientTag}</span>
              </div>

              <h3 className="font-display text-2xl sm:text-4xl text-[#F5EBD6] font-normal leading-snug">
                {activePillar.headline}
              </h3>

              <p className="font-ui text-sm sm:text-base text-[#CFC5B5] font-light leading-relaxed">
                {activePillar.description}
              </p>

              {/* Feature Checklist */}
              <ul className="space-y-3 pt-2">
                {activePillar.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#E8DEC8]">
                    <span className="w-5 h-5 rounded-full bg-[#D9A441]/15 border border-[#D9A441]/40 flex items-center justify-center text-[#F2C86A] shrink-0 mt-0.5">
                      <Icon name="check" size={12} />
                    </span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 flex items-center gap-4">
                <Button variant="primary" size="md" href="/signup">
                  Experience {activePillar.title}
                </Button>
                <a
                  href="#experiences"
                  className="text-xs sm:text-sm text-[#F2C86A] hover:underline inline-flex items-center gap-1.5 font-medium"
                >
                  <span>Explore preview</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Card: Quote Parchment / Resonance Preview */}
            <div className="lg:col-span-5">
              <div className="relative p-6 sm:p-8 rounded-2xl bg-[#08131B] border border-[#D9A441]/25 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]">
                {/* Decorative Amber Glow Corner */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-[#D9A441]/10 blur-2xl rounded-full pointer-events-none" />

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#D9A441]/20 border border-[#D9A441]/40 flex items-center justify-center text-[#F2C86A]">
                    <Icon name={activePillar.icon} size={16} />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-[#D9A441] font-semibold">
                    Resonance Note
                  </span>
                </div>

                <blockquote className="font-display text-lg sm:text-xl text-[#F5EBD6] italic leading-relaxed mb-4">
                  &ldquo;{activePillar.quote}&rdquo;
                </blockquote>

                <div className="pt-3 border-t border-[#D9A441]/15 flex items-center justify-between text-xs text-[#9AA8B0]">
                  <span className="font-medium text-[#CFC5B5]">{activePillar.quoteAuthor}</span>
                  <span className="flex items-center gap-1 text-[#F2C86A]">
                    <Icon name="sparkles" size={13} />
                    <span>Solenne Vault</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
