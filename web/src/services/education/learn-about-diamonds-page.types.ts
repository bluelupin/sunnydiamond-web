import type {
  EducationFourCsPanelContent,
  EducationSliderSpec,
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
  /** Single file or multi-media array from Strapi. */
  desktopImage?: StrapiEducationMediaFile | StrapiEducationMediaFile[] | null;
  mobileImage?: StrapiEducationMediaFile | StrapiEducationMediaFile[] | null;
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
  showField?: boolean | null;
  image?: StrapiEducationResponsiveImage | null;
  heroVideo?: StrapiEducationHeroVideo | null;
  backgroundVideo?: StrapiEducationHeroVideo | null;
};

export type StrapiEducationFaqItem = {
  id?: number;
  question?: string | null;
  answer?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
};

export type StrapiEducationFaqSection = {
  sectionHeading?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  faqItems?: StrapiEducationFaqItem[] | null;
};

export type StrapiEducationDiscoverStep = {
  id?: number;
  title?: string | null;
  description?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  showField?: boolean | null;
};

export type StrapiEducationCtaButton = {
  label?: string | null;
  url?: string | null;
  targetType?: string | null;
  openInNewTab?: boolean | null;
};

export type StrapiEducationDiscoverSection = {
  heading?: string | null;
  subheading?: string | null;
  ctaButtonLabel?: string | null;
  ctaButtonUrl?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  steps?: StrapiEducationDiscoverStep[] | null;
  backgroundImage?: StrapiEducationResponsiveImage | null;
};

/** @deprecated Legacy alias — API field is discoverSection */
export type StrapiEducationCtaBanner = StrapiEducationDiscoverSection;

export type StrapiEducationFourCsTag = {
  id?: number;
  label?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  showField?: boolean | null;
};

export type StrapiEducationFourCsIntro = {
  heading?: string | null;
  body?: string | null;
  mobileHeading?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  decorativeImage?: StrapiEducationResponsiveImage | null;
  fourCsTags?: StrapiEducationFourCsTag[] | null;
};

export type StrapiEducationGradeStop = {
  id?: number;
  sortOrder?: number | null;
  gradeCode?: string | null;
  gradeLongLabel?: string | null;
  gradeImage?: StrapiEducationResponsiveImage | null;
};

export type StrapiEducationFourCsInfoPanel = {
  id?: number;
  sortOrder?: number | null;
  displayTag?: string | null;
  sectionLabel?: string | null;
  description?: string | null;
  activeGradeCode?: string | null;
  activeGradeFullName?: string | null;
  brandNote?: string | null;
};

export type StrapiEducationFourCsVisualPanel = {
  id?: number;
  sortOrder?: number | null;
  subTitle?: string | null;
  gradeStops?: StrapiEducationGradeStop[] | null;
  visualImage?: StrapiEducationResponsiveImage | null;
};

export type StrapiEducationFourCsSection = {
  isActive?: boolean | null;
  showField?: boolean | null;
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
  isActive?: boolean | null;
  showField?: boolean | null;
  certificationLabs?: StrapiEducationCertificationLab[] | null;
  bgImage?: StrapiEducationResponsiveImage | null;
  cutoutImage?: StrapiEducationResponsiveImage | null;
};

export type StrapiEducationLearnFeatureItem = {
  id?: number;
  sortOrder?: number | null;
  label?: string | null;
  icon?: StrapiEducationResponsiveImage | null;
};

export type StrapiEducationLearnFeatureGroup = {
  id?: number;
  sortOrder?: number | null;
  featureSubtitle?: string | null;
  featureItems?: StrapiEducationLearnFeatureItem[] | null;
};

export type StrapiEducationLearnCarouselImage = {
  id?: number;
  sortOrder?: number | null;
  ctaButton?: StrapiEducationCtaButton | null;
  image?: StrapiEducationResponsiveImage | null;
};

export type StrapiEducationLearnTab = {
  id?: number;
  sortOrder?: number | null;
  tabLabel?: string | null;
  tabDescription?: string | null;
  layoutType?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  featureSubtitle?: string | null;
  featureImage?: StrapiEducationResponsiveImage | null;
  /** @deprecated Prefer featureGroups — kept for older payloads */
  featureItems?: StrapiEducationLearnFeatureItem[] | null;
  featureGroups?: StrapiEducationLearnFeatureGroup[] | null;
  carouselImage?: StrapiEducationLearnCarouselImage[] | null;
};

export type StrapiEducationLearnMoreSection = {
  sectionHeading?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  tabs?: StrapiEducationLearnTab[] | null;
};

export type StrapiEducationSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  metaKeywords?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  ogImage?: StrapiEducationMediaFile | null;
  structuredData?: unknown;
};

export type StrapiLearnAboutDiamondsPageEntity = {
  hero?: StrapiEducationHero | null;
  faqSection?: StrapiEducationFaqSection | null;
  discoverSection?: StrapiEducationDiscoverSection | null;
  /** @deprecated Legacy field name */
  ctaBanner?: StrapiEducationDiscoverSection | null;
  fourCsIntro?: StrapiEducationFourCsIntro | null;
  fourCsSection?: StrapiEducationFourCsSection | null;
  certificateSection?: StrapiEducationCertificateSection | null;
  learnMoreSection?: StrapiEducationLearnMoreSection | null;
  seo?: StrapiEducationSeo | null;
};

export type NormalizedEducationResponsiveImage = {
  desktopUrl: string;
  mobileUrl: string;
  alt: string;
  width?: number;
  height?: number;
};

export type NormalizedEducationHero = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  image: NormalizedEducationResponsiveImage | null;
  videoUrl?: string;
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
  ctaLabel?: string;
  ctaHref?: string;
  steps: string[];
  imageDesktopUrl: string;
  imageMobileUrl: string;
  imageAlt: string;
  hasCmsBackgroundImage: boolean;
};

export type NormalizedEducationFourCsIntro = {
  desktopTitle: string;
  mobileTitle?: string;
  description: string;
  pillars: readonly string[];
  imageDesktopUrl?: string;
  imageMobileUrl?: string;
  imageAlt?: string;
};

export type NormalizedEducationCaratHandImage = {
  desktopUrl: string;
  mobileUrl: string;
  alt: string;
};

export type NormalizedEducationFourCsPanel = EducationFourCsPanelContent & {
  sliderSpec?: EducationSliderSpec;
  panelTextureAlt?: string;
  /** Carat panel hand background from CMS `cVisualPanel.visualImage`. */
  caratHandImage?: NormalizedEducationCaratHandImage;
};

export type NormalizedEducationFourCsSection = {
  panels: NormalizedEducationFourCsPanel[];
};

export type NormalizedEducationCertification = {
  id: string;
  logoUrl: string;
  logoAlt: string;
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
  backgroundDesktopUrl?: string;
  backgroundMobileUrl?: string;
  backgroundAlt?: string;
};

export type NormalizedEducationLearnCareTip = {
  id: string;
  icon: string;
  mobileIcon?: string;
  iconAlt?: string;
  labelLines: string[];
};

export type NormalizedEducationLearnAnatomyTrait = {
  id: string;
  term: string;
  definition: string;
};

export type NormalizedEducationLearnAnatomySection = {
  id: string;
  title: string;
  traits: NormalizedEducationLearnAnatomyTrait[];
};

export type NormalizedEducationLearnAnatomyDetail = {
  imageDesktopUrl: string;
  imageMobileUrl: string;
  imageAlt: string;
  sections: NormalizedEducationLearnAnatomySection[];
};

export type NormalizedEducationLearnTab = {
  id: string;
  label: string;
  description: string[];
  layout: "carousel" | "care-grid" | "anatomy-detail";
  ctaLabel?: string;
  ctaHref?: string;
  slides?: { src: string; mobileSrc?: string; alt: string; ctaLabel?: string; ctaHref?: string }[];
  careTips?: NormalizedEducationLearnCareTip[];
  anatomyDetail?: NormalizedEducationLearnAnatomyDetail;
};

export type NormalizedEducationLearnMoreSection = {
  title: string;
  tabs: NormalizedEducationLearnTab[];
};

export type NormalizedEducationSeo = {
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
  metaKeywords?: string;
  ogImageUrl?: string;
};

export type NormalizedLearnAboutDiamondsPage = {
  hero: NormalizedEducationHero | null;
  faq: NormalizedEducationFaqSection | null;
  ctaBanner: NormalizedEducationCtaBanner | null;
  fourCsIntro: NormalizedEducationFourCsIntro | null;
  fourCs: NormalizedEducationFourCsSection | null;
  certificate: NormalizedEducationCertificateSection | null;
  learnMore: NormalizedEducationLearnMoreSection | null;
  seo: NormalizedEducationSeo | null;
};

export const EMPTY_LEARN_ABOUT_DIAMONDS_PAGE: NormalizedLearnAboutDiamondsPage = {
  hero: null,
  faq: null,
  ctaBanner: null,
  fourCsIntro: null,
  fourCs: null,
  certificate: null,
  learnMore: null,
  seo: null,
};
