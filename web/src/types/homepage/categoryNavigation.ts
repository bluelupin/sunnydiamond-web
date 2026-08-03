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
  cutoutImage?: CategoryNavigationImage | StrapiMedia | null;
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
  description?: string | null;
  isActive?: boolean | null;
  slug?: string | null;
  cta?: CategoryNavigationCta | null;
  label?: { label?: string | null } | null;
  /** Legacy CMS product image cards (pre-SKU). */
  products?: FeaturedCollectionImage[] | null;
  /** Magento SKUs from Strapi `productSkus` (CMS order). */
  productSkus?: string[] | null;
  /** Preferred default/active Magento SKU. */
  featuredProductSku?: string | null;
  backgroundImage?: StrapiMedia | null;
  primaryImage?: CategoryNavigationImage | StrapiMedia | null;
  image?: CategoryNavigationImage | StrapiMedia | null;
};

export type GiftingBanner = {
  id?: number | null;
  title?: string | null;
  description?: string | null;
  subtitle?: string | null;
  mobileDescription?: string | null;
  mobileSubtitle?: string | null;
  isActive?: boolean | null;
  primaryCta?: CategoryNavigationCta | null;
  secondaryCta?: CategoryNavigationCta | null;
  cta?: CategoryNavigationCta | null;
  secondary?: CategoryNavigationCta | null;
  backgroundImage?: (CategoryNavigationImage & { altText?: string }) | StrapiMedia | null;
  /** Resolved CMS background video URL (`backgroundVideo.heroVideo`). */
  backgroundVideoUrl?: string | null;
  cutoutImage?: (CategoryNavigationImage & { altText?: string }) | StrapiMedia | null;
  sideImage?: StrapiMedia | null;
  image?: (CategoryNavigationImage & { altText?: string }) | StrapiMedia | null;
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
