import { createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { OpenRouterAdapter } from "@/ai/adapters/openrouter";
import { buildSystemPrompt } from "@/ai/prompts/system";
import { supervisorDecide } from "@/ai/routing/supervisor";
import { judgeResponse } from "@/ai/quality/judge";
import { SAFE_FALLBACK_RESPONSE } from "@/ai/contracts/response-schema";
import { PersonalizationContext } from "@/ai/adapters/base";
import { rateLimit } from "@/lib/rateLimit";
import {
  ROUTING_POLICIES,
  getRouteModels,
  generateRequestId,
  enrichResponseWithContentUniverse,
  generateCuratedContextualResponse,
} from "@/ai/routing/latency-router";

/**
 * POST /api/ai/voice
 * 
 * Specifically handles Voice mode which requires ultra-low latency,
 * concise 1-2 sentence spoken output, and graceful fallback.
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const requestId = generateRequestId();

  // Rate Limiting Check (Phase 19)
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const rateResult = rateLimit(`voice_${clientIp}`, { windowMs: 60000, max: 45 });
  if (!rateResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please take a gentle breath before continuing." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rateResult.resetMs / 1000).toString(),
          "X-RateLimit-Limit": rateResult.limit.toString(),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  let message = "";
  let conversationId = crypto.randomUUID();
  let userId = "guest_sanctuary_user";

  let personalization: PersonalizationContext = {
    profile: {
      name: "Friend",
      role: "Explorer",
    },
    preferences: {
      support_style: "balanced",
      language: "en",
    },
    goals: [],
    interests: ["Literature", "Philosophy"],
    appearance: { theme: "midnight_soul", environment: "mountain_calm" },
    current_state: {
      mood: "calm",
      focus: "wellbeing",
      time_of_day: "day",
    },
    relevant_history: [],
    relevant_moments: [],
  };

  try {
    const supabase = await createServerClient();

    // Graceful authentication check
    let user = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data?.user;
    } catch {
      // ignore
    }

    const body = await req.json();
    message = body.message?.trim() ?? "";
    conversationId = body.conversation_id ?? crypto.randomUUID();
    // Server auth is the single authority; never trust client-supplied body.user_id
    userId = user?.id ?? "guest_sanctuary_user";

    if (!message || message.length === 0) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    // Fetch user profile for personalization context if authenticated
    let profile = null;
    let settings = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let recentMessages: any[] = [];

    if (user) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name, display_name, role, interests, current_focus, current_mood")
        .eq("id", user.id)
        .single();
      profile = prof;

      const { data: sett } = await supabase
        .from("user_settings")
        .select("support_style, language")
        .eq("user_id", user.id)
        .single();
      settings = sett;

      // Voice gets a shorter history window to stay fast
      const { data: rec } = await supabase
        .from("messages")
        .select("role, content, created_at")
        .eq("session_id", conversationId)
        .order("created_at", { ascending: false })
        .limit(4);
      recentMessages = rec ?? [];
    }

    const clientPers = body.personalization ?? {};

    // For authenticated users, cloud profile identity takes absolute precedence over client cache
    const resolvedName = user
      ? (profile?.display_name || profile?.full_name || user.user_metadata?.display_name || clientPers.userName || "Friend")
      : (clientPers.userName || "Friend");

    const personalization: PersonalizationContext = {
      profile: {
        name: resolvedName,
        role: clientPers.role ?? profile?.role ?? "Explorer",
      },
      preferences: {
        support_style: clientPers.supportStyle ?? settings?.support_style ?? "balanced",
        language: clientPers.language ?? settings?.language ?? "en",
      },
      goals: clientPers.goals ?? [],
      interests: clientPers.interests ?? profile?.interests ?? [],
      appearance: { theme: "midnight_soul", environment: "mountain_calm" },
      current_state: {
        mood: clientPers.currentMood ?? profile?.current_mood,
        focus: clientPers.currentFocus ?? profile?.current_focus,
        time_of_day: "day",
      },
      relevant_history: (recentMessages ?? [])
        .reverse()
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
          created_at: m.created_at,
        })),
      relevant_moments: [],
    };

    // Supervisor decides what agents to activate
    const decision = supervisorDecide(
      message,
      personalization,
      recentMessages?.length ?? 0
    );

    // Build system prompt explicitly for VOICE mode
    const systemPrompt = buildSystemPrompt({
      personalizationLayer: JSON.stringify({
        user_name: personalization.profile.name,
        response_guidance: `
          MODE: VOICE_ASSISTANT
          Primary need: ${decision.primary_need}
          - Keep answers under 2 concise sentences for instant natural voice playback.
          - Speak naturally and warmly, avoiding lists, markdown, asterisks, or formatting.
          - Never say "as an AI language model".
        `,
      }),
    });

    const policy = ROUTING_POLICIES.FAST_VOICE;

    // Generate response using latency-first fast model
    const adapter = new OpenRouterAdapter({
      customModelId: policy.primaryModel,
      models: getRouteModels(policy),
      maxTokens: policy.maxTokens,
      temperature: policy.temperature,
      providerRouting: policy.providerRouting,
      timeoutMs: policy.timeoutMs,
    });

    const response = await adapter.generate(
      {
        message,
        conversation_id: conversationId,
        user_id: userId,
        personalization,
        is_voice: true, // Key flag
        request_id: requestId,
      },
      systemPrompt
    );

    // Two-stage secondary enrichment
    enrichResponseWithContentUniverse(response, personalization, message);

    // Quality Judge evaluation
    const judgeResult = judgeResponse(response, message);

    // Handle judge decision
    if (judgeResult.action === "reject") {
      const totalMs = Date.now() - startTime;
      const curatedFallback = generateCuratedContextualResponse(
        message,
        personalization,
        true,
        requestId
      );
      const { _meta, ...publicCurated } = curatedFallback;
      const res = NextResponse.json(publicCurated);
      res.headers.set("x-request-id", requestId);
      res.headers.set("x-policy", policy.policy);
      res.headers.set("x-model-used", "echosoul_curated_universe");
      res.headers.set("x-total-ms", totalMs.toString());
      return res;
    }

    const totalMs = Date.now() - startTime;

    // Save message + response to Supabase if authenticated with valid UUID
    const isUuid = user?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(user.id);
    if (user && isUuid) {
      try {
        await supabase.from("sessions").upsert(
          { id: conversationId, user_id: user.id, mode: "balanced" },
          { onConflict: "id" }
        );
        await supabase.from("messages").insert([
          { session_id: conversationId, user_id: user.id, role: "user", content: message },
          {
            session_id: conversationId,
            user_id: user.id,
            role: "assistant",
            content: response.content,
            metadata: {
              response_id: response.response_id,
              model_used: response._meta?.model_id ?? adapter.modelId,
              policy: policy.policy,
              latency_ms: totalMs,
            },
          },
        ]);
      } catch (e) {
        console.error("[Voice] Save error:", e);
      }
    }

    const { _meta, ...publicResponse } = response;
    const res = NextResponse.json({ ...publicResponse, quality: judgeResult });
    res.headers.set("x-request-id", requestId);
    res.headers.set("x-policy", policy.policy);
    res.headers.set("x-model-used", response._meta?.model_id ?? adapter.modelId);
    res.headers.set("x-total-ms", totalMs.toString());
    res.headers.set("x-latency-ms", (response._meta?.latency_ms ?? totalMs).toString());
    return res;

  } catch (error) {
    console.error("[/api/ai/voice] Unhandled error, serving curated response:", error);
    const totalMs = Date.now() - startTime;
    const curatedFallback = generateCuratedContextualResponse(
      message || "Hello",
      personalization,
      true,
      requestId
    );
    const { _meta, ...publicCurated } = curatedFallback;
    const res = NextResponse.json(publicCurated, { status: 200 });
    res.headers.set("x-request-id", requestId);
    res.headers.set("x-policy", "FAST_VOICE");
    res.headers.set("x-model-used", "echosoul_curated_universe");
    res.headers.set("x-total-ms", totalMs.toString());
    return res;
  }
}
