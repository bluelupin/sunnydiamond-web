import type { StrapiMedia } from "./hero";

export type GiftingBanner = {
  id?: number;
  title?: string;
  description?: string;
  subtitle?: string;
  mobileDescription?: string;
  mobileSubtitle?: string;
  isActive?: boolean;
  primaryCta?: { label?: string; url?: string; to?: string };
  secondaryCta?: { label?: string; url?: string; to?: string };
  cta?: { label?: string; url?: string; to?: string };
  secondary?: { label?: string; url?: string; to?: string };
  backgroundImage?: StrapiMedia;
  sideImage?: StrapiMedia;
  image?: StrapiMedia | { desktopImage?: StrapiMedia; mobileImage?: StrapiMedia };
};

export type GiftingBannerData = {
  giftingBanner?: GiftingBanner | null;
};

