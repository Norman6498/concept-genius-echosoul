import { NextRequest, NextResponse } from "next/server";
import { getServerUserEntitlement } from "@/lib/auth/roles";
import { createServiceClient } from "@/lib/supabase/server";
import { MASTER_MUSIC_CATALOG } from "@/lib/content/corpus";
import { MusicMeaningAgent } from "@/lib/ai/musicMeaningAgent";

export async function GET(req: NextRequest) {
  try {
    // 1. Strict Server-side Admin Authorization Gate
    const entitlement = await getServerUserEntitlement();
    if (!entitlement.isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Admin authorization required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const searchQuery = (searchParams.get("search") || "").toLowerCase().trim();
    const statusFilter = searchParams.get("status") || "ALL";
    const languageFilter = searchParams.get("language") || "ALL";
    const genreFilter = searchParams.get("genre") || "ALL";

    const supabase = createServiceClient();

    // 2. Fetch all DB meaning records
    const { data: dbRecords, error: dbError } = await supabase
      .from("song_meaning_results")
      .select("*")
      .order("updated_at", { ascending: false });

    if (dbError) {
      console.warn("[Admin API] DB query warning:", dbError.message);
    }

    const recordsMap = new Map<string, Record<string, unknown>>();
    (dbRecords || []).forEach((rec: Record<string, unknown>) => {
      recordsMap.set(rec.track_id as string, rec);
    });

    // 3. Compute Metrics
    const totalSongs = MASTER_MUSIC_CATALOG.length;
    let pendingCount = 0;
    let generatedCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;
    let failedCount = 0;
    let staleCount = 0;
    let needsReviewCount = 0;

    // 4. Merge Catalog with DB Meaning Records
    const items = MASTER_MUSIC_CATALOG.map((track) => {
      const dbRec = recordsMap.get(track.id);
      const status = (dbRec?.status as string) || "PENDING";

      if (status === "PENDING") pendingCount++;
      else if (status === "GENERATED") generatedCount++;
      else if (status === "APPROVED") approvedCount++;
      else if (status === "REJECTED") rejectedCount++;
      else if (status === "FAILED") failedCount++;
      else if (status === "STALE") staleCount++;
      else if (status === "NEEDS_REVIEW") needsReviewCount++;

      return {
        track_id: track.id,
        title: track.title,
        artist: track.artist_name,
        album: track.album_title || "Single / Album",
        genre: track.genre,
        language: (dbRec?.language as string) || track.primary_language || "hi",
        duration: track.duration,
        rights_status: track.rights_status || "licensed",
        status,
        meaning_summary: dbRec?.meaning_summary || null,
        emotional_themes: dbRec?.emotional_themes || track.mood_tags || [],
        emotional_core: dbRec?.emotional_core || null,
        narrative_interpretation: dbRec?.narrative_interpretation || null,
        key_themes: dbRec?.key_themes || track.theme_tags || [],
        cultural_context: dbRec?.cultural_context || null,
        why_it_may_resonate: dbRec?.why_it_may_resonate || null,
        listener_reflection: dbRec?.listener_reflection || null,
        confidence: dbRec?.confidence || null,
        source_type: dbRec?.source_type || track.rights_status || "METADATA_ONLY",
        source_reference: dbRec?.source_reference || null,
        model: dbRec?.model || "openrouter/poolside/laguna-s-2.1:free",
        model_version: dbRec?.model_version || "1.0",
        prompt_version: dbRec?.prompt_version || "echosoul_meaning_v1.2",
        updated_at: dbRec?.updated_at || null,
        reviewed_at: dbRec?.reviewed_at || null,
      };
    });

    // 5. Apply Filters
    const filteredItems = items.filter((item) => {
      if (searchQuery) {
        const matchesTitle = item.title.toLowerCase().includes(searchQuery);
        const matchesArtist = item.artist.toLowerCase().includes(searchQuery);
        if (!matchesTitle && !matchesArtist) return false;
      }
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (languageFilter !== "ALL" && item.language !== languageFilter) return false;
      if (genreFilter !== "ALL" && !item.genre.toLowerCase().includes(genreFilter.toLowerCase())) return false;
      return true;
    });

    const metrics = {
      totalSongs,
      totalMeanings: (dbRecords || []).length,
      pending: pendingCount,
      generated: generatedCount,
      approved: approvedCount,
      rejected: rejectedCount,
      failed: failedCount,
      stale: staleCount,
      needsReview: needsReviewCount,
    };

    // 6. Fetch User Trial Metrics & Audit List
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, display_name, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    const { data: entitlementsData } = await supabase
      .from("entitlements")
      .select("user_id, plan, usage, updated_at");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entMap = new Map<string, any>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (entitlementsData || []).forEach((e: any) => entMap.set(e.user_id, e));

    let totalTrialsUsed = 0;
    let totalTrialsRemaining = 0;
    let waitlistUsersCount = 0;

    const userTrials = (profilesData || []).map((p) => {
      const ent = entMap.get(p.id);
      const usage = ent?.usage && typeof ent.usage === "object" ? ent.usage : {};
      const total = Number(usage.music_meaning_free_uses_total ?? 3);
      const used = Number(usage.music_meaning_free_uses_used ?? 0);
      const remaining = Math.max(0, total - used);
      const onWaitlist = Boolean(usage.waitlist_requested);

      totalTrialsUsed += used;
      totalTrialsRemaining += remaining;
      if (onWaitlist) waitlistUsersCount++;

      const maskedId = `usr_${p.id.slice(0, 4)}...${p.id.slice(-4)}`;

      return {
        user_id: p.id,
        masked_id: maskedId,
        display_name: p.display_name || "Community Member",
        plan: ent?.plan || "free",
        uses_total: total,
        uses_used: used,
        uses_remaining: remaining,
        waitlist: onWaitlist,
        waitlist_at: (usage.waitlist_requested_at as string) || null,
        last_used_at: used > 0 ? ent?.updated_at || null : null,
        created_at: p.created_at,
      };
    });

    const trialMetrics = {
      totalUsers: (profilesData || []).length,
      trialsUsed: totalTrialsUsed,
      trialsRemaining: totalTrialsRemaining,
      usersOnWaitlist: waitlistUsersCount,
    };

    return NextResponse.json({
      metrics,
      trialMetrics,
      items: filteredItems,
      userTrials,
    });
  } catch (err: unknown) {
    console.error("[Admin Meaning API GET] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Strict Server-side Admin Authorization Gate
    const entitlement = await getServerUserEntitlement();
    if (!entitlement.isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Admin authorization required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, track_id, language = "en" } = body;

    if (!action || !track_id) {
      return NextResponse.json(
        { error: "action and track_id are required" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    if (action === "approve") {
      const { data, error } = await supabase
        .from("song_meaning_results")
        .update({
          status: "APPROVED",
          reviewed_at: new Date().toISOString(),
          reviewed_by: entitlement.userId,
          updated_at: new Date().toISOString(),
        })
        .eq("track_id", track_id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, action: "approve", data });
    }

    if (action === "reject") {
      const { data, error } = await supabase
        .from("song_meaning_results")
        .update({
          status: "REJECTED",
          reviewed_at: new Date().toISOString(),
          reviewed_by: entitlement.userId,
          updated_at: new Date().toISOString(),
        })
        .eq("track_id", track_id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, action: "reject", data });
    }

    if (action === "mark_review") {
      const { data, error } = await supabase
        .from("song_meaning_results")
        .update({
          status: "NEEDS_REVIEW",
          updated_at: new Date().toISOString(),
        })
        .eq("track_id", track_id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, action: "mark_review", data });
    }

    if (action === "regenerate" || action === "retry") {
      const pipelineRes = await MusicMeaningAgent.processTrackMeaning(
        track_id,
        language,
        true // force regenerate
      );

      return NextResponse.json({
        success: pipelineRes.success,
        action,
        meaning: pipelineRes.meaning,
        logs: pipelineRes.logs,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    console.error("[Admin Meaning API POST] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to execute admin action" },
      { status: 500 }
    );
  }
}
