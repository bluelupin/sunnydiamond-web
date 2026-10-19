import { unstable_cache } from "next/cache";
import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { HOMEPAGE_CMS_REVALIDATE_SECONDS } from "@/lib/homepage/cacheConfig";
import type { HomepageShoppingBlocksData } from "@/types/homepage/categoryNavigation";
import {
  EMPTY_HOMEPAGE_SHOPPING,
  mapHomepageShoppingBlocksData,
} from "./homepage.mapper";
import type { StrapiHomepageShoppingBlocksEntity } from "./homepage.strapi.types";

async function fetchHomepageShoppingBlocksFromCms(): Promise<HomepageShoppingBlocksData> {
  const raw = await apiFetch<StrapiHomepageShoppingBlocksEntity>(
    STRAPI_ENDPOINTS.homepageShoppingBlocks,
    {
      next: {
        revalidate: HOMEPAGE_CMS_REVALIDATE_SECONDS,
        tags: ["homepage-shopping"],
      },
    },
  );

  return mapHomepageShoppingBlocksData(raw);
}

const getCachedHomepageShoppingBlocks = unstable_cache(
  fetchHomepageShoppingBlocksFromCms,
  ["homepage-shopping-normalized"],
  { revalidate: HOMEPAGE_CMS_REVALIDATE_SECONDS, tags: ["homepage-shopping"] },
);

export const getHomepageShoppingBlocks = cache(
  async (_signal?: AbortSignal): Promise<HomepageShoppingBlocksData> => {
    try {
      return await getCachedHomepageShoppingBlocks();
    } catch {
      return EMPTY_HOMEPAGE_SHOPPING;
    }
  },
);

export { EMPTY_HOMEPAGE_SHOPPING };
