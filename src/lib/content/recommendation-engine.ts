import {
  MASTER_MUSIC_CATALOG,
  MASTER_BOOKS_CATALOG,
  MASTER_SHAYARI_CATALOG,
  MASTER_QUOTES_CATALOG,
  MASTER_SCENES_CATALOG,
} from "./corpus";
import {
  MusicTrack,
  BookRecord,
  ShayariRecord,
  QuoteRecord,
  VisualScene,
  RecommendationResult,
} from "./types";

export interface UserContext {
  query?: string;
  mood?: string;
  focus?: string;
  musicLanguages?: string[];
  literatureLanguages?: string[];
  timeOfDay?: "morning" | "afternoon" | "evening" | "night";
}

/**
 * Recommend Music based on conversation context, mood, time, and user's preferred music languages
 */
export function recommendMusic(context: UserContext): RecommendationResult<MusicTrack> {
  const query = (context.query || "").toLowerCase();
  const mood = (context.mood || "calm").toLowerCase();
  const prefLangs = context.musicLanguages || ["hi", "en", "pa", "ta", "bn"];

  // 1. Check for explicit keywords or themes
  if (query.includes("nostalg") || query.includes("childhood") || query.includes("old days") || query.includes("kashti")) {
    const track = MASTER_MUSIC_CATALOG.find((t) => t.id === "track_hi_01") || MASTER_MUSIC_CATALOG[0];
    return {
      item: track,
      rank_score: 0.96,
      reason: "Because you've been reflecting on childhood memories and nostalgia today.",
      reason_codes: ["conversation_match", "nostalgia_theme", "language_match"],
    };
  }

  if (query.includes("focus") || query.includes("study") || query.includes("work") || query.includes("exam") || context.focus === "studies") {
    const track = MASTER_MUSIC_CATALOG.find((t) => t.id === "track_en_01") || MASTER_MUSIC_CATALOG[7];
    return {
      item: track,
      rank_score: 0.94,
      reason: "Recommended to sustain deep, uninterrupted focus and mental stillness.",
      reason_codes: ["goal_match", "focus_context", "ambient_flow"],
    };
  }

  if (query.includes("punjabi") || prefLangs.includes("pa")) {
    const track = MASTER_MUSIC_CATALOG.find((t) => t.primary_language === "pa") || MASTER_MUSIC_CATALOG[3];
    return {
      item: track,
      rank_score: 0.92,
      reason: "Recommended from your regional music preferences and appreciation for Sufi folk.",
      reason_codes: ["language_match", "regional_preference", "spiritual_calm"],
    };
  }

  if (query.includes("tamil") || prefLangs.includes("ta")) {
    const track = MASTER_MUSIC_CATALOG.find((t) => t.primary_language === "ta") || MASTER_MUSIC_CATALOG[5];
    return {
      item: track,
      rank_score: 0.91,
      reason: "Recommended for gentle acoustic acoustic calm inspired by Ilaiyaraaja's evening melodies.",
      reason_codes: ["language_match", "calm_mood", "melodic_acoustic"],
    };
  }

  if (mood.includes("anxious") || mood.includes("stress") || query.includes("stress") || query.includes("heavy")) {
    const track = MASTER_MUSIC_CATALOG.find((t) => t.id === "track_hi_02") || MASTER_MUSIC_CATALOG[1];
    return {
      item: track,
      rank_score: 0.95,
      reason: "Gentle acoustic resonance to help soften tension and quiet the racing mind.",
      reason_codes: ["mood_match", "emotional_resonance", "healing_theme"],
    };
  }

  // Default time-adaptive selection
  const defaultTrack = MASTER_MUSIC_CATALOG[0];
  return {
    item: defaultTrack,
    rank_score: 0.88,
    reason: "Because a peaceful melody creates space for a calmer you.",
    reason_codes: ["baseline_personalization", "warmth_theme"],
  };
}

/**
 * Recommend Books based on conversation context, focus, and literature preferences
 */
export function recommendBook(context: UserContext): RecommendationResult<BookRecord> {
  const query = (context.query || "").toLowerCase();
  const focus = (context.focus || "studies").toLowerCase();

  if (query.includes("stress") || query.includes("anxious") || query.includes("present") || query.includes("overthink")) {
    const book = MASTER_BOOKS_CATALOG.find((b) => b.id === "book_03")!;
    return {
      item: book,
      rank_score: 0.97,
      reason: "Recommended from your reflection on stepping out of overthinking and grounding in the present.",
      reason_codes: ["conversation_match", "mindfulness_theme"],
    };
  }

  if (query.includes("habit") || query.includes("consistent") || query.includes("routine") || focus === "studies") {
    const book = MASTER_BOOKS_CATALOG.find((b) => b.id === "book_04")!;
    return {
      item: book,
      rank_score: 0.94,
      reason: "Recommended because you value steady consistency and building manageable daily systems.",
      reason_codes: ["goal_match", "habit_discipline"],
    };
  }

  if (query.includes("career") || query.includes("priority") || query.includes("choice") || focus === "career") {
    const book = MASTER_BOOKS_CATALOG.find((b) => b.id === "book_05")!;
    return {
      item: book,
      rank_score: 0.93,
      reason: "Recommended to bring clarity to what truly matters in your direction.",
      reason_codes: ["career_focus", "prioritization"],
    };
  }

  if (query.includes("philosophy") || query.includes("stoic") || query.includes("strength") || query.includes("control")) {
    const book = MASTER_BOOKS_CATALOG.find((b) => b.id === "book_01")!;
    return {
      item: book,
      rank_score: 0.95,
      reason: "Recommended because you appreciate stoic perspective and inner strength.",
      reason_codes: ["philosophy_interest", "stoic_wisdom"],
    };
  }

  // Default literature recommendation
  const defaultBook = MASTER_BOOKS_CATALOG[1]; // The Prophet
  return {
    item: defaultBook,
    rank_score: 0.90,
    reason: "Recommended for deep poetic wisdom and soulful perspective.",
    reason_codes: ["literature_interest", "poetic_depth"],
  };
}

/**
 * Recommend Shayari / Poetry based on emotion, language, and script
 */
export function recommendShayari(context: UserContext): RecommendationResult<ShayariRecord> {
  const query = (context.query || "").toLowerCase();
  const prefLangs = context.literatureLanguages || ["hi", "ur"];

  if (prefLangs.includes("ur") || query.includes("ghalib") || query.includes("urdu")) {
    const s = MASTER_SHAYARI_CATALOG.find((item) => item.id === "shayari_03")!;
    return {
      item: s,
      rank_score: 0.95,
      reason: "Authentic Urdu Shayari in Nastaliq script exploring the depth of human longing.",
      reason_codes: ["language_match", "script_arabic", "literary_depth"],
    };
  }

  if (query.includes("patience") || query.includes("time") || query.includes("slow")) {
    const s = MASTER_SHAYARI_CATALOG.find((item) => item.id === "shayari_02")!;
    return {
      item: s,
      rank_score: 0.96,
      reason: "Kabir's timeless Doha on the necessity of patience and trusting the natural season of life.",
      reason_codes: ["theme_patience", "devanagari_script", "grounding"],
    };
  }

  const defaultShayari = MASTER_SHAYARI_CATALOG[0]; // Gulzar
  return {
    item: defaultShayari,
    rank_score: 0.92,
    reason: "Gulzar's poignant reflection on the passage of time.",
    reason_codes: ["time_theme", "devanagari_script"],
  };
}

/**
 * Recommend Visual Scene based on environment baseline & current time
 */
export function recommendScene(context: UserContext): RecommendationResult<VisualScene> {
  const defaultScene = MASTER_SCENES_CATALOG[0];
  return {
    item: defaultScene,
    rank_score: 0.90,
    reason: "Recommended for its serene alpine atmosphere and calming visual resonance.",
    reason_codes: ["visual_baseline", "nature_category"],
  };
}
