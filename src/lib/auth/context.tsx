"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { performSecureLogout } from "@/lib/auth/sessionBoundary";
import type { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  goals: string[];
  coreMemories: string[];
  recentMoods: string[];
  privacyLevel: string;
}

const DEFAULT_EMPTY_PROFILE: UserProfile = {
  id: "",
  name: "Friend",
  goals: [],
  coreMemories: [],
  recentMoods: [],
  privacyLevel: "standard",
};

interface AuthContextType {
  user: User | null;
  profile: UserProfile;
  isGuest: boolean;
  isLoading: boolean;
  isPrivateSession: boolean;
  setPrivateSession: (value: boolean) => void;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_EMPTY_PROFILE);
  const [isPrivateSession, setIsPrivateSession] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    try {
      const supabase = createClient();

      supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
        if (!mounted) return;
        if (currentUser) {
          setUser(currentUser);
          setIsGuest(false);
          const name = currentUser.user_metadata?.display_name ||
                       currentUser.user_metadata?.full_name ||
                       currentUser.email?.split("@")[0] ||
                       "Friend";
          setProfile({
            id: currentUser.id,
            name,
            email: currentUser.email,
            goals: [],
            coreMemories: [],
            recentMoods: [],
            privacyLevel: "standard",
          });
        } else {
          setUser(null);
          setIsGuest(true);
          setProfile(DEFAULT_EMPTY_PROFILE);
        }
        setIsLoading(false);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (!mounted) return;
          if (session?.user) {
            setUser(session.user);
            setIsGuest(false);
            const name = session.user.user_metadata?.display_name ||
                         session.user.user_metadata?.full_name ||
                         session.user.email?.split("@")[0] ||
                         "Friend";
            setProfile({
              id: session.user.id,
              name,
              email: session.user.email,
              goals: [],
              coreMemories: [],
              recentMoods: [],
              privacyLevel: "standard",
            });
          } else {
            setUser(null);
            setIsGuest(true);
            setProfile(DEFAULT_EMPTY_PROFILE);
          }
        }
      );

      return () => {
        mounted = false;
        authListener.subscription.unsubscribe();
      };
    } catch {
      setIsGuest(true);
      setIsLoading(false);
      setProfile(DEFAULT_EMPTY_PROFILE);
    }
  }, []);

  const signInAsGuest = () => {
    setIsGuest(true);
    setUser(null);
  };

  const signOut = async () => {
    try {
      const supabase = createClient();
      await performSecureLogout(supabase, "/login");
    } catch {
      // Fallback
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  const setPrivateSession = (val: boolean) => {
    setIsPrivateSession(val);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isGuest,
        isLoading,
        isPrivateSession,
        setPrivateSession,
        signInAsGuest,
        signOut,
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
