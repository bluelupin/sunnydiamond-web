import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import type { HomepageSeoData } from "@/types/homepage/seo";

/** `populate=seo` is not enough — nested populate is required for ogImage + metaKeywords. */
const HOMEPAGE_SEO_QUERY = "populate[seo][populate]=*";

export const getHomepageSeo = cache(async (signal?: AbortSignal): Promise<HomepageSeoData> => {
  try {
    const raw = await apiFetch<HomepageSeoData>(
      `${STRAPI_ENDPOINTS.homepage}?${HOMEPAGE_SEO_QUERY}`,
      { signal },
    );
    return raw ?? {};
  } catch {
    return {};
  }
});
