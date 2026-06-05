import type { StrapiImage } from "@/types/strapiMedia";

export type HomepageSeo = {
  id?: number;
  metaTitle?: string;
  metaDescription?: string;
  shareImage?: StrapiImage;
  ogImage?: StrapiImage;
  canonicalURL?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
};

export type HomepageSeoData = {
  seo?: HomepageSeo | null;
};

