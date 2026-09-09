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
  size = 40,
  href = "/",
}: BrandLogoProps) {
  const content = (
    <div className={`inline-flex items-center gap-3.5 select-none group ${className}`}>
      {/* Official EchoSoul Mark SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 128 128"
        width={size}
        height={size}
        role="img"
        aria-label="EchoSoul mark"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(217,164,65,0.4)]"
      >
        <defs>
          <radialGradient id="echosoul-gold-grad" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFF2D1" />
            <stop offset="35%" stopColor="#F2C86A" />
            <stop offset="70%" stopColor="#D9A441" />
            <stop offset="100%" stopColor="#8B5D17" />
          </radialGradient>
        </defs>
        {/* Outer subtle concentric circle */}
        <circle cx="64" cy="64" r="58" fill="none" stroke="#D9A441" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 4" />
        {/* Inner dark core */}
        <circle cx="64" cy="64" r="52" fill="#07131B" stroke="#D9A441" strokeWidth="2.5" />
        {/* Glowing crescent soul */}
        <path
          d="M84 28c-26-9-48 9-48 33 0 22 17 37 38 37 11 0 21-4 28-12-8 4-16 5-23 3-14-4-22-15-22-29 0-16 11-27 27-32z"
          fill="url(#echosoul-gold-grad)"
        />
        {/* Inner gentle accent line */}
        <path
          d="M44 63c9-4 20-4 30 0"
          fill="none"
          stroke="#07131B"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {showWordmark && (
        <div className="flex flex-col">
          <span className="font-display text-2xl font-normal tracking-tight text-[#F5EBD6] group-hover:text-[#F2C86A] transition-colors leading-none">
            EchoSoul
          </span>
          <span className="text-[9px] uppercase tracking-[0.26em] text-[#9AA8B0] font-medium mt-1">
            Your story matters
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FAED9] rounded-md transition-opacity hover:opacity-95"
      >
        {content}
      </Link>
    );
  }

  return content;
}
