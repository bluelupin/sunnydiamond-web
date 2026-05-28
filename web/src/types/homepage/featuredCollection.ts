import type { StrapiMedia } from "./hero";

export type FeaturedCollectionSection = {
  id?: number;
  sectionTitle?: string;
  cta?: { label?: string; to?: string };
  backgroundImage?: StrapiMedia;
  products?: Array<{
    id?: string | number;
    name?: string;
    price?: number | null;
    image?: StrapiMedia;
  }>;
};

export type FeaturedCollectionData = {
  featuredCollectionSection?: FeaturedCollectionSection | null;
};

