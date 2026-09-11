import React from "react";

export function getInterestIcon(id: string, isSelected: boolean): React.ReactNode {
  const glow = isSelected ? "text-[#0B0F14]" : "text-[#F2D78A]";

  switch (id) {
    // ── Subjects & Learning ──────────────────────────────────────────
    case "science":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <circle cx="12" cy="12" r="2" fill="currentColor" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" strokeWidth="1.5" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" strokeWidth="1.5" transform="rotate(-30 12 12)" />
        </svg>
      );
    case "technology":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
          <path d="M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3M19 9h3m-3 6h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "mathematics":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M4 7h6M7 4v6M14 8h6M14 11h6M5 19l4-4m0 4l-4-4M17 19a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "biology":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M12 2C7 7 4 12 5 17a7 7 0 0014 0c1-5-2-10-7-15z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 6v13m0-8c2-1 4 0 4 0m-4-3c-2-1-4 0-4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "history":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M4 21h16M5 7h14M6 7l6-4 6 4M7 7v14M11 7v14M13 7v14M17 7v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "psychology":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M9.5 4a3.5 3.5 0 00-3.5 3.5c0 .7.2 1.4.6 2A3.5 3.5 0 004 13a3.5 3.5 0 002.5 3.4V18a2 2 0 002 2h3v-2.5h-1a1 1 0 01-1-1v-.6a3.5 3.5 0 002-3.1V7.5A3.5 3.5 0 009.5 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M14.5 4a3.5 3.5 0 013.5 3.5c0 .7-.2 1.4-.6 2A3.5 3.5 0 0120 13a3.5 3.5 0 01-2.5 3.4V18a2 2 0 01-2 2h-3v-2.5h1a1 1 0 001-1v-.6a3.5 3.5 0 01-2-3.1V7.5A3.5 3.5 0 0114.5 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "philosophy":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M12 3c-3 0-5 2.5-5 5.5 0 2 1 3.5 2 4.5.5.5 1 1.5 1 2.5v1h4v-1c0-1 .5-2 1-2.5 1-1 2-2.5 2-4.5 0-3-2-5.5-5-5.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 19h6M10 22h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "literature":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M12 6.5A5.5 5.5 0 003 9v11a5 5 0 019-2.5m0-11a5.5 5.5 0 019 2.5v11a5 5 0 00-9-2.5m0-11v11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "art":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M12 3C7 3 3 7 3 12c0 3.5 2 6.5 5 7.5.5.2 1-.2 1-.7v-1.3c0-.8.7-1.5 1.5-1.5h1.5c3.3 0 6-2.7 6-6 0-4-3-7-6-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
          <circle cx="10.5" cy="7.5" r="1" fill="currentColor" />
          <circle cx="14.5" cy="8.5" r="1" fill="currentColor" />
        </svg>
      );

    // ── Creative Interests ──────────────────────────────────────────
    case "writing":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M15.2 3.8a2.5 2.5 0 013.5 3.5L7 19l-4 1 1-4L15.2 3.8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 5l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "music":
    case "music_ent":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M3 18v-6a9 9 0 0118 0v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M21 16a2 2 0 00-2-2h-1v6h1a2 2 0 002-2v-2zM5 14H4a2 2 0 00-2 2v2a2 2 0 002 2h1v-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "drawing_art":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M4 20l4-1 11-11a2 2 0 00-3-3L5 16l-1 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.5 6.5l3 3M16 19h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "photography":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M4 7h4l2-3h4l2 3h4a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "video_animation":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 9h18M8 5v4m4-4v4m4-4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <polygon points="10,12 15,14.5 10,17" fill="currentColor" />
        </svg>
      );
    case "storytelling":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M12 4v16m-8-2c3-1 6-1 8 0 2-1 5-1 8 0V5c-3-1-6-1-8 0-2-1-5-1-8 0v13z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 2l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="currentColor" />
        </svg>
      );
    case "design":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M12 2l3 7h7l-5.5 4.5 2 7.5L12 17l-6.5 4 2-7.5L2 9h7l3-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "gaming":
    case "games":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <rect x="3" y="6" width="18" height="12" rx="4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 12h4m-2-2v4m8-2h.01m2-2h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // ── Wellness & Life ─────────────────────────────────────────────
    case "mental_health":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M12 21c-4-4-8-7.5-8-12a5 5 0 019.5-2.5A5 5 0 0120 9c0 4.5-4 8-8 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "fitness":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M6 8v8m2-8v8m8-8v8m2-8v8M4 10v4m16-4v4M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "productivity":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "career_guidance":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M12 12v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "relationships":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M16 11a4 4 0 10-8 0 4 4 0 008 0zM6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "spirituality":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M12 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4zM6 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2zM18 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="currentColor" />
        </svg>
      );
    case "nature":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M12 3L6 14h3l-3 6h12l-3-6h3L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 20v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "travel":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 12h18M12 3c3 3 4.5 6 4.5 9s-1.5 6-4.5 9c-3-3-4.5-6-4.5-9s1.5-6 4.5-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "self_improvement":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── Entertainment ───────────────────────────────────────────────
    case "anime":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M12 3l1.8 5.5H19l-4.5 3.5 1.7 5.5-4.2-3.2-4.2 3.2 1.7-5.5L4.5 8.5h5.2L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "movies":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 5v14M17 5v14M3 9h4M17 9h4M3 15h4M17 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "books":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 8h15M8 4v16" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "poetry":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <path d="M20 4c-4 0-7 2-10 6-2 3-3 6-4 10 4-1 7-2 10-4 4-3 6-6 6-10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 10l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "podcasts":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 10a7 7 0 0014 0M12 17v4m-3 0h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "web_series":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 20h8m-4-3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <polygon points="10,8 15,10.5 10,13" fill="currentColor" />
        </svg>
      );
    case "manga":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${glow}`}>
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 10h18M12 10v10" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );

    default:
      // Other / 3-dots
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${glow}`}>
          <circle cx="5" cy="12" r="2.2" />
          <circle cx="12" cy="12" r="2.2" />
          <circle cx="19" cy="12" r="2.2" />
        </svg>
      );
  }
}
