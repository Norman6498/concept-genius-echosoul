"use client";

import React, { useState, useRef, useEffect } from "react";
import { EchoSoulShell } from "@/components/shell/EchoSoulShell";
import Image from "next/image";
import { Save, Lock, Tag, Calendar, Sparkles, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getScopedStorageItem, setScopedStorageItem } from "@/lib/auth/sessionBoundary";

export default function JournalPage() {
  const [activeTab, setActiveTab] = useState("All Entries");
  const [entryText, setEntryText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [pastEntries, setPastEntries] = useState<Array<{ date: string; title: string; preview: string }>>([]);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadJournal() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!isMounted) return;
        userIdRef.current = user?.id || null;

        const stored = getScopedStorageItem<Array<{ date: string; title: string; preview: string }>>(
          user?.id,
          "journal_entries",
          []
        );
        if (Array.isArray(stored)) {
          setPastEntries(stored);
        }
      } catch {}
    }
    loadJournal();
    return () => { isMounted = false; };
  }, []);

  const handleSave = () => {
    if (!entryText.trim()) return;
    const newEntry = {
      date: "Today, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      title: tags.length > 0 ? `${tags[0]} Reflection` : "Personal Reflection",
      preview: entryText.trim(),
    };
    const updated = [newEntry, ...pastEntries];
    setPastEntries(updated);
    setScopedStorageItem(userIdRef.current, "journal_entries", updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <EchoSoulShell activePath="/app/journal">
      <div className="space-y-5">
        {/* Title Header */}
        <div>
          <h1 className="text-3xl font-editorial text-[#FFF8E1]">A space for your thoughts.</h1>
          <p className="text-sm font-ui text-[#CFC5B5]">Write. Reflect. Grow.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["All Entries", "Gratitude", "Reflections", "Free Write"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-ui transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-md"
                  : "bg-[#0C1B25] text-[#CFC5B5] hover:text-[#FFF8E1] border border-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Writing Canvas */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-[#F2D78A]/20 bg-[#09141D] shadow-2xl relative min-h-[460px] flex flex-col justify-between p-6 sm:p-8">
            <Image
              src="/tabs/journal_bg.jpg"
              alt="Warm candlelit writing desk"
              fill
              className="object-cover opacity-20 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070D12] via-transparent to-black/30 pointer-events-none" />

            {/* Date and Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-xs font-ui text-[#F2D78A]">
                <Calendar className="w-4 h-4" />
                <span className="font-semibold" suppressHydrationWarning>
                  Today • {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-ui text-[#9AA8B0]">
                <Lock className="w-3 h-3 text-[#4ADE80]" />
                Encrypted &amp; Private
              </span>
            </div>

            {/* Journal Textarea */}
            <div className="relative z-10 my-4 flex-1">
              <textarea
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                placeholder="What is stirring in your thoughts today? Write freely..."
                className="w-full h-56 bg-transparent border-none text-[#FFF8E1] font-editorial text-base sm:text-lg leading-relaxed focus:outline-none resize-none placeholder-[#9AA8B0]/40"
              />
            </div>

            {/* Tag Pills + Action Buttons */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const tag = prompt("Enter a tag for this reflection:");
                    if (tag) setTags((prev) => [...prev, tag]);
                  }}
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-ui text-[#CFC5B5] border border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <Tag className="w-3 h-3 text-[#F2D78A]" />
                  <span>Add tags</span>
                </button>
                {tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full bg-[#F2D78A]/10 text-[#F2D78A] text-[10px] font-ui border border-[#F2D78A]/20"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded-full bg-[#F2D78A] text-[#0B0F14] text-xs font-semibold hover:bg-[#E5C77A] transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savedSuccess ? "Saved to Sanctuary!" : "Save Entry"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Past Entries */}
          <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-[#09141D] p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="font-editorial text-base font-semibold text-[#FFF8E1]">
                  Past Entries
                </h3>
                <span className="text-[11px] font-ui text-[#F2D78A]">{pastEntries.length} Saved</span>
              </div>

              <div className="space-y-2.5">
                {pastEntries.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-[#0C1B25]/40 border border-white/5 text-center flex flex-col items-center justify-center space-y-2">
                    <BookOpen className="w-8 h-8 text-[#F2D78A]/40 mb-1" />
                    <p className="font-editorial text-sm text-[#FFF8E1]">No journal reflections yet</p>
                    <p className="text-[11px] font-ui text-[#9AA8B0] leading-relaxed">
                      Inscribe your thoughts, feelings, or gratitude on the canvas to start your private record.
                    </p>
                  </div>
                ) : (
                  pastEntries.map((entry, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setEntryText(entry.preview);
                      }}
                      className="p-3.5 rounded-2xl bg-[#0C1B25]/80 hover:bg-[#0C1B25] border border-white/5 hover:border-[#F2D78A]/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-editorial text-sm font-semibold text-[#FFF8E1] group-hover:text-[#F2D78A] transition-colors">
                          {entry.title}
                        </h4>
                        <span className="text-[10px] font-ui text-[#9AA8B0]">
                          {entry.date}
                        </span>
                      </div>
                      <p className="text-xs font-ui text-[#CFC5B5] line-clamp-2 mt-1">
                        {entry.preview}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#0C1B25]/50 border border-white/5 text-center">
              <span className="text-[10px] text-[#9AA8B0] font-ui">
                All entries remain completely private to your device &amp; account.
              </span>
            </div>
          </div>
        </div>
      </div>
    </EchoSoulShell>
  );
}
