import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { homepagePopulateParams } from "./homepageSectionParams";
import type { CategoryNavigationSectionData } from "@/types/homepage/categoryNavigation";

export async function getCategoryNavigationSection(signal?: AbortSignal): Promise<CategoryNavigationSectionData> {
  return apiFetch<CategoryNavigationSectionData>(STRAPI_ENDPOINTS.homepage, {
    params: homepagePopulateParams.categoryNavigation,
    signal,
  });
}

