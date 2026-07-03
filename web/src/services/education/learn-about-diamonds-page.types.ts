import {
  educationCertifiedContent,
  educationDiscoverContent,
  educationFaqItems,
  educationFourCsIntroContent,
  educationFourCsPanels,
  educationPageImages,
  type EducationFourCsPanelContent,
  type EducationSliderOption,
  type EducationSliderSpec,
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

export type StrapiEducationFourCsIntro = {
  heading?: string | null;
  body?: string | null;
  mobileHeading?: string | null;
  image?: StrapiEducationResponsiveImage | null;
};

export type StrapiEducationGradeStop = {
  id?: number;
  gradeCode?: string | null;
  gradeLongLabel?: string | null;
};

export type StrapiEducationFourCsInfoPanel = {
  displayTag?: string | null;
  sectionLabel?: string | null;
  description?: string | null;
  activeGradeCode?: string | null;
  activeGradeFullName?: string | null;
  brandNote?: string | null;
};

export type StrapiEducationFourCsVisualPanel = {
  gradeStops?: StrapiEducationGradeStop[] | null;
  visualImage?: StrapiEducationResponsiveImage | null;
};

export type StrapiEducationFourCsSection = {
  cInfoPanel?: StrapiEducationFourCsInfoPanel[] | null;
  cVisualPanel?: StrapiEducationFourCsVisualPanel[] | null;
};

export type StrapiEducationCertificationLab = {
  id?: number;
  labName?: string | null;
  labCode?: string | null;
  labDescription?: string | null;
  labLogo?: StrapiEducationResponsiveImage | null;
};

export type StrapiEducationCertificateSection = {
  sectionHeading?: string | null;
  sectionDescription?: string | null;
  whyCertificationHeading?: string | null;
  whyCertificationDescription?: string | null;
  howToVerifyHeading?: string | null;
  howToVerifyDescription?: string | null;
  certificationLabs?: StrapiEducationCertificationLab[] | null;
};

export type StrapiLearnAboutDiamondsPageEntity = {
  hero?: StrapiEducationHero | null;
  faqSection?: StrapiEducationFaqSection | null;
  ctaBanner?: StrapiEducationCtaBanner | null;
  fourCsIntro?: StrapiEducationFourCsIntro | null;
  fourCsSection?: StrapiEducationFourCsSection | null;
  certificateSection?: StrapiEducationCertificateSection | null;
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

export type NormalizedEducationFourCsIntro = {
  desktopTitle: string;
  mobileTitle: string;
  description: string;
  pillars: readonly string[];
  imageDesktopUrl: string;
  imageMobileUrl: string;
  imageAlt: string;
};

export type NormalizedEducationFourCsPanel = EducationFourCsPanelContent & {
  sliderSpec?: EducationSliderSpec;
};

export type NormalizedEducationFourCsSection = {
  panels: NormalizedEducationFourCsPanel[];
};

export type NormalizedEducationCertification = {
  id: string;
  logoUrl: string;
  label: string;
  mobileLabelLines?: readonly [string, string];
  logoClassName: string;
  mobileLogoClassName: string;
  imageClassName: string;
  logoWrapClassName?: string;
  usesCmsLogo: boolean;
};

export type NormalizedEducationCertificateSection = {
  title: string;
  certifications: NormalizedEducationCertification[];
  mobileLogoOrder: readonly string[];
  whyTitle: string;
  whyDescription: string;
  howTitle: string;
  howDescription: string;
};

export type NormalizedLearnAboutDiamondsPage = {
  hero: NormalizedEducationHero | null;
  faq: NormalizedEducationFaqSection;
  ctaBanner: NormalizedEducationCtaBanner;
  fourCsIntro: NormalizedEducationFourCsIntro;
  fourCs: NormalizedEducationFourCsSection;
  certificate: NormalizedEducationCertificateSection;
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

export const EMPTY_EDUCATION_FOUR_CS_INTRO: NormalizedEducationFourCsIntro = {
  desktopTitle: educationFourCsIntroContent.desktopTitle,
  mobileTitle: educationFourCsIntroContent.mobileTitle,
  description: educationFourCsIntroContent.description,
  pillars: educationFourCsIntroContent.pillars,
  imageDesktopUrl: educationPageImages.diamondOval,
  imageMobileUrl: educationPageImages.diamondOval,
  imageAlt: "",
};

export const EMPTY_EDUCATION_FOUR_CS: NormalizedEducationFourCsSection = {
  panels: educationFourCsPanels.map((panel) => ({ ...panel })),
};

export const EMPTY_EDUCATION_CERTIFICATE: NormalizedEducationCertificateSection = {
  title: educationCertifiedContent.title,
  certifications: educationCertifiedContent.certifications.map((cert) => ({
    id: cert.id,
    logoUrl: cert.logo,
    label: cert.label,
    ...("mobileLabelLines" in cert ? { mobileLabelLines: cert.mobileLabelLines } : {}),
    logoClassName: cert.logoClassName,
    mobileLogoClassName: cert.mobileLogoClassName,
    imageClassName: cert.imageClassName,
    ...("logoWrapClassName" in cert ? { logoWrapClassName: cert.logoWrapClassName } : {}),
    usesCmsLogo: false,
  })),
  mobileLogoOrder: educationCertifiedContent.mobileLogoOrder,
  whyTitle: educationCertifiedContent.whyTitle,
  whyDescription: educationCertifiedContent.whyDescription,
  howTitle: educationCertifiedContent.howTitle,
  howDescription: educationCertifiedContent.howDescription,
};

export const EMPTY_LEARN_ABOUT_DIAMONDS_PAGE: NormalizedLearnAboutDiamondsPage = {
  hero: null,
  faq: EMPTY_EDUCATION_FAQ,
  ctaBanner: EMPTY_EDUCATION_CTA_BANNER,
  fourCsIntro: EMPTY_EDUCATION_FOUR_CS_INTRO,
  fourCs: EMPTY_EDUCATION_FOUR_CS,
  certificate: EMPTY_EDUCATION_CERTIFICATE,
};
