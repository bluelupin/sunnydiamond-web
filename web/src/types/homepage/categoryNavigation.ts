import type { StrapiMedia } from "./hero";

export type CategoryNavigationItem = {
  id?: number;
  title?: string;
  label?: string;
  slug?: string;
  sortOrder?: number;
  isActive?: boolean;
  product?: StrapiMedia;
  model?: StrapiMedia;
};

export type CategoryNavigationSectionData = {
  craftingRarity?: {
    subtitle?: string;
    cta?: { label?: string; to?: string };
  };
  categoryNavigation?: CategoryNavigationItem[];
};

