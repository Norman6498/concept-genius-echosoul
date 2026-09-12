import { NextRequest, NextResponse } from "next/server";
import { MASTER_SHAYARI_CATALOG } from "@/lib/content/corpus";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  const author = searchParams.get("author")?.toLowerCase();
  const script = searchParams.get("script")?.toLowerCase();

  let results = MASTER_SHAYARI_CATALOG;

  if (author) {
    results = results.filter((s) => s.author_name.toLowerCase().includes(author));
  }

  if (script) {
    results = results.filter((s) => s.script.toLowerCase() === script);
  }

  if (q) {
    results = results.filter(
      (s) =>
        s.text.toLowerCase().includes(q) ||
        s.author_name.toLowerCase().includes(q) ||
        s.theme.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    count: results.length,
    shayari: results,
  });
}
