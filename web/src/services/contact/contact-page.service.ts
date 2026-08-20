import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapContactPage } from "./contact-page.mapper";
import {
  EMPTY_CONTACT_PAGE,
  type NormalizedContactPage,
  type StrapiContactPage,
} from "./contact-page.types";

/**
 * Deep populate for nested responsive-image media on the live CMS schema.
 * `populate=*` alone returns CMS 400 on contact-page — use explicit nested populate.
 */
const CONTACT_PAGE_POPULATE_QUERY =
  "populate[heroSection][populate][image][populate][desktopImage]=true" +
  "&populate[heroSection][populate][image][populate][mobileImage]=true" +
  "&populate[heroSection][populate][bgImage][populate][desktopImage]=true" +
  "&populate[heroSection][populate][bgImage][populate][mobileImage]=true" +
  "&populate[contactSection][populate][contactOptions]=true" +
  "&populate[formSection][populate][form][populate][dynamicFields][populate][dropdownOptions]=true" +
  "&populate[visitSection][populate][image][populate][desktopImage]=true" +
  "&populate[visitSection][populate][image][populate][mobileImage]=true" +
  "&populate[visitSection][populate][showrooms][populate][image][populate][desktopImage]=true" +
  "&populate[visitSection][populate][showrooms][populate][image][populate][mobileImage]=true" +
  "&populate[visitSection][populate][cta]=true" +
  "&populate[seo][populate][ogImage]=true";

export const getContactPage = cache(
  async (
    options?: { locale?: string; signal?: AbortSignal },
  ): Promise<NormalizedContactPage> => {
    try {
      const params = new URLSearchParams(CONTACT_PAGE_POPULATE_QUERY);
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
      return EMPTY_CONTACT_PAGE;
    }
  },
);

export { EMPTY_CONTACT_PAGE };
export type { NormalizedContactPage };
