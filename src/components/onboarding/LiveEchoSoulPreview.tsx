"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useOnboardingPreview, AccentColor, ThemeMode, BackgroundEnvironment } from "@/lib/onboarding/preview-context";
import { BrandLogo } from "@/components/ui/BrandLogo";

const ACCENT_MAP: Record<AccentColor, { hex: string; bgSoft: string; border: string; glow: string; text: string }> = {
  gold:   { hex: "#F2D78A", bgSoft: "rgba(242,215,138,0.15)", border: "rgba(242,215,138,0.5)", glow: "0 0 15px rgba(242,215,138,0.3)", text: "#F2D78A" },
  purple: { hex: "#A78BFA", bgSoft: "rgba(167,139,250,0.15)", border: "rgba(167,139,250,0.5)", glow: "0 0 15px rgba(167,139,250,0.3)", text: "#A78BFA" },
  blue:   { hex: "#60A5FA", bgSoft: "rgba(96,165,250,0.15)",  border: "rgba(96,165,250,0.5)",  glow: "0 0 15px rgba(96,165,250,0.3)",  text: "#60A5FA" },
  green:  { hex: "#4ADE80", bgSoft: "rgba(74,222,128,0.15)",  border: "rgba(74,222,128,0.5)",  glow: "0 0 15px rgba(74,222,128,0.3)",  text: "#4ADE80" },
  pink:   { hex: "#F472B6", bgSoft: "rgba(244,114,182,0.15)", border: "rgba(244,114,182,0.5)", glow: "0 0 15px rgba(244,114,182,0.3)", text: "#F472B6" },
  orange: { hex: "#FB923C", bgSoft: "rgba(251,146,60,0.15)",  border: "rgba(251,146,60,0.5)",  glow: "0 0 15px rgba(251,146,60,0.3)",  text: "#FB923C" },
  red:    { hex: "#F87171", bgSoft: "rgba(248,113,113,0.15)", border: "rgba(248,113,113,0.5)", glow: "0 0 15px rgba(248,113,113,0.3)", text: "#F87171" },
  gray:   { hex: "#CBD5E1", bgSoft: "rgba(203,213,225,0.15)", border: "rgba(203,213,225,0.5)", glow: "0 0 15px rgba(203,213,225,0.3)", text: "#CBD5E1" },
};

const ENVIRONMENT_IMAGES: Record<BackgroundEnvironment, string> = {
  cozy_room:     "/environments/cozy_room.jpg",
  mountain_view: "/environments/mountain_view.jpg",
  forest_cabin:  "/environments/forest_cabin.jpg",
  ocean_view:    "/environments/ocean_view.jpg",
  city_nights:   "/environments/city_nights.jpg",
  starry_sky:    "/environments/starry_sky.jpg",
};

const TOPIC_LABELS: Record<string, string> = {
  motivation: "motivation",
  stories_writing: "stories & literature",
  creativity: "creative pursuits",
  mental_health: "calm & mindfulness",
  studies_learning: "focused studies",
  relationships: "deep relationships",
  life_advice: "practical wisdom",
  philosophy: "philosophical depth",
  science_ideas: "scientific ideas",
  music_emotions: "sound & music",
  nature_life: "nature & stillness",
  career_future: "growth & career",
  spirituality: "inner spirituality",
  art_aesthetics: "art & aesthetics",
};

export function LiveEchoSoulPreview() {
  const { preferences, appearance, userName } = useOnboardingPreview();
  const [interactiveInput, setInteractiveInput] = useState("");
  const [userMessages, setUserMessages] = useState<string[]>([]);

  const accent = ACCENT_MAP[appearance.accentColor] || ACCENT_MAP.gold;
  const isLight = appearance.theme === "minimal_light";
  const bgImage = ENVIRONMENT_IMAGES[appearance.backgroundEnvironment] || ENVIRONMENT_IMAGES.cozy_room;

  // Font family selector
  const fontClass = useMemo(() => {
    switch (appearance.fontStyle) {
      case "serif":
        return "font-serif";
      case "rounded":
        return "font-sans rounded-2xl";
      default:
        return "font-sans";
    }
  }, [appearance.fontStyle]);

  // Dynamic Assistant Dialogue based on Preferences & Style
  const dialogue = useMemo(() => {
    const greetingName = userName && userName !== "Friend" ? `, ${userName}` : "";

    let greeting = `Hey there${greetingName} ✨`;
    let core = "I'll be here with calm, thoughtful conversations and always at your pace.";
    let followUp = "Great! Let's keep going. 🌙";

    // Style shaping
    switch (preferences.communicationStyle) {
      case "warm":
        greeting = `Welcome home${greetingName} ✨`;
        core = "I'm right here with warmth, encouragement, and an open heart whenever you need to reflect.";
        followUp = "You're never walking this journey alone. 💛";
        break;
      case "calm":
        greeting = `Breathe gently${greetingName}.`;
        core = "A quiet sanctuary for your thoughts. We'll move slowly with stillness and patience.";
        followUp = "Take all the time you need. 🌊";
        break;
      case "direct":
        greeting = `Hello${greetingName}.`;
        core = "Clear, focused, and honest. We cut through the noise and focus straight on what matters.";
        followUp = "Ready when you are. 🎯";
        break;
      case "deep":
        greeting = `Greetings, seeker${greetingName}.`;
        core = "Where thoughts meet timeless depth. We explore below the surface, questioning and growing.";
        followUp = "The unexamined life is ready to unfold. 🌌";
        break;
      case "light":
        greeting = `Hey${greetingName}! 👋`;
        core = "Relaxed conversations, easygoing chats, and bright sparks of energy for your day.";
        followUp = "Let's explore something fun! ✨";
        break;
    }

    // Topics synthesis (filter avoided topics)
    const validTopics = preferences.selectedTopics
      .filter((t) => !preferences.avoidedTopics.includes(t))
      .map((t) => TOPIC_LABELS[t] || t);

    if (validTopics.length > 0) {
      const topTopics = validTopics.slice(0, 3).join(", ");
      core += ` We'll focus especially on ${topTopics}.`;
    }

    // Response length adaptation
    if (preferences.responseLength === "short") {
      core = core.split(".")[0] + ".";
    } else if (preferences.responseLength === "detailed") {
      core += " Every feeling and ambition you hold has space to breathe here without hurry.";
    }

    return { greeting, core, followUp };
  }, [preferences, userName]);

  const handleSendInteractive = (e?: React.FormEvent | React.KeyboardEvent | React.MouseEvent) => {
    if (e && "preventDefault" in e) e.preventDefault();
    if (!interactiveInput.trim()) return;
    setUserMessages((prev) => [...prev, interactiveInput.trim()]);
    setInteractiveInput("");
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="font-ui text-xs font-semibold uppercase tracking-wider text-[#CFC5B5]">
          Live Preview
        </h3>
        <span
          className="text-[10px] font-ui px-2 py-0.5 rounded-full font-medium"
          style={{
            backgroundColor: accent.bgSoft,
            color: accent.text,
            border: `1px solid ${accent.border}`,
          }}
        >
          ● Reactive Preview
        </span>
      </div>

      <p className="font-ui text-xs text-[#9AA8B0]">
        This is a live miniature sample of how your Solenne experience will look and converse.
      </p>

      {/* ── Miniature Solenne Device Card ───────────────────────────────── */}
      <div
        className={`relative rounded-2xl overflow-hidden border shadow-2xl transition-all duration-300 ${fontClass} ${
          isLight ? "bg-[#FAF8F5] text-[#18181B] border-[#E2DED6]" : "bg-[#08131B] text-[#FFF8E1] border-white/20"
        }`}
        style={{
          boxShadow: appearance.ambientAnimations && !appearance.reducedMotion ? accent.glow : "none",
        }}
      >
        {/* Background Environment Scenery with Crisp Contrast */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt="Environment Atmosphere"
            fill
            unoptimized
            sizes="360px"
            className={`object-cover transition-opacity duration-500 ${
              isLight ? "opacity-25" : "opacity-60"
            }`}
          />
          <div
            className={`absolute inset-0 ${
              isLight
                ? "bg-gradient-to-b from-[#FAF8F5]/85 via-[#FAF8F5]/70 to-[#FAF8F5]/90"
                : "bg-gradient-to-b from-[#08131B]/80 via-[#08131B]/60 to-[#08131B]/90"
            }`}
          />
        </div>

        {/* ── Preview Content ────────────────────────────────────────────── */}
        <div className="relative z-10 p-4 sm:p-5 flex flex-col justify-between min-h-[380px]">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm"
                style={{
                  backgroundColor: accent.bgSoft,
                  border: `1px solid ${accent.border}`,
                }}
              >
                <BrandLogo size="sm" showText={false} />
              </div>
              <div>
                <div className="font-display text-xs font-semibold flex items-center gap-1.5">
                  <span>Solenne</span>
                  {preferences.privacyPreference && (
                    <span className="text-[10px] text-[#9AA8B0]" title="Private & Encrypted">
                      🔒
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#9AA8B0] font-ui block leading-none">
                  {appearance.theme.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Feature Indicators */}
            <div className="flex items-center gap-1.5">
              {appearance.backgroundMusic && (
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono animate-pulse"
                  style={{ backgroundColor: accent.bgSoft, color: accent.text }}
                >
                  ♫ Audio
                </span>
              )}
              {preferences.musicRecommendations && (
                <span className="text-xs" title="Music Enabled">
                  🎧
                </span>
              )}
              {preferences.bookRecommendations && (
                <span className="text-xs" title="Literature Suggestions">
                  📖
                </span>
              )}
              {preferences.visualExperiences && (
                <span className="text-xs" title="Visual Sanctuary">
                  🎨
                </span>
              )}
            </div>
          </div>

          {/* Conversation Bubbles */}
          <div className="my-auto space-y-3 py-3">
            {/* Assistant Bubble 1 */}
            <div className="flex items-start gap-2.5">
              <div
                className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px]"
                style={{
                  backgroundColor: accent.bgSoft,
                  border: `1px solid ${accent.border}`,
                  color: accent.text,
                }}
              >
                ☾
              </div>
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] backdrop-blur-md transition-all ${
                  isLight ? "bg-white/80 border border-black/5" : "bg-[#0C1B25]/85 border border-white/10"
                }`}
                style={{
                  borderLeft: `3px solid ${accent.hex}`,
                }}
              >
                <p className="font-medium mb-1" style={{ color: accent.text }}>
                  {dialogue.greeting}
                </p>
                <p className={isLight ? "text-neutral-700" : "text-[#CFC5B5]"}>
                  {dialogue.core}
                </p>
              </div>
            </div>

            {/* User Response Bubble */}
            <div className="flex justify-end">
              <div
                className="px-3.5 py-2 rounded-2xl text-xs font-medium max-w-[80%] shadow-sm"
                style={{
                  backgroundColor: accent.hex,
                  color: "#0B0F14",
                }}
              >
                That sounds perfect.
              </div>
            </div>

            {/* Custom Interactive Messages */}
            {userMessages.map((msg, i) => (
              <React.Fragment key={i}>
                <div className="flex justify-end">
                  <div
                    className="px-3.5 py-2 rounded-2xl text-xs font-medium max-w-[80%] shadow-sm"
                    style={{ backgroundColor: accent.hex, color: "#0B0F14" }}
                  >
                    {msg}
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div
                    className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px]"
                    style={{ backgroundColor: accent.bgSoft, border: `1px solid ${accent.border}`, color: accent.text }}
                  >
                    ☾
                  </div>
                  <div
                    className={`p-2.5 rounded-2xl text-xs leading-relaxed max-w-[85%] backdrop-blur-md ${
                      isLight ? "bg-white/80 border border-black/5" : "bg-[#0C1B25]/85 border border-white/10"
                    }`}
                  >
                    <p className={isLight ? "text-neutral-700" : "text-[#CFC5B5]"}>
                      I hear you. Let&apos;s explore that together.
                    </p>
                  </div>
                </div>
              </React.Fragment>
            ))}

            {/* Assistant Follow-up Bubble */}
            <div className="flex items-start gap-2.5">
              <div
                className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px]"
                style={{
                  backgroundColor: accent.bgSoft,
                  border: `1px solid ${accent.border}`,
                  color: accent.text,
                }}
              >
                ☾
              </div>
              <div
                className={`p-2.5 rounded-2xl text-xs leading-relaxed max-w-[85%] backdrop-blur-md ${
                  isLight ? "bg-white/80 border border-black/5" : "bg-[#0C1B25]/85 border border-white/10"
                }`}
              >
                <p className={isLight ? "text-neutral-700" : "text-[#CFC5B5]"}>
                  {dialogue.followUp}
                </p>
              </div>
            </div>
          </div>

          {/* Explorative Extras (Only when Layout is Explorative) */}
          {appearance.layout === "explorative" && (
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
              <span className="text-[#9AA8B0]">Recommended Quote:</span>
              <span className="italic truncate max-w-[190px]" style={{ color: accent.text }}>
                &ldquo;A more you. Every time you return.&rdquo;
              </span>
            </div>
          )}

          {/* Interactive Chat Input Test */}
          <div className="pt-2">
            <div className="relative flex items-center">
              <input
                type="text"
                value={interactiveInput}
                onChange={(e) => setInteractiveInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendInteractive(e);
                  }
                }}
                placeholder="Test conversation here..."
                className={`w-full h-8 pl-3 pr-8 rounded-xl text-[11px] font-ui border transition-colors focus:outline-none ${
                  isLight
                    ? "bg-white/80 border-black/15 text-black placeholder-neutral-400"
                    : "bg-[#050B10]/80 border-white/15 text-[#FFF8E1] placeholder-[#9AA8B0]/60"
                }`}
                style={{
                  borderColor: interactiveInput ? accent.hex : undefined,
                }}
              />
              <button
                type="button"
                onClick={handleSendInteractive}
                aria-label="Send test message"
                className="absolute right-1.5 w-5 h-5 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                style={{
                  backgroundColor: accent.hex,
                  color: "#0B0F14",
                }}
              >
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const LiveSolennePreview = LiveEchoSoulPreview;
