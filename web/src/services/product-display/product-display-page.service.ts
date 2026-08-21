import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapProductDisplayPage } from "./product-display-page.mapper";
import type {
  NormalizedProductDisplayPage,
  NormalizedVisitUsSection,
  StrapiProductDisplayPage,
} from "./product-display-page.types";
import { EMPTY_PRODUCT_DISPLAY_PAGE } from "./product-display-page.types";

const PRODUCT_DISPLAY_PAGE_POPULATE =
  "populate[stripItems][populate]=icon" +
  "&populate[stripTnc]=true" +
  "&populate[findYourSize]=true" +
  "&populate[hereForYouCard][populate]=buttons" +
  "&populate[personaliseCard][populate][0]=image" +
  "&populate[personaliseCard][populate][1]=buttons" +
  "&populate[pairItWith]=true" +
  "&populate[visitUsSection][populate][showrooms][populate][image][populate][desktopImage]=true" +
  "&populate[visitUsSection][populate][showrooms][populate][image][populate][mobileImage]=true" +
  "&populate[visitUsSection][populate][cta]=true";

export const getProductDisplayPage = cache(
  async (signal?: AbortSignal): Promise<NormalizedProductDisplayPage> => {
    try {
      const raw = await apiFetch<StrapiProductDisplayPage>(
        `${STRAPI_ENDPOINTS.productDisplayPage}?${PRODUCT_DISPLAY_PAGE_POPULATE}`,
        {
          signal,
          // TEMP (Strapi QA): bypass fetch cache — remove after testing
          cache: "no-store",
        },
      );
      return mapProductDisplayPage(raw);
    } catch {
      return EMPTY_PRODUCT_DISPLAY_PAGE;
    }
  },
);

export const getProductDisplayVisitUs = cache(
  async (signal?: AbortSignal): Promise<NormalizedVisitUsSection> => {
    const page = await getProductDisplayPage(signal);
    return page.visitUs;
  },
);

export type { NormalizedProductDisplayPage, NormalizedVisitUsSection };
export { EMPTY_PRODUCT_DISPLAY_PAGE };
