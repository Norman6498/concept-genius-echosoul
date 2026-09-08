/**
 * EchoSoul — Text-to-Speech Adapter Interface
 *
 * Stage 3 will wire up a real TTS provider (e.g., ElevenLabs, Google TTS).
 * For now this defines the interface and a stub.
 */

export interface SynthesizeRequest {
  text: string;
  /** BCP-47 language code */
  language: string;
  /** Voice profile identifier from the configured provider */
  voiceProfile?: string;
  /** Output audio format */
  format?: "mp3" | "ogg" | "wav";
}

export interface SynthesizeResponse {
  /** URL or data URI of the generated audio */
  audioUrl: string;
  /** Duration in seconds when known */
  durationSeconds?: number;
  provider: string;
}

export interface TextToSpeechAdapter {
  synthesize(request: SynthesizeRequest): Promise<SynthesizeResponse>;
  readonly providerName: string;
}

// ── Stub ───────────────────────────────────────────────────────────────────

export class TextToSpeechStub implements TextToSpeechAdapter {
  readonly providerName = "stub";

  async synthesize(_request: SynthesizeRequest): Promise<SynthesizeResponse> {
    throw new Error(
      "TextToSpeechAdapter is not yet connected. " +
        "TTS will be implemented in Stage 3."
    );
  }
}
