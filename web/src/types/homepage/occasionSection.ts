import type { CategoryNavigationCta, CategoryNavigationImage } from "./categoryNavigation";

export type OccasionCard = {
  id?: string | number | null;
  slug?: string | null;
  /** Magento `sd_occasions` label/slug used for PLP `?occasion=` filtering. */
  filterSlug?: string | null;
  title?: string | null;
  description?: string | null;
  subtitle?: string | null;
  isActive?: boolean | null;
  sortOrder?: number | null;
  cta?: CategoryNavigationCta | null;
  image?: CategoryNavigationImage | null;
};

export type OccasionSection = {
  id?: number | null;
  sectionTitle?: string | null;
  isActive?: boolean | null;
  occasions?: OccasionCard[] | null;
};

export type OccasionSectionData = {
  occasionSection?: OccasionSection | null;
};
