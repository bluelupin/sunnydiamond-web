import type { StrapiMedia } from "./hero";
import type { TrustBadge } from "./trustBadges";
import type { FeaturedProductsSection } from "./featuredProducts";

export type CategoryNavigationImage = {
  desktopImage?: StrapiMedia | null;
  mobileImage?: StrapiMedia | null;
};

export type CategoryNavigationCta = {
  label?: string;
  url?: string;
  to?: string;
};

export type CategoryNavigationItem = {
  id?: string | number | null;
  title?: string | null;
  label?: string | null;
  slug?: string | null;
  isActive?: boolean | null;
  sortOrder?: number | null;
  image?: CategoryNavigationImage | StrapiMedia | null;
  hoverImage?: CategoryNavigationImage | StrapiMedia | null;
  cta?: CategoryNavigationCta | null;
  model?: unknown;
  product?: unknown;
};

export type FeaturedCollectionImage = {
  id?: string | number | null;
  name?: string | null;
  price?: number | null;
  image?: StrapiMedia | null;
};

export type FeaturedCollectionSection = {
  id?: number | null;
  sectionTitle?: string | null;
  cta?: CategoryNavigationCta | null;
  label?: { label?: string | null } | null;
  products?: FeaturedCollectionImage[] | null;
  backgroundImage?: StrapiMedia | null;
};

export type GiftingBanner = {
  id?: number | null;
  title?: string | null;
  primaryCta?: CategoryNavigationCta | null;
  secondaryCta?: CategoryNavigationCta | null;
  cta?: CategoryNavigationCta | null;
  secondary?: CategoryNavigationCta | null;
  backgroundImage?: StrapiMedia | null;
  sideImage?: StrapiMedia | null;
};

export type HomepageShoppingBlocksData = {
  homepage?: {
    categoryNavigation?: CategoryNavigationItem[] | null;
    trustBadges?: TrustBadge[] | null;
    featuredCollectionSection?: FeaturedCollectionSection | null;
    featuredProductsSection?: FeaturedProductsSection | null;
    giftingBanner?: GiftingBanner | null;
  };
  categoryNavigation?: CategoryNavigationItem[] | null;
  trustBadges?: TrustBadge[] | null;
  featuredCollectionSection?: FeaturedCollectionSection | null;
  featuredProductsSection?: FeaturedProductsSection | null;
  giftingBanner?: GiftingBanner | null;
};
