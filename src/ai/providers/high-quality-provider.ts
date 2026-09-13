/**
 * High-Quality AI Provider (Orchestrator)
 * 
 * Selectively handles high-complexity, emotionally vulnerable turns,
 * Life Novel chapter writing, deep music interpretation, and failed quality check fallbacks.
 * 
 * Order of execution:
 * 1. AntigravityAdapter (Official Google Gemini API via GEMINI_API_KEY)
 * 2. OpenRouter High-Tier Flagship Models (google/gemini-2.5-pro, anthropic/claude-3.5-sonnet)
 * 3. Graceful fallback to standard models if high-tier unavailable.
 */

import { BaseAIProvider } from "./base";
import { ProviderGenerationInput, ProviderGenerationOutput, ProviderQuotaInfo, ProviderTier } from "./types";
import { AntigravityAdapter } from "./antigravity-adapter";
import { buildSystemPrompt } from "@/ai/prompts/system";

export class HighQualityProvider extends BaseAIProvider {
  readonly id = "high_quality_provider";
  readonly name = "Solenne High-Quality Engine";
  readonly tier: ProviderTier = "high_quality";

  private readonly antigravityAdapter = new AntigravityAdapter();
  private readonly openRouterBaseUrl = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
  private readonly defaultFlagshipModels = [
    process.env.SOLENNE_PREMIUM_MODEL || "google/gemini-2.5-pro",
    "anthropic/claude-3.5-sonnet",
    "google/gemini-2.5-flash",
  ];

  isAvailable(): boolean {
    return this.antigravityAdapter.isAvailable() || Boolean(process.env.OPENROUTER_API_KEY);
  }

  async getQuotaInfo(): Promise<ProviderQuotaInfo> {
    if (this.antigravityAdapter.isAvailable()) {
      return this.antigravityAdapter.getQuotaInfo();
    }

    const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);
    return {
      provider_id: this.id,
      tier: this.tier,
      is_available: hasOpenRouter,
      estimated_credits_remaining: hasOpenRouter ? 500 : 0,
      rate_limit_rpm: 60,
      status_message: hasOpenRouter
        ? "Active (OpenRouter High-Tier Models: Gemini Pro / Claude 3.5 Sonnet)"
        : "No high-quality credentials available (GEMINI_API_KEY or OPENROUTER_API_KEY required)",
      is_runtime_production_supported: hasOpenRouter,
    };
  }

  async generate(input: ProviderGenerationInput): Promise<ProviderGenerationOutput> {
    const start = Date.now();

    // Strategy 1: Attempt Antigravity Google Gemini API if configured
    if (this.antigravityAdapter.isAvailable()) {
      try {
        return await this.antigravityAdapter.generate(input);
      } catch (geminiErr) {
        console.warn("[HighQualityProvider] Antigravity/Gemini bridge failed, failing over to OpenRouter flagship:", geminiErr);
      }
    }

    // Strategy 2: Attempt OpenRouter Flagship Models
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (apiKey) {
      const systemPrompt = input.system_prompt || buildSystemPrompt();
      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...input.personalization.relevant_history.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user" as const, content: input.message },
      ];

      const modelToUse = input.target_model || this.defaultFlagshipModels[0];
      const fallbackModels = this.defaultFlagshipModels.filter((m) => m !== modelToUse).slice(0, 2);
      const modelsArray = [modelToUse, ...fallbackModels].slice(0, 3);

      const payload = {
        models: modelsArray,
        messages,
        temperature: input.temperature ?? 0.65,
        max_tokens: input.max_tokens ?? 1500,
        provider: {
          sort: "throughput",
          allow_fallbacks: true,
        },
      };

      const res = await this.fetchWithTimeout(
        `${this.openRouterBaseUrl}/chat/completions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://solenne.app",
            "X-Title": "Solenne High-Quality AI",
          },
          body: JSON.stringify(payload),
        },
        18000
      );

      if (res.ok) {
        const data = await res.json();
        const rawContent = data.choices?.[0]?.message?.content ?? "";
        const cleanContent = this.sanitizeText(rawContent);

        return {
          raw_content: cleanContent,
          model_id: data.model || modelToUse,
          provider_id: this.id,
          tokens_used: data.usage?.total_tokens,
          latency_ms: Date.now() - start,
          finish_reason: data.choices?.[0]?.finish_reason,
          credits_used: 1,
        };
      }
    }

    throw new Error(
      "HighQualityProvider: No high-quality providers (Gemini API or OpenRouter flagship) were available or succeeded."
    );
  }
}
