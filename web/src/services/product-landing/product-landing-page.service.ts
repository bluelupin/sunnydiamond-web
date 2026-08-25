import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapProductLandingPage } from "./product-landing-page.mapper";
import type {
  NormalizedProductLandingPage,
  StrapiProductLandingPage,
} from "./product-landing-page.types";
import { EMPTY_PRODUCT_LANDING_PAGE } from "./product-landing-page.types";

const PRODUCT_LANDING_POPULATE =
  "populate[hero][populate][heroVideo][populate]=heroVideo" +
  "&populate[hero][populate][image][populate][desktopImage]=true" +
  "&populate[hero][populate][image][populate][mobileImage]=true" +
  "&populate[seo][populate]=ogImage" +
  "&populate[trustBadges][populate]=icon";

export const getProductLandingPage = cache(
  async (signal?: AbortSignal): Promise<NormalizedProductLandingPage> => {
    try {
      const raw = await apiFetch<StrapiProductLandingPage>(
        `${STRAPI_ENDPOINTS.productLandingPage}?${PRODUCT_LANDING_POPULATE}`,
        { signal },
      );
      return mapProductLandingPage(raw);
    } catch {
      return EMPTY_PRODUCT_LANDING_PAGE;
    }
  },
);

export { EMPTY_PRODUCT_LANDING_PAGE };
export type { NormalizedProductLandingPage };
