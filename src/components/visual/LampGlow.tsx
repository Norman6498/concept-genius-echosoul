"use client";

import React from "react";

export interface LampGlowProps {
  position?: {
    top?: string;
    left?: string;
    bottom?: string;
    right?: string;
  };
  size?: number; // size in px, e.g. 240
  color?: string; // e.g. "rgba(242, 215, 138, 0.35)"
  className?: string;
}

export function LampGlow({
  position = { bottom: "18%", left: "15%" },
  size = 220,
  color = "rgba(242, 215, 138, 0.28)",
  className = "",
}: LampGlowProps) {
  return (
    <div
      className={`absolute pointer-events-none rounded-full select-none es-lamp-glow motion-reduce:animate-none ${className}`}
      style={{
        ...position,
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, ${color} 0%, rgba(217, 164, 65, 0.12) 45%, transparent 70%)`,
        transform: "translate(-50%, -50%)",
        filter: "blur(24px)",
      }}
      aria-hidden="true"
    />
  );
}

export default LampGlow;
