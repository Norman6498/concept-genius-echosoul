"use client";

import React, { useState, useEffect, useRef } from "react";
import { EchoSoulShell } from "@/components/shell/EchoSoulShell";
import { Shield, Sliders, Moon, Lock, Check, Download, Trash2, Palette, Bell, Key, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getScopedStorageItem,
  setScopedStorageItem,
  removeScopedStorageItem,
  performSecureLogout,
} from "@/lib/auth/sessionBoundary";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Privacy");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const userIdRef = useRef<string | null>(null);

  const [settings, setSettings] = useState({
    hidePersonalData: false,
    saveHistory: true,
    personalizedRecs: true,
    allowStoryCreation: true,
    reducedMotion: false,
    darkMode: true,
    language: "English",
    theme: "midnight_soul",
    notifications: true,
    checkInTime: "21:00",
  });

  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!isMounted) return;
        userIdRef.current = user?.id || null;

        const stored = getScopedStorageItem<typeof settings>(user?.id, "user_settings", settings);
        if (stored && isMounted) {
          setSettings((prev) => ({ ...prev, ...stored }));
        }
      } catch {}
    }
    loadSettings();
    return () => { isMounted = false; };
  }, []);

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setScopedStorageItem(userIdRef.current, "user_settings", next);
      return next;
    });
  };

  const handleSave = () => {
    setScopedStorageItem(userIdRef.current, "user_settings", settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    try {
      const archive = {
        personalization: getScopedStorageItem(userIdRef.current, "user_personalization", {}),
        conversations: getScopedStorageItem(userIdRef.current, "recent_conversations", []),
        journal: getScopedStorageItem(userIdRef.current, "journal_entries", []),
        moments: getScopedStorageItem(userIdRef.current, "moments", []),
        goals: getScopedStorageItem(userIdRef.current, "goals_v2", []),
        settings,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(archive, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `solenne-sanctuary-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Could not export data: " + err);
    }
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your local conversation and reflection history?")) {
      removeScopedStorageItem(userIdRef.current, "recent_conversations");
      removeScopedStorageItem(userIdRef.current, "journal_entries");
      removeScopedStorageItem(userIdRef.current, "talk_messages");
      removeScopedStorageItem(userIdRef.current, "active_session_id");
      alert("History cleared successfully.");
      window.location.reload();
    }
  };

  return (
    <EchoSoulShell activePath="/app/settings">
      <div className="space-y-5">
        {/* Title Header */}
        <div>
          <h1 className="text-3xl font-editorial text-[#FFF8E1]">Your experience. Your control.</h1>
          <p className="text-sm font-ui text-[#CFC5B5]">
            Customize how Solenne works for you.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["Privacy", "Personalization", "Appearance", "Notifications", "Data"].map((tab) => (
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

        {/* Two-Column Grid matching wireframe */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Controls List */}
          <div className="lg:col-span-8 rounded-3xl border border-white/10 bg-[#09141D] p-6 sm:p-8 space-y-4 shadow-xl">
            {activeTab === "Privacy" && (
              <div className="space-y-4">
                <h2 className="font-editorial text-lg text-[#FFF8E1] border-b border-white/10 pb-3">
                  Privacy &amp; Data Permissions
                </h2>

                <div className="space-y-3">
                  {[
                    {
                      key: "hidePersonalData" as const,
                      title: "Hide personal data from Home",
                      desc: "Includes history and recommendations.",
                    },
                    {
                      key: "saveHistory" as const,
                      title: "Save conversations to history",
                      desc: "Keep encrypted chat history across sessions.",
                    },
                    {
                      key: "personalizedRecs" as const,
                      title: "Use my data for personalized recommendations",
                      desc: "Tune book, music, and poetry cards to your onboarding mood.",
                    },
                    {
                      key: "allowStoryCreation" as const,
                      title: "Allow story creation from conversations",
                      desc: "Permit AI to weave milestones into your Life Novel.",
                    },
                    {
                      key: "reducedMotion" as const,
                      title: "Reduced motion (accessibility)",
                      desc: "Disable background particle and parallax movements.",
                    },
                    {
                      key: "darkMode" as const,
                      title: "Dark mode",
                      desc: "Deep atmospheric obsidian sanctuary palette.",
                    },
                  ].map((item) => {
                    const active = settings[item.key] as boolean;
                    return (
                      <div
                        key={item.key}
                        onClick={() => toggle(item.key)}
                        className="p-4 rounded-2xl bg-[#0C1B25]/80 hover:bg-[#0C1B25] border border-white/5 flex items-center justify-between cursor-pointer transition-all"
                      >
                        <div>
                          <h4 className="text-xs font-ui font-semibold text-[#FFF8E1]">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-[#9AA8B0] font-ui">{item.desc}</p>
                        </div>

                        {/* Toggle Switch */}
                        <div
                          className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${
                            active ? "bg-[#F2D78A]" : "bg-white/20"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-[#0B0F14] transition-transform ${
                              active ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* Language Selector */}
                  <div className="p-4 rounded-2xl bg-[#0C1B25]/80 border border-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-ui font-semibold text-[#FFF8E1]">Language</h4>
                      <p className="text-[11px] text-[#9AA8B0] font-ui">
                        Sanctuary interface language preference.
                      </p>
                    </div>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))}
                      className="bg-[#070D12] text-xs font-ui text-[#F2D78A] px-3 py-1.5 rounded-xl border border-white/10 focus:outline-none"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="Urdu">Urdu (اردو)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Personalization" && (
              <div className="space-y-4">
                <h2 className="font-editorial text-lg text-[#FFF8E1] border-b border-white/10 pb-3">
                  Recommendation Engine
                </h2>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#0C1B25]/80 border border-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-ui font-semibold text-[#FFF8E1]">
                        Adaptive Book &amp; Music Recommendations
                      </h4>
                      <p className="text-[11px] text-[#9AA8B0] font-ui">
                        Automatically update Home cards based on your latest voice chats and journal thoughts.
                      </p>
                    </div>
                    <div
                      onClick={() => toggle("personalizedRecs")}
                      className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${
                        settings.personalizedRecs ? "bg-[#F2D78A]" : "bg-white/20"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-[#0B0F14] transition-transform ${
                          settings.personalizedRecs ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0C1B25]/80 border border-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-ui font-semibold text-[#FFF8E1]">
                        Life Novel Synthesis
                      </h4>
                      <p className="text-[11px] text-[#9AA8B0] font-ui">
                        Allow AI to craft reflective chapters from your weekly breakthrough moments.
                      </p>
                    </div>
                    <div
                      onClick={() => toggle("allowStoryCreation")}
                      className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${
                        settings.allowStoryCreation ? "bg-[#F2D78A]" : "bg-white/20"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-[#0B0F14] transition-transform ${
                          settings.allowStoryCreation ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Appearance" && (
              <div className="space-y-4">
                <h2 className="font-editorial text-lg text-[#FFF8E1] border-b border-white/10 pb-3">
                  Sanctuary Theme &amp; Atmosphere
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: "midnight_soul", title: "Midnight Soul", desc: "Obsidian dark with warm gold lantern glow", color: "#F2D78A" },
                    { key: "sunrise_calm", title: "Sunrise Calm", desc: "Soft dawn mist with gentle amber warmth", color: "#FBBF24" },
                    { key: "forest_green", title: "Forest Sanctuary", desc: "Deep emerald woodland canopy", color: "#34D399" },
                    { key: "minimal_light", title: "Minimal Serenity", desc: "Warm parchment paper tones", color: "#E2D9C8" },
                  ].map((thm) => (
                    <div
                      key={thm.key}
                      onClick={() => {
                        setSettings((s) => ({ ...s, theme: thm.key }));
                        setScopedStorageItem(userIdRef.current, "user_appearance", { theme: thm.key });
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        settings.theme === thm.key
                          ? "bg-[#0C1B25] border-[#F2D78A] ring-1 ring-[#F2D78A]/30"
                          : "bg-[#0C1B25]/60 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-ui font-semibold text-[#FFF8E1]">{thm.title}</span>
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: thm.color }} />
                      </div>
                      <p className="text-[11px] font-ui text-[#9AA8B0]">{thm.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="space-y-4">
                <h2 className="font-editorial text-lg text-[#FFF8E1] border-b border-white/10 pb-3">
                  Gentle Check-in Reminders
                </h2>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#0C1B25]/80 border border-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-ui font-semibold text-[#FFF8E1]">
                        Daily Evening Check-in
                      </h4>
                      <p className="text-[11px] text-[#9AA8B0] font-ui">
                        A single soft notification to encourage reflection before sleep.
                      </p>
                    </div>
                    <div
                      onClick={() => toggle("notifications")}
                      className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${
                        settings.notifications ? "bg-[#F2D78A]" : "bg-white/20"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-[#0B0F14] transition-transform ${
                          settings.notifications ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0C1B25]/80 border border-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-ui font-semibold text-[#FFF8E1]">Preferred Time</h4>
                      <p className="text-[11px] text-[#9AA8B0] font-ui">
                        When you typically wind down.
                      </p>
                    </div>
                    <input
                      type="time"
                      value={settings.checkInTime}
                      onChange={(e) => setSettings((s) => ({ ...s, checkInTime: e.target.value }))}
                      className="bg-[#070D12] text-xs font-ui text-[#F2D78A] px-3 py-1.5 rounded-xl border border-white/10"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Data" && (
              <div className="space-y-4">
                <h2 className="font-editorial text-lg text-[#FFF8E1] border-b border-white/10 pb-3">
                  Data Portability &amp; Sanctuary Archive
                </h2>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#0C1B25]/80 border border-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-ui font-semibold text-[#FFF8E1]">
                        Export Sanctuary Backup (JSON)
                      </h4>
                      <p className="text-[11px] text-[#9AA8B0] font-ui">
                        Download all your conversations, reflections, moments, and goals.
                      </p>
                    </div>
                    <button
                      onClick={handleExportData}
                      className="px-4 py-2 rounded-xl bg-[#F2D78A] text-[#0B0F14] text-xs font-semibold hover:bg-[#E5C77A] flex items-center gap-1.5 transition-colors shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-ui font-semibold text-[#EF4444]">
                        Clear Local Cache &amp; History
                      </h4>
                      <p className="text-[11px] text-[#9AA8B0] font-ui">
                        Clears locally cached chat logs and journal entries on this browser.
                      </p>
                    </div>
                    <button
                      onClick={handleClearHistory}
                      className="px-4 py-2 rounded-xl bg-[#EF4444] text-white text-xs font-semibold hover:bg-[#DC2626] flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-ui font-semibold text-[#FFF8E1]">
                        Secure Sign Out
                      </h4>
                      <p className="text-[11px] text-[#9AA8B0] font-ui">
                        Terminates your cloud session and securely purges device caches.
                      </p>
                    </div>
                    <button
                      onClick={() => performSecureLogout()}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-[#FFF8E1] hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Privacy Philosophy */}
          <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-[#09141D] p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#F2D78A]/10 border border-[#F2D78A]/20 flex items-center justify-center text-[#F2D78A]">
                <Lock className="w-5 h-5" />
              </div>

              <div className="space-y-2">
                <h3 className="font-editorial text-lg text-[#FFF8E1]">Your privacy matters.</h3>
                <p className="text-xs font-ui text-[#CFC5B5] leading-relaxed">
                  You&apos;re always in control of what you share, what&apos;s saved, and what&apos;s
                  shown across your sanctuary.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-[11px] font-ui text-[#9AA8B0]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
                  <span>Row-Level Security on Supabase</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
                  <span>Zero advertising tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
                  <span>Full data deletion control</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {savedSuccess && (
                <p className="text-xs font-ui text-[#4ADE80] text-center">
                  Preferences saved successfully!
                </p>
              )}
              <button
                onClick={handleSave}
                className="w-full py-2.5 rounded-full bg-[#F2D78A] text-[#0B0F14] text-xs font-semibold hover:bg-[#E5C77A] transition-colors shadow-md cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </EchoSoulShell>
  );
}
