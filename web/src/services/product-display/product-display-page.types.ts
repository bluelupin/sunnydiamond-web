export type StrapiProductDisplayResponsiveImage = {
  id?: number;
  altText?: string | null;
  caption?: string | null;
  desktopImage?: {
    url?: string | null;
    alternativeText?: string | null;
    alternateText?: string | null;
  } | null;
  mobileImage?: {
    url?: string | null;
    alternativeText?: string | null;
    alternateText?: string | null;
  } | null;
};

export type StrapiProductDisplayCta = {
  id?: number;
  label?: string | null;
  url?: string | null;
  targetType?: string | null;
  openInNewTab?: boolean | null;
};

export type StrapiProductDisplayVisitUsSection = {
  id?: number;
  sectionTitle?: string | null;
  description?: string | null;
  sortOrder?: number | null;
  showField?: boolean | null;
  image?: StrapiProductDisplayResponsiveImage | null;
  cta?: StrapiProductDisplayCta | null;
  formCta?: StrapiProductDisplayCta | null;
};

export type StrapiProductDisplayPage = {
  id?: number;
  documentId?: string;
  visitUsSection?: StrapiProductDisplayVisitUsSection | null;
};

export type NormalizedVisitUsSection = {
  title: string;
  description: string;
  imageSrc: string;
  mobileImageSrc?: string;
  imageAlt?: string;
  ctaLabel: string;
  /** When set, CTA navigates; when omitted, UI opens Book a Visit panel. */
  ctaUrl?: string;
};

export const VISIT_US_FALLBACK: NormalizedVisitUsSection = {
  title: "Visit Us",
  description: "Designs thoughtfully crafted to bring your vision to life",
  imageSrc: "/images/products/pdp/visit-us-hero.png",
  ctaLabel: "Book a Visit",
};
