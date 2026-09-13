import { NextRequest, NextResponse } from "next/server";
import {
  getServerUserEntitlement,
  getUserMusicTrialStatus,
  consumeMusicTrialCredit,
  registerPremiumWaitlist,
} from "@/lib/auth/roles";
import { MusicMeaningAgent } from "@/lib/ai/musicMeaningAgent";
import { MASTER_MUSIC_CATALOG } from "@/lib/content/corpus";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const trackId = searchParams.get("track_id") || "track_hi_03";
    const language = searchParams.get("language") || "en";
    const userMood = searchParams.get("mood") || undefined;

    // 1. Resolve Track in Master Catalog
    const track = MASTER_MUSIC_CATALOG.find((t) => t.id === trackId);
    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    // 2. Server-side Authentication & Session Check
    const entitlement = await getServerUserEntitlement();

    // If user is unauthenticated, return locked preview requiring login
    if (!entitlement.userId) {
      return NextResponse.json({
        isPremium: false,
        locked: true,
        requiresAuth: true,
        isUnlocked: false,
        canUnlock: false,
        trackId: track.id,
        title: track.title,
        artist: track.artist_name,
        accessStatus: {
          userId: null,
          isAdmin: false,
          isPremium: false,
          plan: "free",
          totalCredits: 3,
          usedCredits: 0,
          remainingCredits: 0,
          canAccess: false,
          alreadyUnlocked: false,
          isLocked: true,
          waitlistRequested: false,
        },
        preview: {
          headline: "Unlock the deeper meaning behind every song.",
          description:
            "Solenne analyzes emotional resonance, cultural origin, and lyrical depth through personalized AI insights.",
          cta: "Sign in to try free →",
          upgradeUrl: "/login",
        },
      });
    }

    // 3. Evaluate Server-Authoritative Trial / Entitlement Status
    const trialStatus = await getUserMusicTrialStatus(entitlement.userId, track.id);

    // 4. If Already Unlocked or Premium/Admin: Return Full Hermeneutic Analysis
    if (trialStatus.alreadyUnlocked || trialStatus.isPremium || trialStatus.isAdmin) {
      const pipelineRes = await MusicMeaningAgent.processTrackMeaning(trackId, language, false);

      let personalReflection: string | undefined;
      if (entitlement.userId) {
        personalReflection = await MusicMeaningAgent.getOrCreatePersonalizedReflection(
          trackId,
          entitlement.userId,
          userMood
        );
      }

      return NextResponse.json({
        isPremium: trialStatus.isPremium,
        locked: false,
        isUnlocked: true,
        canUnlock: true,
        trackId: track.id,
        title: track.title,
        artist: track.artist_name,
        accessStatus: trialStatus,
        meaning: pipelineRes.meaning,
        personalReflection,
      });
    }

    // 5. Track Not Yet Unlocked: Free Trial State (Remaining Credits Available or Locked)
    return NextResponse.json({
      isPremium: false,
      locked: trialStatus.isLocked,
      isUnlocked: false,
      canUnlock: trialStatus.canAccess,
      trackId: track.id,
      title: track.title,
      artist: track.artist_name,
      accessStatus: trialStatus,
      preview: {
        headline:
          trialStatus.usedCredits === 0
            ? "Try Meaning & Insight free — 3 times."
            : `Discover what "${track.title}" may be saying beneath the surface.`,
        description:
          trialStatus.remainingCredits > 0
            ? `Your first 3 deep song insights are on us. ${trialStatus.remainingCredits} free insight${
                trialStatus.remainingCredits === 1 ? "" : "s"
              } remaining.`
            : "You've explored 3 songs deeply. Meaning & Insight is part of Solenne Premium, which is coming soon.",
        cta:
          trialStatus.remainingCredits > 0
            ? "Explore the meaning →"
            : "Notify me when Premium is available",
        upgradeUrl: "/pricing",
      },
    });
  } catch (err: unknown) {
    console.error("[API Meaning GET] Error:", err);
    return NextResponse.json(
      { error: "Failed to process song meaning" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const entitlement = await getServerUserEntitlement();
    if (!entitlement.userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action = "unlock", track_id: trackId, language = "en", force_regenerate = false } = body;

    // ── Handle Waitlist Intent ─────────────────────────────────────
    if (action === "waitlist") {
      const waitlistRes = await registerPremiumWaitlist(entitlement.userId, "music_meaning_premium");
      const updatedStatus = await getUserMusicTrialStatus(entitlement.userId, trackId);
      return NextResponse.json({
        success: waitlistRes.success,
        message: waitlistRes.message,
        accessStatus: updatedStatus,
      });
    }

    // ── Handle Unlock Meaning ──────────────────────────────────────
    if (!trackId) {
      return NextResponse.json({ error: "Missing track_id" }, { status: 400 });
    }

    // 1. Check entitlement BEFORE starting expensive generation
    const currentStatus = await getUserMusicTrialStatus(entitlement.userId, trackId);
    if (!currentStatus.canAccess && !currentStatus.alreadyUnlocked && !currentStatus.isPremium && !currentStatus.isAdmin) {
      return NextResponse.json(
        {
          error: "You have used all 3 free insights. Premium is coming soon.",
          locked: true,
          remaining: 0,
          accessStatus: currentStatus,
        },
        { status: 403 }
      );
    }

    // 2. Generate or fetch canonical song meaning
    const pipelineRes = await MusicMeaningAgent.processTrackMeaning(
      trackId,
      language,
      Boolean(force_regenerate && entitlement.isAdmin)
    );

    if (!pipelineRes.success || !pipelineRes.meaning) {
      return NextResponse.json(
        { error: "Failed to extract grounded song meaning. No credit was deducted." },
        { status: 500 }
      );
    }

    // 3. Atomically consume credit only AFTER successful experience is confirmed
    const consumeRes = await consumeMusicTrialCredit(entitlement.userId, trackId);

    // 4. Generate user's isolated personal reflection
    const personalReflection = await MusicMeaningAgent.getOrCreatePersonalizedReflection(
      trackId,
      entitlement.userId
    );

    // 5. Fetch updated trial status
    const updatedStatus = await getUserMusicTrialStatus(entitlement.userId, trackId);

    return NextResponse.json({
      success: true,
      isPremium: updatedStatus.isPremium,
      locked: false,
      isUnlocked: true,
      creditConsumed: consumeRes.creditConsumed,
      accessStatus: updatedStatus,
      meaning: pipelineRes.meaning,
      personalReflection,
    });
  } catch (err: unknown) {
    console.error("[API Meaning POST] Error:", err);
    return NextResponse.json(
      { error: "Internal generation failure" },
      { status: 500 }
    );
  }
}
