/**
 * EchoSoul Unified Content Universe Registry (System A)
 *
 * Authoritative content schema and domain registry decoupled from LLM internal weights.
 * Manages literature, poetry, shayari, music, ambient audio, meditations, and visual scenes.
 *
 * Principles:
 * 1. Languages and scripts are strictly decoupled.
 * 2. Every content record carries independent rights and verification status.
 * 3. Exact source text remains immutable; contextual meaning is generated dynamically.
 */

// ── 1. LANGUAGE & SCRIPT REGISTRY ───────────────────────────────────────────

export interface LanguageDefinition {
  id: string; // ISO 639-1 / 639-3 code
  name: string;
  nativeName: string;
  family: "indo_aryan" | "dravidian" | "indo_european" | "tibeto_burman" | "other";
  supportedScripts: string[];
  defaultScript: string;
}

export interface ScriptDefinition {
  id: string; // e.g. 'devanagari', 'arabic_nastaliq', 'latin', etc.
  name: string;
  direction: "ltr" | "rtl";
  unicodeRanges: [number, number][];
}

export const LANGUAGES_REGISTRY: Record<string, LanguageDefinition> = {
  hi: { id: "hi", name: "Hindi", nativeName: "हिन्दी", family: "indo_aryan", supportedScripts: ["devanagari", "latin"], defaultScript: "devanagari" },
  ur: { id: "ur", name: "Urdu", nativeName: "اردو", family: "indo_aryan", supportedScripts: ["arabic_nastaliq", "devanagari", "latin"], defaultScript: "arabic_nastaliq" },
  en: { id: "en", name: "English", nativeName: "English", family: "indo_european", supportedScripts: ["latin"], defaultScript: "latin" },
  pa: { id: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", family: "indo_aryan", supportedScripts: ["gurmukhi", "arabic_nastaliq", "latin"], defaultScript: "gurmukhi" },
  bn: { id: "bn", name: "Bengali", nativeName: "বাংলা", family: "indo_aryan", supportedScripts: ["bengali", "latin"], defaultScript: "bengali" },
  ta: { id: "ta", name: "Tamil", nativeName: "தமிழ்", family: "dravidian", supportedScripts: ["tamil", "latin"], defaultScript: "tamil" },
  te: { id: "te", name: "Telugu", nativeName: "తెలుగు", family: "dravidian", supportedScripts: ["telugu", "latin"], defaultScript: "telugu" },
  ml: { id: "ml", name: "Malayalam", nativeName: "മലയാളം", family: "dravidian", supportedScripts: ["malayalam", "latin"], defaultScript: "malayalam" },
  kn: { id: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", family: "dravidian", supportedScripts: ["kannada", "latin"], defaultScript: "kannada" },
  mr: { id: "mr", name: "Marathi", nativeName: "मराठी", family: "indo_aryan", supportedScripts: ["devanagari", "latin"], defaultScript: "devanagari" },
  gu: { id: "gu", name: "Gujarati", nativeName: "ગુજરાતી", family: "indo_aryan", supportedScripts: ["gujarati", "latin"], defaultScript: "gujarati" },
  as: { id: "as", name: "Assamese", nativeName: "অসমীয়া", family: "indo_aryan", supportedScripts: ["bengali", "latin"], defaultScript: "bengali" },
  or: { id: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", family: "indo_aryan", supportedScripts: ["odia", "latin"], defaultScript: "odia" },
  kok: { id: "kok", name: "Konkani", nativeName: "कोंकणी", family: "indo_aryan", supportedScripts: ["devanagari", "latin"], defaultScript: "devanagari" },
  ks: { id: "ks", name: "Kashmiri", nativeName: "کٲشُر", family: "indo_aryan", supportedScripts: ["arabic_nastaliq", "devanagari"], defaultScript: "arabic_nastaliq" },
  sd: { id: "sd", name: "Sindhi", nativeName: "سنڌي", family: "indo_aryan", supportedScripts: ["arabic_nastaliq", "devanagari"], defaultScript: "arabic_nastaliq" },
  ne: { id: "ne", name: "Nepali", nativeName: "नेपाली", family: "indo_aryan", supportedScripts: ["devanagari"], defaultScript: "devanagari" },
  bho: { id: "bho", name: "Bhojpuri", nativeName: "भोजपुरी", family: "indo_aryan", supportedScripts: ["devanagari"], defaultScript: "devanagari" },
  mai: { id: "mai", name: "Maithili", nativeName: "मैथिली", family: "indo_aryan", supportedScripts: ["devanagari"], defaultScript: "devanagari" },
  raj: { id: "raj", name: "Rajasthani", nativeName: "राजस्थानी", family: "indo_aryan", supportedScripts: ["devanagari"], defaultScript: "devanagari" },
};

export const SCRIPTS_REGISTRY: Record<string, ScriptDefinition> = {
  devanagari: { id: "devanagari", name: "Devanagari", direction: "ltr", unicodeRanges: [[0x0900, 0x097f]] },
  arabic_nastaliq: { id: "arabic_nastaliq", name: "Nastaliq / Arabic", direction: "rtl", unicodeRanges: [[0x0600, 0x06ff], [0x0750, 0x077f], [0xfb50, 0xfdff], [0xfe70, 0xfeff]] },
  latin: { id: "latin", name: "Latin", direction: "ltr", unicodeRanges: [[0x0000, 0x007f], [0x0080, 0x00ff]] },
  gurmukhi: { id: "gurmukhi", name: "Gurmukhi", direction: "ltr", unicodeRanges: [[0x0a00, 0x0a7f]] },
  bengali: { id: "bengali", name: "Bengali-Assamese", direction: "ltr", unicodeRanges: [[0x0980, 0x09ff]] },
  tamil: { id: "tamil", name: "Tamil", direction: "ltr", unicodeRanges: [[0x0b80, 0x0bff]] },
  telugu: { id: "telugu", name: "Telugu", direction: "ltr", unicodeRanges: [[0x0c00, 0x0c7f]] },
  malayalam: { id: "malayalam", name: "Malayalam", direction: "ltr", unicodeRanges: [[0x0d00, 0x0d7f]] },
  kannada: { id: "kannada", name: "Kannada", direction: "ltr", unicodeRanges: [[0x0c80, 0x0cff]] },
  gujarati: { id: "gujarati", name: "Gujarati", direction: "ltr", unicodeRanges: [[0x0a80, 0x0aff]] },
  odia: { id: "odia", name: "Odia", direction: "ltr", unicodeRanges: [[0x0b00, 0x0b7f]] },
};

// ── 2. RIGHTS & PROVENANCE REGISTRY ─────────────────────────────────────────

export type RightsStatus =
  | "public_domain"
  | "licensed"
  | "cc0"
  | "cc_by"
  | "cc_by_sa"
  | "provider_only"
  | "user_provided"
  | "restricted"
  | "unknown";

export type VerificationStatus = "verified" | "probable" | "disputed" | "unverified";

export interface ContentProvenance {
  sourceId: string;
  sourceUrl?: string;
  license: string;
  rightsStatus: RightsStatus;
  verificationStatus: VerificationStatus;
  attributionRequired: boolean;
  attributionText?: string;
  checksum?: string;
}

// ── 3. CORE CONTENT ENTITY TYPES ────────────────────────────────────────────

export interface AuthorEntity {
  id: string;
  canonicalName: string;
  alternateNames?: string[];
  languages: string[];
  scripts: string[];
  birthYear?: number;
  deathYear?: number;
  biography?: string;
  provenance: ContentProvenance;
}

export interface BookEntity {
  id: string;
  title: string;
  normalizedTitle: string;
  authorId: string;
  authorName: string;
  description: string;
  languageIds: string[];
  scriptIds: string[];
  genres: string[];
  themes: string[];
  publicationYear?: number;
  coverAssetUrl?: string;
  fullTextAvailable: boolean;
  passagesAvailable: boolean;
  provenance: ContentProvenance;
}

export interface LiteraryPassageEntity {
  id: string;
  bookId?: string;
  authorId: string;
  authorName: string;
  exactText: string;
  languageId: string;
  scriptId: string;
  chapterOrLocation?: string;
  themes: string[];
  emotions: string[];
  tone: string;
  provenance: ContentProvenance;
}

export interface PoetryEntity {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  exactText: string;
  languageId: string;
  scriptId: string;
  themes: string[];
  emotions: string[];
  tone: string;
  provenance: ContentProvenance;
}

export interface ShayariEntity {
  id: string;
  coupletText: string;
  authorId: string;
  authorName: string;
  languageId: string;
  scriptId: string;
  themes: string[];
  emotions: string[];
  meterOrForm?: string;
  provenance: ContentProvenance;
}

export interface QuoteEntity {
  id: string;
  exactText: string;
  authorId: string;
  authorName: string;
  workTitle?: string;
  languageId: string;
  scriptId: string;
  themes: string[];
  context?: string;
  provenance: ContentProvenance;
}

export interface ContentMeaningEntity {
  id: string;
  contentId: string;
  contentType: "passage" | "poetry" | "shayari" | "quote";
  simpleMeaning: string;
  themes: string[];
  possibleContexts: string[];
  emotionalContexts: string[];
  lifeApplications: string[];
  languageId: string;
  scriptId: string;
}

export interface MusicTrackEntity {
  id: string;
  title: string;
  artistName: string;
  albumTitle?: string;
  primaryLanguage: string;
  languages?: string[];
  genre: string;
  subgenres?: string[];
  duration: number; // in seconds
  audioUrl?: string;
  artworkUrl?: string;
  solfeggioFrequencyHz?: number;
  moodTags: string[];
  themeTags: string[];
  provenance: ContentProvenance;
}

export interface MeditationExperienceEntity {
  id: string;
  title: string;
  type: "breathing" | "grounding" | "focus" | "sleep" | "relaxation" | "reflection";
  durationSeconds: number;
  instructionText: string;
  solfeggioFrequencyHz: number;
  matchedWorldKey: string;
  moodTags: string[];
  goalTags: string[];
  provenance: ContentProvenance;
}

export interface VisualSceneEntity {
  id: string;
  key: string;
  name: string;
  category: "nature" | "minimal" | "space" | "rooms" | "cities";
  tagline: string;
  image: string;
  solfeggioFrequencyHz: number;
  provenance: ContentProvenance;
}

// ── 4. USER COLLECTIONS & INTERACTION FEEDBACK ──────────────────────────────

export interface UserCollectionsRegistry {
  mySongs: string[]; // track IDs
  myMelodies: string[]; // melody IDs
  myBooks: string[]; // book IDs
  myPassages: string[]; // passage IDs
  myShayari: string[]; // shayari IDs
  myQuotes: string[]; // quote IDs
  myMeditations: string[]; // meditation IDs
  myScenes: string[]; // scene keys
  notesByContentId: Record<string, string>;
}

export type ContentFeedbackEvent =
  | "exactly_this"
  | "not_me"
  | "too_heavy"
  | "beautiful"
  | "more_like_this"
  | "less_like_this";

// ── 5. UNIFIED CONTENT RECOMMENDATION SCORER ────────────────────────────────

export interface RecommendationQueryContext {
  currentQuery?: string;
  currentMood?: string;
  currentFocus?: string;
  preferredLanguages?: string[];
  timeOfDay?: "morning" | "afternoon" | "evening" | "night";
  recentFeedback?: Record<string, ContentFeedbackEvent>;
}

export function calculateContentRelevanceScore(
  itemThemes: string[],
  itemMoods: string[],
  itemLanguage: string,
  context: RecommendationQueryContext
): number {
  let score = 50; // Base score

  // 1. Language alignment
  if (context.preferredLanguages?.includes(itemLanguage)) {
    score += 25;
  }

  // 2. Mood alignment
  if (context.currentMood && itemMoods.some((m) => m.toLowerCase().includes(context.currentMood!.toLowerCase()))) {
    score += 20;
  }

  // 3. Focus / theme alignment
  if (context.currentFocus && itemThemes.some((t) => t.toLowerCase().includes(context.currentFocus!.toLowerCase()))) {
    score += 20;
  }

  return score;
}
