/**
 * EchoSoul — AI Provider Interface Definitions
 *
 * All AI operations in EchoSoul go through these interfaces.
 * No application logic may call a provider SDK directly.
 * Swapping providers (e.g., from OpenRouter to Anthropic) means
 * writing a new adapter that satisfies these types — nothing else changes.
 *
 * SECURITY: These interfaces are server-side only.
 * Never import them into client components.
 */

// ── Message Types ──────────────────────────────────────────────────────────

export type MessageRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

// ── Request / Response Types ───────────────────────────────────────────────

export interface ChatRequest {
  messages: ChatMessage[];
  /** Model override. Falls back to OPENROUTER_CHAT_MODEL env var. */
  model?: string;
  /** Max tokens to generate */
  maxTokens?: number;
  /** Temperature (0-2). Default: 0.7 */
  temperature?: number;
  /** If true, returns an async iterable of chunks */
  stream?: boolean;
}

export interface ChatResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: string;
}

export interface StructuredOutputRequest<T> extends Omit<ChatRequest, "stream"> {
  /** Zod schema or JSON schema describing the expected output */
  schema: unknown;
  /** Human-readable description of the schema for the model */
  schemaDescription?: string;
}

export interface StructuredOutputResponse<T> {
  data: T;
  model: string;
  usage?: ChatResponse["usage"];
}

export interface ClassifyRequest {
  text: string;
  labels: string[];
  model?: string;
}

export interface ClassifyResponse {
  label: string;
  confidence?: number;
  model: string;
}

export interface EmbedRequest {
  texts: string[];
  model?: string;
}

export interface EmbedResponse {
  embeddings: number[][];
  model: string;
  usage?: { totalTokens: number };
}

// ── Provider Interface ─────────────────────────────────────────────────────

/**
 * AIProvider — the central interface all AI adapters must implement.
 *
 * Methods:
 * - chat()            — conversational generation
 * - structuredOutput() — JSON output conforming to a schema
 * - classify()        — label selection from a fixed set
 * - embed()           — vector embedding (when provider supports it)
 */
export interface AIProvider {
  /**
   * Generate a chat completion.
   * Returns a single response or, if stream=true, an async iterable of chunks.
   */
  chat(request: ChatRequest): Promise<ChatResponse>;

  /**
   * Generate output that conforms to a provided schema.
   * Validates the response; throws if the model produces malformed JSON.
   */
  structuredOutput<T>(request: StructuredOutputRequest<T>): Promise<StructuredOutputResponse<T>>;

  /**
   * Classify text into one of the provided labels.
   */
  classify(request: ClassifyRequest): Promise<ClassifyResponse>;

  /**
   * Generate vector embeddings.
   * Not all providers support this — adapters may throw NotSupportedError.
   */
  embed(request: EmbedRequest): Promise<EmbedResponse>;

  /**
   * Returns the name/identifier of this provider adapter.
   * Used for logging and observability (never for routing secrets).
   */
  readonly providerName: string;
}

// ── Error Types ────────────────────────────────────────────────────────────

export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly provider: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}

export class AIProviderRateLimitError extends AIProviderError {
  constructor(provider: string, retryAfterSeconds?: number) {
    super(
      `Rate limit exceeded for provider: ${provider}${retryAfterSeconds ? `. Retry after ${retryAfterSeconds}s` : ""}`,
      "RATE_LIMIT",
      provider
    );
    this.name = "AIProviderRateLimitError";
  }
}

export class AIProviderNotSupportedError extends AIProviderError {
  constructor(provider: string, feature: string) {
    super(
      `Feature "${feature}" is not supported by provider: ${provider}`,
      "NOT_SUPPORTED",
      provider
    );
    this.name = "AIProviderNotSupportedError";
  }
}
