/**
 * Antigravity Adapter & Production Bridge
 * 
 * Authoritative Evaluation of Antigravity AI Credits for Deployed Solenne Runtime:
 * 
 * 1. Runtime API Existence:
 *    Antigravity is Google's AI-first development IDE, CLI, and multi-agent environment.
 *    Developer credits provided in Antigravity are strictly tied to the IDE/CLI coding agent.
 *    There is NO public or supported endpoint for a deployed external web application
 *    to draw down an IDE user's coding-agent credits.
 * 
 * 2. Supported Production Bridge:
 *    The official, permitted production runtime API for accessing Google's flagship models
 *    (e.g., Gemini 2.5 Pro, Gemini 2.5 Flash) is the Google Gemini API (via Google AI Studio
 *    or Google Cloud Vertex AI), or via OpenRouter's Google model routing.
 * 
 * 3. Status Determination:
 *    - IDE Credit Direct Web Runtime: NOT SUPPORTED
 *    - Google Gemini API Runtime Bridge: FULLY SUPPORTED via GEMINI_API_KEY
 * 
 * This adapter implements the official Google Gemini API bridge while maintaining
 * strict failover so Solenne never crashes if credentials are absent.
 */

import { BaseAIProvider } from "./base";
import { ProviderGenerationInput, ProviderGenerationOutput, ProviderQuotaInfo, ProviderTier } from "./types";
import { buildSystemPrompt } from "@/ai/prompts/system";

export interface AntigravityRuntimeAudit {
  official_runtime_api_exists: boolean;
  ide_credits_permitted_for_web_runtime: boolean;
  production_bridge_provider: string;
  production_model_available: string;
  authentication_method: string;
  deployed_nextjs_callable: boolean;
  streaming_supported: boolean;
  response_format_supported: boolean;
  final_status: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "NOT_SUPPORTED";
}

export const ANTIGRAVITY_RUNTIME_EVALUATION: AntigravityRuntimeAudit = {
  official_runtime_api_exists: false, // No direct IDE-credit gateway for external webapps
  ide_credits_permitted_for_web_runtime: false, // Prohibited by developer preview terms
  production_bridge_provider: "Google Gemini API (Google AI Studio / Vertex AI)",
  production_model_available: "gemini-2.5-pro / gemini-2.5-flash",
  authentication_method: "Server-side GEMINI_API_KEY or Vertex AI ADC / Service Account",
  deployed_nextjs_callable: true, // Via official Gemini REST endpoint
  streaming_supported: true,
  response_format_supported: true, // Native JSON mode & schemas supported
  final_status: "NOT_SUPPORTED", // For Antigravity IDE credits directly; bridge supported via Gemini API
};

export class AntigravityAdapter extends BaseAIProvider {
  readonly id = "antigravity_gemini_adapter";
  readonly name = "Google Antigravity / Gemini Production Bridge";
  readonly tier: ProviderTier = "high_quality";

  private readonly geminiApiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models";
  private readonly defaultModel = process.env.SOLENNE_HIGH_QUALITY_MODEL || "gemini-2.5-pro";

  isAvailable(): boolean {
    return Boolean(process.env.GEMINI_API_KEY);
  }

  async getQuotaInfo(): Promise<ProviderQuotaInfo> {
    const hasKey = this.isAvailable();
    return {
      provider_id: this.id,
      tier: this.tier,
      is_available: hasKey,
      estimated_credits_remaining: hasKey ? 1000 : 0,
      rate_limit_rpm: hasKey ? 60 : 0,
      status_message: hasKey
        ? "Active (Official Google Gemini API Production Bridge configured)"
        : "Antigravity IDE credits cannot be called at web runtime; configure GEMINI_API_KEY for official production bridge",
      is_runtime_production_supported: hasKey,
    };
  }

  async generate(input: ProviderGenerationInput): Promise<ProviderGenerationOutput> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "AntigravityAdapter: GEMINI_API_KEY is not configured. Antigravity IDE developer credits are restricted to the local development environment and cannot be drawn down at web runtime."
      );
    }

    const start = Date.now();
    const systemPrompt = input.system_prompt || buildSystemPrompt();

    // Prepare contents array for Gemini generateContent API
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // History turns
    for (const msg of input.personalization.relevant_history) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    // Current turn
    contents.push({
      role: "user",
      parts: [{ text: input.message }],
    });

    const modelToUse = input.target_model || this.defaultModel;
    const url = `${this.geminiApiEndpoint}/${modelToUse}:generateContent?key=${apiKey}`;

    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        temperature: input.temperature ?? 0.6,
        maxOutputTokens: input.max_tokens ?? 1500,
        responseMimeType: "application/json",
      },
    };

    const res = await this.fetchWithTimeout(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
      15000
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Google Gemini API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const rawContent = candidate?.content?.parts?.[0]?.text ?? "";
    const cleanContent = this.sanitizeText(rawContent);

    return {
      raw_content: cleanContent,
      model_id: `gemini/${modelToUse}`,
      provider_id: this.id,
      tokens_used: data.usageMetadata?.totalTokenCount,
      latency_ms: Date.now() - start,
      finish_reason: candidate?.finishReason,
      credits_used: 1,
    };
  }
}
