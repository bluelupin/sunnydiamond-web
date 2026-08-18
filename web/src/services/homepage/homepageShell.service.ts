import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import {
  EMPTY_HOMEPAGE_SHELL,
  mapHomepageShellData,
  type NormalizedHomepageShell,
} from "./homepage.mapper";
import type { StrapiHomepageShellEntity } from "./homepage.strapi.types";

export const getHomepageShell = cache(
  async (signal?: AbortSignal): Promise<NormalizedHomepageShell> => {
    try {
      const raw = await apiFetch<StrapiHomepageShellEntity>(STRAPI_ENDPOINTS.homepageShell, {
        signal,
      });

      return mapHomepageShellData(raw);
    } catch {
      return EMPTY_HOMEPAGE_SHELL;
    }
  },
);

export { EMPTY_HOMEPAGE_SHELL };
export type { NormalizedHomepageShell };
