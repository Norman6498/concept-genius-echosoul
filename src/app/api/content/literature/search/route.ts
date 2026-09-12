import { NextRequest, NextResponse } from "next/server";
import { MASTER_BOOKS_CATALOG } from "@/lib/content/corpus";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  const genre = searchParams.get("genre")?.toLowerCase();

  let results = MASTER_BOOKS_CATALOG;

  if (genre) {
    results = results.filter((book) => book.genre.toLowerCase().includes(genre));
  }

  if (q) {
    results = results.filter(
      (book) =>
        book.title.toLowerCase().includes(q) ||
        book.author_name.toLowerCase().includes(q) ||
        book.themes.some((t) => t.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({
    count: results.length,
    books: results,
  });
}
