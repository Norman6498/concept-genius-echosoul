"use client";

import React from "react";
import Image from "next/image";

export interface CinematicBackgroundProps {
  src: string;
  alt?: string;
  priority?: boolean;
  focalPoint?: {
    desktop?: string;
    mobile?: string;
  };
  overlay?: "none" | "subtle" | "vignette" | "heavy" | "gradient-to-bottom" | "sanctuary";
  className?: string;
  children?: React.ReactNode;
}

export function CinematicBackground({
  src,
  alt = "EchoSoul Ambient Atmosphere",
  priority = false,
  focalPoint = { desktop: "center center", mobile: "center center" },
  overlay = "subtle",
  className = "",
  children,
}: CinematicBackgroundProps) {
  const desktopPos = focalPoint.desktop || "center center";
  const mobilePos = focalPoint.mobile || desktopPos;

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* High-Resolution Master Background Image */}
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          quality={90}
          className="object-cover transition-opacity duration-700 ease-in-out"
          style={{
            objectPosition: mobilePos,
          }}
        />
      </div>

      {/* Atmospheric Overlays */}
      {overlay === "subtle" && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60 pointer-events-none" />
      )}

      {overlay === "vignette" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(11, 15, 20, 0) 35%, rgba(8, 19, 27, 0.7) 80%, rgba(5, 10, 15, 0.92) 100%)",
          }}
        />
      )}

      {overlay === "heavy" && (
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] pointer-events-none" />
      )}

      {overlay === "gradient-to-bottom" && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0F14]/40 to-[#0B0F14] pointer-events-none" />
      )}

      {overlay === "sanctuary" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(8, 19, 27, 0.65) 0%, rgba(8, 19, 27, 0.1) 40%, rgba(8, 19, 27, 0.15) 65%, rgba(8, 19, 27, 0.75) 100%), linear-gradient(180deg, rgba(8, 19, 27, 0.4) 0%, transparent 40%, rgba(8, 19, 27, 0.85) 100%)",
          }}
        />
      )}

      {children}
    </div>
  );
}

export default CinematicBackground;
