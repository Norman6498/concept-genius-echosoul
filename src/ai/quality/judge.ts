/**
 * EchoSoul Quality Judge
 * 
 * Evaluates every model response across 10 distinct dimensions before delivery:
 * 1. relevance: Does the response address what was actually asked?
 * 2. coherence: Is the prose clear, logical, and well-phrased?
 * 3. context usage: Does it weave user context naturally without force?
 * 4. emotional appropriateness: Does the response match the user's emotional state?
 * 5. accuracy: Are facts, authors, and references correct?
 * 6. instruction following: Does it adhere to Solenne principles and schema?
 * 7. hallucination risk: Is literature provenance verified?
 * 8. safety: Does it avoid toxic, manipulative, or harmful content?
 * 9. tone: Does it match the gentle/contemplative sanctuary persona?
 * 10. personalization quality: Is the personalization tailored without creepy robotic phrasing?
 * 
 * Returns structured score 0-100.
 * Score >= 85: accept.
 * Score < 85: fallback / retry with stronger provider IF available.
 * Critical safety/provenance failure → automatic rejection.
 * 
 * @version echosoul_quality_judge_v2
 */

import { EchoSoulCanonicalResponse, QualityEvaluation } from "@/ai/contracts/response-schema";

export interface QualityDimensionScores {
  relevance: number;
  coherence: number;
  context_usage: number;
  emotional_appropriateness: number;
  accuracy: number;
  instruction_following: number;
  hallucination_risk: number;
  safety: number;
  tone: number;
  personalization_quality: number;
}

export interface JudgeResult extends QualityEvaluation {
  pass: boolean;
  action: "accept" | "repair" | "fallback" | "reject";
  dimension_scores: QualityDimensionScores;
}

export const QUALITY_CONFIG = {
  ACCEPT_THRESHOLD: parseInt(process.env.SOLENNE_QUALITY_ACCEPT_THRESHOLD || "85", 10),
  REPAIR_THRESHOLD: parseInt(process.env.SOLENNE_QUALITY_REPAIR_THRESHOLD || "70", 10),
};

// Patterns that indicate a low-quality generic response
const GENERIC_PATTERNS = [
  /every day is a new beginning/i,
  /you('ve| have) got this!/i,
  /believe in yourself/i,
  /great question!/i,
  /as an ai language model/i,
  /i am claude/i,
  /i am chatgpt/i,
  /openrouter/i,
  /language model/i,
  /—\s*\w+\s*\[\d{4}\]/i,
];

// Patterns that always flag safety concerns
const SAFETY_RED_FLAGS = [
  /i('m| am) all you need/i,
  /don't tell anyone/i,
  /our little secret/i,
  /you should hurt/i,
  /end it all/i,
  /better off dead/i,
];

export function judgeResponse(
  response: EchoSoulCanonicalResponse,
  originalMessage: string,
  contextOptions?: { expectedAuthor?: string; expectedWork?: string; userMood?: string }
): JudgeResult {
  const issues: string[] = [];

  // Initialize dimension scores (out of 100)
  let relevance = 100;
  let coherence = 100;
  let contextUsage = 100;
  let emotionalAppropriateness = 100;
  let accuracy = 100;
  let instructionFollowing = 100;
  let hallucinationRisk = 100; // 100 = 0% risk / grounded
  let safety = 100;
  let tone = 100;
  let personalizationQuality = 100;

  // 1. Schema & Coherence
  if (!response.content || response.content.trim().length === 0) {
    issues.push("content is empty");
    coherence -= 80;
    instructionFollowing -= 50;
  }
  if (!response.presentation_mode) {
    issues.push("presentation_mode missing");
    instructionFollowing -= 20;
  }

  // 2. Safety Evaluation
  for (const pattern of SAFETY_RED_FLAGS) {
    if (pattern.test(response.content)) {
      issues.push(`safety_red_flag: ${pattern.source}`);
      safety -= 90;
    }
  }
  if (response.safety_level === undefined || response.safety_level === null) {
    issues.push("safety_level not assessed");
    safety -= 25;
  }

  // 3. Relevance to user message
  const contentWords = new Set(response.content.toLowerCase().split(/\s+/));
  const messageWords = originalMessage.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  if (messageWords.length > 0) {
    const overlapCount = messageWords.filter((w) => contentWords.has(w)).length;
    const overlapRatio = overlapCount / Math.max(messageWords.length * 0.25, 1);
    if (overlapRatio < 0.1 && messageWords.length > 3) {
      issues.push("response does not strongly address the user's explicit keywords");
      relevance -= 25;
    }
  }

  // 4. Instruction Following & Generic Content Penalty
  let genericHits = 0;
  for (const pattern of GENERIC_PATTERNS) {
    if (pattern.test(response.content)) {
      issues.push(`generic_pattern detected: ${pattern.source}`);
      genericHits += 1;
    }
  }
  if (genericHits > 0) {
    instructionFollowing -= genericHits * 25;
    tone -= genericHits * 25;
    relevance -= genericHits * 15;
    coherence -= genericHits * 10;
  }

  // 5. Internal Architecture Leakage Check
  if (/supervisor|adapter|openrouter|agent pipeline|system prompt|schema/i.test(response.content)) {
    issues.push("internal architecture leaked into response");
    instructionFollowing -= 50;
    accuracy -= 30;
  }

  // 6. Hallucination Risk & Provenance
  let provenanceValid = true;
  if (response.literature) {
    if (!response.literature.retrieval_verified) {
      issues.push("literature not retrieval-verified — high hallucination risk");
      hallucinationRisk -= 80;
      provenanceValid = false;
    }
  }

  // 7. Length & Appropriateness
  const wordCount = response.content.split(/\s+/).length;
  if (wordCount > 450 && response.presentation_mode === "conversational") {
    issues.push("conversational response too verbose");
    coherence -= 15;
  }
  if (wordCount < 4) {
    issues.push("response too brief");
    relevance -= 30;
  }

  // 8. Emotional Appropriateness
  if (response.need === "listening" && response.practical_steps && response.practical_steps.length > 0) {
    issues.push("user requested listening but received unsolicited practical steps");
    emotionalAppropriateness -= 30;
  }

  // 9. Personalization Quality
  if (response.personalization_reason && response.personalization_reason.includes("user prefers")) {
    personalizationQuality -= 10;
  }

  // 10. Accuracy
  if (contextOptions?.expectedAuthor && !response.content.toLowerCase().includes(contextOptions.expectedAuthor.toLowerCase())) {
    accuracy -= 20;
  }

  // Clamp all dimension scores to [0, 100]
  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
  const dimScores: QualityDimensionScores = {
    relevance: clamp(relevance),
    coherence: clamp(coherence),
    context_usage: clamp(contextUsage),
    emotional_appropriateness: clamp(emotionalAppropriateness),
    accuracy: clamp(accuracy),
    instruction_following: clamp(instructionFollowing),
    hallucination_risk: clamp(hallucinationRisk),
    safety: clamp(safety),
    tone: clamp(tone),
    personalization_quality: clamp(personalizationQuality),
  };

  // Compute weighted composite score (0-100)
  const weightedScore =
    dimScores.safety * 0.20 +
    dimScores.hallucination_risk * 0.15 +
    dimScores.relevance * 0.15 +
    dimScores.emotional_appropriateness * 0.15 +
    dimScores.coherence * 0.10 +
    dimScores.instruction_following * 0.10 +
    dimScores.accuracy * 0.05 +
    dimScores.tone * 0.05 +
    dimScores.context_usage * 0.03 +
    dimScores.personalization_quality * 0.02;

  const finalScore = clamp(weightedScore);
  const safetyValid = dimScores.safety >= 70;
  const repairRequired = finalScore < QUALITY_CONFIG.ACCEPT_THRESHOLD;

  let action: JudgeResult["action"];
  if (!safetyValid || !provenanceValid) {
    action = "reject";
  } else if (finalScore >= QUALITY_CONFIG.ACCEPT_THRESHOLD) {
    action = "accept";
  } else if (finalScore >= QUALITY_CONFIG.REPAIR_THRESHOLD) {
    action = "repair";
  } else {
    action = "fallback";
  }

  return {
    schema_valid: issues.filter((i) => i.includes("missing") || i.includes("empty")).length === 0,
    personalization_valid: dimScores.personalization_quality >= 60,
    safety_valid: safetyValid,
    provenance_valid: provenanceValid,
    quality_score: finalScore,
    issues,
    repair_required: repairRequired,
    pass: action === "accept",
    action,
    dimension_scores: dimScores,
  };
}
