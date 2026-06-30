import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapLearnAboutDiamondsPage } from "./learn-about-diamonds-page.mapper";
import type {
  NormalizedLearnAboutDiamondsPage,
  StrapiLearnAboutDiamondsPageEntity,
} from "./learn-about-diamonds-page.types";

/** Targeted populate — wired sections only (avoids full-page payload). */
const LEARN_ABOUT_DIAMONDS_POPULATE_QUERY =
  "populate[hero][populate][heroVideo][populate]=heroVideo" +
  "&populate[hero][populate][image][populate][desktopImage]=true" +
  "&populate[hero][populate][image][populate][mobileImage]=true" +
  "&populate[faqSection][populate]=faqItems" +
  "&populate[ctaBanner][populate][backgroundImage][populate][desktopImage]=true" +
  "&populate[ctaBanner][populate][backgroundImage][populate][mobileImage]=true" +
  "&populate[fourCsIntro][populate][image][populate][desktopImage]=true" +
  "&populate[fourCsIntro][populate][image][populate][mobileImage]=true" +
  "&populate[fourCsSection][populate][cInfoPanel]=true" +
  "&populate[fourCsSection][populate][cVisualPanel][populate][gradeStops]=true" +
  "&populate[fourCsSection][populate][cVisualPanel][populate][visualImage][populate][desktopImage]=true" +
  "&populate[fourCsSection][populate][cVisualPanel][populate][visualImage][populate][mobileImage]=true" +
  "&populate[certificateSection][populate][certificationLabs][populate][labLogo][populate][desktopImage]=true" +
  "&populate[certificateSection][populate][certificationLabs][populate][labLogo][populate][mobileImage]=true";

export const getLearnAboutDiamondsPage = cache(
  async (signal?: AbortSignal): Promise<NormalizedLearnAboutDiamondsPage> => {
    const raw = await apiFetch<StrapiLearnAboutDiamondsPageEntity>(
      `${STRAPI_ENDPOINTS.learnAboutDiamondsPage}?${LEARN_ABOUT_DIAMONDS_POPULATE_QUERY}`,
      { signal },
    );

    return mapLearnAboutDiamondsPage(raw);
  },
);

export { EMPTY_LEARN_ABOUT_DIAMONDS_PAGE } from "./learn-about-diamonds-page.types";
export type { NormalizedLearnAboutDiamondsPage } from "./learn-about-diamonds-page.types";
