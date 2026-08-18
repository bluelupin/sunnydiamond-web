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
  backgroundColor?: string | null;
  backgroundImage?: StrapiMedia | { desktopImage?: StrapiMedia; mobileImage?: StrapiMedia; altText?: string };
  backgroundVideoUrl?: string;
  cutoutImage?: StrapiMedia | { desktopImage?: StrapiMedia; mobileImage?: StrapiMedia; altText?: string };
  sideImage?: StrapiMedia;
  image?: StrapiMedia | { desktopImage?: StrapiMedia; mobileImage?: StrapiMedia; altText?: string };
};

export type GiftingBannerData = {
  giftingBanner?: GiftingBanner | null;
};

