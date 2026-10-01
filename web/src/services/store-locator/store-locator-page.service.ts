import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapStoreLocatorPage } from "./store-locator-page.mapper";
import { fetchStoreLocatorShowroomsFromCollection } from "./store-locator-showrooms.service";
import {
  EMPTY_STORE_LOCATOR_PAGE,
  type NormalizedStoreLocatorPage,
  type StrapiStoreLocatorPage,
} from "./store-locator-page.types";

/**
 * Custom Strapi controller deep-populates hero media/video, location filter icons,
 * connected showrooms, and SEO — `populate=*` is not required.
 *
 * Showroom list prefers the full `/api/showrooms` collection so every active CMS
 * entry appears, not only showrooms linked on the store-locator single type.
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

      const [raw, collectionShowrooms] = await Promise.all([
        apiFetch<StrapiStoreLocatorPage>(endpoint, {
          signal: options?.signal,
        }),
        fetchStoreLocatorShowroomsFromCollection(options?.signal).catch(() => []),
      ]);

      const page = mapStoreLocatorPage(raw);
      const showrooms =
        collectionShowrooms.length > 0 ? collectionShowrooms : page.showrooms;

      return {
        ...page,
        showrooms,
      };
    } catch {
      return EMPTY_STORE_LOCATOR_PAGE;
    }
  },
);

export { EMPTY_STORE_LOCATOR_PAGE };
export type { NormalizedStoreLocatorPage };
