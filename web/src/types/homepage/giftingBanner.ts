import type { StrapiMedia } from "./hero";

export type GiftingBanner = {
  id?: number;
  title?: string;
  cta?: { label?: string; to?: string };
  secondary?: { label?: string; to?: string };
  backgroundImage?: StrapiMedia;
  sideImage?: StrapiMedia;
};

export type GiftingBannerData = {
  giftingBanner?: GiftingBanner | null;
};

