"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/StateView";
import { MOCK_JOURNEY_MILESTONES } from "@/lib/mocks/data";
import { Compass, Sparkles, CheckCircle2, Circle } from "lucide-react";

export default function JourneyPage() {
  const [milestones] = useState(MOCK_JOURNEY_MILESTONES);
  const [demoState, setDemoState] = useState<"default" | "empty" | "loading" | "error">("default");

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="border-b border-white/[0.06] pb-4 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[11px] font-serif-display mb-1">
          <Sparkles className="h-3 w-3" />
          <span>Growth without clinical scores</span>
        </div>
        <h1 className="text-2xl font-serif-display font-medium text-slate-100">
          Your Journey
        </h1>
        <p className="text-xs text-slate-400 font-light">
          &ldquo;Look how far you&apos;ve come.&rdquo;
        </p>
      </div>

      {/* State Switcher */}
      <div className="flex items-center gap-2 text-[10px] text-slate-400">
        <span>State preview:</span>
        {(["default", "loading", "empty", "error"] as const).map((st) => (
          <button
            key={st}
            onClick={() => setDemoState(st)}
            className={`px-2 py-0.5 rounded border capitalize cursor-pointer transition-colors ${
              demoState === st
                ? "bg-amber-400/20 border-amber-400/40 text-amber-200"
                : "border-white/10 text-slate-400 hover:text-slate-200"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {demoState === "loading" && <LoadingState label="Tracing your constellations..." />}
      {demoState === "error" && (
        <ErrorState
          message="Could not load your journey path."
          onRetry={() => setDemoState("default")}
        />
      )}
      {demoState === "empty" && (
        <EmptyState
          title="Your journey begins today"
          description="As you share reflections over time, your evolving constellations will appear here."
          actionLabel="Start a conversation"
          onAction={() => window.location.assign("/talk")}
          icon={<Compass className="h-5 w-5 text-emerald-300" />}
        />
      )}

      {demoState === "default" && (
        <div className="space-y-8">
          {/* Growth Reflection Card */}
          <GlassCard className="border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 to-transparent p-5">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-400/15 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-serif-display font-medium text-slate-100">
                  A change noticed over time
                </h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  You&apos;ve moved from describing the weight to taking small, quiet actions. That is real progress.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Luminous Constellation Path (Screen 11 Reference) */}
          <div className="relative py-4">
            <div className="space-y-8 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-amber-400/60 before:via-indigo-400/40 before:to-emerald-400/60">
              {milestones.map((m) => (
                <div key={m.id} className="relative flex items-start gap-6 pl-2 group">
                  {/* Node Icon */}
                  <div className="relative z-10 h-6 w-6 rounded-full bg-[#080c14] border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
                    {m.isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Circle className="h-3 w-3 text-amber-400 animate-ping" />
                    )}
                  </div>

                  {/* Card Content */}
                  <GlassCard hoverable className="flex-1 p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
                        {m.stage}
                      </span>
                      <span className="text-xs text-slate-400 font-light">
                        {m.date}
                      </span>
                    </div>
                    <blockquote className="text-sm md:text-base font-serif-display italic text-slate-100">
                      {m.quote}
                    </blockquote>
                  </GlassCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
