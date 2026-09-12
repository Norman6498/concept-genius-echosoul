/**
 * EchoSoul Master Content & Personalization Database Types
 */

export interface LanguageRecord {
  id: string; // 'hi', 'en', 'bn', 'ta', 'te', 'pa', 'ur', etc.
  iso_code: string;
  name: string;
  native_name: string;
  region?: string;
  script_default: string;
  active: boolean;
}

export interface ScriptRecord {
  id: string; // 'devanagari', 'latin', 'arabic', 'gurmukhi', etc.
  code: string;
  name: string;
  direction: "ltr" | "rtl";
}

export interface AuthorRecord {
  id: string;
  canonical_name: string;
  alternate_names?: string[];
  languages: string[];
  scripts: string[];
  birth_year?: number;
  death_year?: number;
  biography?: string;
  source?: string;
  verification_status: "verified" | "probable" | "disputed";
}

export interface MusicArtist {
  id: string;
  name: string;
  normalized_name: string;
  alternate_names?: string[];
  artist_type: "solo" | "band" | "group" | "composer" | "producer" | "singer" | "instrumentalist" | "classical";
  languages: string[];
  regions?: string[];
  genres: string[];
  biography?: string;
  image_url?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist_name: string;
  album_title?: string;
  primary_language: string; // 'hi', 'en', 'pa', 'bn', 'ta', 'te', etc.
  languages?: string[];
  script?: string;
  release_year?: number;
  duration: number; // in seconds
  genre: string;
  subgenres?: string[];
  energy: number; // 0.0 to 1.0
  tempo: "very_slow" | "slow" | "medium" | "upbeat" | "fast";
  mood_tags: string[]; // e.g. ['peace', 'warmth', 'nostalgia', 'focus']
  theme_tags: string[]; // e.g. ['late_night', 'solitude', 'healing', 'travel']
  instrumentation?: string[];
  artwork_url?: string;
  audio_url?: string;
  rights_status: "public_domain" | "licensed" | "provider_only" | "restricted" | "unknown";
  recommendation_reason?: string;
  reason_codes?: string[];
}

export interface BookRecord {
  id: string;
  title: string;
  author_name: string;
  description: string;
  language: string;
  script: string;
  genre: string;
  themes: string[];
  publication_year?: number;
  cover_asset: string;
  full_text_available: boolean;
  passages_available: boolean;
  recommendation_reason?: string;
  reason_codes?: string[];
}

export interface LiteraryPassage {
  id: string;
  book_title?: string;
  author_name: string;
  exact_text: string;
  language: string;
  script: string;
  chapter?: string;
  verification_status: "verified" | "probable" | "disputed";
}

export interface ShayariRecord {
  id: string;
  text: string;
  author_name: string;
  attribution: string;
  language: "ur" | "hi";
  script: "arabic" | "devanagari" | "latin";
  theme: string;
  emotion?: string;
  tone?: string;
  english_translation?: string;
  philosophical_meaning?: string;
  verification_status: "verified" | "probable" | "disputed";
}

export interface PoemRecord {
  id: string;
  title: string;
  author_name: string;
  exact_text: string;
  language: string;
  script: string;
  theme: string;
  meaning?: string;
  verification_status: "verified";
}

export interface QuoteRecord {
  id: string;
  exact_text: string;
  author_name: string;
  work?: string;
  language: string;
  script: string;
  theme: string;
  verification_status: "verified" | "probable" | "uncertain" | "disputed";
}

export interface VisualScene {
  id: string;
  title: string;
  description: string;
  category: string;
  theme: string;
  thumbnail_url: string;
}

export interface RecommendationResult<T> {
  item: T;
  rank_score: number;
  reason: string;
  reason_codes: string[];
}
