import { unstable_cache } from "next/cache";
import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { HOMEPAGE_CMS_REVALIDATE_SECONDS } from "@/lib/homepage/cacheConfig";
import type { HomepageEditorialBlocksData } from "@/types/homepage/editorialBlocks";
import {
  EMPTY_HOMEPAGE_EDITORIAL,
  mapHomepageEditorialBlocksData,
} from "./homepage.mapper";
import type { StrapiHomepageEditorialBlocksEntity } from "./homepage.strapi.types";

async function fetchHomepageEditorialBlocksFromCms(): Promise<HomepageEditorialBlocksData> {
  const raw = await apiFetch<StrapiHomepageEditorialBlocksEntity>(
    STRAPI_ENDPOINTS.homepageEditorialBlocks,
    {
      next: {
        revalidate: HOMEPAGE_CMS_REVALIDATE_SECONDS,
        tags: ["homepage-editorial"],
      },
    },
  );

  return mapHomepageEditorialBlocksData(raw);
}

const getCachedHomepageEditorialBlocks = unstable_cache(
  fetchHomepageEditorialBlocksFromCms,
  ["homepage-editorial-normalized"],
  { revalidate: HOMEPAGE_CMS_REVALIDATE_SECONDS, tags: ["homepage-editorial"] },
);

export const getHomepageEditorialBlocks = cache(
  async (_signal?: AbortSignal): Promise<HomepageEditorialBlocksData> => {
    try {
      return await getCachedHomepageEditorialBlocks();
    } catch {
      return EMPTY_HOMEPAGE_EDITORIAL;
    }
  },
);

export { EMPTY_HOMEPAGE_EDITORIAL };
