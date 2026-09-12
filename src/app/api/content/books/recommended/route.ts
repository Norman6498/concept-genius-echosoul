import { NextRequest, NextResponse } from "next/server";
import { queryBooksFromDB } from "@/lib/content/catalog-query";
import { recommendBook } from "@/lib/content/recommendation-engine";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || undefined;
  const mood = searchParams.get("mood") || undefined;
  const focus = searchParams.get("focus") || undefined;
  const language = searchParams.get("language") || undefined;

  let recommendation = await queryBooksFromDB({
    query,
    mood,
    focus,
    language,
  });

  if (!recommendation) {
    recommendation = recommendBook({
      query,
      mood,
      focus,
    });
  }

  return NextResponse.json({
    recommendation,
  });
}

