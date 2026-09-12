"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  ArrowLeft,
  Mic,
  Sparkles,
  X,
} from "lucide-react";
import {
  getConversationAnchor,
  getExperienceStack,
  popExperience,
  ConversationAnchor,
  ExperienceItem,
} from "@/lib/orchestration/experienceStack";

export function MiniConversationBar() {
  const router = useRouter();
  const [anchor, setAnchor] = useState<ConversationAnchor | null>(null);
  const [stack, setStack] = useState<ExperienceItem[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const update = () => {
      setAnchor(getConversationAnchor());
      setStack(getExperienceStack());
    };

    update();
    window.addEventListener("echosoul_experience_change", update);
    return () => window.removeEventListener("echosoul_experience_change", update);
  }, []);

  if (!anchor || stack.length === 0 || isDismissed) {
    return null;
  }

  const handleReturn = () => {
    const { nextRoute } = popExperience();
    router.push(nextRoute);
  };

  const currentTopic =
    anchor.lastTopic ||
    (anchor.lastUserMessage
      ? anchor.lastUserMessage.length > 36
        ? `"${anchor.lastUserMessage.slice(0, 36)}..."`
        : `"${anchor.lastUserMessage}"`
      : "your active conversation");

  return (
    <div className="sticky top-16 z-30 w-full bg-[#0C1B25]/95 backdrop-blur-md border-b border-[#F2D78A]/25 px-4 py-2 transition-all animate-fadeIn">
      <div className="max-w-[1740px] mx-auto flex items-center justify-between gap-3 text-xs">
        {/* Left: Return to Conversation Button */}
        <button
          onClick={handleReturn}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F2D78A]/15 hover:bg-[#F2D78A]/25 border border-[#F2D78A]/40 text-[#F2D78A] font-semibold transition-all cursor-pointer shadow-sm group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to conversation</span>
        </button>

        {/* Center: Live Conversation Thread Context */}
        <div className="hidden sm:flex items-center gap-2 text-[#CFC5B5] truncate">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
          <span className="text-[11px] text-[#9AA8B0]">Still talking about:</span>
          <span className="font-editorial text-sm text-[#FFF8E1] italic truncate max-w-md">
            {currentTopic}
          </span>
        </div>

        {/* Right: Quick Action to Talk / Dismiss */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReturn}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[#CFC5B5] hover:text-[#FFF8E1] text-[11px] transition-colors cursor-pointer"
            title="Resume speaking in Voice mode"
          >
            <Mic className="w-3 h-3 text-[#F2D78A]" />
            <span className="hidden md:inline">Resume Talk</span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-full text-[#9AA8B0] hover:text-[#FFF8E1] transition-colors"
            title="Dismiss reminder bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
