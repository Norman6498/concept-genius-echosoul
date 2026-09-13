"use client";

import React from "react";

export interface FogLayerProps {
  opacity?: number;
  speed?: "slow" | "medium";
  className?: string;
}

export function FogLayer({
  opacity = 0.25,
  speed = "slow",
  className = "",
}: FogLayerProps) {
  const duration = speed === "slow" ? "40s" : "25s";

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none motion-reduce:hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute w-[200%] h-full top-0 left-0 animate-fog-drift"
        style={{
          opacity,
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(154, 168, 176, 0.18) 0%, rgba(11, 15, 20, 0) 70%)",
          animation: `fogDrift ${duration} linear infinite alternate`,
        }}
      />
      <style jsx>{`
        @keyframes fogDrift {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
      `}</style>
    </div>
  );
}

export default FogLayer;
