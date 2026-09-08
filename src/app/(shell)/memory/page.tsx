"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/StateView";
import { MOCK_MEMORIES, type MockMemoryItem } from "@/lib/mocks/data";
import { Archive, Trash2, Edit3, ShieldAlert, Sparkles, Clock, HelpCircle } from "lucide-react";

export default function MemoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [memories, setMemories] = useState<MockMemoryItem[]>(MOCK_MEMORIES);
  const [demoState, setDemoState] = useState<"default" | "empty" | "loading" | "error">("default");

  const categories = ["All", "People", "Patterns", "Preferences", "Goals", "Growth"];

  const filteredMemories =
    selectedCategory === "All"
      ? memories
      : memories.filter((m) => m.category === selectedCategory);

  const handleDelete = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all memories? This cannot be undone.")) {
      setMemories([]);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="border-b border-white/[0.06] pb-4 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-serif-display mb-1">
          <Sparkles className="h-3 w-3" />
          <span>Transparent & User-Controlled Memory</span>
        </div>
        <h1 className="text-2xl font-serif-display font-medium text-slate-100">
          Memory Archive
        </h1>
        <p className="text-xs text-slate-400 font-light">
          EchoSoul only remembers what helps your journey. You can view, edit, or erase any memory at any time.
        </p>
      </div>

      {/* Global Memory Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-light">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
          <span>Need complete privacy right now?</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => alert("Private mode activated for this session.")}
          >
            Don&apos;t remember this chat
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="text-xs"
            onClick={handleClearAll}
          >
            Clear all
          </Button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-amber-400/20 text-amber-200 border border-amber-400/40 shadow-sm"
                : "bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-white/[0.06]"
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

      {demoState === "loading" && <LoadingState label="Indexing memory archive..." />}
      {demoState === "error" && (
        <ErrorState
          message="Could not access memory archive right now."
          onRetry={() => setDemoState("default")}
        />
      )}
      {demoState === "empty" || filteredMemories.length === 0 ? (
        <EmptyState
          title="No memories in this category"
          description="Memories are extracted during conversations only when you confirm them or when relevant to your growth."
          actionLabel="Have a conversation"
          onAction={() => window.location.assign("/talk")}
          icon={<Archive className="h-5 w-5 text-amber-300" />}
        />
      ) : null}

      {demoState === "default" && filteredMemories.length > 0 && (
        <div className="space-y-3">
          {filteredMemories.map((mem) => (
            <GlassCard key={mem.id} hoverable className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                    {mem.category}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">
                    {mem.factOrReflection}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => alert("Memory editing will connect to DB in Stage 4.")}
                    className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded-md transition-colors"
                    title="Edit memory"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(mem.id)}
                    className="p-1.5 text-slate-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
                    title="Delete memory"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-200 font-light leading-relaxed">
                {mem.content}
              </p>

              <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <HelpCircle className="h-3 w-3 text-slate-500" />
                  Why saved: {mem.whySaved}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="h-3 w-3 text-slate-500" />
                  {mem.learnedAt}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
