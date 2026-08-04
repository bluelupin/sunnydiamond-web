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
export const getGiftingPage = cache(
  async (
    options?: { locale?: string; signal?: AbortSignal },
  ): Promise<NormalizedGiftingPage> => {
    try {
      const locale = options?.locale?.trim();
      const endpoint = locale
        ? `${STRAPI_ENDPOINTS.giftingPage}?locale=${encodeURIComponent(locale)}`
        : STRAPI_ENDPOINTS.giftingPage;

      const raw = await apiFetch<StrapiGiftingPage>(endpoint, {
        signal: options?.signal,
      });

      return mapGiftingPage(raw);
    } catch {
      return EMPTY_GIFTING_PAGE;
    }
  },
);

export { EMPTY_GIFTING_PAGE };
export type { NormalizedGiftingPage };
