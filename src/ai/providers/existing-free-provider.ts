/**
 * Existing Free AI Provider
 * 
 * Routes low and standard complexity conversational turns through
 * free/low-cost models on OpenRouter (e.g., Laguna, Nex Mini, Liquid).
 * Preserves credits and ensures rapid turn times.
 */

import { BaseAIProvider } from "./base";
import { ProviderGenerationInput, ProviderGenerationOutput, ProviderQuotaInfo, ProviderTier } from "./types";
import { buildSystemPrompt } from "@/ai/prompts/system";

export class ExistingFreeProvider extends BaseAIProvider {
  readonly id = "existing_free_provider";
  readonly name = "OpenRouter Free Tier";
  readonly tier: ProviderTier = "free";

  private readonly baseUrl = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
  private readonly defaultModels = [
    process.env.ECHOSOUL_PRIMARY_MODEL || "poolside/laguna-s-2.1:free",
    "nex-agi/nex-n2.5-mini:free",
    "liquid/lfm-2.5-2.6b:free",
  ];

  isAvailable(): boolean {
    return Boolean(process.env.OPENROUTER_API_KEY);
  }

  async getQuotaInfo(): Promise<ProviderQuotaInfo> {
    return {
      provider_id: this.id,
      tier: this.tier,
      is_available: this.isAvailable(),
      estimated_credits_remaining: null, // Free models do not consume paid credits
      rate_limit_rpm: 20, // Typical free tier rate limit
      status_message: this.isAvailable() ? "Active (Free OpenRouter Tier)" : "Missing OPENROUTER_API_KEY",
      is_runtime_production_supported: true,
    };
  }

  async generate(input: ProviderGenerationInput): Promise<ProviderGenerationOutput> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("ExistingFreeProvider: OPENROUTER_API_KEY is not configured");
    }

    const start = Date.now();
    const systemPrompt = input.system_prompt || buildSystemPrompt();

    // Context isolation: only relevant history of the current user
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...input.personalization.relevant_history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: input.message },
    ];

    const modelToUse = input.target_model || this.defaultModels[0];
    const fallbackModels = this.defaultModels.filter((m) => m !== modelToUse).slice(0, 2);
    const modelsArray = [modelToUse, ...fallbackModels].slice(0, 3);

    const payload = {
      models: modelsArray,
      messages,
      temperature: input.temperature ?? 0.7,
      max_tokens: input.max_tokens ?? (input.is_voice ? 150 : 400),
      provider: {
        sort: "latency",
        allow_fallbacks: true,
      },
    };

    const res = await this.fetchWithTimeout(
      `${this.baseUrl}/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://solenne.app",
          "X-Title": "Solenne AI",
        },
        body: JSON.stringify(payload),
      },
      8000
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Free model API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const rawContent = data.choices?.[0]?.message?.content ?? "";
    const cleanContent = this.sanitizeText(
      rawContent,
      input.is_voice
        ? "I am here with you. Take a gentle breath, and let us take this one step at a time."
        : "I hear you. Take all the space you need, and let us explore this together."
    );

    return {
      raw_content: cleanContent,
      model_id: data.model || modelToUse,
      provider_id: this.id,
      tokens_used: data.usage?.total_tokens,
      latency_ms: Date.now() - start,
      finish_reason: data.choices?.[0]?.finish_reason,
      credits_used: 0,
    };
  }
}
