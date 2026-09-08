"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { PrivacyIndicator } from "./PrivacyIndicator";
import {
  Home,
  BookOpen,
  Mic,
  Compass,
  Film,
  Archive,
  Settings,
  Sparkles,
  LogOut,
  Calendar,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { profile, isGuest, signOut } = useAuth();

  const primaryNav = [
    { href: "/app", label: "Home", icon: Home },
    { href: "/app/moments", label: "Moments", icon: Calendar },
    { href: "/app/talk", label: "Talk", icon: Mic, highlight: true },
    { href: "/app/words", label: "Words", icon: BookOpen },
    { href: "/app/journey", label: "Journey", icon: Compass },
  ];

  const secondaryNav = [
    { href: "/app/scenes", label: "Scenes", icon: Film },
    { href: "/app/memory", label: "Memory", icon: Archive },
    { href: "/app/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-white/[0.08] bg-[#070b12]/80 backdrop-blur-xl z-30 p-5 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 pt-1 pb-6 border-b border-white/[0.06]">
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500/30 to-indigo-500/30 border border-amber-400/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
          <Sparkles className="h-4 w-4 text-amber-300" />
        </div>
        <div>
          <h1 className="font-serif-display text-lg font-medium tracking-wide text-slate-100">
            EchoSoul
          </h1>
          <p className="text-[11px] text-slate-400 font-light tracking-wider">
            Feel · Reflect · Heal · Grow
          </p>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 py-6 space-y-1">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">
          Experience
        </div>
        {primaryNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all my-1.5 ${
                  isActive
                    ? "bg-amber-400/20 text-amber-200 border border-amber-400/40 shadow-sm shadow-amber-500/20"
                    : "bg-gradient-to-r from-amber-500/10 to-transparent hover:from-amber-500/20 text-amber-200 border border-amber-500/20"
                }`}
              >
                <div className="h-7 w-7 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span>{item.label}</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Listen
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                isActive
                  ? "bg-white/[0.09] text-white font-medium shadow-sm border border-white/[0.08]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-amber-300" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Secondary Navigation */}
        <div className="pt-6">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Sanctuary
          </div>
          {secondaryNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-white/[0.09] text-white font-medium shadow-sm border border-white/[0.08]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-amber-300" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Area: Privacy Badge & User Card */}
      <div className="pt-4 border-t border-white/[0.06] space-y-3">
        <div className="px-1">
          <PrivacyIndicator />
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <Link href="/app/settings" className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500/40 to-indigo-500/40 border border-white/20 flex items-center justify-center text-xs font-serif-display font-medium text-amber-200 shrink-0">
              {profile.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="truncate">
              <div className="text-xs font-medium text-slate-200 truncate">
                {profile.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {isGuest ? "Guest Demo" : "Personal Studio"}
              </div>
            </div>
          </Link>
          <button
            onClick={() => signOut()}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
