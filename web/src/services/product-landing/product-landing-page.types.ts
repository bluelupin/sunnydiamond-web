import type { StrapiImagePayload } from "@/types/strapiMedia";

export type StrapiProductLandingSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  metaKeywords?: string | null;
  structuredData?: unknown;
  showField?: boolean | null;
  ogImage?: StrapiImagePayload | null;
};

export type StrapiProductLandingTrustBadge = {
  id?: number;
  title?: string | null;
  description?: string | null;
  isActive?: boolean | null;
  icon?: StrapiImagePayload | null;
};

export type StrapiProductLandingResponsiveImage = {
  altText?: string | null;
  caption?: string | null;
  desktopImage?: StrapiImagePayload | StrapiImagePayload[] | null;
  mobileImage?: StrapiImagePayload | StrapiImagePayload[] | null;
};

export type StrapiProductLandingHeroVideo = {
  altText?: string | null;
  heroVideo?: StrapiImagePayload | null;
};

export type StrapiProductLandingHero = {
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  image?: StrapiProductLandingResponsiveImage | null;
  heroVideo?: StrapiProductLandingHeroVideo | null;
};

export type StrapiProductLandingPage = {
  id?: number;
  documentId?: string;
  hero?: StrapiProductLandingHero | null;
  seo?: StrapiProductLandingSeo | null;
  trustBadges?: StrapiProductLandingTrustBadge[] | null;
};

export type NormalizedProductLandingSeo = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalPath: string;
  metaKeywords?: string;
  ogImageUrl?: string;
};

export type NormalizedProductLandingTrustBadge = {
  iconSrc: string;
  label: string;
  alt: string;
};

export type NormalizedProductLandingResponsiveImage = {
  desktopUrl: string;
  mobileUrl: string;
  alt: string;
};

export type NormalizedProductLandingHero = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  image: NormalizedProductLandingResponsiveImage | null;
  videoUrl?: string;
};

export type NormalizedProductLandingPage = {
  hero: NormalizedProductLandingHero | null;
  seo: NormalizedProductLandingSeo | null;
  trustBadges: NormalizedProductLandingTrustBadge[];
};

export const EMPTY_PRODUCT_LANDING_PAGE: NormalizedProductLandingPage = {
  hero: null,
  seo: null,
  trustBadges: [],
};
