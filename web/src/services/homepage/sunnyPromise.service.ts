import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { homepagePopulateParams } from "./homepageSectionParams";
import type { SunnyPromiseData } from "@/types/homepage/sunnyPromise";

export async function getSunnyPromiseSection(signal?: AbortSignal): Promise<SunnyPromiseData> {
  return apiFetch<SunnyPromiseData>(STRAPI_ENDPOINTS.homepage, {
    params: homepagePopulateParams.sunnyPromiseSection,
    signal,
  });
}

