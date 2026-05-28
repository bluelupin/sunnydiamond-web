import type { StrapiMedia } from "./hero";

export type OccasionsTeaserItem = {
  id?: number;
  slug?: string;
  label?: string;
  image?: StrapiMedia;
  isActive?: boolean;
  sortOrder?: number;
};

export type OccasionsTeaser = {
  id?: number;
  title?: string;
  items?: OccasionsTeaserItem[];
};

export type OccasionsTeaserData = {
  occasionsTeaser?: OccasionsTeaser | null;
};

