"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Mic, Compass, Calendar } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/app", label: "Home", icon: Home },
    { href: "/app/moments", label: "Moments", icon: Calendar },
    { href: "/app/talk", label: "Talk", icon: Mic, isCenter: true },
    { href: "/app/words", label: "Words", icon: BookOpen },
    { href: "/app/journey", label: "Journey", icon: Compass },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070b12]/90 backdrop-blur-xl border-t border-white/[0.08] px-4 py-2 safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-6 group"
              >
                <div
                  className={`h-13 w-13 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                    isActive
                      ? "bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 shadow-amber-500/30 border-2 border-amber-300"
                      : "bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shadow-amber-500/20 border-2 border-amber-400/40 hover:scale-105"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-medium text-amber-200 mt-1 tracking-wide">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
                isActive ? "text-amber-300" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] mt-1 font-light tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
