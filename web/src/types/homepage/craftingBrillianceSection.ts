import type { CategoryNavigationCta, CategoryNavigationImage } from "./categoryNavigation";

export type CraftingBrillianceSectionData = {
  id?: number;
  title?: string;
  isActive?: boolean;
  cta?: CategoryNavigationCta | null;
  backgroundImage?: CategoryNavigationImage & { altText?: string };
  cutoutImage?: CategoryNavigationImage & { altText?: string };
};
