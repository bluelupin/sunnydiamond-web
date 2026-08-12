import type { NormalizedCareersPageData } from "@/services/careers/careers.types";
import { CAREERS_ROUTE, CAREERS_ALL_OPENINGS_ROUTE } from "@/features/careers/constants/careersRoutes";

export function resolveCareersSeoMetadata(cms: NormalizedCareersPageData) {
  const landingSeo = cms.landing.seo;
  const listingSeo = cms.listing.seo;
  const seo = landingSeo ?? listingSeo;

  if (!seo) {
    return null;
  }

  const title = landingSeo?.metaTitle?.trim() ?? seo.metaTitle?.trim();
  const description = landingSeo?.metaDescription?.trim() ?? seo.metaDescription?.trim();
  const keywords = landingSeo?.metaKeywords?.trim() ?? seo.metaKeywords?.trim();

  if (!title && !description && !keywords) {
    return null;
  }

  return {
    title: title || undefined,
    description: description || undefined,
    canonicalPath: landingSeo?.canonicalPath ?? seo.canonicalPath ?? CAREERS_ROUTE,
    keywords,
    image: landingSeo?.ogImageUrl ?? seo.ogImageUrl,
  };
}

export function resolveCareersAllOpeningsSeoMetadata(cms: NormalizedCareersPageData) {
  const listingSeo = cms.listing.seo;
  const landingSeo = cms.landing.seo;
  const seo = listingSeo ?? landingSeo;

  if (!seo) {
    return null;
  }

  const title = listingSeo?.metaTitle?.trim() ?? seo.metaTitle?.trim();
  const description = listingSeo?.metaDescription?.trim() ?? seo.metaDescription?.trim();
  const keywords = listingSeo?.metaKeywords?.trim() ?? seo.metaKeywords?.trim();

  if (!title && !description && !keywords) {
    return null;
  }

  return {
    title: title || undefined,
    description: description || undefined,
    canonicalPath: CAREERS_ALL_OPENINGS_ROUTE,
    keywords,
    image: listingSeo?.ogImageUrl ?? seo.ogImageUrl,
  };
}
