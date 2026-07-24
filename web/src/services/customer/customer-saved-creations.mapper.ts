import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import type {
  CustomerSavedCreation,
  CustomerSavedCreationCta,
  CustomerSavedCreationMedia,
  CustomerSavedCreationRecord,
  CustomerSavedCreationsPage,
  SaveCustomerCreationResult,
  StrapiSaveCreationResponse,
  StrapiSavedCreation,
  StrapiSavedCreationCta,
  StrapiSavedCreationRecord,
  StrapiSavedCreationsResponse,
} from "./customer-saved-creations.types";

function cleanText(value?: string | null): string {
  return value?.trim() ?? "";
}

function mapMedia(raw: unknown): CustomerSavedCreationMedia | null {
  const url = resolveCmsMediaUrl(raw);
  if (!url) return null;

  return {
    url,
    alt: resolveCmsAltText(raw) ?? "",
  };
}

function mapCta(cta?: StrapiSavedCreationCta): CustomerSavedCreationCta | null {
  if (!cta) return null;
  const label = cleanText(cta.label);
  const href = cleanText(cta.href) || cleanText(cta.url);
  if (!label && !href) return null;
  return {
    label: label || "View",
    href: href || "/bespoke-jewellery",
  };
}

function mapCreation(raw?: StrapiSavedCreation | null): CustomerSavedCreation | null {
  if (!raw) return null;

  const documentId = cleanText(raw.documentId);
  const title = cleanText(raw.title);
  if (!documentId && !title) return null;

  const coverImage = mapMedia(raw.coverImage);
  const gallery = (raw.gallery ?? [])
    .map((item) => mapMedia(item))
    .filter((item): item is CustomerSavedCreationMedia => item != null);

  return {
    documentId: documentId || title,
    title: title || "Saved creation",
    slug: cleanText(raw.slug),
    description: cleanText(raw.description),
    coverImage,
    gallery,
    cta: mapCta(raw.cta),
  };
}

export function mapSavedCreationRecord(
  item: StrapiSavedCreationRecord,
): CustomerSavedCreationRecord | null {
  const documentId = cleanText(item.documentId);
  if (!documentId) return null;

  return {
    documentId,
    savedAt: cleanText(item.savedAt),
    creation: mapCreation(item.creation),
  };
}

export function mapSavedCreationsPage(
  payload: StrapiSavedCreationsResponse,
): CustomerSavedCreationsPage {
  const items = (payload.data ?? [])
    .map((item) => mapSavedCreationRecord(item))
    .filter((item): item is CustomerSavedCreationRecord => item != null);

  const pagination = payload.meta?.pagination;

  return {
    items,
    currentPage: Math.max(1, Number(pagination?.page ?? 1) || 1),
    pageSize: Math.max(1, Number(pagination?.pageSize ?? 20) || 20),
    totalPages: Math.max(1, Number(pagination?.pageCount ?? 1) || 1),
    totalCount: Math.max(0, Number(pagination?.total ?? items.length) || 0),
  };
}

export function mapSaveCreationResult(
  payload: StrapiSaveCreationResponse,
): SaveCustomerCreationResult {
  const alreadySaved = Boolean(payload.meta?.alreadySaved);
  const data = payload.data;

  if (!data || typeof data !== "object" || !("documentId" in data)) {
    return { alreadySaved, record: null };
  }

  return {
    alreadySaved,
    record: mapSavedCreationRecord(data as StrapiSavedCreationRecord),
  };
}
