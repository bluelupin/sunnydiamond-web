/** Raw Strapi media file */
export type StrapiSupportMediaFile = {
  url?: string | null;
  alternativeText?: string | null;
};

export type StrapiSupportCta = {
  id?: number;
  label?: string | null;
  url?: string | null;
  to?: string | null;
};

/**
 * Live CMS contact option shape uses `type` + `value` + `availability` + `buttonLabel`.
 * Older/alternate field names are kept for compatibility.
 */
export type StrapiSupportContactOption = {
  id?: number | string;
  type?: string | null;
  title?: string | null;
  heading?: string | null;
  description?: string | null;
  body?: string | null;
  value?: string | null;
  phone?: string | null;
  email?: string | null;
  availability?: string | null;
  hours?: Array<{ label?: string | null; value?: string | null }> | string | null;
  buttonLabel?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  cta?: StrapiSupportCta | null;
  primaryCta?: StrapiSupportCta | null;
};

export type StrapiSupportContactSection = {
  id?: number;
  heading?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  contactOptions?: StrapiSupportContactOption[] | null;
};

export type StrapiSupportFaqItem = {
  id?: number | string;
  question?: string | null;
  answer?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  showField?: boolean | null;
};

export type StrapiSupportFaqSection = {
  id?: number;
  title?: string | null;
  sectionTitle?: string | null;
  sectionHeading?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  faqItems?: StrapiSupportFaqItem[] | null;
  items?: StrapiSupportFaqItem[] | null;
};

export type StrapiSupportSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  metaKeywords?: string | null;
  ogImage?: StrapiSupportMediaFile | null;
  showField?: boolean | null;
};

export type StrapiSupportHero = {
  id?: number;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
};

export type StrapiSupportPage = {
  id?: number;
  hero?: StrapiSupportHero | null;
  title?: string | null;
  sectionTitle?: string | null;
  contactSection?: StrapiSupportContactSection | null;
  contactOptions?: StrapiSupportContactOption[] | null;
  contactOption?: StrapiSupportContactOption[] | null;
  faqSection?: StrapiSupportFaqSection | null;
  faqs?: StrapiSupportFaqItem[] | null;
  seo?: StrapiSupportSeo | null;
  locale?: string | null;
  localizations?: unknown;
};

export type NormalizedSupportCta = {
  label: string;
  url: string;
};

export type NormalizedSupportContactOption = {
  id: string;
  title: string;
  description: string | null;
  phone: string | null;
  phoneHref: string | null;
  email: string | null;
  emailHref: string | null;
  hours: Array<{ label: string; value: string }>;
  cta: NormalizedSupportCta | null;
};

export type NormalizedSupportFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type NormalizedSupportFaqSection = {
  title: string | null;
  items: NormalizedSupportFaqItem[];
};

export type NormalizedSupportSeo = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalPath?: string;
  metaKeywords?: string;
  ogImageUrl?: string;
};

export type NormalizedSupportPage = {
  title: string | null;
  subtitle: string | null;
  contactOptions: NormalizedSupportContactOption[];
  faq: NormalizedSupportFaqSection | null;
  seo: NormalizedSupportSeo | null;
};

export const EMPTY_SUPPORT_PAGE: NormalizedSupportPage = {
  title: null,
  subtitle: null,
  contactOptions: [],
  faq: null,
  seo: null,
};
