import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { EMPTY_CONTACT_PAGE, mapContactPage } from "./contact-page.mapper";
import type {
  NormalizedContactPage,
  StrapiContactPage,
} from "./contact-page.types";

/**
 * `populate=*` deep-resolves hero, contact options, linked form fields,
 * Visit Us showroom media, and SEO (verified on contact-page).
 */
const CONTACT_PAGE_POPULATE = "populate=*";

export const getContactPage = cache(
  async (
    options?: { locale?: string; signal?: AbortSignal },
  ): Promise<NormalizedContactPage> => {
    try {
      const params = new URLSearchParams(CONTACT_PAGE_POPULATE);
      const locale = options?.locale?.trim();
      if (locale) {
        params.set("locale", locale);
      }

      const raw = await apiFetch<StrapiContactPage>(
        `${STRAPI_ENDPOINTS.contactPage}?${params.toString()}`,
        { signal: options?.signal },
      );

      return mapContactPage(raw);
    } catch {
      // Public permissions may still forbid this single type (403) — keep static UI.
      return EMPTY_CONTACT_PAGE;
    }
  },
);

export { EMPTY_CONTACT_PAGE };
export type { NormalizedContactPage };
