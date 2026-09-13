"use client";

import React, { useMemo } from "react";

export interface AmbientParticlesProps {
  count?: number;
  type?: "stars" | "fireflies" | "dust";
  palette?: "gold" | "celestial";
  className?: string;
}

interface Particle {
  id: number;
  top: string;
  left: string;
  size: number;
  opacity: number;
  delay: string;
  duration: string;
}

export function AmbientParticles({
  count = 18,
  type = "stars",
  palette = "gold",
  className = "",
}: AmbientParticlesProps) {
  // Deterministic particle generation based on count
  const particles: Particle[] = useMemo(() => {
    const items: Particle[] = [];
    // Deterministic pseudo-random seed generator
    let seed = 42;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        top: `${(rnd() * 85 + 5).toFixed(1)}%`,
        left: `${(rnd() * 90 + 5).toFixed(1)}%`,
        size: Math.round(rnd() * 3 + (type === "fireflies" ? 2 : 1)),
        opacity: +(rnd() * 0.5 + 0.3).toFixed(2),
        delay: `${(rnd() * 4).toFixed(1)}s`,
        duration: `${(rnd() * 3 + 3).toFixed(1)}s`,
      });
    }
    return items;
  }, [count, type]);

  const colorClass =
    palette === "gold"
      ? "bg-[#F2D78A] shadow-[0_0_8px_rgba(242,215,138,0.7)]"
      : "bg-[#90E0EF] shadow-[0_0_8px_rgba(144,224,239,0.7)]";

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none motion-reduce:hidden ${className}`}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className={`absolute rounded-full transition-opacity ${colorClass} ${
            type === "fireflies"
              ? "animate-pulse"
              : "animate-star-twinkle"
          }`}
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

export default AmbientParticles;
