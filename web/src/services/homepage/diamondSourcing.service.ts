import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { homepagePopulateParams } from "./homepageSectionParams";
import type { DiamondSourcingData } from "@/types/homepage/diamondSourcing";

export async function getDiamondSourcingSection(signal?: AbortSignal): Promise<DiamondSourcingData> {
  return apiFetch<DiamondSourcingData>(STRAPI_ENDPOINTS.homepage, {
    params: homepagePopulateParams.diamondSourcingSection,
    signal,
  });
}

