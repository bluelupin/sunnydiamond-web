import type { StrapiImagePayload } from "@/types/strapiMedia";

export type StrapiProductLandingSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  metaKeywords?: string | null;
  structuredData?: unknown;
  showField?: boolean | null;
  ogImage?: StrapiImagePayload | null;
};

export type StrapiProductLandingPage = {
  id?: number;
  documentId?: string;
  seo?: StrapiProductLandingSeo | null;
};

export type NormalizedProductLandingSeo = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalPath: string;
  metaKeywords?: string;
  ogImageUrl?: string;
};

export type NormalizedProductLandingPage = {
  seo: NormalizedProductLandingSeo | null;
};

export const EMPTY_PRODUCT_LANDING_PAGE: NormalizedProductLandingPage = {
  seo: null,
};
