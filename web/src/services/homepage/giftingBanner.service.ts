import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { homepagePopulateParams } from "./homepageSectionParams";
import type { GiftingBannerData } from "@/types/homepage/giftingBanner";

export async function getGiftingBanner(signal?: AbortSignal): Promise<GiftingBannerData> {
  return apiFetch<GiftingBannerData>(STRAPI_ENDPOINTS.homepage, {
    params: homepagePopulateParams.giftingBanner,
    signal,
  });
}

