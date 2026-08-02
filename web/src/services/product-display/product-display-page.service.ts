import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapProductDisplayPage } from "./product-display-page.mapper";
import type {
  NormalizedVisitUsSection,
  StrapiProductDisplayPage,
} from "./product-display-page.types";
import { VISIT_US_FALLBACK } from "./product-display-page.types";

const PRODUCT_DISPLAY_VISIT_US_POPULATE =
  "populate[visitUsSection][populate][image][populate][0]=desktopImage" +
  "&populate[visitUsSection][populate][image][populate][1]=mobileImage" +
  "&populate[visitUsSection][populate][cta]=true" +
  "&populate[visitUsSection][populate][formCta]=true";

export const getProductDisplayVisitUs = cache(
  async (signal?: AbortSignal): Promise<NormalizedVisitUsSection> => {
    try {
      const raw = await apiFetch<StrapiProductDisplayPage>(
        `${STRAPI_ENDPOINTS.productDisplayPage}?${PRODUCT_DISPLAY_VISIT_US_POPULATE}`,
        { signal },
      );
      return mapProductDisplayPage(raw).visitUs;
    } catch {
      return VISIT_US_FALLBACK;
    }
  },
);

export type { NormalizedVisitUsSection };
export { VISIT_US_FALLBACK };
