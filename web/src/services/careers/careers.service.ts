import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapCareerOpening, mapCareersPageData } from "./careers.mapper";
import type {
  NormalizedCareerJob,
  NormalizedCareersPageData,
  StrapiCareerLandingPageEntity,
  StrapiCareerListingPageEntity,
  StrapiCareerOpeningEntity,
} from "./careers.types";
import { EMPTY_CAREERS_PAGE_DATA } from "./careers.types";

/**
 * Deep populate for nested responsive-image media on the live CMS schema.
 * Do not populate `seo` here — career-landing-page has no top-level seo field (returns 400).
 */
const CAREER_LANDING_POPULATE_QUERY =
  "populate=*" +
  "&populate[heroSection][populate][backgroundImage][populate][desktopImage]=true" +
  "&populate[heroSection][populate][backgroundImage][populate][mobileImage]=true" +
  "&populate[moreThanSection][populate][featuredImage1][populate][desktopImage]=true" +
  "&populate[moreThanSection][populate][featuredImage1][populate][mobileImage]=true" +
  "&populate[moreThanSection][populate][featuredImage2][populate][desktopImage]=true" +
  "&populate[moreThanSection][populate][featuredImage2][populate][mobileImage]=true" +
  "&populate[discoverSection][populate][backgroundImage][populate][desktopImage]=true" +
  "&populate[discoverSection][populate][backgroundImage][populate][mobileImage]=true" +
  "&populate[discoverSection][populate][cta]=true" +
  "&populate[investingSection][populate][InvestingFeatures][populate][featureImage][populate][desktopImage]=true" +
  "&populate[investingSection][populate][InvestingFeatures][populate][featureImage][populate][mobileImage]=true" +
  "&populate[openingsSection][populate][career_openings][populate][applyCta]=true" +
  "&populate[FAQs][populate]=faqItems";

const CAREER_LANDING_FALLBACK_QUERY = "populate=*";

/** `populate=*` only — deep populate on this type returns CMS 500 (incl. when `heroSection` is null). */
const CAREER_LISTING_POPULATE_QUERY = "populate=*";

const CAREER_LISTING_FALLBACK_QUERY = "populate=*";

async function fetchCareerListingPage(
  signal?: AbortSignal,
): Promise<StrapiCareerListingPageEntity> {
  try {
    return await apiFetch<StrapiCareerListingPageEntity>(
      `${STRAPI_ENDPOINTS.careerListingPage}?${CAREER_LISTING_POPULATE_QUERY}`,
      { signal },
    );
  } catch {
    return apiFetch<StrapiCareerListingPageEntity>(
      `${STRAPI_ENDPOINTS.careerListingPage}?${CAREER_LISTING_FALLBACK_QUERY}`,
      { signal },
    );
  }
}

/** Job openings use populate=* — `qualifications` is not a valid populate key on this type yet. */
const CAREER_OPENINGS_POPULATE_QUERY =
  "filters[isActive][$eq]=true" +
  "&sort[0]=sortOrder:asc" +
  "&sort[1]=publishedAt:desc" +
  "&populate=*";

async function fetchCareerLandingPage(signal?: AbortSignal): Promise<StrapiCareerLandingPageEntity> {
  try {
    return await apiFetch<StrapiCareerLandingPageEntity>(
      `${STRAPI_ENDPOINTS.careerLandingPage}?${CAREER_LANDING_POPULATE_QUERY}`,
      { signal },
    );
  } catch {
    return apiFetch<StrapiCareerLandingPageEntity>(
      `${STRAPI_ENDPOINTS.careerLandingPage}?${CAREER_LANDING_FALLBACK_QUERY}`,
      { signal },
    );
  }
}

export const getCareerLandingPageRaw = cache(async (signal?: AbortSignal) => {
  return fetchCareerLandingPage(signal);
});

export const getCareerListingPageRaw = cache(async (signal?: AbortSignal) => {
  return fetchCareerListingPage(signal);
});

export const getCareerOpeningsRaw = cache(async (signal?: AbortSignal) => {
  return apiFetch<StrapiCareerOpeningEntity[]>(
    `${STRAPI_ENDPOINTS.careerOpenings}?${CAREER_OPENINGS_POPULATE_QUERY}`,
    { signal },
  );
});

const CAREER_OPENING_BY_IDENTIFIER_QUERY = (identifier: string) =>
  `filters[$or][0][jobID][$eq]=${encodeURIComponent(identifier)}` +
  `&filters[$or][1][slug][$eq]=${encodeURIComponent(identifier)}` +
  "&filters[isActive][$eq]=true" +
  "&populate=*";

export const getCareerOpeningByJobId = cache(
  async (jobId: string, signal?: AbortSignal): Promise<NormalizedCareerJob | null> => {
    const trimmed = jobId.trim();
    if (!trimmed) return null;

    try {
      const openings = await apiFetch<StrapiCareerOpeningEntity[]>(
        `${STRAPI_ENDPOINTS.careerOpenings}?${CAREER_OPENING_BY_IDENTIFIER_QUERY(trimmed)}`,
        { signal },
      );
      const opening = openings[0];
      if (!opening) return null;
      return mapCareerOpening(opening);
    } catch {
      return null;
    }
  },
);

export const getCareersPageData = cache(
  async (signal?: AbortSignal): Promise<NormalizedCareersPageData> => {
    const [landingResult, listingResult, openingsResult] = await Promise.allSettled([
      getCareerLandingPageRaw(signal),
      getCareerListingPageRaw(signal),
      getCareerOpeningsRaw(signal),
    ]);

    return mapCareersPageData({
      landing: landingResult.status === "fulfilled" ? landingResult.value : null,
      listing: listingResult.status === "fulfilled" ? listingResult.value : null,
      openings: openingsResult.status === "fulfilled" ? openingsResult.value : null,
    });
  },
);

export { EMPTY_CAREERS_PAGE_DATA };
