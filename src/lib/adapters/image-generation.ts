/**
 * EchoSoul — Image Generation Adapter Interface
 *
 * Stage 8 will connect a real image generation provider
 * (e.g., Flux, Ideogram, DALL-E via OpenRouter).
 *
 * Generated images are PRIVATE by default (stored in private Supabase Storage).
 * A public URL is only generated if the user explicitly shares/exports.
 */

export interface ImageGenerationRequest {
  prompt: string;
  /** Negative prompt — what to avoid */
  negativePrompt?: string;
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Number of images to generate */
  count?: number;
  /** Provider-specific style hint */
  style?: string;
  /** Internal job ID for tracking */
  jobId?: string;
}

export interface GeneratedImage {
  /** Temporary URL or storage reference */
  url: string;
  /** Whether this URL is publicly accessible */
  isPublic: boolean;
  /** Width in pixels */
  width: number;
  /** Height: in pixels */
  height: number;
  provider: string;
}

export interface ImageGenerationResponse {
  images: GeneratedImage[];
  provider: string;
}

export interface ImageGenerationAdapter {
  generate(request: ImageGenerationRequest): Promise<ImageGenerationResponse>;
  readonly providerName: string;
}

// ── Stub ───────────────────────────────────────────────────────────────────

export class ImageGenerationStub implements ImageGenerationAdapter {
  readonly providerName = "stub";

  async generate(_request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    throw new Error(
      "ImageGenerationAdapter is not yet connected. " +
        "Image generation will be implemented in Stage 8."
    );
  }
}
