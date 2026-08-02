import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapProductLandingPage } from "./product-landing-page.mapper";
import type {
  NormalizedProductLandingPage,
  StrapiProductLandingPage,
} from "./product-landing-page.types";
import { EMPTY_PRODUCT_LANDING_PAGE } from "./product-landing-page.types";

/** SEO-only populate — keeps PLP page UI unchanged. */
const PRODUCT_LANDING_SEO_POPULATE = "populate[seo][populate]=ogImage";

export const getProductLandingPage = cache(
  async (signal?: AbortSignal): Promise<NormalizedProductLandingPage> => {
    try {
      const raw = await apiFetch<StrapiProductLandingPage>(
        `${STRAPI_ENDPOINTS.productLandingPage}?${PRODUCT_LANDING_SEO_POPULATE}`,
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
