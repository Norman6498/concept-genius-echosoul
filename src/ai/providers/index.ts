/**
 * Solenne AI Provider Registry & Factory
 * 
 * Central access point for all providers. Decoupled from hardcoded models.
 */

import { AIProvider, ProviderQuotaInfo, ProviderTier } from "./types";
import { ExistingFreeProvider } from "./existing-free-provider";
import { OpenRouterProvider } from "./openrouter-provider";
import { HighQualityProvider } from "./high-quality-provider";
import { AntigravityAdapter, ANTIGRAVITY_RUNTIME_EVALUATION } from "./antigravity-adapter";

export * from "./types";
export * from "./base";
export * from "./existing-free-provider";
export * from "./openrouter-provider";
export * from "./high-quality-provider";
export * from "./antigravity-adapter";

export class ProviderRegistry {
  private static instance: ProviderRegistry;

  private freeProvider = new ExistingFreeProvider();
  private standardProvider = new OpenRouterProvider();
  private highQualityProvider = new HighQualityProvider();
  private antigravityAdapter = new AntigravityAdapter();

  static getInstance(): ProviderRegistry {
    if (!this.instance) {
      this.instance = new ProviderRegistry();
    }
    return this.instance;
  }

  getProviderForTier(tier: ProviderTier): AIProvider {
    switch (tier) {
      case "high_quality":
        if (this.highQualityProvider.isAvailable()) {
          return this.highQualityProvider;
        }
        // Fallback to standard then free if high quality is unavailable
        if (this.standardProvider.isAvailable()) {
          return this.standardProvider;
        }
        return this.freeProvider;

      case "standard":
        if (this.standardProvider.isAvailable()) {
          return this.standardProvider;
        }
        return this.freeProvider;

      case "free":
      default:
        return this.freeProvider;
    }
  }

  getFreeProvider(): ExistingFreeProvider {
    return this.freeProvider;
  }

  getStandardProvider(): OpenRouterProvider {
    return this.standardProvider;
  }

  getHighQualityProvider(): HighQualityProvider {
    return this.highQualityProvider;
  }

  getAntigravityAdapter(): AntigravityAdapter {
    return this.antigravityAdapter;
  }

  async getTelemetryStatus(): Promise<{
    antigravity_evaluation: typeof ANTIGRAVITY_RUNTIME_EVALUATION;
    providers: Record<string, ProviderQuotaInfo>;
  }> {
    const [freeQuota, stdQuota, hqQuota, agQuota] = await Promise.all([
      this.freeProvider.getQuotaInfo(),
      this.standardProvider.getQuotaInfo(),
      this.highQualityProvider.getQuotaInfo(),
      this.antigravityAdapter.getQuotaInfo(),
    ]);

    return {
      antigravity_evaluation: ANTIGRAVITY_RUNTIME_EVALUATION,
      providers: {
        free: freeQuota,
        standard: stdQuota,
        high_quality: hqQuota,
        antigravity_bridge: agQuota,
      },
    };
  }
}
