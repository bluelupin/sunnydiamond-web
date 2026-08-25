import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapLearnAboutDiamondsPage } from "./learn-about-diamonds-page.mapper";
import type {
  NormalizedLearnAboutDiamondsPage,
  StrapiLearnAboutDiamondsPageEntity,
} from "./learn-about-diamonds-page.types";
import { EMPTY_LEARN_ABOUT_DIAMONDS_PAGE } from "./learn-about-diamonds-page.types";

/** Targeted populate — matches Strapi schema field names. */
const LEARN_ABOUT_DIAMONDS_POPULATE_QUERY =
  "populate[hero][populate][heroVideo][populate]=heroVideo" +
  "&populate[hero][populate][image][populate][desktopImage]=true" +
  "&populate[hero][populate][image][populate][mobileImage]=true" +
  "&populate[faqSection][populate]=faqItems" +
  "&populate[discoverSection][populate][steps]=true" +
  "&populate[discoverSection][populate][backgroundImage][populate][desktopImage]=true" +
  "&populate[discoverSection][populate][backgroundImage][populate][mobileImage]=true" +
  "&populate[fourCsIntro][populate][decorativeImage][populate][desktopImage]=true" +
  "&populate[fourCsIntro][populate][decorativeImage][populate][mobileImage]=true" +
  "&populate[fourCsIntro][populate][fourCsTags]=true" +
  "&populate[fourCsSection][populate][cInfoPanel]=true" +
  "&populate[fourCsSection][populate][cVisualPanel][populate][gradeStops][populate][gradeImage][populate][desktopImage]=true" +
  "&populate[fourCsSection][populate][cVisualPanel][populate][gradeStops][populate][gradeImage][populate][mobileImage]=true" +
  "&populate[fourCsSection][populate][cVisualPanel][populate][visualImage][populate][desktopImage]=true" +
  "&populate[fourCsSection][populate][cVisualPanel][populate][visualImage][populate][mobileImage]=true" +
  "&populate[certificateSection][populate][certificationLabs][populate][labLogo][populate][desktopImage]=true" +
  "&populate[certificateSection][populate][certificationLabs][populate][labLogo][populate][mobileImage]=true" +
  "&populate[certificateSection][populate][bgImage][populate][desktopImage]=true" +
  "&populate[certificateSection][populate][bgImage][populate][mobileImage]=true" +
  "&populate[learnMoreSection][populate][tabs][populate][featureItems]=true" +
  "&populate[learnMoreSection][populate][tabs][populate][featureGroups][populate][featureItems][populate][icon][populate][desktopImage]=true" +
  "&populate[learnMoreSection][populate][tabs][populate][featureGroups][populate][featureItems][populate][icon][populate][mobileImage]=true" +
  "&populate[learnMoreSection][populate][tabs][populate][featureImage][populate][desktopImage]=true" +
  "&populate[learnMoreSection][populate][tabs][populate][featureImage][populate][mobileImage]=true" +
  "&populate[learnMoreSection][populate][tabs][populate][carouselImage][populate][ctaButton]=true" +
  "&populate[learnMoreSection][populate][tabs][populate][carouselImage][populate][image][populate][desktopImage]=true" +
  "&populate[learnMoreSection][populate][tabs][populate][carouselImage][populate][image][populate][mobileImage]=true" +
  "&populate[seo][populate]=ogImage";

export const getLearnAboutDiamondsPage = cache(
  async (signal?: AbortSignal): Promise<NormalizedLearnAboutDiamondsPage> => {
    try {
      const raw = await apiFetch<StrapiLearnAboutDiamondsPageEntity>(
        `${STRAPI_ENDPOINTS.learnAboutDiamondsPage}?${LEARN_ABOUT_DIAMONDS_POPULATE_QUERY}`,
        { signal },
      );

      return mapLearnAboutDiamondsPage(raw);
    } catch {
      return EMPTY_LEARN_ABOUT_DIAMONDS_PAGE;
    }
  },
);

export { EMPTY_LEARN_ABOUT_DIAMONDS_PAGE } from "./learn-about-diamonds-page.types";
export type { NormalizedLearnAboutDiamondsPage } from "./learn-about-diamonds-page.types";
