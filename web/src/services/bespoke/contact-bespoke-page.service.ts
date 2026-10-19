import { unstable_cache } from "next/cache";
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
async function fetchContactBespokePageFromCms(): Promise<NormalizedContactBespokePage> {
  const raw = await apiFetch<StrapiContactBespokePageEntity>(
    STRAPI_ENDPOINTS.contactBespokePage,
    { next: { revalidate: 300, tags: ["contact-bespoke-page"] } },
  );

  return mapContactBespokePage(raw);
}

const getCachedContactBespokePage = unstable_cache(
  fetchContactBespokePageFromCms,
  ["contact-bespoke-page-normalized"],
  { revalidate: 300, tags: ["contact-bespoke-page"] },
);

/** Request-scoped dedupe (metadata + page) plus cross-request CMS cache. */
export const getContactBespokePage = cache(
  async (): Promise<NormalizedContactBespokePage> => {
    try {
      return await getCachedContactBespokePage();
    } catch {
      return EMPTY_CONTACT_BESPOKE_PAGE;
    }
  },
);

export { EMPTY_CONTACT_BESPOKE_PAGE };
export type { NormalizedContactBespokePage };
