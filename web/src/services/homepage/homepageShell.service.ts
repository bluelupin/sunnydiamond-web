import { unstable_cache } from "next/cache";
import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { HOMEPAGE_CMS_REVALIDATE_SECONDS } from "@/lib/homepage/cacheConfig";
import {
  EMPTY_HOMEPAGE_SHELL,
  mapHomepageShellData,
  type NormalizedHomepageShell,
} from "./homepage.mapper";
import type { StrapiHomepageShellEntity } from "./homepage.strapi.types";

async function fetchHomepageShellFromCms(): Promise<NormalizedHomepageShell> {
  const raw = await apiFetch<StrapiHomepageShellEntity>(STRAPI_ENDPOINTS.homepageShell, {
    next: { revalidate: HOMEPAGE_CMS_REVALIDATE_SECONDS, tags: ["homepage-shell"] },
  });

  return mapHomepageShellData(raw);
}

const getCachedHomepageShellData = unstable_cache(
  fetchHomepageShellFromCms,
  ["homepage-shell-normalized"],
  { revalidate: HOMEPAGE_CMS_REVALIDATE_SECONDS, tags: ["homepage-shell"] },
);

export const getHomepageShell = cache(
  async (_signal?: AbortSignal): Promise<NormalizedHomepageShell> => {
    try {
      return await getCachedHomepageShellData();
    } catch {
      return EMPTY_HOMEPAGE_SHELL;
    }
  },
);

export { EMPTY_HOMEPAGE_SHELL };
export type { NormalizedHomepageShell };
