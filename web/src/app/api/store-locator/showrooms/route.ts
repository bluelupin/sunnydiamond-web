import { NextResponse } from "next/server";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapStoreLocatorPage } from "@/services/store-locator/store-locator-page.mapper";
import type { StrapiStoreLocatorPage } from "@/services/store-locator/store-locator-page.types";

/** Same refresh as the store-locator page (ISR 300 s). */
const SHOWROOMS_REVALIDATE_SECONDS = 300;

/**
 * GET /api/store-locator/showrooms — showrooms (with coordinates) + nearest-store radius
 * for the PDP nearest-stores strip. The CMS response is cached on this server, so the
 * strip never hits Strapi per shopper; a failed CMS call is not cached.
 */
export async function GET() {
  try {
    const raw = await apiFetch<StrapiStoreLocatorPage>(STRAPI_ENDPOINTS.storeLocatorPage, {
      next: { revalidate: SHOWROOMS_REVALIDATE_SECONDS },
    });
    const page = mapStoreLocatorPage(raw);
    return NextResponse.json({
      showrooms: page.showrooms,
      nearestStoreRadiusKm: page.nearestStoreRadiusKm,
    });
  } catch {
    return NextResponse.json({ error: "Showrooms unavailable" }, { status: 502 });
  }
}
