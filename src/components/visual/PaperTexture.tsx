"use client";

import React from "react";

export interface PaperTextureProps {
  opacity?: number; // 0.02 - 0.12
  variant?: "paper" | "noise";
  className?: string;
  children?: React.ReactNode;
}

export function PaperTexture({
  opacity = 0.05,
  variant = "paper",
  className = "",
  children,
}: PaperTextureProps) {
  const textureUrl =
    variant === "paper"
      ? "/assets/echosoul/16-textures/paper-grain.svg"
      : "/assets/echosoul/16-textures/subtle-noise.svg";

  return (
    <div className={`relative ${className}`}>
      {/* Paper Grain Overlay */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-[1]"
        style={{
          backgroundImage: `url(${textureUrl})`,
          backgroundRepeat: "repeat",
          opacity,
          mixBlendMode: "overlay",
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

export default PaperTexture;
