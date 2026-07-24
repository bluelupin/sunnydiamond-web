export type CustomerSavedCreationMedia = {
  url: string;
  alt: string;
};

export type CustomerSavedCreationCta = {
  label: string;
  href: string;
};

export type CustomerSavedCreation = {
  documentId: string;
  title: string;
  slug: string;
  description: string;
  coverImage: CustomerSavedCreationMedia | null;
  gallery: CustomerSavedCreationMedia[];
  cta: CustomerSavedCreationCta | null;
};

export type CustomerSavedCreationRecord = {
  documentId: string;
  savedAt: string;
  creation: CustomerSavedCreation | null;
};

export type CustomerSavedCreationsPage = {
  items: CustomerSavedCreationRecord[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
};

export type SaveCustomerCreationResult = {
  alreadySaved: boolean;
  record: CustomerSavedCreationRecord | null;
};

export type StrapiSavedCreationMedia = {
  url?: string | null;
  alternativeText?: string | null;
  altText?: string | null;
  formats?: Record<string, { url?: string | null } | null> | null;
} | null;

export type StrapiSavedCreationCta = {
  label?: string | null;
  href?: string | null;
  url?: string | null;
} | null;

export type StrapiSavedCreation = {
  documentId?: string | null;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  coverImage?: StrapiSavedCreationMedia | unknown;
  gallery?: Array<StrapiSavedCreationMedia | unknown> | null;
  cta?: StrapiSavedCreationCta;
};

export type StrapiSavedCreationRecord = {
  documentId?: string | null;
  savedAt?: string | null;
  creation?: StrapiSavedCreation | null;
};

export type StrapiSavedCreationsResponse = {
  data?: StrapiSavedCreationRecord[] | null;
  meta?: {
    pagination?: {
      page?: number | null;
      pageSize?: number | null;
      pageCount?: number | null;
      total?: number | null;
    } | null;
  } | null;
};

export type StrapiSaveCreationResponse = {
  data?: StrapiSavedCreationRecord | Record<string, never> | null;
  meta?: {
    alreadySaved?: boolean | null;
  } | null;
};
