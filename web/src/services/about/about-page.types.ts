/** Raw Strapi media file (flat populate response) */
export type StrapiAboutMediaFile = {
  url?: string | null;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
};

/** Responsive image component from Strapi */
export type StrapiAboutResponsiveImage = {
  altText?: string | null;
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

export type StrapiAboutHero = {
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  isActive?: boolean | null;
  image?: StrapiAboutResponsiveImage | null;
};

export type StrapiAboutFeatureSlide = {
  id?: number;
  heading?: string | null;
  body?: string | null;
  description?: string | null;
  image?: StrapiAboutResponsiveImage | null;
};

export type StrapiAboutBrillianceSection = {
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
  teamMember?: StrapiAboutTeamMember[] | null;
};

export type StrapiAboutCraftSection = {
  heading?: string | null;
  subheading?: string | null;
  overlayOpacity?: number | null;
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
  tile?: StrapiAboutCraftMosaicTile[] | null;
};

export type StrapiAboutBrandTaglineSection = {
  tagline?: string | null;
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
  title?: string | null;
  heading?: string | null;
  body?: string | null;
  description?: string | null;
  content?: string | null;
  sortOrder?: number | null;
};

export type StrapiAboutTimelineSection = {
  heading?: string | null;
  backgroundImage?: StrapiAboutResponsiveImage | null;
  timelineMilestone?: StrapiAboutTimelineMilestone[] | null;
  milestones?: StrapiAboutTimelineMilestone[] | null;
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
  image: NormalizedResponsiveImage;
};

export type NormalizedBrillianceSection = {
  heading: string;
  description: string;
  image: NormalizedResponsiveImage;
};

export type NormalizedLegacyGalleryItem = {
  description?: string;
  caption?: string;
  image: NormalizedResponsiveImage;
};

export type NormalizedAboutLegacy = {
  title: string;
  story?: string;
  gallery: NormalizedLegacyGalleryItem[];
};

export type NormalizedTeamMember = {
  name: string;
  role: string;
  image: NormalizedResponsiveImage;
};

export type NormalizedAboutTeam = {
  title: string;
  description?: string;
  members: NormalizedTeamMember[];
};

export type NormalizedCraftCard = {
  title: string;
  position: { left: string; top: string };
  gap: number;
  layoutIndex: number;
};

export type NormalizedAboutCraft = {
  title: string;
  videoUrl?: string;
  posterUrl?: string;
  overlayOpacity: number;
  centerImage?: NormalizedResponsiveImage;
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
  backgroundImage: NormalizedResponsiveImage;
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
