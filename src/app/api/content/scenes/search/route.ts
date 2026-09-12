import { NextRequest, NextResponse } from "next/server";
import { MASTER_SCENES_CATALOG } from "@/lib/content/corpus";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category")?.toLowerCase();

  let results = MASTER_SCENES_CATALOG;

  if (category) {
    results = results.filter((s) => s.category.toLowerCase() === category);
  }

  return NextResponse.json({
    count: results.length,
    scenes: results,
  });
}
