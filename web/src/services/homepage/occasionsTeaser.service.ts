import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { homepagePopulateParams } from "./homepageSectionParams";
import type { OccasionsTeaserData } from "@/types/homepage/occasionsTeaser";

export async function getOccasionsTeaser(signal?: AbortSignal): Promise<OccasionsTeaserData> {
  return apiFetch<OccasionsTeaserData>(STRAPI_ENDPOINTS.homepage, {
    params: homepagePopulateParams.occasionsTeaser,
    signal,
  });
}

