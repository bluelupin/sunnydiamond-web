import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapProfilePage } from "./profile-page.mapper";
import {
  EMPTY_PROFILE_PAGE,
  type NormalizedProfilePage,
  type StrapiProfilePage,
} from "./profile-page.types";

const PROFILE_PAGE_POPULATE =
  "populate[sideTabs]=true" +
  "&populate[backgroundImage][populate][desktopImage]=true" +
  "&populate[backgroundImage][populate][mobileImage]=true" +
  "&populate[trustBadgeSection][populate][callsToAction]=true";

export const getProfilePage = cache(
  async (signal?: AbortSignal): Promise<NormalizedProfilePage> => {
    try {
      const raw = await apiFetch<StrapiProfilePage>(
        `${STRAPI_ENDPOINTS.profilePage}?${PROFILE_PAGE_POPULATE}`,
        { signal },
      );
      return mapProfilePage(raw);
    } catch {
      return EMPTY_PROFILE_PAGE;
    }
  },
);

export { EMPTY_PROFILE_PAGE };
export type { NormalizedProfilePage };
