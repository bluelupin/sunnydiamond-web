import type { NormalizedVisitUsSection } from "@/services/product-display/product-display-page.types";

/** Raw Strapi media file */
export type StrapiContactMediaFile = {
  url?: string | null;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type StrapiContactImageAsset = {
  id?: number;
  altText?: string | null;
  caption?: string | null;
  desktopImage?: StrapiContactMediaFile | null;
  mobileImage?: StrapiContactMediaFile | null;
};

export type StrapiContactCta = {
  id?: number;
  label?: string | null;
  url?: string | null;
  to?: string | null;
  targetType?: string | null;
  openInNewTab?: boolean | null;
};

export type StrapiContactHeroSection = {
  id?: number;
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  isActive?: boolean | null;
  image?: StrapiContactImageAsset | null;
  bgImage?: StrapiContactImageAsset | null;
  primaryCta?: StrapiContactCta | null;
  secondaryCta?: StrapiContactCta | null;
};

export type StrapiContactOption = {
  id?: number | string;
  type?: "phone" | "email" | "link" | string | null;
  heading?: string | null;
  title?: string | null;
  description?: string | null;
  availability?: string | null;
  value?: string | null;
  buttonLabel?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
};

export type StrapiContactSupportSection = {
  id?: number;
  heading?: string | null;
  isActive?: boolean | null;
  contactOptions?: StrapiContactOption[] | null;
};

export type StrapiContactFormDropdownOption = {
  id?: number;
  optionValue?: string | null;
};

export type StrapiContactFormDynamicField = {
  id?: number;
  label?: string | null;
  fieldType?: string | null;
  placeholder?: string | null;
  isRequired?: boolean | null;
  formStep?: number | string | null;
  dropdownOptions?: StrapiContactFormDropdownOption[] | null;
};

export type StrapiContactGenericForm = {
  id?: number;
  documentId?: string;
  formName?: string | null;
  formTag?: string | null;
  submitButtonText?: string | null;
  requiresConsent?: boolean | null;
  consentLabel?: string | null;
  dynamicFields?: StrapiContactFormDynamicField[] | null;
};

export type StrapiContactFormSection = {
  id?: number;
  heading?: string | null;
  successMessage?: string | null;
  isActive?: boolean | null;
  form?: StrapiContactGenericForm | null;
};

export type StrapiContactVisitShowroom = {
  id?: number | string;
  documentId?: string | null;
  name?: string | null;
  slug?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  image?: StrapiContactImageAsset | null;
};

export type StrapiContactVisitSection = {
  id?: number;
  sectionTitle?: string | null;
  description?: string | null;
  sortOrder?: number | null;
  showField?: boolean | null;
  image?: StrapiContactImageAsset | null;
  cta?: StrapiContactCta | null;
  formCta?: { label?: string | null; modalTag?: string | null } | null;
  showrooms?: StrapiContactVisitShowroom[] | null;
};

export type StrapiContactSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  metaKeywords?: string | null;
  ogImage?: StrapiContactMediaFile | null;
  showField?: boolean | null;
};

export type StrapiContactPage = {
  id?: number;
  documentId?: string;
  introText?: string | null;
  heroSection?: StrapiContactHeroSection | null;
  contactSection?: StrapiContactSupportSection | null;
  formSection?: StrapiContactFormSection | null;
  visitSection?: StrapiContactVisitSection | null;
  seo?: StrapiContactSeo | null;
  locale?: string | null;
  localizations?: unknown;
};

export type NormalizedContactHero = {
  title: string;
  image: {
    desktopUrl: string;
    mobileUrl: string;
    alt: string;
  };
};

export type NormalizedContactInfoCard = {
  id: string;
  variant: "phone" | "email" | "link";
  title: string;
  mobileTitle?: string;
  description?: string;
  hours: Array<{ label: string; value: string }>;
  link: { label: string; href: string };
};

export type NormalizedContactFormFields = {
  nameLabel: string;
  phoneLabel: string;
  emailLabel: string;
  reasonLabel: string;
  reasonPlaceholder: string;
  mobileReasonPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  mobileMessagePlaceholder: string;
  mobileFieldPlaceholder: string;
};

export type NormalizedContactForm = {
  title: string;
  formTag: string;
  submitLabel: string;
  successTitle: string;
  successDescription: string;
  fields: NormalizedContactFormFields;
  reasonOptions: string[];
  consentPrefix: string;
  consentSuffix: string;
  mobileConsentSuffix: string;
  termsLabel: string;
  mobileTermsLabel: string;
  privacyLabel: string;
  mobilePrivacyLabel: string;
  consentError: string;
};

export type NormalizedContactSeo = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalPath?: string;
  metaKeywords?: string;
  ogImageUrl?: string;
};

export type NormalizedContactPage = {
  hero: NormalizedContactHero;
  intro: {
    description: string;
    mobileDescription: string;
  };
  infoCards: NormalizedContactInfoCard[];
  form: NormalizedContactForm;
  visitUs: NormalizedVisitUsSection;
  seo: NormalizedContactSeo | null;
};
