import React from "react";

interface EmotionChipProps {
  label: string;
  variant?: "neutral" | "tender" | "heavy" | "hopeful";
  className?: string;
}

export function EmotionChip({ label, variant = "neutral", className = "" }: EmotionChipProps) {
  const styles = {
    neutral: "bg-white/[0.06] text-slate-300 border-white/[0.08]",
    tender: "bg-indigo-500/15 text-indigo-200 border-indigo-500/25",
    heavy: "bg-slate-700/30 text-slate-300 border-slate-600/30",
    hopeful: "bg-amber-500/15 text-amber-200 border-amber-500/25",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-normal border tracking-wide transition-colors ${styles[variant]} ${className}`}
    >
      {label}
    </span>
  );
}
