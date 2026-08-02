import type {
  PolicyAccordionSection,
  PolicyDocument,
  PolicyNavGroup,
} from "@/features/cms/data/policyCertificationsContent";
import type { StrapiImage } from "@/types/strapiMedia";

export type StrapiPolicySeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  metaKeywords?: string | null;
  ogImage?: StrapiImage;
};

export type StrapiPolicyAccordionItem = {
  id?: number;
  question?: string | null;
  answer?: string | null;
  isOpenByDefault?: boolean | null;
  sortOrder?: number | null;
};

export type StrapiPolicy = {
  id?: number;
  title?: string | null;
  slug?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  accordionItems?: StrapiPolicyAccordionItem[] | null;
};

export type StrapiPolicyCategory = {
  id?: number;
  title?: string | null;
  slug?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  policies?: StrapiPolicy[] | null;
};

export type StrapiPolicyContactOption = {
  id?: number;
  type?: string | null;
  heading?: string | null;
  description?: string | null;
  availability?: string | null;
  value?: string | null;
  buttonLabel?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
};

export type StrapiPolicyCertificationsPage = {
  headerSection?: {
    heading?: string | null;
    searchPlaceholder?: string | null;
    emptySearchMessage?: string | null;
  } | null;
  policyCategories?: StrapiPolicyCategory[] | null;
  contactSection?: {
    heading?: string | null;
    isActive?: boolean | null;
    contactOptions?: StrapiPolicyContactOption[] | null;
  } | null;
  seo?: StrapiPolicySeo | null;
};

export type StrapiLegalPage = {
  id?: number;
  documentId?: string;
  title?: string | null;
  slug?: string | null;
  summary?: string | null;
  body?: string | null;
  effectiveDate?: string | null;
  isActive?: boolean | null;
  seo?: StrapiPolicySeo | null;
};

export type PolicySupportHour = {
  label: string;
  value: string;
};

export type PolicySupportContent = {
  callTitle: string;
  emailTitle: string;
  emailDescription: string;
  contactCtaLabel: string;
  contactHref: string;
  emailCtaLabel: string;
  emailHref: string;
  phoneLabel: string;
  phoneHref: string;
  emailLabel: string;
  hours: PolicySupportHour[];
};

export type PolicyPageSeo = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalPath?: string;
  keywords?: string;
  ogImageUrl?: string;
};

export type NormalizedPolicyCertificationsPage = {
  pageTitle: string;
  searchPlaceholder: string;
  emptySearchLabel: string;
  support: PolicySupportContent;
  navGroups: PolicyNavGroup[];
  defaultPolicyId: string;
  seo: PolicyPageSeo | null;
};

export type { PolicyAccordionSection, PolicyDocument, PolicyNavGroup };
