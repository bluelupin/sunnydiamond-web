import { buildOccasionCardHref } from "@/features/jewellery-product/utils/occasionListing";
import {
  extractStrapiImage,
  resolveCmsAltText,
  resolveCmsMediaUrl,
} from "@/shared/utils/strapiMedia";
import {
  EMPTY_GIFTING_PAGE,
  type NormalizedGiftingCta,
  type NormalizedGiftingFinishingTouch,
  type NormalizedGiftingGiftCard,
  type NormalizedGiftingGiftFinder,
  type NormalizedGiftingHero,
  type NormalizedGiftingIntro,
  type NormalizedGiftingOccasionCard,
  type NormalizedGiftingOccasionGrid,
  type NormalizedGiftingPage,
  type NormalizedGiftingPerfectGift,
  type NormalizedGiftingResponsiveImage,
  type NormalizedGiftingSeo,
  type NormalizedGiftingTrustBadge,
  type StrapiGiftingCta,
  type StrapiGiftingFinishingTouchSection,
  type StrapiGiftingGiftCardSection,
  type StrapiGiftingGiftFinderSection,
  type StrapiGiftingHeroSection,
  type StrapiGiftingIntroSection,
  type StrapiGiftingOccasionGridSection,
  type StrapiGiftingPage,
  type StrapiGiftingPerfectGiftSection,
  type StrapiGiftingResponsiveImage,
  type StrapiGiftingSeo,
  type StrapiGiftingTrustBadgesSection,
} from "./gifting-page.types";

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

/** CMS sections may use `isActive` or `showField`; default visible when unset. */
const resolveSectionActive = (
  isActive?: boolean | null,
  showField?: boolean | null,
): boolean => {
  if (typeof isActive === "boolean") return isActive;
  if (typeof showField === "boolean") return showField;
  return true;
};

const mapResponsiveImage = (
  image?: StrapiGiftingResponsiveImage | null,
): NormalizedGiftingResponsiveImage | null => {
  const desktopFile = extractStrapiImage(image?.desktopImage);
  const mobileFile = extractStrapiImage(image?.mobileImage);
  const desktopUrl =
    resolveCmsMediaUrl(image?.desktopImage) ?? resolveCmsMediaUrl(image?.mobileImage);
  const mobileUrl =
    resolveCmsMediaUrl(image?.mobileImage) ?? resolveCmsMediaUrl(image?.desktopImage);
  if (!desktopUrl && !mobileUrl) return null;

  return {
    desktopUrl: desktopUrl ?? mobileUrl!,
    mobileUrl: mobileUrl ?? desktopUrl!,
    alt:
      cleanText(image?.altText) ??
      resolveCmsAltText(image?.desktopImage) ??
      resolveCmsAltText(image?.mobileImage) ??
      "",
    width: desktopFile?.width ?? mobileFile?.width ?? undefined,
    height: desktopFile?.height ?? mobileFile?.height ?? undefined,
  };
};

const mapCta = (cta?: StrapiGiftingCta | null): NormalizedGiftingCta | null => {
  const label = cleanText(cta?.label);
  const url = cleanText(cta?.url) ?? cleanText(cta?.to);
  if (!label || !url) return null;
  return { label, url };
};

const mapSeo = (seo?: StrapiGiftingSeo | null): NormalizedGiftingSeo | null => {
  if (!seo || seo.showField === false) return null;

  const metaTitle = cleanText(seo.metaTitle);
  const metaDescription = cleanText(seo.metaDescription);
  if (!metaTitle && !metaDescription) return null;

  const ogImageUrl = resolveCmsMediaUrl(seo.ogImage);
  const canonical = cleanText(seo.canonicalUrl);

  return {
    metaTitle,
    metaDescription,
    canonicalPath: canonical
      ? canonical.startsWith("/")
        ? canonical
        : `/${canonical}`
      : "/gifting",
    metaKeywords: cleanText(seo.metaKeywords),
    ...(ogImageUrl ? { ogImageUrl } : {}),
  };
};

const mapHero = (hero?: StrapiGiftingHeroSection | null): NormalizedGiftingHero | null => {
  if (!hero || !resolveSectionActive(hero.isActive, hero.showField)) return null;

  const title = cleanText(hero.title);
  if (!title) return null;

  return {
    title,
    image: mapResponsiveImage(hero.backgroundImage),
  };
};

const mapIntro = (
  section?: StrapiGiftingIntroSection | null,
): NormalizedGiftingIntro | null => {
  if (!section || !resolveSectionActive(section.isActive, section.showField)) return null;

  const title = cleanText(section.title);
  if (!title) return null;

  const description = cleanText(section.description);

  return {
    title,
    ...(description ? { description } : {}),
    background: mapResponsiveImage(section.backgroundImage),
  };
};

const mapOccasionGrid = (
  section?: StrapiGiftingOccasionGridSection | null,
): NormalizedGiftingOccasionGrid | null => {
  if (!section || !resolveSectionActive(undefined, section.showField)) return null;

  const cards = (section.occasions ?? [])
    .filter((occasion) => resolveSectionActive(undefined, occasion?.showField))
    .map((occasion, index): NormalizedGiftingOccasionCard | null => {
      const title = cleanText(occasion?.title);
      const image = mapResponsiveImage(occasion?.image);
      if (!title || !image) return null;

      const filterSlug = cleanText(occasion?.filterSlug);
      const cta = mapCta(occasion?.cta);
      // Same resolution as homepage OccasionsTeaserSection:
      // prefer real CMS deep links; for generic `/products` use filterSlug → /jewellery?occasion=
      const href = buildOccasionCardHref({
        title,
        slug: filterSlug,
        filterSlug,
        ctaUrl: cta?.url ?? cleanText(occasion?.cta?.url) ?? cleanText(occasion?.cta?.to),
      });

      return {
        id:
          occasion?.documentId?.trim() ||
          (occasion?.id != null ? String(occasion.id) : `occasion-${index + 1}`),
        title,
        description: cleanText(occasion?.description),
        href,
        ctaLabel: cta?.label ?? "View Collection",
        image,
      };
    })
    .filter((card): card is NormalizedGiftingOccasionCard => card != null);

  if (cards.length === 0) return null;
  return { cards };
};

const mapPerfectGift = (
  section?: StrapiGiftingPerfectGiftSection | null,
): NormalizedGiftingPerfectGift | null => {
  if (!section || !resolveSectionActive(undefined, section.showField)) return null;

  const title = cleanText(section.title);
  if (!title) return null;

  return {
    title,
    description: cleanText(section.description),
  };
};

const mapGiftFinder = (
  section?: StrapiGiftingGiftFinderSection | null,
): NormalizedGiftingGiftFinder | null => {
  if (!section || !resolveSectionActive(section.isActive, section.showField)) return null;

  const title = cleanText(section.title);
  if (!title) return null;

  const submitLabel = cleanText(section.submitLabel);

  return {
    title,
    description: cleanText(section.description),
    ...(submitLabel ? { submitLabel } : {}),
    image: mapResponsiveImage(section.image),
  };
};

const mapGiftCard = (
  section?: StrapiGiftingGiftCardSection | null,
): NormalizedGiftingGiftCard | null => {
  if (!section || !resolveSectionActive(section.isActive, section.showField)) return null;

  const title = cleanText(section.title);
  if (!title) return null;

  const buttonLabel = cleanText(section.buttonLabel);

  return {
    title,
    description: cleanText(section.description),
    ...(buttonLabel ? { buttonLabel } : {}),
    background: mapResponsiveImage(section.backgroundImage),
    image: mapResponsiveImage(section.cutOutImage),
  };
};

const mapFinishingTouch = (
  section?: StrapiGiftingFinishingTouchSection | null,
): NormalizedGiftingFinishingTouch | null => {
  if (!section || !resolveSectionActive(section.isActive, section.showField)) return null;

  const title = cleanText(section.title);
  if (!title) return null;

  const items = [...(section.services ?? [])]
    .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
    .map((service, index) => {
      const serviceTitle = cleanText(service?.title);
      const image = mapResponsiveImage(service?.image);
      if (!serviceTitle || !image) return null;

      const description = cleanText(service?.description);

      return {
        id: service?.id != null ? String(service.id) : `finishing-${index + 1}`,
        title: serviceTitle,
        ...(description ? { description } : {}),
        image,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item != null);

  if (items.length === 0) return null;

  const description = cleanText(section.description);

  return {
    title,
    ...(description ? { description } : {}),
    items,
  };
};

const isTrustBadgesSectionActive = (section?: StrapiGiftingTrustBadgesSection | null): boolean =>
  section?.isActive === true;

const mapTrustBadges = (
  section?: StrapiGiftingTrustBadgesSection | null,
): NormalizedGiftingTrustBadge[] => {
  if (!isTrustBadgesSectionActive(section)) return [];

  return (section?.trustBadge ?? [])
    .filter((badge) => badge?.isActive !== false)
    .map((badge) => {
      const label = cleanText(badge?.label);
      const icon = mapResponsiveImage(badge?.icon);
      if (!label || !icon) return null;

      return {
        label,
        icon: {
          desktopUrl: icon.desktopUrl,
          mobileUrl: icon.mobileUrl,
          alt: cleanText(badge?.iconAltText) ?? icon.alt,
        },
      };
    })
    .filter((badge): badge is NormalizedGiftingTrustBadge => badge != null);
};

export function mapGiftingPage(
  raw?: StrapiGiftingPage | null,
): NormalizedGiftingPage {
  if (!raw) return EMPTY_GIFTING_PAGE;

  return {
    hero: mapHero(raw.heroSection),
    intro: mapIntro(raw.introSection),
    occasionGrid: mapOccasionGrid(raw.occasionGridSection),
    perfectGift: mapPerfectGift(raw.perfectGiftSection),
    giftFinder: mapGiftFinder(raw.giftFinderSection),
    giftCard: mapGiftCard(raw.giftCardSection),
    finishingTouch: mapFinishingTouch(raw.finishingTouchSection),
    trustBadges: mapTrustBadges(raw.trustBadgesSection),
    seo: mapSeo(raw.seo),
  };
}
