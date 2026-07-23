import type { StrapiImagePayload } from "@/types/strapiMedia";

export type StrapiSizeGuideRow = {
  id?: number | null;
  circumference?: string | null;
  diameter?: string | null;
  sizeLabel?: string | null;
};

export type StrapiSizeGuide = {
  id?: number | null;
  documentId?: string | null;
  name?: string | null;
  drawerTitle?: string | null;
  drawerSubtitle?: string | null;
  tutorialVideo?: StrapiImagePayload | null;
  circumferenceHeaderImage?: StrapiImagePayload | null;
  diameterHeaderImage?: StrapiImagePayload | null;
  chartRows?: StrapiSizeGuideRow[] | null;
};

export type StrapiSizeGuidesResponse = {
  data?: StrapiSizeGuide[] | null;
};

export type NormalizedSizeGuideRow = {
  circumference: string;
  diameter: string;
  size: string;
};

export type NormalizedSizeGuide = {
  /** Strapi `name` used as category bridge (e.g. rings, bracelet, bangles). */
  name: string;
  /** Canonical app category slug this guide matches (e.g. bracelets). */
  categoryKey: string;
  drawerTitle: string;
  drawerSubtitle: string;
  sizeFieldLabel: string;
  sizeLabels: string[];
  rows: NormalizedSizeGuideRow[];
  tutorialVideoUrl?: string;
  circumferenceHeaderImageUrl?: string;
  diameterHeaderImageUrl?: string;
};
