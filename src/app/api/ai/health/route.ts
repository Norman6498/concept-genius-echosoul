/**
 * EchoSoul — /api/ai/health — AI provider health check
 *
 * Verifies the OpenRouter connection is working.
 * Used by verify-infra.ts and CI checks.
 *
 * Returns:
 * - { ok: true, model, provider } on success
 * - { ok: false, error } on failure
 *
 * SECURITY:
 * - Returns only model name and provider name — never the API key.
 * - Does not log user data.
 * - Minimal token request to avoid unnecessary cost.
 */

import { NextResponse } from "next/server";
import { getAIProvider, AIProviderError } from "@/lib/ai";

export async function GET() {
  try {
    const provider = getAIProvider();

    // Minimal test — 1 token output, no real user data
    const response = await provider.chat({
      messages: [{ role: "user", content: "Reply with the single word: ready" }],
      maxTokens: 8,
      temperature: 0,
    });

    return NextResponse.json({
      ok: true,
      provider: provider.providerName,
      model: response.model,
      response: response.content.slice(0, 64), // truncate for safety
    });
  } catch (error) {
    if (error instanceof AIProviderError) {
      return NextResponse.json(
        {
          ok: false,
          provider: "openrouter",
          error: error.code,
          message: error.message,
        },
        { status: error.statusCode ?? 503 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR", message: "Health check failed unexpectedly" },
      { status: 500 }
    );
  }
}
