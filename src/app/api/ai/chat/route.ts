/**
 * EchoSoul — /api/ai/chat — Server-side AI chat endpoint
 *
 * The browser calls this route. The OpenRouter API key NEVER reaches the browser.
 *
 * Stage 0: basic request validation + forwarding.
 * Stage 2 will add: session context, memory retrieval, safety pre/post checks,
 *                   streaming responses, and full orchestration logic.
 *
 * SECURITY:
 * - Validates input with Zod before touching the AI provider.
 * - Returns machine-readable error codes; never provider stack traces.
 * - Rate limiting belongs in middleware (Stage 11).
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAIProvider, AIProviderError } from "@/lib/ai";

// ── Input validation schema ────────────────────────────────────────────────

const ChatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().min(1).max(32_000),
      })
    )
    .min(1)
    .max(50),
  model: z.string().optional(),
  maxTokens: z.number().int().min(1).max(8192).optional(),
  temperature: z.number().min(0).max(2).optional(),
});

// ── Route handler ──────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Parse and validate
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Request body must be valid JSON" } },
      { status: 400 }
    );
  }

  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request",
          details: parsed.error.flatten(),
        },
      },
      { status: 400 }
    );
  }

  // Call the AI provider (server-side only — key never leaves here)
  try {
    const provider = getAIProvider();
    const response = await provider.chat(parsed.data);

    return NextResponse.json({
      content: response.content,
      model: response.model,
      usage: response.usage,
      finishReason: response.finishReason,
    });
  } catch (error) {
    if (error instanceof AIProviderError) {
      const statusCode =
        error.code === "RATE_LIMIT"
          ? 429
          : error.code === "MISSING_API_KEY"
            ? 503
            : 502;

      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: statusCode }
      );
    }

    // Unknown error — do NOT expose internals
    console.error("[api/ai/chat] Unexpected error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

// Reject non-POST methods
export async function GET() {
  return NextResponse.json({ error: { code: "METHOD_NOT_ALLOWED" } }, { status: 405 });
}
