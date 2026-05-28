import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { homepagePopulateParams } from "./homepageSectionParams";
import type { FeaturedCollectionData } from "@/types/homepage/featuredCollection";

export async function getFeaturedCollectionSection(signal?: AbortSignal): Promise<FeaturedCollectionData> {
  return apiFetch<FeaturedCollectionData>(STRAPI_ENDPOINTS.homepage, {
    params: homepagePopulateParams.featuredCollectionSection,
    signal,
  });
}

