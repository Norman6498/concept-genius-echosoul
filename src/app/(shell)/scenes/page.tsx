"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/StateView";
import { MOCK_SCENE_PROMPTS } from "@/lib/mocks/data";
import { Film, Play, Sparkles, Wand2 } from "lucide-react";

export default function ScenesPage() {
  const [selectedStyle, setSelectedStyle] = useState<string>("Anime");
  const [prompt, setPrompt] = useState("A boy sitting alone, but a beautiful sunrise gives him hope...");
  const [demoState, setDemoState] = useState<"default" | "empty" | "loading" | "error">("default");

  const styles = ["Anime", "Cinematic", "Nature", "Minimal", "Fantasy"];

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="border-b border-white/[0.06] pb-4 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[11px] font-serif-display mb-1">
          <Sparkles className="h-3 w-3" />
          <span>Creative Cinema Sanctuary</span>
        </div>
        <h1 className="text-2xl font-serif-display font-medium text-slate-100">
          Turn Your Feelings into a Scene
        </h1>
        <p className="text-xs text-slate-400 font-light">
          Your emotions, gently translated into soothing visual moments.
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

      {demoState === "loading" && <LoadingState label="Preparing your scene storyboard..." />}
      {demoState === "error" && (
        <ErrorState
          message="Could not load scene canvas right now."
          onRetry={() => setDemoState("default")}
        />
      )}
      {demoState === "empty" && (
        <EmptyState
          title="No scenes visualized yet"
          description="Share how you're feeling in a conversation to generate your first scene concept."
          actionLabel="Go to Talk"
          onAction={() => window.location.assign("/talk")}
          icon={<Film className="h-5 w-5 text-indigo-300" />}
        />
      )}

      {demoState === "default" && (
        <div className="space-y-6">
          {/* Main Visual Preview Container (Screen 9 Reference) */}
          <GlassCard className="relative overflow-hidden p-0 border-white/[0.1] rounded-2xl bg-black aspect-video max-h-[360px] flex items-center justify-center group">
            {/* Ambient Background Gradient simulating sunrise / anime scene */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-indigo-950/40 to-amber-900/30 opacity-90" />

            {/* Play Button Overlay */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <button
                className="h-16 w-16 rounded-full bg-amber-400/90 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                onClick={() => alert("Scene generation and playback engine will activate in Stage 8 & 9.")}
              >
                <Play className="h-7 w-7 fill-current ml-1" />
              </button>
              <span className="text-xs text-amber-200/90 font-serif-display tracking-wide drop-shadow">
                Preview Concept · Sunrise over city
              </span>
            </div>

            {/* Bottom Status bar */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 z-10">
              <span className="bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-md">
                Style: {selectedStyle}
              </span>
              <span className="bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-md">
                Duration: 15s Ambient Loop
              </span>
            </div>
          </GlassCard>

          {/* Style Selector Chips */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-semibold tracking-wider text-slate-400">
              Visual Style
            </label>
            <div className="flex flex-wrap gap-2">
              {styles.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    selectedStyle === style
                      ? "bg-amber-400/20 text-amber-200 border border-amber-400/40 shadow-sm"
                      : "bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-white/[0.06]"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Description Input */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-semibold tracking-wider text-slate-400">
              Scene Essence
            </label>
            <GlassCard className="p-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={2}
                className="w-full bg-transparent text-sm text-slate-200 focus:outline-none resize-none font-light placeholder:text-slate-600"
                placeholder="Describe what visual would comfort you right now..."
              />
            </GlassCard>
          </div>

          {/* Action CTA */}
          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="md"
              className="gap-2"
              onClick={() => alert("Scene generation will connect to real async media adapters in Stage 8.")}
            >
              <Wand2 className="h-4 w-4" />
              <span>Create My Scene</span>
            </Button>
          </div>

          {/* Sample Community Gallery */}
          <div className="pt-6 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Visual Themes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MOCK_SCENE_PROMPTS.map((sc) => (
                <GlassCard key={sc.id} hoverable className="p-3 space-y-2">
                  <div className="h-24 rounded-lg bg-indigo-950/40 border border-white/[0.06] flex items-center justify-center text-slate-400">
                    <Film className="h-6 w-6 opacity-40" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-slate-200">{sc.title}</h4>
                    <p className="text-[10px] text-slate-400 font-light truncate">{sc.prompt}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
