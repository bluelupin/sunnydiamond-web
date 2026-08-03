import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapStoreLocatorPage } from "./store-locator-page.mapper";
import {
  EMPTY_STORE_LOCATOR_PAGE,
  type NormalizedStoreLocatorPage,
  type StrapiStoreLocatorPage,
} from "./store-locator-page.types";

/**
 * Custom Strapi controller deep-populates hero media/video, location filter icons,
 * connected showrooms, and SEO — `populate=*` is not required.
 */
export const getStoreLocatorPage = cache(
  async (
    options?: { locale?: string; signal?: AbortSignal },
  ): Promise<NormalizedStoreLocatorPage> => {
    try {
      const locale = options?.locale?.trim();
      const endpoint = locale
        ? `${STRAPI_ENDPOINTS.storeLocatorPage}?locale=${encodeURIComponent(locale)}`
        : STRAPI_ENDPOINTS.storeLocatorPage;

      const raw = await apiFetch<StrapiStoreLocatorPage>(endpoint, {
        signal: options?.signal,
      });

      return mapStoreLocatorPage(raw);
    } catch {
      return EMPTY_STORE_LOCATOR_PAGE;
    }
  },
);

export { EMPTY_STORE_LOCATOR_PAGE };
export type { NormalizedStoreLocatorPage };
