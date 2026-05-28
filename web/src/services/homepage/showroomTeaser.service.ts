import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { homepagePopulateParams } from "./homepageSectionParams";
import type { ShowroomTeaserData } from "@/types/homepage/showroomTeaser";

export async function getShowroomTeaser(signal?: AbortSignal): Promise<ShowroomTeaserData> {
  return apiFetch<ShowroomTeaserData>(STRAPI_ENDPOINTS.homepage, {
    params: homepagePopulateParams.showroomTeaser,
    signal,
  });
}

