"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { performSecureLogout, invalidateUserCaches } from "@/lib/auth/sessionBoundary";
import type { User } from "@supabase/supabase-js";

export type AuthStatus =
  | "AUTH_LOADING"
  | "PROFILE_LOADING"
  | "ONBOARDING_STATE_LOADING"
  | "AUTHENTICATED"
  | "UNAUTHENTICATED"
  | "GUEST";

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  goals: string[];
  coreMemories: string[];
  recentMoods: string[];
  privacyLevel: string;
  onboardingCompleted: boolean | null;
  onboardingStep: number;
  role?: string;
  currentMood?: string;
  currentFocus?: string;
}

const DEFAULT_EMPTY_PROFILE: UserProfile = {
  id: "",
  name: "Friend",
  goals: [],
  coreMemories: [],
  recentMoods: [],
  privacyLevel: "standard",
  onboardingCompleted: null,
  onboardingStep: 1,
};

export function isUserGuestIdentity(user: User | null | undefined): boolean {
  if (!user) return false;
  if ((user as any).is_anonymous) return true;
  if (user.user_metadata?.is_guest === true) return true;
  if (user.email && user.email.endsWith("@guest.solenne.internal")) return true;
  return false;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile;
  authStatus: AuthStatus;
  isLoading: boolean;
  onboardingCompleted: boolean | null;
  onboardingStep: number;
  isGuest: boolean;
  isPrivateSession: boolean;
  setPrivateSession: (value: boolean) => void;
  signInAsGuest: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  resolvePostAuthRoute: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("AUTH_LOADING");
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_EMPTY_PROFILE);
  const [isPrivateSession, setIsPrivateSession] = useState<boolean>(false);

  const activeUserIdRef = useRef<string | null>(null);
  const isFetchingProfileRef = useRef<boolean>(false);

  // Helper to resolve route destination authoritatively
  const resolvePostAuthRoute = useCallback((): string => {
    if (isGuest) return "/app";
    if (profile.onboardingCompleted === true) {
      return "/app";
    }
    // Partially completed routing
    switch (profile.onboardingStep) {
      case 2:
        return "/onboarding/interests";
      case 3:
        return "/onboarding/world";
      case 4:
        return "/onboarding/preferences";
      case 5:
        return "/onboarding/appearance";
      case 6:
        return "/onboarding/complete";
      default:
        return "/onboarding";
    }
  }, [isGuest, profile.onboardingCompleted, profile.onboardingStep]);

  // Authoritative server/database fetch for user profile and onboarding state
  const loadAuthoritativeProfile = useCallback(
    async (authUser: User, force = false): Promise<void> => {
      if (isFetchingProfileRef.current && !force) return;
      isFetchingProfileRef.current = true;

      // Fast-path for guest identity
      if (isUserGuestIdentity(authUser)) {
        setIsGuest(true);
        setProfile({
          ...DEFAULT_EMPTY_PROFILE,
          id: authUser.id,
          name: authUser.user_metadata?.display_name || "Guest Explorer",
          email: authUser.email,
          role: "Guest Explorer",
          onboardingCompleted: true,
          onboardingStep: 1,
        });
        activeUserIdRef.current = authUser.id;
        setAuthStatus("GUEST");
        isFetchingProfileRef.current = false;
        return;
      }

      setAuthStatus("PROFILE_LOADING");

      try {
        const supabase = createClient();

        // 1. Fetch from Postgres profiles table directly via RLS
        const { data: dbProfile, error: profileErr } = await supabase
          .from("profiles")
          .select(
            "id, display_name, full_name, role, current_mood, current_focus, goals, onboarding_step, onboarding_completed"
          )
          .eq("id", authUser.id)
          .maybeSingle();

        setAuthStatus("ONBOARDING_STATE_LOADING");

        let resolvedCompleted: boolean | null = null;
        let resolvedStep = 1;
        let resolvedName =
          authUser.user_metadata?.display_name ||
          authUser.user_metadata?.full_name ||
          authUser.email?.split("@")[0] ||
          "Friend";

        let resolvedGoals: string[] = [];
        let resolvedRole: string | undefined;
        let resolvedMood: string | undefined;
        let resolvedFocus: string | undefined;

        if (dbProfile && !profileErr) {
          resolvedCompleted = dbProfile.onboarding_completed === true;
          resolvedStep = dbProfile.onboarding_step || 1;
          if (dbProfile.display_name || dbProfile.full_name) {
            resolvedName = dbProfile.display_name || dbProfile.full_name;
          }
          if (Array.isArray(dbProfile.goals)) {
            resolvedGoals = dbProfile.goals;
          }
          resolvedRole = dbProfile.role || undefined;
          resolvedMood = dbProfile.current_mood || undefined;
          resolvedFocus = dbProfile.current_focus || undefined;
        } else {
          // If profile row is missing or RLS sync issue, query server-authoritative API
          try {
            const res = await fetch("/api/auth/onboarding-status");
            if (res.ok) {
              const statusData = await res.json();
              if (statusData.authenticated && statusData.userId === authUser.id) {
                resolvedCompleted = statusData.onboardingCompleted === true;
                resolvedStep = statusData.onboardingStep || 1;
                if (statusData.displayName) {
                  resolvedName = statusData.displayName;
                }
              }
            }
          } catch {
            // Fallback to initial non-completed
            resolvedCompleted = false;
          }
        }

        // Final authoritative assignment
        const finalCompleted = resolvedCompleted === true;

        setProfile({
          id: authUser.id,
          name: resolvedName,
          email: authUser.email,
          goals: resolvedGoals,
          coreMemories: [],
          recentMoods: resolvedMood ? [resolvedMood] : [],
          privacyLevel: "standard",
          onboardingCompleted: finalCompleted,
          onboardingStep: resolvedStep,
          role: resolvedRole,
          currentMood: resolvedMood,
          currentFocus: resolvedFocus,
        });

        activeUserIdRef.current = authUser.id;
        setAuthStatus("AUTHENTICATED");
      } catch (err) {
        console.error("Failed to load authoritative profile:", err);
        // Do not guess onboarding_completed = false on transient error; stay safe
        setAuthStatus("AUTHENTICATED");
      } finally {
        isFetchingProfileRef.current = false;
      }
    },
    []
  );

  const refreshAuth = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (currentUser) {
        const isGuestUser = isUserGuestIdentity(currentUser);
        setUser(currentUser);
        setIsGuest(isGuestUser);
        await loadAuthoritativeProfile(currentUser, true);
      } else {
        setUser(null);
        setProfile(DEFAULT_EMPTY_PROFILE);
        setAuthStatus(isGuest ? "GUEST" : "UNAUTHENTICATED");
      }
    } catch {
      setAuthStatus("UNAUTHENTICATED");
    }
  }, [isGuest, loadAuthoritativeProfile]);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    // 1. Initial Session Restoration
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      if (!mounted) return;
      if (currentUser) {
        const isGuestUser = isUserGuestIdentity(currentUser);
        setUser(currentUser);
        setIsGuest(isGuestUser);
        activeUserIdRef.current = currentUser.id;
        loadAuthoritativeProfile(currentUser);
      } else {
        setUser(null);
        setIsGuest(false);
        setProfile(DEFAULT_EMPTY_PROFILE);
        setAuthStatus("UNAUTHENTICATED");
      }
    });

    // 2. Auth State Change Listener (supports account switch, token refresh, cross-tab events)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === "TOKEN_REFRESHED" && session?.user) {
          // Token refreshed: maintain state without reload or redirect flicker
          setUser(session.user);
          return;
        }

        if (session?.user) {
          const newUserId = session.user.id;
          const previousUserId = activeUserIdRef.current;
          const isGuestUser = isUserGuestIdentity(session.user);

          // Detect account switch: invalidate old user caches
          if (previousUserId && previousUserId !== newUserId) {
            invalidateUserCaches(previousUserId);
            setProfile(DEFAULT_EMPTY_PROFILE);
          }

          activeUserIdRef.current = newUserId;
          setUser(session.user);
          setIsGuest(isGuestUser);
          await loadAuthoritativeProfile(session.user);
        } else if (event === "SIGNED_OUT" || !session) {
          const previousUserId = activeUserIdRef.current;
          if (previousUserId) {
            invalidateUserCaches(previousUserId);
          }
          activeUserIdRef.current = null;
          setUser(null);
          setIsGuest(false);
          setProfile(DEFAULT_EMPTY_PROFILE);
          setAuthStatus("UNAUTHENTICATED");
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [loadAuthoritativeProfile]);

  const signInAsGuest = async (): Promise<{ success: boolean; error?: string }> => {
    setAuthStatus("AUTH_LOADING");
    const supabase = createClient();

    try {
      // 1. Attempt native anonymous auth first (if enabled in Supabase remote project)
      try {
        const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
        if (!anonError && anonData?.user) {
          setIsGuest(true);
          setUser(anonData.user);
          activeUserIdRef.current = anonData.user.id;
          setAuthStatus("GUEST");
          setProfile({
            ...DEFAULT_EMPTY_PROFILE,
            id: anonData.user.id,
            name: "Guest Explorer",
            role: "Guest Explorer",
            onboardingCompleted: true,
            onboardingStep: 1,
          });
          return { success: true };
        }
      } catch {
        // Fall through to dedicated server-side guest session
      }

      // 2. Call dedicated server guest-session API
      const res = await fetch("/api/auth/guest-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const creds = await res.json();
        if (creds.email && creds.password) {
          const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
            email: creds.email,
            password: creds.password,
          });

          if (!signInErr && signInData?.user) {
            setIsGuest(true);
            setUser(signInData.user);
            activeUserIdRef.current = signInData.user.id;
            setAuthStatus("GUEST");
            setProfile({
              ...DEFAULT_EMPTY_PROFILE,
              id: signInData.user.id,
              name: "Guest Explorer",
              role: "Guest Explorer",
              onboardingCompleted: true,
              onboardingStep: 1,
            });
            return { success: true };
          }
        }
      }

      // 3. Resilient Client-side fallback if backend or network is temporarily unreachable
      setIsGuest(true);
      setUser(null);
      activeUserIdRef.current = null;
      setAuthStatus("GUEST");
      setProfile({
        ...DEFAULT_EMPTY_PROFILE,
        id: `guest_${Date.now()}`,
        name: "Guest Explorer",
        role: "Guest Explorer",
        onboardingCompleted: true,
        onboardingStep: 1,
      });
      return { success: true };
    } catch (err: any) {
      console.warn("[GuestAuth] Fallback client guest mode engaged:", err);
      setIsGuest(true);
      setUser(null);
      activeUserIdRef.current = null;
      setAuthStatus("GUEST");
      setProfile({
        ...DEFAULT_EMPTY_PROFILE,
        id: `guest_${Date.now()}`,
        name: "Guest Explorer",
        role: "Guest Explorer",
        onboardingCompleted: true,
        onboardingStep: 1,
      });
      return { success: true };
    }
  };

  const signOut = async () => {
    try {
      setIsGuest(false);
      setAuthStatus("UNAUTHENTICATED");
      const supabase = createClient();
      await performSecureLogout(supabase, "/login");
    } catch {
      setIsGuest(false);
      setAuthStatus("UNAUTHENTICATED");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  const setPrivateSession = (val: boolean) => {
    setIsPrivateSession(val);
  };

  const isLoading =
    authStatus === "AUTH_LOADING" ||
    authStatus === "PROFILE_LOADING" ||
    authStatus === "ONBOARDING_STATE_LOADING";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        authStatus,
        isLoading,
        onboardingCompleted: profile.onboardingCompleted,
        onboardingStep: profile.onboardingStep,
        isGuest,
        isPrivateSession,
        setPrivateSession,
        signInAsGuest,
        signOut,
        refreshAuth,
        resolvePostAuthRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
