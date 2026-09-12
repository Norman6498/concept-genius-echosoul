/**
 * EchoSoul Master Content Catalog Query Engine
 *
 * Implements the production database query layer across:
 * - Books (Project Gutenberg & Open Library)
 * - Music (MusicBrainz & Provider References — Zero Audio File Storage)
 * - Geography (GeoNames 2,000+ Global Cities)
 *
 * Pattern:
 * 1. Queries Supabase live catalog tables
 * 2. Falls back seamlessly to offline / static corpus on network or cold-start
 */

import { createClient } from "@supabase/supabase-js";
import { BookRecord, MusicTrack, CityRecord, RecommendationResult } from "./types";
import { MASTER_BOOKS_CATALOG, MASTER_MUSIC_CATALOG } from "./corpus";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

// Server-side Supabase client for content catalog queries
function getContentClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

// In-memory cache for cities dataset
let cachedCities: CityRecord[] | null = null;

function getCitiesDataset(): CityRecord[] {
  if (cachedCities) return cachedCities;
  try {
    const jsonPath = resolve(process.cwd(), "src/lib/content/cities-catalog.json");
    if (existsSync(jsonPath)) {
      const raw = readFileSync(jsonPath, "utf8");
      cachedCities = JSON.parse(raw);
      return cachedCities || [];
    }
  } catch (err) {
    console.warn("Could not load cities-catalog.json:", err);
  }
  return [];
}

/**
 * Query Books from the live Supabase catalog with multi-factor fallback
 */
export async function queryBooksFromDB(params: {
  query?: string;
  mood?: string;
  focus?: string;
  language?: string;
  limit?: number;
}): Promise<RecommendationResult<BookRecord> | null> {
  const { query, mood, focus, language, limit = 10 } = params;
  const client = getContentClient();

  if (client) {
    try {
      let dbQuery = client
        .from("books")
        .select(`
          id,
          title,
          description,
          language,
          script,
          genre,
          themes,
          publication_year,
          cover_asset,
          full_text_available,
          passages_available,
          authors (
            canonical_name
          )
        `)
        .limit(limit);

      if (language) {
        dbQuery = dbQuery.eq("language", language);
      }

      if (query) {
        dbQuery = dbQuery.ilike("title", `%${query}%`);
      }

      const { data, error } = await dbQuery;
      if (!error && data && data.length > 0) {
        const randomMatch = data[Math.floor(Math.random() * data.length)] as any;
        const authorName = randomMatch.authors?.canonical_name || "Historical Author";

        const book: BookRecord = {
          id: randomMatch.id,
          title: randomMatch.title,
          author_name: authorName,
          description: randomMatch.description || "",
          language: randomMatch.language || "en",
          script: randomMatch.script || "latin",
          genre: randomMatch.genre || "Philosophy",
          themes: randomMatch.themes || ["presence", "wisdom"],
          publication_year: randomMatch.publication_year,
          cover_asset: randomMatch.cover_asset || "/tabs/words_bg.jpg",
          full_text_available: Boolean(randomMatch.full_text_available),
          passages_available: Boolean(randomMatch.passages_available),
        };

        return {
          item: book,
          rank_score: 0.95,
          reason: `Selected from EchoSoul's Project Gutenberg master catalog for ${mood || "stillness"}.`,
          reason_codes: ["database_match", "authoritative_source", "gutenberg_catalog"],
        };
      }
    } catch (err) {
      console.warn("queryBooksFromDB fallback triggered:", err);
    }
  }

  // Fallback to static corpus
  const fallbackItem = MASTER_BOOKS_CATALOG[0];
  return {
    item: fallbackItem,
    rank_score: 0.85,
    reason: "Selected from EchoSoul core literature works.",
    reason_codes: ["static_corpus_fallback"],
  };
}

/**
 * Query Music Tracks from the live Supabase catalog with multi-factor fallback
 */
export async function queryMusicFromDB(params: {
  query?: string;
  mood?: string;
  focus?: string;
  languages?: string[];
  limit?: number;
}): Promise<RecommendationResult<MusicTrack> | null> {
  const { query, mood, languages, limit = 10 } = params;
  const client = getContentClient();

  if (client) {
    try {
      let dbQuery = client
        .from("music_tracks")
        .select(`
          id,
          title,
          duration,
          genre,
          primary_language,
          energy,
          tempo,
          mood_tags,
          theme_tags,
          artwork_url,
          rights_status,
          provider,
          provider_track_id,
          musicbrainz_recording_id,
          music_artists (
            name
          )
        `)
        .limit(limit);

      if (languages && languages.length > 0) {
        dbQuery = dbQuery.in("primary_language", languages);
      }

      if (query) {
        dbQuery = dbQuery.ilike("title", `%${query}%`);
      }

      const { data, error } = await dbQuery;
      if (!error && data && data.length > 0) {
        const randomMatch = data[Math.floor(Math.random() * data.length)] as any;
        const artistName = randomMatch.music_artists?.name || "Various Artists";

        const track: MusicTrack = {
          id: randomMatch.id,
          title: randomMatch.title,
          artist_name: artistName,
          primary_language: randomMatch.primary_language || "hi",
          duration: randomMatch.duration || 240,
          genre: randomMatch.genre || "Acoustic",
          energy: Number(randomMatch.energy || 0.4),
          tempo: randomMatch.tempo || "slow",
          mood_tags: randomMatch.mood_tags || ["peace", "calm"],
          theme_tags: randomMatch.theme_tags || ["stillness"],
          artwork_url: randomMatch.artwork_url || "/home/music_focus_flow_hd.jpg",
          rights_status: randomMatch.rights_status || "provider_only",
        };

        return {
          item: track,
          rank_score: 0.94,
          reason: `Discovered from MusicBrainz metadata catalog for ${mood || "contemplation"}.`,
          reason_codes: ["database_match", "musicbrainz_reference", "mood_resonance"],
        };
      }
    } catch (err) {
      console.warn("queryMusicFromDB fallback triggered:", err);
    }
  }

  // Fallback to static corpus
  const fallbackItem = MASTER_MUSIC_CATALOG[0];
  return {
    item: fallbackItem,
    rank_score: 0.85,
    reason: "Selected from EchoSoul core musical compositions.",
    reason_codes: ["static_corpus_fallback"],
  };
}

/**
 * Search Cities from GeoNames master dataset (in-memory + database sync)
 */
export async function searchCities(params: {
  query?: string;
  country?: string;
  limit?: number;
}): Promise<CityRecord[]> {
  const { query = "", country, limit = 20 } = params;
  const q = query.trim().toLowerCase();
  const dataset = getCitiesDataset();

  const filtered = dataset.filter((city) => {
    if (country && city.country.toUpperCase() !== country.toUpperCase()) {
      return false;
    }
    if (!q) return true;
    return (
      city.ascii.toLowerCase().includes(q) ||
      city.name.toLowerCase().includes(q) ||
      city.alt.some((a) => a.toLowerCase().includes(q))
    );
  });

  return filtered.slice(0, limit);
}
