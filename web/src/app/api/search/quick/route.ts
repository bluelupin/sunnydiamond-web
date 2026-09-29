import { NextRequest, NextResponse } from "next/server";
import { cleanSearchQuery, MIN_SEARCH_LENGTH } from "@/features/search/quickSearch";
import { quickSearch, searchSuggestions } from "@/services/search/quickSearch.service";

/**
 * GET /api/search/quick?q=  → products, categories, articles and service shortcuts for the dropdown.
 * GET /api/search/quick     → popular searches for the empty state.
 * Upstream calls are cached by the Next data cache (60 s per query, 1 h for curated lists).
 */
export async function GET(request: NextRequest) {
  const query = cleanSearchQuery(request.nextUrl.searchParams.get("q"));

  if (!query) {
    return NextResponse.json(await searchSuggestions());
  }
  if (query.length < MIN_SEARCH_LENGTH) {
    return NextResponse.json({ error: `Type at least ${MIN_SEARCH_LENGTH} characters` }, { status: 400 });
  }

  return NextResponse.json(await quickSearch(query));
}
