"use client";

import React from "react";

export type IconName =
  | "chat"
  | "book"
  | "music"
  | "visual"
  | "heart"
  | "google"
  | "apple"
  | "email"
  | "arrow-left"
  | "arrow-right"
  | "play"
  | "secure"
  | "control"
  | "support"
  | "user"
  | "lock"
  | "eye"
  | "eye-off";

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export function IconSet({ name, className = "w-6 h-6 text-[#F2D78A]", size }: IconProps) {
  const sizeStyle = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  switch (name) {
    case "chat":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={sizeStyle} aria-hidden={true}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          <circle cx="8" cy="12" r="0.8" fill="currentColor" />
          <circle cx="12" cy="12" r="0.8" fill="currentColor" />
          <circle cx="16" cy="12" r="0.8" fill="currentColor" />
        </svg>
      );

    case "book":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={sizeStyle} aria-hidden={true}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="8" y1="7" x2="16" y2="7" strokeLinecap="round" />
          <line x1="8" y1="11" x2="14" y2="11" strokeLinecap="round" />
        </svg>
      );

    case "music":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={sizeStyle} aria-hidden={true}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );

    case "visual":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={sizeStyle} aria-hidden={true}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
      );

    case "heart":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={sizeStyle} aria-hidden={true}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );

    case "google":
      return (
        <svg viewBox="0 0 24 24" className={className} style={sizeStyle} aria-hidden={true}>
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.34 24 12 24z" />
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.99 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
        </svg>
      );

    case "apple":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={sizeStyle} aria-hidden={true}>
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.78 1.06-1.85.94-2.94-1 .04-2.14.65-2.8 1.42-.58.66-1.09 1.76-.95 2.82 1.11.08 2.18-.55 2.81-1.3" />
        </svg>
      );

    case "email":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={sizeStyle} aria-hidden={true}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
        </svg>
      );

    case "arrow-left":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={sizeStyle} aria-hidden={true}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7 7-7-7 7-7" />
        </svg>
      );

    case "arrow-right":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={sizeStyle} aria-hidden={true}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
        </svg>
      );

    case "play":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={sizeStyle} aria-hidden={true}>
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      );

    case "secure":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={sizeStyle} aria-hidden={true}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
        </svg>
      );

    case "control":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={sizeStyle} aria-hidden={true}>
          <line x1="4" y1="21" x2="4" y2="14" strokeLinecap="round" />
          <line x1="4" y1="10" x2="4" y2="3" strokeLinecap="round" />
          <line x1="12" y1="21" x2="12" y2="12" strokeLinecap="round" />
          <line x1="12" y1="8" x2="12" y2="3" strokeLinecap="round" />
          <line x1="20" y1="21" x2="20" y2="16" strokeLinecap="round" />
          <line x1="20" y1="12" x2="20" y2="3" strokeLinecap="round" />
          <line x1="1" y1="14" x2="7" y2="14" strokeLinecap="round" />
          <line x1="9" y1="8" x2="15" y2="8" strokeLinecap="round" />
          <line x1="17" y1="16" x2="23" y2="16" strokeLinecap="round" />
        </svg>
      );

    case "support":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={sizeStyle} aria-hidden={true}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z" />
        </svg>
      );

    case "user":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={sizeStyle} aria-hidden={true}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );

    case "lock":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={sizeStyle} aria-hidden={true}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );

    case "eye":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={sizeStyle} aria-hidden={true}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );

    case "eye-off":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={sizeStyle} aria-hidden={true}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    default:
      return null;
  }
}
