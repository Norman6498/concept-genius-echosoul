"use client";

import React, { useState, useEffect } from "react";
import { EchoSoulShell } from "@/components/shell/EchoSoulShell";
import Image from "next/image";
import { Sparkles, Plus, Calendar, X, Check } from "lucide-react";

export default function MomentsPage() {
  const [activeTab, setActiveTab] = useState("All Moments");
  const [modalOpen, setModalOpen] = useState(false);

  // New Moment form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTag, setNewTag] = useState("Milestone");
  const [newImage, setNewImage] = useState("/visual-worlds/mountain_calm.jpg");

  const [momentsList, setMomentsList] = useState([
    {
      title: "A breakthrough",
      desc: "I realised I'm more capable than my worries led me to believe.",
      date: "10 Sep 2026",
      tag: "Milestone",
      image: "/visual-worlds/mountain_calm.jpg",
    },
    {
      title: "A calmer day",
      desc: "Felt more in control during a hectic afternoon of study.",
      date: "8 Sep 2026",
      tag: "Reflection",
      image: "/tabs/guidance_bg.jpg",
    },
    {
      title: "A meaningful conversation",
      desc: "Talked about my fears regarding career direction and felt heard.",
      date: "6 Sep 2026",
      tag: "Breakthrough",
      image: "/tabs/journey_bg.jpg",
    },
    {
      title: "A new perspective",
      desc: "Things feel a little clearer when viewed from a gentle lens.",
      date: "4 Sep 2026",
      tag: "Reflection",
      image: "/visual-worlds/forest_retreat.jpg",
    },
    {
      title: "A small win",
      desc: "Completed a difficult chapter without procrastination.",
      date: "2 Sep 2026",
      tag: "Milestone",
      image: "/tabs/music_bg.jpg",
    },
    {
      title: "A moment of gratitude",
      desc: "Appreciated the warm sunrise and the quiet stillness of morning.",
      date: "31 Aug 2026",
      tag: "Reflection",
      image: "/visual-worlds/ocean_breeze.jpg",
    },
  ]);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("echosoul_moments");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMomentsList(parsed);
        }
      }
    } catch {}
  }, []);

  const handleCreateMoment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMoment = {
      title: newTitle.trim(),
      desc: newDesc.trim() || "A preserved turning point in my personal journey.",
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      tag: newTag,
      image: newImage,
    };

    const updated = [newMoment, ...momentsList];
    setMomentsList(updated);
    try {
      localStorage.setItem("echosoul_moments", JSON.stringify(updated));
    } catch {}

    setNewTitle("");
    setNewDesc("");
    setModalOpen(false);
  };

  const filteredMoments = momentsList.filter((m) => {
    if (activeTab === "All Moments") return true;
    if (activeTab === "Milestones") return m.tag === "Milestone";
    if (activeTab === "Reflections") return m.tag === "Reflection";
    if (activeTab === "From Conversations") return m.tag === "Breakthrough";
    return true;
  });

  return (
    <EchoSoulShell activePath="/app/moments">
      <div className="space-y-5">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-editorial text-[#FFF8E1]">Moments that matter.</h1>
            <p className="text-sm font-ui text-[#CFC5B5]">
              Key highlights and preserved breakthroughs from your journey.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="self-start px-4 py-2 rounded-full bg-[#F2D78A] text-[#0B0F14] text-xs font-semibold hover:bg-[#E5C77A] transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Capture Moment</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["All Moments", "From Conversations", "Milestones", "Reflections"].map((tab) => (
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

        {/* Photographic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMoments.map((moment, idx) => (
            <div
              key={idx}
              className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#09141D] min-h-[220px] p-5 flex flex-col justify-between shadow-xl group hover:border-[#F2D78A]/40 transition-all cursor-pointer"
            >
              <Image
                src={moment.image}
                alt={moment.title}
                fill
                className="object-cover opacity-35 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070D12] via-[#070D12]/60 to-transparent pointer-events-none" />

              {/* Tag and Sparkle */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[#F2D78A] text-[10px] font-ui">
                  {moment.tag}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#F2D78A]/70" />
              </div>

              {/* Moment Info */}
              <div className="relative z-10 space-y-1.5">
                <h3 className="font-editorial text-lg text-[#FFF8E1] group-hover:text-[#F2D78A] transition-colors">
                  {moment.title}
                </h3>
                <p className="text-xs font-ui text-[#CFC5B5] line-clamp-2 leading-relaxed">
                  &ldquo;{moment.desc}&rdquo;
                </p>
                <div className="flex items-center gap-1.5 pt-1 text-[10px] font-ui text-[#9AA8B0]">
                  <Calendar className="w-3 h-3" />
                  <span>{moment.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capture Moment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-[#09141D] border border-[#F2D78A]/30 p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#FFF8E1]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-ui uppercase tracking-widest text-[#F2D78A] font-semibold">
                Permanent Memory
              </span>
              <h2 className="text-2xl font-editorial text-[#FFF8E1]">Capture a Moment</h2>
              <p className="text-xs font-ui text-[#9AA8B0]">
                Preserve a breakthrough, calm realization, or meaningful milestone.
              </p>
            </div>

            <form onSubmit={handleCreateMoment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-ui text-[#CFC5B5]">Moment Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., A shift in perspective"
                  required
                  className="w-full bg-[#0C1B25] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-[#FFF8E1] focus:outline-none focus:border-[#F2D78A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-ui text-[#CFC5B5]">Reflection &amp; Insight</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What did you realise about yourself or your path?"
                  rows={3}
                  className="w-full bg-[#0C1B25] border border-white/15 rounded-xl p-3 text-xs text-[#FFF8E1] focus:outline-none focus:border-[#F2D78A] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-ui text-[#CFC5B5]">Category</label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full bg-[#0C1B25] border border-white/15 rounded-xl px-3 py-2 text-xs text-[#F2D78A] focus:outline-none"
                  >
                    <option value="Milestone">Milestone</option>
                    <option value="Reflection">Reflection</option>
                    <option value="Breakthrough">Breakthrough</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-ui text-[#CFC5B5]">Scenery Backdrop</label>
                  <select
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full bg-[#0C1B25] border border-white/15 rounded-xl px-3 py-2 text-xs text-[#F2D78A] focus:outline-none"
                  >
                    <option value="/visual-worlds/mountain_calm.jpg">Mountain Calm</option>
                    <option value="/visual-worlds/forest_retreat.jpg">Forest Retreat</option>
                    <option value="/visual-worlds/ocean_breeze.jpg">Ocean Breeze</option>
                    <option value="/visual-worlds/starry_skies.jpg">Starry Skies</option>
                    <option value="/visual-worlds/cozy_room.jpg">Cozy Room</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-ui text-[#CFC5B5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#F2D78A] text-[#0B0F14] text-xs font-semibold hover:bg-[#E5C77A] transition-colors shadow-md"
                >
                  Save Moment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </EchoSoulShell>
  );
}
