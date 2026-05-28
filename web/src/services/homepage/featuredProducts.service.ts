import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { homepagePopulateParams } from "./homepageSectionParams";
import type { FeaturedProductsData } from "@/types/homepage/featuredProducts";

export async function getFeaturedProductsSection(signal?: AbortSignal): Promise<FeaturedProductsData> {
  return apiFetch<FeaturedProductsData>(STRAPI_ENDPOINTS.homepage, {
    params: homepagePopulateParams.featuredProductsSection,
    signal,
  });
}

