import { NextResponse } from "next/server";
import { getStoreLocatorPage } from "@/services/store-locator/store-locator-page.service";

/** Same refresh as the store-locator page (ISR 300 s). */
const SHOWROOMS_REVALIDATE_SECONDS = 300;

/**
 * GET /api/store-locator/showrooms — active showrooms (with coordinates) + nearest-store radius
 * for the PDP nearest-stores strip. Uses the same CMS sources as the store-locator page.
 */
export async function GET() {
  try {
    const page = await getStoreLocatorPage({
      signal: AbortSignal.timeout(15_000),
    });
    return NextResponse.json(
      {
        showrooms: page.showrooms,
        nearestStoreRadiusKm: page.nearestStoreRadiusKm,
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${SHOWROOMS_REVALIDATE_SECONDS}, stale-while-revalidate=60`,
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Showrooms unavailable" }, { status: 502 });
  }
}
