"use client";

import React from "react";
import { useAuth } from "@/lib/auth/context";
import { ShieldCheck, EyeOff } from "lucide-react";

export function PrivacyIndicator() {
  const { isPrivateSession, setPrivateSession } = useAuth();

  return (
    <button
      onClick={() => setPrivateSession(!isPrivateSession)}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-normal border transition-all duration-200 cursor-pointer ${
        isPrivateSession
          ? "bg-amber-500/15 border-amber-400/30 text-amber-200 shadow-sm shadow-amber-500/10"
          : "bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08]"
      }`}
      title="Toggle Private Session (In private sessions, no conversation memory is stored)"
    >
      {isPrivateSession ? (
        <>
          <EyeOff className="h-3.5 w-3.5 text-amber-400" />
          <span>Private Mode (No Memory)</span>
        </>
      ) : (
        <>
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/90" />
          <span>Memory: Hybrid (Encrypted)</span>
        </>
      )}
    </button>
  );
}
