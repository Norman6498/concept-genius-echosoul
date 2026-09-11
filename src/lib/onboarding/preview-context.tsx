"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

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

  // Load from localStorage on mount
  useEffect(() => {
    try {
      // 1. User name
      const p1 = localStorage.getItem("echosoul_user_personalization");
      if (p1) {
        const parsed1 = JSON.parse(p1);
        if (parsed1.name && parsed1.name.trim()) {
          setUserName(parsed1.name.trim());
        }
      }

      // 2. Preferences
      const p4 = localStorage.getItem("echosoul_user_preferences");
      if (p4) {
        const parsed4 = JSON.parse(p4);
        setPreferences((prev) => ({
          ...prev,
          ...parsed4,
        }));
      }

      // 3. Appearance
      const p5 = localStorage.getItem("echosoul_user_appearance");
      if (p5) {
        const parsed5 = JSON.parse(p5);
        setAppearance((prev) => ({
          ...prev,
          ...parsed5,
        }));
      }
    } catch {
      // Fallback to defaults
    }
  }, []);

  const updatePreferences = useCallback((partial: Partial<OnboardingPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem("echosoul_user_preferences", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

  const updateAppearance = useCallback((partial: Partial<OnboardingAppearance>) => {
    setAppearance((prev) => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem("echosoul_user_appearance", JSON.stringify(updated));
      } catch {
        // Ignore
      }
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
      try {
        localStorage.setItem("echosoul_user_preferences", JSON.stringify(updated));
      } catch {
        // Ignore
      }
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
      try {
        localStorage.setItem("echosoul_user_preferences", JSON.stringify(updated));
      } catch {
        // Ignore
      }
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
