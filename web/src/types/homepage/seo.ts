import type { StrapiMedia } from "./hero";

export type HomepageSeo = {
  id?: number;
  metaTitle?: string;
  metaDescription?: string;
  shareImage?: StrapiMedia;
  canonicalURL?: string;
  noIndex?: boolean;
};

export type HomepageSeoData = {
  seo?: HomepageSeo | null;
};

