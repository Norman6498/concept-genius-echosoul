"use client";

import React, { useState, useEffect } from "react";
import { EchoSoulShell } from "@/components/shell/EchoSoulShell";
import Image from "next/image";
import {
  Leaf,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
  BookOpen,
  Clock,
  Check,
} from "lucide-react";
import {
  getGuidanceForTab,
  GuidanceCategoryRecord,
} from "@/lib/content/guidanceDatabase";

export default function GuidancePage() {
  const [activeTab, setActiveTab] = useState("For You");
  const [userProfile, setUserProfile] = useState<{ currentFocus?: string; currentMood?: string }>({});
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showDeepModal, setShowDeepModal] = useState(false);

  // Load user profile from localStorage
  useEffect(() => {
    try {
      const p = localStorage.getItem("echosoul_user_personalization");
      if (p) {
        const parsed = JSON.parse(p);
        setUserProfile({
          currentFocus: parsed.currentFocus,
          currentMood: parsed.currentMood,
        });
      }
    } catch {}
  }, []);

  const currentGuidance: GuidanceCategoryRecord = getGuidanceForTab(activeTab, userProfile);

  // Load completed steps for this specific category
  useEffect(() => {
    try {
      const key = `echosoul_guidance_steps_${currentGuidance.id}`;
      const savedSteps = localStorage.getItem(key);
      if (savedSteps) {
        setCompletedSteps(JSON.parse(savedSteps));
      } else {
        setCompletedSteps([]);
      }
    } catch {}
  }, [currentGuidance.id]);

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => {
      const next = prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId];
      try {
        localStorage.setItem(`echosoul_guidance_steps_${currentGuidance.id}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return (
    <EchoSoulShell activePath="/app/guidance">
      <div className="space-y-5">
        {/* Title Header */}
        <div>
          <h1 className="text-3xl font-cormorant text-[#FFF8E1]">
            Thoughtful guidance for real life.
          </h1>
          <p className="text-sm font-manrope text-[#CFC5B5]">
            Practical insights for a calmer, clearer you.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["For You", "Study & Career", "Mental Health", "Relationships", "Life", "Habits"].map(
            (tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-manrope transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-md"
                      : "bg-[#0C1B25] text-[#CFC5B5] hover:text-[#FFF8E1] border border-white/10"
                  }`}
                >
                  {tab}
                </button>
              );
            }
          )}
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Stage: Your Focus Right Now */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#F2D78A]/20 bg-[#09141D] shadow-2xl relative min-h-[470px] flex flex-col justify-between p-6 sm:p-8">
            <Image
              src={currentGuidance.bgImage || "/tabs/guidance_bg.jpg"}
              alt="Guidance atmospheric background"
              fill
              className="object-cover opacity-25 pointer-events-none transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070D12] via-transparent to-black/40 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2D78A]/15 border border-[#F2D78A]/30 text-[#F2D78A] text-[11px] font-manrope">
                <Leaf className="w-3 h-3" />
                {currentGuidance.name} • Your Focus Right Now
              </span>

              <div>
                <h2 className="text-2xl sm:text-3xl font-cormorant text-[#FFF8E1]">
                  {currentGuidance.focusTitle}
                </h2>
                <p className="text-xs sm:text-sm font-manrope text-[#CFC5B5] mt-1">
                  {currentGuidance.focusSubtitle}
                </p>
              </div>

              {/* Action Steps */}
              <div className="space-y-3 pt-2">
                {currentGuidance.steps.map((step, idx) => {
                  const isDone = completedSteps.includes(step.id);
                  return (
                    <div
                      key={step.id}
                      onClick={() => toggleStep(step.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                        isDone
                          ? "bg-[#0C1B25]/40 border-white/5 opacity-70"
                          : "bg-[#0C1B25]/90 border-white/10 hover:border-[#F2D78A]/40"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-manrope text-xs font-bold transition-colors shrink-0 ${
                            isDone
                              ? "bg-[#4ADE80]/20 text-[#4ADE80]"
                              : "bg-[#F2D78A]/20 text-[#F2D78A]"
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <div>
                          <h4
                            className={`text-xs font-manrope font-semibold ${
                              isDone ? "line-through text-[#9AA8B0]" : "text-[#FFF8E1]"
                            }`}
                          >
                            {step.title}
                          </h4>
                          <p className="text-[11px] text-[#9AA8B0] font-manrope mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isDone ? "text-[#4ADE80]" : "text-white/20 group-hover:text-[#F2D78A]"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative z-10 pt-4 text-center border-t border-white/5">
              <p className="font-cormorant italic text-xs text-[#F2D78A]">
                &ldquo;Guidance that understands you.&rdquo;
              </p>
            </div>
          </div>

          {/* Right Sidebar: Personalized Insights */}
          <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#09141D] p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="font-cormorant text-lg font-semibold text-[#FFF8E1]">
                  Personalized Insights
                </h3>
                <span className="text-[10px] font-manrope text-[#F2D78A] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {currentGuidance.name}
                </span>
              </div>

              <div className="space-y-3">
                {currentGuidance.insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#0C1B25]/80 border border-white/5 space-y-1 hover:border-white/15 transition-all"
                  >
                    <div className="flex items-center gap-2 text-xs font-manrope font-semibold text-[#FFF8E1]">
                      <span className="text-sm">{insight.icon}</span>
                      <span>{insight.title}</span>
                    </div>
                    <p className="text-xs font-manrope text-[#CFC5B5] leading-relaxed pl-5">
                      {insight.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowDeepModal(true)}
              className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-manrope text-[#FFF8E1] border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Explore deeper guidance</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F2D78A]" />
            </button>
          </div>
        </div>
      </div>

      {/* Deep Guidance Practical Exercises Modal */}
      {showDeepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl border border-[#F2D78A]/30 bg-[#09141D] p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F2D78A]/15 border border-[#F2D78A]/30 flex items-center justify-center text-[#F2D78A]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-cormorant text-2xl text-[#FFF8E1]">
                    Deeper {currentGuidance.name} Exercises
                  </h3>
                  <p className="text-xs font-manrope text-[#9AA8B0]">
                    Evidence-backed practical protocols designed for deep transformation.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeepModal(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#FFF8E1] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {currentGuidance.deepPractices.map((practice, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#0C1B25] border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-cormorant text-lg font-semibold text-[#F2D78A]">
                      {practice.title}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[11px] font-manrope text-[#9AA8B0] bg-white/5 px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" />
                      {practice.timeEstimate}
                    </span>
                  </div>

                  <p className="text-xs font-manrope text-[#FFF8E1] leading-relaxed">
                    {practice.instruction}
                  </p>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] font-manrope text-[#CFC5B5]">
                    <span className="text-[#F2D78A] font-semibold">Core Takeaway: </span>
                    {practice.takeaway}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDeepModal(false)}
                className="px-6 py-2 rounded-full btn-gold-primary text-xs font-semibold cursor-pointer shadow-md"
              >
                Close Guidance
              </button>
            </div>
          </div>
        </div>
      )}
    </EchoSoulShell>
  );
}
