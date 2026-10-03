import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapCartStripSection, mapProductDisplayPage } from "./product-display-page.mapper";
import type {
  NormalizedProductDisplayPage,
  NormalizedProductDisplayStrip,
  NormalizedVisitUsSection,
  StrapiProductDisplayPage,
} from "./product-display-page.types";
import { EMPTY_PRODUCT_DISPLAY_PAGE } from "./product-display-page.types";

const PRODUCT_DISPLAY_CART_STRIP_POPULATE =
  "populate[stripCartItems][populate][items][populate][icon]=true" +
  "&populate[stripCartItems][populate][tncCta]=true";

const PRODUCT_DISPLAY_PAGE_POPULATE =
  "populate[stripItems][populate][icon]=true" +
  "&populate[stripCartItems][populate][items][populate][icon]=true" +
  "&populate[stripCartItems][populate][tncCta]=true" +
  "&populate[stripTnc]=true" +
  "&populate[findYourSize]=true" +
  "&populate[hereForYouCard][populate]=buttons" +
  "&populate[personaliseCard][populate][0]=image" +
  "&populate[personaliseCard][populate][1]=buttons" +
  "&populate[pairItWith]=true" +
  "&populate[visitUsSection][populate][backgroundImage][populate][desktopImage]=true" +
  "&populate[visitUsSection][populate][backgroundImage][populate][mobileImage]=true";

export const getProductDisplayPage = cache(
  async (signal?: AbortSignal): Promise<NormalizedProductDisplayPage> => {
    try {
      const raw = await apiFetch<StrapiProductDisplayPage>(
        `${STRAPI_ENDPOINTS.productDisplayPage}?${PRODUCT_DISPLAY_PAGE_POPULATE}`,
        { signal },
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

/** Cart benefits strip — refetches with cart-only populate when the shared page payload is empty. */
export const getProductDisplayCartStrip = cache(
  async (signal?: AbortSignal): Promise<NormalizedProductDisplayStrip> => {
    const page = await getProductDisplayPage(signal);
    if (page.cartStrip.items.length > 0) {
      return page.cartStrip;
    }

    try {
      const raw = await apiFetch<StrapiProductDisplayPage>(
        `${STRAPI_ENDPOINTS.productDisplayPage}?${PRODUCT_DISPLAY_CART_STRIP_POPULATE}`,
        { signal },
      );
      const cartStrip = mapCartStripSection(raw);
      return cartStrip.items.length > 0 ? cartStrip : page.cartStrip;
    } catch {
      return page.cartStrip;
    }
  },
);

export type { NormalizedProductDisplayPage, NormalizedProductDisplayStrip, NormalizedVisitUsSection };
export { EMPTY_PRODUCT_DISPLAY_PAGE };
