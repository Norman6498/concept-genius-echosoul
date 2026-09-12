"use client";

import React, { useState, useEffect, useRef } from "react";
import { EchoSoulShell } from "@/components/shell/EchoSoulShell";
import Image from "next/image";
import {
  Sparkles,
  Maximize2,
  X,
  Check,
  Wind,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Activity,
  Music as MusicIcon,
  Clock,
} from "lucide-react";
import {
  getMelodyForWorld,
  speakBreathingInstruction,
  playTransitionChime,
  SanctuaryAudioSynthesizer,
  ScientificMelody,
} from "@/lib/audio/scientificMelodies";

export interface VisualWorldItem {
  key: string;
  category: "Nature" | "Cities" | "Rooms" | "Space" | "Anime" | "Minimal";
  name: string;
  tagline: string;
  image: string;
  frequencyBadge: string;
  featured?: boolean;
}

const ALL_VISUAL_WORLDS: VisualWorldItem[] = [
  // ── 1. NATURE ──────────────────────────────────────────
  {
    key: "mountain_calm",
    category: "Nature",
    name: "Mountain Calm",
    tagline: "Breathe. Slow down. Be here.",
    image: "/visual-worlds/mountain_calm.jpg",
    frequencyBadge: "432 Hz Solfeggio",
    featured: true,
  },
  {
    key: "forest_retreat",
    category: "Nature",
    name: "Forest Retreat",
    tagline: "Ground yourself in ancient pine serenity.",
    image: "/visual-worlds/forest_retreat.jpg",
    frequencyBadge: "528 Hz Miracle",
    featured: true,
  },
  {
    key: "ocean_breeze",
    category: "Nature",
    name: "Ocean Breeze",
    tagline: "Let gentle rhythmic waves carry tension away.",
    image: "/visual-worlds/ocean_breeze.jpg",
    frequencyBadge: "396 Hz Release",
    featured: true,
  },
  {
    key: "golden_meadow",
    category: "Nature",
    name: "Golden Meadow",
    tagline: "Warm amber sunlight filtering through wildflowers.",
    image: "/tabs/guidance_bg.jpg",
    frequencyBadge: "528 Hz Miracle",
  },

  // ── 2. CITIES ──────────────────────────────────────────
  {
    key: "city_lights",
    category: "Cities",
    name: "City Lights",
    tagline: "Quiet nighttime skyline perspective and soft clarity.",
    image: "/visual-worlds/city_lights.jpg",
    frequencyBadge: "639 Hz Harmony",
    featured: true,
  },
  {
    key: "tokyo_rain",
    category: "Cities",
    name: "Tokyo Rain Alley",
    tagline: "Glistening wet cobblestones under warm amber lanterns.",
    image: "/tabs/community_bg.jpg",
    frequencyBadge: "396 Hz Release",
  },
  {
    key: "paris_twilight",
    category: "Cities",
    name: "Paris Twilight",
    tagline: "Quiet riverbanks under a soft violet evening sky.",
    image: "/tabs/words_bg.jpg",
    frequencyBadge: "432 Hz Solfeggio",
  },

  // ── 3. ROOMS ───────────────────────────────────────────
  {
    key: "cozy_room",
    category: "Rooms",
    name: "Cozy Room",
    tagline: "Warmth, safety, and deep somatic stillness.",
    image: "/visual-worlds/cozy_room.jpg",
    frequencyBadge: "174 Hz Grounding",
    featured: true,
  },
  {
    key: "attic_skylight",
    category: "Rooms",
    name: "Attic Rain Skylight",
    tagline: "Rain pattering gently against cedar wood glass.",
    image: "/visual-worlds/cozy_room.jpg",
    frequencyBadge: "174 Hz Grounding",
  },
  {
    key: "zen_tea_room",
    category: "Rooms",
    name: "Zen Tea Alcove",
    tagline: "Minimal tatami mats, steaming herbal tea, and breath.",
    image: "/tabs/journey_bg.jpg",
    frequencyBadge: "432 Hz Solfeggio",
  },

  // ── 4. SPACE ───────────────────────────────────────────
  {
    key: "starry_skies",
    category: "Space",
    name: "Starry Skies",
    tagline: "The universe holds infinite space for you.",
    image: "/visual-worlds/starry_skies.jpg",
    frequencyBadge: "852 Hz Intuition",
    featured: true,
  },
  {
    key: "cosmic_nebula",
    category: "Space",
    name: "Cosmic Nebula",
    tagline: "Floating through stellar dust and starlit horizons.",
    image: "/visual-worlds/starry_skies.jpg",
    frequencyBadge: "852 Hz Intuition",
  },
  {
    key: "lunar_orbit",
    category: "Space",
    name: "Lunar Orbit",
    tagline: "Profound silence watching Earth rise over craters.",
    image: "/visual-worlds/starry_skies.jpg",
    frequencyBadge: "432 Hz Solfeggio",
  },

  // ── 5. ANIME ───────────────────────────────────────────
  {
    key: "ghibli_hill",
    category: "Anime",
    name: "Ghibli Meadow",
    tagline: "Wind rustling through high emerald grass under clouds.",
    image: "/tabs/guidance_bg.jpg",
    frequencyBadge: "528 Hz Miracle",
  },
  {
    key: "sunset_train",
    category: "Anime",
    name: "Coastal Sunset Train",
    tagline: "Rays of golden dusk beaming into quiet railway windows.",
    image: "/visual-worlds/ocean_breeze.jpg",
    frequencyBadge: "432 Hz Solfeggio",
  },
  {
    key: "sakura_shrine",
    category: "Anime",
    name: "Sakura Stone Path",
    tagline: "Cherry blossom petals falling in quiet stillness.",
    image: "/tabs/words_bg.jpg",
    frequencyBadge: "528 Hz Miracle",
  },

  // ── 6. MINIMAL ─────────────────────────────────────────
  {
    key: "desert_dawn",
    category: "Minimal",
    name: "Desert Dawn Dunes",
    tagline: "Clean wind-swept sand ridges in pure early light.",
    image: "/visual-worlds/mountain_calm.jpg",
    frequencyBadge: "432 Hz Solfeggio",
  },
  {
    key: "pure_horizon",
    category: "Minimal",
    name: "Pure Horizon Mist",
    tagline: "Infinite stillness where quiet water mirrors the sky.",
    image: "/visual-worlds/ocean_breeze.jpg",
    frequencyBadge: "174 Hz Grounding",
  },
  {
    key: "zen_sand",
    category: "Minimal",
    name: "Silent Stone Sanctuary",
    tagline: "Raked sand lines, quiet geometry, uncluttered mind.",
    image: "/tabs/journey_bg.jpg",
    frequencyBadge: "432 Hz Solfeggio",
  },
];

export default function VisualsPage() {
  const [activeTab, setActiveTab] = useState("Nature");
  const [isImmersed, setIsImmersed] = useState(false);
  const [breathPhase, setBreathPhase] = useState("Inhale...");
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Meditation Melody & Voice Guidance State
  const [voiceGuidanceEnabled, setVoiceGuidanceEnabled] = useState(true);
  const [isMelodyPlaying, setIsMelodyPlaying] = useState(false);
  const [melodyVolume, setMelodyVolume] = useState(0.14);

  const synthRef = useRef<SanctuaryAudioSynthesizer | null>(null);
  const breathingTimerRef = useRef<any>(null);

  const [activeWorld, setActiveWorld] = useState<VisualWorldItem>(ALL_VISUAL_WORLDS[0]);
  const activeMelody: ScientificMelody = getMelodyForWorld(activeWorld.key);

  // Filter worlds according to active category tab
  const filteredWorlds =
    activeTab === "For You"
      ? ALL_VISUAL_WORLDS.filter((w) => w.featured)
      : ALL_VISUAL_WORLDS.filter((w) => w.category === activeTab);

  // Initialize synthesizer on mount
  useEffect(() => {
    synthRef.current = new SanctuaryAudioSynthesizer();
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
        synthRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
      }
    };
  }, []);

  // Load user's saved world from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("echosoul_user_world");
      if (stored) {
        const parsed = JSON.parse(stored);
        const match = ALL_VISUAL_WORLDS.find((w) => w.key === parsed.visualWorld);
        if (match) setActiveWorld(match);
      }
    } catch {}
  }, []);

  // Scientific Breathing Cycle with clinically adapted durations
  useEffect(() => {
    if (!isImmersed) {
      if (breathingTimerRef.current) clearTimeout(breathingTimerRef.current);
      return;
    }

    const profile = activeMelody.breathingProfile;

    // Construct sequential phase steps
    const steps: Array<{ phase: string; durationSec: number }> = [
      { phase: "Inhale...", durationSec: profile.inhaleSec },
    ];
    if (profile.holdSec > 0) {
      steps.push({ phase: "Hold gently...", durationSec: profile.holdSec });
    }
    steps.push({ phase: "Slowly exhale...", durationSec: profile.exhaleSec });
    if (profile.restSec > 0) {
      steps.push({ phase: "Rest in stillness...", durationSec: profile.restSec });
    }

    let stepIndex = 0;

    const executeStep = () => {
      const currentStep = steps[stepIndex];
      setBreathPhase(currentStep.phase);
      setSecondsRemaining(Math.round(currentStep.durationSec));

      // 1. Play soft transition chime
      if (synthRef.current) {
        playTransitionChime(synthRef.current.getAudioContext(), activeMelody.frequency * 1.5);
      }

      // 2. Speak voice instruction if enabled
      speakBreathingInstruction(currentStep.phase, voiceGuidanceEnabled);

      // 3. Schedule next phase after step duration
      breathingTimerRef.current = setTimeout(() => {
        stepIndex = (stepIndex + 1) % steps.length;
        executeStep();
      }, currentStep.durationSec * 1000);
    };

    executeStep();

    return () => {
      if (breathingTimerRef.current) clearTimeout(breathingTimerRef.current);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isImmersed, activeMelody, voiceGuidanceEnabled]);

  // Handle entering immersion: auto-start the scientific meditation tone
  const handleEnterImmersion = () => {
    setIsImmersed(true);
    if (synthRef.current) {
      synthRef.current.start(activeMelody, melodyVolume);
      setIsMelodyPlaying(true);
    }
  };

  const handleExitImmersion = () => {
    setIsImmersed(false);
    if (synthRef.current) {
      synthRef.current.stop();
      setIsMelodyPlaying(false);
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleMelody = () => {
    if (!synthRef.current) return;
    if (isMelodyPlaying) {
      synthRef.current.stop();
      setIsMelodyPlaying(false);
    } else {
      synthRef.current.start(activeMelody, melodyVolume);
      setIsMelodyPlaying(true);
    }
  };

  const handleSelectWorld = (world: VisualWorldItem) => {
    setActiveWorld(world);
    const newMelody = getMelodyForWorld(world.key);
    if (isMelodyPlaying && synthRef.current) {
      synthRef.current.start(newMelody, melodyVolume);
    }
  };

  const handleSetWorld = () => {
    try {
      localStorage.setItem("echosoul_user_world", JSON.stringify({ visualWorld: activeWorld.key }));
      const p = localStorage.getItem("echosoul_user_personalization");
      if (p) {
        const parsed = JSON.parse(p);
        parsed.visualWorld = activeWorld.key;
        localStorage.setItem("echosoul_user_personalization", JSON.stringify(parsed));
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {}
  };

  return (
    <EchoSoulShell activePath="/app/visuals">
      <div className="space-y-5">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-cormorant text-[#FFF8E1]">Step into new worlds.</h1>
            <p className="text-sm font-manrope text-[#CFC5B5]">
              Visual experiences to help you feel, breathe, and be present.
            </p>
          </div>

          {/* Melody & Voice Controls */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#09141D] border border-white/10 self-start sm:self-auto">
            <button
              onClick={toggleMelody}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-manrope font-medium transition-all cursor-pointer ${
                isMelodyPlaying
                  ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-md"
                  : "bg-white/5 text-[#CFC5B5] hover:text-[#FFF8E1] hover:bg-white/10"
              }`}
              title={isMelodyPlaying ? "Pause meditation tone" : "Play scientific meditation tone"}
            >
              {isMelodyPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              <span>{isMelodyPlaying ? `${activeMelody.frequency} Hz Playing` : `Play ${activeMelody.frequency} Hz Tone`}</span>
            </button>
            <button
              onClick={() => setVoiceGuidanceEnabled(!voiceGuidanceEnabled)}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                voiceGuidanceEnabled
                  ? "text-[#F2D78A] hover:bg-white/10"
                  : "text-[#9AA8B0] hover:bg-white/10 opacity-60"
              }`}
              title={voiceGuidanceEnabled ? "Spoken voice guidance enabled" : "Spoken voice guidance muted"}
            >
              {voiceGuidanceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Category Filter Pills (Nature, Cities, Rooms, Space, Anime, Minimal) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["For You", "Nature", "Cities", "Rooms", "Space", "Anime", "Minimal"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-manrope transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-md"
                  : "bg-[#0C1B25] text-[#CFC5B5] hover:text-[#FFF8E1] border border-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Hero Scene (Active World) */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-[#F2D78A]/30 bg-[#09141D] shadow-2xl relative min-h-[460px] flex flex-col justify-between p-6 sm:p-8 group">
            <Image
              src={activeWorld.image}
              alt={activeWorld.name}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070D12] via-transparent to-black/30 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[#F2D78A] text-[11px] font-manrope">
                <Sparkles className="w-3 h-3" />
                Active Sanctuary • {activeWorld.frequencyBadge}
              </span>
              <button
                onClick={handleEnterImmersion}
                className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[#FFF8E1] hover:text-[#F2D78A] transition-colors cursor-pointer"
                title="Fullscreen Sanctuary & Breathing"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="relative z-10 space-y-4 max-w-lg">
              <div>
                <h2 className="text-3xl sm:text-4xl font-cormorant text-[#FFF8E1]">
                  {activeWorld.name}
                </h2>
                <p className="text-xs sm:text-sm font-manrope text-[#CFC5B5] mt-1">
                  {activeWorld.tagline}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/40 border border-[#F2D78A]/20 text-[10px] text-[#F2D78A] font-manrope">
                  <Activity className="w-3 h-3" />
                  <span>{activeMelody.name} • {activeMelody.breathingProfile.techniqueName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleEnterImmersion}
                  className="px-6 py-2.5 rounded-full bg-[#F2D78A] text-[#0B0F14] text-xs font-semibold shadow-lg hover:bg-[#E5C77A] transition-transform hover:scale-102 cursor-pointer flex items-center gap-2"
                >
                  <Wind className="w-3.5 h-3.5" />
                  <span>Enter Breathing Scene</span>
                </button>
                <button
                  onClick={handleSetWorld}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-manrope text-[#FFF8E1] border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className={`w-3.5 h-3.5 ${savedSuccess ? "text-[#4ADE80]" : ""}`} />
                  <span>{savedSuccess ? "Active Sanctuary Set!" : "Set as Home World"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Category-Filtered Mini-Grid of Worlds */}
          <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-[#09141D] p-5 flex flex-col justify-between space-y-3">
            <div className="border-b border-white/10 pb-2 flex items-center justify-between">
              <h3 className="font-cormorant text-base font-semibold text-[#FFF8E1]">
                {activeTab} Environments
              </h3>
              <span className="text-[10px] font-manrope text-[#9AA8B0]">{filteredWorlds.length} Worlds</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
              {filteredWorlds.map((w, idx) => (
                <div
                  key={w.key || idx}
                  onClick={() => handleSelectWorld(w)}
                  className={`relative rounded-2xl overflow-hidden h-28 cursor-pointer border transition-all group ${
                    activeWorld.key === w.key
                      ? "border-[#F2D78A] shadow-md ring-2 ring-[#F2D78A]/20"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <Image
                    src={w.image}
                    alt={w.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 space-y-0.5">
                    <p className="text-[11px] font-manrope font-semibold text-[#FFF8E1] truncate">
                      {w.name}
                    </p>
                    <span className="text-[9px] font-manrope text-[#F2D78A] block">
                      {w.frequencyBadge}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-[#0C1B25]/50 border border-white/5 text-center">
              <p className="font-cormorant italic text-xs text-[#F2D78A]">
                &ldquo;Different worlds. The same you.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Immersion Breathing Sanctuary Modal */}
      {isImmersed && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-12 bg-black/95 backdrop-blur-2xl animate-fadeIn">
          {/* Background Scene */}
          <Image
            src={activeWorld.image}
            alt={activeWorld.name}
            fill
            className="object-cover opacity-35 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80 pointer-events-none" />

          {/* Top Bar with Audio & Rhythm Controls */}
          <div className="relative z-10 w-full max-w-4xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-manrope text-[#F2D78A]">
                <Wind className="w-4 h-4 animate-pulse" />
                <span className="font-semibold uppercase tracking-widest">{activeWorld.name}</span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] text-[#FFF8E1] font-manrope">
                <MusicIcon className="w-3 h-3 text-[#F2D78A]" />
                {activeMelody.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Spoken Voice Toggle */}
              <button
                onClick={() => setVoiceGuidanceEnabled(!voiceGuidanceEnabled)}
                className={`px-3 py-1.5 rounded-full border text-xs font-manrope flex items-center gap-1.5 transition-all cursor-pointer ${
                  voiceGuidanceEnabled
                    ? "bg-[#F2D78A]/20 border-[#F2D78A] text-[#F2D78A]"
                    : "bg-white/10 border-white/15 text-[#9AA8B0]"
                }`}
                title="Toggle mindful voice guidance"
              >
                {voiceGuidanceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="hidden xs:inline">{voiceGuidanceEnabled ? "Voice: ON" : "Voice: Muted"}</span>
              </button>

              {/* Melody Play/Pause */}
              <button
                onClick={toggleMelody}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  isMelodyPlaying
                    ? "bg-[#F2D78A] text-[#0B0F14] border-[#F2D78A]"
                    : "bg-white/10 border-white/15 text-[#FFF8E1]"
                }`}
                title={isMelodyPlaying ? "Pause meditation tone" : "Play meditation tone"}
              >
                {isMelodyPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              </button>

              {/* Close Immersion */}
              <button
                onClick={handleExitImmersion}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF8E1] transition-colors cursor-pointer ml-1"
                title="Exit sanctuary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Breathing Rhythm Ring */}
          <div className="relative z-10 text-center space-y-6 flex flex-col items-center my-auto">
            {/* Technique Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F2D78A]/15 border border-[#F2D78A]/30 text-[#F2D78A] text-xs font-manrope shadow-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>{activeMelody.breathingProfile.techniqueName}</span>
            </div>

            {/* Breathing Circle with Dynamic Pulse Transition */}
            <div className="relative w-72 h-72 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#F2D78A]/20 animate-pulse" />
              <div
                className={`w-52 h-52 rounded-full bg-[#F2D78A]/10 border-2 border-[#F2D78A]/50 shadow-[0_0_90px_rgba(242,215,138,0.35)] flex flex-col items-center justify-center transition-all duration-1000 ${
                  breathPhase.includes("Inhale")
                    ? "scale-115 shadow-[0_0_130px_rgba(242,215,138,0.55)] border-[#F2D78A]"
                    : breathPhase.includes("Exhale")
                    ? "scale-85 opacity-75 border-[#F2D78A]/30"
                    : "scale-100"
                }`}
              >
                <span className="font-cormorant text-2xl sm:text-3xl text-[#FFF8E1] tracking-wider font-semibold">
                  {breathPhase}
                </span>
                <span className="text-xs text-[#F2D78A] font-manrope mt-1">
                  {activeMelody.frequency} Hz Solfeggio
                </span>
              </div>
            </div>

            <div className="space-y-1.5 max-w-md px-4">
              <p className="font-cormorant italic text-lg text-[#F2D78A]">&ldquo;{activeWorld.tagline}&rdquo;</p>
              <p className="text-xs font-manrope text-[#CFC5B5] leading-relaxed">
                {activeMelody.breathingProfile.clinicalBenefit}
              </p>
              {voiceGuidanceEnabled && (
                <p className="text-[11px] font-manrope text-[#4ADE80] pt-1 flex items-center justify-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  <span>Mindful voice guidance &amp; chimes are active</span>
                </p>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="relative z-10 flex items-center gap-4">
            <button
              onClick={handleSetWorld}
              className="px-6 py-2.5 rounded-full bg-[#F2D78A] text-[#0B0F14] text-xs font-semibold hover:bg-[#E5C77A] transition-all shadow-xl cursor-pointer"
            >
              {savedSuccess ? "Set as Sanctuary Theme!" : "Set as Sanctuary Theme"}
            </button>
            <button
              onClick={handleExitImmersion}
              className="px-5 py-2.5 rounded-full bg-white/10 text-xs font-manrope text-[#FFF8E1] hover:bg-white/20 transition-all cursor-pointer"
            >
              Return to Gallery
            </button>
          </div>
        </div>
      )}
    </EchoSoulShell>
  );
}
