import type { StrapiMedia } from "./hero";

export type FeaturedProduct = {
  id?: string | number;
  name?: string;
  price?: number | null;
  image?: StrapiMedia;
  category?: { name?: string } | string;
};

export type FeaturedProductsSection = {
  id?: number;
  sectionTitle?: string;
  description?: string;
  isActive?: boolean | null;
  cta?: { label?: string; to?: string; url?: string };
  products?: FeaturedProduct[];
};

export type FeaturedProductsData = {
  featuredProductsSection?: FeaturedProductsSection | null;
};

