/**
 * EchoSoul — Literature Search Adapter Interface
 *
 * Stage 6 will connect a real literature search engine backed by
 * pgvector embeddings + the curated public-domain corpus.
 *
 * The adapter pattern ensures literature retrieval can be swapped or
 * extended (e.g., adding an external poetry API) without changing
 * the orchestration layer.
 *
 * IMPORTANT: Literary results must carry full provenance.
 * Never return a passage without title, author, source, and rights status.
 */

export interface LiteratureSearchRequest {
  /** Natural-language query or emotional context description */
  query: string;
  /** ISO 639-1 language codes, e.g. ["en", "hi", "ur"] */
  languages?: string[];
  /** Optional author filter */
  authorId?: string;
  /** Genre filter, e.g. "poetry", "prose" */
  genre?: string;
  /** Max results */
  limit?: number;
  /** Minimum similarity score 0-1 */
  minScore?: number;
}

export interface LiteraturePassage {
  id: string;
  workId: string;
  /** The exact original text — never modified */
  originalText: string;
  /** Title of the source work */
  workTitle: string;
  /** Author name */
  author: string;
  /** ISO 639-1 language code */
  language: string;
  /** "public_domain" | "licensed" | "restricted" | "unknown" */
  rightsStatus: string;
  /** URL of the source document */
  sourceUrl?: string;
  /** Name of the source (e.g., "Project Gutenberg") */
  sourceName: string;
  /** Similarity score 0-1 */
  score?: number;
}

export interface LiteratureSearchResponse {
  passages: LiteraturePassage[];
  provider: string;
}

export interface LiteratureSearchAdapter {
  search(request: LiteratureSearchRequest): Promise<LiteratureSearchResponse>;
  readonly providerName: string;
}

// ── Stub ───────────────────────────────────────────────────────────────────

export class LiteratureSearchStub implements LiteratureSearchAdapter {
  readonly providerName = "stub";

  async search(_request: LiteratureSearchRequest): Promise<LiteratureSearchResponse> {
    throw new Error(
      "LiteratureSearchAdapter is not yet connected. " +
        "Literature retrieval will be implemented in Stage 6."
    );
  }
}
