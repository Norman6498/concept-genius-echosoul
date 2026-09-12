/**
 * EchoSoul Model Adapter — Base Abstract Class
 * 
 * All OpenRouter model adapters MUST extend this class.
 * The rest of EchoSoul must never know which model generated a response.
 * 
 * @version echosoul_adapter_base_v1
 */

import {
  EchoSoulCanonicalResponse,
  SAFE_FALLBACK_RESPONSE,
  SafetyLevel,
} from "@/ai/contracts/response-schema";

export interface PersonalizationContext {
  profile: {
    name: string;
    role: string;
    life_stage?: string;
  };
  preferences: {
    support_style: string;
    literature_style?: string;
    music_genres?: string[];
    language?: string;
  };
  goals: string[];
  interests: string[];
  appearance: {
    theme: string;
    environment: string;
  };
  current_state: {
    mood?: string;
    focus?: string;
    time_of_day?: string;
  };
  /** Only RELEVANT recent messages, not the full history. */
  relevant_history: Array<{
    role: "user" | "assistant";
    content: string;
    created_at: string;
  }>;
  relevant_moments: Array<{
    title: string;
    theme: string;
    created_at: string;
  }>;
}

export interface EchoSoulGenerationInput {
  message: string;
  conversation_id: string;
  user_id: string;
  personalization: PersonalizationContext;
  is_voice: boolean;
  request_id: string;
}

export interface EchoSoulRawGeneration {
  raw_content: string;
  finish_reason?: string;
  tokens_used?: number;
  model_id: string;
  latency_ms: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/** Maximum retry attempts before falling back to the fallback model. */
const MAX_RETRIES = 2;

export abstract class BaseEchoSoulModelAdapter {
  abstract readonly modelId: string;
  abstract readonly adapterVersion: string;

  /**
   * Call the underlying model API.
   * Must be implemented by each concrete adapter.
   */
  protected abstract callModel(
    input: EchoSoulGenerationInput,
    systemPrompt: string
  ): Promise<EchoSoulRawGeneration>;

  /**
   * Normalize raw model output into the canonical schema.
   * Must be implemented by each concrete adapter.
   */
  abstract normalize(raw: EchoSoulRawGeneration, input: EchoSoulGenerationInput): Promise<Partial<EchoSoulCanonicalResponse>>;

  /**
   * Validate canonical response structure.
   */
  validate(response: Partial<EchoSoulCanonicalResponse>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!response.content || response.content.trim().length === 0) {
      errors.push("content is required and must be non-empty");
    }
    if (!response.presentation_mode) {
      warnings.push("presentation_mode missing, defaulting to conversational");
    }
    if (!response.tone) {
      warnings.push("tone missing, defaulting to gentle");
    }
    if (response.safety_level === undefined || response.safety_level === null) {
      errors.push("safety_level is required");
    }
    if (response.literature && !response.literature.retrieval_verified) {
      errors.push("literature.retrieval_verified must be true — never use AI-hallucinated quotes");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Attempt to repair a partially invalid canonical response.
   */
  protected repair(
    partial: Partial<EchoSoulCanonicalResponse>
  ): Partial<EchoSoulCanonicalResponse> {
    return {
      ...partial,
      presentation_mode: partial.presentation_mode ?? "conversational",
      tone: partial.tone ?? "gentle",
      intent: partial.intent ?? "unknown",
      need: partial.need ?? "unknown",
      emotional_context: partial.emotional_context ?? { label: null, confidence: 0 },
      reflection: partial.reflection ?? null,
      practical_insight: partial.practical_insight ?? null,
      practical_steps: partial.practical_steps ?? [],
      literature: partial.literature ?? null,
      music: partial.music ?? null,
      visual: partial.visual ?? null,
      journey: partial.journey ?? null,
      moment_candidate: partial.moment_candidate ?? null,
      letter: partial.letter ?? null,
      recommended_actions: partial.recommended_actions ?? [],
      personalization_reason: partial.personalization_reason ?? null,
      safety_level: partial.safety_level ?? 0,
      citations: partial.citations ?? [],
    };
  }

  /**
   * Main entry point. Runs the full generate → normalize → validate → repair/retry pipeline.
   */
  async generate(
    input: EchoSoulGenerationInput,
    systemPrompt: string
  ): Promise<EchoSoulCanonicalResponse> {
    const start = Date.now();
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const raw = await this.callModel(input, systemPrompt);
        const normalized = await this.normalize(raw, input);
        const repaired = this.repair(normalized);
        const validation = this.validate(repaired);

        if (!validation.valid && attempt < MAX_RETRIES - 1) {
          console.warn(`[EchoSoulAdapter] Validation failed on attempt ${attempt + 1}:`, validation.errors);
          continue;
        }

        return this.finalizeResponse(repaired, raw, start, !validation.valid, attempt > 0);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.error(`[EchoSoulAdapter] Attempt ${attempt + 1} failed:`, lastError.message);
      }
    }

    // All retries failed — return safe fallback
    console.error("[EchoSoulAdapter] All retries exhausted, returning fallback.");
    return {
      ...SAFE_FALLBACK_RESPONSE,
      response_id: input.request_id,
      _meta: {
        model_id: this.modelId,
        prompt_version: "fallback",
        adapter_version: this.adapterVersion,
        latency_ms: Date.now() - start,
        fallback_used: true,
        repair_applied: false,
        created_at: new Date().toISOString(),
      },
    };
  }

  private finalizeResponse(
    partial: Partial<EchoSoulCanonicalResponse>,
    raw: EchoSoulRawGeneration,
    startTime: number,
    repairApplied: boolean,
    retried: boolean
  ): EchoSoulCanonicalResponse {
    return {
      response_id: partial.response_id ?? crypto.randomUUID(),
      content: partial.content!,
      presentation_mode: partial.presentation_mode ?? "conversational",
      tone: partial.tone ?? "gentle",
      intent: partial.intent ?? "unknown",
      need: partial.need ?? "unknown",
      emotional_context: partial.emotional_context ?? { label: null, confidence: 0 },
      reflection: partial.reflection ?? null,
      practical_insight: partial.practical_insight ?? null,
      practical_steps: partial.practical_steps ?? [],
      literature: partial.literature ?? null,
      music: partial.music ?? null,
      visual: partial.visual ?? null,
      journey: partial.journey ?? null,
      moment_candidate: partial.moment_candidate ?? null,
      letter: partial.letter ?? null,
      recommended_actions: partial.recommended_actions ?? [],
      personalization_reason: partial.personalization_reason ?? null,
      safety_level: (partial.safety_level ?? 0) as SafetyLevel,
      citations: partial.citations ?? [],
      quality: partial.quality ?? {
        schema_valid: true,
        personalization_valid: true,
        safety_valid: true,
        provenance_valid: true,
        quality_score: 80,
        issues: [],
        repair_required: repairApplied,
      },
      _meta: {
        model_id: raw.model_id,
        prompt_version: "echosoul_response_v1",
        adapter_version: this.adapterVersion,
        latency_ms: Date.now() - startTime,
        tokens_used: raw.tokens_used,
        fallback_used: retried,
        repair_applied: repairApplied,
        created_at: new Date().toISOString(),
      },
    };
  }
}
