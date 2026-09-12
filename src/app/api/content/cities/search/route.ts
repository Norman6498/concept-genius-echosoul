import { NextRequest, NextResponse } from "next/server";
import { searchCities } from "@/lib/content/catalog-query";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || undefined;
  const country = searchParams.get("country") || undefined;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;

  const cities = await searchCities({
    query,
    country,
    limit,
  });

  return NextResponse.json({
    cities,
    count: cities.length,
  });
}
