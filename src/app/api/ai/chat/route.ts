import { createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { OpenRouterAdapter } from "@/ai/adapters/openrouter";
import { buildSystemPrompt } from "@/ai/prompts/system";
import { supervisorDecide } from "@/ai/routing/supervisor";
import { judgeResponse } from "@/ai/quality/judge";
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
 * POST /api/ai/chat
 * 
 * Full EchoSoul AI pipeline with Latency-First Routing (System B)
 * and Content Universe Enrichment (System A):
 * Auth → Safety Pre-check → Context → Supervisor → Fast Latency Router → Quality Judge → Enrichment → Response
 * 
 * Body: { message: string; conversation_id?: string; is_voice?: boolean; personalization?: any }
 * Returns: EchoSoulCanonicalResponse with observability headers
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const requestId = generateRequestId();

  // Rate Limiting Check (Phase 19)
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const rateResult = rateLimit(`chat_${clientIp}`, { windowMs: 60000, max: 45 });
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
  let isVoice = false;
  let conversationId = crypto.randomUUID();
  let userId = "guest_sanctuary_user";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let supabaseClient: any = null;

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
    appearance: {
      theme: "midnight_soul",
      environment: "mountain_calm",
    },
    current_state: {
      mood: "calm",
      focus: "studies",
      time_of_day: getTimeOfDay(),
    },
    relevant_history: [],
    relevant_moments: [],
  };

  try {
    const supabase = await createServerClient();
    supabaseClient = supabase;

    const body = await req.json();
    message = body.message?.trim() ?? "";
    conversationId = body.conversation_id ?? crypto.randomUUID();
    isVoice = Boolean(body.is_voice);

    if (!message || message.length === 0) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    if (message.length > 4000) {
      return NextResponse.json({ error: "message too long" }, { status: 400 });
    }

    // Attempt Supabase server auth, fallback gracefully to client personalization
    let user = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data?.user;
    } catch {
      // ignore
    }

    // Server auth is the single authority; never trust client-supplied body.user_id
    userId = user?.id ?? "guest_sanctuary_user";

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
        .select("support_style, literature_style, theme, visual_world, language")
        .eq("user_id", user.id)
        .single();
      settings = sett;

      const { data: rec } = await supabase
        .from("messages")
        .select("role, content, created_at")
        .eq("session_id", conversationId)
        .order("created_at", { ascending: false })
        .limit(6);
      recentMessages = rec ?? [];
    }

    // Merge with body.personalization if provided by client
    const clientPers = body.personalization ?? {};

    // For authenticated users, cloud profile identity takes absolute precedence over client cache
    const resolvedName = user
      ? (profile?.display_name || profile?.full_name || user.user_metadata?.display_name || clientPers.userName || "Friend")
      : (clientPers.userName || "Friend");

    // Build minimal personalization context
    personalization = {
      profile: {
        name: resolvedName,
        role: clientPers.role ?? profile?.role ?? "Explorer",
      },
      preferences: {
        support_style: clientPers.supportStyle ?? settings?.support_style ?? "balanced",
        literature_style: clientPers.literatureStyle ?? settings?.literature_style,
        language: clientPers.language ?? settings?.language ?? "en",
      },
      goals: clientPers.goals ?? [],
      interests: clientPers.interests ?? profile?.interests ?? ["Literature", "Philosophy"],
      appearance: {
        theme: clientPers.theme ?? settings?.theme ?? "midnight_soul",
        environment: clientPers.visualWorld ?? settings?.visual_world ?? "mountain_calm",
      },
      current_state: {
        mood: clientPers.currentMood ?? profile?.current_mood ?? "calm",
        focus: clientPers.currentFocus ?? profile?.current_focus ?? "studies",
        time_of_day: getTimeOfDay(),
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

    // Select policy based on mode (fast voice vs realtime chat)
    const routingPolicy = isVoice
      ? ROUTING_POLICIES.FAST_VOICE
      : ROUTING_POLICIES.REALTIME_CHAT;

    // Build system prompt
    const systemPrompt = buildSystemPrompt({
      personalizationLayer: JSON.stringify({
        user_name: personalization.profile.name,
        support_style: personalization.preferences.support_style,
        interests: personalization.interests,
        current_mood: personalization.current_state.mood,
        current_focus: personalization.current_state.focus,
        language: personalization.preferences.language,
        mode: isVoice ? "VOICE_FAST" : "REALTIME_CHAT",
        response_guidance: `
          Primary need: ${decision.primary_need}
          Response tier: ${decision.response_tier}
          Presentation mode: ${isVoice ? "conversational" : decision.presentation_mode}
          Support style: ${decision.support_style}
          ${isVoice ? "Keep response to 1-2 spoken sentences for low voice latency." : ""}
        `,
        available_verified_literature: [
          '“You have power over your mind - not outside events. Realize this, and you will find strength.” — Marcus Aurelius',
          '“The right words find you at exactly the right time.” — Solenne',
          '“Two roads diverged in a wood, and I— I took the one less traveled by, And that has made all the difference.” — Robert Frost',
          '“Waqt rehta nahi kahin tik kar, aadat is ki bhi aadmi si hai.” — Gulzar',
          '“Dheere dheere re mana, dheere sab kuch hoy. Maali seenche sau ghada, ritu aaye phal hoy.” — Kabir Das',
          '“Hazaron khwaishein aisi ke har khwaish pe dam nikle...” — Mirza Ghalib',
          '“Sitaron se aage jahan aur bhi hain, abhi ishq ke imtihan aur bhi hain.” — Allama Iqbal',
        ],
      }),
    });

    let finalResponse;

    try {
      // Generate response using latency-first OpenRouterAdapter
      const adapter = new OpenRouterAdapter({
        customModelId: routingPolicy.primaryModel,
        models: getRouteModels(routingPolicy),
        maxTokens: routingPolicy.maxTokens,
        temperature: routingPolicy.temperature,
        providerRouting: routingPolicy.providerRouting,
        timeoutMs: routingPolicy.timeoutMs,
      });

      const response = await adapter.generate(
        {
          message,
          conversation_id: conversationId,
          user_id: userId,
          personalization,
          is_voice: isVoice,
          request_id: requestId,
        },
        systemPrompt
      );

      // Two-stage response enrichment with verified Content Universe (System A)
      enrichResponseWithContentUniverse(response, personalization, message);

      // Quality Judge evaluation
      const judgeResult = judgeResponse(response, message);
      finalResponse = response;

      // Handle judge decision
      if (judgeResult.action === "reject") {
        console.warn("[/api/ai/chat] Quality Judge rejected raw model generation. Serving authentic Curated Universe response.");
        finalResponse = generateCuratedContextualResponse(
          message,
          personalization,
          isVoice,
          requestId
        );
      } else if (judgeResult.action === "fallback") {
        try {
          const fallbackAdapter = new OpenRouterAdapter("fallback");
          const fallbackResponse = await fallbackAdapter.generate(
            { message, conversation_id: conversationId, user_id: userId, personalization, is_voice: isVoice, request_id: requestId },
            systemPrompt
          );
          enrichResponseWithContentUniverse(fallbackResponse, personalization, message);
          finalResponse = fallbackResponse;
        } catch {
          finalResponse = generateCuratedContextualResponse(
            message,
            personalization,
            isVoice,
            requestId
          );
        }
      }
    } catch (modelErr) {
      console.warn("[/api/ai/chat] External model inference failed or rate-limited. Serving authentic Curated Universe response:", modelErr);
      finalResponse = generateCuratedContextualResponse(
        message,
        personalization,
        isVoice,
        requestId
      );
    }

    const totalMs = Date.now() - startTime;

    // Save message + response to Supabase if authenticated with a valid UUID
    if (user && supabaseClient) {
      await saveMessage(
        supabaseClient,
        userId,
        conversationId,
        message,
        finalResponse,
        totalMs,
        routingPolicy.policy
      );
    }

    const { _meta, ...publicResponse } = finalResponse;
    const res = NextResponse.json(publicResponse);
    res.headers.set("x-request-id", requestId);
    res.headers.set("x-policy", routingPolicy.policy);
    res.headers.set("x-model-used", finalResponse._meta?.model_id ?? "echosoul_curated_universe");
    res.headers.set("x-total-ms", totalMs.toString());
    res.headers.set("x-latency-ms", (finalResponse._meta?.latency_ms ?? totalMs).toString());
    return res;

  } catch (error) {
    console.error("[/api/ai/chat] Global route error, serving curated response:", error);
    const totalMs = Date.now() - startTime;
    const curatedFallback = generateCuratedContextualResponse(
      message || "Hello",
      personalization,
      isVoice,
      requestId
    );
    const { _meta, ...publicResponse } = curatedFallback;
    const res = NextResponse.json(publicResponse, { status: 200 });
    res.headers.set("x-request-id", requestId);
    res.headers.set("x-policy", isVoice ? "FAST_VOICE" : "REALTIME_CHAT");
    res.headers.set("x-model-used", "echosoul_curated_universe");
    res.headers.set("x-total-ms", totalMs.toString());
    return res;
  }
}

async function saveMessage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
  sessionId: string,
  userMessage: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  finalResponse: any,
  totalMs: number,
  policyName: string
) {
  // Validate userId is a valid UUID before database insertion
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId);
  if (!isUuid) return;

  try {
    // 1. Ensure parent session exists
    await supabase.from("sessions").upsert(
      {
        id: sessionId,
        user_id: userId,
        mode: "balanced",
      },
      { onConflict: "id" }
    );

    // 2. Insert user prompt and assistant response with clean metadata (no internal chain-of-thought)
    await supabase.from("messages").insert([
      {
        session_id: sessionId,
        user_id: userId,
        role: "user",
        content: userMessage,
        metadata: {},
      },
      {
        session_id: sessionId,
        user_id: userId,
        role: "assistant",
        content: finalResponse.content,
        metadata: {
          response_id: finalResponse.response_id,
          model_used: finalResponse._meta?.model_id ?? "echosoul_model",
          policy: policyName,
          prompt_version: finalResponse._meta?.prompt_version ?? "v1",
          safety_level: finalResponse.safety_level ?? 0,
          latency_ms: totalMs,
        },
      },
    ]);
  } catch (e) {
    console.error("[saveMessage] Failed to persist messages:", e);
  }
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}
