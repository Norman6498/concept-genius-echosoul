"use client";

import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  showText?: boolean;
}

export function BrandLogo({ className = "", size = "md", href = "/", showText = true }: BrandLogoProps) {
  const iconDimensions = {
    sm: "w-8 h-8",
    md: "w-10 h-10 sm:w-11 sm:h-11",
    lg: "w-12 h-12 sm:w-14 sm:h-14",
  }[size];

  const titleSize = {
    sm: "text-xl",
    md: "text-2xl sm:text-[26px]",
    lg: "text-3xl sm:text-4xl",
  }[size];

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D78A] rounded-lg ${className}`}
      aria-label="EchoSoul Home"
    >
      {/* Crescent Moon + Star Crest inside concentric circles */}
      <div className={`relative ${iconDimensions} flex items-center justify-center shrink-0`}>
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-[0_0_10px_rgba(242,215,138,0.35)]">
          {/* Outer ring */}
          <circle cx="24" cy="24" r="22" stroke="#F2D78A" strokeWidth="1.2" opacity="0.65" />
          {/* Inner ring */}
          <circle cx="24" cy="24" r="16" stroke="#F2D78A" strokeWidth="0.8" opacity="0.4" />
          {/* Crescent moon shape */}
          <path
            d="M29 15a11 11 0 1 1-14 14 8 8 0 0 0 14-14z"
            fill="#F2D78A"
          />
          {/* Four-point inner star inside crescent */}
          <path
            d="M21 21L22.5 24L21 27L19.5 24Z"
            fill="#FFF8E1"
            opacity="0.9"
          />
          <path
            d="M18 24L21 22.5L24 24L21 25.5Z"
            fill="#FFF8E1"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-medium text-[#FFF8E1] tracking-wide transition-colors group-hover:text-[#F2D78A] ${titleSize}`}>
            EchoSoul
          </span>
          <span className="font-ui text-[8.5px] sm:text-[9.5px] tracking-[0.24em] uppercase text-[#F2D78A] font-medium mt-1">
            YOUR STORY MATTERS
          </span>
        </div>
      )}
    </Link>
  );
}
