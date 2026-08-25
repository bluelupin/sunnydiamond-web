/** Raw Strapi media file (flat populate response) */
export type StrapiAboutMediaFile = {
  url?: string | null;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
};

/** Responsive image component from Strapi */
export type StrapiAboutResponsiveImage = {
  caption?: string | null;
  desktopImage?: StrapiAboutMediaFile | null;
  mobileImage?: StrapiAboutMediaFile | null;
};

export type StrapiAboutSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  metaKeywords?: string | null;
  structuredData?: unknown;
};

export type StrapiAboutHeroVideoBlock = {
  id?: number;
  heroVideo?: StrapiAboutMediaFile | null;
};

export type StrapiAboutHero = {
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  isActive?: boolean | null;
  image?: StrapiAboutResponsiveImage | null;
  heroVideo?: StrapiAboutHeroVideoBlock | null;
  /** Shared hero component field name (homepage-aligned). */
  videoBackground?: StrapiAboutHeroVideoBlock | null;
};

export type StrapiAboutFeatureSlide = {
  id?: number;
  heading?: string | null;
  body?: string | null;
  image?: StrapiAboutResponsiveImage | null;
};

export type StrapiAboutBrillianceSection = {
  isActive?: boolean | null;
  pinnedImage?: StrapiAboutResponsiveImage | null;
  featureSlide?: StrapiAboutFeatureSlide[] | null;
  /** @deprecated legacy flat fields */
  heading?: string | null;
  description?: string | null;
  image?: StrapiAboutResponsiveImage | null;
};

export type StrapiAboutLegacyImageBlock = {
  id?: number;
  description?: string | null;
  image?: StrapiAboutResponsiveImage | null;
};

export type StrapiAboutLegacySection = {
  heading?: string | null;
  isActive?: boolean | null;
  legacyImageBlock?: StrapiAboutLegacyImageBlock[] | null;
};

export type StrapiAboutTeamMember = {
  id?: number;
  name?: string | null;
  role?: string | null;
  bio?: string | null;
  image?: StrapiAboutResponsiveImage | null;
};

export type StrapiAboutTeamSection = {
  heading?: string | null;
  subheading?: string | null;
  displayStyle?: string | null;
  isActive?: boolean | null;
  teamMember?: StrapiAboutTeamMember[] | null;
};

export type StrapiAboutCraftSection = {
  heading?: string | null;
  subheading?: string | null;
  overlayOpacity?: number | null;
  isActive?: boolean | null;
  backgroundImage?: StrapiAboutResponsiveImage | null;
  videoUrl?: {
    heroVideo?: StrapiAboutMediaFile | null;
  } | null;
};

export type StrapiAboutCraftMosaicTile = {
  id?: number;
  type?: string | null;
  title?: string | null;
  image?: StrapiAboutResponsiveImage | null;
};

export type StrapiAboutCraftMosaicSection = {
  isActive?: boolean | null;
  tile?: StrapiAboutCraftMosaicTile[] | null;
};

export type StrapiAboutBrandTaglineSection = {
  tagline?: string | null;
  isActive?: boolean | null;
  icon?: StrapiAboutResponsiveImage | null;
};

export type StrapiAboutTrustBadge = {
  id?: number;
  label?: string | null;
  icon?: StrapiAboutResponsiveImage | null;
};

export type StrapiAboutTrustBadgesSection = {
  trustBadge?: StrapiAboutTrustBadge[] | null;
};

export type StrapiAboutTimelineMilestone = {
  id?: number;
  year?: string | number | null;
  heading?: string | null;
  body?: string | null;
};

export type StrapiAboutTimelineSection = {
  heading?: string | null;
  isActive?: boolean | null;
  backgroundImage?: StrapiAboutResponsiveImage | null;
  timelineMilestone?: StrapiAboutTimelineMilestone[] | null;
};

/** Entity returned by apiFetch after normalizeResponse */
export type StrapiAboutPageEntity = {
  id?: number;
  documentId?: string;
  seo?: StrapiAboutSeo | null;
  hero?: StrapiAboutHero | null;
  brillianceSection?: StrapiAboutBrillianceSection | null;
  legacySection?: StrapiAboutLegacySection | null;
  teamSection?: StrapiAboutTeamSection | null;
  craftSection?: StrapiAboutCraftSection | null;
  craftMosaicSection?: StrapiAboutCraftMosaicSection | null;
  brandTaglineSection?: StrapiAboutBrandTaglineSection | null;
  trustBadgesSection?: StrapiAboutTrustBadgesSection | null;
  timelineSection?: StrapiAboutTimelineSection | null;
};

export type NormalizedResponsiveImage = {
  desktopUrl: string;
  mobileUrl: string;
  alt: string;
  width?: number;
  height?: number;
};

export type NormalizedAboutSeo = {
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
  metaKeywords?: string;
};

export type NormalizedAboutHero = {
  title: string;
  image: NormalizedResponsiveImage | null;
  videoUrl?: string;
};

export type NormalizedBrillianceSection = {
  heading: string;
  body: string;
  image: NormalizedResponsiveImage | null;
};

export type NormalizedLegacyGalleryItem = {
  description?: string;
  caption?: string;
  image?: NormalizedResponsiveImage | null;
};

export type NormalizedAboutLegacy = {
  title: string;
  story?: string;
  gallery: NormalizedLegacyGalleryItem[];
};

export type NormalizedTeamMember = {
  name: string;
  role: string;
  image?: NormalizedResponsiveImage | null;
};

export type NormalizedAboutTeam = {
  title: string;
  description?: string;
  members: NormalizedTeamMember[];
};

export type NormalizedCraftCard = {
  type: "textCard" | "image";
  title?: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  imageAlt?: string;
  position?: { left: string; top: string };
  gap: number;
  layoutIndex: number;
  tileIndex: number;
};

export type NormalizedAboutCraft = {
  title: string;
  image: NormalizedResponsiveImage | null;
  videoUrl?: string;
  overlayOpacity: number;
  cards: NormalizedCraftCard[];
};

export type NormalizedBrandTagline = {
  quote: string;
  iconUrl?: string;
};

export type NormalizedTrustBadge = {
  label: string;
  icon: NormalizedResponsiveImage;
};

export type NormalizedTimelineMilestone = {
  year: string;
  title: string;
  description: string;
};

export type NormalizedAboutTimeline = {
  backgroundImage?: NormalizedResponsiveImage | null;
  milestones: NormalizedTimelineMilestone[];
  years: string[];
  defaultYear: string;
};

export type NormalizedAboutPage = {
  seo: NormalizedAboutSeo | null;
  hero: NormalizedAboutHero | null;
  brillianceSection: NormalizedBrillianceSection | null;
  legacy: NormalizedAboutLegacy | null;
  team: NormalizedAboutTeam | null;
  craft: NormalizedAboutCraft | null;
  brandTagline: NormalizedBrandTagline | null;
  trustBadges: NormalizedTrustBadge[] | null;
  timeline: NormalizedAboutTimeline | null;
};

export const EMPTY_ABOUT_PAGE: NormalizedAboutPage = {
  seo: null,
  hero: null,
  brillianceSection: null,
  legacy: null,
  team: null,
  craft: null,
  brandTagline: null,
  trustBadges: null,
  timeline: null,
};
