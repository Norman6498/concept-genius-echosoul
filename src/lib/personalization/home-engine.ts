/**
 * EchoSoul — Dynamic Home Personalization Engine (Server-side)
 * Synthesizes the user's persisted context into an adaptive, cinematic Home experience.
 * Never uses hard-coded demo data. Every recommendation reflects actual user choices.
 */

import { getPersonalizationContext } from "./context";
import type { HomePersonalizationViewModel } from "./types";
import { buildHomeViewModel, type HomePersonalizationInput } from "./view-model";

export { buildHomeViewModel, type HomePersonalizationInput };

export async function getHomePersonalization(userId: string): Promise<HomePersonalizationViewModel> {
  const context = await getPersonalizationContext(userId);
  return buildHomeViewModel({
    name: context.profile.name,
    role: context.profile.role,
    currentMood: context.currentMood,
    currentFocus: context.currentFocus,
    overallVibe: context.overallVibe,
    interests: context.interests.map((i) => i.interest),
    visualWorld: context.visualWorld,
    theme: context.theme,
    backgroundEnvironment: context.backgroundEnvironment as any,
    accentColor: context.accentColor,
    layoutMode: context.layoutMode,
    fontStyle: context.fontStyle,
    dailySchedule: context.dailySchedule,
  });
}
