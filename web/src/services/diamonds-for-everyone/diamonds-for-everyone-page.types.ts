/** Raw Strapi media file */
export type StrapiDfeMediaFile = {
  url?: string | null;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type StrapiDfeResponsiveImage = {
  altText?: string | null;
  caption?: string | null;
  desktopImage?: StrapiDfeMediaFile | null;
  mobileImage?: StrapiDfeMediaFile | null;
};

export type StrapiDfeCta = {
  id?: number;
  label?: string | null;
  url?: string | null;
  targetType?: string | null;
  openInNewTab?: boolean | null;
};

export type StrapiDfeHeroSection = {
  id?: number;
  eyebrow?: string | null;
  title?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  backgroundImage?: StrapiDfeResponsiveImage | null;
};

export type StrapiDfePlanIntroSection = {
  id?: number;
  title?: string | null;
  description?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  backgroundImage?: StrapiDfeResponsiveImage | null;
};

export type StrapiDfeInvestmentPlannerSection = {
  id?: number;
  title?: string | null;
  description?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  cta?: StrapiDfeCta | null;
  image?: StrapiDfeResponsiveImage | null;
};

export type StrapiDfeEditorialBannerSection = {
  id?: number;
  isActive?: boolean | null;
  showField?: boolean | null;
  cta?: StrapiDfeCta | null;
  image?: StrapiDfeResponsiveImage | null;
};

export type StrapiDfeBenefitStep = {
  id?: number;
  label?: string | null;
  description?: string | null;
  highlightedText?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
};

export type StrapiDfeBenefitsSection = {
  id?: number;
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  steps?: StrapiDfeBenefitStep[] | null;
  cta?: StrapiDfeCta | null;
  backgroundImage?: StrapiDfeResponsiveImage | null;
};

export type StrapiDfeFaqItem = {
  id?: number;
  question?: string | null;
  answer?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
};

export type StrapiDfeFaqSection = {
  id?: number;
  sectionHeading?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  faqItems?: StrapiDfeFaqItem[] | null;
};

export type StrapiDfeSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  metaKeywords?: string | null;
  ogImage?: StrapiDfeMediaFile | null;
  isActive?: boolean | null;
  showField?: boolean | null;
};

export type StrapiDiamondsForEveryonePage = {
  id?: number;
  documentId?: string | null;
  locale?: string | null;
  heroSection?: StrapiDfeHeroSection | null;
  planIntroSection?: StrapiDfePlanIntroSection | null;
  investmentPlannerSection?: StrapiDfeInvestmentPlannerSection | null;
  editorialBannerSection?: StrapiDfeEditorialBannerSection | null;
  benefitsSection?: StrapiDfeBenefitsSection | null;
  faqSection?: StrapiDfeFaqSection | null;
  seo?: StrapiDfeSeo | null;
};

export type NormalizedDfeResponsiveImage = {
  desktopUrl: string;
  mobileUrl: string;
  desktopAlt: string;
  mobileAlt: string;
};

export type NormalizedDfeCta = {
  label: string;
  url: string;
};

export type NormalizedDfeHero = {
  eyebrow?: string;
  title: string;
  image: NormalizedDfeResponsiveImage;
};

export type NormalizedDfePlanIntro = {
  title: string;
  description?: string;
  image: NormalizedDfeResponsiveImage | null;
};

export type NormalizedDfeInvestmentPlanner = {
  title: string;
  description?: string;
  cta?: NormalizedDfeCta | null;
  image: NormalizedDfeResponsiveImage | null;
};

export type NormalizedDfeEditorialBanner = {
  image: NormalizedDfeResponsiveImage;
  cta?: NormalizedDfeCta | null;
};

export type NormalizedDfeBenefitStep = {
  id: string;
  stepNumber: number;
  description: string;
  highlightedText?: string;
};

export type NormalizedDfeBenefits = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  steps: NormalizedDfeBenefitStep[];
  backgroundImage: NormalizedDfeResponsiveImage | null;
  cta?: NormalizedDfeCta | null;
};

export type NormalizedDfeFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type NormalizedDfeFaq = {
  title: string;
  items: NormalizedDfeFaqItem[];
};

export type NormalizedDfeSeo = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalPath?: string;
  metaKeywords?: string;
  ogImageUrl?: string;
};

export type NormalizedDiamondsForEveryonePage = {
  hero: NormalizedDfeHero | null;
  planIntro: NormalizedDfePlanIntro | null;
  investmentPlanner: NormalizedDfeInvestmentPlanner | null;
  editorialBanner: NormalizedDfeEditorialBanner | null;
  benefits: NormalizedDfeBenefits | null;
  faq: NormalizedDfeFaq | null;
  seo: NormalizedDfeSeo | null;
};

export const EMPTY_DIAMONDS_FOR_EVERYONE_PAGE: NormalizedDiamondsForEveryonePage = {
  hero: null,
  planIntro: null,
  investmentPlanner: null,
  editorialBanner: null,
  benefits: null,
  faq: null,
  seo: null,
};
