/**
 * EchoSoul — Isolated Mock Data (Stage 1 Product Shell)
 *
 * All mock data for the Stage 1 shell UI is strictly isolated in this file.
 * This ensures clean separation from production database logic.
 * Aligns directly with the EchoSoul Reference UI and Specification.
 */

export interface MockUserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  preferredLanguage: string;
  supportStyle: string;
  memoryMode: "hybrid" | "automatic" | "manual" | "off";
  isPrivateSession: boolean;
  activeChapter: {
    number: number;
    title: string;
    lastMomentTime: string;
    comfortNote: string;
  };
}

export interface MockMoment {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  title: string;
  summary: string;
  emotion: string;
  intensity: number;
  date: string;
  category: "conversation" | "poem" | "scene" | "step";
  tags: string[];
}

export interface MockLiteratureWork {
  id: string;
  author: string;
  workTitle: string;
  source: string;
  rightsStatus: "public_domain" | "licensed" | "restricted";
  passageType: "Shayari" | "Poetry" | "Quotes" | "Books";
  originalText: string;
  whyThisFits: string;
  language: string;
  authorImage?: string;
}

export interface MockJourneyMilestone {
  id: string;
  date: string;
  quote: string;
  stage: string;
  isCompleted: boolean;
}

export interface MockMemoryItem {
  id: string;
  category: "People" | "Patterns" | "Preferences" | "Goals" | "Growth";
  factOrReflection: "fact" | "reflection";
  content: string;
  learnedAt: string;
  whySaved: string;
}

export interface MockScenePrompt {
  id: string;
  title: string;
  style: "Anime" | "Cinematic" | "Nature" | "Minimal" | "Fantasy";
  prompt: string;
  imageUrl: string;
  duration: string;
}

// ── Default Mock User Profile ──────────────────────────────────────────────

export const MOCK_USER: MockUserProfile = {
  id: "user-aarav-01",
  name: "Aarav",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  preferredLanguage: "en",
  supportStyle: "adaptive",
  memoryMode: "hybrid",
  isPrivateSession: false,
  activeChapter: {
    number: 12,
    title: "Trying Again",
    lastMomentTime: "Yesterday, 10:42 PM",
    comfortNote: "A brighter chapter is still yours.",
  },
};

// ── Moments Mock Data ──────────────────────────────────────────────────────

export const MOCK_MOMENTS: MockMoment[] = [
  {
    id: "m-1",
    chapterNumber: 12,
    chapterTitle: "Trying Again",
    title: "A difficult conversation",
    summary: "Talked through feeling replaceable at work. Allowed ourselves to sit with the discomfort without rushing to fix it.",
    emotion: "Vulnerable",
    intensity: 7,
    date: "Yesterday, 10:42 PM",
    category: "conversation",
    tags: ["Work", "Self-Worth", "Honesty"],
  },
  {
    id: "m-2",
    chapterNumber: 12,
    chapterTitle: "Trying Again",
    title: "A poem that stayed with me",
    summary: "Connected with Gulzar's lines about feeling slightly lost inside a crowd. Kept the couplet close.",
    emotion: "Reflective",
    intensity: 5,
    date: "Sep 6, 2026",
    category: "poem",
    tags: ["Poetry", "Solitude", "Gulzar"],
  },
  {
    id: "m-3",
    chapterNumber: 12,
    chapterTitle: "Trying Again",
    title: "A scene I created",
    summary: "Visualized a sunrise over city roofs. A boy sitting quietly watching the sky turn from indigo to amber gold.",
    emotion: "Hopeful",
    intensity: 6,
    date: "Sep 4, 2026",
    category: "scene",
    tags: ["Visual", "Dawn", "City"],
  },
  {
    id: "m-4",
    chapterNumber: 11,
    chapterTitle: "The Weight I Carried",
    title: "A small step forward",
    summary: "Decided to send the message instead of drafting it twelve times. Progress over hesitation.",
    emotion: "Relieved",
    intensity: 6,
    date: "Aug 28, 2026",
    category: "step",
    tags: ["Action", "Bravery"],
  },
];

// ── Literature Mock Match ──────────────────────────────────────────────────

export const MOCK_LITERATURE: MockLiteratureWork = {
  id: "lit-gulzar-01",
  author: "Gulzar",
  workTitle: "Raavi Paar (रावी पार)",
  source: "Curated Literary Archive",
  rightsStatus: "public_domain",
  passageType: "Shayari",
  language: "hi",
  originalText: `कभी कभी लगता है
कि मैं भी खो सा गया हूँ,
कि इस भीड़ में कहीं
मैं ही तो नहीं रहा...`,
  whyThisFits:
    "These lines reflect the feeling of being present, yet feeling lost — something you shared in your last session.",
};

// ── Book Page Mock ─────────────────────────────────────────────────────────

export const MOCK_BOOK_PAGE = {
  bookTitle: "The Alchemist",
  author: "Paulo Coelho",
  pageNumber: 102,
  rightsStatus: "licensed",
  quote:
    "And, when you want something, all the universe conspires in helping you to achieve it.",
  whyThisFits: "A reminder that quiet intention reshapes the gravity around you.",
};

// ── Journey Milestones ────────────────────────────────────────────────────

export const MOCK_JOURNEY_MILESTONES: MockJourneyMilestone[] = [
  {
    id: "j-1",
    date: "March 2026",
    quote: '"I\'m completely lost."',
    stage: "The Fog",
    isCompleted: true,
  },
  {
    id: "j-2",
    date: "June 2026",
    quote: '"Maybe I know what\'s wrong."',
    stage: "The Glimpse",
    isCompleted: true,
  },
  {
    id: "j-3",
    date: "August 2026",
    quote: '"I actually did something."',
    stage: "The Movement",
    isCompleted: true,
  },
  {
    id: "j-4",
    date: "September 2026",
    quote: '"I\'m trying again."',
    stage: "The Horizon",
    isCompleted: false,
  },
];

// ── Memory Archive Items ──────────────────────────────────────────────────

export const MOCK_MEMORIES: MockMemoryItem[] = [
  {
    id: "mem-1",
    category: "Patterns",
    factOrReflection: "reflection",
    content: "Tends to assume silence from peers means disappointment rather than neutral busyness.",
    learnedAt: "Sep 2, 2026",
    whySaved: "Helps soften cognitive overreactions during work pressure.",
  },
  {
    id: "mem-2",
    category: "Preferences",
    factOrReflection: "fact",
    content: "Finds instrumental cello and evening rain sounds soothing when overwhelmed.",
    learnedAt: "Aug 29, 2026",
    whySaved: "Personalizes ambient sound suggestions in Just Listen mode.",
  },
  {
    id: "mem-3",
    category: "People",
    factOrReflection: "fact",
    content: "Rohan is a close friend and former classmate whom Aarav trusts deeply.",
    learnedAt: "Aug 15, 2026",
    whySaved: "Provides conversational continuity when discussing trusted circles.",
  },
  {
    id: "mem-4",
    category: "Goals",
    factOrReflection: "fact",
    content: "Wants to take a daily 15-minute evening walk without checking phone notifications.",
    learnedAt: "Sep 5, 2026",
    whySaved: "Core micro-habit agreed upon during planning mode.",
  },
  {
    id: "mem-5",
    category: "Growth",
    factOrReflection: "reflection",
    content: "Recognized own worth without needing immediate external validation.",
    learnedAt: "Sep 7, 2026",
    whySaved: "Significant emotional milestone reflecting personal agency.",
  },
];

// ── Scene Mock Data ────────────────────────────────────────────────────────

export const MOCK_SCENE_PROMPTS: MockScenePrompt[] = [
  {
    id: "scene-1",
    title: "City Rooftop at Dawn",
    style: "Anime",
    prompt: "A young person sitting quietly on a high balcony, watching golden dawn light break over distant skyscrapers.",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    duration: "15s loop",
  },
  {
    id: "scene-2",
    title: "Rain on Ancient Leaves",
    style: "Nature",
    prompt: "Gentle raindrops splashing into a quiet forest spring surrounded by green moss.",
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80",
    duration: "20s loop",
  },
  {
    id: "scene-3",
    title: "The Warm Lantern",
    style: "Cinematic",
    prompt: "A quiet wooden writing desk with a softly glowing warm brass lamp late at night.",
    imageUrl: "https://images.unsplash.com/photo-1507842229458-57076e033e08?w=800&auto=format&fit=crop&q=80",
    duration: "10s loop",
  },
];
