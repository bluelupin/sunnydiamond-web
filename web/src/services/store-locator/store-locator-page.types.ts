/** Raw Strapi media file */
export type StrapiStoreLocatorMediaFile = {
  url?: string | null;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type StrapiStoreLocatorResponsiveImage = {
  altText?: string | null;
  desktopImage?: StrapiStoreLocatorMediaFile | null;
  mobileImage?: StrapiStoreLocatorMediaFile | null;
};

export type StrapiStoreLocatorCta = {
  id?: number;
  label?: string | null;
  url?: string | null;
  to?: string | null;
  targetType?: string | null;
  openInNewTab?: boolean | null;
};

export type StrapiStoreLocatorHeroVideo = {
  id?: number;
  altText?: string | null;
  heroVideo?: StrapiStoreLocatorMediaFile | null;
};

export type StrapiStoreLocatorHero = {
  id?: number;
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  image?: StrapiStoreLocatorResponsiveImage | null;
  backgroundImage?: StrapiStoreLocatorResponsiveImage | null;
  video?: StrapiStoreLocatorHeroVideo | null;
  backgroundVideo?: StrapiStoreLocatorHeroVideo | null;
  primaryCta?: StrapiStoreLocatorCta | null;
  secondaryCta?: StrapiStoreLocatorCta | null;
  cta?: StrapiStoreLocatorCta | null;
};

export type StrapiStoreLocatorLocationFilter = {
  id?: number | string;
  label?: string | null;
  value?: string | null;
  slug?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  icon?: StrapiStoreLocatorResponsiveImage | StrapiStoreLocatorMediaFile | null;
};

export type StrapiStoreLocatorShowroom = {
  id?: number | string;
  documentId?: string | null;
  name?: string | null;
  slug?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  phone?: string | null;
  email?: string | null;
  mapUrl?: string | null;
  mapEmbed?: string | null;
  directionsUrl?: string | null;
  openingHours?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  image?: StrapiStoreLocatorResponsiveImage | null;
  seo?: StrapiStoreLocatorSeo | null;
};

export type StrapiStoreLocatorSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  metaKeywords?: string | null;
  ogImage?: StrapiStoreLocatorMediaFile | null;
  showField?: boolean | null;
};

export type StrapiStoreLocatorPage = {
  id?: number;
  hero?: StrapiStoreLocatorHero | null;
  searchPlaceholder?: string | null;
  useCurrentLocationLabel?: string | null;
  locationFilters?: StrapiStoreLocatorLocationFilter[] | null;
  getDirectionsLabel?: string | null;
  noResultsMessage?: string | null;
  showrooms?: StrapiStoreLocatorShowroom[] | null;
  seo?: StrapiStoreLocatorSeo | null;
  locale?: string | null;
};

export type NormalizedStoreLocatorCta = {
  label: string;
  url: string;
};

export type NormalizedStoreLocatorHero = {
  title: string | null;
  subtitle: string | null;
  desktopImageUrl: string | null;
  mobileImageUrl: string | null;
  imageAlt: string;
  videoUrl: string | null;
  primaryCta: NormalizedStoreLocatorCta | null;
  secondaryCta: NormalizedStoreLocatorCta | null;
};

export type NormalizedStoreLocatorLocationFilter = {
  id: string;
  label: string;
  /** Value used for store state filtering (typically state name). */
  value: string;
  iconUrl: string | null;
  iconAlt?: string;
};

export type NormalizedStoreLocatorShowroom = {
  id: string;
  documentId?: string;
  name: string;
  slug: string | null;
  address: string;
  city: string | null;
  state: string | null;
  phone: string;
  email: string | null;
  mapUrl: string;
  mapEmbed: string | null;
  openingHours: string | null;
  imageUrl: string;
  sortOrder: number;
};

export type NormalizedStoreLocatorSeo = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalPath?: string;
  metaKeywords?: string;
  ogImageUrl?: string;
};

export type NormalizedStoreLocatorPage = {
  hero: NormalizedStoreLocatorHero | null;
  searchPlaceholder: string | null;
  useCurrentLocationLabel: string | null;
  locationFilters: NormalizedStoreLocatorLocationFilter[];
  getDirectionsLabel: string | null;
  noResultsMessage: string | null;
  showrooms: NormalizedStoreLocatorShowroom[];
  seo: NormalizedStoreLocatorSeo | null;
};

export const EMPTY_STORE_LOCATOR_PAGE: NormalizedStoreLocatorPage = {
  hero: null,
  searchPlaceholder: null,
  useCurrentLocationLabel: null,
  locationFilters: [],
  getDirectionsLabel: null,
  noResultsMessage: null,
  showrooms: [],
  seo: null,
};
