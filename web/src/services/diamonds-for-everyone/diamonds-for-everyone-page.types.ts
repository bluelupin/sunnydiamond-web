import type {
  DfeInvestmentConfig,
  DfeInvestmentConfigInput,
} from "@/features/diamonds-for-everyone/utils/investmentConfig";

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
  textureImage?: StrapiDfeResponsiveImage | null;
};

export type StrapiDfeAccountSetupStep = {
  id?: number;
  label?: string | null;
  description?: string | null;
};

export type StrapiDfeStepperStep = {
  id?: number;
  label?: string | null;
};

export type StrapiDfeInvestmentPlannerSection = DfeInvestmentConfigInput & {
  id?: number;
  title?: string | null;
  description?: string | null;
  monthlySummary?: string | null;
  buttonLabel?: string | null;
  accountSetupHeading?: string | null;
  accountSetupDescription?: string | null;
  openAccountButtonLabel?: string | null;
  cancelButtonLabel?: string | null;
  accountSetupSteps?: StrapiDfeAccountSetupStep[] | null;
  stepperSteps?: StrapiDfeStepperStep[] | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  cta?: StrapiDfeCta | null;
  image?: StrapiDfeResponsiveImage | null;
  backgroundImage?: StrapiDfeResponsiveImage | null;
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

export type StrapiDfeSuccessScreen = {
  id?: number;
  heading?: string | null;
  description?: string | null;
  managePaymentsButtonLabel?: string | null;
  managePaymentsUrl?: string | null;
  shoppingLinkLabel?: string | null;
  shoppingUrl?: string | null;
  successIcon?: StrapiDfeResponsiveImage | StrapiDfeMediaFile | null;
  image?: StrapiDfeResponsiveImage | null;
};

export type StrapiDiamondsForEveryonePage = {
  id?: number;
  documentId?: string | null;
  locale?: string | null;
  heroSection?: StrapiDfeHeroSection | null;
  planIntroSection?: StrapiDfePlanIntroSection | null;
  investmentPlannerSection?: StrapiDfeInvestmentPlannerSection | null;
  benefitsSection?: StrapiDfeBenefitsSection | null;
  faqSection?: StrapiDfeFaqSection | null;
  successScreen?: StrapiDfeSuccessScreen | null;
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

export type NormalizedDfeHeroImage = {
  desktopUrl: string;
  mobileUrl: string;
  alt: string;
  width?: number;
  height?: number;
};

export type NormalizedDfeHero = {
  eyebrow?: string;
  title: string;
  image: NormalizedDfeHeroImage | null;
};

export type NormalizedDfePlanIntro = {
  title: string;
  description?: string;
  /** Desktop center product image. */
  backgroundImage: NormalizedDfeResponsiveImage | null;
  /** Mobile full-bleed texture background. */
  textureImage: NormalizedDfeResponsiveImage | null;
};

export type NormalizedDfeAccountSetupStep = {
  id: string;
  label: string;
  description: string;
};

export type NormalizedDfeAccountSetup = {
  heading: string;
  description?: string;
  openAccountButtonLabel?: string;
  cancelButtonLabel?: string;
  steps: NormalizedDfeAccountSetupStep[];
};

export type NormalizedDfeStepperStep = {
  id: string;
  label: string;
};

export type NormalizedDfeInvestmentPlanner = {
  title: string;
  description?: string;
  monthlySummary?: string;
  buttonLabel?: string;
  cta?: NormalizedDfeCta | null;
  image: NormalizedDfeResponsiveImage | null;
  backgroundImage: NormalizedDfeResponsiveImage | null;
  accountSetup: NormalizedDfeAccountSetup | null;
  stepperSteps: NormalizedDfeStepperStep[];
  /** Simulator numbers from Strapi, already validated against the built-in defaults. */
  investment: DfeInvestmentConfig;
};

export type NormalizedDfeBenefitStep = {
  id: string;
  stepNumber: number;
  title?: string;
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

export type NormalizedDfeSuccessScreen = {
  heading: string;
  description?: string;
  managePaymentsButtonLabel?: string;
  managePaymentsUrl?: string;
  shoppingLinkLabel?: string;
  shoppingUrl?: string;
  icon: NormalizedDfeResponsiveImage | null;
  image: NormalizedDfeResponsiveImage | null;
};

export type NormalizedDiamondsForEveryonePage = {
  hero: NormalizedDfeHero | null;
  planIntro: NormalizedDfePlanIntro | null;
  investmentPlanner: NormalizedDfeInvestmentPlanner | null;
  benefits: NormalizedDfeBenefits | null;
  faq: NormalizedDfeFaq | null;
  successScreen: NormalizedDfeSuccessScreen | null;
  seo: NormalizedDfeSeo | null;
};

export const EMPTY_DIAMONDS_FOR_EVERYONE_PAGE: NormalizedDiamondsForEveryonePage = {
  hero: null,
  planIntro: null,
  investmentPlanner: null,
  benefits: null,
  faq: null,
  successScreen: null,
  seo: null,
};
