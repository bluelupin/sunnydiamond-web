import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import type { HomepageShoppingBlocksData } from "@/types/homepage/categoryNavigation";
import {
  EMPTY_HOMEPAGE_SHOPPING,
  mapHomepageShoppingBlocksData,
} from "./homepage.mapper";
import type { StrapiHomepageShoppingBlocksEntity } from "./homepage.strapi.types";

export const getHomepageShoppingBlocks = cache(
  async (signal?: AbortSignal): Promise<HomepageShoppingBlocksData> => {
    const raw = await apiFetch<StrapiHomepageShoppingBlocksEntity>(
      STRAPI_ENDPOINTS.homepageShoppingBlocks,
      { signal },
    );

    return mapHomepageShoppingBlocksData(raw);
  },
);

export { EMPTY_HOMEPAGE_SHOPPING };
