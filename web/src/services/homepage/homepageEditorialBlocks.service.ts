import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import type { HomepageEditorialBlocksData } from "@/types/homepage/editorialBlocks";
import {
  EMPTY_HOMEPAGE_EDITORIAL,
  mapHomepageEditorialBlocksData,
} from "./homepage.mapper";
import type { StrapiHomepageEditorialBlocksEntity } from "./homepage.strapi.types";

export const getHomepageEditorialBlocks = cache(
  async (signal?: AbortSignal): Promise<HomepageEditorialBlocksData> => {
    try {
      const raw = await apiFetch<StrapiHomepageEditorialBlocksEntity>(
        STRAPI_ENDPOINTS.homepageEditorialBlocks,
        { signal },
      );

      return mapHomepageEditorialBlocksData(raw);
    } catch {
      return EMPTY_HOMEPAGE_EDITORIAL;
    }
  },
);

export { EMPTY_HOMEPAGE_EDITORIAL };
