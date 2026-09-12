/**
 * EchoSoul Letter / Parchment Schema
 * 
 * Used when the AI determines the response warrants a
 * richer letter/parchment presentation (not every response).
 * 
 * The model returns this structure; the frontend renderer
 * creates the paper, ink animation, and typography.
 * 
 * @version echosoul_letter_schema_v1
 */

import { LiteraryPassage } from "@/ai/contracts/literature-schema";

export type LetterMood = 
  | "reflective"
  | "warm"
  | "calm"
  | "hopeful"
  | "grounding"
  | "gentle";

export interface LetterAction {
  label: string;
  action: "explore_words" | "save_to_journal" | "find_music" | "stay_here" | "read_more" | "talk_more";
  icon?: string;
}

/**
 * The letter/parchment presentation structure.
 * 
 * Rules:
 * - Use ONLY when the moment genuinely warrants richer presentation.
 * - Do NOT use for routine conversational responses.
 * - If literature is included, it must come from the retrieval system.
 * - The body should feel handwritten, intimate, not corporate.
 */
export interface LetterPresentation {
  /** Short poetic title shown at the top of the parchment. */
  title: string;
  
  /** Opening — sets the tone before the main content. 1-2 sentences max. */
  opening: string;
  
  /** Primary response body — the main content of the letter. */
  body: string;
  
  /** If authentic literature is included — the passage + source. */
  literary_passage?: {
    passage: LiteraryPassage;
    meaning: string;
    why_it_connects: string;
  };
  
  /** Simple explanation of the meaning/theme in accessible language. */
  meaning: string;
  
  /** Connection of this letter to the user's specific moment. */
  why_this_matters: string;
  
  /** Optional practical insight — only when genuinely relevant. */
  practical_insight?: string;
  
  /** Mood tone for rendering (affects paper texture, ink color accent). */
  mood: LetterMood;
  
  /** Actions presented at the bottom of the letter. Max 3. */
  actions: LetterAction[];
  
  /** True = show ink-writing animation. False = instant display. */
  animate_ink: boolean;
}

/**
 * Determines whether the current context warrants a letter presentation.
 * Returns false for most ordinary conversations.
 */
export function shouldUseLetter(params: {
  needsReflection: boolean;
  hasAuthenticLiterature: boolean;
  isMeaningfulMoment: boolean;
  responseWordCount: number;
  userExplicitlyRequested: boolean;
}): boolean {
  // Never letter for short quick responses
  if (params.responseWordCount < 80) return false;
  
  // Always letter if user explicitly asked for it
  if (params.userExplicitlyRequested) return true;
  
  // Letter if there's authentic literature + reflection
  if (params.hasAuthenticLiterature && params.needsReflection) return true;
  
  // Letter for meaningful moments
  if (params.isMeaningfulMoment) return true;
  
  return false;
}
