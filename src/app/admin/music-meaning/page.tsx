"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";

interface MeaningMetrics {
  totalSongs: number;
  totalMeanings: number;
  pending: number;
  generated: number;
  approved: number;
  rejected: number;
  failed: number;
  stale: number;
  needsReview: number;
}

interface AdminTrackItem {
  track_id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  language: string;
  duration: number;
  rights_status: string;
  status: string;
  meaning_summary: string | null;
  emotional_themes: string[];
  emotional_core: string | null;
  narrative_interpretation: string | null;
  key_themes: string[];
  cultural_context: string | null;
  why_it_may_resonate: string | null;
  listener_reflection: string | null;
  confidence: number | null;
  source_type: string;
  source_reference: string | null;
  model: string;
  model_version: string;
  prompt_version: string;
  updated_at: string | null;
  reviewed_at: string | null;
}

interface TrialMetrics {
  totalUsers: number;
  trialsUsed: number;
  trialsRemaining: number;
  usersOnWaitlist: number;
}

interface UserTrialItem {
  user_id: string;
  masked_id: string;
  display_name: string;
  plan: string;
  uses_total: number;
  uses_used: number;
  uses_remaining: number;
  waitlist: boolean;
  waitlist_at: string | null;
  last_used_at: string | null;
  created_at: string;
}

export default function AdminMusicMeaningPage() {
  const [metrics, setMetrics] = useState<MeaningMetrics | null>(null);
  const [trialMetrics, setTrialMetrics] = useState<TrialMetrics | null>(null);
  const [items, setItems] = useState<AdminTrackItem[]>([]);
  const [userTrials, setUserTrials] = useState<UserTrialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tabs
  const [consoleTab, setConsoleTab] = useState<"catalog" | "trials">("catalog");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [langFilter, setLangFilter] = useState("ALL");
  const [userSearch, setUserSearch] = useState("");

  // Selected Track for Inspection / Testing
  const [inspectedTrack, setInspectedTrack] = useState<AdminTrackItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [pipelineLogs, setPipelineLogs] = useState<Array<{ stage: string; status: string; details: string; timestamp: string }>>([]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (langFilter !== "ALL") params.set("language", langFilter);

      const res = await fetch(`/api/admin/music-meaning?${params.toString()}`);
      if (!res.ok) {
        if (res.status === 403) {
          setError("Access Denied: You do not have the server-verified Admin role.");
          return;
        }
        throw new Error("Failed to load admin music meaning data");
      }

      const data = await res.json();
      setMetrics(data.metrics);
      setTrialMetrics(data.trialMetrics);
      setItems(data.items);
      setUserTrials(data.userTrials || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, langFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAdminData();
  };

  const handleAdminAction = async (action: "approve" | "reject" | "mark_review" | "regenerate" | "retry") => {
    if (!inspectedTrack) return;
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/music-meaning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          track_id: inspectedTrack.track_id,
          language: inspectedTrack.language,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Action failed");
        return;
      }

      if (data.logs) {
        setPipelineLogs(data.logs);
      }

      await fetchAdminData();

      // Update current inspection view
      if (data.meaning) {
        setInspectedTrack({
          ...inspectedTrack,
          ...data.meaning,
        });
      } else if (action === "approve") {
        setInspectedTrack({ ...inspectedTrack, status: "APPROVED" });
      } else if (action === "reject") {
        setInspectedTrack({ ...inspectedTrack, status: "REJECTED" });
      } else if (action === "mark_review") {
        setInspectedTrack({ ...inspectedTrack, status: "NEEDS_REVIEW" });
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "GENERATED":
        return "bg-[#F2D78A]/20 text-[#F2D78A] border-[#F2D78A]/40";
      case "NEEDS_REVIEW":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "REJECTED":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      case "FAILED":
        return "bg-red-500/20 text-red-300 border-red-500/40";
      default:
        return "bg-white/10 text-[#CFC5B5] border-white/15";
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#050B10] text-[#FFF8E1] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-6 max-w-md rounded-3xl bg-[#0B0F14] border border-rose-500/40 shadow-2xl">
          <div className="text-4xl mb-4">🛡️</div>
          <h2 className="font-display text-2xl text-rose-400 mb-2">Admin Authorization Required</h2>
          <p className="font-ui text-xs text-[#CFC5B5] mb-6 leading-relaxed">
            {error}
            <br />
            Sign in with the verified primary administrator account (<strong>singhpinky2989@gmail.com</strong>) to access this console.
          </p>
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-full bg-[#F2D78A] text-[#0B0F14] font-ui text-xs font-semibold inline-block"
          >
            Sign In →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B10] text-[#FFF8E1] flex flex-col selection:bg-[#F2D78A]/30">
      {/* ── Top Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0B0F14]/95 backdrop-blur-md border-b border-[#F2D78A]/20 px-6 sm:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BrandLogo size="md" href="/" />
          <div className="h-6 w-px bg-white/20 hidden sm:block" />
          <span className="font-ui text-xs uppercase tracking-widest text-[#F2D78A] font-semibold">
            Music Meaning AI Admin Console
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-[#9AA8B0] hidden md:inline">
            Admin: <strong className="text-[#FFF8E1]">singhpinky2989@gmail.com</strong>
          </span>
          <Link
            href="/app/music"
            className="text-xs font-ui text-[#CFC5B5] hover:text-[#FFF8E1] px-4 py-2 rounded-full border border-white/10 hover:border-white/20 transition-all"
          >
            Open Music Page ↗
          </Link>
        </div>
      </header>

      {/* ── Main Body ────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-[1536px] w-full mx-auto px-6 sm:px-10 py-8 space-y-8">
        {/* Sub-navigation Tab Bar */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <button
            type="button"
            onClick={() => setConsoleTab("catalog")}
            className={`px-5 py-2.5 rounded-full text-xs font-ui font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              consoleTab === "catalog"
                ? "bg-[#F2D78A] text-[#0B0F14] shadow-md shadow-[#F2D78A]/20"
                : "bg-[#09141D] text-[#9AA8B0] hover:text-[#FFF8E1] border border-white/10"
            }`}
          >
            <span>🎵</span>
            <span>Song Catalog &amp; AI Pipeline</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${consoleTab === "catalog" ? "bg-[#0B0F14]/20" : "bg-white/10"}`}>
              {items.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setConsoleTab("trials")}
            className={`px-5 py-2.5 rounded-full text-xs font-ui font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              consoleTab === "trials"
                ? "bg-[#F2D78A] text-[#0B0F14] shadow-md shadow-[#F2D78A]/20"
                : "bg-[#09141D] text-[#9AA8B0] hover:text-[#FFF8E1] border border-white/10"
            }`}
          >
            <span>👑</span>
            <span>Freemium Trials &amp; Waitlist</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${consoleTab === "trials" ? "bg-[#0B0F14]/20" : "bg-white/10"}`}>
              {trialMetrics?.totalUsers ?? userTrials.length}
            </span>
          </button>
        </div>

        {consoleTab === "catalog" ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Metric Cards Banner */}
            {metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-[#09141D] border border-white/10">
                  <span className="text-[11px] font-ui text-[#9AA8B0] block">TOTAL SONGS</span>
                  <span className="font-display text-2xl text-[#FFF8E1]">{metrics.totalSongs}</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#09141D] border border-[#F2D78A]/25">
                  <span className="text-[11px] font-ui text-[#F2D78A] block">TOTAL MEANINGS</span>
                  <span className="font-display text-2xl text-[#F2D78A]">{metrics.totalMeanings}</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#09141D] border border-white/10">
                  <span className="text-[11px] font-ui text-[#9AA8B0] block">PENDING</span>
                  <span className="font-display text-2xl text-[#CFC5B5]">{metrics.pending}</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#09141D] border border-amber-500/30">
                  <span className="text-[11px] font-ui text-amber-300 block">GENERATED</span>
                  <span className="font-display text-2xl text-amber-300">{metrics.generated}</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#09141D] border border-emerald-500/30">
                  <span className="text-[11px] font-ui text-emerald-300 block">APPROVED</span>
                  <span className="font-display text-2xl text-emerald-300">{metrics.approved}</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#09141D] border border-purple-500/30">
                  <span className="text-[11px] font-ui text-purple-300 block">NEEDS REVIEW</span>
                  <span className="font-display text-2xl text-purple-300">{metrics.needsReview}</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#09141D] border border-rose-500/30">
                  <span className="text-[11px] font-ui text-rose-300 block">REJECTED</span>
                  <span className="font-display text-2xl text-rose-300">{metrics.rejected}</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#09141D] border border-red-500/30">
                  <span className="text-[11px] font-ui text-red-300 block">FAILED</span>
                  <span className="font-display text-2xl text-red-300">{metrics.failed}</span>
                </div>
              </div>
            )}

            {/* Search & Filter Bar */}
            <div className="p-5 rounded-3xl bg-[#0B0F14] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-3 w-full">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search song title, artist, or album..."
                  className="flex-1 px-4 py-2.5 rounded-full bg-[#08131B] border border-white/15 text-xs font-ui text-[#FFF8E1] focus:outline-none focus:border-[#F2D78A]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#F2D78A] text-[#0B0F14] font-ui text-xs font-semibold hover:bg-[#FFB86B] transition-all shrink-0"
                >
                  Search
                </button>
              </form>

              <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-[#08131B] border border-white/15 text-xs font-ui text-[#FFF8E1] focus:outline-none focus:border-[#F2D78A]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="APPROVED">Approved</option>
                  <option value="GENERATED">Generated</option>
                  <option value="NEEDS_REVIEW">Needs Review</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="FAILED">Failed</option>
                </select>

                {/* Language Filter */}
                <select
                  value={langFilter}
                  onChange={(e) => setLangFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-[#08131B] border border-white/15 text-xs font-ui text-[#FFF8E1] focus:outline-none focus:border-[#F2D78A]"
                >
                  <option value="ALL">All Languages</option>
                  <option value="hi">Hindi (hi)</option>
                  <option value="pa">Punjabi (pa)</option>
                  <option value="en">English (en)</option>
                  <option value="bn">Bengali (bn)</option>
                  <option value="ta">Tamil (ta)</option>
                </select>

                <button
                  type="button"
                  onClick={fetchAdminData}
                  className="p-2 rounded-xl bg-[#08131B] border border-white/15 text-[#CFC5B5] hover:text-[#FFF8E1] text-xs font-ui"
                  title="Refresh table"
                >
                  ↻
                </button>
              </div>
            </div>

            {/* Songs Table */}
            <div className="rounded-3xl bg-[#0B0F14] border border-white/10 overflow-hidden shadow-2xl">
              {loading ? (
                <div className="p-16 text-center font-ui text-xs text-[#9AA8B0]">
                  Loading music meaning catalog...
                </div>
              ) : items.length === 0 ? (
                <div className="p-16 text-center font-ui text-xs text-[#9AA8B0]">
                  No tracks matched your criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-ui">
                    <thead className="bg-[#08131B] border-b border-white/10 text-[#9AA8B0] uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-4 px-6">Song &amp; Artist</th>
                        <th className="py-4 px-4">Language / Genre</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4">Source Type</th>
                        <th className="py-4 px-4">Confidence</th>
                        <th className="py-4 px-4">Model &amp; Prompt</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {items.map((track) => (
                        <tr
                          key={track.track_id}
                          className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                          onClick={() => {
                            setInspectedTrack(track);
                            setPipelineLogs([]);
                          }}
                        >
                          <td className="py-4 px-6">
                            <div className="font-medium text-[#FFF8E1] text-sm">
                              {track.title}
                            </div>
                            <div className="text-[11px] text-[#9AA8B0]">
                              {track.artist} {track.album ? `• ${track.album}` : ""} ({formatTime(track.duration)})
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-mono text-[#F2D78A] block uppercase">
                              {track.language}
                            </span>
                            <span className="text-[#9AA8B0] text-[11px]">
                              {track.genre}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                                track.status
                              )}`}
                            >
                              {track.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono text-[11px] text-[#CFC5B5]">
                            {track.source_type}
                          </td>
                          <td className="py-4 px-4 font-mono text-[11px]">
                            {track.confidence ? (
                              <span className="text-emerald-400">{(track.confidence * 100).toFixed(0)}%</span>
                            ) : (
                              <span className="text-[#9AA8B0]">--</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-[10px] font-mono text-[#9AA8B0]">
                            <div>{track.model.split("/").pop()}</div>
                            <div className="text-[9px] text-[#CFC5B5]">{track.prompt_version}</div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setInspectedTrack(track);
                                setPipelineLogs([]);
                              }}
                              className="px-3 py-1.5 rounded-full bg-[#0C1B25] border border-[#F2D78A]/40 text-[#F2D78A] hover:bg-[#F2D78A] hover:text-[#0B0F14] transition-all text-[11px] font-semibold"
                            >
                              Inspect / Test →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── Freemium Trials & Waitlist Analytics ── */
          <div className="space-y-8 animate-fadeIn">
            {/* 4 Trial Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#09141D] border border-white/10">
                <span className="text-[11px] font-ui uppercase tracking-wider text-[#9AA8B0] block">TOTAL USERS</span>
                <span className="font-display text-3xl text-[#FFF8E1]">{trialMetrics?.totalUsers ?? userTrials.length}</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#09141D] border border-amber-500/30">
                <span className="text-[11px] font-ui uppercase tracking-wider text-amber-300 block">TRIALS USED</span>
                <span className="font-display text-3xl text-amber-300">{trialMetrics?.trialsUsed ?? 0}</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#09141D] border border-emerald-500/30">
                <span className="text-[11px] font-ui uppercase tracking-wider text-emerald-300 block">TRIALS REMAINING</span>
                <span className="font-display text-3xl text-emerald-300">{trialMetrics?.trialsRemaining ?? 0}</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#09141D] border border-[#F2D78A]/40 shadow-lg shadow-[#F2D78A]/5">
                <span className="text-[11px] font-ui uppercase tracking-wider text-[#F2D78A] block">USERS ON WAITLIST</span>
                <span className="font-display text-3xl text-[#F2D78A]">{trialMetrics?.usersOnWaitlist ?? 0}</span>
              </div>
            </div>

            {/* User Search Bar */}
            <div className="p-5 rounded-3xl bg-[#0B0F14] border border-white/10 flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-3">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Filter users by masked ID or name..."
                  className="w-full max-w-md px-4 py-2.5 rounded-full bg-[#08131B] border border-white/15 text-xs font-ui text-[#FFF8E1] focus:outline-none focus:border-[#F2D78A]"
                />
              </div>
              <div className="text-xs font-mono text-[#9AA8B0]">
                Showing {userTrials.filter(u => !userSearch || u.masked_id.includes(userSearch) || u.display_name.toLowerCase().includes(userSearch.toLowerCase())).length} user accounts
              </div>
            </div>

            {/* User Trials Table */}
            <div className="rounded-3xl bg-[#0B0F14] border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#08131B] text-[11px] font-ui uppercase tracking-wider text-[#9AA8B0]">
                      <th className="py-4 px-6">User</th>
                      <th className="py-4 px-4">Plan</th>
                      <th className="py-4 px-4">Uses Used</th>
                      <th className="py-4 px-4">Uses Remaining</th>
                      <th className="py-4 px-4">Waitlist Status</th>
                      <th className="py-4 px-4">Last Used</th>
                      <th className="py-4 px-6 text-right">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs font-ui">
                    {userTrials
                      .filter(u => !userSearch || u.masked_id.includes(userSearch) || u.display_name.toLowerCase().includes(userSearch.toLowerCase()))
                      .map((user) => (
                        <tr key={user.user_id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-semibold text-[#FFF8E1]">{user.display_name}</div>
                            <div className="font-mono text-[10px] text-[#9AA8B0]">{user.masked_id}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                              user.plan === "premium" || user.plan === "team"
                                ? "bg-[#F2D78A]/20 text-[#F2D78A] border border-[#F2D78A]/40"
                                : "bg-white/5 text-[#CFC5B5] border border-white/10"
                            }`}>
                              {user.plan}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono">
                            <span className={`font-semibold ${user.uses_used >= user.uses_total ? "text-rose-400" : "text-[#FFF8E1]"}`}>
                              {user.uses_used} / {user.uses_total}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono">
                            <span className={user.uses_remaining === 0 ? "text-rose-400 font-bold" : "text-emerald-400"}>
                              {user.uses_remaining}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {user.waitlist ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F2D78A]/15 border border-[#F2D78A]/30 text-[#F2D78A] text-[10px] font-medium">
                                <span>✓</span> On Waitlist
                              </span>
                            ) : (
                              <span className="text-[#9AA8B0] text-[11px]">Not Joined</span>
                            )}
                          </td>
                          <td className="py-4 px-4 font-mono text-[11px] text-[#9AA8B0]">
                            {user.last_used_at ? new Date(user.last_used_at).toLocaleDateString() : "--"}
                          </td>
                          <td className="py-4 px-6 text-right font-mono text-[11px] text-[#9AA8B0]">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Inspector Drawer / Modal ────────────────────────────────────── */}
      {inspectedTrack && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setInspectedTrack(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0B0F14] border border-[#F2D78A]/40 shadow-2xl p-6 sm:p-10 space-y-6 text-left scrollbar-thin scrollbar-thumb-[#F2D78A]/20"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setInspectedTrack(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#0C1B25] text-[#9AA8B0] hover:text-[#FFF8E1]"
            >
              ✕
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(inspectedTrack.status)}`}>
                  {inspectedTrack.status}
                </span>
                <span className="font-mono text-xs text-[#F2D78A]">
                  ID: {inspectedTrack.track_id}
                </span>
                <span className="font-mono text-xs text-[#9AA8B0]">
                  Source: {inspectedTrack.source_type}
                </span>
              </div>
              <h2 className="font-display text-3xl text-[#FFF8E1]">
                {inspectedTrack.title}
              </h2>
              <p className="font-ui text-sm text-[#CFC5B5]">
                {inspectedTrack.artist} • {inspectedTrack.genre} ({inspectedTrack.language.toUpperCase()})
              </p>
            </div>

            {/* Admin Actions Bar */}
            <div className="p-4 rounded-2xl bg-[#08131B] border border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleAdminAction("approve")}
                  className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-ui text-xs font-semibold disabled:opacity-50 transition-all"
                >
                  ✓ Approve
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleAdminAction("mark_review")}
                  className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-ui text-xs font-semibold disabled:opacity-50 transition-all"
                >
                  Mark Review
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleAdminAction("reject")}
                  className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-ui text-xs font-semibold disabled:opacity-50 transition-all"
                >
                  Reject
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleAdminAction("regenerate")}
                  className="px-4 py-2 rounded-full bg-[#F2D78A] hover:bg-[#FFB86B] text-[#0B0F14] font-ui text-xs font-semibold disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {actionLoading ? "Processing Pipeline..." : "⚡ Run / Regenerate Agent"}
                </button>
              </div>
            </div>

            {/* Pipeline Stage Logs if regenerated */}
            {pipelineLogs.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#08131B] border border-cyan-500/30 space-y-2">
                <h4 className="font-ui text-xs uppercase tracking-widest text-cyan-400 font-semibold">
                  Live Pipeline Execution Logs:
                </h4>
                <div className="space-y-1 text-xs font-mono">
                  {pipelineLogs.map((log, i) => (
                    <div key={i} className="flex items-start gap-2 text-[#CFC5B5]">
                      <span className={log.status === "error" ? "text-rose-400" : "text-emerald-400"}>
                        [{log.status.toUpperCase()}]
                      </span>
                      <strong className="text-[#FFF8E1]">{log.stage}:</strong>
                      <span>{log.details}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meaning Content Breakdown */}
            {inspectedTrack.meaning_summary ? (
              <div className="space-y-6 pt-2">
                {/* Summary */}
                <div>
                  <h4 className="font-ui text-xs uppercase tracking-wider text-[#F2D78A] font-semibold mb-1">
                    Heart of the Song (Summary)
                  </h4>
                  <p className="font-display text-lg text-[#FFF8E1] italic">
                    &ldquo;{inspectedTrack.meaning_summary}&rdquo;
                  </p>
                </div>

                {/* Emotional Themes Pills */}
                <div>
                  <h4 className="font-ui text-xs uppercase tracking-wider text-[#9AA8B0] font-semibold mb-2">
                    Emotional Themes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {inspectedTrack.emotional_themes.map((theme, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-[#08131B] border border-[#F2D78A]/30 text-[#F2D78A] text-xs">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Emotional Core */}
                {inspectedTrack.emotional_core && (
                  <div>
                    <h4 className="font-ui text-xs uppercase tracking-wider text-[#9AA8B0] font-semibold mb-1">
                      Emotional Core Movement
                    </h4>
                    <p className="font-ui text-sm text-[#CFC5B5] leading-relaxed">
                      {inspectedTrack.emotional_core}
                    </p>
                  </div>
                )}

                {/* Narrative Interpretation */}
                {inspectedTrack.narrative_interpretation && (
                  <div>
                    <h4 className="font-ui text-xs uppercase tracking-wider text-[#9AA8B0] font-semibold mb-1">
                      Narrative &amp; Poetic Interpretation
                    </h4>
                    <p className="font-ui text-sm text-[#CFC5B5] leading-relaxed">
                      {inspectedTrack.narrative_interpretation}
                    </p>
                  </div>
                )}

                {/* Cultural Context */}
                {inspectedTrack.cultural_context && (
                  <div>
                    <h4 className="font-ui text-xs uppercase tracking-wider text-[#9AA8B0] font-semibold mb-1">
                      Cultural Context
                    </h4>
                    <p className="font-ui text-sm text-[#CFC5B5] leading-relaxed">
                      {inspectedTrack.cultural_context}
                    </p>
                  </div>
                )}

                {/* Why it may resonate */}
                {inspectedTrack.why_it_may_resonate && (
                  <div>
                    <h4 className="font-ui text-xs uppercase tracking-wider text-[#9AA8B0] font-semibold mb-1">
                      Why It May Resonate
                    </h4>
                    <p className="font-ui text-sm text-[#CFC5B5] leading-relaxed">
                      {inspectedTrack.why_it_may_resonate}
                    </p>
                  </div>
                )}

                {/* Technical / Model Details */}
                <div className="p-4 rounded-xl bg-[#08131B] border border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono text-[#9AA8B0]">
                  <div>
                    <span className="block text-[#CFC5B5]">Model:</span>
                    <span>{inspectedTrack.model}</span>
                  </div>
                  <div>
                    <span className="block text-[#CFC5B5]">Prompt Version:</span>
                    <span>{inspectedTrack.prompt_version}</span>
                  </div>
                  <div>
                    <span className="block text-[#CFC5B5]">Confidence:</span>
                    <span>{inspectedTrack.confidence ? `${(inspectedTrack.confidence * 100).toFixed(1)}%` : "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-[#CFC5B5]">Updated At:</span>
                    <span>{inspectedTrack.updated_at ? new Date(inspectedTrack.updated_at).toLocaleString() : "N/A"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-[#08131B] border border-white/10 space-y-3">
                <p className="font-ui text-xs text-[#CFC5B5]">
                  No meaning has been generated for this track yet. Click below to run the 8-stage Music Meaning pipeline.
                </p>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleAdminAction("regenerate")}
                  className="px-6 py-2.5 rounded-full bg-[#F2D78A] text-[#0B0F14] font-ui text-xs font-semibold hover:bg-[#FFB86B]"
                >
                  Generate Meaning Now →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
