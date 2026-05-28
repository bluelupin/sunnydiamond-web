import type { StrapiMedia } from "./hero";

export type SunnyPromiseSection = {
  id?: number;
  title?: string;
  description?: string;
  cta?: { label?: string; to?: string };
  posterImage?: StrapiMedia;
};

export type SunnyPromiseData = {
  sunnyPromiseSection?: SunnyPromiseSection | null;
};

