/**
 * Base AI Provider Abstract Class
 * 
 * Provides common network resilience, timeout aborting, error handling,
 * and safe telemetry tracking for all Solenne model providers.
 */

import { AIProvider, ProviderGenerationInput, ProviderGenerationOutput, ProviderQuotaInfo, ProviderTier } from "./types";
import { sanitizeAiText } from "@/ai/adapters/openrouter";

export abstract class BaseAIProvider implements AIProvider {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly tier: ProviderTier;

  abstract isAvailable(): Promise<boolean> | boolean;
  abstract generate(input: ProviderGenerationInput): Promise<ProviderGenerationOutput>;
  abstract getQuotaInfo(): Promise<ProviderQuotaInfo>;

  /**
   * Protected helper to execute a fetch request with timeout abort signal.
   */
  protected async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeoutMs: number = 15000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Sanitizes model generated content to remove chain-of-thought or meta-prompts.
   */
  protected sanitizeText(text: string, defaultText?: string): string {
    return sanitizeAiText(text, { defaultText });
  }

  /**
   * Safe JSON parser for structured model responses.
   */
  protected parseJsonResponse(raw: string): Record<string, unknown> | null {
    let jsonStr = (raw ?? "").trim();
    if (jsonStr.includes("```")) {
      const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) jsonStr = match[1].trim();
    }

    try {
      return JSON.parse(jsonStr);
    } catch {
      const firstBrace = jsonStr.indexOf("{");
      const lastBrace = jsonStr.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        try {
          return JSON.parse(jsonStr.slice(firstBrace, lastBrace + 1));
        } catch {
          return null;
        }
      }
      return null;
    }
  }
}
