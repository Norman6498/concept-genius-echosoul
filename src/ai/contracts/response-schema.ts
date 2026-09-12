/**
 * EchoSoul Canonical AI Response Schema
 * 
 * Every OpenRouter model, regardless of provider, MUST produce this schema
 * after being processed by its adapter. The frontend NEVER consumes raw
 * model output — only this normalized contract.
 * 
 * @version echosoul_response_v1
 */

export type PresentationMode = "conversational" | "letter" | "literary" | "practical_plan";

export type SupportTone =
  | "gentle"
  | "balanced"
  | "direct"
  | "reflective"
  | "practical"
  | "motivational"
  | "curious";

export type UserNeed =
  | "listening"
  | "understanding"
  | "practical_help"
  | "reflection"
  | "inspiration"
  | "entertainment"
  | "literature"
  | "music"
  | "visual"
  | "guidance"
  | "unknown";

export type SafetyLevel = 0 | 1 | 2 | 3;
// 0 = ordinary conversation
// 1 = meaningful distress
// 2 = self-harm / suicidal ideation, no immediate danger
// 3 = imminent danger / active attempt — override to crisis resources

export interface LiterarySource {
  author: string;
  work: string;
  passage_id?: string;
  language: string;
  script?: string;
  publication_year?: number;
  rights_status: "public_domain" | "licensed" | "unknown";
  source_url?: string;
}

export interface LiteratureRecommendation {
  passage: string;
  source: LiterarySource;
  meaning: string;
  why_it_connects: string;
  confidence: number;
  // NEVER allow AI-generated fake attribution — must come from retrieval system
  retrieval_verified: boolean;
}

export interface MusicRecommendation {
  title: string;
  artist?: string;
  mood_tags: string[];
  language?: string;
  playlist_id?: string;
  duration_minutes?: number;
}

export interface VisualRecommendation {
  environment: string;
  description: string;
  image_path?: string;
}

export interface JourneyUpdate {
  type: "goal_progress" | "moment_candidate" | "theme_detected" | "milestone";
  description: string;
  data?: Record<string, unknown>;
}

export interface MomentCandidate {
  title: string;
  theme: string;
  type: "achievement" | "breakthrough" | "reflection" | "milestone";
  why_meaningful: string;
  should_prompt_user: boolean;
}

export interface LetterPresentation {
  title: string;
  opening: string;
  body: string;
  meaning: string;
  why_this_matters: string;
  practical_insight?: string;
  literature_source?: LiterarySource;
  actions: Array<{
    label: string;
    action: string;
  }>;
}

export interface QualityEvaluation {
  schema_valid: boolean;
  personalization_valid: boolean;
  safety_valid: boolean;
  provenance_valid: boolean;
  /** 0–100. <70 triggers fallback, 70–84 triggers repair, >=85 accepted. */
  quality_score: number;
  issues: string[];
  repair_required: boolean;
}

/** The single canonical response contract every model adapter must produce. */
export interface EchoSoulCanonicalResponse {
  response_id: string;

  /** The primary user-facing text response. */
  content: string;

  presentation_mode: PresentationMode;

  tone: SupportTone;

  /** What the AI understood the user's request to be. */
  intent: string;

  /** What the AI determined the user actually needs. */
  need: UserNeed;

  emotional_context: {
    label: string | null;
    confidence: number; // 0–1
  };

  /** Optional reflective perspective on the situation. */
  reflection: string | null;

  /** Concise practical insight (not advice). */
  practical_insight: string | null;

  /** Numbered steps when practical_plan mode is active. */
  practical_steps: string[];

  /** Authentic literature recommendation — ONLY from retrieval, never hallucinated. */
  literature: LiteratureRecommendation | null;

  music: MusicRecommendation | null;

  visual: VisualRecommendation | null;

  journey: JourneyUpdate | null;

  /** Candidate for saving as a Moment — requires user approval. */
  moment_candidate: MomentCandidate | null;

  /** Letter/parchment presentation data when mode is "letter". */
  letter: LetterPresentation | null;

  recommended_actions: Array<{
    label: string;
    action: string;
    icon?: string;
  }>;

  /** Why this specific response was generated for this user. */
  personalization_reason: string | null;

  safety_level: SafetyLevel;

  citations: LiterarySource[];

  quality: QualityEvaluation;

  /** Internal metadata — never exposed to frontend. */
  _meta: {
    model_id: string;
    prompt_version: string;
    adapter_version: string;
    latency_ms: number;
    tokens_used?: number;
    fallback_used: boolean;
    repair_applied: boolean;
    created_at: string;
  };
}

/** Minimal safe fallback response when all retries fail. */
export const SAFE_FALLBACK_RESPONSE: Omit<EchoSoulCanonicalResponse, "_meta"> = {
  response_id: "fallback",
  content: "I'm having a little trouble gathering my thoughts. Give me a moment.",
  presentation_mode: "conversational",
  tone: "gentle",
  intent: "unknown",
  need: "unknown",
  emotional_context: { label: null, confidence: 0 },
  reflection: null,
  practical_insight: null,
  practical_steps: [],
  literature: null,
  music: null,
  visual: null,
  journey: null,
  moment_candidate: null,
  letter: null,
  recommended_actions: [],
  personalization_reason: null,
  safety_level: 0,
  citations: [],
  quality: {
    schema_valid: false,
    personalization_valid: false,
    safety_valid: true,
    provenance_valid: true,
    quality_score: 0,
    issues: ["fallback_triggered"],
    repair_required: false,
  },
};
