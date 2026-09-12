"use client";

import React, { useState, useEffect, useRef } from "react";
import { EchoSoulShell } from "@/components/shell/EchoSoulShell";
import Image from "next/image";
import { User, Mail, Sparkles, BookOpen, Heart, Target, Edit3, X, Check, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getScopedStorageItem, setScopedStorageItem, performSecureLogout } from "@/lib/auth/sessionBoundary";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userIdRef = useRef<string | null>(null);

  const [profile, setProfile] = useState({
    name: "Friend",
    email: "",
    role: "Explorer",
    ageRange: "19 - 22",
    interests: ["Literature", "Music", "Nature", "Philosophy"],
    goals: ["Personal Growth", "Mental Health"],
    tone: "Gentle & Poetic",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    role: "Explorer",
    ageRange: "19 - 22",
  });

  const allAvailableInterests = [
    "Literature",
    "Philosophy",
    "Music",
    "Nature",
    "Technology",
    "Psychology",
    "Mindfulness",
    "Poetry & Shayari",
    "Career & Ambition",
  ];

  useEffect(() => {
    let isMounted = true;

    async function loadUserProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!isMounted) return;

        userIdRef.current = user?.id || null;

        let name = "Friend";
        let email = "";
        let role = "Explorer";
        let ageRange = "19 - 22";

        if (user) {
          email = user.email || "";
          if (user.user_metadata?.display_name || user.user_metadata?.full_name) {
            name = user.user_metadata.display_name || user.user_metadata.full_name;
          }

          // Fetch database profile
          const { data: dbProfile } = await supabase
            .from("profiles")
            .select("display_name, full_name, role, age_range, interests, goals")
            .eq("id", user.id)
            .single();

          if (isMounted && dbProfile) {
            if (dbProfile.display_name || dbProfile.full_name) {
              name = dbProfile.display_name || dbProfile.full_name;
            }
            if (dbProfile.role) role = dbProfile.role;
            if (dbProfile.age_range) ageRange = dbProfile.age_range;
          }
        }

        // Check user-scoped local storage
        const userScoped = getScopedStorageItem<any>(user?.id, "personalization", null);
        if (userScoped?.name && userScoped.name !== "Pratik") name = userScoped.name;
        if (userScoped?.role) role = userScoped.role;
        if (userScoped?.ageRange) ageRange = userScoped.ageRange;

        let userInterests = ["Literature", "Music", "Nature", "Philosophy"];
        const interestsStored = getScopedStorageItem<any>(user?.id, "interests", null);
        if (interestsStored && Array.isArray(interestsStored.interests) && interestsStored.interests.length > 0) {
          userInterests = interestsStored.interests;
        }

        if (isMounted) {
          setProfile((prev) => ({
            ...prev,
            name,
            email,
            role,
            ageRange,
            interests: userInterests,
          }));
          setEditForm({ name, role, ageRange });
        }
      } catch (err) {
        console.warn("Profile load notice:", err);
      }
    }

    loadUserProfile();
    return () => { isMounted = false; };
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...profile,
      name: editForm.name,
      role: editForm.role,
      ageRange: editForm.ageRange,
    };
    setProfile(updated);

    try {
      const existing = getScopedStorageItem<any>(userIdRef.current, "personalization", {});
      setScopedStorageItem(userIdRef.current, "personalization", {
        ...existing,
        name: updated.name,
        role: updated.role,
        ageRange: updated.ageRange,
      });

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.auth.updateUser({
          data: { display_name: updated.name },
        });
        await supabase.from("profiles").upsert({
          id: user.id,
          display_name: updated.name,
          role: updated.role,
          age_range: updated.ageRange,
          updated_at: new Date().toISOString(),
        });
      }
    } catch {}

    setIsEditOpen(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const toggleInterest = async (item: string) => {
    const updated = profile.interests.includes(item)
      ? profile.interests.filter((i) => i !== item)
      : [...profile.interests, item];

    setProfile((prev) => ({ ...prev, interests: updated }));
    setScopedStorageItem(userIdRef.current, "interests", { interests: updated });

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({
          interests: updated,
          updated_at: new Date().toISOString(),
        }).eq("id", user.id);
      }
    } catch {}
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to sign out of EchoSoul? All local caches will be cleanly cleared.")) {
      setIsLoggingOut(true);
      const supabase = createClient();
      await performSecureLogout(supabase, "/login");
    }
  };

  return (
    <EchoSoulShell activePath="/app/profile">
      <div className="space-y-5">
        {/* Title Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-editorial text-[#FFF8E1]">Your space. Your story.</h1>
            <p className="text-sm font-ui text-[#CFC5B5]">
              Manage your identity, curated interests, and sanctuary settings.
            </p>
          </div>
          {savedSuccess && (
            <span className="text-xs font-ui text-[#4ADE80] bg-[#4ADE80]/15 px-3 py-1 rounded-full border border-[#4ADE80]/30 animate-fadeIn">
              Profile updated successfully!
            </span>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["Overview", "Interests", "Goals", "Preferences", "About"].map((tab) => (
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

        {/* Main Identity Canvas */}
        <div className="rounded-3xl border border-[#F2D78A]/20 bg-[#09141D] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: User Avatar & Core Details */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-[#F2D78A] text-[#0B0F14] font-editorial text-3xl font-bold flex items-center justify-center shadow-xl ring-4 ring-[#F2D78A]/20">
                <span>{profile.name.charAt(0).toUpperCase()}</span>
              </div>

              <div>
                <h2 className="text-2xl font-editorial text-[#FFF8E1]">{profile.name}</h2>
                <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-[#F2D78A]/15 text-[#F2D78A] text-[11px] font-ui font-medium border border-[#F2D78A]/30">
                  Keep going ✨
                </span>
              </div>

              <div className="w-full space-y-2.5 pt-2 text-left text-xs font-ui text-[#CFC5B5]">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-[#9AA8B0]">Role:</span>
                  <span className="text-[#FFF8E1] font-semibold">{profile.role}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-[#9AA8B0]">Email:</span>
                  <span className="text-[#FFF8E1] truncate max-w-[160px]">{profile.email}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-[#9AA8B0]">Life Stage:</span>
                  <span className="text-[#FFF8E1]">{profile.ageRange}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditForm({ name: profile.name, role: profile.role, ageRange: profile.ageRange });
                  setIsEditOpen(true);
                }}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-ui text-[#F2D78A] border border-[#F2D78A]/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full py-2 rounded-xl bg-[#D97777]/10 hover:bg-[#D97777]/20 text-xs font-ui text-[#D97777] border border-[#D97777]/30 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
              </button>
            </div>

            {/* Right Tab Content */}
            <div className="lg:col-span-8 space-y-6">
              {activeTab === "Overview" && (
                <div className="space-y-6">
                  {/* Interests */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-ui text-[#F2D78A] uppercase tracking-wider font-semibold">
                      <Heart className="w-3.5 h-3.5" />
                      <span>Your Curated Interests</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-1.5 rounded-full bg-[#0C1B25] border border-[#F2D78A]/30 text-xs font-ui text-[#FFF8E1] shadow-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-ui text-[#4ADE80] uppercase tracking-wider font-semibold">
                      <Target className="w-3.5 h-3.5" />
                      <span>Current Personal Aspirations</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.goals.map((goal, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-1.5 rounded-full bg-[#0C1B25] border border-white/15 text-xs font-ui text-[#CFC5B5]"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Supportive Tagline */}
                  <div className="p-5 rounded-2xl bg-[#0C1B25]/60 border border-white/5 flex items-center justify-between gap-4">
                    <p className="font-display italic text-sm text-[#F2D78A] leading-relaxed">
                      &ldquo;The more you share, the more personal EchoSoul becomes.&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "Interests" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-editorial text-[#FFF8E1]">Select Your Focus Areas</h3>
                    <p className="text-xs font-ui text-[#9AA8B0]">
                      Click to toggle what books, music, and thought letters EchoSoul personalizes for you.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {allAvailableInterests.map((interest) => {
                      const isSelected = profile.interests.includes(interest);
                      return (
                        <button
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          className={`p-3 rounded-2xl border text-xs font-ui text-left flex items-center justify-between transition-all ${
                            isSelected
                              ? "bg-[#F2D78A]/15 border-[#F2D78A] text-[#F2D78A] font-semibold"
                              : "bg-[#0C1B25] border-white/10 text-[#CFC5B5] hover:border-white/20"
                          }`}
                        >
                          <span>{interest}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#F2D78A]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "Goals" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-editorial text-[#FFF8E1]">Personal Aspirations</h3>
                    <p className="text-xs font-ui text-[#9AA8B0]">
                      EchoSoul connects your conversations and reflection prompts to these goals.
                    </p>
                  </div>
                  <div className="space-y-2">
                    {profile.goals.map((g, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-[#0C1B25] border border-white/10 flex items-center justify-between text-xs font-ui"
                      >
                        <span className="text-[#FFF8E1]">{g}</span>
                        <span className="text-[10px] text-[#4ADE80] font-semibold">Active</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Preferences" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-editorial text-[#FFF8E1]">Sanctuary Tone &amp; Style</h3>
                    <p className="text-xs font-ui text-[#9AA8B0]">
                      Choose how EchoSoul speaks and crafts reflections for you.
                    </p>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { title: "Gentle & Poetic", desc: "Soulful, warm, and deeply reflective." },
                      { title: "Grounded & Stoic", desc: "Clear, resilient, and focused on action." },
                      { title: "Direct & Structured", desc: "Concise, step-by-step clarity." },
                    ].map((toneItem) => (
                      <div
                        key={toneItem.title}
                        onClick={() => setProfile((p) => ({ ...p, tone: toneItem.title }))}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          profile.tone === toneItem.title
                            ? "bg-[#F2D78A]/15 border-[#F2D78A]"
                            : "bg-[#0C1B25] border-white/10"
                        }`}
                      >
                        <h4 className="text-xs font-ui font-semibold text-[#FFF8E1]">{toneItem.title}</h4>
                        <p className="text-[11px] font-ui text-[#9AA8B0]">{toneItem.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "About" && (
                <div className="space-y-3 p-5 rounded-2xl bg-[#0C1B25] border border-white/10 text-xs font-ui text-[#CFC5B5] leading-relaxed">
                  <h3 className="text-base font-editorial text-[#FFF8E1]">EchoSoul Philosophy</h3>
                  <p>
                    EchoSoul was designed as an authentic refuge against the noise of modern life.
                    It is neither an aggressive productivity tracker nor a clinical bot. It is a quiet space
                    where your thoughts are heard without judgment, and where authentic literature and calm
                    scenery accompany your journey.
                  </p>
                  <p className="font-display italic text-[#F2D78A] pt-2">
                    &ldquo;Same stories. Different paths. A brighter together.&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[#09141D] border border-[#F2D78A]/30 p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#FFF8E1]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-editorial text-[#FFF8E1]">Edit Sanctuary Profile</h3>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-ui text-[#CFC5B5]">Display Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  className="w-full bg-[#0C1B25] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-[#FFF8E1] focus:outline-none focus:border-[#F2D78A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-ui text-[#CFC5B5]">Role / Calling</label>
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                  required
                  className="w-full bg-[#0C1B25] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-[#FFF8E1] focus:outline-none focus:border-[#F2D78A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-ui text-[#CFC5B5]">Life Stage</label>
                <input
                  type="text"
                  value={editForm.ageRange}
                  onChange={(e) => setEditForm((f) => ({ ...f, ageRange: e.target.value }))}
                  className="w-full bg-[#0C1B25] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-[#FFF8E1] focus:outline-none focus:border-[#F2D78A]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-ui text-[#CFC5B5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#F2D78A] text-[#0B0F14] text-xs font-semibold hover:bg-[#E5C77A] transition-colors shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </EchoSoulShell>
  );
}
