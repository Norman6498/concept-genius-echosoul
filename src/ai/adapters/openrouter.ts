/**
 * EchoSoul OpenRouter Adapter
 * 
 * Concrete adapter for OpenRouter API. Reads model from environment
 * configuration — never hard-codes model IDs.
 * 
 * Environment variables:
 *   ECHOSOUL_PRIMARY_MODEL     — main conversational model
 *   ECHOSOUL_FAST_MODEL        — quick responses
 *   ECHOSOUL_REASONING_MODEL   — deep reflection
 *   ECHOSOUL_FALLBACK_MODEL    — last resort
 *   OPENROUTER_API_KEY         — required
 *   OPENROUTER_BASE_URL        — defaults to https://openrouter.ai/api/v1
 * 
 * @version echosoul_openrouter_adapter_v1
 */

import {
  BaseEchoSoulModelAdapter,
  EchoSoulGenerationInput,
  EchoSoulRawGeneration,
} from "@/ai/adapters/base";
import { EchoSoulCanonicalResponse } from "@/ai/contracts/response-schema";
import { buildSystemPrompt } from "@/ai/prompts/system";

export type ModelRole = "primary" | "fast" | "reasoning" | "fallback" | "literature" | "voice";

export interface OpenRouterAdapterOptions {
  modelRole?: ModelRole;
  customModelId?: string;
  models?: string[];
  maxTokens?: number;
  temperature?: number;
  providerRouting?: {
    sort?: "latency" | "throughput" | "price";
    order?: string[];
    allow_fallbacks?: boolean;
  };
  timeoutMs?: number;
}

const MODEL_ENV_MAP: Record<ModelRole, string> = {
  primary: "ECHOSOUL_PRIMARY_MODEL",
  fast: "ECHOSOUL_FAST_MODEL",
  reasoning: "ECHOSOUL_REASONING_MODEL",
  fallback: "ECHOSOUL_FALLBACK_MODEL",
  literature: "ECHOSOUL_LITERATURE_MODEL",
  voice: "ECHOSOUL_VOICE_MODEL",
};

const DEFAULT_MODELS: Record<ModelRole, string> = {
  primary: "poolside/laguna-s-2.1:free",
  fast: "poolside/laguna-s-2.1:free",
  reasoning: "nex-agi/nex-n2.5-pro:free",
  fallback: "nex-agi/nex-n2.5-mini:free",
  literature: "poolside/laguna-s-2.1:free",
  voice: "poolside/laguna-s-2.1:free",
};

function getModelId(role: ModelRole): string {
  const envVar = MODEL_ENV_MAP[role];
  return process.env[envVar] ?? DEFAULT_MODELS[role];
}

const BASE_URL =
  process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";

export function sanitizeAiText(
  text: string,
  context?: { isQuoteRequest?: boolean; defaultText?: string }
): string {
  if (!text || typeof text !== "string") {
    return context?.defaultText ?? "";
  }

  // 1. Remove XML-like reasoning and thinking tags
  let clean = text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<thought>[\s\S]*?<\/thought>/gi, "")
    .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, "")
    .replace(/<internal>[\s\S]*?<\/internal>/gi, "")
    .trim();

  // 2. Remove typical chain-of-thought blocks like "Here's a thinking process:\n..."
  clean = clean.replace(/Here'?s (?:a )?thinking process:[\s\S]*?(?=(?:\n\n[A-Z"“])|$)/gi, "").trim();
  clean = clean.replace(/Thinking Process:[\s\S]*?(?=(?:\n\n[A-Z"“])|$)/gi, "").trim();

  // 3. Remove step-by-step analysis prefixes like "1. Analyze User Input: ... 2. Identify Requirements: ..."
  clean = clean.replace(/^\d+\.\s*(?:Analyze|Identify|Check|Review|Evaluate)[\s\S]*?(?=(?:\n\n[A-Z"“])|$)/gim, "").trim();

  // 4. Filter line-by-line: eliminate lines that start with meta-planning or 3rd-person observer narration
  const lines = clean.split("\n");
  const filteredLines = lines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return true;
    const lower = trimmed.toLowerCase();

    // Meta reasoning / planning phrases
    if (
      lower.startsWith("the user is asking") ||
      lower.startsWith("the user wants") ||
      lower.startsWith("the user:") ||
      lower.startsWith("user wants") ||
      lower.startsWith("i need to suggest") ||
      lower.startsWith("i should suggest") ||
      lower.startsWith("i should follow") ||
      lower.startsWith("so we need") ||
      lower.startsWith("we need answer") ||
      lower.startsWith("constraint:") ||
      lower.startsWith("target audience:") ||
      lower.startsWith("format: just title") ||
      lower.startsWith("looking at the response") ||
      lower.startsWith("principle ") ||
      lower.startsWith("the retrieval system") ||
      lower.startsWith("the user's personalization") ||
      lower.startsWith("let's analyze") ||
      lower.startsWith("let me think") ||
      lower.startsWith("step 1:") ||
      lower.startsWith("step 2:")
    ) {
      return false;
    }
    return true;
  });

  clean = filteredLines.join("\n").trim();

  // 5. If everything was stripped or text is still contaminated with meta-prompts
  const lowerClean = clean.toLowerCase();
  const isContaminated =
    clean.length < 5 ||
    lowerClean.includes("the user is asking") ||
    lowerClean.includes("i need to suggest") ||
    lowerClean.includes("principle 8") ||
    lowerClean.includes("the retrieval system");

  if (isContaminated) {
    if (context?.defaultText) {
      return context.defaultText;
    }
    // Check if there was an actual quote buried inside
    const quoteMatch = text.match(/(?:“|")([^"”]{10,})(?:”|")(?:\s*—\s*([^.]+))?/);
    if (quoteMatch) {
      return `"${quoteMatch[1].trim()}"${quoteMatch[2] ? `\n\n— ${quoteMatch[2].trim()}` : ""}`;
    }
    return "“You have power over your mind — not outside events. Realize this, and you will find strength.”\n\n— Marcus Aurelius, Meditations";
  }

  return clean;
}

export class OpenRouterAdapter extends BaseEchoSoulModelAdapter {
  readonly modelId: string;
  readonly adapterVersion = "echosoul_openrouter_adapter_v1";
  readonly options?: OpenRouterAdapterOptions;

  constructor(roleOrOptions: ModelRole | OpenRouterAdapterOptions = "primary") {
    super();
    if (typeof roleOrOptions === "string") {
      this.modelId = getModelId(roleOrOptions);
      this.options = { modelRole: roleOrOptions };
    } else {
      this.modelId =
        roleOrOptions.customModelId ??
        (roleOrOptions.modelRole ? getModelId(roleOrOptions.modelRole) : getModelId("primary"));
      this.options = {
        ...roleOrOptions,
        models: roleOrOptions.models ? roleOrOptions.models.slice(0, 3) : undefined,
      };
    }
  }

  protected async callModel(
    input: EchoSoulGenerationInput,
    systemPrompt: string
  ): Promise<EchoSoulRawGeneration> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    const start = Date.now();

    // Build conversation history with minimal context (only relevant)
    const messages = [
      {
        role: "system" as const,
        content: systemPrompt,
      },
      ...input.personalization.relevant_history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      {
        role: "user" as const,
        content: input.message,
      },
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.options?.timeoutMs ?? 15000);

    const payload: Record<string, unknown> = {
      messages,
      temperature: this.options?.temperature ?? 0.7,
      max_tokens: this.options?.maxTokens ?? (input.is_voice ? 200 : 1500),
    };

    if (this.options?.models && this.options.models.length > 0) {
      const modelsList = this.options.models.slice(0, 3);
      if (modelsList.length > 3) {
        throw new Error(
          `[OpenRouterAdapter] Configuration error: OpenRouter 'models' array must have 3 items or fewer (received ${modelsList.length})`
        );
      }
      payload.models = modelsList;
    } else {
      payload.model = this.modelId;
    }

    if (this.options?.providerRouting) {
      payload.provider = this.options.providerRouting;
    }

    let response: Response;
    try {
      response = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://solenne.app",
          "X-Title": "Solenne",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error ${response.status}: ${error}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";

    return {
      raw_content: content,
      finish_reason: data.choices?.[0]?.finish_reason,
      tokens_used: data.usage?.total_tokens,
      model_id: this.modelId,
      latency_ms: Date.now() - start,
    };
  }

  async normalize(
    raw: EchoSoulRawGeneration,
    input: EchoSoulGenerationInput
  ): Promise<Partial<EchoSoulCanonicalResponse>> {
    let parsed: Record<string, unknown> | null = null;
    let jsonStr = (raw.raw_content ?? "").trim();

    // Strip markdown code fences if present
    if (jsonStr.includes("```")) {
      const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) jsonStr = match[1].trim();
    }

    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      // Find JSON object bounds {...} if mixed with reasoning
      const firstBrace = jsonStr.indexOf("{");
      const lastBrace = jsonStr.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        try {
          parsed = JSON.parse(jsonStr.slice(firstBrace, lastBrace + 1));
        } catch {
          // fallback to raw text
        }
      }
    }

    const defaultContent = input.is_voice
      ? "I am here with you. Take a gentle breath, and let us take this one step at a time."
      : "I am listening. Whatever you are carrying right now, you do not have to carry it alone.";

    if (!parsed) {
      return {
        response_id: input.request_id,
        content: sanitizeAiText(raw.raw_content, { defaultText: defaultContent }),
        presentation_mode: "conversational",
        tone: "gentle",
        intent: "unknown",
        need: "unknown",
        emotional_context: { label: null, confidence: 0 },
        safety_level: 0,
      };
    }

    const rawContent = (parsed.content as string) ?? raw.raw_content ?? "";
    const rawReflection = typeof parsed.reflection === "string" ? parsed.reflection : null;
    const rawInsight = typeof parsed.practical_insight === "string" ? parsed.practical_insight : null;

    const cleanContent = sanitizeAiText(rawContent, { defaultText: defaultContent });
    const cleanReflection = rawReflection ? sanitizeAiText(rawReflection) : null;
    const cleanInsight = rawInsight ? sanitizeAiText(rawInsight) : null;

    return {
      response_id: input.request_id,
      content: cleanContent,
      presentation_mode: (parsed.presentation_mode as string ?? "conversational") as EchoSoulCanonicalResponse["presentation_mode"],
      tone: (parsed.tone as string ?? "gentle") as EchoSoulCanonicalResponse["tone"],
      intent: (parsed.intent as string) ?? "unknown",
      need: (parsed.need as string ?? "unknown") as EchoSoulCanonicalResponse["need"],
      emotional_context: (parsed.emotional_context as EchoSoulCanonicalResponse["emotional_context"]) ?? {
        label: null,
        confidence: 0,
      },
      reflection: cleanReflection,
      practical_insight: cleanInsight,
      practical_steps: Array.isArray(parsed.practical_steps) ? (parsed.practical_steps as string[]) : [],
      literature: null, // Literature comes from retrieval system, not model
      music: (parsed.music as EchoSoulCanonicalResponse["music"]) ?? null,
      visual: (parsed.visual as EchoSoulCanonicalResponse["visual"]) ?? null,
      journey: (parsed.journey as EchoSoulCanonicalResponse["journey"]) ?? null,
      moment_candidate: (parsed.moment_candidate as EchoSoulCanonicalResponse["moment_candidate"]) ?? null,
      letter: (parsed.letter as EchoSoulCanonicalResponse["letter"]) ?? null,
      recommended_actions: (parsed.recommended_actions as EchoSoulCanonicalResponse["recommended_actions"]) ?? [],
      personalization_reason: (parsed.personalization_reason as string) ?? null,
      safety_level: (Number(parsed.safety_level ?? 0)) as EchoSoulCanonicalResponse["safety_level"],
      citations: [],
    };
  }
}
