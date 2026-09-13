/**
 * Solenne AI Provider Interface & Types
 * 
 * Defines standard provider contracts to eliminate vendor lock-in.
 * Supports Free, Standard OpenRouter, and High-Quality / Antigravity adapters.
 * 
 * @version solenne_provider_v1
 */

import { EchoSoulCanonicalResponse, SafetyLevel } from "@/ai/contracts/response-schema";
import { PersonalizationContext } from "@/ai/adapters/base";

export type ProviderTier = "free" | "standard" | "high_quality";

export interface ProviderGenerationInput {
  message: string;
  conversation_id: string;
  user_id: string;
  personalization: PersonalizationContext;
  is_voice: boolean;
  request_id: string;
  system_prompt?: string;
  temperature?: number;
  max_tokens?: number;
  target_model?: string;
  requires_reasoning?: boolean;
}

export interface ProviderGenerationOutput {
  raw_content: string;
  model_id: string;
  provider_id: string;
  tokens_used?: number;
  latency_ms: number;
  finish_reason?: string;
  credits_used?: number;
  canonical_partial?: Partial<EchoSoulCanonicalResponse>;
}

export interface ProviderQuotaInfo {
  provider_id: string;
  tier: ProviderTier;
  is_available: boolean;
  estimated_credits_remaining?: number | null;
  rate_limit_rpm?: number;
  rate_limit_remaining?: number;
  status_message: string;
  is_runtime_production_supported: boolean;
}

export interface AIProvider {
  readonly id: string;
  readonly name: string;
  readonly tier: ProviderTier;

  /**
   * Checks whether this provider is currently configured, authenticated,
   * and capable of executing runtime requests.
   */
  isAvailable(): Promise<boolean> | boolean;

  /**
   * Executes inference and returns the raw generation output.
   */
  generate(input: ProviderGenerationInput): Promise<ProviderGenerationOutput>;

  /**
   * Optional streaming generation returning SSE / text stream.
   */
  generateStream?(input: ProviderGenerationInput): Promise<ReadableStream<Uint8Array>>;

  /**
   * Returns current quota/credit status if exposed by the provider.
   */
  getQuotaInfo(): Promise<ProviderQuotaInfo>;
}
