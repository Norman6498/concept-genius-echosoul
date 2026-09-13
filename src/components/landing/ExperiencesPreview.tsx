"use client";

import React, { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

interface LiteraryExcerpt {
  id: string;
  originalText: string;
  englishTranslation: string;
  poet: string;
  work: string;
  era: string;
  theme: string;
  reflection: string;
}

const LITERATURE_SAMPLES: LiteraryExcerpt[] = [
  {
    id: "gulzar-1",
    originalText: "हाथ छूटें भी तो रिश्ते नहीं छूटा करते\nवक़्त की शाख़ से लम्हे नहीं टूटा करते",
    englishTranslation:
      "Even if hands part, the deeper bonds do not let go.\nMoments do not break from the branch of time.",
    poet: "Gulzar",
    work: "Dil Dhoondta Hai",
    era: "Contemporary Urdu/Hindi",
    theme: "Letting go & Unbroken Bonds",
    reflection:
      "A reminder that physical distance and endings cannot undo what was genuinely lived and cherished.",
  },
  {
    id: "tagore-1",
    originalText: "আলো আমার, আলো ওগো, আলো ভুবন-ভরা,\nআলো নয়ন-ধোওয়া আমার, আলো হৃদয়-হরা।",
    englishTranslation:
      "Light, my light, the world-filling light,\nThe eye-kissing light, heart-sweetening light!",
    poet: "Rabindranath Tagore",
    work: "Gitanjali (Song 57)",
    era: "1910 Bengali Masterpiece",
    theme: "Awakening & Solace",
    reflection:
      "Even after the longest dark night of the spirit, dawn returns not as a demand, but as gentle grace.",
  },
  {
    id: "ghalib-1",
    originalText: "हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहिश पे दम निकले\nबहुत निकले मिरे अरमाँ लेकिन फिर भी कम निकले",
    englishTranslation:
      "Thousands of desires, each one worth dying for;\nMany of my longings were fulfilled, yet so few they still seem.",
    poet: "Mirza Asadullah Khan Ghalib",
    work: "Diwan-e-Ghalib",
    era: "18th Century Classical Urdu",
    theme: "Human Longing & Mortality",
    reflection:
      "Honoring the bottomless depth of human longing without demanding that it be neat or quieted.",
  },
];

interface LivingScene {
  id: string;
  title: string;
  timeOfDay: string;
  description: string;
  soundscape: string;
  gradient: string;
  accentColor: string;
}

const SCENES: LivingScene[] = [
  {
    id: "starlit-balcony",
    title: "Midnight Balcony",
    timeOfDay: "11:42 PM — Still Night",
    description: "Crescent moon halo over still mountain waters, distant city lights shimmering in gold.",
    soundscape: "Night Wind & Distant Lake Waves",
    gradient: "from-[#050B10] via-[#0C1B25] to-[#08131B]",
    accentColor: "#F2C86A",
  },
  {
    id: "cedar-rain",
    title: "Rain on Window",
    timeOfDay: "03:15 AM — Deep Solitude",
    description: "Gentle raindrops tracing down cool glass with the amber glow of a quiet reading lamp.",
    soundscape: "Soft Rainfall & Wood Smoke",
    gradient: "from-[#040D14] via-[#091823] to-[#061118]",
    accentColor: "#8FAED9",
  },
  {
    id: "twilight-solitude",
    title: "Twilight Forest Path",
    timeOfDay: "06:48 PM — Dusk",
    description: "Dappled twilight filtering through ancient pine boughs as shadows lengthen peacefully.",
    soundscape: "Evening Cicadas & Rustling Leaves",
    gradient: "from-[#061410] via-[#0F261E] to-[#071912]",
    accentColor: "#8DBA8F",
  },
  {
    id: "dawn-sanctuary",
    title: "Golden Hour Dawn",
    timeOfDay: "05:55 AM — First Light",
    description: "The initial amber brush of morning light spreading warmth over open journal pages.",
    soundscape: "First Birdcalls & Distant Temple Chimes",
    gradient: "from-[#140C07] via-[#2A170A] to-[#120B06]",
    accentColor: "#D9A441",
  },
];

export function ExperiencesPreview() {
  // Literature Sanctuary State
  const [activeLitIndex, setActiveLitIndex] = useState(0);
  const [showOriginal, setShowOriginal] = useState(true);

  // Listening Presence State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeSoundscape, setActiveSoundscape] = useState("Midnight Rain");

  // Living Scenes State
  const [activeSceneId, setActiveSceneId] = useState(SCENES[0].id);
  const activeScene = SCENES.find((s) => s.id === activeSceneId) || SCENES[0];

  const currentLiterature = LITERATURE_SAMPLES[activeLitIndex];

  return (
    <section id="experiences" className="relative py-20 sm:py-28 bg-[#08131B] border-t border-[#D9A441]/15 overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full border border-[#D9A441]/10 pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full border border-[#D9A441]/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24 sm:space-y-32">
        {/* ==================================================================== */}
        {/* EXPERIENCE 1: AUTHENTIC LITERATURE SANCTUARY */}
        {/* ==================================================================== */}
        <div>
          {/* Subsection Header */}
          <div className="max-w-2xl mb-12">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D9A441] block mb-2">
              Experience 01 &bull; Find Your Words
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F5EBD6] font-normal leading-tight">
              Literature that speaks what
              <br />
              <span className="italic text-[#F2C86A] font-light">ordinary words cannot.</span>
            </h2>
            <p className="mt-3 font-ui text-sm sm:text-base text-[#CFC5B5] font-light leading-relaxed">
              When you tell Solenne what hurts or what you wonder about, it doesn&apos;t generate sterile answers.
              It searches humanity&apos;s most resonant verses and places them into your hands on archival parchment.
            </p>
          </div>

          {/* Literary Parchment Preview Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* The Parchment Display (Left, 7 cols) */}
            <div className="lg:col-span-7">
              <div className="paper-canvas p-7 sm:p-10 relative overflow-hidden transition-all duration-300">
                {/* Vintage Parchment Seal / Stamp */}
                <div className="flex items-center justify-between border-b border-[#2b261f]/15 pb-4 mb-6">
                  <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#6B5E4F]">
                    <span>Solenne Literature Vault</span>
                    <span>&bull;</span>
                    <span>No. {currentLiterature.id.toUpperCase()}</span>
                  </div>
                  <span className="text-xs font-serif italic text-[#8B4513] font-medium">
                    {currentLiterature.theme}
                  </span>
                </div>

                {/* Script Switcher Toggle */}
                <div className="flex items-center justify-end gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => setShowOriginal(true)}
                    className={`px-3 py-1 rounded-full text-xs font-ui transition-colors cursor-pointer ${
                      showOriginal
                        ? "bg-[#2b261f] text-[#fbf7ee] font-medium"
                        : "bg-[#e7dfcc] text-[#6B5E4F] hover:text-[#2b261f]"
                    }`}
                  >
                    Original Script
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOriginal(false)}
                    className={`px-3 py-1 rounded-full text-xs font-ui transition-colors cursor-pointer ${
                      !showOriginal
                        ? "bg-[#2b261f] text-[#fbf7ee] font-medium"
                        : "bg-[#e7dfcc] text-[#6B5E4F] hover:text-[#2b261f]"
                    }`}
                  >
                    English Translation
                  </button>
                </div>

                {/* Couplet Typography */}
                <div className="min-h-[140px] flex items-center justify-center my-4 text-center">
                  {showOriginal ? (
                    <p className="font-devanagari text-2xl sm:text-3xl md:text-[32px] text-[#241c14] leading-[1.7] whitespace-pre-line font-medium">
                      {currentLiterature.originalText}
                    </p>
                  ) : (
                    <p className="font-display text-lg sm:text-xl md:text-2xl text-[#241c14] leading-relaxed italic whitespace-pre-line">
                      &ldquo;{currentLiterature.englishTranslation}&rdquo;
                    </p>
                  )}
                </div>

                {/* Poet Provenance & Annotation */}
                <div className="mt-8 pt-4 border-t border-[#2b261f]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-display text-base font-semibold text-[#241c14]">
                      {currentLiterature.poet}
                    </h4>
                    <p className="text-xs text-[#6B5E4F] font-ui">
                      From <span className="italic">{currentLiterature.work}</span> &bull; {currentLiterature.era}
                    </p>
                  </div>
                  <span className="text-[11px] font-ui text-[#8B4513] bg-[#e7dfcc] px-2.5 py-1 rounded-full">
                    Verified Archival Literature
                  </span>
                </div>

                {/* Companion Reflection Note */}
                <div className="mt-6 p-4 rounded-xl bg-[#ede3cf] border border-[#d6cabb] text-xs font-ui text-[#44382c] leading-relaxed">
                  <strong className="font-semibold block mb-1 text-[#241c14]">
                    Solenne Companion Reflection:
                  </strong>
                  {currentLiterature.reflection}
                </div>
              </div>
            </div>

            {/* Literature Controls & Selector (Right, 5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#D9A441] font-semibold block">
                Select Verse to Read
              </span>

              <div className="space-y-3">
                {LITERATURE_SAMPLES.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveLitIndex(idx);
                      setShowOriginal(true);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      activeLitIndex === idx
                        ? "bg-[#0C1B25] border-[#D9A441] shadow-[0_4px_20px_rgba(217,164,65,0.2)]"
                        : "bg-[#050B10]/80 border-[#D9A441]/20 hover:border-[#D9A441]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display text-base text-[#F5EBD6] font-medium">
                        {item.poet}
                      </span>
                      <span className="text-xs text-[#F2C86A]">{item.theme}</span>
                    </div>
                    <p className="text-xs text-[#9AA8B0] line-clamp-1 font-ui">{item.work}</p>
                  </button>
                ))}
              </div>

              <div className="pt-4">
                <Button variant="primary" size="md" href="/signup" fullWidth>
                  Explore 2,000+ Archival Works
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* EXPERIENCE 2: LISTENING PRESENCE & AUDIO RESONANCE */}
        {/* ==================================================================== */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D9A441] block">
                Experience 02 &bull; Speak Freely & Listen
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F5EBD6] font-normal leading-tight">
                A calm, breathing voice
                <br />
                <span className="italic text-[#F2C86A] font-light">that never interrupts.</span>
              </h2>
              <p className="font-ui text-sm sm:text-base text-[#CFC5B5] font-light leading-relaxed">
                Solenne listens with real-time vocal empathy. The breathing companion orb responds to
                the timbre of your voice, slowing its pace as your heart rate settles, accompanied by
                natural acoustic soundscapes.
              </p>

              {/* Soundscape selector */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-medium text-[#E8DEC8] block">Choose Ambient Atmosphere:</span>
                <div className="flex flex-wrap gap-2">
                  {["Midnight Rain", "Warm Fireplace", "432Hz Solitude", "Mountain Pine"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setActiveSoundscape(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-ui transition-all cursor-pointer ${
                        activeSoundscape === s
                          ? "bg-[#D9A441] text-[#050B10] font-semibold shadow-[0_0_12px_rgba(217,164,65,0.4)]"
                          : "bg-[#0C1B25] text-[#CFC5B5] border border-[#D9A441]/25 hover:border-[#D9A441]/50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Button variant="primary" size="md" href="/signup">
                  Start Voice Session
                </Button>
              </div>
            </div>

            {/* Right Interactive Audio Player / Breathing Orb Preview */}
            <div className="lg:col-span-6">
              <div className="glass-panel p-8 sm:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
                {/* Concentric Breathing Halo */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center my-4">
                  {/* Outer Pulsing Rings */}
                  <div className="absolute inset-0 rounded-full border border-[#D9A441]/20 animate-breathe" />
                  <div className="absolute inset-4 rounded-full border border-[#F2C86A]/30 animate-breathe" style={{ animationDelay: "1s" }} />

                  {/* Core Luminous Orb */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#D9A441] to-[#F2C86A] flex items-center justify-center shadow-[0_0_50px_rgba(242,200,106,0.6)] cursor-pointer transition-transform hover:scale-105">
                    <button
                      type="button"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      aria-label={isPlayingAudio ? "Pause session" : "Play session preview"}
                      className="w-full h-full rounded-full flex items-center justify-center text-[#050B10] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#8FAED9]"
                    >
                      {isPlayingAudio ? (
                        <span className="w-5 h-5 flex items-center justify-center gap-1">
                          <span className="w-1.5 h-5 bg-[#050B10] rounded-sm" />
                          <span className="w-1.5 h-5 bg-[#050B10] rounded-sm" />
                        </span>
                      ) : (
                        <Icon name="play" size={24} className="ml-1" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Animated Waveform Visualizer */}
                <div className="flex items-center gap-1.5 h-8 my-3">
                  {[4, 12, 22, 16, 28, 14, 8, 20, 26, 12, 18, 6].map((h, i) => (
                    <span
                      key={i}
                      className={`w-1 bg-[#F2C86A] rounded-full transition-all ${
                        isPlayingAudio ? "animate-waveform" : "opacity-40"
                      }`}
                      style={{
                        height: isPlayingAudio ? undefined : `${h}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>

                <div className="mt-2 space-y-1">
                  <p className="font-display text-lg text-[#F5EBD6] font-medium">
                    {isPlayingAudio ? "Listening with presence..." : "Touch the orb to sample"}
                  </p>
                  <p className="text-xs text-[#9AA8B0] font-ui">
                    Ambient Layer: <span className="text-[#F2C86A]">{activeSoundscape}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* EXPERIENCE 3: LIVING SCENES & ATMOSPHERIC ROOMS */}
        {/* ==================================================================== */}
        <div>
          <div className="max-w-2xl mb-12">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D9A441] block mb-2">
              Experience 03 &bull; Living Scenes
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F5EBD6] font-normal leading-tight">
              A room that transforms
              <br />
              <span className="italic text-[#F2C86A] font-light">with the hour of your day.</span>
            </h2>
            <p className="mt-3 font-ui text-sm sm:text-base text-[#CFC5B5] font-light leading-relaxed">
              Solenne surrounds your conversations with dynamic environmental art that responds to your local
              time, weather, and emotional state — bringing peace to your physical space.
            </p>
          </div>

          {/* Interactive Scene Preview Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Stage Viewport (8 cols) */}
            <div className="lg:col-span-8">
              <div
                className={`relative h-[340px] sm:h-[420px] rounded-2xl bg-gradient-to-br ${activeScene.gradient} border border-[#D9A441]/30 p-8 flex flex-col justify-between overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-700`}
              >
                {/* Atmospheric Starry Grid Overlay */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#F2C86A_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

                {/* Horizon Glow */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-40 opacity-40 blur-3xl pointer-events-none"
                  style={{ backgroundColor: activeScene.accentColor }}
                />

                {/* Top Scene Meta */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#050B10]/60 backdrop-blur-md border border-[#D9A441]/30 text-xs text-[#F5EBD6]">
                    <Icon name="moon" size={14} className="text-[#F2C86A]" />
                    <span>{activeScene.timeOfDay}</span>
                  </div>
                  <span className="text-xs font-mono text-[#CFC5B5] bg-[#050B10]/60 px-3 py-1.5 rounded-full border border-white/10">
                    {activeScene.soundscape}
                  </span>
                </div>

                {/* Bottom Scene Narrative */}
                <div className="relative z-10 max-w-lg space-y-2 bg-[#050B10]/70 backdrop-blur-md p-5 rounded-xl border border-[#D9A441]/20">
                  <h3 className="font-display text-2xl text-[#F5EBD6] font-medium">
                    {activeScene.title}
                  </h3>
                  <p className="font-ui text-xs sm:text-sm text-[#CFC5B5] leading-relaxed">
                    {activeScene.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Scene Selectors List (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
              {SCENES.map((scene) => {
                const isCurrent = scene.id === activeSceneId;
                return (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => setActiveSceneId(scene.id)}
                    className={`flex-1 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-[#0C1B25] border-[#D9A441] shadow-[0_4px_20px_rgba(217,164,65,0.25)]"
                        : "bg-[#050B10]/80 border-[#D9A441]/15 hover:border-[#D9A441]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-base text-[#F5EBD6] font-medium">
                        {scene.title}
                      </span>
                      {isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-[#F2C86A] shadow-[0_0_8px_#F2C86A]" />
                      )}
                    </div>
                    <p className="text-xs text-[#9AA8B0] mt-1 line-clamp-1">{scene.description}</p>
                  </button>
                );
              })}

              <div className="pt-2">
                <Button variant="primary" size="md" href="/signup" fullWidth>
                  Unlock All 8 Living Rooms
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
