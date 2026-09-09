"use client";

import React, { useState } from "react";

interface LivingEnvironmentProps {
  className?: string;
  children?: React.ReactNode;
  showWindowSill?: boolean;
}

export function LivingEnvironment({
  className = "",
  children,
  showWindowSill = true,
}: LivingEnvironmentProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  return (
    <div className={`relative w-full overflow-hidden bg-[#050B10] ${className}`}>
      {/* 1. Base Sky Atmosphere Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050B10] via-[#071728] to-[#0A1E30] pointer-events-none" />

      {/* 2. Milky Way Cosmic Star Dust & Nebula Haze */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(143, 174, 217, 0.18) 0%, rgba(217, 164, 65, 0.08) 40%, transparent 80%)",
        }}
      />

      {/* 3. Twilight Golden Horizon Glow (behind mountain ridges) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 40% at 55% 68%, rgba(224, 134, 43, 0.35) 0%, rgba(217, 164, 65, 0.18) 35%, transparent 75%)",
        }}
      />

      {/* 4. Celestial Layer: Twinkling Starfield & Glowing Crescent Moon */}
      <div className="absolute inset-0 pointer-events-none">
        {/* SVG Starfield */}
        <svg
          className="absolute inset-0 w-full h-full opacity-80"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="#F5EBD6">
            <circle cx="12%" cy="14%" r="1" opacity="0.6" />
            <circle cx="22%" cy="20%" r="1.4" opacity="0.85" />
            <circle cx="34%" cy="8%" r="1.1" opacity="0.7" />
            <circle cx="44%" cy="16%" r="1.6" opacity="0.9" />
            <circle cx="52%" cy="24%" r="1" opacity="0.5" />
            <circle cx="60%" cy="12%" r="1.8" opacity="0.95" />
            <circle cx="68%" cy="18%" r="1.2" opacity="0.75" />
            <circle cx="75%" cy="8%" r="1.5" opacity="0.8" />
            <circle cx="84%" cy="15%" r="1.3" opacity="0.7" />
            <circle cx="92%" cy="22%" r="1" opacity="0.6" />
            <circle cx="48%" cy="30%" r="1.3" opacity="0.6" />
            <circle cx="64%" cy="32%" r="1.5" opacity="0.7" />
            <circle cx="80%" cy="28%" r="1.1" opacity="0.55" />
            <circle cx="18%" cy="32%" r="1" opacity="0.5" />
            <circle cx="28%" cy="26%" r="1.4" opacity="0.75" />
          </g>
        </svg>

        {/* Luminous Crescent Moon with Atmospheric Aura */}
        <div className="absolute top-[8%] right-[8%] sm:right-[15%] md:right-[26%] w-16 h-16 sm:w-20 sm:h-20 pointer-events-none">
          <div className="absolute -inset-6 rounded-full bg-[#F2C86A]/25 blur-2xl animate-pulse" />
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_0_28px_rgba(242,200,106,0.65)]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="moonGoldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9EB" />
                <stop offset="50%" stopColor="#F5D78E" />
                <stop offset="100%" stopColor="#D9A441" />
              </linearGradient>
            </defs>
            <path
              d="M66 18 A 38 38 0 1 0 76 74 A 32 32 0 1 1 66 18 Z"
              fill="url(#moonGoldGlow)"
              opacity="0.98"
            />
          </svg>
        </div>
      </div>

      {/* 5. Drifting Clouds (Slow continuous organic motion) */}
      <div className="absolute inset-x-0 top-[10%] h-[32%] pointer-events-none opacity-25 es-cloud slow">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,140 C340,90 520,210 820,130 C1080,70 1280,180 1440,120 L1440,320 L0,320 Z"
            fill="url(#cloudGradFar)"
          />
          <defs>
            <linearGradient id="cloudGradFar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8FAED9" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#08131B" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 6. Distant Layered Mountains with Sunset Horizon Line */}
      <div className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none">
        <svg
          viewBox="0 0 1440 500"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back Mountain Ridge (silhouette against sunset horizon) */}
          <path
            d="M0,280 L180,210 L340,260 L520,160 L680,240 L840,150 L1020,220 L1200,170 L1340,230 L1440,200 L1440,500 L0,500 Z"
            fill="#091824"
            opacity="0.9"
          />

          {/* Mid Mountain Ridge (Dark Blue Slate) */}
          <path
            d="M0,330 L220,260 L420,310 L610,220 L780,300 L950,230 L1150,290 L1320,240 L1440,280 L1440,500 L0,500 Z"
            fill="#06121C"
          />

          {/* Winding Lake Water Surface */}
          <path
            d="M260,400 Q560,375 880,410 Q1120,385 1440,405 L1440,490 L260,490 Z"
            fill="url(#lakeWaterGrad)"
          />

          {/* Foreground Mountain Ledge (Deep Ink Ridge) */}
          <path
            d="M0,420 Q320,380 640,430 L820,410 Q1060,440 1440,415 L1440,500 L0,500 Z"
            fill="#04090E"
          />

          {/* Lake Golden Shore City Lights (glowing specks along the waterline) */}
          <g fill="#F2C86A" filter="url(#goldLightGlow)">
            <circle cx="480" cy="385" r="1.6" opacity="0.85" />
            <circle cx="510" cy="387" r="2.2" opacity="0.95" />
            <circle cx="535" cy="384" r="1.4" opacity="0.75" />
            <circle cx="560" cy="389" r="2.4" opacity="1" />
            <circle cx="590" cy="386" r="1.8" opacity="0.9" />
            <circle cx="620" cy="391" r="2.2" opacity="0.85" />
            <circle cx="660" cy="388" r="1.5" opacity="0.7" />
            <circle cx="710" cy="392" r="2.3" opacity="0.9" />
            <circle cx="740" cy="390" r="1.8" opacity="0.8" />
            <circle cx="780" cy="395" r="2" opacity="0.85" />
            <circle cx="820" cy="393" r="1.5" opacity="0.7" />
            <circle cx="860" cy="397" r="2.1" opacity="0.9" />
            <circle cx="910" cy="394" r="1.7" opacity="0.75" />
            <circle cx="950" cy="398" r="2.2" opacity="0.9" />
            <circle cx="990" cy="395" r="1.6" opacity="0.7" />
            <circle cx="1040" cy="399" r="2.3" opacity="0.85" />
          </g>

          <defs>
            <linearGradient id="lakeWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0B2336" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#071724" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#050B10" stopOpacity="1" />
            </linearGradient>
            <filter id="goldLightGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Contemplative Silhouette Figure sitting on rocky outcrop looking out */}
        <div className="absolute bottom-[10%] left-[54%] sm:left-[50%] md:left-[52%] w-12 sm:w-16 h-18 pointer-events-none opacity-90 hidden sm:block">
          <svg viewBox="0 0 60 70" className="w-full h-full fill-[#04090E]">
            {/* Head */}
            <circle cx="30" cy="14" r="7" />
            {/* Hood / Shoulders */}
            <path d="M18 24 Q30 20 42 24 L46 45 Q30 48 14 45 Z" />
            {/* Seated torso & knees */}
            <path d="M12 44 Q30 46 48 44 L54 62 Q30 66 6 62 Z" />
          </svg>
        </div>
      </div>

      {/* 7. Cozy Window Ledge & Candlelight Vignette (Right foreground on desktop, matching reference) */}
      {showWindowSill && (
        <div className="hidden lg:block absolute bottom-0 right-0 w-[420px] xl:w-[480px] h-[520px] pointer-events-none z-20">
          {/* Vertical Warm Window Frame Beam */}
          <div className="absolute top-0 right-[280px] xl:right-[320px] w-10 h-full bg-gradient-to-r from-[#07131B] via-[#102432] to-[#050B10] shadow-[10px_0_30px_rgba(0,0,0,0.8)] border-r border-[#D9A441]/15" />

          {/* Hanging Quote Card on Window Frame */}
          <div className="absolute top-[80px] right-8 w-64 p-4 rounded-xl bg-[#0C1B25]/85 backdrop-blur-md border border-[#D9A441]/30 shadow-[0_12px_36px_rgba(0,0,0,0.6)] text-left space-y-2">
            <p className="font-display italic text-sm text-[#F5EBD6] leading-relaxed">
              &ldquo;Sometimes the right words find you at exactly the right time.&rdquo;
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-[#D9A441]/15 text-[11px] text-[#F2C86A]">
              <span>— EchoSoul</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8DBA8F]" />
            </div>
          </div>

          {/* Stacked Hardcover Books */}
          <div className="absolute bottom-6 right-8 w-60 space-y-1.5">
            <div className="h-6 rounded bg-[#102531] border-b border-[#D9A441]/20 flex items-center px-3 text-[9px] uppercase tracking-wider text-[#9AA8B0] font-mono shadow-sm">
              Bolder Tomorrows
            </div>
            <div className="h-6 rounded bg-[#0D1F2A] border-b border-[#D9A441]/20 flex items-center px-3 text-[9px] uppercase tracking-wider text-[#9AA8B0] font-mono shadow-sm">
              Quiet Minds
            </div>
            <div className="h-7 rounded bg-[#132E3F] border-b border-[#D9A441]/30 flex items-center px-3 text-[10px] uppercase tracking-wider text-[#F2C86A] font-mono shadow-md font-semibold">
              A Brighter You
            </div>
          </div>

          {/* Glowing Glass Lantern with Organic Flicker */}
          <div className="absolute bottom-28 right-[190px] xl:right-[220px] w-14 h-22 pointer-events-none">
            {/* Ambient Flicker Aura */}
            <div className="absolute -inset-10 rounded-full bg-[#F2C86A]/20 blur-2xl es-lamp-glow" />
            <svg viewBox="0 0 50 80" className="w-full h-full">
              {/* Lantern Cap */}
              <path d="M15 15 L35 15 L40 25 L10 25 Z" fill="#201C16" stroke="#D9A441" strokeWidth="1" />
              {/* Glass Chamber */}
              <rect x="12" y="25" width="26" height="40" rx="3" fill="rgba(242, 200, 106, 0.15)" stroke="#D9A441" strokeWidth="1.5" />
              {/* Candle & Flame */}
              <rect x="22" y="44" width="6" height="18" rx="1" fill="#F5EBD6" />
              <ellipse cx="25" cy="38" rx="4" ry="7" fill="#FFF2D1" className="es-lamp-glow" />
              {/* Lantern Base */}
              <rect x="8" y="65" width="34" height="6" rx="2" fill="#201C16" stroke="#D9A441" strokeWidth="1" />
            </svg>
          </div>

          {/* Glowing Pillar Candle */}
          <div className="absolute bottom-24 right-12 w-10 h-16 pointer-events-none">
            <div className="absolute -inset-8 rounded-full bg-[#F2C86A]/25 blur-xl es-lamp-glow" />
            <div className="w-8 h-12 bg-gradient-to-t from-[#E8DEC8] to-[#FFF8EB] rounded-t-sm shadow-md relative mx-auto">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-2.5 h-4 bg-[#FFF2D1] rounded-full blur-[0.5px] es-lamp-glow" />
            </div>
          </div>

          {/* Steaming Mug of Tea */}
          <div className="absolute bottom-22 right-[125px] w-9 h-11 pointer-events-none">
            <div className="w-8 h-9 rounded-b-lg bg-[#241E18] border border-[#D9A441]/30 relative">
              <div className="absolute -right-2 top-1.5 w-3 h-5 border-2 border-[#D9A441]/40 rounded-r-md" />
              {/* Steam wisps */}
              <div className="absolute -top-3 left-2 w-1 h-3 bg-[#F5EBD6]/30 rounded-full blur-[1px] animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* 8. Floating Amber Light Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[35%] left-[25%] w-1.5 h-1.5 rounded-full bg-[#F2C86A] blur-[0.5px] es-particles" />
        <div className="absolute top-[55%] left-[45%] w-2 h-2 rounded-full bg-[#F2C86A] blur-[0.5px] es-particles" style={{ animationDelay: "3s" }} />
        <div className="absolute top-[40%] right-[32%] w-1.5 h-1.5 rounded-full bg-[#F2C86A] blur-[0.5px] es-particles" style={{ animationDelay: "6s" }} />
        <div className="absolute top-[70%] right-[18%] w-2 h-2 rounded-full bg-[#F2C86A] blur-[0.5px] es-particles" style={{ animationDelay: "2s" }} />
      </div>

      {/* 9. Forefront Child Content */}
      <div className="relative z-30 w-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}
