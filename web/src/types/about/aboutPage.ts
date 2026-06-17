import type { StaticImageData } from "next/image";

export interface AboutMediaAsset {
  desktopSrc: string | StaticImageData;
  mobileSrc?: string | StaticImageData;
  alt: string;
  caption?: string;
}

export interface AboutHeroContent {
  title: string;
  image: AboutMediaAsset;
}

export interface AboutHistoryContent {
  title: string;
  body: string;
  primaryImage: AboutMediaAsset;
  secondaryImage: AboutMediaAsset;
}

export interface AboutTeamMember {
  id: string;
  name: string;
  role: string;
  image: AboutMediaAsset;
}

export interface AboutLeadershipContent {
  title: string;
  description: string;
  members: AboutTeamMember[];
}

export type AboutCraftsmanshipCellType = "image" | "text";

export interface AboutCraftsmanshipCell {
  id: string;
  type: AboutCraftsmanshipCellType;
  title?: string;
  image?: AboutMediaAsset;
  /** Tailwind grid placement classes, e.g. "col-span-2 row-span-2" */
  className?: string;
}

export interface AboutCraftsmanshipContent {
  bannerTitle: string;
  bannerImage: AboutMediaAsset;
  cells: AboutCraftsmanshipCell[];
}

export interface AboutStoreContent {
  title: string;
  description: string;
  image: AboutMediaAsset;
  cta?: {
    label: string;
    url: string;
  };
}

export interface AboutTrustBadge {
  id: string;
  label: string;
  icon: "diamond" | "shield" | "rotate" | "calendar" | "truck";
}

export interface AboutTaglineContent {
  text: string;
}

export interface AboutPageContent {
  hero: AboutHeroContent;
  history: AboutHistoryContent;
  leadership: AboutLeadershipContent;
  craftsmanship: AboutCraftsmanshipContent;
  store: AboutStoreContent;
  trustBadges: AboutTrustBadge[];
  tagline: AboutTaglineContent;
}
