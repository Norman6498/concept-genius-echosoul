"use client";

import React from "react";
import { useAuth } from "./context";
import { useRouter } from "next/navigation";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isGuest, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user && !isGuest) {
      router.push("/login");
    }
  }, [user, isGuest, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080c14]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-amber-500/20 to-indigo-500/30 border border-amber-500/30 animate-breathe" />
          <p className="text-sm font-serif-display tracking-widest text-amber-200/70 uppercase">
            EchoSoul
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
