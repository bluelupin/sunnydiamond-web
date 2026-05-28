import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { homepagePopulateParams } from "./homepageSectionParams";
import type { CraftsmanshipStepsData } from "@/types/homepage/craftsmanshipSteps";

export async function getCraftsmanshipSteps(signal?: AbortSignal): Promise<CraftsmanshipStepsData> {
  return apiFetch<CraftsmanshipStepsData>(STRAPI_ENDPOINTS.homepage, {
    params: homepagePopulateParams.craftsmanshipSteps,
    signal,
  });
}

