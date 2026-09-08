/**
 * EchoSoul — Speech-to-Text Adapter Interface
 *
 * Stage 3 will wire up a real STT provider (e.g., Google STT, Whisper via OpenRouter).
 * For now this defines the interface and a stub.
 *
 * SECURITY: Audio processing happens server-side. Audio bytes never go
 * directly from the browser to a third-party provider with the API key exposed.
 */

export interface TranscribeRequest {
  /** Raw audio data as a Buffer or base64 string */
  audio: Buffer | string;
  /** MIME type, e.g. "audio/webm;codecs=opus" */
  mimeType: string;
  /** BCP-47 language hint, e.g. "en-IN", "hi-IN" */
  languageHint?: string;
}

export interface TranscribeResponse {
  transcript: string;
  /** Detected or confirmed language code */
  language: string;
  /** Provider confidence score 0-1 when available */
  confidence?: number;
  /** Provider that performed the transcription */
  provider: string;
}

export interface SpeechToTextAdapter {
  transcribe(request: TranscribeRequest): Promise<TranscribeResponse>;
  readonly providerName: string;
}

// ── Stub Implementation ────────────────────────────────────────────────────

/**
 * Stub adapter — returns a placeholder until Stage 3.
 * Replace with a real adapter (WhisperAdapter, GoogleSTTAdapter, etc.).
 */
export class SpeechToTextStub implements SpeechToTextAdapter {
  readonly providerName = "stub";

  async transcribe(_request: TranscribeRequest): Promise<TranscribeResponse> {
    throw new Error(
      "SpeechToTextAdapter is not yet connected. " +
        "Voice transcription will be implemented in Stage 3. " +
        "See docs/SETUP.md for the stage plan."
    );
  }
}
