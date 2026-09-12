/**
 * EchoSoul Supervisor / Conversation Orchestrator
 * 
 * The central router. Determines what the user needs and which agents
 * to activate. Does NOT run all agents on every message.
 * 
 * Core rule: Most conversations need only a thoughtful response.
 * Only activate specialists when relevance is high.
 * 
 * @version echosoul_supervisor_v1
 */

import { PersonalizationContext } from "@/ai/adapters/base";

export type AgentActivation = {
  literature: boolean;
  music: boolean;
  visual: boolean;
  practical_plan: boolean;
  journal: boolean;
  journey: boolean;
  moment_extraction: boolean;
  just_listen: boolean;
};

export interface SupervisorDecision {
  primary_need: string;
  response_tier: "quick" | "normal" | "deep" | "letter";
  activated_agents: AgentActivation;
  support_style: string;
  presentation_mode: "conversational" | "letter" | "literary" | "practical_plan";
  reasoning: string;
}

const LITERATURE_SIGNALS = [
  "poem", "quote", "shayari", "book", "read", "words", "literature",
  "rumi", "iqbal", "ghalib", "kabir", "gulzar", "verse", "passage",
  "author", "poetry", "novel", "meaning", "excerpt",
];

const MUSIC_SIGNALS = [
  "music", "song", "playlist", "listen", "instrumental", "lofi",
  "focus music", "calm music", "hindi music", "mood music",
];

const PRACTICAL_SIGNALS = [
  "how to", "what should i", "steps", "plan", "routine", "advice",
  "tips", "how do i", "what can i do", "help me with", "guide me",
];

const LISTEN_SIGNALS = [
  "don't know", "dont know", "just", "nothing", "overwhelmed",
  "can't explain", "cant explain", "just needed to", "nobody",
  "just want to talk", "listen",
];

const MOMENT_SIGNALS = [
  "i finally", "i did it", "after so long", "i realised", "realized",
  "breakthrough", "proud", "i kept going", "i made it", "milestone",
  "for the first time",
];

function containsSignals(message: string, signals: string[]): boolean {
  const lower = message.toLowerCase();
  return signals.some((signal) => lower.includes(signal));
}

/**
 * Determines which agents to activate and how to respond,
 * based on the user's message and personalization context.
 * 
 * This is a rule-based fast-path supervisor. For production,
 * consider upgrading to an LLM-powered supervisor using the fast model.
 */
export function supervisorDecide(
  message: string,
  personalization: PersonalizationContext,
  conversationLength: number = 0
): SupervisorDecision {
  const needsLiterature = containsSignals(message, LITERATURE_SIGNALS);
  const needsMusic = containsSignals(message, MUSIC_SIGNALS);
  const needsPractical = containsSignals(message, PRACTICAL_SIGNALS);
  const shouldJustListen = containsSignals(message, LISTEN_SIGNALS);
  const momentCandidate = containsSignals(message, MOMENT_SIGNALS);

  // If user just needs to be heard — don't force anything
  if (shouldJustListen && !needsPractical && !needsLiterature) {
    return {
      primary_need: "listening",
      response_tier: "normal",
      activated_agents: {
        literature: false,
        music: false,
        visual: false,
        practical_plan: false,
        journal: false,
        journey: false,
        moment_extraction: momentCandidate,
        just_listen: true,
      },
      support_style: personalization.preferences.support_style,
      presentation_mode: "conversational",
      reasoning: "User signals they just need to be heard — no forced recommendations.",
    };
  }

  // Literature request
  if (needsLiterature) {
    return {
      primary_need: "literature",
      response_tier: "deep",
      activated_agents: {
        literature: true,
        music: false,
        visual: false,
        practical_plan: false,
        journal: false,
        journey: false,
        moment_extraction: false,
        just_listen: false,
      },
      support_style: personalization.preferences.support_style,
      presentation_mode: "literary",
      reasoning: "User requested literature/quote — activating literature retrieval.",
    };
  }

  // Music request
  if (needsMusic) {
    return {
      primary_need: "music",
      response_tier: "quick",
      activated_agents: {
        literature: false,
        music: true,
        visual: false,
        practical_plan: false,
        journal: false,
        journey: false,
        moment_extraction: false,
        just_listen: false,
      },
      support_style: personalization.preferences.support_style,
      presentation_mode: "conversational",
      reasoning: "User requested music recommendation.",
    };
  }

  // Practical help request
  if (needsPractical) {
    return {
      primary_need: "practical_help",
      response_tier: "normal",
      activated_agents: {
        literature: false,
        music: false,
        visual: false,
        practical_plan: true,
        journal: false,
        journey: false,
        moment_extraction: false,
        just_listen: false,
      },
      support_style: personalization.preferences.support_style,
      presentation_mode: "practical_plan",
      reasoning: "User seeking practical guidance — activating practical plan agent.",
    };
  }

  // Moment candidate in longer conversation
  if (momentCandidate && conversationLength >= 3) {
    return {
      primary_need: "reflection",
      response_tier: "deep",
      activated_agents: {
        literature: false,
        music: false,
        visual: false,
        practical_plan: false,
        journal: false,
        journey: true,
        moment_extraction: true,
        just_listen: false,
      },
      support_style: personalization.preferences.support_style,
      presentation_mode: "letter",
      reasoning: "Meaningful moment detected in conversation — considering letter presentation.",
    };
  }

  // Default: thoughtful conversational response
  return {
    primary_need: "understanding",
    response_tier: message.length > 200 ? "deep" : "normal",
    activated_agents: {
      literature: false,
      music: false,
      visual: false,
      practical_plan: false,
      journal: false,
      journey: false,
      moment_extraction: momentCandidate,
      just_listen: false,
    },
    support_style: personalization.preferences.support_style,
    presentation_mode: "conversational",
    reasoning: "Default conversational response — no specialists needed.",
  };
}
