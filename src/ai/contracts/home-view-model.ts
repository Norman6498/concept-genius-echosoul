/**
 * EchoSoul Home View Model
 * 
 * This is the typed object that GET /api/home returns. The Home UI
 * renders only from this — NEVER from raw Supabase rows or model output.
 * All recommendations are personalized per authenticated user.
 * 
 * @version echosoul_home_view_model_v1
 */

export interface UserAppearance {
  theme: "midnight_soul" | "sunrise_calm" | "forest_green" | "minimal_light";
  environment: "mountain_calm" | "forest_retreat" | "ocean_breeze" | "city_lights" | "starry_skies" | "cozy_room" | string;
  accent_color: string;
  reduced_motion: boolean;
}

export interface BookRecommendation {
  title: string;
  author: string;
  cover_image: string;
  reason: string;
  category: string;
}

export interface MusicRecommendation {
  title: string;
  genre: string;
  duration_min: number;
  mood_tags: string[];
  thumbnail?: string;
  reason: string;
}

export interface VisualRecommendation {
  title: string;
  description: string;
  image: string;
  environment: string;
}

export interface GuidanceRecommendation {
  title: string;
  description: string;
  category: string;
}

export interface RecentConversation {
  id: string;
  preview: string;
  timestamp: string;
  has_moment: boolean;
}

export interface MomentCard {
  id: string;
  title: string;
  date: string;
  thumbnail?: string;
}

export interface JourneyItem {
  type: "goals" | "emotions" | "reflections" | "life_novel";
  label: string;
  value: string;
  href: string;
}

export interface ThoughtLetter {
  visible: boolean;
  title: string;
  body: string;
  meaning: string;
  why_this_matters: string;
  author?: string;
  work?: string;
}

export interface DailyCheckIn {
  completed: boolean;
  mood?: string;
}

export interface HomeDisplaySettings {
  show_conversations: boolean;
  show_recommendations: boolean;
  show_moments_journey: boolean;
}

/**
 * The complete Home View Model.
 * Built server-side from Supabase user data + AI personalization engine.
 * Every field here is specific to the authenticated user.
 */
export interface HomeViewModel {
  user: {
    id: string;
    name: string;
    role: string;
    avatar_initial: string;
  };

  appearance: UserAppearance;

  greeting: {
    time_of_day: "morning" | "afternoon" | "evening" | "night";
    title: string;
    subtitle: string;
  };

  /** The deckled parchment "thought" card on the hero. */
  thought_letter: ThoughtLetter;

  /** Quick prompt suggestions in the talk bar. */
  quick_actions: Array<{
    label: string;
    query: string;
    icon: string;
  }>;

  recommendations: {
    book: BookRecommendation | null;
    music: MusicRecommendation | null;
    visual: VisualRecommendation | null;
    guidance: GuidanceRecommendation | null;
  };

  recent_conversations: RecentConversation[];

  moments: MomentCard[];

  journey: JourneyItem[];

  daily_check_in: DailyCheckIn;

  display_settings: HomeDisplaySettings;

  /** ISO 8601 timestamp when this view model was generated. */
  generated_at: string;
}
