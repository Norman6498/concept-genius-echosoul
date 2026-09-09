import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: number;
  href?: string;
}

export function BrandLogo({
  className = "",
  showWordmark = true,
  size = 38,
  href = "/",
}: BrandLogoProps) {
  const content = (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Official EchoSoul Mark SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 128 128"
        width={size}
        height={size}
        role="img"
        aria-label="EchoSoul mark"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <radialGradient id="echosoul-g" cx="45%" cy="40%">
            <stop offset="0%" stopColor="#F7D57B" />
            <stop offset="55%" stopColor="#D9A441" />
            <stop offset="100%" stopColor="#8B5D17" />
          </radialGradient>
        </defs>
        <circle cx="64" cy="64" r="54" fill="#07131B" stroke="#D9A441" strokeWidth="3" />
        <path
          d="M82 31c-25-9-45 8-45 30 0 20 15 34 35 34 10 0 19-4 25-11-7 4-14 5-21 3-13-4-20-14-20-27 0-15 10-25 26-29z"
          fill="url(#echosoul-g)"
        />
        <path
          d="M42 61c9-4 18-4 27 0"
          fill="none"
          stroke="#07131B"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>

      {showWordmark && (
        <div className="flex flex-col">
          <span className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#F5EBD6] group-hover:text-[#F2C86A] transition-colors leading-none">
            EchoSoul
          </span>
          <span className="text-[9px] uppercase tracking-[0.24em] text-[#9AA8B0] font-medium mt-1 hidden sm:block">
            Your story matters
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441] rounded-md">
        {content}
      </Link>
    );
  }

  return content;
}
