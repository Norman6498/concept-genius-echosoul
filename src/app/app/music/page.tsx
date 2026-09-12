"use client";

import React, { useState, useRef, useEffect } from "react";
import { EchoSoulShell } from "@/components/shell/EchoSoulShell";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Music as MusicIcon,
  Volume2,
  Activity,
  Mic,
  MicOff,
  Search,
  X,
  Sparkles,
} from "lucide-react";
import { MASTER_MUSIC_CATALOG } from "@/lib/content/corpus";
import { MusicTrack } from "@/lib/content/types";
import {
  EchoSoulMusicEngine,
  TRACK_AUDIO_PROFILES,
  MusicPlaybackMode,
} from "@/lib/audio/trackSynthesizer";

export default function MusicPage() {
  const [activeTab, setActiveTab] = useState("For You");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [playbackMode, setPlaybackMode] = useState<MusicPlaybackMode>("both");
  const [volume, setVolume] = useState(0.25);
  const [vocalVoiceEnabled, setVocalVoiceEnabled] = useState(true);
  const [currentLyricalLine, setCurrentLyricalLine] = useState("");
  const [visualizerBars, setVisualizerBars] = useState<number[]>([6, 12, 8, 16, 10, 14, 8, 12, 18, 10, 6]);

  const [selectedTrack, setSelectedTrack] = useState<MusicTrack>(
    MASTER_MUSIC_CATALOG.find((t) => t.id === "track_hi_01") || MASTER_MUSIC_CATALOG[0]
  );

  const engineRef = useRef<EchoSoulMusicEngine | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);

  // Initialize engine reference and listeners
  useEffect(() => {
    const engine = new EchoSoulMusicEngine();
    engine.setLyricsListener((line) => {
      setCurrentLyricalLine(line);
    });
    engine.setTimeListener((secs) => {
      if (!isScrubbing) {
        setElapsedSeconds(secs);
      }
    });
    engineRef.current = engine;

    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current = null;
      }
    };
  }, [isScrubbing]);

  // Format seconds to mm:ss
  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60).toString().padStart(2, "0");
    const s = Math.floor(totalSecs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Audio visualizer loop
  useEffect(() => {
    if (!isPlaying) return;
    const vInterval = setInterval(() => {
      if (engineRef.current) {
        setVisualizerBars(engineRef.current.getVisualizerData());
      }
    }, 150);
    return () => clearInterval(vInterval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!engineRef.current) return;

    if (isPlaying) {
      engineRef.current.stop();
      setIsPlaying(false);
      setCurrentLyricalLine("");
    } else {
      engineRef.current.startTrack(selectedTrack.id, playbackMode, volume, vocalVoiceEnabled);
      setIsPlaying(true);
    }
  };

  const switchTrack = (track: MusicTrack) => {
    setSelectedTrack(track);
    setElapsedSeconds(0);
    setCurrentLyricalLine("");
    if (isPlaying && engineRef.current) {
      engineRef.current.startTrack(track.id, playbackMode, volume, vocalVoiceEnabled);
    }
  };

  const handleModeChange = (mode: MusicPlaybackMode) => {
    setPlaybackMode(mode);
    if (isPlaying && engineRef.current) {
      engineRef.current.startTrack(selectedTrack.id, mode, volume, vocalVoiceEnabled);
    }
  };

  const applySeek = (clientX: number) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSec = Math.round(ratio * selectedTrack.duration);
    setElapsedSeconds(targetSec);
    engineRef.current?.seek(targetSec);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    applySeek(e.clientX);
  };

  // Drag scrub support
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isScrubbing) {
        applySeek(e.clientX);
      }
    };
    const handleMouseUp = () => {
      if (isScrubbing) {
        setIsScrubbing(false);
      }
    };
    if (isScrubbing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isScrubbing, selectedTrack.duration]);

  const activeProfile =
    TRACK_AUDIO_PROFILES[selectedTrack.id] || TRACK_AUDIO_PROFILES["track_hi_01"];

  const progressPercent = Math.min(
    100,
    Math.max(0, (elapsedSeconds / selectedTrack.duration) * 100)
  );

  const tabFilteredTracks =
    activeTab === "Hindi"
      ? MASTER_MUSIC_CATALOG.filter((t) => t.primary_language === "hi")
      : activeTab === "Punjabi"
      ? MASTER_MUSIC_CATALOG.filter((t) => t.primary_language === "pa")
      : activeTab === "Bengali"
      ? MASTER_MUSIC_CATALOG.filter((t) => t.primary_language === "bn")
      : activeTab === "Tamil"
      ? MASTER_MUSIC_CATALOG.filter((t) => t.primary_language === "ta")
      : activeTab === "Focus"
      ? MASTER_MUSIC_CATALOG.filter((t) => t.mood_tags.includes("focus"))
      : activeTab === "Calm"
      ? MASTER_MUSIC_CATALOG.filter((t) => t.mood_tags.includes("peace") || t.mood_tags.includes("calmness"))
      : MASTER_MUSIC_CATALOG;

  const filteredTracks = searchQuery.trim()
    ? tabFilteredTracks.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.artist_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.mood_tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : tabFilteredTracks;

  return (
    <EchoSoulShell activePath="/app/music">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Title Header & Mode Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-cormorant text-[#FFF8E1]">Music for your mood.</h1>
            <p className="text-sm font-manrope text-[#CFC5B5] mt-0.5">Sounds that understand you.</p>
          </div>

          {/* Playback Mode Switcher: Studio Vocals, Scientific Frequency, or Both */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#09141D] border border-white/10 self-start sm:self-auto shadow-sm">
            <button
              onClick={() => handleModeChange("both")}
              className={`px-3 py-1.5 rounded-xl text-xs font-manrope transition-all cursor-pointer ${
                playbackMode === "both"
                  ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-sm"
                  : "text-[#CFC5B5] hover:text-[#FFF8E1]"
              }`}
              title="Plays authentic master song vocal audio + Solfeggio healing resonance simultaneously"
            >
              Both (Fusion)
            </button>
            <button
              onClick={() => handleModeChange("vocal")}
              className={`px-3 py-1.5 rounded-xl text-xs font-manrope transition-all cursor-pointer ${
                playbackMode === "vocal"
                  ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-sm"
                  : "text-[#CFC5B5] hover:text-[#FFF8E1]"
              }`}
              title="Real master studio song audio with authentic singing voice"
            >
              Studio Vocals
            </button>
            <button
              onClick={() => handleModeChange("solfeggio")}
              className={`px-3 py-1.5 rounded-xl text-xs font-manrope transition-all cursor-pointer ${
                playbackMode === "solfeggio"
                  ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-sm"
                  : "text-[#CFC5B5] hover:text-[#FFF8E1]"
              }`}
              title="Pure scientific Solfeggio frequency tone"
            >
              Scientific Frequency
            </button>
          </div>
        </div>

        {/* Search Bar & Category Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-2">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["For You", "Hindi", "Punjabi", "Bengali", "Tamil", "Focus", "Calm"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-manrope transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-md shadow-[#F2D78A]/10"
                    : "bg-[#0C1B25] text-[#CFC5B5] hover:text-[#FFF8E1] border border-white/10 hover:border-white/20"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="w-3.5 h-3.5 text-[#9AA8B0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, singer, mood..."
              className="w-full pl-9 pr-8 py-2 rounded-full bg-[#0C1B25] border border-white/10 text-xs font-manrope text-[#FFF8E1] placeholder:text-[#9AA8B0] focus:outline-none focus:border-[#F2D78A]/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#9AA8B0] hover:text-[#FFF8E1]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Player Card */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-[#F2D78A]/20 bg-[#09141D] shadow-2xl relative min-h-[520px] flex flex-col justify-between p-6 sm:p-8">
            <Image
              src={selectedTrack.artwork_url || "/tabs/music_bg.jpg"}
              alt="Track Artwork"
              fill
              className="object-cover opacity-25 pointer-events-none transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070D12] via-[#070D12]/70 to-black/40 pointer-events-none" />

            {/* Top Label & Scientific Badge */}
            <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2D78A]/15 border border-[#F2D78A]/30 text-[#F2D78A] text-xs font-semibold font-manrope">
                <MusicIcon className="w-3.5 h-3.5" />
                {selectedTrack.genre} • {activeProfile.scaleName}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-xs font-manrope text-[#FFF8E1]">
                <Activity className="w-3.5 h-3.5 text-[#F2D78A]" />
                {activeProfile.solfeggioName}
              </span>
            </div>

            {/* Center Player Controls & Live Lyrics */}
            <div className="relative z-10 text-center space-y-4 max-w-md mx-auto w-full my-auto py-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-cormorant text-[#FFF8E1]">
                  {selectedTrack.title}
                </h2>
                <p className="text-xs sm:text-sm font-manrope text-[#CFC5B5] mt-1">
                  {selectedTrack.artist_name} {selectedTrack.album_title ? `• ${selectedTrack.album_title}` : ""}
                </p>
              </div>

              {/* Live Lyrics Banner (Active Singing Voice) */}
              {currentLyricalLine ? (
                <div className="p-3.5 rounded-2xl bg-[#0C1B25]/90 border border-[#F2D78A]/40 shadow-lg backdrop-blur-md animate-fadeIn">
                  <p className="font-cormorant italic text-base sm:text-lg text-[#FFF8E1]">
                    &ldquo;{currentLyricalLine}&rdquo;
                  </p>
                  <span className="text-[10px] font-manrope text-[#F2D78A] block mt-0.5 font-semibold">
                    Master Singing Voice &amp; Harmonic Resonance
                  </span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs font-manrope text-[#9AA8B0]">
                  Press play to hear the authentic singing vocals and acoustic arrangement.
                </div>
              )}

              {/* Soundwave Visualizer Bars - Dynamic Spectrum Response */}
              <div className="flex items-center justify-center gap-1.5 h-8">
                {visualizerBars.map((heightVal, i) => (
                  <span
                    key={i}
                    style={{ height: isPlaying ? `${heightVal}px` : "6px" }}
                    className={`w-1 rounded-full bg-[#F2D78A] transition-all duration-150 ${
                      isPlaying ? "opacity-100" : "opacity-35"
                    }`}
                  />
                ))}
              </div>

              {/* Play / Pause Big Button & Controls */}
              <div className="pt-2 flex items-center justify-center gap-6">
                <button
                  onClick={() => {
                    const next = Math.max(0, elapsedSeconds - 15);
                    setElapsedSeconds(next);
                    engineRef.current?.seek(next);
                  }}
                  className="p-2 text-[#9AA8B0] hover:text-[#FFF8E1] transition-colors cursor-pointer"
                  title="Rewind 15s"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-[#F2D78A] text-[#0B0F14] flex items-center justify-center shadow-[0_0_30px_rgba(242,215,138,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title={isPlaying ? "Pause music" : "Play music"}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-current text-[#0B0F14]" />
                  ) : (
                    <Play className="w-7 h-7 fill-current ml-1 text-[#0B0F14]" />
                  )}
                </button>
                <button
                  onClick={() => {
                    const next = Math.min(selectedTrack.duration, elapsedSeconds + 15);
                    setElapsedSeconds(next);
                    engineRef.current?.seek(next);
                  }}
                  className="p-2 text-[#9AA8B0] hover:text-[#FFF8E1] transition-colors cursor-pointer"
                  title="Forward 15s"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Dynamic Progress Scrubber - Starts from 00:00 & Click/Drag Seekable */}
              <div className="space-y-1.5 pt-2">
                <div
                  ref={progressBarRef}
                  onMouseDown={handleMouseDown}
                  className="w-full bg-white/15 h-2.5 rounded-full overflow-hidden cursor-pointer hover:h-3 transition-all relative select-none"
                  title="Click or drag to seek track"
                >
                  <div
                    className="bg-[#F2D78A] h-full transition-all duration-100 rounded-full shadow-[0_0_8px_rgba(242,215,138,0.5)] pointer-events-none"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-manrope text-[#9AA8B0] px-0.5">
                  <span className="text-[#FFF8E1] font-mono">{formatTime(elapsedSeconds)}</span>
                  <span className="font-mono">{formatTime(selectedTrack.duration)}</span>
                </div>
              </div>
            </div>

            {/* Bottom Controls Bar: Volume & Vocal Reciter Toggle */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-[#9AA8B0]" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    engineRef.current?.setVolume(v);
                  }}
                  className="w-24 accent-[#F2D78A] cursor-pointer"
                  title="Volume level"
                />
                <span className="text-xs font-mono text-[#9AA8B0]">
                  {Math.round(volume * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const next = !vocalVoiceEnabled;
                    setVocalVoiceEnabled(next);
                    if (isPlaying && engineRef.current) {
                      engineRef.current.startTrack(selectedTrack.id, playbackMode, volume, next);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-manrope border transition-all cursor-pointer flex items-center gap-1.5 ${
                    vocalVoiceEnabled
                      ? "bg-[#F2D78A]/15 border-[#F2D78A]/40 text-[#F2D78A]"
                      : "bg-white/5 border-white/10 text-[#9AA8B0]"
                  }`}
                  title="Toggle authentic vocal lyrics display & recitation"
                >
                  {vocalVoiceEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  <span>{vocalVoiceEnabled ? "Vocals: Active" : "Vocals: Muted"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Track Catalog */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-3xl bg-[#09141D] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-cormorant text-lg font-semibold text-[#FFF8E1]">
                  Tracks ({filteredTracks.length})
                </h3>
                <span className="text-xs font-manrope text-[#F2D78A]">
                  {searchQuery ? "Search Results" : activeTab}
                </span>
              </div>

              {filteredTracks.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-[#0C1B25] border border-white/5 space-y-2">
                  <p className="text-xs font-manrope text-[#CFC5B5]">
                    No tracks found matching &ldquo;{searchQuery}&rdquo;.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-[#F2D78A] hover:underline font-semibold"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {filteredTracks.map((track) => {
                    const isCurrent = track.id === selectedTrack.id;
                    const profile = TRACK_AUDIO_PROFILES[track.id];
                    return (
                      <div
                        key={track.id}
                        onClick={() => switchTrack(track)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                          isCurrent
                            ? "bg-[#0C1B25] border-[#F2D78A]/50 shadow-md ring-1 ring-[#F2D78A]/20"
                            : "bg-[#0C1B25]/80 hover:bg-[#0C1B25] border-white/5 hover:border-[#F2D78A]/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                              isCurrent && isPlaying
                                ? "bg-[#F2D78A] text-[#0B0F14]"
                                : "bg-white/5 text-[#FFF8E1] group-hover:bg-[#F2D78A]/20 group-hover:text-[#F2D78A]"
                            }`}
                          >
                            {isCurrent && isPlaying ? (
                              <Pause className="w-4 h-4 fill-current" />
                            ) : (
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                          </div>
                          <div>
                            <h4
                              className={`text-xs font-manrope font-semibold group-hover:text-[#F2D78A] transition-colors line-clamp-1 ${
                                isCurrent ? "text-[#F2D78A]" : "text-[#FFF8E1]"
                              }`}
                            >
                              {track.title}
                            </h4>
                            <p className="text-[11px] font-manrope text-[#9AA8B0] line-clamp-1">
                              {track.artist_name}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-mono text-[#9AA8B0] block">
                            {formatTime(track.duration)}
                          </span>
                          {profile?.solfeggioFreq && (
                            <span className="text-[9px] font-manrope text-[#F2D78A] block">
                              {profile.solfeggioFreq} Hz
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Caption */}
            <div className="text-center p-3.5 rounded-2xl bg-[#0C1B25]/50 border border-white/5">
              <p className="text-xs font-cormorant italic text-[#F2D78A]">
                &ldquo;Music isn&apos;t just sound. It&apos;s a feeling, a space, a better you.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </EchoSoulShell>
  );
}
