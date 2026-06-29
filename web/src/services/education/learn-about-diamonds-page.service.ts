import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapLearnAboutDiamondsPage } from "./learn-about-diamonds-page.mapper";
import type {
  NormalizedLearnAboutDiamondsPage,
  StrapiLearnAboutDiamondsPageEntity,
} from "./learn-about-diamonds-page.types";

/** Targeted populate — hero media + FAQ only (avoids full-page payload). */
const HERO_FAQ_POPULATE_QUERY =
  "populate[hero][populate][heroVideo][populate]=heroVideo" +
  "&populate[hero][populate][image][populate][desktopImage]=true" +
  "&populate[hero][populate][image][populate][mobileImage]=true" +
  "&populate[faqSection][populate]=faqItems";

export const getLearnAboutDiamondsPage = cache(
  async (signal?: AbortSignal): Promise<NormalizedLearnAboutDiamondsPage> => {
    const raw = await apiFetch<StrapiLearnAboutDiamondsPageEntity>(
      `${STRAPI_ENDPOINTS.learnAboutDiamondsPage}?${HERO_FAQ_POPULATE_QUERY}`,
      { signal },
    );

    return mapLearnAboutDiamondsPage(raw);
  },
);

export { EMPTY_LEARN_ABOUT_DIAMONDS_PAGE } from "./learn-about-diamonds-page.types";
export type { NormalizedLearnAboutDiamondsPage } from "./learn-about-diamonds-page.types";
