"use client";

import React, { useState, useEffect } from "react";
import { EchoSoulShell } from "@/components/shell/EchoSoulShell";
import Image from "next/image";
import {
  CheckCircle2,
  Circle,
  ArrowUpRight,
  Compass,
  Plus,
  Sparkles,
  BookOpen,
  X,
  Calendar,
  Flame,
  Award,
  TrendingUp,
  Bookmark,
  ChevronRight,
  Check,
  Trash2,
} from "lucide-react";

interface GoalItem {
  id: number;
  title: string;
  category: "Consistency" | "Academics & Career" | "Mind & Health" | "Habits";
  done: boolean;
  dateAdded?: string;
}

interface JourneyMoment {
  id: string;
  title: string;
  date: string;
  type: "Breakthrough" | "Reflection" | "Milestone";
  description: string;
  insight: string;
  image: string;
}

const DEFAULT_GOALS: GoalItem[] = [
  { id: 1, title: "Be more consistent with morning stillness", category: "Consistency", done: true, dateAdded: "Sep 8, 2026" },
  { id: 2, title: "Complete Physics & Calculus revision", category: "Academics & Career", done: false, dateAdded: "Sep 9, 2026" },
  { id: 3, title: "Build a healthier wind-down routine without screen overthinking", category: "Mind & Health", done: false, dateAdded: "Sep 10, 2026" },
  { id: 4, title: "Write in evening reflection journal 4x weekly", category: "Habits", done: true, dateAdded: "Sep 7, 2026" },
  { id: 5, title: "Practice 4-7-8 breathing when anxiety rises", category: "Mind & Health", done: false, dateAdded: "Sep 11, 2026" },
];

const DEFAULT_MOMENTS: JourneyMoment[] = [
  {
    id: "m_01",
    title: "The Shift in Reaction",
    date: "10 Sep 2026",
    type: "Breakthrough",
    description: "Instead of letting academic pressure turn into spiraling self-doubt, I paused and listened to 432 Hz tones.",
    insight: "The space between the trigger and your response is where freedom begins.",
    image: "/tabs/journey_bg.jpg",
  },
  {
    id: "m_02",
    title: "A Calmer Evening",
    date: "9 Sep 2026",
    type: "Reflection",
    description: "Realized that overthinking at 11 PM solves nothing. Allowed the night to just be night.",
    insight: "Rest is not a reward you earn after perfection; it is a necessity.",
    image: "/tabs/guidance_bg.jpg",
  },
  {
    id: "m_03",
    title: "7-Day Honest Journaling",
    date: "8 Sep 2026",
    type: "Milestone",
    description: "Maintained a complete unbroken week of writing down raw thoughts without judging them.",
    insight: "Truth on paper becomes light in the mind.",
    image: "/tabs/words_bg.jpg",
  },
  {
    id: "m_04",
    title: "Finding Solace in Poetry",
    date: "6 Sep 2026",
    type: "Reflection",
    description: "Read Mirza Ghalib and Robert Frost. Felt deeply connected across centuries to people who navigated uncertainty.",
    insight: "You are never alone in what you feel.",
    image: "/tabs/music_bg.jpg",
  },
];

const LIFE_NOVEL_CHAPTERS = [
  {
    id: "ch_01",
    title: "The Awakening of Intention",
    date: "Late August 2026",
    tagline: "Stepping beyond the noise",
    content: "Every journey commences not with grand declarations, but with the quiet acknowledgment that existing solely on autopilot is no longer sufficient. In those first hesitant moments, you recognized that peace was not something to be stumbled upon by luck, but cultivated like a secret garden.",
  },
  {
    id: "ch_02",
    title: "Through the Overcast Days",
    date: "Early September 2026",
    tagline: "Learning endurance without force",
    content: "There were evenings when doubts multiplied like shadows at dusk. Academic expectations, unspoken comparisons, and internal fatigue collided. Yet, the sanctuary held. You discovered that endurance is not fierce resistance, but the gentle patience to breathe through the fog.",
  },
  {
    id: "ch_03",
    title: "The Gathering of Stillness",
    date: "Present Season",
    tagline: "Where the fragments align into purpose",
    content: "Here, in Chapter III, the conversations bear a different cadence. You no longer search frantically for quick answers; you savor the inquiry itself. Across your reflections and moments, an unmistakable quiet confidence is taking root. You are learning that who you are becoming is far larger than any single test or passing storm.",
  },
];

export default function JourneyPage() {
  const [activeTab, setActiveTab] = useState<"Overview" | "Goals" | "Moments" | "Life Novel" | "Progress">("Overview");
  const [userName, setUserName] = useState("Friend");
  const [goals, setGoals] = useState<GoalItem[]>(DEFAULT_GOALS);
  const [goalCategoryFilter, setGoalCategoryFilter] = useState<string>("All");
  const [newGoalInput, setNewGoalInput] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState<GoalItem["category"]>("Consistency");
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  // Moments state
  const [moments, setMoments] = useState<JourneyMoment[]>(DEFAULT_MOMENTS);
  const [momentFilter, setMomentFilter] = useState<string>("All");

  // Life Novel chapter viewer
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(2);
  const [lifeNovelOpen, setLifeNovelOpen] = useState(false);

  // Dynamic counts
  const [convCount, setConvCount] = useState(24);
  const [journalCount, setJournalCount] = useState(19);
  const [momentsCount, setMomentsCount] = useState(12);

  // Load user data from localStorage
  useEffect(() => {
    try {
      const p = localStorage.getItem("echosoul_user_personalization");
      if (p) {
        const parsed = JSON.parse(p);
        if (parsed.name) setUserName(parsed.name);
      }

      const storedGoals = localStorage.getItem("echosoul_goals_v2");
      if (storedGoals) {
        const parsed = JSON.parse(storedGoals);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGoals(parsed);
        }
      }

      const storedConvs = localStorage.getItem("echosoul_recent_conversations");
      if (storedConvs) {
        const parsed = JSON.parse(storedConvs);
        if (Array.isArray(parsed)) setConvCount(21 + parsed.length);
      }

      const storedJournal = localStorage.getItem("echosoul_journal_entries");
      if (storedJournal) {
        const parsed = JSON.parse(storedJournal);
        if (Array.isArray(parsed)) setJournalCount(15 + parsed.length);
      }

      const storedMoments = localStorage.getItem("echosoul_moments_v2");
      if (storedMoments) {
        const parsed = JSON.parse(storedMoments);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMoments(parsed);
        }
      }
    } catch {}
  }, []);

  const saveGoals = (updated: GoalItem[]) => {
    setGoals(updated);
    try {
      localStorage.setItem("echosoul_goals_v2", JSON.stringify(updated));
    } catch {}
  };

  const toggleGoal = (id: number) => {
    const updated = goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g));
    saveGoals(updated);
  };

  const deleteGoal = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = goals.filter((g) => g.id !== id);
    saveGoals(updated);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalInput.trim()) return;
    const newEntry: GoalItem = {
      id: Date.now(),
      title: newGoalInput.trim(),
      category: newGoalCategory,
      done: false,
      dateAdded: "Today",
    };
    saveGoals([newEntry, ...goals]);
    setNewGoalInput("");
    setIsAddingGoal(false);
  };

  const filteredGoals =
    goalCategoryFilter === "All"
      ? goals
      : goals.filter((g) => g.category === goalCategoryFilter);

  const completedGoalsCount = goals.filter((g) => g.done).length;
  const goalCompletionRate = goals.length > 0 ? Math.round((completedGoalsCount / goals.length) * 100) : 0;

  const filteredMoments =
    momentFilter === "All"
      ? moments
      : moments.filter((m) => m.type === momentFilter);

  return (
    <EchoSoulShell activePath="/app/journey">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-editorial text-[#FFF8E1]">Your journey matters.</h1>
            <p className="text-sm font-ui text-[#CFC5B5] mt-0.5">
              Track your growth. Build your Life Novel.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2D78A]/15 border border-[#F2D78A]/30 text-[#F2D78A] text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-[#F2D78A]" />
              7-Day Streak Active
            </span>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/5">
          {(["Overview", "Goals", "Moments", "Life Novel", "Progress"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-ui transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab
                  ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-md shadow-[#F2D78A]/10"
                  : "bg-[#0C1B25] text-[#CFC5B5] hover:text-[#FFF8E1] border border-white/10 hover:border-white/20"
              }`}
            >
              {tab === "Overview" && <Compass className="w-3.5 h-3.5" />}
              {tab === "Goals" && <CheckCircle2 className="w-3.5 h-3.5" />}
              {tab === "Moments" && <Sparkles className="w-3.5 h-3.5" />}
              {tab === "Life Novel" && <BookOpen className="w-3.5 h-3.5" />}
              {tab === "Progress" && <TrendingUp className="w-3.5 h-3.5" />}
              <span>{tab}</span>
            </button>
          ))}
        </div>

        {/* ── TAB 1: OVERVIEW ─────────────────────────────────────────── */}
        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
            {/* Main Hero Banner */}
            <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-[#F2D78A]/20 bg-[#09141D] shadow-2xl relative min-h-[460px] flex flex-col justify-between p-6 sm:p-8">
              <Image
                src="/tabs/journey_bg.jpg"
                alt="Golden sunrise winding mountain path"
                fill
                className="object-cover opacity-35 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070D12] via-transparent to-black/30 pointer-events-none" />

              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2D78A]/15 border border-[#F2D78A]/30 text-[#F2D78A] text-[11px] font-ui">
                  <Compass className="w-3 h-3" />
                  Your Living Path
                </span>
              </div>

              <div className="relative z-10 space-y-3 max-w-lg">
                <h2 className="text-3xl sm:text-4xl font-editorial text-[#FFF8E1] leading-tight">
                  &ldquo;A little progress every day adds up to a beautiful you.&rdquo;
                </h2>
                <p className="text-xs sm:text-sm font-ui text-[#F2D78A]">
                  Same you. A brighter tomorrow.
                </p>
              </div>

              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
                <span className="text-xs font-ui text-[#9AA8B0]">
                  Life Novel Chapter III synthesized from 24 conversations
                </span>
                <button
                  onClick={() => {
                    setActiveTab("Life Novel");
                  }}
                  className="px-4 py-2 rounded-full bg-[#F2D78A] text-[#0B0F14] text-xs font-semibold hover:bg-[#E5C77A] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Read Chapter III</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Sidebar: Quick Goals & Progress Ring */}
            <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-[#09141D] p-6 space-y-6">
              {/* Current Goals Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="font-editorial text-base font-semibold text-[#FFF8E1]">
                    Current Goals
                  </h3>
                  <button
                    onClick={() => setActiveTab("Goals")}
                    className="text-[11px] font-ui text-[#F2D78A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage all ({goals.length})</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2">
                  {goals.slice(0, 3).map((goal) => (
                    <div
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className="p-3 rounded-2xl bg-[#0C1B25]/80 hover:bg-[#0C1B25] border border-white/5 hover:border-[#F2D78A]/30 flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        {goal.done ? (
                          <CheckCircle2 className="w-4 h-4 text-[#F2D78A] shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#9AA8B0] shrink-0" />
                        )}
                        <span
                          className={`text-xs font-ui line-clamp-1 ${
                            goal.done ? "line-through text-[#9AA8B0]" : "text-[#FFF8E1]"
                          }`}
                        >
                          {goal.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Summary Ring */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-base font-semibold text-[#FFF8E1]">
                    Your Progress
                  </h3>
                  <button
                    onClick={() => setActiveTab("Progress")}
                    className="text-[11px] font-ui text-[#F2D78A] hover:underline cursor-pointer"
                  >
                    Details →
                  </button>
                </div>

                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#0C1B25]/80 border border-white/5">
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="3.2"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="#F2D78A"
                        strokeWidth="3.2"
                        strokeDasharray={`${goalCompletionRate} ${100 - goalCompletionRate}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute font-editorial text-sm font-bold text-[#F2D78A]">
                      {goalCompletionRate}%
                    </span>
                  </div>

                  <div className="text-xs font-ui space-y-1">
                    <p className="text-[#FFF8E1] font-semibold">Goal Completion</p>
                    <p className="text-[#9AA8B0] text-[11px] leading-tight">
                      {completedGoalsCount} of {goals.length} milestones accomplished.
                    </p>
                  </div>
                </div>

                {/* 4 Quick Stat Tiles */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
                    <span className="block text-base font-editorial text-[#F2D78A]">{convCount}</span>
                    <span className="text-[10px] font-ui text-[#9AA8B0]">Conversations</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
                    <span className="block text-base font-editorial text-[#F2D78A]">{journalCount}</span>
                    <span className="text-[10px] font-ui text-[#9AA8B0]">Journal Entries</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
                    <span className="block text-base font-editorial text-[#F2D78A]">{momentsCount}</span>
                    <span className="text-[10px] font-ui text-[#9AA8B0]">Moments</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
                    <span className="block text-base font-editorial text-[#F2D78A]">
                      {goals.filter((g) => !g.done).length}
                    </span>
                    <span className="text-[10px] font-ui text-[#9AA8B0]">Goals in Progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: GOALS ────────────────────────────────────────────── */}
        {activeTab === "Goals" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Goal Statistics & Add Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-[#09141D] border border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F2D78A]/15 border border-[#F2D78A]/30 flex items-center justify-center text-[#F2D78A]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-editorial font-bold text-[#FFF8E1]">
                    {completedGoalsCount} / {goals.length}
                  </p>
                  <p className="text-xs font-ui text-[#9AA8B0]">Completed Aspirations</p>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-[#09141D] border border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-editorial font-bold text-[#FFF8E1]">
                    {goalCompletionRate}%
                  </p>
                  <p className="text-xs font-ui text-[#9AA8B0]">Completion Velocity</p>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-[#09141D] border border-[#F2D78A]/20 flex items-center justify-between">
                <div>
                  <p className="text-sm font-editorial font-semibold text-[#FFF8E1]">Ready for a new step?</p>
                  <p className="text-xs font-ui text-[#9AA8B0]">Break big dreams into micro-habits.</p>
                </div>
                <button
                  onClick={() => setIsAddingGoal(true)}
                  className="px-4 py-2 rounded-full bg-[#F2D78A] text-[#0B0F14] text-xs font-semibold hover:bg-[#E5C77A] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Goal</span>
                </button>
              </div>
            </div>

            {/* Add Goal Modal / Inline Form */}
            {isAddingGoal && (
              <form
                onSubmit={handleAddGoal}
                className="p-5 rounded-3xl bg-[#0C1B25] border border-[#F2D78A]/30 space-y-4 animate-fadeIn shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-base font-semibold text-[#FFF8E1]">
                    Create New Aspiration or Habit
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddingGoal(false)}
                    className="p-1 rounded-full text-[#9AA8B0] hover:text-[#FFF8E1]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={newGoalInput}
                    onChange={(e) => setNewGoalInput(e.target.value)}
                    placeholder="e.g. Read 15 minutes of philosophy every morning..."
                    autoFocus
                    className="w-full bg-[#070D12] border border-white/15 rounded-2xl px-4 py-3 text-sm text-[#FFF8E1] focus:outline-none focus:border-[#F2D78A]"
                  />

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-ui text-[#9AA8B0]">Category:</span>
                    {(["Consistency", "Academics & Career", "Mind & Health", "Habits"] as const).map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setNewGoalCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-ui transition-all ${
                          newGoalCategory === cat
                            ? "bg-[#F2D78A] text-[#0B0F14] font-semibold"
                            : "bg-[#070D12] text-[#CFC5B5] border border-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingGoal(false)}
                    className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-ui text-[#FFF8E1]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#F2D78A] text-[#0B0F14] text-xs font-semibold hover:bg-[#E5C77A]"
                  >
                    Save Aspiration
                  </button>
                </div>
              </form>
            )}

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {["All", "Consistency", "Academics & Career", "Mind & Health", "Habits"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGoalCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-ui transition-all ${
                    goalCategoryFilter === cat
                      ? "bg-[#FFF8E1] text-[#0B0F14] font-semibold"
                      : "bg-[#09141D] text-[#9AA8B0] hover:text-[#FFF8E1] border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Interactive Goals List */}
            <div className="space-y-3">
              {filteredGoals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-center justify-between group ${
                    goal.done
                      ? "bg-[#09141D]/60 border-white/5 text-[#9AA8B0]"
                      : "bg-[#09141D] border-white/10 hover:border-[#F2D78A]/40 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="shrink-0">
                      {goal.done ? (
                        <div className="w-5 h-5 rounded-full bg-[#F2D78A] flex items-center justify-center text-[#0B0F14]">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-[#9AA8B0] group-hover:border-[#F2D78A] transition-colors" />
                      )}
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-ui ${
                          goal.done ? "line-through text-[#9AA8B0]" : "text-[#FFF8E1] font-medium"
                        }`}
                      >
                        {goal.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-ui px-2 py-0.5 rounded-full bg-white/5 text-[#9AA8B0]">
                          {goal.category}
                        </span>
                        {goal.dateAdded && (
                          <span className="text-[10px] font-ui text-[#9AA8B0]/60">
                            Added {goal.dateAdded}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-ui px-2.5 py-1 rounded-full ${
                        goal.done
                          ? "bg-[#F2D78A]/10 text-[#F2D78A]"
                          : "bg-white/5 text-[#9AA8B0]"
                      }`}
                    >
                      {goal.done ? "Accomplished" : "In Progress"}
                    </span>
                    <button
                      onClick={(e) => deleteGoal(goal.id, e)}
                      className="p-1.5 rounded-full text-[#9AA8B0] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: MOMENTS ──────────────────────────────────────────── */}
        {activeTab === "Moments" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter Buttons */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                {["All", "Breakthrough", "Reflection", "Milestone"].map((mType) => (
                  <button
                    key={mType}
                    onClick={() => setMomentFilter(mType)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-ui transition-all ${
                      momentFilter === mType
                        ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-sm"
                        : "bg-[#09141D] text-[#CFC5B5] hover:text-[#FFF8E1] border border-white/10"
                    }`}
                  >
                    {mType}
                  </button>
                ))}
              </div>

              <span className="text-xs font-ui text-[#9AA8B0]">
                {filteredMoments.length} moments saved from conversations &amp; insights
              </span>
            </div>

            {/* Grid of Moments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredMoments.map((moment) => (
                <div
                  key={moment.id}
                  className="rounded-3xl border border-white/10 bg-[#09141D] overflow-hidden hover:border-[#F2D78A]/40 transition-all flex flex-col justify-between shadow-xl"
                >
                  <div className="relative h-44 w-full">
                    <Image
                      src={moment.image}
                      alt={moment.title}
                      fill
                      className="object-cover opacity-45"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09141D] via-transparent to-black/30" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-ui text-[#F2D78A] font-semibold">
                        {moment.type}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 text-[11px] font-ui text-[#FFF8E1]/80">
                      {moment.date}
                    </div>
                  </div>

                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-editorial text-[#FFF8E1]">
                        {moment.title}
                      </h3>
                      <p className="text-xs font-ui text-[#CFC5B5] leading-relaxed">
                        {moment.description}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#0C1B25] border border-white/5 mt-4">
                      <p className="text-[11px] font-display italic text-[#F2D78A]">
                        &ldquo;{moment.insight}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: LIFE NOVEL ───────────────────────────────────────── */}
        {activeTab === "Life Novel" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#09141D] border border-[#F2D78A]/20 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1 z-10">
                <span className="text-xs font-ui uppercase tracking-widest text-[#F2D78A] font-semibold">
                  Personal Biography in Real-Time
                </span>
                <h2 className="text-3xl font-editorial text-[#FFF8E1]">
                  The Life Novel of {userName}
                </h2>
                <p className="text-xs font-ui text-[#CFC5B5] max-w-xl">
                  EchoSoul weaves your real discussions, breakthroughs, and honest questions into a timeless biographical narrative.
                </p>
              </div>

              <div className="flex items-center gap-2 z-10">
                <button
                  onClick={() => alert("New chapter will synthesize tonight after your evening reflection!")}
                  className="px-5 py-2.5 rounded-full bg-[#F2D78A] text-[#0B0F14] text-xs font-semibold hover:bg-[#E5C77A] transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synthesize Next Chapter</span>
                </button>
              </div>
            </div>

            {/* Chapter Selection & Reader Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Chapters List */}
              <div className="lg:col-span-4 space-y-3">
                <h3 className="font-editorial text-sm font-semibold text-[#FFF8E1] px-1">
                  Chronicle Index
                </h3>
                {LIFE_NOVEL_CHAPTERS.map((ch, idx) => (
                  <div
                    key={ch.id}
                    onClick={() => setSelectedChapterIndex(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedChapterIndex === idx
                        ? "bg-[#0C1B25] border-[#F2D78A]/50 shadow-lg"
                        : "bg-[#09141D] border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-ui text-[#F2D78A] font-semibold uppercase tracking-wider">
                        Chapter {idx + 1}
                      </span>
                      <span className="text-[10px] font-ui text-[#9AA8B0]">{ch.date}</span>
                    </div>
                    <h4 className="text-base font-editorial text-[#FFF8E1] mt-1 font-semibold">
                      {ch.title}
                    </h4>
                    <p className="text-xs font-ui text-[#9AA8B0] mt-0.5 line-clamp-1">
                      {ch.tagline}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chapter Reader View */}
              <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#09141D] border border-white/10 space-y-6">
                <div className="border-b border-white/10 pb-4 space-y-1">
                  <span className="text-[11px] font-ui text-[#F2D78A] uppercase tracking-widest font-semibold">
                    Chapter {selectedChapterIndex + 1} • {LIFE_NOVEL_CHAPTERS[selectedChapterIndex].date}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-editorial text-[#FFF8E1]">
                    {LIFE_NOVEL_CHAPTERS[selectedChapterIndex].title}
                  </h3>
                  <p className="text-xs font-ui text-[#9AA8B0] italic">
                    {LIFE_NOVEL_CHAPTERS[selectedChapterIndex].tagline}
                  </p>
                </div>

                <div className="text-sm sm:text-base font-editorial text-[#FFF8E1]/90 leading-relaxed space-y-4">
                  <p className="first-letter:text-4xl first-letter:font-editorial first-letter:font-bold first-letter:text-[#F2D78A] first-letter:mr-2 first-letter:float-left">
                    {LIFE_NOVEL_CHAPTERS[selectedChapterIndex].content}
                  </p>
                  <p>
                    Every choice made in private, every time you opted to reflect rather than react, shaped the quiet momentum recorded here. You are building an honest narrative, authored not by external expectations, but by your own growing clarity.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0C1B25] border border-white/5 flex items-center justify-between flex-wrap gap-2 text-xs font-ui text-[#9AA8B0]">
                  <span>Preserved securely in your encrypted Life Novel archives.</span>
                  <span className="text-[#F2D78A]">Verified authentic journey</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: PROGRESS ─────────────────────────────────────────── */}
        {activeTab === "Progress" && (
          <div className="space-y-6 animate-fadeIn">
            {/* 7-Day Consistency Tracker */}
            <div className="p-6 rounded-3xl bg-[#09141D] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-editorial text-[#FFF8E1]">Weekly Consistency &amp; Flow</h3>
                  <p className="text-xs font-ui text-[#9AA8B0]">Daily moments of mindfulness, words, or conversation</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2D78A]/15 text-[#F2D78A] text-xs font-semibold">
                  <Flame className="w-4 h-4" />
                  <span>7 of 7 Days Active</span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 pt-2">
                {[
                  { day: "Mon", active: true, label: "Voice Talk" },
                  { day: "Tue", active: true, label: "432Hz Zen" },
                  { day: "Wed", active: true, label: "Journal" },
                  { day: "Thu", active: true, label: "Poetry" },
                  { day: "Fri", active: true, label: "Goals set" },
                  { day: "Sat", active: true, label: "Ghazals" },
                  { day: "Sun", active: true, label: "Today" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-[#0C1B25] border border-[#F2D78A]/20 flex flex-col items-center justify-center text-center space-y-1"
                  >
                    <span className="text-xs font-ui text-[#9AA8B0]">{item.day}</span>
                    <div className="w-7 h-7 rounded-full bg-[#F2D78A] text-[#0B0F14] flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <span className="text-[9px] font-ui text-[#FFF8E1] truncate w-full">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emotional States Breakdown & Unlocked Badges */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Inner States Distribution */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-[#09141D] border border-white/10 space-y-4">
                <h3 className="text-lg font-editorial text-[#FFF8E1]">Emotional Alignment Distribution</h3>
                <p className="text-xs font-ui text-[#9AA8B0]">Based on voice cadences and session selections</p>

                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-ui mb-1">
                      <span className="text-[#FFF8E1]">Calmness &amp; Presence (432 Hz / 528 Hz)</span>
                      <span className="text-[#F2D78A] font-semibold">44%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#F2D78A] h-full rounded-full" style={{ width: "44%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-ui mb-1">
                      <span className="text-[#FFF8E1]">Focus &amp; Study Momentum</span>
                      <span className="text-blue-400 font-semibold">34%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full rounded-full" style={{ width: "34%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-ui mb-1">
                      <span className="text-[#FFF8E1]">Deep Emotional Processing &amp; Words</span>
                      <span className="text-emerald-400 font-semibold">22%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: "22%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Unlocked Growth Badges */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-[#09141D] border border-white/10 space-y-4">
                <h3 className="text-lg font-editorial text-[#FFF8E1]">Unlocked Milestones</h3>
                <p className="text-xs font-ui text-[#9AA8B0]">Achievements earned through authentic engagement</p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-2xl bg-[#0C1B25] border border-white/5 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#F2D78A]/15 text-[#F2D78A]">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-ui font-semibold text-[#FFF8E1]">Vulnerable Voice</p>
                      <p className="text-[10px] text-[#9AA8B0]">Spoke freely for 5+ min</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#0C1B25] border border-white/5 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
                      <Bookmark className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-ui font-semibold text-[#FFF8E1]">Poetic Scholar</p>
                      <p className="text-[10px] text-[#9AA8B0]">Analyzed 10+ verses</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#0C1B25] border border-white/5 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-ui font-semibold text-[#FFF8E1]">7-Day Flame</p>
                      <p className="text-[10px] text-[#9AA8B0]">A full week of stillness</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#0C1B25] border border-white/5 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-ui font-semibold text-[#FFF8E1]">Life Chronicler</p>
                      <p className="text-[10px] text-[#9AA8B0]">3 Chapters completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </EchoSoulShell>
  );
}
