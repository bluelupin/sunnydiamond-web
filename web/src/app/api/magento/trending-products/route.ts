import { NextResponse } from "next/server";
import { getTrendingProductsSnapshot } from "@/lib/magento/trendingProductsCache";

/** Matches MAGENTO_TRENDING_REVALIDATE_SECONDS — segment config must be a literal. */
export const revalidate = 900;

export async function GET() {
  try {
    const snapshot = await getTrendingProductsSnapshot();
    return NextResponse.json(snapshot.products, {
      headers: { "X-Trending-Products-Fetched-At": snapshot.fetchedAt },
    });
  } catch (error) {
    console.error("Trending product refresh failed", error);
    return NextResponse.json(
      { error: "Trending products unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
