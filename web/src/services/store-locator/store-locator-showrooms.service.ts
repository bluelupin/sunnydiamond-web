import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapStoreLocatorShowroom } from "./store-locator-page.mapper";
import type {
  NormalizedStoreLocatorShowroom,
  StrapiStoreLocatorShowroom,
} from "./store-locator-page.types";

const SHOWROOMS_COLLECTION_QUERY =
  "filters[isActive][$eq]=true" +
  "&pagination[pageSize]=100" +
  "&populate[image][populate][desktopImage]=true" +
  "&populate[image][populate][mobileImage]=true";

const sortByOrder = <T extends { sortOrder?: number | null }>(items: T[]): T[] =>
  [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

function unwrapStrapiCollection(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) {
    return payload.filter(
      (item): item is Record<string, unknown> => Boolean(item) && typeof item === "object",
    );
  }

  if (payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown }).data)) {
    return ((payload as { data: unknown[] }).data ?? []).filter(
      (item): item is Record<string, unknown> => Boolean(item) && typeof item === "object",
    );
  }

  return [];
}

function unwrapStrapiShowroomEntity(
  item: Record<string, unknown>,
): StrapiStoreLocatorShowroom | null {
  const attributes = item.attributes;
  if (attributes && typeof attributes === "object") {
    const attrs = attributes as StrapiStoreLocatorShowroom;
    return {
      ...attrs,
      id: (item.id ?? attrs.id) as StrapiStoreLocatorShowroom["id"],
      documentId: (item.documentId ?? attrs.documentId) ?? null,
    };
  }

  return item as StrapiStoreLocatorShowroom;
}

export function mapStoreLocatorShowroomsFromCollection(
  payload: unknown,
): NormalizedStoreLocatorShowroom[] {
  const entities = unwrapStrapiCollection(payload)
    .map(unwrapStrapiShowroomEntity)
    .filter((item): item is StrapiStoreLocatorShowroom => item != null);

  return sortByOrder(entities)
    .map(mapStoreLocatorShowroom)
    .filter((item): item is NormalizedStoreLocatorShowroom => item != null);
}

/** All active showrooms from the CMS collection (source of truth for store locator). */
export async function fetchStoreLocatorShowroomsFromCollection(
  signal?: AbortSignal,
): Promise<NormalizedStoreLocatorShowroom[]> {
  const payload = await apiFetch<unknown>(
    `${STRAPI_ENDPOINTS.showrooms}?${SHOWROOMS_COLLECTION_QUERY}`,
    { signal },
  );

  return mapStoreLocatorShowroomsFromCollection(payload);
}
