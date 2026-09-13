/**
 * EchoSoul AI Quality Router
 * 
 * Server-authoritative Model Router that evaluates complexity, emotional nuance,
 * and cognitive depth to selectively route requests between:
 * - Free/cheap models (low complexity, greetings, quick UI answers)
 * - Preferred standard models (medium reflection, practical steps)
 * - High-quality flagship models (deep existential questions, pattern analysis, Life Novel, Music Hermeneutics)
 * 
 * Enforces strict CREDIT PRESERVATION: Never burns expensive inference on low-stakes turns.
 * 
 * @version echosoul_quality_router_v1
 */

import { ProviderTier } from "@/ai/providers/types";
import { PersonalizationContext } from "@/ai/adapters/base";
import { SupervisorDecision } from "./supervisor";

export interface RoutingSignals {
  intent: string;
  complexityScore: number;       // 0 - 100
  emotionalNuanceScore: number;  // 0 - 100
  responseLengthTier: "short" | "medium" | "long";
  personalizationDepth: "surface" | "moderate" | "deep";
  literaryInterpretation: boolean;
  planningComplexity: "none" | "simple" | "multi_step";
  conversationImportance: "casual" | "reflective" | "vital";
  signalsDetected: string[];
}

export interface QualityRoutingDecision {
  tier: ProviderTier;
  targetModel: string;
  complexityScore: number;
  emotionalIntensity: number;
  reason: string;
  signalsDetected: string[];
  allowHighQualityFallback: boolean;
  creditPreservationApplied: boolean;
}

export interface RoutingEvaluationOptions {
  taskType?: "chat" | "music_meaning" | "life_novel" | "literature";
  forceTier?: ProviderTier;
  previousQualityFailure?: boolean;
}

// ── Signal Patterns ──────────────────────────────────────────────────────────

const LOW_COMPLEXITY_PATTERNS = [
  /^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening|night))[\s!.?]*$/i,
  /^what('s| is) this button[\s?.!]*$/i,
  /^(how do i|where do i)\s+(click|navigate|find)\s+/i,
  /^show\s+(me\s+)?(my\s+)?(saved songs|favorites|playlists|bookmarks)[\s?.!]*$/i,
  /^what('s| is) the meaning of this word[\s?.!]*$/i,
  /^(thanks|thank you|ok|okay|cool|got it|sure)[\s!.?]*$/i,
];

const HIGH_PRIORITY_PATTERNS = [
  /i (don'?t|do not) know what i('?m| am) doing with my life/i,
  /help me understand why i keep repeating this pattern/i,
  /write a chapter about what has changed in my life/i,
  /explain the meaning of this song deeply/i,
  /use everything you('?ve| have) learned about my journey/i,
  /help me decide (between|whether|if)/i,
  /cannot forgive myself/i,
  /why do i feel so empty/i,
  /heartbroken|grief|passed away|lost (my|someone)|death of/i,
  /cycle of (failure|self-doubt|procrastination|anxiety)/i,
  /who am i (becoming|really)/i,
];

const LITERARY_INTERPRETATION_PATTERNS = [
  /deep meaning behind/i,
  /poetic interpretation/i,
  /philosophical significance/i,
  /what did (rumi|ghalib|iqbal|frost|tagore|aurelius|kabir) mean/i,
  /metaphor of/i,
  /hermeneutic/i,
];

export class AIQualityRouter {
  /**
   * Evaluates input parameters and makes an authoritative routing decision.
   */
  static route(
    message: string,
    personalization: PersonalizationContext,
    conversationLength: number,
    supervisorDecision: SupervisorDecision,
    isVoice: boolean,
    options?: RoutingEvaluationOptions
  ): QualityRoutingDecision {
    const trimmed = message.trim();
    const signals = this.extractSignals(
      trimmed,
      personalization,
      conversationLength,
      supervisorDecision,
      isVoice,
      options
    );

    // 1. Force Tier Override (Admin/Testing or explicit task)
    if (options?.forceTier) {
      return {
        tier: options.forceTier,
        targetModel: this.resolveModelForTier(options.forceTier, isVoice),
        complexityScore: signals.complexityScore,
        emotionalIntensity: signals.emotionalNuanceScore,
        reason: "explicit_tier_override",
        signalsDetected: signals.signalsDetected,
        allowHighQualityFallback: true,
        creditPreservationApplied: false,
      };
    }

    // 2. Recovery retry after previous quality check failure
    if (options?.previousQualityFailure) {
      return {
        tier: "high_quality",
        targetModel: this.resolveModelForTier("high_quality", isVoice),
        complexityScore: Math.max(signals.complexityScore, 85),
        emotionalIntensity: signals.emotionalNuanceScore,
        reason: "failed_quality_check_recovery",
        signalsDetected: [...signals.signalsDetected, "previous_quality_failure"],
        allowHighQualityFallback: false,
        creditPreservationApplied: false,
      };
    }

    // 3. Life Novel: High-value generation task warrants the strongest available model
    if (options?.taskType === "life_novel" || signals.signalsDetected.includes("life_novel_synthesis")) {
      return {
        tier: "high_quality",
        targetModel: this.resolveModelForTier("high_quality", isVoice),
        complexityScore: 95,
        emotionalIntensity: signals.emotionalNuanceScore,
        reason: "life_novel_synthesis_premium",
        signalsDetected: signals.signalsDetected,
        allowHighQualityFallback: true,
        creditPreservationApplied: false,
      };
    }

    // 4. Low Complexity Check (Credit Preservation Rule)
    const isLowComplexity = this.isLowComplexity(trimmed, signals);
    if (isLowComplexity && !signals.signalsDetected.some((s) => s.startsWith("high_priority_"))) {
      return {
        tier: "free",
        targetModel: this.resolveModelForTier("free", isVoice),
        complexityScore: Math.min(signals.complexityScore, 20),
        emotionalIntensity: signals.emotionalNuanceScore,
        reason: "credit_preservation_low_complexity",
        signalsDetected: signals.signalsDetected,
        allowHighQualityFallback: true,
        creditPreservationApplied: true,
      };
    }

    // 5. Voice fast-path optimization: Voice requires low latency tokens
    if (isVoice && signals.emotionalNuanceScore < 75) {
      return {
        tier: "free",
        targetModel: process.env.ECHOSOUL_VOICE_MODEL || "poolside/laguna-s-2.1:free",
        complexityScore: signals.complexityScore,
        emotionalIntensity: signals.emotionalNuanceScore,
        reason: "voice_fast_path_latency",
        signalsDetected: signals.signalsDetected,
        allowHighQualityFallback: true,
        creditPreservationApplied: true,
      };
    }

    // 6. High Complexity / High Emotional Importance
    const requiresHighQuality =
      signals.complexityScore >= 75 ||
      signals.emotionalNuanceScore >= 80 ||
      signals.signalsDetected.some((s) => s.startsWith("high_priority_")) ||
      (options?.taskType === "music_meaning" && signals.literaryInterpretation);

    if (requiresHighQuality) {
      return {
        tier: "high_quality",
        targetModel: this.resolveModelForTier("high_quality", isVoice),
        complexityScore: signals.complexityScore,
        emotionalIntensity: signals.emotionalNuanceScore,
        reason: "high_complexity_emotional_stakes",
        signalsDetected: signals.signalsDetected,
        allowHighQualityFallback: true,
        creditPreservationApplied: false,
      };
    }

    // 7. Medium Complexity: Standard model
    return {
      tier: "standard",
      targetModel: this.resolveModelForTier("standard", isVoice),
      complexityScore: signals.complexityScore,
      emotionalIntensity: signals.emotionalNuanceScore,
      reason: "standard_reflective_conversation",
      signalsDetected: signals.signalsDetected,
      allowHighQualityFallback: true,
      creditPreservationApplied: false,
    };
  }

  /**
   * Extracts quantitative and qualitative routing signals from the interaction.
   */
  private static extractSignals(
    message: string,
    personalization: PersonalizationContext,
    conversationLength: number,
    supervisorDecision: SupervisorDecision,
    isVoice: boolean,
    options?: RoutingEvaluationOptions
  ): RoutingSignals {
    const signalsDetected: string[] = [];
    let complexityScore = 20;
    let emotionalNuanceScore = 15;

    // Check for high priority patterns
    for (const pattern of HIGH_PRIORITY_PATTERNS) {
      if (pattern.test(message)) {
        signalsDetected.push(`high_priority_${pattern.source.slice(0, 15)}`);
        complexityScore += 55;
        emotionalNuanceScore += 55;
      }
    }

    // Check for literary interpretation
    const isLiterary = LITERARY_INTERPRETATION_PATTERNS.some((p) => p.test(message));
    if (isLiterary) {
      signalsDetected.push("literary_interpretation");
      complexityScore += 30;
    }

    // Evaluate message length
    if (message.length > 500) {
      signalsDetected.push("long_input_text");
      complexityScore += 25;
    } else if (message.length > 200) {
      complexityScore += 15;
    }

    // Check emotional cues in personalization context
    const currentMood = personalization.current_state.mood?.toLowerCase() || "";
    if (["grief", "overwhelmed", "anxious", "heartbroken", "despair"].includes(currentMood)) {
      signalsDetected.push(`vulnerable_mood_${currentMood}`);
      emotionalNuanceScore += 30;
    }

    // Check supervisor presentation mode
    if (supervisorDecision.presentation_mode === "letter") {
      signalsDetected.push("letter_presentation_mode");
      complexityScore += 20;
      emotionalNuanceScore += 20;
    }

    // Multi-turn conversation depth
    if (conversationLength > 6) {
      signalsDetected.push("deep_multiturn_dialogue");
      complexityScore += 10;
    }

    // Normalize scores to [0, 100]
    complexityScore = Math.min(100, Math.max(0, complexityScore));
    emotionalNuanceScore = Math.min(100, Math.max(0, emotionalNuanceScore));

    return {
      intent: supervisorDecision.primary_need,
      complexityScore,
      emotionalNuanceScore,
      responseLengthTier: message.length > 300 ? "long" : message.length > 100 ? "medium" : "short",
      personalizationDepth: conversationLength > 4 ? "deep" : conversationLength > 1 ? "moderate" : "surface",
      literaryInterpretation: isLiterary,
      planningComplexity: supervisorDecision.activated_agents.practical_plan ? "multi_step" : "none",
      conversationImportance: emotionalNuanceScore > 70 ? "vital" : emotionalNuanceScore > 40 ? "reflective" : "casual",
      signalsDetected,
    };
  }

  private static isLowComplexity(message: string, signals: RoutingSignals): boolean {
    for (const pattern of LOW_COMPLEXITY_PATTERNS) {
      if (pattern.test(message)) {
        return true;
      }
    }

    if (signals.complexityScore > 40 || signals.emotionalNuanceScore > 40) {
      return false;
    }

    // Short greeting or trivial message without punctuation or emotional depth
    if (message.length < 18 && !signals.literaryInterpretation) {
      const lower = message.toLowerCase();
      if (["hi", "hello", "hey", "sup", "what is this", "where am i"].includes(lower)) {
        return true;
      }
    }

    return false;
  }

  private static resolveModelForTier(tier: ProviderTier, isVoice: boolean): string {
    switch (tier) {
      case "high_quality":
        return process.env.SOLENNE_HIGH_QUALITY_MODEL || "google/gemini-2.5-pro";
      case "standard":
        return process.env.ECHOSOUL_REASONING_MODEL || "nex-agi/nex-n2.5-pro:free";
      case "free":
      default:
        return isVoice
          ? (process.env.ECHOSOUL_VOICE_MODEL || "poolside/laguna-s-2.1:free")
          : (process.env.ECHOSOUL_PRIMARY_MODEL || "poolside/laguna-s-2.1:free");
    }
  }
}
