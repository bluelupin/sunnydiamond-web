import type { StrapiImagePayload } from "@/types/strapiMedia";

export type StrapiBespokeResponsiveImage = {
  altText?: string | null;
  caption?: string | null;
  desktopImage?: StrapiImagePayload | null;
  mobileImage?: StrapiImagePayload | null;
};

export type StrapiBespokeCta = {
  id?: number;
  label?: string | null;
  url?: string | null;
  targetType?: string | null;
  openInNewTab?: boolean | null;
};

export type StrapiBespokeSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  metaKeywords?: string | null;
  structuredData?: unknown;
  showField?: boolean | null;
  ogImage?: StrapiImagePayload | null;
};

export type StrapiBespokeHero = {
  id?: number;
  title?: string | null;
  showField?: boolean | null;
  backgroundImage?: StrapiBespokeResponsiveImage | null;
};

export type StrapiBespokeVisionCard = {
  id?: number;
  stepLabel?: string | null;
  title?: string | null;
  description?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  image?: StrapiBespokeResponsiveImage | null;
  media?: StrapiImagePayload | null;
  video?: {
    altText?: string | null;
    heroVideo?: StrapiImagePayload | null;
  } | null;
};

export type StrapiBespokeVisionSection = {
  id?: number;
  title?: string | null;
  description?: string | null;
  showField?: boolean | null;
  cards?: StrapiBespokeVisionCard[] | null;
  cta?: StrapiBespokeCta | null;
  primaryCta?: StrapiBespokeCta | null;
  video?: StrapiImagePayload | null;
  videoUrl?: { heroVideo?: StrapiImagePayload | null } | null;
};

export type StrapiBespokeFeaturedStoryCard = {
  id?: number;
  documentId?: string | null;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  coverImage?: StrapiImagePayload | null;
  image?: StrapiBespokeResponsiveImage | null;
  gallery?: StrapiImagePayload[] | null;
};

export type StrapiBespokeFeaturedStoriesSection = {
  id?: number;
  title?: string | null;
  showField?: boolean | null;
  cards?: StrapiBespokeFeaturedStoryCard[] | null;
  cta?: StrapiBespokeCta | null;
  secondaryCta?: StrapiBespokeCta | null;
  modalCta?: StrapiBespokeCta | null;
  backgroundImage?: StrapiBespokeResponsiveImage | null;
};

export type StrapiBespokePastCreation = {
  id?: number;
  documentId?: string | null;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  coverImage?: StrapiImagePayload | null;
  gallery?: StrapiImagePayload[] | null;
  cta?: StrapiBespokeCta | null;
};

export type StrapiBespokeServiceHighlight = {
  id?: number;
  label?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  /** CMS "Icon Alt Text" on the service-highlight component */
  iconAltText?: string | null;
  icon?: StrapiBespokeResponsiveImage | StrapiImagePayload | null;
};

export type StrapiBespokeGetInTouchSection = {
  id?: number;
  title?: string | null;
  description?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  backgroundImage?: StrapiBespokeResponsiveImage | null;
  cta?: StrapiBespokeCta | null;
};

export type StrapiBespokeCustomDesignForm = {
  id?: number;
  showField?: boolean | null;
  title?: string | null;
  fullNameLabel?: string | null;
  phoneLabel?: string | null;
  emailLabel?: string | null;
  visionLabel?: string | null;
  referenceImagePrompt?: string | null;
  referenceImageButtonText?: string | null;
  helperText?: string | null;
  submitButtonText?: string | null;
};

export type StrapiContactBespokePageEntity = {
  id?: number;
  documentId?: string | null;
  hero?: StrapiBespokeHero | null;
  visionSection?: StrapiBespokeVisionSection | null;
  featuredStoriesSection?: StrapiBespokeFeaturedStoriesSection | null;
  pastCreations?: StrapiBespokePastCreation[] | null;
  serviceHighlights?: StrapiBespokeServiceHighlight[] | null;
  getInTouchSection?: StrapiBespokeGetInTouchSection | null;
  customDesignForm?: StrapiBespokeCustomDesignForm | null;
  seo?: StrapiBespokeSeo | null;
};

export type NormalizedBespokeResponsiveImage = {
  desktopUrl: string;
  mobileUrl: string;
  alt: string;
};

export type NormalizedBespokeSeo = {
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
  metaKeywords?: string;
  ogImageUrl?: string;
};

export type NormalizedBespokeHero = {
  title: string;
  image: NormalizedBespokeResponsiveImage | null;
};

export type NormalizedBespokeStoryStep = {
  number: string;
  title: string;
  description: string;
  image: { src: string; alt: string };
};

export type NormalizedBespokeStory = {
  title: string;
  subtitle: string;
  videoSrc?: string;
  steps: NormalizedBespokeStoryStep[];
  ctaLabel?: string;
};

export type NormalizedBespokeFeaturedSlide = {
  /** Strapi featured-story / past-creation documentId — required to save as inspiration. */
  documentId?: string;
  src: string;
  alt: string;
  modalTitle: string;
  modalDescription: string;
  modalImages: { src: string; alt: string }[];
  href?: string;
};

export type NormalizedBespokeFeaturedStories = {
  title: string;
  defaultSlideIndex: number;
  slides: NormalizedBespokeFeaturedSlide[];
  backgroundImage: NormalizedBespokeResponsiveImage | null;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  modalCtaLabel?: string;
};

export type NormalizedBespokePastCreationImage = {
  documentId?: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type NormalizedBespokePastCreations = {
  title: string;
  images: NormalizedBespokePastCreationImage[];
};

export type NormalizedBespokeGuarantee = {
  iconSrc: string;
  label: string;
  alt: string;
};

export type NormalizedBespokeGetInTouch = {
  id: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: NormalizedBespokeResponsiveImage | null;
};

export type NormalizedBespokeCustomDesignForm = {
  title: string;
  fullNameLabel: string;
  phoneLabel: string;
  emailLabel: string;
  visionLabel: string;
  referenceImagePrompt: string;
  referenceImageButtonText: string;
  helperText: string;
  submitButtonText: string;
  dialogAriaLabel: string;
  successToast: { title: string; description: string };
};

export type NormalizedContactBespokePage = {
  hero: NormalizedBespokeHero | null;
  story: NormalizedBespokeStory | null;
  featuredStories: NormalizedBespokeFeaturedStories | null;
  pastCreations: NormalizedBespokePastCreations | null;
  guarantees: NormalizedBespokeGuarantee[];
  interested: NormalizedBespokeGetInTouch | null;
  customDesignForm: NormalizedBespokeCustomDesignForm | null;
  seo: NormalizedBespokeSeo | null;
};

export const EMPTY_CONTACT_BESPOKE_PAGE: NormalizedContactBespokePage = {
  hero: null,
  story: null,
  featuredStories: null,
  pastCreations: null,
  guarantees: [],
  interested: null,
  customDesignForm: null,
  seo: null,
};
