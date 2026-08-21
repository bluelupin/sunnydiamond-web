import type { ProfileSectionId } from "@/features/account/types";

export type StrapiProfileMediaFile = {
  url?: string | null;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type StrapiProfileResponsiveImage = {
  id?: number;
  desktopImage?: StrapiProfileMediaFile | null;
  mobileImage?: StrapiProfileMediaFile | null;
};

export type StrapiProfileSideTab = {
  id?: number;
  tabLabel?: string | null;
  tabValue?: string | null;
};

export type StrapiProfileCta = {
  id?: number;
  label?: string | null;
  url?: string | null;
  targetType?: string | null;
  openInNewTab?: boolean | null;
};

export type StrapiProfileTrustBadge = {
  id?: number;
  title?: string | null;
  description?: string | null;
  callsToAction?: StrapiProfileCta[] | null;
};

export type StrapiProfilePage = {
  id?: number;
  documentId?: string | null;
  sideTabs?: StrapiProfileSideTab[] | null;
  backgroundImage?: StrapiProfileResponsiveImage | null;
  trustBadgeSection?: StrapiProfileTrustBadge[] | null;
};

export type NormalizedProfileBackgroundImage = {
  desktopUrl: string;
  mobileUrl: string;
  alt: string;
};

export type NormalizedProfileSideTab = {
  id: string;
  tabLabel: string;
  tabValue: string;
  sectionId: ProfileSectionId;
};

export type NormalizedProfileCta = {
  id: string;
  label: string;
  href: string;
  openInNewTab: boolean;
};

export type NormalizedProfileTrustBadge = {
  id: string;
  title: string;
  description: string;
  callsToAction: NormalizedProfileCta[];
};

export type NormalizedProfilePage = {
  sideTabs: NormalizedProfileSideTab[];
  backgroundImage: NormalizedProfileBackgroundImage | null;
  trustBadges: NormalizedProfileTrustBadge[];
};

export const EMPTY_PROFILE_PAGE: NormalizedProfilePage = {
  sideTabs: [],
  backgroundImage: null,
  trustBadges: [],
};
