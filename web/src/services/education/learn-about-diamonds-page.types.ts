import {
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

export type StrapiLearnAboutDiamondsPageEntity = {
  hero?: StrapiEducationHero | null;
  faqSection?: StrapiEducationFaqSection | null;
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

export type NormalizedLearnAboutDiamondsPage = {
  hero: NormalizedEducationHero;
  faq: NormalizedEducationFaqSection;
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

export const EMPTY_LEARN_ABOUT_DIAMONDS_PAGE: NormalizedLearnAboutDiamondsPage = {
  hero: EMPTY_EDUCATION_HERO,
  faq: EMPTY_EDUCATION_FAQ,
};
