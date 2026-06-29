import {
  educationDiscoverContent,
  educationFaqItems,
  educationHeroFigmaSpec,
  educationPageImages,
} from "@/features/education/data/content";

export type StrapiEducationMediaFile = {
  url?: string | null;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
  mime?: string | null;
};

export type StrapiEducationResponsiveImage = {
  altText?: string | null;
  caption?: string | null;
  desktopImage?: StrapiEducationMediaFile | null;
  mobileImage?: StrapiEducationMediaFile | null;
};

export type StrapiEducationHeroVideo = {
  altText?: string | null;
  heroVideo?: StrapiEducationMediaFile | null;
};

export type StrapiEducationHero = {
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  isActive?: boolean | null;
  image?: StrapiEducationResponsiveImage | null;
  heroVideo?: StrapiEducationHeroVideo | null;
};

export type StrapiEducationFaqItem = {
  id?: number;
  question?: string | null;
  answer?: string | null;
};

export type StrapiEducationFaqSection = {
  sectionHeading?: string | null;
  faqItems?: StrapiEducationFaqItem[] | null;
};

export type StrapiEducationCtaBanner = {
  heading?: string | null;
  subheading?: string | null;
  ctaButtonLabel?: string | null;
  ctaButtonUrl?: string | null;
  backgroundImage?: StrapiEducationResponsiveImage | null;
};

export type StrapiLearnAboutDiamondsPageEntity = {
  hero?: StrapiEducationHero | null;
  faqSection?: StrapiEducationFaqSection | null;
  ctaBanner?: StrapiEducationCtaBanner | null;
};

export type NormalizedEducationHero = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  videoUrl?: string;
  posterDesktopUrl: string;
  posterMobileUrl: string;
  posterAlt: string;
};

export type NormalizedEducationFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type NormalizedEducationFaqSection = {
  heading: string;
  items: NormalizedEducationFaqItem[];
};

export type NormalizedEducationCtaBanner = {
  heading: string;
  subheading: string;
  ctaLabel: string;
  ctaHref: string;
  imageDesktopUrl: string;
  imageMobileUrl: string;
  imageAlt: string;
  /** True when CMS provides a background image (uses cover fit instead of Figma crop). */
  hasCmsBackgroundImage: boolean;
};

export type NormalizedLearnAboutDiamondsPage = {
  hero: NormalizedEducationHero;
  faq: NormalizedEducationFaqSection;
  ctaBanner: NormalizedEducationCtaBanner;
};

export const EMPTY_EDUCATION_HERO: NormalizedEducationHero = {
  title: educationHeroFigmaSpec.title.text,
  posterDesktopUrl: educationPageImages.heroDesktop,
  posterMobileUrl: educationPageImages.heroMobile,
  posterAlt: educationHeroFigmaSpec.image.alt,
};

export const EMPTY_EDUCATION_FAQ: NormalizedEducationFaqSection = {
  heading: "Frequently Asked Questions",
  items: educationFaqItems.map(({ id, question, answer }) => ({
    id,
    question,
    answer: answer ?? "",
  })),
};

export const EMPTY_EDUCATION_CTA_BANNER: NormalizedEducationCtaBanner = {
  heading: educationDiscoverContent.title,
  subheading: educationDiscoverContent.description,
  ctaLabel: educationDiscoverContent.ctaLabel,
  ctaHref: educationDiscoverContent.ctaHref,
  imageDesktopUrl: educationPageImages.discoverImage,
  imageMobileUrl: educationPageImages.discoverImage,
  imageAlt: "",
  hasCmsBackgroundImage: false,
};

export const EMPTY_LEARN_ABOUT_DIAMONDS_PAGE: NormalizedLearnAboutDiamondsPage = {
  hero: EMPTY_EDUCATION_HERO,
  faq: EMPTY_EDUCATION_FAQ,
  ctaBanner: EMPTY_EDUCATION_CTA_BANNER,
};
