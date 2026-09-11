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

  const supportStyle =
    settings?.support_style ||
    profile?.preferred_support_style ||
    "gentle";

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
      age_range: profile?.age_range || (jsonbPersonalization.age_range as string),
      role: profile?.role || (jsonbPersonalization.role as string),
      avatar_url: profile?.avatar_url,
      onboarding_step: profile?.onboarding_step || (jsonbPersonalization.onboarding_step as number) || 1,
      onboarding_completed: onboardingCompleted,
      created_at: profile?.created_at,
      updated_at: profile?.updated_at,
    },
    interests,
    goals: combinedGoals,
    currentMood,
    overallVibe,
    currentFocus,
    supportStyle,
    literaturePreferences,
    musicPreferences,
    visualPreferences,
    environment,
    onboardingCompleted,
  };
}
