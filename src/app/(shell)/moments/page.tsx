"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmotionChip } from "@/components/ui/EmotionChip";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/StateView";
import { MOCK_MOMENTS, type MockMoment } from "@/lib/mocks/data";
import { Calendar, BookOpen, Clock, Tag } from "lucide-react";

export default function MomentsPage() {
  const [viewMode, setViewMode] = useState<"timeline" | "chapters">("timeline");
  const [moments] = useState<MockMoment[]>(MOCK_MOMENTS);
  const [demoState, setDemoState] = useState<"default" | "empty" | "loading" | "error">("default");

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <h1 className="text-2xl font-serif-display font-medium text-slate-100">
            Your Story & Moments
          </h1>
          <p className="text-xs text-slate-400 font-light mt-1">
            Meaningful events and reflections curated into your evolving novel.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white/[0.06] p-1 rounded-xl border border-white/[0.08] self-start">
          <button
            onClick={() => setViewMode("timeline")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              viewMode === "timeline"
                ? "bg-amber-400/20 text-amber-200 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setViewMode("chapters")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              viewMode === "chapters"
                ? "bg-amber-400/20 text-amber-200 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Chapters
          </button>
        </div>
      </div>

      {/* State Preview Switcher for Stage 1 Testing */}
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

      {/* Conditional States */}
      {demoState === "loading" && <LoadingState label="Gathering your moments..." />}
      {demoState === "error" && (
        <ErrorState
          message="Could not retrieve moments right now. Your journal is preserved securely."
          onRetry={() => setDemoState("default")}
        />
      )}
      {demoState === "empty" && (
        <EmptyState
          title="No moments recorded yet"
          description="Your first conversation will generate your opening moment and chapter."
          actionLabel="Begin a listening session"
          onAction={() => window.location.assign("/talk")}
          icon={<Calendar className="h-5 w-5 text-amber-300" />}
        />
      )}

      {/* Default View */}
      {demoState === "default" && (
        <>
          {viewMode === "timeline" ? (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-[1px] before:bg-white/[0.1]">
              {moments.map((m) => (
                <div key={m.id} className="relative group">
                  {/* Timeline node */}
                  <div className="absolute -left-[27px] top-4 h-3 w-3 rounded-full bg-[#080c14] border-2 border-amber-400/60 group-hover:border-amber-300 group-hover:scale-125 transition-all" />

                  <GlassCard hoverable className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-amber-400/90 tracking-wide">
                          Ch. {m.chapterNumber}
                        </span>
                        <span className="text-slate-600">·</span>
                        <h3 className="text-sm font-serif-display font-medium text-slate-100">
                          {m.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <EmotionChip label={m.emotion} variant="tender" />
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {m.date}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      {m.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {m.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.06]"
                        >
                          <Tag className="h-2.5 w-2.5 opacity-60" />
                          {t}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassCard hoverable className="space-y-3 border-amber-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-300">Chapter 12</span>
                  <span className="text-[10px] text-slate-400">Current Chapter</span>
                </div>
                <h3 className="text-base font-serif-display text-slate-100">Trying Again</h3>
                <p className="text-xs text-slate-300 font-light">
                  Contains 3 recorded moments exploring self-worth, poetry, and sunrise visuals.
                </p>
                <div className="text-[10px] text-amber-400/80 pt-2 flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span>3 moments linked</span>
                </div>
              </GlassCard>

              <GlassCard hoverable className="space-y-3 opacity-80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">Chapter 11</span>
                  <span className="text-[10px] text-slate-500">August 2026</span>
                </div>
                <h3 className="text-base font-serif-display text-slate-200">The Weight I Carried</h3>
                <p className="text-xs text-slate-400 font-light">
                  Exploring transitions, honest choices, and setting boundaries without guilt.
                </p>
                <div className="text-[10px] text-slate-400 pt-2 flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span>4 moments archived</span>
                </div>
              </GlassCard>
            </div>
          )}
        </>
      )}
    </div>
  );
}
