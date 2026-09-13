"use client";

import React from "react";
import CinematicBackground, { CinematicBackgroundProps } from "./CinematicBackground";
import AmbientParticles from "./AmbientParticles";
import LampGlow from "./LampGlow";
import FogLayer from "./FogLayer";

export interface EchoEnvironmentProps {
  world?:
    | "sanctuary"
    | "hero"
    | "about"
    | "mountain_calm"
    | "forest_retreat"
    | "ocean_breeze"
    | "city_lights"
    | "starry_skies"
    | "cozy_room"
    | "fantasy_realm"
    | "minimal_space"
    | "anime_aesthetic"
    | "nature_wildlife"
    | "space_cosmos"
    | "classic_vintage"
    | string;
  customSrc?: string;
  priority?: boolean;
  particles?: boolean | "stars" | "fireflies";
  lampGlow?: boolean;
  fog?: boolean;
  focalPoint?: { desktop?: string; mobile?: string };
  overlay?: CinematicBackgroundProps["overlay"];
  className?: string;
  children?: React.ReactNode;
}

// Maps canonical world keys to their high-resolution background asset
const WORLD_BACKGROUND_MAP: Record<string, string> = {
  sanctuary: "/assets/echosoul/04-auth/auth_sanctuary_night.png",
  hero: "/assets/echosoul/02-environments/page1_hero.jpg",
  about: "/assets/echosoul/14-marketing/about_backdrop.jpg",
  mountain_calm: "/assets/echosoul/02-environments/mountain_calm.jpg",
  forest_retreat: "/assets/echosoul/02-environments/forest_retreat.jpg",
  ocean_breeze: "/assets/echosoul/02-environments/ocean_breeze.jpg",
  city_lights: "/assets/echosoul/02-environments/city_lights.jpg",
  starry_skies: "/assets/echosoul/02-environments/starry_skies.jpg",
  cozy_room: "/assets/echosoul/02-environments/cozy_room.jpg",
  fantasy_realm: "/assets/echosoul/02-environments/fantasy_realm.jpg",
  minimal_space: "/assets/echosoul/02-environments/minimal_space.jpg",
  anime_aesthetic: "/assets/echosoul/02-environments/anime_aesthetic.jpg",
  nature_wildlife: "/assets/echosoul/02-environments/nature_wildlife.jpg",
  space_cosmos: "/assets/echosoul/02-environments/space_cosmos.jpg",
  classic_vintage: "/assets/echosoul/02-environments/classic_vintage.jpg",
};

export function EchoEnvironment({
  world = "sanctuary",
  customSrc,
  priority = false,
  particles = true,
  lampGlow = false,
  fog = false,
  focalPoint,
  overlay = "sanctuary",
  className = "",
  children,
}: EchoEnvironmentProps) {
  // Determine image source
  const normalizedKey = (world || "sanctuary").toLowerCase().replace(/[\s-]/g, "_");
  const imgSrc =
    customSrc ||
    WORLD_BACKGROUND_MAP[normalizedKey] ||
    `/visual-worlds/${normalizedKey}.jpg`;

  // Default focal point optimization for sanctuary (keep desk & candle in view on mobile)
  const defaultFocalPoint =
    world === "sanctuary"
      ? { desktop: "25% center", mobile: "20% center" }
      : { desktop: "center center", mobile: "center center" };

  const effectiveFocalPoint = focalPoint || defaultFocalPoint;

  return (
    <div className={`relative w-full min-h-screen ${className}`}>
      {/* 1. Master Cinematic Background */}
      <CinematicBackground
        src={imgSrc}
        priority={priority}
        focalPoint={effectiveFocalPoint}
        overlay={overlay}
      />

      {/* 2. Ambient Fog Layer */}
      {fog && <FogLayer opacity={0.22} />}

      {/* 3. Celestial Star or Firefly Particles */}
      {particles && (
        <AmbientParticles
          count={world === "starry_skies" ? 36 : 18}
          type={particles === "fireflies" ? "fireflies" : "stars"}
          palette={world === "cozy_room" || world === "sanctuary" ? "gold" : "celestial"}
        />
      )}

      {/* 4. Candle & Lamp Warm Aura */}
      {lampGlow && (
        <LampGlow
          position={{ bottom: "22%", left: "18%" }}
          size={240}
          color="rgba(242, 215, 138, 0.3)"
        />
      )}

      {/* 5. Foreground Content Layer */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}

export default EchoEnvironment;
