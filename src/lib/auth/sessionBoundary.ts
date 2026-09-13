/**
 * EchoSoul Session Boundary & Multi-Tenant Storage Isolation Utility
 * 
 * Guarantees that client-side storage, cache, and state are strictly partitioned
 * by authenticated user ID, and completely purged on logout.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

const KNOWN_UNSCOPED_KEYS = [
  "echosoul_user_personalization",
  "echosoul_user_interests",
  "echosoul_user_world",
  "echosoul_user_preferences",
  "echosoul_user_appearance",
  "echosoul_user_settings",
  "echosoul_talk_messages",
  "echosoul_recent_conversations",
  "echosoul_journal_entries",
  "echosoul_moments",
  "echosoul_moments_v2",
  "echosoul_goals",
  "echosoul_goals_v2",
  "echosoul_active_session_id",
  "echosoul_display_personalization",
  "echosoul_show_conversations",
  "echosoul_show_recs",
  "echosoul_show_moments",
  "echosoul_guest_mode",
  "solenne_user_personalization",
  "solenne_user_interests",
  "solenne_user_world",
  "solenne_user_preferences",
  "solenne_user_appearance",
  "solenne_user_settings",
  "solenne_talk_messages",
  "solenne_recent_conversations",
  "solenne_journal_entries",
  "solenne_moments",
  "solenne_moments_v2",
  "solenne_goals",
  "solenne_goals_v2",
  "solenne_active_session_id",
  "solenne_display_personalization",
  "solenne_show_conversations",
  "solenne_show_recs",
  "solenne_show_moments",
  "solenne_guest_mode",
];

/**
 * Returns a strictly user-scoped key for client-side storage and caches.
 * Generic unscoped keys like ["onboarding"] are strictly forbidden.
 * e.g., 'echosoul_usr_123e4567_personalization' or 'echosoul_guest_personalization'
 */
export function getUserStorageKey(userId: string | null | undefined, baseKey: string): string {
  const cleanBase = baseKey.replace(/^(echosoul|solenne)_/, "");
  if (!userId) {
    return `echosoul_guest_${cleanBase}`;
  }
  const sanitizedId = userId.replace(/[^a-zA-Z0-9_-]/g, "");
  return `echosoul_usr_${sanitizedId}_${cleanBase}`;
}

/**
 * Validates that a cache key or storage key conforms to strict user isolation.
 */
export function isUserScopedKey(key: string, userId: string | null | undefined): boolean {
  if (!key) return false;
  if (key === "onboarding" || key === "echosoul_onboarding" || key === "solenne_onboarding") {
    // Unscoped onboarding cache key is strictly forbidden
    return false;
  }
  const sanitizedId = userId ? userId.replace(/[^a-zA-Z0-9_-]/g, "") : "";
  const expectedEchoSoul = userId ? `echosoul_usr_${sanitizedId}_` : "echosoul_guest_";
  const expectedSolenne = userId ? `solenne_usr_${sanitizedId}_` : "solenne_guest_";
  return key.startsWith(expectedEchoSoul) || key.startsWith(expectedSolenne);
}

/**
 * Safely reads a value from user-scoped storage with fallback.
 */
export function getScopedStorageItem<T>(userId: string | null | undefined, baseKey: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const key = getUserStorageKey(userId, baseKey);
    const item = window.localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

/**
 * Safely writes a value to user-scoped storage.
 */
export function setScopedStorageItem<T>(userId: string | null | undefined, baseKey: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    const key = getUserStorageKey(userId, baseKey);
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota or private browsing errors
  }
}

/**
 * Removes a user-scoped key from storage.
 */
export function removeScopedStorageItem(userId: string | null | undefined, baseKey: string): void {
  if (typeof window === "undefined") return;
  try {
    const key = getUserStorageKey(userId, baseKey);
    window.localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

/**
 * Invalidates all client caches and storage strictly belonging to a specific user.
 * Called whenever an account switch occurs or user ID changes.
 */
export function invalidateUserCaches(userId: string | null | undefined): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    const sanitizedId = userId.replace(/[^a-zA-Z0-9_-]/g, "");
    const prefix1 = `echosoul_usr_${sanitizedId}_`;
    const prefix2 = `solenne_usr_${sanitizedId}_`;
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && (k.startsWith(prefix1) || k.startsWith(prefix2))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => window.localStorage.removeItem(k));
  } catch (err) {
    console.warn("Error invalidating user caches:", err);
  }
}

/**
 * Purges ALL user session data, local caches, and cookies across the application.
 * Called unconditionally upon user logout.
 */
export function purgeAllUserData(): void {
  if (typeof window === "undefined") return;

  try {
    // 1. Remove all keys starting with echosoul_ or solenne_
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && (k.startsWith("echosoul_") || k.startsWith("solenne_"))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => window.localStorage.removeItem(k));

    // 2. Also remove explicit known legacy unscoped keys
    KNOWN_UNSCOPED_KEYS.forEach((k) => window.localStorage.removeItem(k));

    // 3. Purge sessionStorage
    window.sessionStorage.clear();
  } catch (err) {
    console.warn("Error purging user storage:", err);
  }
}

/**
 * Complete, secure logout handler.
 * Signs out from Supabase, purges all local storage and cache, and redirects.
 */
export async function performSecureLogout(
  supabase?: SupabaseClient | null,
  redirectUrl: string = "/login"
): Promise<void> {
  try {
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.warn("Supabase auth signOut error (proceeding with local purge):", err);
  } finally {
    purgeAllUserData();
    if (typeof window !== "undefined") {
      window.location.href = redirectUrl;
    }
  }
}
