import { NextRequest, NextResponse } from "next/server";
import { recommendBook } from "@/lib/content/recommendation-engine";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || undefined;
  const mood = searchParams.get("mood") || undefined;
  const focus = searchParams.get("focus") || undefined;

  const recommendation = recommendBook({
    query,
    mood,
    focus,
  });

  return NextResponse.json({
    recommendation,
  });
}
