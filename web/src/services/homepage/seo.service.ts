import { unstable_cache } from "next/cache";
import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { HOMEPAGE_CMS_REVALIDATE_SECONDS } from "@/lib/homepage/cacheConfig";
import type { HomepageSeoData } from "@/types/homepage/seo";

/** `populate=seo` is not enough — nested populate is required for ogImage + metaKeywords. */
const HOMEPAGE_SEO_QUERY = "populate[seo][populate]=*";

async function fetchHomepageSeoFromCms(): Promise<HomepageSeoData> {
  const raw = await apiFetch<HomepageSeoData>(
    `${STRAPI_ENDPOINTS.homepage}?${HOMEPAGE_SEO_QUERY}`,
    {
      next: { revalidate: HOMEPAGE_CMS_REVALIDATE_SECONDS, tags: ["homepage-seo"] },
    },
  );

  return raw ?? {};
}

const getCachedHomepageSeo = unstable_cache(
  fetchHomepageSeoFromCms,
  ["homepage-seo-raw"],
  { revalidate: HOMEPAGE_CMS_REVALIDATE_SECONDS, tags: ["homepage-seo"] },
);

export const getHomepageSeo = cache(async (_signal?: AbortSignal): Promise<HomepageSeoData> => {
  try {
    return await getCachedHomepageSeo();
  } catch {
    return {};
  }
});
