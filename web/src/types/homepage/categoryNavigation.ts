import type { StrapiMedia } from "./hero";

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

export type HomepageShoppingBlocksData = {
  homepage?: {
    categoryNavigation?: CategoryNavigationItem[] | null;
  };
  categoryNavigation?: CategoryNavigationItem[] | null;
};
