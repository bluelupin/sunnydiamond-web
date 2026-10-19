import { unstable_cache } from "next/cache";
import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapGiftingPage } from "./gifting-page.mapper";
import {
  EMPTY_GIFTING_PAGE,
  type NormalizedGiftingPage,
  type StrapiGiftingPage,
} from "./gifting-page.types";

/**
 * Custom Strapi controller deep-populates sections and SEO — `populate=*` is not required.
 */
async function fetchGiftingPageFromCms(locale?: string): Promise<NormalizedGiftingPage> {
  const trimmedLocale = locale?.trim();
  const endpoint = trimmedLocale
    ? `${STRAPI_ENDPOINTS.giftingPage}?locale=${encodeURIComponent(trimmedLocale)}`
    : STRAPI_ENDPOINTS.giftingPage;

  const raw = await apiFetch<StrapiGiftingPage>(endpoint, {
    next: { revalidate: 300, tags: ["gifting-page"] },
  });

  return mapGiftingPage(raw);
}

const getCachedGiftingPage = unstable_cache(
  fetchGiftingPageFromCms,
  ["gifting-page-normalized"],
  { revalidate: 300, tags: ["gifting-page"] },
);

/** Request-scoped dedupe (metadata + page) plus cross-request CMS cache. */
export const getGiftingPage = cache(
  async (options?: { locale?: string }): Promise<NormalizedGiftingPage> => {
    try {
      return await getCachedGiftingPage(options?.locale);
    } catch {
      return EMPTY_GIFTING_PAGE;
    }
  },
);

export { EMPTY_GIFTING_PAGE };
export type { NormalizedGiftingPage };
