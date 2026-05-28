import type { StrapiMedia } from "./hero";

export type ShowroomLocation = {
  id?: string;
  name?: string;
  address?: string;
  phone?: string;
  directionsUrl?: string;
  image?: StrapiMedia;
  sortOrder?: number;
  isActive?: boolean;
};

export type ShowroomTeaser = {
  id?: number;
  title?: string;
  subtitle?: string;
  locations?: ShowroomLocation[];
};

export type ShowroomTeaserData = {
  showroomTeaser?: ShowroomTeaser | null;
};

