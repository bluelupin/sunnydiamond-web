import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { homepagePopulateParams } from "./homepageSectionParams";
import type { HeroSectionData } from "@/types/homepage/hero";

export async function getHeroSection(signal?: AbortSignal): Promise<HeroSectionData> {
  return apiFetch<HeroSectionData>(STRAPI_ENDPOINTS.homepage, {
    params: homepagePopulateParams.hero,
    signal,
  });
}

