import { NextRequest, NextResponse } from "next/server";
import { queryMusicFromDB } from "@/lib/content/catalog-query";
import { recommendMusic } from "@/lib/content/recommendation-engine";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || undefined;
  const mood = searchParams.get("mood") || undefined;
  const focus = searchParams.get("focus") || undefined;
  const langs = searchParams.get("languages")?.split(",") || undefined;

  let recommendation = await queryMusicFromDB({
    query,
    mood,
    focus,
    languages: langs,
  });

  if (!recommendation) {
    recommendation = recommendMusic({
      query,
      mood,
      focus,
      musicLanguages: langs,
    });
  }

  return NextResponse.json({
    recommendation,
  });
}

