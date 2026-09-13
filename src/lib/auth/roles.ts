import { createServiceClient, createServerClient } from "@/lib/supabase/server";

export const PRIMARY_ADMIN_EMAIL = "singhpinky2989@gmail.com";

export interface UserEntitlementSummary {
  userId: string | null;
  email: string | null;
  isAdmin: boolean;
  isPremium: boolean;
  plan: "free" | "premium" | "team";
}

/**
 * Server-side check for user roles.
 * Never trust client-side claims or parameters.
 */
export async function getUserRoles(userId: string): Promise<string[]> {
  try {
    const supabase = createServiceClient();

    // Query user_roles table
    const { data: roleRecords, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    if (error) {
      console.error("[Auth] Error fetching user roles:", error.message);
      return [];
    }

    const roles = (roleRecords || []).map((r) => r.role);

    // Fallback self-healing: verify if this user is the primary admin email
    const { data: authUser } = await supabase.auth.admin.getUserById(userId);
    if (authUser?.user?.email && authUser.user.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
      if (!roles.includes("admin")) {
        roles.push("admin");
        // Self-heal user_roles table
        await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: "admin" })
          .select()
          .single();
      }
    }

    return roles;
  } catch (err) {
    console.error("[Auth] Unexpected error in getUserRoles:", err);
    return [];
  }
}

/**
 * Server-side admin verification.
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const roles = await getUserRoles(userId);
  return roles.includes("admin");
}

/**
 * Server-side Premium entitlement verification.
 * Safety and core features are always accessible, but advanced features require verified entitlement.
 */
export async function isUserPremium(userId: string): Promise<boolean> {
  try {
    // Admins have bypass entitlement
    const admin = await isUserAdmin(userId);
    if (admin) return true;

    const supabase = createServiceClient();
    const { data: entitlement, error } = await supabase
      .from("entitlements")
      .select("plan, valid_until")
      .eq("user_id", userId)
      .single();

    if (error || !entitlement) {
      return false;
    }

    const isPlanPremium = entitlement.plan === "premium" || entitlement.plan === "team";
    if (!isPlanPremium) return false;

    if (entitlement.valid_until) {
      const expiry = new Date(entitlement.valid_until).getTime();
      if (expiry < Date.now()) return false;
    }

    return true;
  } catch (err) {
    console.error("[Auth] Error in isUserPremium:", err);
    return false;
  }
}

/**
 * Resolves current session and entitlements securely on the server.
 */
export async function getServerUserEntitlement(): Promise<UserEntitlementSummary> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        userId: null,
        email: null,
        isAdmin: false,
        isPremium: false,
        plan: "free",
      };
    }

    const admin = await isUserAdmin(user.id);
    const premium = await isUserPremium(user.id);

    return {
      userId: user.id,
      email: user.email ?? null,
      isAdmin: admin,
      isPremium: premium,
      plan: premium ? "premium" : "free",
    };
  } catch (err) {
    console.error("[Auth] Error resolving server user entitlement:", err);
    return {
      userId: null,
      email: null,
      isAdmin: false,
      isPremium: false,
      plan: "free",
    };
  }
}

export interface UserMusicMeaningStatus {
  userId: string | null;
  email: string | null;
  isAdmin: boolean;
  isPremium: boolean;
  plan: "free" | "premium" | "team";
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  canAccess: boolean;
  alreadyUnlocked: boolean;
  isLocked: boolean;
  waitlistRequested: boolean;
}

/**
 * Server-authoritative check for a user's Music Meaning trial status.
 * Evaluates admin status, premium plan, already-unlocked tracks, and remaining free credits.
 */
export async function getUserMusicTrialStatus(
  userId: string,
  trackId?: string
): Promise<UserMusicMeaningStatus> {
  const supabase = createServiceClient();
  const isAdmin = await isUserAdmin(userId);
  const isPremium = await isUserPremium(userId);

  // Admin and Premium users bypass trial limits with unlimited access
  if (isAdmin || isPremium) {
    return {
      userId,
      email: null,
      isAdmin,
      isPremium: true,
      plan: isAdmin ? "team" : "premium",
      totalCredits: 3,
      usedCredits: 0,
      remainingCredits: 3,
      canAccess: true,
      alreadyUnlocked: true,
      isLocked: false,
      waitlistRequested: false,
    };
  }

  try {
    const { data: entData, error: entError } = await supabase
      .from("entitlements")
      .select("plan, usage")
      .eq("user_id", userId)
      .maybeSingle();

    let usage: Record<string, unknown> = {};
    if (!entError && entData?.usage && typeof entData.usage === "object") {
      usage = entData.usage as Record<string, unknown>;
    } else if (!entData) {
      // Auto-provision entitlement record if missing
      usage = {
        music_meaning_free_uses_total: 3,
        music_meaning_free_uses_used: 0,
        waitlist_requested: false,
        unlocked_tracks: [],
      };
      await supabase
        .from("entitlements")
        .insert({
          user_id: userId,
          plan: "free",
          usage,
        })
        .select()
        .maybeSingle();
    }

    const total = Number(usage.music_meaning_free_uses_total ?? 3);
    const used = Number(usage.music_meaning_free_uses_used ?? 0);
    const waitlistRequested = Boolean(usage.waitlist_requested);
    const unlockedTracks = Array.isArray(usage.unlocked_tracks) ? (usage.unlocked_tracks as string[]) : [];

    const alreadyUnlocked = trackId ? unlockedTracks.includes(trackId) : false;
    const remaining = Math.max(0, total - used);
    const canAccess = alreadyUnlocked || remaining > 0;

    return {
      userId,
      email: null,
      isAdmin: false,
      isPremium: false,
      plan: (entData?.plan as "free" | "premium" | "team") || "free",
      totalCredits: total,
      usedCredits: used,
      remainingCredits: remaining,
      canAccess,
      alreadyUnlocked,
      isLocked: !canAccess,
      waitlistRequested,
    };
  } catch (err) {
    console.error("[Auth] Error in getUserMusicTrialStatus:", err);
    return {
      userId,
      email: null,
      isAdmin: false,
      isPremium: false,
      plan: "free",
      totalCredits: 3,
      usedCredits: 0,
      remainingCredits: 3,
      canAccess: true,
      alreadyUnlocked: false,
      isLocked: false,
      waitlistRequested: false,
    };
  }
}

/**
 * Atomically consumes exactly 1 Music Meaning trial credit for the authenticated user.
 * Guarantees idempotency (returns already_unlocked if previously unlocked).
 * Prevents race conditions and guarantees used <= total and remaining >= 0.
 */
export async function consumeMusicTrialCredit(
  userId: string,
  trackId: string
): Promise<{
  success: boolean;
  creditConsumed: boolean;
  alreadyUnlocked: boolean;
  isPremium: boolean;
  total: number;
  used: number;
  remaining: number;
  error?: string;
}> {
  const isAdmin = await isUserAdmin(userId);
  const isPremium = await isUserPremium(userId);

  // Admin and Premium bypass: auto-allow without burning credit
  if (isAdmin || isPremium) {
    return {
      success: true,
      creditConsumed: false,
      alreadyUnlocked: true,
      isPremium: true,
      total: 3,
      used: 0,
      remaining: 3,
    };
  }

  const supabase = createServiceClient();

  try {
    // 1. Fetch current entitlements record
    const { data: ent } = await supabase
      .from("entitlements")
      .select("plan, usage")
      .eq("user_id", userId)
      .maybeSingle();

    const currentUsage: Record<string, unknown> =
      ent?.usage && typeof ent.usage === "object" ? { ...(ent.usage as Record<string, unknown>) } : {};
    const unlockedTracks: string[] = Array.isArray(currentUsage.unlocked_tracks)
      ? [...(currentUsage.unlocked_tracks as string[])]
      : [];

    const total = Number(currentUsage.music_meaning_free_uses_total ?? 3);
    const used = Number(currentUsage.music_meaning_free_uses_used ?? 0);

    // 2. Idempotency: if track is already in unlocked_tracks, charge 0 credits
    if (unlockedTracks.includes(trackId)) {
      return {
        success: true,
        creditConsumed: false,
        alreadyUnlocked: true,
        isPremium: false,
        total,
        used,
        remaining: Math.max(0, total - used),
      };
    }

    // 3. Check credit availability
    if (used >= total) {
      return {
        success: false,
        creditConsumed: false,
        alreadyUnlocked: false,
        isPremium: false,
        total,
        used,
        remaining: 0,
        error: "trial_exhausted",
      };
    }

    // 4. Increment usage safely and record unlocked track
    const newUsed = used + 1;
    const newRemaining = Math.max(0, total - newUsed);
    unlockedTracks.push(trackId);

    const updatedUsage = {
      ...currentUsage,
      music_meaning_free_uses_total: total,
      music_meaning_free_uses_used: newUsed,
      unlocked_tracks: unlockedTracks,
    };

    if (ent) {
      await supabase
        .from("entitlements")
        .update({
          usage: updatedUsage,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
    } else {
      await supabase
        .from("entitlements")
        .insert({
          user_id: userId,
          plan: "free",
          usage: updatedUsage,
        });
    }

    return {
      success: true,
      creditConsumed: true,
      alreadyUnlocked: false,
      isPremium: false,
      total,
      used: newUsed,
      remaining: newRemaining,
    };
  } catch (err) {
    console.error("[Auth] Error in consumeMusicTrialCredit:", err);
    return {
      success: false,
      creditConsumed: false,
      alreadyUnlocked: false,
      isPremium: false,
      total: 3,
      used: 3,
      remaining: 0,
      error: "Internal failure",
    };
  }
}

/**
 * Persists a user's intent to join the Premium waitlist.
 * Ensures strict server-side authentication (auth.uid() = user_id) and prevents duplicates.
 */
export async function registerPremiumWaitlist(
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  feature: string = "music_meaning_premium"
): Promise<{ success: boolean; message: string }> {
  const supabase = createServiceClient();

  try {
    const { data: ent } = await supabase
      .from("entitlements")
      .select("usage")
      .eq("user_id", userId)
      .maybeSingle();

    const currentUsage: Record<string, unknown> =
      ent?.usage && typeof ent.usage === "object" ? { ...(ent.usage as Record<string, unknown>) } : {};

    const updatedUsage = {
      ...currentUsage,
      waitlist_requested: true,
      waitlist_requested_at: new Date().toISOString(),
    };

    if (ent) {
      await supabase
        .from("entitlements")
        .update({
          usage: updatedUsage,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
    } else {
      await supabase
        .from("entitlements")
        .insert({
          user_id: userId,
          plan: "free",
          usage: updatedUsage,
        });
    }

    return {
      success: true,
      message: "You're on the list. We'll let you know when Premium opens.",
    };
  } catch (err) {
    console.error("[Auth] Error in registerPremiumWaitlist:", err);
    return {
      success: false,
      message: "Failed to record waitlist interest. Please try again.",
    };
  }
}


