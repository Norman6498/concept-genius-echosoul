/**
 * EchoSoul — Video Generation Adapter Interface
 *
 * Stage 9 will connect an async video generation provider
 * (e.g., RunwayML, Kling, Sora).
 *
 * Video generation is ALWAYS async (job-based). The job is queued,
 * a job ID is returned, and the client polls for completion.
 * Generated videos are PRIVATE by default.
 *
 * IMPORTANT: Video is an optional creative experience.
 * It must never block the core conversation/emotional support flow.
 */

export type VideoJobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export interface VideoGenerationRequest {
  prompt: string;
  /** Duration hint in seconds */
  durationHint?: number;
  /** Visual style reference */
  style?: string;
  /** Reference image URL (for image-to-video) */
  referenceImageUrl?: string;
  /** Internal EchoSoul job ID */
  echoSoulJobId: string;
}

export interface VideoJobResult {
  jobId: string;
  providerJobId?: string;
  status: VideoJobStatus;
  /** URL of the completed video (only when status === "completed") */
  videoUrl?: string;
  /** Error message (only when status === "failed") */
  errorMessage?: string;
  provider: string;
}

export interface VideoGenerationAdapter {
  /** Submit a video generation job. Returns job ID and initial status. */
  createJob(request: VideoGenerationRequest): Promise<VideoJobResult>;
  /** Poll job status. */
  getJob(providerJobId: string): Promise<VideoJobResult>;
  /** Cancel a running job if supported. */
  cancelJob(providerJobId: string): Promise<void>;
  readonly providerName: string;
}

// ── Stub ───────────────────────────────────────────────────────────────────

export class VideoGenerationStub implements VideoGenerationAdapter {
  readonly providerName = "stub";

  async createJob(_request: VideoGenerationRequest): Promise<VideoJobResult> {
    throw new Error("VideoGenerationAdapter not connected. Stage 9.");
  }

  async getJob(_providerJobId: string): Promise<VideoJobResult> {
    throw new Error("VideoGenerationAdapter not connected. Stage 9.");
  }

  async cancelJob(_providerJobId: string): Promise<void> {
    throw new Error("VideoGenerationAdapter not connected. Stage 9.");
  }
}
