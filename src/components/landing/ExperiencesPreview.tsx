"use client";

import React, { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

export function ExperiencesPreview() {
  const [activeTab, setActiveTab] = useState<"words" | "talk" | "scenes">("words");

  return (
    <section id="experiences" className="py-24 bg-[#08131B]/60 border-y border-[#D9A441]/15 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D9A441] block mb-3">
            Three Intimate Sanctuaries
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-light text-[#F5EBD6] tracking-tight mb-5">
            Designed for How You Truly Feel
          </h2>
          <p className="font-ui text-base text-[#CFC5B5] leading-relaxed">
            EchoSoul is built around three core modes of presence, each handcrafted
            to restore your balance and kindle quiet insight.
          </p>
        </div>

        {/* Tab Selection Bar (Horizontally scrollable on mobile per TABS_SPEC.md) */}
        <div className="w-full max-w-full overflow-x-auto py-2 mb-12 no-scrollbar flex justify-start sm:justify-center">
          <div className="inline-flex p-1.5 rounded-[16px] bg-[#0C1B25] border border-[#D9A441]/20 backdrop-blur-md shrink-0">
            <button
              onClick={() => setActiveTab("words")}
              className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-[12px] text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === "words"
                  ? "bg-[#D9A441] text-[#050B10] shadow-[0_2px_14px_rgba(217,164,65,0.3)] font-semibold"
                  : "text-[#CFC5B5] hover:text-[#F5EBD6]"
              }`}
            >
              <Icon name="words" size={16} />
              <span>Authentic Literature</span>
            </button>
            <button
              onClick={() => setActiveTab("talk")}
              className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-[12px] text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === "talk"
                  ? "bg-[#D9A441] text-[#050B10] shadow-[0_2px_14px_rgba(217,164,65,0.3)] font-semibold"
                  : "text-[#CFC5B5] hover:text-[#F5EBD6]"
              }`}
            >
              <Icon name="talk" size={16} />
              <span>Listening Presence</span>
            </button>
            <button
              onClick={() => setActiveTab("scenes")}
              className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-[12px] text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === "scenes"
                  ? "bg-[#D9A441] text-[#050B10] shadow-[0_2px_14px_rgba(217,164,65,0.3)] font-semibold"
                  : "text-[#CFC5B5] hover:text-[#F5EBD6]"
              }`}
            >
              <Icon name="scenes" size={16} />
              <span>Living Scenes</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Literature Sanctuary (Paper Deckle Card) */}
        {activeTab === "words" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-in fade-in duration-300">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D9A441] uppercase tracking-wider">
                <Icon name="words" size={16} />
                <span>Curated Words · Never Fabricated</span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl text-[#F5EBD6] font-normal leading-tight">
                Authentic poetry, shayari & timeless prose.
              </h3>
              <p className="font-ui text-sm sm:text-base text-[#CFC5B5] leading-relaxed">
                EchoSoul refuses to generate robotic, synthetic rhymes. When you need words
                that honor grief, longing, courage, or stillness, it draws upon verified masterworks
                preserving exact translations and original scripts—including Hindi and Urdu in Devanagari.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Button variant="primary" size="md" href="/signup">
                  Experience Literature
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7">
              {/* Paper Canvas Literary Card */}
              <div className="paper-canvas p-5 sm:p-10 rounded-[18px] overflow-hidden">
                {/* Provenance Badge */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-[#e7dfcc] text-xs font-medium text-[#7d6f5c]">
                  <span className="uppercase tracking-wider sm:tracking-widest font-mono text-[10px] sm:text-xs break-words">Urdu / Devanagari · Provenance Verified</span>
                  <span className="flex items-center gap-1.5 text-[#2b261f] shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#8DBA8F]" />
                    Archival Source
                  </span>
                </div>

                {/* Literary Couplet in Devanagari Script */}
                <div className="my-6 sm:my-8 text-left space-y-3 sm:space-y-4">
                  <p className="font-devanagari text-xl sm:text-3xl text-[#1e1913] leading-relaxed font-normal break-words">
                    हाथ छूटें भी तो रिश्ते नहीं छूटा करते,
                    <br className="hidden sm:inline" />{" "}
                    वक़्त की शाख़ से लम्हे नहीं टूटा करते।
                  </p>
                  <p className="text-xs sm:text-sm italic text-[#5c4f3f] font-display pt-1 sm:pt-2 leading-relaxed">
                    &ldquo;Even if hands let go, bonds do not dissolve; from the branch of time, moments never truly break away.&rdquo;
                  </p>
                </div>

                {/* Author & Work Attribution */}
                <div className="pt-5 border-t border-[#e7dfcc] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-xs text-[#5c4f3f]">
                  <div>
                    <span className="font-bold text-[#1e1913] block text-sm">Gulzar</span>
                    <span>Hindustani Nazm · 20th Century</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-[#ece4d0] text-[#3d3324] font-medium text-[11px] sm:text-xs">
                      Theme: Continuity & Memory
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Listening Presence */}
        {activeTab === "talk" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-in fade-in duration-300">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D9A441] uppercase tracking-wider">
                <Icon name="microphone" size={16} />
                <span>Voice & Text Presence</span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl text-[#F5EBD6] font-normal leading-tight">
                No judgment. No rushing. Just presence.
              </h3>
              <p className="font-ui text-sm sm:text-base text-[#CFC5B5] leading-relaxed">
                Experience voice accompaniment that breathes with you. When you pause to gather
                your thoughts, EchoSoul waits. It notices cadence, hesitation, and tone, answering
                not with unsolicited advice but with genuine empathetic resonance.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Button variant="primary" size="md" href="/signup">
                  Try Voice Accompaniment
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7">
              {/* Listening Orb Mockup */}
              <div className="glass-panel p-6 sm:p-10 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[380px] relative overflow-hidden">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#D9A441]/40 via-[#F2C86A]/20 to-transparent border border-[#F2C86A]/50 animate-breathe flex items-center justify-center shadow-[0_0_60px_rgba(217,164,65,0.3)]">
                  <div className="w-16 h-16 rounded-full bg-[#08131B]/80 flex items-center justify-center text-[#F2C86A]">
                    <Icon name="microphone" size={28} />
                  </div>
                </div>

                <div className="mt-8 text-center space-y-2">
                  <span className="text-xs uppercase tracking-widest text-[#D9A441] font-semibold">
                    Listening to you…
                  </span>
                  <p className="font-display text-xl text-[#F5EBD6] italic">
                    &ldquo;Take your time. I am right here.&rdquo;
                  </p>
                </div>

                {/* Subtle Waveform Pulse */}
                <div className="flex items-center gap-1.5 mt-6">
                  <span className="w-1 bg-[#F2C86A] rounded-full animate-waveform" style={{ animationDelay: "0ms" }} />
                  <span className="w-1 bg-[#F2C86A] rounded-full animate-waveform" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 bg-[#F2C86A] rounded-full animate-waveform" style={{ animationDelay: "300ms" }} />
                  <span className="w-1 bg-[#F2C86A] rounded-full animate-waveform" style={{ animationDelay: "100ms" }} />
                  <span className="w-1 bg-[#F2C86A] rounded-full animate-waveform" style={{ animationDelay: "250ms" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Living Scenes */}
        {activeTab === "scenes" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-in fade-in duration-300">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D9A441] uppercase tracking-wider">
                <Icon name="scenes" size={16} />
                <span>Atmospheric Sanctuaries</span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl text-[#F5EBD6] font-normal leading-tight">
                Living visual spaces that let you exhale.
              </h3>
              <p className="font-ui text-sm sm:text-base text-[#CFC5B5] leading-relaxed">
                Step into living landscapes tailored to your state of mind. Rain against a tea shop
                window, dawn mist over the Himalayas, or a nighttime reading lamp by a balcony.
                Each scene moves with subtle organic depth, never a distracting animation.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Button variant="primary" size="md" href="/signup">
                  Explore Scenes
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7">
              {/* Living Scene Card Preview */}
              <div className="glass-panel overflow-hidden relative min-h-[340px] sm:min-h-[380px] flex flex-col justify-end p-6 sm:p-8 border border-[#D9A441]/30">
                {/* Background Scene Simulator */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B10] via-[#091824]/80 to-[#0C1F2F] pointer-events-none" />
                <div className="absolute top-8 right-8 w-20 h-20 rounded-full bg-[#F2C86A]/10 blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0C1B25]/80 border border-[#D9A441]/25 text-xs text-[#F2C86A]">
                    <span>Scene: Rain on Mountain Veranda</span>
                  </div>
                  <h4 className="font-display text-2xl text-[#F5EBD6]">
                    Overthinking & Healing Sanctuary
                  </h4>
                  <p className="text-xs text-[#CFC5B5] max-w-lg leading-relaxed">
                    Gentle rain soundscape, drifting valley mist, and warm amber lantern illumination.
                    Timed to accompany your quiet evening reflections.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
