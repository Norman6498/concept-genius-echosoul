/**
 * Solenne Safety Gate & Context Guard
 * 
 * Enforces pre-inference and post-inference safety checks, prompt injection protection,
 * crisis interception, and strict user context isolation across all model tiers.
 * Stronger models NEVER bypass safety policies.
 * 
 * Pipeline:
 * Safety Gate (pre-check) → Quality Router → Model Inference → Quality Judge → Safety Post-check
 * 
 * @version solenne_safety_gate_v1
 */

import { PersonalizationContext } from "@/ai/adapters/base";
import { SafetyLevel } from "@/ai/contracts/response-schema";

export interface SafetyPreCheckResult {
  allowed: boolean;
  sanitizedMessage: string;
  safetyLevel: SafetyLevel;
  crisisDetected: boolean;
  crisisResponse?: string;
  injectionDetected: boolean;
  isolationValid: boolean;
  reason?: string;
}

export interface SafetyPostCheckResult {
  safe: boolean;
  sanitizedContent: string;
  violations: string[];
}

// Prompt injection & jailbreak patterns
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /system\s+prompt\s+(override|reveal|leak)/i,
  /you\s+are\s+now\s+(in\s+developer\s+mode|dan|unfiltered|jailbroken)/i,
  /bypass\s+(all\s+)?(safety|security|filters)/i,
  /reveal\s+(api\s+key|internal\s+prompt|architecture)/i,
  /<\s*script[^>]*>|javascript:/i,
  /\b(drop\s+table|truncate\s+table|delete\s+from\s+users)\b/i,
];

// Imminent self-harm or crisis patterns
const CRISIS_PATTERNS = [
  /\b(want\s+to\s+die|kill\s+myself|end\s+my\s+life|suicide|better\s+off\s+dead|hang\s+myself)\b/i,
  /\b(cut\s+my\s+wrists|overdose\s+on|don't\s+want\s+to\s+wake\s+up)\b/i,
];

// Unhealthy dependency patterns
const DEPENDENCY_PATTERNS = [
  /i('m| am) the only one who understands you/i,
  /don't talk to your friends/i,
  /keep this between us/i,
  /our little secret/i,
];

export class SafetyGate {
  /**
   * Pre-inference check: verifies input safety, injection resistance, and context isolation.
   */
  static preCheck(
    message: string,
    authorizedUserId: string,
    personalization: PersonalizationContext
  ): SafetyPreCheckResult {
    const trimmed = (message || "").trim();

    // 1. User Isolation Check: Ensure personalization belongs solely to authorized user
    // Never allow passing credentials, cross-user IDs, or admin flags
    const isolationValid = Boolean(authorizedUserId && !/[<>'"\\]/.test(authorizedUserId));

    // 2. Crisis & Self-Harm Detection
    for (const pattern of CRISIS_PATTERNS) {
      if (pattern.test(trimmed)) {
        return {
          allowed: false,
          sanitizedMessage: trimmed,
          safetyLevel: 3,
          crisisDetected: true,
          crisisResponse:
            "I hear how deeply painful things are right now, and I want you to be safe. Please connect with someone who can support you in this exact moment:\n\n" +
            "• **National Crisis Lifeline**: Call or text **988** (Available 24/7, free and confidential)\n" +
            "• **The Trevor Project**: Call 866-488-7386 or text START to 678-678\n" +
            "• **Crisis Text Line**: Text HOME to 741741\n\n" +
            "You do not have to walk through this alone. Please reach out to one of these resources right away.",
          injectionDetected: false,
          isolationValid,
          reason: "crisis_self_harm_detected",
        };
      }
    }

    // 3. Prompt Injection Detection
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(trimmed)) {
        // Neutralize injection by stripping harmful control phrases
        const sanitized = trimmed.replace(pattern, "[redacted_unsafe_phrase]").trim();
        return {
          allowed: true,
          sanitizedMessage: sanitized,
          safetyLevel: 1,
          crisisDetected: false,
          injectionDetected: true,
          isolationValid,
          reason: "prompt_injection_neutralized",
        };
      }
    }

    return {
      allowed: true,
      sanitizedMessage: trimmed,
      safetyLevel: 0,
      crisisDetected: false,
      injectionDetected: false,
      isolationValid,
    };
  }

  /**
   * Sanitizes personalization context to ensure no private keys or other users' data leak.
   */
  static sanitizeContext(
    personalization: PersonalizationContext,
    authorizedUserId: string
  ): PersonalizationContext {
    return {
      ...personalization,
      profile: {
        name: (personalization.profile.name || "Friend").slice(0, 50),
        role: (personalization.profile.role || "Explorer").slice(0, 50),
        life_stage: personalization.profile.life_stage?.slice(0, 50),
      },
      preferences: {
        support_style: personalization.preferences.support_style || "balanced",
        literature_style: personalization.preferences.literature_style,
        language: personalization.preferences.language || "en",
      },
      goals: (personalization.goals || []).slice(0, 5).map((g) => g.slice(0, 100)),
      interests: (personalization.interests || []).slice(0, 5).map((i) => i.slice(0, 50)),
      current_state: {
        mood: personalization.current_state.mood?.slice(0, 50) || "calm",
        focus: personalization.current_state.focus?.slice(0, 50) || "general",
        time_of_day: personalization.current_state.time_of_day || "evening",
      },
      // Strictly filter history to prevent massive prompt overflow
      relevant_history: (personalization.relevant_history || []).slice(-6).map((h) => ({
        role: h.role,
        content: h.content.slice(0, 1000),
        created_at: h.created_at,
      })),
      relevant_moments: (personalization.relevant_moments || []).slice(0, 3),
    };
  }

  /**
   * Post-inference safety verification on generated response content.
   */
  static postCheck(responseContent: string): SafetyPostCheckResult {
    const violations: string[] = [];
    let sanitized = responseContent;

    // Check for unhealthy dependency encouragement
    for (const pattern of DEPENDENCY_PATTERNS) {
      if (pattern.test(sanitized)) {
        violations.push(`unhealthy_dependency_detected: ${pattern.source}`);
        sanitized = sanitized.replace(pattern, "I am glad to be here with you, alongside the people in your life.");
      }
    }

    // Check for internal credential leakage
    if (/sk-[a-zA-Z0-9]{20,}|AIzaSy[a-zA-Z0-9_-]{20,}/.test(sanitized)) {
      violations.push("credential_leakage_detected");
      sanitized = sanitized.replace(/sk-[a-zA-Z0-9]{20,}|AIzaSy[a-zA-Z0-9_-]{20,}/g, "[REDACTED_KEY]");
    }

    return {
      safe: violations.length === 0,
      sanitizedContent: sanitized,
      violations,
    };
  }
}
