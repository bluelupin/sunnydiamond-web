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
  cta?: { label?: string; to?: string };
  products?: FeaturedProduct[];
};

export type FeaturedProductsData = {
  featuredProductsSection?: FeaturedProductsSection | null;
};

