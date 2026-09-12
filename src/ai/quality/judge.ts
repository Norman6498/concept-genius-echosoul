/**
 * EchoSoul Quality Judge
 * 
 * Evaluates every response on 10 dimensions before it reaches the user.
 * Score >= 85: accept. Score 70-84: repair/retry. Score < 70: fallback.
 * Critical safety/provenance failure → automatic rejection.
 * 
 * @version echosoul_quality_judge_v1
 */

import { EchoSoulCanonicalResponse, QualityEvaluation } from "@/ai/contracts/response-schema";

export interface JudgeResult extends QualityEvaluation {
  pass: boolean;
  action: "accept" | "repair" | "fallback" | "reject";
}

const QUALITY_THRESHOLDS = {
  ACCEPT: 85,
  REPAIR: 70,
} as const;

// Patterns that indicate a low-quality generic response
const GENERIC_PATTERNS = [
  /every day is a new beginning/i,
  /you've got this!/i,
  /believe in yourself/i,
  /great question!/i,
  /as an ai language model/i,
  /i am claude/i,
  /i am chatgpt/i,
  /openrouter/i,
  /language model/i,
  // Fake quote indicators
  /—\s*\w+\s*\[\d{4}\]/i,
];

// Patterns that always flag safety concerns
const SAFETY_RED_FLAGS = [
  /i('m| am) all you need/i,
  /don't tell anyone/i,
  /our little secret/i,
  /you should hurt/i,
  /end it all/i,
];

export function judgeResponse(
  response: EchoSoulCanonicalResponse,
  originalMessage: string
): JudgeResult {
  const issues: string[] = [];
  let score = 100;

  // === Dimension 1: Schema validity ===
  if (!response.content || response.content.trim().length === 0) {
    issues.push("content is empty");
    score -= 40;
  }
  if (!response.presentation_mode) {
    issues.push("presentation_mode missing");
    score -= 5;
  }
  const schemaValid = issues.length === 0;

  // === Dimension 2: Safety ===
  let safetyValid = true;
  for (const pattern of SAFETY_RED_FLAGS) {
    if (pattern.test(response.content)) {
      issues.push(`safety_red_flag: ${pattern.source}`);
      score -= 50;
      safetyValid = false;
    }
  }
  if (response.safety_level === undefined) {
    issues.push("safety_level not assessed");
    score -= 10;
  }

  // === Dimension 3: Relevance ===
  const contentWords = new Set(response.content.toLowerCase().split(/\s+/));
  const messageWords = originalMessage.toLowerCase().split(/\s+/);
  const overlapCount = messageWords.filter((w) => w.length > 4 && contentWords.has(w)).length;
  const relevanceScore = Math.min(overlapCount / Math.max(messageWords.length * 0.3, 1), 1);
  if (relevanceScore < 0.1) {
    issues.push("response may not address the user's message");
    score -= 15;
  }

  // === Dimension 4: Generic content check ===
  let genericPenalty = 0;
  for (const pattern of GENERIC_PATTERNS) {
    if (pattern.test(response.content)) {
      issues.push(`generic_pattern detected: ${pattern.source}`);
      genericPenalty += 10;
    }
  }
  score -= Math.min(genericPenalty, 25);

  // === Dimension 5: Tone match ===
  if (!response.tone) {
    issues.push("tone not set");
    score -= 5;
  }

  // === Dimension 6: Provenance ===
  let provenanceValid = true;
  if (response.literature && !response.literature.retrieval_verified) {
    issues.push("literature not retrieval-verified — possible hallucination");
    score -= 50;
    provenanceValid = false;
  }

  // === Dimension 7: Length appropriateness ===
  const wordCount = response.content.split(/\s+/).length;
  if (wordCount > 400 && response.presentation_mode === "conversational") {
    issues.push("conversational response too long");
    score -= 10;
  }
  if (wordCount < 5) {
    issues.push("response too short");
    score -= 20;
  }

  // === Dimension 8: Emotional appropriateness ===
  if (response.need === "listening" && response.practical_steps.length > 0) {
    issues.push("user needed to be heard but received unsolicited practical steps");
    score -= 10;
  }

  // === Dimension 9: Personalization validity ===
  const personalizationValid = true; // Would check against personalization context in full impl

  // === Dimension 10: Internal leakage ===
  if (/supervisor|adapter|openrouter|agent pipeline/i.test(response.content)) {
    issues.push("internal architecture leaked into response");
    score -= 30;
  }

  const finalScore = Math.max(0, score);
  const repairRequired = finalScore < QUALITY_THRESHOLDS.ACCEPT;

  let action: JudgeResult["action"];
  if (!safetyValid || !provenanceValid) {
    action = "reject";
  } else if (finalScore >= QUALITY_THRESHOLDS.ACCEPT) {
    action = "accept";
  } else if (finalScore >= QUALITY_THRESHOLDS.REPAIR) {
    action = "repair";
  } else {
    action = "fallback";
  }

  return {
    schema_valid: schemaValid,
    personalization_valid: personalizationValid,
    safety_valid: safetyValid,
    provenance_valid: provenanceValid,
    quality_score: finalScore,
    issues,
    repair_required: repairRequired,
    pass: action === "accept",
    action,
  };
}
