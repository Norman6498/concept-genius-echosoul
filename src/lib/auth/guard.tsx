"use client";

import React, { useEffect } from "react";
import { useAuth } from "./context";
import { useRouter, usePathname } from "next/navigation";

function SanctuaryLoadingScreen({ label = "Solenne Sanctuary" }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070D12] text-[#FFF8E1]">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-[#F2D78A]/20 to-[#FFB86B]/30 border border-[#F2D78A]/40 animate-pulse shadow-[0_0_25px_rgba(242,215,138,0.25)]" />
          <div className="absolute w-2 h-2 rounded-full bg-[#F2D78A] animate-ping" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-ui tracking-[0.25em] text-[#F2D78A] uppercase font-semibold">
            {label}
          </p>
          <p className="text-[11px] font-ui text-[#9AA8B0]">
            Connecting to your inner world...
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * AppRouteGuard: Enforces that visitors to /app/** are authenticated
 * and have authoritatively completed onboarding.
 */
export function AppRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isGuest, authStatus, onboardingCompleted, isLoading, resolvePostAuthRoute } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only make route decisions when loading is completely done
    if (isLoading) return;

    if (authStatus === "UNAUTHENTICATED" && !isGuest) {
      router.replace("/login");
      return;
    }

    if (authStatus === "AUTHENTICATED" && onboardingCompleted === false && !isGuest) {
      // Incomplete onboarding -> send to onboarding step
      router.replace(resolvePostAuthRoute());
    }
  }, [authStatus, isGuest, isLoading, onboardingCompleted, resolvePostAuthRoute, router]);

  // While checking session and DB onboarding status, render calm loading state
  if (isLoading) {
    return <SanctuaryLoadingScreen label="Solenne" />;
  }

  // If unauthenticated, render loader while redirect takes effect
  if (authStatus === "UNAUTHENTICATED" && !isGuest) {
    return <SanctuaryLoadingScreen label="Redirecting" />;
  }

  // If authenticated but incomplete onboarding, render loader while redirecting to onboarding
  if (authStatus === "AUTHENTICATED" && onboardingCompleted === false && !isGuest) {
    return <SanctuaryLoadingScreen label="Entering Onboarding" />;
  }

  return <>{children}</>;
}

/**
 * OnboardingRouteGuard: Enforces that returning users who completed onboarding
 * are NEVER shown onboarding again, and routes unauthenticated users to /login.
 */
export function OnboardingRouteGuard({ children }: { children: React.ReactNode }) {
  const { isGuest, authStatus, onboardingCompleted, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (authStatus === "UNAUTHENTICATED" && !isGuest) {
      router.replace("/login");
      return;
    }

    // RETURNING USER FIX: If user already completed onboarding (or in Guest mode), redirect straight to /app!
    if ((authStatus === "AUTHENTICATED" && onboardingCompleted === true) || isGuest) {
      router.replace("/app");
    }
  }, [authStatus, isGuest, isLoading, onboardingCompleted, router]);

  if (isLoading) {
    return <SanctuaryLoadingScreen label="Solenne Onboarding" />;
  }

  if (authStatus === "UNAUTHENTICATED" && !isGuest) {
    return <SanctuaryLoadingScreen label="Redirecting" />;
  }

  // If user completed onboarding or is guest, show loader while redirecting to /app
  if ((authStatus === "AUTHENTICATED" && onboardingCompleted === true) || isGuest) {
    return <SanctuaryLoadingScreen label="Opening Sanctuary" />;
  }

  return <>{children}</>;
}

/**
 * PublicAuthGuard: Prevents already authenticated users from being shown login/signup.
 */
export function PublicAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isGuest, authStatus, onboardingCompleted, isLoading, resolvePostAuthRoute } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (authStatus === "AUTHENTICATED" && user) {
      if (onboardingCompleted === true) {
        router.replace("/app");
      } else if (onboardingCompleted === false) {
        router.replace(resolvePostAuthRoute());
      }
    }
  }, [authStatus, isLoading, onboardingCompleted, resolvePostAuthRoute, router, user]);

  return <>{children}</>;
}

/**
 * Backward compatibility alias for RouteGuard
 */
export const RouteGuard = AppRouteGuard;
