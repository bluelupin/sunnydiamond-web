import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapContactBespokePage } from "./contact-bespoke-page.mapper";
import {
  EMPTY_CONTACT_BESPOKE_PAGE,
  type NormalizedContactBespokePage,
  type StrapiContactBespokePageEntity,
} from "./contact-bespoke-page.types";

/**
 * Custom Strapi controller already deep-populates hero, vision, featured,
 * service highlights, get-in-touch, form, and SEO.
 */
export const getContactBespokePage = cache(
  async (signal?: AbortSignal): Promise<NormalizedContactBespokePage> => {
    try {
      const raw = await apiFetch<StrapiContactBespokePageEntity>(
        STRAPI_ENDPOINTS.contactBespokePage,
        { signal },
      );

      return mapContactBespokePage(raw);
    } catch {
      return EMPTY_CONTACT_BESPOKE_PAGE;
    }
  },
);

export { EMPTY_CONTACT_BESPOKE_PAGE };
export type { NormalizedContactBespokePage };
