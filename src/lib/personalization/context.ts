/**
 * EchoSoul — Personalization Context Service
 * Server-side data layer fetching the user's unified personalization context.
 * Strictly respects user separation and RLS.
 */

import { createServiceClient } from "@/lib/supabase/server";
import type { PersonalizationContext, UserInterestRecord } from "./types";

export async function getPersonalizationContext(userId: string): Promise<PersonalizationContext> {
  if (!userId) {
    throw new Error("userId is required to resolve personalization context.");
  }

  // Use service client on the server to retrieve consolidated state
  const supabase = createServiceClient();

  const [
    profileRes,
    settingsRes,
    interestsRes,
    goalsRes,
    stateRes,
    contextRes,
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("user_settings").select("*").eq("user_id", userId).single(),
    supabase.from("user_interests").select("category, interest").eq("user_id", userId),
    supabase.from("user_goals").select("goal").eq("user_id", userId),
    supabase.from("current_user_state").select("*").eq("user_id", userId).single(),
    supabase.from("user_context").select("*").eq("user_id", userId).single(),
  ]);

  const profile = profileRes.data;
  const settings = settingsRes.data;
  const interests: UserInterestRecord[] = (interestsRes.data as UserInterestRecord[]) || [];
  const goalsData = (goalsRes.data as { goal: string }[]) || [];
  const state = stateRes.data;
  const userCtx = contextRes.data;

  // Resolve goals from user_goals table or fallback profile.goals array
  const combinedGoals = goalsData.length > 0
    ? goalsData.map((g) => g.goal)
    : (profile?.goals as string[]) || [];

  // Resolve user settings / personalization fallback jsonb
  const jsonbPersonalization = (settings?.personalization || {}) as Record<string, unknown>;

  const currentMood =
    state?.current_mood ||
    profile?.current_mood ||
    (jsonbPersonalization.current_mood as string) ||
    "calm";

  const overallVibe =
    state?.overall_vibe ||
    (jsonbPersonalization.overall_vibe as string) ||
    "Creative";

  const currentFocus =
    userCtx?.current_focus ||
    profile?.current_focus ||
    (jsonbPersonalization.current_focus as string) ||
    "exploring";

  const customFocus = userCtx?.custom_focus || undefined;

  const whereYouLive = userCtx?.where_you_live || "unspecified";
  const environmentTone = userCtx?.environment_tone || "supportive";
  const peopleAround = userCtx?.people_around || "family";
  const worldNotes = userCtx?.world_notes || undefined;
  const visualWorld = userCtx?.visual_world || "mountain_calm";
  const dailySchedule = userCtx?.daily_schedule || "balanced";

  const supportStyle =
    settings?.support_style ||
    profile?.preferred_support_style ||
    "balanced";

  const overwhelmedHelper = settings?.overwhelmed_helper || "words";
  const responseDepth = settings?.response_depth || "thoughtful";
  const memoryPreference = settings?.memory_preference || "remember";

  const theme = (settings?.theme as "midnight_soul" | "sunrise_calm" | "forest_green" | "minimal_light") || "midnight_soul";
  const accentColor = settings?.accent_color || "#F2D78A";
  const backgroundEnvironment = settings?.background_environment || "cozy_room";
  const layoutMode = (settings?.layout_mode as "focused" | "explorative") || "focused";
  const fontStyle = (settings?.font_style as "serif" | "sans" | "rounded") || "serif";
  const ambientAnimations = settings?.ambient_animations !== undefined ? settings.ambient_animations : true;
  const enableMusic = settings?.enable_music !== undefined ? settings.enable_music : false;
  const timeBasedEnv = settings?.time_based_env !== undefined ? settings.time_based_env : true;
  const reducedMotion = settings?.reduced_motion !== undefined ? settings.reduced_motion : false;

  const literaturePreferences =
    settings?.literature_preferences ||
    (jsonbPersonalization.literature_preferences as string[]) ||
    ["poetry", "philosophy", "books"];

  const musicPreferences =
    settings?.music_preferences ||
    (jsonbPersonalization.music_preferences as string[]) ||
    ["calm", "ambient", "instrumental"];

  const visualPreferences =
    (settings?.visual_preferences as string[]) ||
    (jsonbPersonalization.visual_preferences as string[]) ||
    ["night", "mountains", "rain"];

  const environment =
    settings?.environment ||
    (jsonbPersonalization.environment as string) ||
    "twilight_mountain";

  const onboardingCompleted =
    profile?.onboarding_completed ||
    Boolean(jsonbPersonalization.onboarding_completed) ||
    false;

  const displayName =
    profile?.display_name ||
    (jsonbPersonalization.name as string) ||
    "Friend";

  return {
    profile: {
      id: userId,
      name: displayName,
      age_range: profile?.age_range || undefined,
      role: profile?.role || undefined,
      avatar_url: profile?.avatar_url || undefined,
      onboarding_step: profile?.onboarding_step || 1,
      onboarding_completed: onboardingCompleted,
      created_at: profile?.created_at,
      updated_at: profile?.updated_at,
    },
    interests,
    goals: combinedGoals,
    currentMood,
    overallVibe,
    currentFocus,
    customFocus,
    whereYouLive,
    environmentTone,
    peopleAround,
    worldNotes,
    visualWorld,
    dailySchedule,
    supportStyle,
    overwhelmedHelper,
    responseDepth,
    memoryPreference,
    literaturePreferences,
    musicPreferences,
    visualPreferences,
    theme,
    accentColor,
    backgroundEnvironment,
    layoutMode,
    fontStyle,
    ambientAnimations,
    enableMusic,
    timeBasedEnv,
    reducedMotion,
    onboardingCompleted,
  };
}
