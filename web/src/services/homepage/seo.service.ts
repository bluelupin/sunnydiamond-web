import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { homepagePopulateParams } from "./homepageSectionParams";
import type { HomepageSeoData } from "@/types/homepage/seo";

export async function getHomepageSeo(signal?: AbortSignal): Promise<HomepageSeoData> {
  return apiFetch<HomepageSeoData>(STRAPI_ENDPOINTS.homepage, {
    params: homepagePopulateParams.seo,
    signal,
  });
}

