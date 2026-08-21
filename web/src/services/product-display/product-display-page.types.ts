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
  modalTag?: string | null;
  style?: string | null;
};

export type StrapiProductDisplayStripItem = {
  id?: number;
  title?: string | null;
  description?: string | null;
  isActive?: boolean | null;
  icon?: {
    url?: string | null;
    alternativeText?: string | null;
    alternateText?: string | null;
  } | null;
};

export type StrapiProductDisplayCardButton = {
  id?: number;
  label?: string | null;
  url?: string | null;
  modalTag?: string | null;
  style?: string | null;
  openInNewTab?: boolean | null;
  targetType?: string | null;
};

export type StrapiProductDisplayCard = {
  id?: number;
  title?: string | null;
  subtitle?: string | null;
  isActive?: boolean | null;
  image?: StrapiProductDisplayResponsiveImage | {
    url?: string | null;
    alternativeText?: string | null;
    alternateText?: string | null;
  } | null;
  buttons?: StrapiProductDisplayCardButton[] | null;
};

export type StrapiProductDisplayToggleSection = {
  id?: number;
  isActive?: boolean | null;
};

export type StrapiProductDisplayVisitShowroom = {
  id?: number;
  documentId?: string;
  name?: string | null;
  slug?: string | null;
  isActive?: boolean | null;
  image?: StrapiProductDisplayResponsiveImage | null;
};

export type StrapiProductDisplayVisitUsSection = {
  id?: number;
  sectionTitle?: string | null;
  description?: string | null;
  sortOrder?: number | null;
  showField?: boolean | null;
  image?: StrapiProductDisplayResponsiveImage | null;
  cta?: StrapiProductDisplayCta | null;
  formCta?: { label?: string | null; modalTag?: string | null } | null;
  showrooms?: StrapiProductDisplayVisitShowroom[] | null;
};

export type StrapiProductDisplayPage = {
  id?: number;
  documentId?: string;
  stripTitle?: string | null;
  moreForYouTitle?: string | null;
  findYourSize?: StrapiProductDisplayCta | null;
  stripTnc?: StrapiProductDisplayCta | null;
  hereForYouCard?: StrapiProductDisplayCard | null;
  personaliseCard?: StrapiProductDisplayCard | null;
  pairItWith?: StrapiProductDisplayToggleSection | null;
  visitUsSection?: StrapiProductDisplayVisitUsSection | null;
  stripItems?: StrapiProductDisplayStripItem[] | null;
};

export type NormalizedProductDisplayBenefit = {
  label: string;
  mobileLabel: string;
  lines: [string, string];
  icon: string;
};

export type NormalizedProductDisplayStrip = {
  title: string;
  tnc: {
    label: string;
    href: string;
    openInNewTab: boolean;
  };
  items: NormalizedProductDisplayBenefit[];
};

export type NormalizedProductDisplayCardButton = {
  label: string;
  style: "primary" | "secondary";
  modalTag?: string;
  url?: string;
  openInNewTab: boolean;
};

export type NormalizedProductDisplayCard = {
  title: string;
  subtitle: string;
  isActive: boolean;
  imageSrc?: string;
  buttons: NormalizedProductDisplayCardButton[];
};

export type NormalizedVisitUsSection = {
  isActive: boolean;
  title: string;
  description: string;
  imageSrc: string;
  mobileImageSrc?: string;
  imageAlt?: string;
  ctaLabel: string;
  /** When set, CTA navigates; when omitted, UI opens Book a Visit panel. */
  ctaUrl?: string;
  /** Optional generic-form tag when CTA opens the book-visit panel (non-PDP). */
  bookVisitFormTag?: string;
};

export type NormalizedProductDisplayPage = {
  strip: NormalizedProductDisplayStrip;
  findYourSizeLabel: string;
  hereForYou: NormalizedProductDisplayCard;
  personalise: NormalizedProductDisplayCard;
  pairItWith: {
    isActive: boolean;
    sectionHeading: string;
  };
  moreForYouTitle: string;
  visitUs: NormalizedVisitUsSection;
};

/** Empty shape returned when CMS is unavailable — no static PDP marketing copy. */
export const EMPTY_PRODUCT_DISPLAY_PAGE: NormalizedProductDisplayPage = {
  strip: {
    title: "",
    tnc: {
      label: "",
      href: "",
      openInNewTab: false,
    },
    items: [],
  },
  findYourSizeLabel: "",
  hereForYou: {
    title: "",
    subtitle: "",
    isActive: false,
    buttons: [],
  },
  personalise: {
    title: "",
    subtitle: "",
    isActive: false,
    buttons: [],
  },
  pairItWith: {
    isActive: false,
    sectionHeading: "",
  },
  moreForYouTitle: "",
  visitUs: {
    isActive: false,
    title: "",
    description: "",
    imageSrc: "",
    ctaLabel: "",
  },
};
