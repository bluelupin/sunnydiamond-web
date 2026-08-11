/** Raw Strapi media file */
export type StrapiGiftingMediaFile = {
  url?: string | null;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type StrapiGiftingResponsiveImage = {
  altText?: string | null;
  caption?: string | null;
  desktopImage?: StrapiGiftingMediaFile | null;
  mobileImage?: StrapiGiftingMediaFile | null;
};

export type StrapiGiftingCta = {
  id?: number;
  label?: string | null;
  url?: string | null;
  to?: string | null;
  targetType?: string | null;
  openInNewTab?: boolean | null;
};

export type StrapiGiftingHeroSection = {
  id?: number;
  eyebrow?: string | null;
  title?: string | null;
  showField?: boolean | null;
  backgroundImage?: StrapiGiftingResponsiveImage | null;
};

export type StrapiGiftingIntroSection = {
  id?: number;
  title?: string | null;
  description?: string | null;
  showField?: boolean | null;
  backgroundImage?: StrapiGiftingResponsiveImage | null;
};

export type StrapiGiftingOccasion = {
  id?: number | string;
  documentId?: string | null;
  title?: string | null;
  description?: string | null;
  sortOrder?: number | null;
  showField?: boolean | null;
  filterSlug?: string | null;
  cta?: StrapiGiftingCta | null;
  image?: StrapiGiftingResponsiveImage | null;
};

export type StrapiGiftingOccasionGridSection = {
  id?: number;
  showField?: boolean | null;
  occasions?: StrapiGiftingOccasion[] | null;
};

export type StrapiGiftingPerfectGiftSection = {
  id?: number;
  title?: string | null;
  description?: string | null;
  showField?: boolean | null;
};

export type StrapiGiftingGiftFinderSection = {
  id?: number;
  title?: string | null;
  description?: string | null;
  submitLabel?: string | null;
  resultsUrl?: string | null;
  showField?: boolean | null;
  image?: StrapiGiftingResponsiveImage | null;
};

export type StrapiGiftingGiftCardSection = {
  id?: number;
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  showField?: boolean | null;
  cta?: StrapiGiftingCta | null;
  backgroundImage?: StrapiGiftingResponsiveImage | null;
  cutOutImage?: StrapiGiftingResponsiveImage | null;
};

export type StrapiGiftingFinishingService = {
  id?: number;
  title?: string | null;
  description?: string | null;
  sortOrder?: number | null;
  cta?: StrapiGiftingCta | null;
  image?: StrapiGiftingResponsiveImage | null;
};

export type StrapiGiftingFinishingTouchSection = {
  id?: number;
  title?: string | null;
  description?: string | null;
  showField?: boolean | null;
  services?: StrapiGiftingFinishingService[] | null;
};

export type StrapiGiftingTrustBadge = {
  id?: number;
  label?: string | null;
  icon?: StrapiGiftingResponsiveImage | null;
};

export type StrapiGiftingTrustBadgesSection = {
  id?: number;
  trustBadge?: StrapiGiftingTrustBadge[] | null;
};

export type StrapiGiftingSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  metaKeywords?: string | null;
  ogImage?: StrapiGiftingMediaFile | null;
  showField?: boolean | null;
};

export type StrapiGiftingPage = {
  id?: number;
  documentId?: string | null;
  locale?: string | null;
  heroSection?: StrapiGiftingHeroSection | null;
  introSection?: StrapiGiftingIntroSection | null;
  occasionGridSection?: StrapiGiftingOccasionGridSection | null;
  perfectGiftSection?: StrapiGiftingPerfectGiftSection | null;
  giftFinderSection?: StrapiGiftingGiftFinderSection | null;
  giftCardSection?: StrapiGiftingGiftCardSection | null;
  finishingTouchSection?: StrapiGiftingFinishingTouchSection | null;
  trustBadgesSection?: StrapiGiftingTrustBadgesSection | null;
  seo?: StrapiGiftingSeo | null;
};

export type NormalizedGiftingResponsiveImage = {
  desktopUrl: string;
  mobileUrl: string;
  alt: string;
};

export type NormalizedGiftingCta = {
  label: string;
  url: string;
};

export type NormalizedGiftingHero = {
  eyebrow?: string;
  title: string;
  image: NormalizedGiftingResponsiveImage;
};

export type NormalizedGiftingIntro = {
  title: string;
  description?: string;
  background: NormalizedGiftingResponsiveImage | null;
};

export type NormalizedGiftingOccasionCard = {
  id: string;
  title: string;
  description?: string;
  href: string;
  ctaLabel: string;
  image: NormalizedGiftingResponsiveImage;
};

export type NormalizedGiftingOccasionGrid = {
  cards: NormalizedGiftingOccasionCard[];
};

export type NormalizedGiftingPerfectGift = {
  title: string;
  description?: string;
};

export type NormalizedGiftingGiftFinder = {
  title: string;
  description?: string;
  submitLabel?: string;
  image: NormalizedGiftingResponsiveImage | null;
};

export type NormalizedGiftingGiftCard = {
  eyebrow?: string;
  title: string;
  description?: string;
  cta: NormalizedGiftingCta;
  background: NormalizedGiftingResponsiveImage | null;
  image: NormalizedGiftingResponsiveImage | null;
};

export type NormalizedGiftingFinishingItem = {
  id: string;
  title: string;
  description?: string;
  image: NormalizedGiftingResponsiveImage;
};

export type NormalizedGiftingFinishingTouch = {
  title: string;
  description?: string;
  items: NormalizedGiftingFinishingItem[];
};

export type NormalizedGiftingTrustBadge = {
  iconSrc: string;
  label: string;
  alt: string;
};

export type NormalizedGiftingSeo = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalPath?: string;
  metaKeywords?: string;
  ogImageUrl?: string;
};

export type NormalizedGiftingPage = {
  hero: NormalizedGiftingHero | null;
  intro: NormalizedGiftingIntro | null;
  occasionGrid: NormalizedGiftingOccasionGrid | null;
  perfectGift: NormalizedGiftingPerfectGift | null;
  giftFinder: NormalizedGiftingGiftFinder | null;
  giftCard: NormalizedGiftingGiftCard | null;
  finishingTouch: NormalizedGiftingFinishingTouch | null;
  trustBadges: NormalizedGiftingTrustBadge[];
  seo: NormalizedGiftingSeo | null;
};

export const EMPTY_GIFTING_PAGE: NormalizedGiftingPage = {
  hero: null,
  intro: null,
  occasionGrid: null,
  perfectGift: null,
  giftFinder: null,
  giftCard: null,
  finishingTouch: null,
  trustBadges: [],
  seo: null,
};
