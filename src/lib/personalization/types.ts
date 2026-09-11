/**
 * EchoSoul — Personalization System Types
 * Strictly typed definitions for Onboarding, Supabase Persistence, and Dynamic Home Engine.
 */

export interface UserProfileData {
  id: string;
  name: string;
  age_range?: string;
  role?: string;
  avatar_url?: string;
  onboarding_step: number;
  onboarding_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserInterestRecord {
  category: "subjects_learning" | "creative" | "wellness" | "entertainment" | "custom";
  interest: string;
}

export interface UserSettingsData {
  user_id: string;
  support_style?: "gentle" | "balanced" | "direct" | "tough_when_needed" | "reflective" | "practical" | "curious" | "motivational";
  response_style?: "listen_first" | "concise" | "detailed" | "ask_questions" | "give_practical_steps" | "show_multiple_perspectives";
  literature_preferences?: string[];
  music_preferences?: string[];
  visual_preferences?: string[];
  theme?: string;
  environment?: string;
  reduced_motion?: boolean;
}

export interface UserContextData {
  user_id: string;
  life_stage?: string;
  current_focus?: string;
  aspirations?: string;
  context?: string;
  custom_interests?: string;
}

export interface CurrentUserStateData {
  user_id: string;
  current_mood?: "calm" | "happy" | "neutral" | "anxious" | "sad" | "stressed" | "motivated" | "tired";
  overall_vibe?: string;
  updated_at?: string;
}

export interface PersonalizationContext {
  profile: UserProfileData;
  interests: UserInterestRecord[];
  goals: string[];
  currentMood: string;
  overallVibe: string;
  currentFocus: string;
  supportStyle: string;
  literaturePreferences: string[];
  musicPreferences: string[];
  visualPreferences: string[];
  environment: string;
  onboardingCompleted: boolean;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  accent?: string;
}

export interface HomePersonalizationViewModel {
  userName: string;
  timeOfDayGreeting: string;
  heroGreeting: string;
  heroMessage: string;
  currentMood: string;
  overallVibe: string;
  currentFocus: string;
  primaryAction: ActionItem;
  secondaryActions: ActionItem[];
  recommendedFeatures: {
    id: string;
    title: string;
    badge?: string;
    description: string;
    href: string;
    accentColor: string;
  }[];
  recommendedWords: {
    title: string;
    author: string;
    excerpt: string;
    category: string;
    href: string;
  };
  recommendedMusic: {
    title: string;
    vibe: string;
    duration: string;
    category: string;
  };
  visualAtmosphere: {
    scene: string;
    environmentTitle: string;
    backgroundImage: string;
    ambientColor: string;
  };
  checkInSuggestion: string;
  journeyHighlight?: string;
}
