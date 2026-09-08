"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import {
  User,
  BookOpen,
  Calendar,
  Film,
  Music,
  Archive,
  Sliders,
  Languages,
  Shield,
  ShieldCheck,
  CreditCard,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function SettingsPage() {
  const { profile, isGuest, signOut } = useAuth();

  const menuSections = [
    {
      title: "Your Creative Story",
      items: [
        { href: "/moments", label: "My Story & Moments", icon: Calendar },
        { href: "/memory", label: "My Memories", icon: Archive },
        { href: "/words", label: "My Words Collection", icon: BookOpen },
        { href: "/scenes", label: "My Scenes", icon: Film },
        { href: "/scenes", label: "Music Preferences", icon: Music },
      ],
    },
    {
      title: "Sanctuary Settings",
      items: [
        { href: "#preferences", label: "Emotional Style & Cadence", icon: Sliders },
        { href: "#language", label: "Voice & Language (Hindi, Urdu, English)", icon: Languages },
        { href: "#privacy", label: "Privacy & Data Controls", icon: ShieldCheck },
        { href: "#safety", label: "Safety & Crisis Architecture", icon: Shield },
        { href: "#premium", label: "EchoSoul Patron & Premium", icon: CreditCard },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in pb-8">
      {/* Profile Header (Screen 12 Reference) */}
      <GlassCard className="p-6 flex items-center justify-between gap-4 border-amber-500/15">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-amber-500/40 via-indigo-500/30 to-amber-300/30 border-2 border-amber-400/40 flex items-center justify-center text-xl font-serif-display font-medium text-amber-200 shadow-xl shadow-amber-500/10">
            {profile.name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-serif-display font-medium text-slate-100">
              {profile.name}
            </h1>
            <p className="text-xs text-amber-300/80 font-serif-display italic mt-0.5">
              &ldquo;Still becoming...&rdquo;
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                {isGuest ? "Guest Mode" : "Personal Sanctuary"}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Encrypted at rest
              </span>
            </div>
          </div>
        </div>

        {isGuest && (
          <Link href="/login">
            <Button variant="outline" size="sm" className="text-xs">
              Sign In
            </Button>
          </Link>
        )}
      </GlassCard>

      {/* Settings Navigation List */}
      <div className="space-y-6">
        {menuSections.map((sec) => (
          <div key={sec.title} className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">
              {sec.title}
            </h3>
            <GlassCard className="p-1 space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-colors text-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-amber-300/80">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </Link>
                );
              })}
            </GlassCard>
          </div>
        ))}
      </div>

      {/* Sign Out Button */}
      <div className="pt-2">
        <Button
          variant="secondary"
          size="md"
          className="w-full text-xs text-red-300 hover:text-red-200 hover:bg-red-500/10 border-red-500/20 gap-2"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          <span>{isGuest ? "Reset Guest Demo" : "Sign Out"}</span>
        </Button>
      </div>
    </div>
  );
}
