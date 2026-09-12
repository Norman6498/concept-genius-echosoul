import { NextRequest, NextResponse } from "next/server";
import { MASTER_QUOTES_CATALOG } from "@/lib/content/corpus";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  const author = searchParams.get("author")?.toLowerCase();

  let results = MASTER_QUOTES_CATALOG;

  if (author) {
    results = results.filter((qt) => qt.author_name.toLowerCase().includes(author));
  }

  if (q) {
    results = results.filter(
      (qt) =>
        qt.exact_text.toLowerCase().includes(q) ||
        qt.author_name.toLowerCase().includes(q) ||
        qt.theme.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    count: results.length,
    quotes: results,
  });
}
