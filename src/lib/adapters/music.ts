/**
 * EchoSoul — Music Adapter Interface
 *
 * EchoSoul may suggest ambient music or sound environments based on
 * the user's emotional context. Music is optional and user-controlled.
 *
 * A real implementation would connect to a music API
 * (e.g., Spotify for pre-existing tracks, or Suno/Udio for generation).
 * Stage TBD (after Stage 9).
 */

export interface MusicSuggestionRequest {
  emotion: string;
  intensity: number; // 0-10
  language?: string;
  durationHint?: number; // seconds
}

export interface MusicSuggestion {
  title: string;
  artist?: string;
  /** Playback URL or track reference */
  url?: string;
  /** Source or provider name */
  source: string;
  /** Whether rights are cleared for this use case */
  rightsStatus: "licensed" | "royalty_free" | "user_library" | "unknown";
}

export interface MusicAdapter {
  suggest(request: MusicSuggestionRequest): Promise<MusicSuggestion[]>;
  readonly providerName: string;
}

// ── Stub ───────────────────────────────────────────────────────────────────

export class MusicAdapterStub implements MusicAdapter {
  readonly providerName = "stub";

  async suggest(_request: MusicSuggestionRequest): Promise<MusicSuggestion[]> {
    throw new Error(
      "MusicAdapter is not yet connected. See stage plan for timeline."
    );
  }
}
