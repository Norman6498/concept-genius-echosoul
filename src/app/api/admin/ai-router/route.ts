import { NextRequest, NextResponse } from "next/server";
import { ProviderRegistry, ANTIGRAVITY_RUNTIME_EVALUATION } from "@/ai/providers";
import { AIQualityRouter } from "@/ai/routing/quality-router";
import { supervisorDecide } from "@/ai/routing/supervisor";
import { judgeResponse, QUALITY_CONFIG } from "@/ai/quality/judge";
import { SafetyGate } from "@/ai/quality/safety-gate";
import { createServerClient } from "@/lib/supabase/server";

/**
 * GET /api/admin/ai-router
 * 
 * Secure Admin Telemetry & Diagnostic Endpoint:
 * - Antigravity runtime evaluation audit (10 criteria)
 * - Live provider availability & quota states
 * - Active routing rules and thresholds
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    // Optional admin role check (permits authenticated admins or local development/testing)
    const isLocalDev = process.env.NODE_ENV === "development" || !process.env.VERCEL;
    const isAdmin = user?.email?.includes("admin") || user?.user_metadata?.role === "admin";

    if (!isLocalDev && !isAdmin && !user) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const registry = ProviderRegistry.getInstance();
    const telemetry = await registry.getTelemetryStatus();

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      antigravity_evaluation: telemetry.antigravity_evaluation,
      providers: telemetry.providers,
      quality_thresholds: QUALITY_CONFIG,
      routing_tiers: {
        free: {
          intended_use: "Low complexity, greetings, UI navigation, button explanations",
          models: ["poolside/laguna-s-2.1:free", "nex-agi/nex-n2.5-mini:free"],
          credit_cost: 0,
        },
        standard: {
          intended_use: "Medium reflection, practical steps, philosophical discussion",
          models: ["nex-agi/nex-n2.5-pro:free", "google/gemma-4-26b-a4b-it:free"],
          credit_cost: 0,
        },
        high_quality: {
          intended_use: "Existential crisis, pattern repetition, Life Novel chapters, deep music hermeneutics, quality check recovery",
          models: ["google/gemini-2.5-pro", "anthropic/claude-3.5-sonnet"],
          credit_cost: 1,
        },
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * POST /api/admin/ai-router
 * 
 * Diagnostic dry-run testing tool for the Quality Router and Quality Judge.
 * Evaluates a given message without creating user chat messages.
 */
export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const body = await req.json();
    const testMessage = (body.message || "").trim();

    if (!testMessage) {
      return NextResponse.json({ error: "message is required for test simulation" }, { status: 400 });
    }

    const testPersonalization = {
      profile: { name: body.userName || "Admin Tester", role: "Auditor" },
      preferences: { support_style: "reflective", language: "en" },
      goals: ["System Quality Audit"],
      interests: ["AI Architecture"],
      appearance: { theme: "midnight_soul", environment: "sanctuary" },
      current_state: { mood: body.mood || "contemplative", focus: "system_architecture" },
      relevant_history: [],
      relevant_moments: [],
    };

    // 1. Safety Pre-check
    const safetyCheck = SafetyGate.preCheck(testMessage, "admin_audit_user", testPersonalization);

    // 2. Supervisor Decision
    const supervisorDecision = supervisorDecide(testMessage, testPersonalization, 0);

    // 3. AI Quality Router Decision
    const routingDecision = AIQualityRouter.route(
      testMessage,
      testPersonalization,
      0,
      supervisorDecision,
      Boolean(body.isVoice),
      { taskType: body.taskType || "chat", forceTier: body.forceTier }
    );

    return NextResponse.json({
      test_message: testMessage,
      safety_check: safetyCheck,
      supervisor_decision: supervisorDecision,
      routing_decision: routingDecision,
      latency_ms: Date.now() - start,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
