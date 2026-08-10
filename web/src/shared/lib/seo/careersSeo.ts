import type { NormalizedCareersPageData } from "@/services/careers/careers.types";
import { CAREERS_ROUTE, CAREERS_ALL_OPENINGS_ROUTE } from "@/features/careers/constants/careersRoutes";

export function resolveCareersSeoMetadata(cms: NormalizedCareersPageData) {
  const landingSeo = cms.landing.seo;
  const listingSeo = cms.listing.seo;
  const seo = landingSeo ?? listingSeo;

  if (!seo) {
    return null;
  }

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    canonicalPath: seo.canonicalPath || CAREERS_ROUTE,
    keywords: seo.metaKeywords,
    image: seo.ogImageUrl,
  };
}

export function resolveCareersAllOpeningsSeoMetadata(cms: NormalizedCareersPageData) {
  const listingSeo = cms.listing.seo;
  const landingSeo = cms.landing.seo;
  const seo = listingSeo ?? landingSeo;

  if (!seo) {
    return null;
  }

  const title = listingSeo?.metaTitle ?? seo.metaTitle;
  const description = listingSeo?.metaDescription ?? seo.metaDescription;

  return {
    title,
    description,
    canonicalPath: CAREERS_ALL_OPENINGS_ROUTE,
    keywords: seo.metaKeywords,
    image: seo.ogImageUrl,
  };
}
