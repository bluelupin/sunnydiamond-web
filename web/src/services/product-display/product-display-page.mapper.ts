import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import {
  VISIT_US_FALLBACK,
  type NormalizedVisitUsSection,
  type StrapiProductDisplayPage,
  type StrapiProductDisplayVisitUsSection,
} from "./product-display-page.types";

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

export function mapVisitUsSection(
  raw?: StrapiProductDisplayVisitUsSection | null,
): NormalizedVisitUsSection {
  if (!raw || raw.showField === false) {
    return VISIT_US_FALLBACK;
  }

  const desktopSrc = resolveCmsMediaUrl(raw.image?.desktopImage);
  const mobileSrc = resolveCmsMediaUrl(raw.image?.mobileImage);
  const imageSrc = desktopSrc ?? mobileSrc ?? VISIT_US_FALLBACK.imageSrc;

  const imageAlt =
    resolveCmsAltText(raw.image?.desktopImage) ??
    resolveCmsAltText(raw.image?.mobileImage) ??
    cleanText(raw.image?.altText) ??
    cleanText(raw.image?.caption);

  const ctaLabel = cleanText(raw.cta?.label) ?? VISIT_US_FALLBACK.ctaLabel;
  const ctaUrl = cleanText(raw.cta?.url);

  return {
    title: cleanText(raw.sectionTitle) ?? VISIT_US_FALLBACK.title,
    description: cleanText(raw.description) ?? VISIT_US_FALLBACK.description,
    imageSrc,
    mobileImageSrc:
      mobileSrc && mobileSrc !== imageSrc ? mobileSrc : undefined,
    imageAlt,
    ctaLabel,
    ctaUrl,
  };
}

export function mapProductDisplayPage(
  raw?: StrapiProductDisplayPage | null,
): { visitUs: NormalizedVisitUsSection } {
  return {
    visitUs: mapVisitUsSection(raw?.visitUsSection),
  };
}
