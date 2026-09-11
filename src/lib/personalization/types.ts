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
  support_style?: "gentle" | "balanced" | "direct" | "practical";
  overwhelmed_helper?: "words" | "music" | "talk" | "breathing";
  response_depth?: "concise" | "thoughtful" | "poetic";
  memory_preference?: "remember" | "session_only";
  literature_preferences?: string[];
  music_preferences?: string[];
  visual_preferences?: string[];
  theme?: "midnight_soul" | "sunrise_calm" | "forest_green" | "minimal_light";
  accent_color?: string;
  background_environment?: "cozy_room" | "mountain_view" | "forest_cabin" | "ocean_view" | "city_nights" | "starry_sky";
  layout_mode?: "focused" | "explorative";
  font_style?: "serif" | "sans" | "rounded";
  ambient_animations?: boolean;
  enable_music?: boolean;
  time_based_env?: boolean;
  reduced_motion?: boolean;
}

export interface UserContextData {
  user_id: string;
  life_stage?: string;
  where_you_live?: "city" | "town" | "rural" | "unspecified";
  current_focus?: string;
  custom_focus?: string;
  environment_tone?: "supportive" | "neutral" | "challenging" | "unspecified";
  people_around?: "family" | "friends" | "both" | "mostly_alone" | "unspecified";
  world_notes?: string;
  visual_world?: string; // 12 worlds e.g. "mountain_calm", "forest_retreat", etc.
  daily_schedule?: "early_riser" | "balanced" | "night_owl" | "varies";
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
  customFocus?: string;
  whereYouLive: string;
  environmentTone: string;
  peopleAround: string;
  worldNotes?: string;
  visualWorld: string;
  dailySchedule: string;
  supportStyle: string;
  overwhelmedHelper: string;
  responseDepth: string;
  memoryPreference: string;
  literaturePreferences: string[];
  musicPreferences: string[];
  visualPreferences: string[];
  theme: "midnight_soul" | "sunrise_calm" | "forest_green" | "minimal_light";
  accentColor: string;
  backgroundEnvironment: string;
  layoutMode: "focused" | "explorative";
  fontStyle: "serif" | "sans" | "rounded";
  ambientAnimations: boolean;
  enableMusic: boolean;
  timeBasedEnv: boolean;
  reducedMotion: boolean;
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

export interface HomeThemeConfig {
  environment: string; // e.g. "mountain_calm", "forest_retreat", etc.
  environmentTitle: string;
  theme: "midnight_soul" | "sunrise_calm" | "forest_green" | "minimal_light";
  background: string;
  accent: string;
  lighting: "deep_calm" | "warm_sunlight" | "forest_mist" | "clean_bright";
  timeOfDay: "morning" | "evening" | "night";
  featureImages: string[];
  ambience: string;
  typographyMode: "serif" | "sans" | "rounded";
  quoteStyle: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
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
  homeTheme: HomeThemeConfig;
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
