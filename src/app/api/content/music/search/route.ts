import { NextRequest, NextResponse } from "next/server";
import { MASTER_MUSIC_CATALOG } from "@/lib/content/corpus";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  const lang = searchParams.get("language")?.toLowerCase();
  const genre = searchParams.get("genre")?.toLowerCase();

  let results = MASTER_MUSIC_CATALOG;

  if (lang) {
    results = results.filter((track) => track.primary_language === lang);
  }

  if (genre) {
    results = results.filter((track) => track.genre.toLowerCase().includes(genre));
  }

  if (q) {
    results = results.filter(
      (track) =>
        track.title.toLowerCase().includes(q) ||
        track.artist_name.toLowerCase().includes(q) ||
        track.mood_tags.some((m) => m.toLowerCase().includes(q)) ||
        track.theme_tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({
    count: results.length,
    tracks: results,
  });
}
