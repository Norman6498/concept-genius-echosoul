"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { MiniConversationBar } from "@/components/orchestration/MiniConversationBar";
import {
  Home,
  MessageCircle,
  FileText,
  Music,
  Heart,
  Compass,
  BookOpen,
  Leaf,
  Sparkles,
  Users,
  User,
  Settings,
  Search,
  X,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getScopedStorageItem, setScopedStorageItem, performSecureLogout } from "@/lib/auth/sessionBoundary";

interface EchoSoulShellProps {
  children: React.ReactNode;
  activePath: string;
}

interface UniversalSearchItem {
  id: string;
  category: "Books" | "Music" | "Feelings" | "Visuals" | "Guidance";
  title: string;
  subtitle: string;
  route: string;
}

const UNIVERSAL_SEARCH_INDEX: UniversalSearchItem[] = [
  // Books & Passages
  { id: "b1", category: "Books", title: "The Road Not Taken", subtitle: "Robert Frost • Courage of the uncommon path", route: "/app/words" },
  { id: "b2", category: "Books", title: "Karma Yoga (Bhagavad Gita)", subtitle: "Focus on duty, release anxiety of fruit", route: "/app/words" },
  { id: "b3", category: "Books", title: "Meditations", subtitle: "Marcus Aurelius • Power over your own mind", route: "/app/words" },
  { id: "b4", category: "Books", title: "Waqt (Selected Shayari)", subtitle: "Gulzar • The impermanence of tough phases", route: "/app/words" },
  { id: "b5", category: "Books", title: "Hazaron Khwaishein", subtitle: "Mirza Ghalib • Wisdom beyond infinite desire", route: "/app/words" },
  { id: "b6", category: "Books", title: "The Prophet", subtitle: "Kahlil Gibran • Pain as expansion of understanding", route: "/app/words" },
  { id: "b7", category: "Books", title: "The Power of Now", subtitle: "Eckhart Tolle • Resting in the present moment", route: "/app/words" },
  { id: "b8", category: "Books", title: "Atomic Habits", subtitle: "James Clear • Quiet compound growth", route: "/app/words" },

  // Music & Scientific Frequencies
  { id: "m1", category: "Music", title: "Woh Kagaz Ki Kashti", subtitle: "Jagjit Singh • 528 Hz Devotion & Childhood Nostalgia", route: "/app/music" },
  { id: "m2", category: "Music", title: "Kun Faya Kun", subtitle: "A.R. Rahman • 528 Hz Miracle & Spiritual Peace", route: "/app/music" },
  { id: "m3", category: "Music", title: "Phir Le Aya Dil", subtitle: "Arijit Singh • 417 Hz Releasing Sorrow", route: "/app/music" },
  { id: "m4", category: "Music", title: "Kasoor (Acoustic)", subtitle: "Prateek Kuhad • 639 Hz Warmth & Intimacy", route: "/app/music" },
  { id: "m5", category: "Music", title: "Mountain Focus", subtitle: "Solenne Sanctuary • 432 Hz Verdi Sacred Calm", route: "/app/music" },
  { id: "m6", category: "Music", title: "Sajjan Raazi", subtitle: "Satinder Sartaaj • 741 Hz Spiritual Clarity", route: "/app/music" },

  // Feelings & Guidance
  { id: "f1", category: "Feelings", title: "Managing Overwhelm & Anxiety", subtitle: "3 mindful micro-steps to regain quiet equilibrium", route: "/app/guidance" },
  { id: "f2", category: "Feelings", title: "Restless Mind & Sleep Wind-down", subtitle: "Slowing nocturnal racing thoughts with 174 Hz", route: "/app/visuals" },
  { id: "f3", category: "Feelings", title: "Need to Vent & Be Heard", subtitle: "Talk freely in voice without fear of judgment", route: "/app/talk" },
  { id: "f4", category: "Feelings", title: "Building Consistency & Routine", subtitle: "Small daily steps adding up to a brighter tomorrow", route: "/app/journey" },

  // Visuals
  { id: "v1", category: "Visuals", title: "Cozy Room (Fireplace & Rain)", subtitle: "Warmth, safety, and physical grounding (174 Hz)", route: "/app/visuals" },
  { id: "v2", category: "Visuals", title: "Mountain Calm (Lake & Peaks)", subtitle: "Stillness and breath pacing (432 Hz)", route: "/app/visuals" },
  { id: "v3", category: "Visuals", title: "Forest Retreat (Pine Cathedral)", subtitle: "Cellular renewal and deep calm (528 Hz)", route: "/app/visuals" },
  { id: "v4", category: "Visuals", title: "Starry Skies (Cosmic Night)", subtitle: "Restoring mental order and perspective (852 Hz)", route: "/app/visuals" },
];

export function EchoSoulShell({ children, activePath }: EchoSoulShellProps) {
  const router = useRouter();
  const [userName, setUserName] = useState("Friend");
  const [displayPersonalization, setDisplayPersonalization] = useState(true);
  const userIdRef = useRef<string | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadShellUser() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!isMounted) return;
        userIdRef.current = user?.id || null;

        const pDisp = getScopedStorageItem<any>(user?.id, "display_personalization", null);
        if (pDisp !== null) setDisplayPersonalization(pDisp === true || pDisp === "true");

        if (user?.user_metadata?.display_name) {
          setUserName(user.user_metadata.display_name);
        } else {
          const p1 = getScopedStorageItem<any>(user?.id, "personalization", null);
          if (p1?.name) {
            setUserName(p1.name);
          } else if (user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("display_name, full_name")
              .eq("id", user.id)
              .single();
            if (isMounted && (profile?.display_name || profile?.full_name)) {
              setUserName(profile.display_name || profile.full_name);
            }
          }
        }
      } catch {
        // ignore
      }
    }
    loadShellUser();
    return () => { isMounted = false; };
  }, []);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to sign out of Solenne? All local caches will be cleanly cleared.")) {
      const supabase = createClient();
      await performSecureLogout(supabase, "/login");
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? UNIVERSAL_SEARCH_INDEX.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSelectSearchResult = (route: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(route);
  };

  const navItems = [
    { label: "Talk", icon: <MessageCircle className="w-4 h-4" />, href: "/app/talk" },
    { label: "Words", icon: <FileText className="w-4 h-4" />, href: "/app/words" },
    { label: "Music", icon: <Music className="w-4 h-4" />, href: "/app/music" },
    { label: "Visuals", icon: <Heart className="w-4 h-4" />, href: "/app/visuals" },
    { label: "Journey", icon: <Compass className="w-4 h-4" />, href: "/app/journey" },
    { label: "Journal", icon: <BookOpen className="w-4 h-4" />, href: "/app/journal" },
    { label: "Guidance", icon: <Leaf className="w-4 h-4" />, href: "/app/guidance" },
    { label: "Moments", icon: <Sparkles className="w-4 h-4" />, href: "/app/moments" },
    { label: "Community", icon: <Users className="w-4 h-4" />, href: "/app/community", badge: "Soon" },
  ];

  return (
    <div className="relative min-h-screen bg-[#070D12] text-[#FFF8E1] flex flex-col justify-between overflow-x-hidden select-none">
      {/* ── Top Header Navigation Bar ── */}
      <header className="sticky top-0 z-40 bg-[#070D12]/95 backdrop-blur-md border-b border-white/10 h-16 shrink-0">
        <div className="w-full max-w-[1740px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <BrandLogo size="sm" />
          </div>

          {/* Universal Live Search Bar */}
          <div ref={searchContainerRef} className="flex-1 max-w-xl mx-auto relative hidden md:block">
            <Search className="w-4 h-4 text-[#9AA8B0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search anything... (books, feelings, music, questions)"
              className="w-full h-9 pl-10 pr-8 rounded-full bg-[#0C1B25] border border-white/10 text-xs text-[#FFF8E1] placeholder-[#9AA8B0]/60 focus:outline-none focus:border-[#F2D78A]/60 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA8B0] hover:text-[#FFF8E1]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Universal Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim() && (
              <div className="absolute top-11 left-0 right-0 rounded-2xl bg-[#09141D] border border-[#F2D78A]/30 shadow-2xl p-2 z-50 animate-fadeIn backdrop-blur-xl">
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectSearchResult(item.route)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#0C1B25] flex items-center justify-between group transition-all cursor-pointer border border-transparent hover:border-white/10"
                      >
                        <div className="space-y-0.5 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-ui uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-[#F2D78A]">
                              {item.category}
                            </span>
                            <h4 className="text-xs font-semibold text-[#FFF8E1] group-hover:text-[#F2D78A] transition-colors">
                              {item.title}
                            </h4>
                          </div>
                          <p className="text-[11px] font-ui text-[#9AA8B0] line-clamp-1">
                            {item.subtitle}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#9AA8B0] group-hover:text-[#F2D78A] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-[#9AA8B0]">
                    No results for &ldquo;{searchQuery}&rdquo;. Try searching for &ldquo;Robert Frost&rdquo;, &ldquo;Overwhelm&rdquo;, or &ldquo;Jagjit&rdquo;.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="flex items-center gap-1 p-1 rounded-full bg-[#0C1B25] border border-white/10">
              <button type="button" className="w-6 h-6 rounded-full flex items-center justify-center text-[#F2D78A] hover:bg-white/5 transition-colors" title="Theme Settings">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="4" strokeWidth="2" />
                  <path strokeLinecap="round" strokeWidth="2" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              </button>
            </div>

            <button type="button" className="relative p-2 rounded-full hover:bg-white/5 text-[#CFC5B5] transition-colors focus:outline-none" aria-label="Notifications">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E57373]" />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <Link href="/app/profile" className="flex items-center gap-2 hover:opacity-85 transition-opacity" title="View Profile">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#F2D78A] text-[#0B0F14] font-bold text-xs flex items-center justify-center shadow-md">
                  <span>{userName.charAt(0).toUpperCase()}</span>
                </div>
                <div className="hidden sm:flex flex-col leading-none">
                  <span className="font-ui text-xs font-semibold text-[#FFF8E1]">{userName}</span>
                  <span className="text-[10px] text-[#F2D78A] mt-0.5">Keep going</span>
                </div>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                title="Sign Out of Solenne"
                className="p-1.5 rounded-lg text-[#9AA8B0] hover:text-[#D97777] hover:bg-white/5 transition-colors ml-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Persistent Mini Conversation Bar for Secondary Experiences ── */}
      {activePath !== "/app/talk" && <MiniConversationBar />}

      {/* ── Main Layout ── */}
      <div className="w-full max-w-[1740px] mx-auto px-3 sm:px-6 lg:px-8 py-4 flex-1 flex gap-4 xl:gap-5">
        
        {/* ── 1. LEFT SIDEBAR ── */}
        <aside className="hidden xl:flex w-56 shrink-0 flex-col justify-between py-2 space-y-6">
          <div className="space-y-1">
            <Link
              href="/app"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                activePath === "/app"
                  ? "bg-[#F2D78A]/15 text-[#F2D78A] font-semibold border-l-2 border-[#F2D78A] shadow-sm"
                  : "text-[#CFC5B5] hover:text-[#FFF8E1] hover:bg-white/5 font-ui"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            {navItems.map((item) => {
              const isActive = activePath.startsWith(item.href) && item.href !== "#";
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-ui transition-all group ${
                    isActive
                      ? "bg-[#F2D78A]/15 text-[#F2D78A] font-semibold border-l-2 border-[#F2D78A] shadow-sm"
                      : "text-[#CFC5B5] hover:text-[#FFF8E1] hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="opacity-80 group-hover:opacity-100">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-[#F2D78A]/20 text-[#F2D78A]">{item.badge}</span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 my-2 border-t border-white/10" />

            <Link
              href="/app/profile"
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-ui transition-all ${
                activePath === "/app/profile"
                  ? "bg-[#F2D78A]/15 text-[#F2D78A] font-semibold border-l-2 border-[#F2D78A] shadow-sm"
                  : "text-[#CFC5B5] hover:text-[#FFF8E1] hover:bg-white/5"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
            <Link
              href="/app/settings"
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-ui transition-all ${
                activePath === "/app/settings"
                  ? "bg-[#F2D78A]/15 text-[#F2D78A] font-semibold border-l-2 border-[#F2D78A] shadow-sm"
                  : "text-[#CFC5B5] hover:text-[#FFF8E1] hover:bg-white/5"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0C1B25]/80 border border-white/10 space-y-2.5 text-[11px] font-manrope">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#FFF8E1]">Display Personalization</span>
              <button
                type="button"
                onClick={() => {
                  const next = !displayPersonalization;
                  setDisplayPersonalization(next);
                  setScopedStorageItem(userIdRef.current, "display_personalization", next);
                }}
                className={`w-7 h-4 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${
                  displayPersonalization ? "bg-[#F2D78A] justify-end" : "bg-white/20 justify-start"
                }`}
                title={displayPersonalization ? "Hide personalization from Home" : "Show personalization on Home"}
              >
                <span className={`w-3 h-3 rounded-full ${displayPersonalization ? "bg-[#0B0F14]" : "bg-white"}`} />
              </button>
            </div>
            <p className="text-[#9AA8B0] text-[10px] leading-tight">
              Show or hide personal data, history and recommendations from Home.
            </p>
          </div>

          {/* Decorative Sidebar Quote with Lantern accent */}
          <div className="pt-2 text-center text-[10px] font-display italic text-[#F2D78A]/85 border-t border-white/5">
            &ldquo;A brighter tomorrow begins with a kinder you.&rdquo;
          </div>
        </aside>

        {/* ── 2. CENTER CONTENT AREA ── */}
        <main className="flex-1 min-w-0 flex flex-col space-y-5">
          {children}
        </main>
      </div>

      {/* ── Global Footer ────────────────────────────────────────────── */}
      <footer className="relative z-20 w-full border-t border-white/10 bg-[#050B10] py-6 mt-6">
        <div className="max-w-[1740px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-ui text-[#9AA8B0]">
          <div className="flex items-center gap-6">
            <BrandLogo size="sm" />
            <nav className="flex items-center gap-4 text-xs">
              <Link href="/about" className="hover:text-[#F2D78A] transition-colors">About</Link>
              <Link href="/features" className="hover:text-[#F2D78A] transition-colors">Features</Link>
              <Link href="/stories" className="hover:text-[#F2D78A] transition-colors">Stories</Link>
              <Link href="/pricing" className="hover:text-[#F2D78A] transition-colors">Pricing</Link>
              <Link href="/#help" className="hover:text-[#F2D78A] transition-colors">Help</Link>
              <Link href="/privacy" className="hover:text-[#F2D78A] transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-[#F2D78A] transition-colors">Terms</Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <span className="italic text-[#F2D78A]">More than an AI. A place for what you feel.</span>
            <span>© 2026 Solenne. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export const SolenneShell = EchoSoulShell;
