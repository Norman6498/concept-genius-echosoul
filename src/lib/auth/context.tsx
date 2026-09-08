"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOCK_USER, type MockUserProfile } from "@/lib/mocks/data";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  profile: MockUserProfile;
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
  const [isGuest, setIsGuest] = useState<boolean>(true); // Default to guest demo for Stage 1 instant preview
  const [profile, setProfile] = useState<MockUserProfile>(MOCK_USER);
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
          setProfile((prev) => ({
            ...prev,
            id: currentUser.id,
            name: currentUser.user_metadata?.display_name || currentUser.email?.split("@")[0] || "Friend",
          }));
        } else {
          // If no active session, check localStorage for guest preference
          const savedGuest = localStorage.getItem("echosoul_guest_mode");
          if (savedGuest === "false") {
            setIsGuest(false);
          } else {
            setIsGuest(true);
          }
        }
        setIsLoading(false);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (!mounted) return;
          if (session?.user) {
            setUser(session.user);
            setIsGuest(false);
          } else {
            setUser(null);
          }
        }
      );

      return () => {
        mounted = false;
        authListener.subscription.unsubscribe();
      };
    } catch {
      // In local dev without configured Supabase URL, fallback cleanly to Guest
      setIsGuest(true);
      setIsLoading(false);
    }
  }, []);

  const signInAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem("echosoul_guest_mode", "true");
  };

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    setUser(null);
    setIsGuest(true);
    localStorage.removeItem("echosoul_guest_mode");
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
