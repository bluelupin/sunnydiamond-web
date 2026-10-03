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
  label?: string | null;
  description?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  icon?:
    | {
        url?: string | null;
        alternativeText?: string | null;
        alternateText?: string | null;
      }
    | StrapiProductDisplayResponsiveImage
    | null;
};

/** Cart benefits badge — CMS component item inside `stripCartItems.items`. */
export type StrapiProductDisplayCartStripItem = {
  id?: number;
  badgeTitle?: string | null;
  showBadge?: boolean | null;
  icon?:
    | {
        url?: string | null;
        alternativeText?: string | null;
        alternateText?: string | null;
      }
    | StrapiProductDisplayResponsiveImage
    | null;
};

/** Cart benefits strip — nested CMS component on product-display-page. */
export type StrapiProductDisplayCartStripSection = {
  id?: number;
  title?: string | null;
  tncCta?: StrapiProductDisplayCta | null;
  items?: StrapiProductDisplayCartStripItem[] | null;
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

export type StrapiProductDisplayVisitUsSection = {
  id?: number;
  sectionTitle?: string | null;
  welcomeNote?: string | null;
  appointmentLabel?: string | null;
  showField?: boolean | null;
  backgroundImage?: StrapiProductDisplayResponsiveImage | null;
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
  stripCartItems?: StrapiProductDisplayCartStripSection | null;
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
  /** Contact Visit Us optional CMS note — shown only when provided. */
  welcomeNote?: string;
  imageSrc: string;
  mobileImageSrc?: string;
  imageAlt?: string;
  ctaLabel: string;
  /** When set, CTA navigates; when omitted, UI opens Book a Visit panel (PDP). */
  ctaUrl?: string;
  ctaOpenInNewTab?: boolean;
  /** CMS CTA `targetType` when provided (`internal` | `external`). */
  ctaTargetType?: string;
  /** Optional generic-form tag when CTA opens the book-visit panel (non-PDP). */
  bookVisitFormTag?: string;
};

export type NormalizedProductDisplayPage = {
  strip: NormalizedProductDisplayStrip;
  cartStrip: NormalizedProductDisplayStrip;
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
const EMPTY_PRODUCT_DISPLAY_STRIP: NormalizedProductDisplayStrip = {
  title: "",
  tnc: {
    label: "",
    href: "",
    openInNewTab: false,
  },
  items: [],
};

export const EMPTY_PRODUCT_DISPLAY_PAGE: NormalizedProductDisplayPage = {
  strip: EMPTY_PRODUCT_DISPLAY_STRIP,
  cartStrip: EMPTY_PRODUCT_DISPLAY_STRIP,
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
