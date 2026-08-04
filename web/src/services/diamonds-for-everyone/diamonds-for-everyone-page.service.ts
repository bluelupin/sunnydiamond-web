import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapDiamondsForEveryonePage } from "./diamonds-for-everyone-page.mapper";
import {
  EMPTY_DIAMONDS_FOR_EVERYONE_PAGE,
  type NormalizedDiamondsForEveryonePage,
  type StrapiDiamondsForEveryonePage,
} from "./diamonds-for-everyone-page.types";

/**
 * Custom Strapi controller deep-populates sections and SEO — `populate=*` is not required.
 */
export const getDiamondsForEveryonePage = cache(
  async (
    options?: { locale?: string; signal?: AbortSignal },
  ): Promise<NormalizedDiamondsForEveryonePage> => {
    try {
      const locale = options?.locale?.trim();
      const endpoint = locale
        ? `${STRAPI_ENDPOINTS.diamondsForEveryonePage}?locale=${encodeURIComponent(locale)}`
        : STRAPI_ENDPOINTS.diamondsForEveryonePage;

      const raw = await apiFetch<StrapiDiamondsForEveryonePage>(endpoint, {
        signal: options?.signal,
      });

      return mapDiamondsForEveryonePage(raw);
    } catch {
      return EMPTY_DIAMONDS_FOR_EVERYONE_PAGE;
    }
  },
);

export { EMPTY_DIAMONDS_FOR_EVERYONE_PAGE };
export type { NormalizedDiamondsForEveryonePage };
