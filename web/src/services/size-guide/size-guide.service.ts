import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapSizeGuides } from "./size-guide.mapper";
import type { NormalizedSizeGuide, StrapiSizeGuide } from "./size-guide.types";

const SIZE_GUIDES_POPULATE =
  "populate[tutorialVideo]=true" +
  "&populate[circumferenceHeaderImage]=true" +
  "&populate[diameterHeaderImage]=true" +
  "&populate[chartRows]=true" +
  "&pagination[pageSize]=50";

/** Client-safe fetch — all guides in one request. */
export async function fetchSizeGuides(signal?: AbortSignal): Promise<NormalizedSizeGuide[]> {
  try {
    // apiFetch unwraps `{ data: [...] }` to the array.
    const raw = await apiFetch<StrapiSizeGuide[]>(
      `${STRAPI_ENDPOINTS.sizeGuides}?${SIZE_GUIDES_POPULATE}`,
      { signal },
    );
    return mapSizeGuides(raw);
  } catch {
    return [];
  }
}

/** Server/RSC — single Strapi fetch for all size guides, pick by category on the page. */
export const getSizeGuides = cache(async (signal?: AbortSignal): Promise<NormalizedSizeGuide[]> => {
  return fetchSizeGuides(signal);
});

export type { NormalizedSizeGuide };
