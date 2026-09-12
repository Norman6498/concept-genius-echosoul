/**
 * EchoSoul Literature Schema
 * 
 * CRITICAL: Literature must ALWAYS come from the retrieval system.
 * The language model must NEVER generate literary quotes or attributions.
 * 
 * @version echosoul_literature_schema_v1
 */

export type RightsStatus = "public_domain" | "licensed" | "unknown";

export type LiteratureLanguage = 
  | "english" 
  | "hindi" 
  | "urdu" 
  | "punjabi"
  | "bengali"
  | "persian"
  | "arabic"
  | "sanskrit"
  | string;

export type LiteratureScript =
  | "latin"
  | "devanagari"
  | "nastaliq"
  | "arabic"
  | "gurmukhi"
  | string;

export type LiteratureGenre =
  | "poetry"
  | "shayari"
  | "ghazal"
  | "doha"
  | "philosophy"
  | "prose"
  | "novel"
  | "sacred_text"
  | "essay"
  | "self_help"
  | string;

/** A verified literary passage from the retrieval database. */
export interface LiteraryPassage {
  passage_id: string;
  
  /** Exact original text — NEVER modified, corrected, or summarized by AI. */
  text: string;
  
  /** Text transliteration if original is non-Latin script. */
  transliteration?: string;
  
  /** AI-generated translation (clearly marked as translation, not original). */
  translation?: string;
  
  language: LiteratureLanguage;
  script?: LiteratureScript;
  genre: LiteratureGenre;
  
  author: {
    name: string;
    birth_year?: number;
    death_year?: number;
    nationality?: string;
  };
  
  work: {
    title: string;
    publication_year?: number;
    publisher?: string;
    isbn?: string;
    source_url?: string;
  };
  
  rights_status: RightsStatus;
  
  /** Tags for semantic search and matching. */
  semantic_tags: string[];
  
  /** Emotional/thematic themes. */
  themes: string[];
  
  /** True only when retrieved from verified database — NEVER from model generation. */
  retrieval_verified: true;
  
  /** Confidence score from the retrieval/reranking system. */
  retrieval_confidence: number;
}

/** Result of a literature query — for displaying to the user. */
export interface LiteratureResult {
  passage: LiteraryPassage;
  
  /** AI-generated explanation of meaning — safe because it's explaining, not fabricating. */
  meaning: string;
  
  /** AI-generated connection to the user's current context. */
  why_it_connects: string;
  
  /** AI-generated reflection prompt. */
  reflection_prompt?: string;
  
  /** User actions available for this passage. */
  actions: Array<"save" | "share" | "add_to_journal" | "explore_author" | "find_similar">;
}

/** Query used to retrieve literature from the database. */
export interface LiteratureQuery {
  themes: string[];
  emotional_context: string;
  user_language_preference?: LiteratureLanguage;
  user_genre_preference?: LiteratureGenre[];
  author_preference?: string[];
  exclude_passage_ids?: string[];
  max_results: number;
}
