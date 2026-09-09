"use client";

import React from "react";

interface LivingEnvironmentProps {
  className?: string;
  children?: React.ReactNode;
}

export function LivingEnvironment({
  className = "",
  children,
}: LivingEnvironmentProps) {
  return (
    <div className={`relative w-full overflow-hidden bg-[#050B10] ${className}`}>
      {/* 1. Base Sky Atmosphere Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050B10] via-[#071522] to-[#0A1B2A] pointer-events-none" />

      {/* 2. Twilight Golden Horizon Glow (concentrated mid-right across the mountains and lake) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 72% 65%, rgba(224, 134, 43, 0.32) 0%, rgba(217, 164, 65, 0.18) 40%, transparent 80%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(circle 600px at 85% 20%, rgba(143, 174, 217, 0.15) 0%, transparent 70%)",
        }}
      />

      {/* 3. Celestial Layer: Twinkling Stars & Glowing Crescent Moon */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Starfield */}
        <svg
          className="absolute inset-0 w-full h-full opacity-75"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="#F5EBD6">
            <circle cx="15%" cy="12%" r="1" opacity="0.6" />
            <circle cx="28%" cy="18%" r="1.4" opacity="0.8" />
            <circle cx="38%" cy="9%" r="1" opacity="0.5" />
            <circle cx="48%" cy="14%" r="1.2" opacity="0.7" />
            <circle cx="58%" cy="22%" r="1" opacity="0.4" />
            <circle cx="68%" cy="10%" r="1.8" opacity="0.9" />
            <circle cx="74%" cy="16%" r="1.2" opacity="0.75" />
            <circle cx="82%" cy="7%" r="1.6" opacity="0.85" />
            <circle cx="91%" cy="14%" r="1.3" opacity="0.8" />
            <circle cx="96%" cy="22%" r="1" opacity="0.6" />
            <circle cx="62%" cy="28%" r="1.2" opacity="0.5" />
            <circle cx="78%" cy="25%" r="1.5" opacity="0.7" />
            <circle cx="88%" cy="32%" r="1" opacity="0.5" />
            <circle cx="45%" cy="26%" r="1.3" opacity="0.6" />
          </g>
        </svg>

        {/* Crescent Moon with Ethereal Atmospheric Glow (top right as in reference) */}
        <div className="absolute top-[8%] right-[8%] sm:right-[14%] md:right-[18%] w-16 h-16 sm:w-20 sm:h-20 pointer-events-none">
          <div className="absolute -inset-4 rounded-full bg-[#F2C86A]/20 blur-xl animate-pulse" />
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_0_24px_rgba(242,200,106,0.6)]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="crescentGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF8E7" />
                <stop offset="60%" stopColor="#F5D78E" />
                <stop offset="100%" stopColor="#D9A441" />
              </linearGradient>
            </defs>
            <path
              d="M66 18 A 38 38 0 1 0 76 74 A 32 32 0 1 1 66 18 Z"
              fill="url(#crescentGlow)"
              opacity="0.96"
            />
          </svg>
        </div>
      </div>

      {/* 4. Drifting Cloud Layers */}
      <div className="absolute inset-x-0 top-[8%] h-[35%] pointer-events-none opacity-25 animate-clouds-far">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,140 C340,90 520,210 820,130 C1080,70 1280,180 1440,120 L1440,320 L0,320 Z"
            fill="url(#cloudFar)"
          />
          <defs>
            <linearGradient id="cloudFar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8FAED9" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#08131B" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute inset-x-0 top-[22%] h-[30%] pointer-events-none opacity-20 animate-clouds-near">
        <svg
          viewBox="0 0 1440 280"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,100 C300,180 600,60 920,140 C1180,210 1340,90 1440,110 L1440,280 L0,280 Z"
            fill="url(#cloudNear)"
          />
          <defs>
            <linearGradient id="cloudNear" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D9A441" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#050B10" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 5. Landscape: Layered Mountain Ridges, Lake & Horizon Lights */}
      <div className="absolute inset-x-0 bottom-0 h-[65%] pointer-events-none">
        <svg
          viewBox="0 0 1440 600"
          className="w-full h-full object-cover object-bottom"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Mountain Ridge Gradients */}
            <linearGradient id="mountainRidgeFar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E2A38" />
              <stop offset="100%" stopColor="#0B1722" />
            </linearGradient>
            <linearGradient id="mountainRidgeMid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#121F2C" />
              <stop offset="100%" stopColor="#07111A" />
            </linearGradient>
            <linearGradient id="foreRock" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0A151E" />
              <stop offset="100%" stopColor="#04090D" />
            </linearGradient>
          </defs>

          {/* Denser Mountains in Right & Center */}
          <path
            d="M480,380 L620,290 L760,340 L910,240 L1080,330 L1220,250 L1360,310 L1440,270 L1440,600 L480,600 Z"
            fill="url(#mountainRidgeFar)"
            opacity="0.8"
          />

          {/* Midground Mountain Ridge */}
          <path
            d="M560,420 L720,330 L880,390 L1040,310 L1180,380 L1340,320 L1440,360 L1440,600 L560,600 Z"
            fill="url(#mountainRidgeMid)"
            opacity="0.92"
          />

          {/* Lake Water Surface */}
          <path
            d="M0,520 C420,510 860,515 1440,512 L1440,600 L0,600 Z"
            fill="#050B10"
          />

          {/* Golden Shoreline / City Lights Shimmer on Lake */}
          <g fill="#F2C86A">
            <circle cx="820" cy="445" r="1.5" opacity="0.8" />
            <circle cx="850" cy="442" r="2" opacity="0.95" />
            <circle cx="890" cy="448" r="1.2" opacity="0.7" />
            <circle cx="930" cy="443" r="1.8" opacity="0.85" />
            <circle cx="970" cy="447" r="1" opacity="0.6" />
            <circle cx="1020" cy="441" r="2.2" opacity="0.9" />
            <circle cx="1070" cy="445" r="1.4" opacity="0.8" />
            <circle cx="1120" cy="442" r="1.8" opacity="0.85" />
            <circle cx="1160" cy="446" r="1.2" opacity="0.7" />
            <circle cx="1200" cy="440" r="2" opacity="0.95" />
            <circle cx="1250" cy="444" r="1.5" opacity="0.8" />
            <circle cx="1300" cy="442" r="1.8" opacity="0.75" />
          </g>

          {/* Water light reflections */}
          <ellipse cx="980" cy="475" rx="140" ry="12" fill="#F2C86A" opacity="0.12" filter="blur(6px)" />
          <ellipse cx="1140" cy="478" rx="120" ry="10" fill="#F2C86A" opacity="0.1" filter="blur(6px)" />

          {/* Foreground Rocky Cliff (Bottom Right as in reference) */}
          <path
            d="M920,600 C980,530 1100,485 1250,470 C1360,460 1420,490 1440,520 L1440,600 Z"
            fill="url(#foreRock)"
          />

          {/* Contemplative Figure in Silhouette Seated on the Rock (as in 01A_Landing.png) */}
          <g fill="#04090D" opacity="0.98">
            {/* Head */}
            <circle cx="1270" cy="425" r="13" />
            {/* Torso & Jacket */}
            <path d="M1252,438 C1248,455 1242,475 1245,505 L1295,505 C1298,475 1292,455 1288,438 Z" />
            {/* Seated folded legs / knees */}
            <path d="M1240,495 C1220,505 1205,520 1225,535 L1315,535 C1330,520 1315,505 1300,495 Z" />
          </g>
        </svg>
      </div>

      {/* 6. Foreground Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute bottom-[35%] right-[25%] w-1.5 h-1.5 rounded-full bg-[#F2C86A]/40 blur-[0.5px]"
          style={{ animation: "particle-drift 8s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[45%] right-[35%] w-2 h-2 rounded-full bg-[#F7D57B]/30 blur-[0.5px]"
          style={{ animation: "particle-drift 11s ease-in-out infinite 3s" }}
        />
        <div
          className="absolute bottom-[28%] right-[15%] w-1.5 h-1.5 rounded-full bg-[#F2C86A]/45 blur-[0.5px]"
          style={{ animation: "particle-drift 9s ease-in-out infinite 5s" }}
        />
      </div>

      {/* 7. Foreground Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
