import type { StrapiMedia } from "./hero";

export type BespokeForYouSectionCta = {
  label?: string;
  url?: string;
  to?: string;
  targetType?: string;
  openInNewTab?: boolean;
};

export type BespokeForYouSectionData = {
  id?: number;
  sectionTitle?: string;
  subtitle?: string;
  description?: string;
  image?: StrapiMedia & {
    desktopImage?: StrapiMedia;
    mobileImage?: StrapiMedia;
    altText?: string;
  };
  primaryCta?: BespokeForYouSectionCta;
  secondaryCta?: BespokeForYouSectionCta;
  isActive?: boolean;
};

export type BespokeForYouSectionResponse = {
  bespokeForYouSection?: BespokeForYouSectionData | null;
};
