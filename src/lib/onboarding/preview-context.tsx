"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getScopedStorageItem, setScopedStorageItem } from "@/lib/auth/sessionBoundary";

export type CommunicationStyle = "warm" | "calm" | "direct" | "deep" | "light";
export type ResponseLength = "short" | "balanced" | "detailed" | "varies";
export type ThemeMode = "midnight_soul" | "sunrise_calm" | "forest_green" | "minimal_light";
export type AccentColor = "gold" | "purple" | "blue" | "green" | "pink" | "orange" | "red" | "gray";
export type BackgroundEnvironment =
  | "cozy_room"
  | "mountain_view"
  | "forest_cabin"
  | "ocean_view"
  | "city_nights"
  | "starry_sky";
export type LayoutMode = "focused" | "explorative";
export type FontStyle = "serif" | "sans" | "rounded";

export interface OnboardingPreferences {
  communicationStyle: CommunicationStyle;
  responseLength: ResponseLength;
  selectedTopics: string[];
  customTopic?: string;
  avoidedTopics: string[];
  customAvoid?: string;
  musicRecommendations: boolean;
  visualExperiences: boolean;
  bookRecommendations: boolean;
  journeyTracking: boolean;
  gentleReminders: boolean;
  languageSupport: boolean;
  privacyPreference: boolean;
}

export interface OnboardingAppearance {
  theme: ThemeMode;
  accentColor: AccentColor;
  backgroundEnvironment: BackgroundEnvironment;
  layout: LayoutMode;
  fontStyle: FontStyle;
  ambientAnimations: boolean;
  backgroundMusic: boolean;
  timeBasedEnvironment: boolean;
  reducedMotion: boolean;
}

export interface OnboardingPreviewContextType {
  preferences: OnboardingPreferences;
  appearance: OnboardingAppearance;
  userName: string;
  updatePreferences: (partial: Partial<OnboardingPreferences>) => void;
  updateAppearance: (partial: Partial<OnboardingAppearance>) => void;
  toggleTopic: (topic: string) => void;
  toggleAvoided: (topic: string) => void;
}

const DEFAULT_PREFERENCES: OnboardingPreferences = {
  communicationStyle: "warm",
  responseLength: "balanced",
  selectedTopics: ["motivation", "stories_writing", "creativity"],
  customTopic: "",
  avoidedTopics: ["heavy_negativity"],
  customAvoid: "",
  musicRecommendations: true,
  visualExperiences: true,
  bookRecommendations: true,
  journeyTracking: false,
  gentleReminders: false,
  languageSupport: false,
  privacyPreference: true,
};

const DEFAULT_APPEARANCE: OnboardingAppearance = {
  theme: "midnight_soul",
  accentColor: "gold",
  backgroundEnvironment: "cozy_room",
  layout: "focused",
  fontStyle: "serif",
  ambientAnimations: true,
  backgroundMusic: false,
  timeBasedEnvironment: true,
  reducedMotion: false,
};

const OnboardingPreviewContext = createContext<OnboardingPreviewContextType | undefined>(undefined);

export function OnboardingPreviewProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<OnboardingPreferences>(DEFAULT_PREFERENCES);
  const [appearance, setAppearance] = useState<OnboardingAppearance>(DEFAULT_APPEARANCE);
  const [userName, setUserName] = useState<string>("Friend");
  const userIdRef = useRef<string | null>(null);

  // Load from user-scoped storage on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!isMounted) return;

        userIdRef.current = user?.id || null;

        // 1. User name
        const p1 = getScopedStorageItem<any>(user?.id, "personalization", null);
        if (user?.user_metadata?.display_name) {
          setUserName(user.user_metadata.display_name);
        } else if (p1?.name && p1.name.trim()) {
          setUserName(p1.name.trim());
        }

        // 2. Preferences
        const p4 = getScopedStorageItem<any>(user?.id, "preferences", null);
        if (p4) {
          setPreferences((prev) => ({
            ...prev,
            ...p4,
          }));
        }

        // 3. Appearance
        const p5 = getScopedStorageItem<any>(user?.id, "appearance", null);
        if (p5) {
          setAppearance((prev) => ({
            ...prev,
            ...p5,
          }));
        }
      } catch {
        // Fallback to defaults
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const updatePreferences = useCallback((partial: Partial<OnboardingPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...partial };
      setScopedStorageItem(userIdRef.current, "preferences", updated);
      return updated;
    });
  }, []);

  const updateAppearance = useCallback((partial: Partial<OnboardingAppearance>) => {
    setAppearance((prev) => {
      const updated = { ...prev, ...partial };
      setScopedStorageItem(userIdRef.current, "appearance", updated);
      return updated;
    });
  }, []);

  const toggleTopic = useCallback((topic: string) => {
    setPreferences((prev) => {
      const exists = prev.selectedTopics.includes(topic);
      const nextTopics = exists
        ? prev.selectedTopics.filter((t) => t !== topic)
        : [...prev.selectedTopics, topic];
      const updated = { ...prev, selectedTopics: nextTopics };
      setScopedStorageItem(userIdRef.current, "preferences", updated);
      return updated;
    });
  }, []);

  const toggleAvoided = useCallback((topic: string) => {
    setPreferences((prev) => {
      const exists = prev.avoidedTopics.includes(topic);
      const nextAvoided = exists
        ? prev.avoidedTopics.filter((t) => t !== topic)
        : [...prev.avoidedTopics, topic];
      const updated = { ...prev, avoidedTopics: nextAvoided };
      setScopedStorageItem(userIdRef.current, "preferences", updated);
      return updated;
    });
  }, []);

  return (
    <OnboardingPreviewContext.Provider
      value={{
        preferences,
        appearance,
        userName,
        updatePreferences,
        updateAppearance,
        toggleTopic,
        toggleAvoided,
      }}
    >
      {children}
    </OnboardingPreviewContext.Provider>
  );
}

export function useOnboardingPreview() {
  const context = useContext(OnboardingPreviewContext);
  if (!context) {
    throw new Error("useOnboardingPreview must be used within an OnboardingPreviewProvider");
  }
  return context;
}
