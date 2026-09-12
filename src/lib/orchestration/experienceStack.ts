/**
 * EchoSoul Cross-Experience Conversational Orchestration Engine
 *
 * Implements the core architecture where Voice/Talk is the primary conversational anchor,
 * and secondary experiences (Music, Words, Visuals, Meditation, Guidance, Journal,
 * Moments, Journey, Life Novel) can be surfaced, stacked, and exited without
 * ever losing or destroying the ongoing conversation state.
 */

export type ExperienceType =
  | "conversation"
  | "words"
  | "shayari"
  | "poetry"
  | "quote"
  | "book"
  | "music"
  | "melody"
  | "meditation"
  | "visual"
  | "guidance"
  | "journal"
  | "moment"
  | "journey"
  | "life_novel";

export interface ExperienceItem {
  id: string;
  type: ExperienceType;
  title: string;
  subtitle?: string;
  route: string;
  payload?: Record<string, any>;
  openedAt: number;
}

export interface ConversationAnchor {
  sessionId: string;
  lastTopic?: string;
  lastUserMessage?: string;
  lastAssistantReply?: string;
  timestamp: number;
}

export interface ExperienceStackState {
  stack: ExperienceItem[];
  anchor: ConversationAnchor | null;
  autoOpenPreference: "ask" | "always" | "never";
  isAudioDucked: boolean;
}

const STORAGE_KEY = "echosoul_experience_stack";
const ANCHOR_KEY = "echosoul_conversation_anchor";
const PREF_KEY = "echosoul_auto_experience_pref";

/**
 * Read the current active conversation anchor from localStorage
 */
export function getConversationAnchor(): ConversationAnchor | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ANCHOR_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Set the ongoing conversation anchor (called from Talk page on each turn)
 */
export function setConversationAnchor(anchor: ConversationAnchor): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ANCHOR_KEY, JSON.stringify(anchor));
    notifyExperienceChange();
  } catch {}
}

/**
 * Read the active experience stack
 */
export function getExperienceStack(): ExperienceItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Push a new experience onto the stack and dispatch change event
 */
export function pushExperience(
  type: ExperienceType,
  title: string,
  route: string,
  subtitle?: string,
  payload?: Record<string, any>
): ExperienceItem {
  const current = getExperienceStack();
  const newItem: ExperienceItem = {
    id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    title,
    subtitle,
    route,
    payload,
    openedAt: Date.now(),
  };

  const updated = [...current, newItem];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      notifyExperienceChange();
    } catch {}
  }
  return newItem;
}

/**
 * Pop the top experience and return to the previous surface (or root conversation)
 */
export function popExperience(): { popped: ExperienceItem | null; nextRoute: string } {
  const current = getExperienceStack();
  if (current.length === 0) {
    return { popped: null, nextRoute: "/app/talk" };
  }

  const popped = current[current.length - 1];
  const updated = current.slice(0, current.length - 1);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      notifyExperienceChange();
    } catch {}
  }

  // If stack still has items, return to previous item's route; otherwise back to talk
  const nextRoute = updated.length > 0 ? updated[updated.length - 1].route : "/app/talk";
  return { popped, nextRoute };
}

/**
 * Clear the stack completely (e.g. user returns fully to talk)
 */
export function clearExperienceStack(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    notifyExperienceChange();
  } catch {}
}

/**
 * Read auto-experience switching preference: 'ask' (default), 'always', or 'never'
 */
export function getAutoExperiencePreference(): "ask" | "always" | "never" {
  if (typeof window === "undefined") return "ask";
  try {
    const p = localStorage.getItem(PREF_KEY);
    if (p === "always" || p === "never" || p === "ask") return p;
    return "ask";
  } catch {
    return "ask";
  }
}

export function setAutoExperiencePreference(pref: "ask" | "always" | "never"): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PREF_KEY, pref);
    notifyExperienceChange();
  } catch {}
}

/**
 * Natural language voice command parser for Cross-Experience Switching
 */
export function parseVoiceExperienceCommand(input: string): {
  type: ExperienceType;
  action: "open" | "suggest" | "pop";
  targetRoute: string;
  title: string;
  reason?: string;
} | null {
  const q = input.trim().toLowerCase();

  // 1. Return / Back commands
  if (
    q.includes("take me back") ||
    q.includes("go back to conversation") ||
    q.includes("continue talking") ||
    q.includes("back to chat") ||
    q.includes("back to talk") ||
    q.includes("close this")
  ) {
    return {
      type: "conversation",
      action: "pop",
      targetRoute: "/app/talk",
      title: "Return to Conversation",
    };
  }

  // 2. Music / Songs
  if (
    q.includes("play a song") ||
    q.includes("play something") ||
    q.includes("listen to music") ||
    q.includes("start music") ||
    q.includes("play calm") ||
    q.includes("play focus")
  ) {
    return {
      type: "music",
      action: "open",
      targetRoute: "/app/music",
      title: "Music for Your Mood",
      reason: "User requested ambient or melodic soundscape",
    };
  }

  // 3. Words / Poetry / Shayari
  if (q.includes("give me a poem") || q.includes("read a poem") || q.includes("show poetry")) {
    return {
      type: "poetry",
      action: "open",
      targetRoute: "/app/words",
      title: "Discover Words & Poetry",
      reason: "User requested timeless poetry",
    };
  }

  if (q.includes("give me shayari") || q.includes("sunao shayari") || q.includes("say shayari") || q.includes("shayari")) {
    return {
      type: "shayari",
      action: "open",
      targetRoute: "/app/words",
      title: "Ghazal & Shayari",
      reason: "User requested authentic poetic couplets",
    };
  }

  // 4. Books / Reading
  if (q.includes("show me that book") || q.includes("open book") || q.includes("find a book") || q.includes("recommend a book")) {
    return {
      type: "book",
      action: "open",
      targetRoute: "/app/words",
      title: "Philosophical & Literary Books",
      reason: "User requested book recommendations",
    };
  }

  // 5. Visuals & Sanctuaries
  if (
    q.includes("show me something peaceful") ||
    q.includes("take me somewhere quiet") ||
    q.includes("open a scene") ||
    q.includes("visual scene") ||
    q.includes("step into nature")
  ) {
    return {
      type: "visual",
      action: "open",
      targetRoute: "/app/visuals",
      title: "Visual Worlds Sanctuary",
      reason: "User requested an immersive visual escape",
    };
  }

  // 6. Meditation & Breathing
  if (
    q.includes("help me calm down") ||
    q.includes("breathing exercise") ||
    q.includes("meditation") ||
    q.includes("can we meditate") ||
    q.includes("slow down my thoughts")
  ) {
    return {
      type: "meditation",
      action: "open",
      targetRoute: "/app/visuals",
      title: "Guided Breathing Meditation",
      reason: "User requested grounding breathing session",
    };
  }

  // 7. Journey & Life Novel
  if (
    q.includes("open my journey") ||
    q.includes("show my journey") ||
    q.includes("how much have i grown") ||
    q.includes("what has changed about me")
  ) {
    return {
      type: "journey",
      action: "open",
      targetRoute: "/app/journey",
      title: "Your Personal Journey",
      reason: "User requested growth and path overview",
    };
  }

  // 8. Journal
  if (
    q.includes("open journal") ||
    q.includes("write in my journal") ||
    q.includes("save to journal")
  ) {
    return {
      type: "journal",
      action: "open",
      targetRoute: "/app/journal",
      title: "Personal Journal",
      reason: "User requested reflective journaling",
    };
  }

  // 9. Guidance
  if (
    q.includes("give me guidance") ||
    q.includes("build a plan") ||
    q.includes("what should i do tomorrow") ||
    q.includes("step by step help")
  ) {
    return {
      type: "guidance",
      action: "open",
      targetRoute: "/app/guidance",
      title: "Thoughtful Guidance & Plans",
      reason: "User requested practical guidance",
    };
  }

  return null;
}

function notifyExperienceChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("echosoul_experience_change"));
  }
}
