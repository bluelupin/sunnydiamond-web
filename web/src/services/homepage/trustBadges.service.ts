import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { homepagePopulateParams } from "./homepageSectionParams";
import type { TrustBadgesData } from "@/types/homepage/trustBadges";

export async function getTrustBadges(signal?: AbortSignal): Promise<TrustBadgesData> {
  return apiFetch<TrustBadgesData>(STRAPI_ENDPOINTS.homepage, {
    params: homepagePopulateParams.trustBadges,
    signal,
  });
}

