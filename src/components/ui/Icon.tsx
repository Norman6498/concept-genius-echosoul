import React from "react";

export type IconName =
  | "talk"
  | "music"
  | "words"
  | "scenes"
  | "moments"
  | "journey"
  | "settings"
  | "heart"
  | "search"
  | "play"
  | "microphone";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  className?: string;
  "aria-label"?: string;
}

export function Icon({
  name,
  size = 20,
  className = "",
  "aria-label": ariaLabel,
  ...props
}: IconProps) {
  const isAriaHidden = !ariaLabel;

  const renderPath = () => {
    switch (name) {
      case "talk":
        return <path d="M24 32h80v48H44L24 96V32z" />;
      case "music":
        return (
          <>
            <path d="M36 88a14 14 0 1 0 0-28 14 14 0 0 0 0 28z M78 78a14 14 0 1 0 0-28 14 14 0 0 0 0 28z" />
            <path d="M50 60V28l42-10v42" />
          </>
        );
      case "words":
        return <path d="M22 22h84v84H22z M34 38h60 M34 54h60 M34 70h42" />;
      case "scenes":
        return (
          <>
            <path d="M22 26h84v76H22z" />
            <path d="M32 78l22-26 18 20 12-12 12 18" />
          </>
        );
      case "moments":
        return (
          <>
            <path d="M28 24h72v80H28z" />
            <path d="M44 16v16 M84 16v16 M28 44h72" />
          </>
        );
      case "journey":
        return (
          <>
            <path d="M24 94c20-40 40 10 80-60" />
            <path d="M34 34l70 0 M104 34l0 70" />
          </>
        );
      case "settings":
        return (
          <>
            <circle cx="64" cy="64" r="18" />
            <path d="M64 20v14 M64 94v14 M20 64h14 M94 64h14 M33 33l10 10 M85 85l10 10 M33 95l10-10 M85 43l10-10" />
          </>
        );
      case "heart":
        return (
          <path d="M64 100S24 74 24 46a20 20 0 0 1 35-13l5 7 5-7a20 20 0 0 1 35 13c0 28-40 54-40 54z" />
        );
      case "search":
        return (
          <>
            <circle cx="56" cy="56" r="30" />
            <path d="M78 78l28 28" />
          </>
        );
      case "play":
        return <path d="M46 34l46 30-46 30V34z" fill="currentColor" stroke="none" />;
      case "microphone":
        return (
          <>
            <rect x="46" y="24" width="36" height="52" rx="18" />
            <path d="M34 58a30 30 0 0 0 60 0 M64 88v18 M46 106h36" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={name === "play" ? 0 : 6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={isAriaHidden}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : "presentation"}
      className={`inline-block shrink-0 ${className}`}
      {...props}
    >
      {renderPath()}
    </svg>
  );
}
