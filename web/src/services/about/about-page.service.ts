import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapAboutPageData } from "./about-page.mapper";
import type { NormalizedAboutPage, StrapiAboutPageEntity } from "./about-page.types";
import { EMPTY_ABOUT_PAGE } from "./about-page.types";

/** Deep populate for nested media — shallow populate=* can leave craft mosaic tile images null. */
const ABOUT_PAGE_POPULATE_QUERY =
  "populate=*" +
  "&populate[hero][populate][image][populate][desktopImage]=true" +
  "&populate[hero][populate][image][populate][mobileImage]=true" +
  "&populate[hero][populate][heroVideo][populate][heroVideo]=true" +
  "&populate[hero][populate][videoBackground][populate][heroVideo]=true" +
  "&populate[brillianceSection][populate][featureSlide][populate][image][populate][desktopImage]=true" +
  "&populate[brillianceSection][populate][featureSlide][populate][image][populate][mobileImage]=true" +
  "&populate[craftSection][populate][videoUrl][populate][heroVideo]=true" +
  "&populate[craftSection][populate][backgroundImage][populate][desktopImage]=true" +
  "&populate[craftSection][populate][backgroundImage][populate][mobileImage]=true" +
  "&populate[craftMosaicSection][populate][tile][populate][image][populate][desktopImage]=true" +
  "&populate[craftMosaicSection][populate][tile][populate][image][populate][mobileImage]=true" +
  "&populate[legacySection][populate][legacyImageBlock][populate][image][populate][desktopImage]=true" +
  "&populate[legacySection][populate][legacyImageBlock][populate][image][populate][mobileImage]=true";

export const getAboutPage = cache(
  async (signal?: AbortSignal): Promise<NormalizedAboutPage> => {
    try {
      const raw = await apiFetch<StrapiAboutPageEntity>(
        `${STRAPI_ENDPOINTS.aboutPage}?${ABOUT_PAGE_POPULATE_QUERY}`,
        { signal },
      );

      return mapAboutPageData(raw);
    } catch {
      return EMPTY_ABOUT_PAGE;
    }
  },
);

export { EMPTY_ABOUT_PAGE } from "./about-page.types";
export type { NormalizedAboutPage } from "./about-page.types";
