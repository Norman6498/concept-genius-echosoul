/**
 * EchoSoul — OpenRouter AI Adapter
 *
 * Implements AIProvider using the OpenRouter API.
 * OpenRouter is an aggregator that routes to many models under one API key.
 * The model is configurable via environment variables — never hardcoded.
 *
 * SECURITY:
 * - OPENROUTER_API_KEY must exist ONLY in server-side process.env.
 * - Never import this file from client components or the browser bundle.
 * - The key is NOT logged, NOT included in error messages, NOT returned
 *   to the browser under any circumstance.
 *
 * Reference: https://openrouter.ai/docs
 */

import {
  AIProvider,
  AIProviderError,
  AIProviderNotSupportedError,
  AIProviderRateLimitError,
  type ChatRequest,
  type ChatResponse,
  type ClassifyRequest,
  type ClassifyResponse,
  type EmbedRequest,
  type EmbedResponse,
  type StructuredOutputRequest,
  type StructuredOutputResponse,
} from "./types";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

/**
 * Read model configuration from environment variables.
 * Returns the resolved model ID or a fallback.
 * Models are intentionally configurable so the project can change them
 * without touching application code.
 */
function resolveModel(
  override: string | undefined,
  envKey: "OPENROUTER_CHAT_MODEL" | "OPENROUTER_FAST_MODEL" | "OPENROUTER_REASONING_MODEL"
): string {
  return (
    override ??
    process.env[envKey] ??
    "google/gemma-3-27b-it:free" // fallback — update OPENROUTER_CHAT_MODEL in .env.local
  );
}

/**
 * Construct the Authorization header value.
 * Key is read at call-time, never cached as a module-level constant
 * (avoids the key surviving in memory longer than necessary).
 */
function getAuthHeader(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new AIProviderError(
      "OPENROUTER_API_KEY is not configured. Add it to .env.local (server-side only).",
      "MISSING_API_KEY",
      "openrouter"
    );
  }
  return `Bearer ${key}`;
}

/**
 * Shared fetch wrapper with error handling.
 * Never includes the API key in error messages or logs.
 */
async function openRouterFetch(
  path: string,
  body: Record<string, unknown>
): Promise<Response> {
  const response = await fetch(`${OPENROUTER_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
      // OpenRouter routing headers — identify the app (no secrets here)
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "Solenne",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    if (response.status === 429) {
      const retryAfter = response.headers.get("retry-after");
      throw new AIProviderRateLimitError(
        "openrouter",
        retryAfter ? parseInt(retryAfter, 10) : undefined
      );
    }

    // Read error body but NEVER log the request body (may contain user content)
    let errorDetail = "";
    try {
      const errJson = (await response.json()) as { error?: { message?: string } };
      errorDetail = errJson.error?.message ?? "";
    } catch {
      errorDetail = await response.text().catch(() => "");
    }

    throw new AIProviderError(
      `OpenRouter request failed (${response.status}): ${errorDetail}`,
      "REQUEST_FAILED",
      "openrouter",
      response.status
    );
  }

  return response;
}

// ── OpenRouterAdapter ──────────────────────────────────────────────────────

export class OpenRouterAdapter implements AIProvider {
  readonly providerName = "openrouter";

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const model = resolveModel(request.model, "OPENROUTER_CHAT_MODEL");

    const response = await openRouterFetch("/chat/completions", {
      model,
      messages: request.messages,
      max_tokens: request.maxTokens ?? 1024,
      temperature: request.temperature ?? 0.7,
      stream: false,
    });

    const data = (await response.json()) as {
      id: string;
      model: string;
      choices: Array<{
        message: { content: string };
        finish_reason: string;
      }>;
      usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
      };
    };

    const choice = data.choices[0];
    if (!choice) {
      throw new AIProviderError(
        "OpenRouter returned no choices",
        "EMPTY_RESPONSE",
        "openrouter"
      );
    }

    return {
      content: choice.message.content,
      model: data.model,
      finishReason: choice.finish_reason,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  }

  async structuredOutput<T>(
    request: StructuredOutputRequest<T>
  ): Promise<StructuredOutputResponse<T>> {
    const model = resolveModel(request.model, "OPENROUTER_CHAT_MODEL");

    // Instruct the model to respond with JSON matching the schema
    const systemMessage = {
      role: "system" as const,
      content:
        `Respond ONLY with valid JSON that matches the following schema. ` +
        `Do not add markdown, explanation, or code fences. ` +
        (request.schemaDescription
          ? `Schema description: ${request.schemaDescription}. `
          : "") +
        `Schema: ${JSON.stringify(request.schema)}`,
    };

    const chatResponse = await this.chat({
      ...request,
      messages: [systemMessage, ...request.messages],
      model,
    });

    let parsed: T;
    try {
      parsed = JSON.parse(chatResponse.content) as T;
    } catch {
      throw new AIProviderError(
        "OpenRouter returned invalid JSON for structured output request",
        "INVALID_JSON_RESPONSE",
        "openrouter"
      );
    }

    return {
      data: parsed,
      model: chatResponse.model,
      usage: chatResponse.usage,
    };
  }

  async classify(request: ClassifyRequest): Promise<ClassifyResponse> {
    const model = resolveModel(request.model, "OPENROUTER_FAST_MODEL");

    const response = await this.chat({
      model,
      messages: [
        {
          role: "system",
          content:
            `You are a text classifier. Given the text, respond with EXACTLY ONE of the ` +
            `following labels and nothing else: ${request.labels.join(", ")}`,
        },
        { role: "user", content: request.text },
      ],
      maxTokens: 32,
      temperature: 0,
    });

    const label = response.content.trim();
    if (!request.labels.includes(label)) {
      // Attempt to find a match in the response
      const matched = request.labels.find((l) =>
        response.content.toLowerCase().includes(l.toLowerCase())
      );
      if (!matched) {
        throw new AIProviderError(
          `Classifier returned unexpected label: "${label}"`,
          "INVALID_CLASSIFICATION",
          "openrouter"
        );
      }
      return { label: matched, model: response.model };
    }

    return { label, model: response.model };
  }

  async embed(_request: EmbedRequest): Promise<EmbedResponse> {
    // OpenRouter does not currently expose a dedicated embeddings endpoint.
    // Use a direct embedding provider (e.g., Voyage AI, OpenAI) when needed.
    // This will be wired up in the Stage 4 (Memory) implementation.
    throw new AIProviderNotSupportedError(
      "openrouter",
      "embed — use a dedicated embedding provider. See docs/OPENROUTER.md."
    );
  }
}
