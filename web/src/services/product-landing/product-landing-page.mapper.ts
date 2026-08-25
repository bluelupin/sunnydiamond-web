import { getCmsAssetUrl } from "@/shared/utils/cmsAssets";
import {
  resolveCmsAltText,
  resolveCmsMediaUrl,
} from "@/shared/utils/strapiMedia";
import type {
  NormalizedProductLandingHero,
  NormalizedProductLandingPage,
  NormalizedProductLandingResponsiveImage,
  NormalizedProductLandingSeo,
  NormalizedProductLandingTrustBadge,
  StrapiProductLandingHero,
  StrapiProductLandingPage,
  StrapiProductLandingResponsiveImage,
  StrapiProductLandingSeo,
  StrapiProductLandingTrustBadge,
} from "./product-landing-page.types";
import { EMPTY_PRODUCT_LANDING_PAGE } from "./product-landing-page.types";

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

const resolveSectionActive = (
  isActive?: boolean | null,
  showField?: boolean | null,
): boolean => {
  if (typeof isActive === "boolean") return isActive;
  if (typeof showField === "boolean") return showField;
  return true;
};

const mapResponsiveImage = (
  media?: StrapiProductLandingResponsiveImage | null,
): NormalizedProductLandingResponsiveImage | null => {
  if (!media) return null;

  const desktopUrl =
    resolveCmsMediaUrl(media.desktopImage) ??
    resolveCmsMediaUrl(media.mobileImage);
  const mobileUrl =
    resolveCmsMediaUrl(media.mobileImage) ??
    resolveCmsMediaUrl(media.desktopImage);

  if (!desktopUrl && !mobileUrl) return null;

  const desktopAlt = resolveCmsAltText(media.desktopImage) ?? "";
  const mobileAlt = resolveCmsAltText(media.mobileImage) ?? "";

  return {
    desktopUrl: desktopUrl ?? mobileUrl!,
    mobileUrl: mobileUrl ?? desktopUrl!,
    alt: desktopAlt || mobileAlt,
  };
};

const mapSeo = (seo?: StrapiProductLandingSeo | null): NormalizedProductLandingSeo | null => {
  if (!seo || seo.showField === false) return null;

  const metaTitle = cleanText(seo.metaTitle);
  const metaDescription = cleanText(seo.metaDescription);
  if (!metaTitle && !metaDescription) return null;

  const ogImageUrl = resolveCmsMediaUrl(seo.ogImage);

  return {
    metaTitle,
    metaDescription,
    canonicalPath: cleanText(seo.canonicalUrl) ?? "/jewellery",
    metaKeywords: cleanText(seo.metaKeywords),
    ...(ogImageUrl ? { ogImageUrl } : {}),
  };
};

const mapHero = (hero?: StrapiProductLandingHero | null): NormalizedProductLandingHero | null => {
  if (!hero || !resolveSectionActive(hero.isActive, hero.showField)) return null;

  const title = cleanText(hero.title);
  if (!title) return null;

  const image = mapResponsiveImage(hero.image);
  const videoUrl = getCmsAssetUrl(resolveCmsMediaUrl(hero.heroVideo?.heroVideo));

  return {
    title,
    eyebrow: cleanText(hero.eyebrow),
    subtitle: cleanText(hero.subtitle),
    image,
    videoUrl,
  };
};

const mapTrustBadge = (
  badge?: StrapiProductLandingTrustBadge | null,
): NormalizedProductLandingTrustBadge | null => {
  if (!badge || badge.isActive === false) return null;

  const label = cleanText(badge.title);
  const iconSrc = resolveCmsMediaUrl(badge.icon);
  if (!label || !iconSrc) return null;

  const alt = resolveCmsAltText(badge.icon) ?? label;

  return { iconSrc, label, alt };
};

const mapTrustBadges = (
  badges?: StrapiProductLandingTrustBadge[] | null,
): NormalizedProductLandingTrustBadge[] =>
  (badges ?? [])
    .map((badge) => mapTrustBadge(badge))
    .filter((badge): badge is NormalizedProductLandingTrustBadge => badge != null);

export function mapProductLandingPage(
  raw?: StrapiProductLandingPage | null,
): NormalizedProductLandingPage {
  if (!raw) return EMPTY_PRODUCT_LANDING_PAGE;

  return {
    hero: mapHero(raw.hero),
    seo: mapSeo(raw.seo),
    trustBadges: mapTrustBadges(raw.trustBadges),
  };
}
