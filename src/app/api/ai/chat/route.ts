import { createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { OpenRouterAdapter } from "@/ai/adapters/openrouter";
import { buildSystemPrompt } from "@/ai/prompts/system";
import { supervisorDecide } from "@/ai/routing/supervisor";
import { judgeResponse, JudgeResult } from "@/ai/quality/judge";
import { PersonalizationContext } from "@/ai/adapters/base";
import { rateLimit } from "@/lib/rateLimit";
import {
  ROUTING_POLICIES,
  getRouteModels,
  generateRequestId,
  enrichResponseWithContentUniverse,
  generateCuratedContextualResponse,
} from "@/ai/routing/latency-router";
import { AIQualityRouter, QualityRoutingDecision } from "@/ai/routing/quality-router";
import { ProviderRegistry } from "@/ai/providers";
import { SafetyGate } from "@/ai/quality/safety-gate";
import { EchoSoulCanonicalResponse } from "@/ai/contracts/response-schema";

/**
 * POST /api/ai/chat
 * 
 * Full EchoSoul AI Pipeline with AI Quality Router & High-Quality Fallback:
 * Rate Limit → Safety Gate (Pre) → Context Isolation → Supervisor →
 * AI Quality Router → Provider Execution → Content Universe Enrichment →
 * Quality Judge (10-dim score) → High-Quality Fallback Retry (if needed) →
 * Safety Post-check → Safe Persistence → Response (JSON or SSE Stream)
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const requestId = generateRequestId();

  // 1. Rate Limiting Check
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
  let isStream = false;
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
    isStream = Boolean(body.stream) || req.headers.get("accept")?.includes("text/event-stream") === true;

    if (!message || message.length === 0) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    if (message.length > 4000) {
      return NextResponse.json({ error: "message too long" }, { status: 400 });
    }

    // 2. Server Authentication (Single Authority)
    let user = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data?.user;
    } catch {
      // ignore
    }

    userId = user?.id ?? "guest_sanctuary_user";

    // 3. User History & Context Loading
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

    const clientPers = body.personalization ?? {};
    const resolvedName = user
      ? (profile?.display_name || profile?.full_name || user.user_metadata?.display_name || clientPers.userName || "Friend")
      : (clientPers.userName || "Friend");

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

    // 4. Safety Gate Pre-Check & User Context Isolation
    const safetyPreCheck = SafetyGate.preCheck(message, userId, personalization);
    if (!safetyPreCheck.allowed && safetyPreCheck.crisisDetected) {
      const crisisResp: EchoSoulCanonicalResponse = {
        response_id: requestId,
        content: safetyPreCheck.crisisResponse!,
        presentation_mode: "conversational",
        tone: "gentle",
        intent: "crisis_intervention",
        need: "listening",
        emotional_context: { label: "crisis", confidence: 1.0 },
        reflection: "Your life and safety are the absolute priority. Please reach out to someone who can hold space for you.",
        practical_insight: "You do not have to carry everything right now. Seeking help is an act of courage.",
        practical_steps: [
          "Call or text 988 for immediate compassionate support.",
          "Reach out to someone you trust and tell them you need company.",
        ],
        literature: null,
        music: null,
        visual: null,
        journey: null,
        moment_candidate: null,
        letter: null,
        recommended_actions: [],
        personalization_reason: "Immediate crisis response",
        safety_level: 3,
        citations: [],
        quality: {
          schema_valid: true,
          personalization_valid: true,
          safety_valid: true,
          provenance_valid: true,
          quality_score: 100,
          issues: [],
          repair_required: false,
        },
        _meta: {
          model_id: "solenne_safety_gate_guard",
          prompt_version: "safety_crisis_v1",
          adapter_version: "safety_gate_v1",
          latency_ms: Date.now() - startTime,
          fallback_used: false,
          repair_applied: false,
          created_at: new Date().toISOString(),
        },
      };

      const { _meta, ...publicResp } = crisisResp;
      const res = NextResponse.json(publicResp, { status: 200 });
      res.headers.set("x-request-id", requestId);
      res.headers.set("x-policy", "CRISIS_INTERVENTION");
      res.headers.set("x-safety-level", "3");
      return res;
    }

    // Apply context sanitization to prevent prompt leakage
    personalization = SafetyGate.sanitizeContext(personalization, userId);
    const sanitizedUserMessage = safetyPreCheck.sanitizedMessage;

    // 5. Supervisor Decision
    const decision = supervisorDecide(
      sanitizedUserMessage,
      personalization,
      recentMessages?.length ?? 0
    );

    // 6. AI Quality Router: Server-Authoritative Model Selection
    const routingDecision: QualityRoutingDecision = AIQualityRouter.route(
      sanitizedUserMessage,
      personalization,
      recentMessages?.length ?? 0,
      decision,
      isVoice,
      { taskType: "chat" }
    );

    // 7. System Prompt Construction
    const systemPrompt = buildSystemPrompt({
      personalizationLayer: JSON.stringify({
        user_name: personalization.profile.name,
        support_style: personalization.preferences.support_style,
        interests: personalization.interests,
        current_mood: personalization.current_state.mood,
        current_focus: personalization.current_state.focus,
        language: personalization.preferences.language,
        mode: isVoice ? "VOICE_FAST" : "REALTIME_CHAT",
        tier_selected: routingDecision.tier,
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

    let finalResponse: EchoSoulCanonicalResponse;
    let judgeResult: JudgeResult;
    let fallbackUsed = false;
    let finalModelUsed = routingDecision.targetModel;

    try {
      const registry = ProviderRegistry.getInstance();
      const primaryProvider = registry.getProviderForTier(routingDecision.tier);

      // Select policy for OpenRouter fallback array
      const routingPolicy = isVoice
        ? ROUTING_POLICIES.FAST_VOICE
        : routingDecision.tier === "high_quality"
        ? ROUTING_POLICIES.DEEP_REASONING
        : routingDecision.tier === "standard"
        ? ROUTING_POLICIES.STANDARD
        : ROUTING_POLICIES.REALTIME_CHAT;

      const adapter = new OpenRouterAdapter({
        customModelId: routingDecision.targetModel,
        models: getRouteModels(routingPolicy),
        maxTokens: routingPolicy.maxTokens,
        temperature: routingPolicy.temperature,
        providerRouting: routingPolicy.providerRouting,
        timeoutMs: routingPolicy.timeoutMs,
      });

      // Execute primary model generation
      const response = await adapter.generate(
        {
          message: sanitizedUserMessage,
          conversation_id: conversationId,
          user_id: userId,
          personalization,
          is_voice: isVoice,
          request_id: requestId,
        },
        systemPrompt
      );

      finalModelUsed = response._meta.model_id;

      // Two-stage response enrichment with verified Content Universe (System A)
      enrichResponseWithContentUniverse(response, personalization, sanitizedUserMessage);

      // 8. Quality Judge 10-Dimension Evaluation
      judgeResult = judgeResponse(response, sanitizedUserMessage);
      finalResponse = response;

      // 9. Fallback Logic on Low Quality or Rejection
      if (judgeResult.action === "reject") {
        console.warn("[/api/ai/chat] Quality Judge rejected response (safety or provenance). Serving Curated Universe response.");
        finalResponse = generateCuratedContextualResponse(
          sanitizedUserMessage,
          personalization,
          isVoice,
          requestId
        );
        fallbackUsed = true;
      } else if (judgeResult.action === "fallback" || judgeResult.action === "repair") {
        // Quality check failed: retry with stronger provider IF available and not already used
        const highQualityProvider = registry.getHighQualityProvider();
        const canUpgrade = routingDecision.tier !== "high_quality" && highQualityProvider.isAvailable();

        if (canUpgrade) {
          console.info(`[/api/ai/chat] Quality check score ${judgeResult.quality_score} < 85. Retrying turn with HighQualityProvider.`);
          try {
            const hqGen = await highQualityProvider.generate({
              message: sanitizedUserMessage,
              conversation_id: conversationId,
              user_id: userId,
              personalization,
              is_voice: isVoice,
              request_id: requestId,
              system_prompt: systemPrompt,
              temperature: 0.6,
              max_tokens: 1200,
              requires_reasoning: true,
            });

            // Normalize and enrich retry response
            finalResponse.content = hqGen.raw_content;
            finalResponse._meta.model_id = hqGen.model_id;
            finalResponse._meta.fallback_used = true;
            finalModelUsed = hqGen.model_id;
            fallbackUsed = true;

            enrichResponseWithContentUniverse(finalResponse, personalization, sanitizedUserMessage);
            judgeResult = judgeResponse(finalResponse, sanitizedUserMessage);
          } catch (hqErr) {
            console.warn("[/api/ai/chat] High-quality fallback retry failed, defaulting to curated universe:", hqErr);
            finalResponse = generateCuratedContextualResponse(
              sanitizedUserMessage,
              personalization,
              isVoice,
              requestId
            );
            fallbackUsed = true;
          }
        } else if (judgeResult.action === "fallback") {
          finalResponse = generateCuratedContextualResponse(
            sanitizedUserMessage,
            personalization,
            isVoice,
            requestId
          );
          fallbackUsed = true;
        }
      }
    } catch (modelErr) {
      console.warn("[/api/ai/chat] External model inference failed or rate-limited. Serving authentic Curated Universe response:", modelErr);
      finalResponse = generateCuratedContextualResponse(
        sanitizedUserMessage,
        personalization,
        isVoice,
        requestId
      );
      fallbackUsed = true;
      judgeResult = judgeResponse(finalResponse, sanitizedUserMessage);
    }

    // 10. Safety Post-Check
    const safetyPostCheck = SafetyGate.postCheck(finalResponse.content);
    if (!safetyPostCheck.safe) {
      finalResponse.content = safetyPostCheck.sanitizedContent;
    }

    const totalMs = Date.now() - startTime;

    // 11. Save messages to Supabase if authenticated with valid UUID
    if (user && supabaseClient) {
      await saveMessage(
        supabaseClient,
        userId,
        conversationId,
        sanitizedUserMessage,
        finalResponse,
        totalMs,
        routingDecision.tier
      );
    }

    // 12. Streaming Mode Handler
    if (isStream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          // Send words sequentially to simulate progressive streaming
          const words = finalResponse.content.split(" ");
          let i = 0;
          const interval = setInterval(() => {
            if (i < words.length) {
              const chunk = (i === 0 ? "" : " ") + words[i];
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "token", text: chunk })}\n\n`)
              );
              i++;
            } else {
              const { _meta, ...publicResp } = finalResponse;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "done", response: publicResp })}\n\n`)
              );
              clearInterval(interval);
              controller.close();
            }
          }, 25);
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "x-request-id": requestId,
          "x-provider-tier": routingDecision.tier,
          "x-model-used": finalModelUsed,
          "x-routing-reason": routingDecision.reason,
          "x-quality-score": judgeResult.quality_score.toString(),
          "x-fallback-used": fallbackUsed ? "true" : "false",
        },
      });
    }

    // 13. Standard JSON Response with Observability Headers
    const { _meta, ...publicResponse } = finalResponse;
    const res = NextResponse.json(publicResponse);
    res.headers.set("x-request-id", requestId);
    res.headers.set("x-policy", routingDecision.tier);
    res.headers.set("x-provider-tier", routingDecision.tier);
    res.headers.set("x-model-used", finalModelUsed);
    res.headers.set("x-routing-reason", routingDecision.reason);
    res.headers.set("x-quality-score", judgeResult.quality_score.toString());
    res.headers.set("x-fallback-used", fallbackUsed ? "true" : "false");
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
    res.headers.set("x-policy", "curated_fallback");
    res.headers.set("x-provider-tier", "free");
    res.headers.set("x-model-used", "echosoul_curated_universe");
    res.headers.set("x-routing-reason", "exception_recovery");
    res.headers.set("x-quality-score", "95");
    res.headers.set("x-fallback-used", "true");
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
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId);
  if (!isUuid) return;

  try {
    await supabase.from("sessions").upsert(
      {
        id: sessionId,
        user_id: userId,
        mode: "balanced",
      },
      { onConflict: "id" }
    );

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
