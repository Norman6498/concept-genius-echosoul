"use client";

import React, { useState } from "react";
import { PaperCard } from "@/components/ui/PaperCard";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/StateView";
import { MOCK_LITERATURE, MOCK_BOOK_PAGE, type MockLiteratureWork } from "@/lib/mocks/data";
import { BookOpen, Bookmark, Play, ShieldCheck, Sparkles, RefreshCw } from "lucide-react";

export default function WordsPage() {
  const [selectedCategory, setSelectedCategory] = useState<"Shayari" | "Poetry" | "Quotes" | "Books">("Shayari");
  const [isSaved, setIsSaved] = useState(false);
  const [literature] = useState<MockLiteratureWork>(MOCK_LITERATURE);
  const [demoState, setDemoState] = useState<"default" | "empty" | "loading" | "error">("default");

  const categories: Array<"Shayari" | "Poetry" | "Quotes" | "Books"> = ["Shayari", "Poetry", "Quotes", "Books"];

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="border-b border-white/[0.06] pb-4 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-serif-display mb-1">
          <Sparkles className="h-3 w-3" />
          <span>Real words from real writers</span>
        </div>
        <h1 className="text-2xl font-serif-display font-medium text-slate-100">
          For This Moment
        </h1>
        <p className="text-xs text-slate-400 font-light">
          EchoSoul never generates fake literature. Every piece is authentic and attributed.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-amber-400/20 text-amber-200 border border-amber-400/40 shadow-sm"
                : "bg-white/[0.05] text-slate-400 hover:text-slate-200 border border-white/[0.06]"
            }`}
          >
            {cat}
          </button>
        ))}
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

      {demoState === "loading" && <LoadingState label="Searching authentic literature..." />}
      {demoState === "error" && (
        <ErrorState
          message="Could not retrieve literature match right now."
          onRetry={() => setDemoState("default")}
        />
      )}
      {demoState === "empty" && (
        <EmptyState
          title="No literature matches yet"
          description="Have a conversation first so EchoSoul can understand your feeling and find matching literature."
          actionLabel="Go to Talk"
          onAction={() => window.location.assign("/talk")}
          icon={<BookOpen className="h-5 w-5 text-amber-300" />}
        />
      )}

      {demoState === "default" && (
        <>
          {selectedCategory === "Books" ? (
            /* Book Page View (Screen 8 Reference) */
            <PaperCard className="space-y-6">
              <div className="text-center space-y-1 pb-4 border-b border-stone-300">
                <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500">
                  Tonight&apos;s Book Page
                </span>
                <h3 className="text-lg font-serif-display font-semibold text-stone-900">
                  {MOCK_BOOK_PAGE.bookTitle}
                </h3>
                <p className="text-xs font-serif-display text-stone-600">
                  {MOCK_BOOK_PAGE.author} · Page {MOCK_BOOK_PAGE.pageNumber}
                </p>
              </div>

              <blockquote className="text-base md:text-lg font-serif-display italic text-stone-900 leading-relaxed text-center px-4 py-6">
                &ldquo;{MOCK_BOOK_PAGE.quote}&rdquo;
              </blockquote>

              <div className="pt-4 border-t border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-600 text-xs">
                <p className="italic">{MOCK_BOOK_PAGE.whyThisFits}</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-stone-400 text-stone-800 hover:bg-stone-200"
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Bookmark className={`h-3.5 w-3.5 mr-1 ${isSaved ? "fill-stone-800" : ""}`} />
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                </div>
              </div>
            </PaperCard>
          ) : (
            /* Literary Parchment Card (Screen 6 Reference) */
            <div className="space-y-4">
              <PaperCard className="space-y-6">
                <div className="flex items-center justify-between text-stone-600 text-xs">
                  <span className="font-serif-display font-medium tracking-wide">
                    {literature.passageType} · {literature.workTitle}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-stone-200/80 font-mono">
                    <ShieldCheck className="h-3 w-3 text-emerald-700" />
                    Verified Work
                  </span>
                </div>

                {/* Authentic Hindi Script Calligraphy */}
                <div className="py-4 text-center">
                  <p className="font-serif-display text-xl md:text-2xl text-stone-900 leading-loose whitespace-pre-line tracking-wide font-normal">
                    {literature.originalText}
                  </p>
                  <p className="text-right text-xs font-serif-display text-stone-600 mt-4 pr-4">
                    — {literature.author}
                  </p>
                </div>

                {/* Literary Actions */}
                <div className="pt-4 border-t border-stone-300 flex items-center justify-between gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-amber-700 hover:bg-amber-800 text-stone-100 shadow-none text-xs"
                    onClick={() => alert("Handwriting playback will be available in Stage 7.")}
                  >
                    <Play className="h-3 w-3 mr-1 fill-current" />
                    Play Writing
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-stone-400 text-stone-800 hover:bg-stone-200"
                      onClick={() => setIsSaved(!isSaved)}
                    >
                      <Bookmark className={`h-3.5 w-3.5 mr-1 ${isSaved ? "fill-stone-800" : ""}`} />
                      {isSaved ? "Saved" : "Save"}
                    </Button>
                  </div>
                </div>
              </PaperCard>

              {/* Author & Context Explanation Card */}
              <GlassCard className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-serif-display text-slate-100 font-medium">
                      {literature.author}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      From: {literature.workTitle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-light mt-1 max-w-lg">
                    {literature.whyThisFits}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-amber-300/80 hover:text-amber-200 shrink-0"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Another piece
                </Button>
              </GlassCard>
            </div>
          )}
        </>
      )}
    </div>
  );
}
