import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import {
  findSizeGuideForCategory,
  mapSizeGuides,
  resolveProductSizeGuideCategoryKey,
} from "./size-guide.mapper";
import type { NormalizedSizeGuide, StrapiSizeGuide } from "./size-guide.types";

const SIZE_GUIDES_POPULATE =
  "populate[tutorialVideo]=true" +
  "&populate[circumferenceHeaderImage]=true" +
  "&populate[diameterHeaderImage]=true" +
  "&populate[chartRows]=true";

const SIZE_GUIDES_ALL_POPULATE = `${SIZE_GUIDES_POPULATE}&pagination[pageSize]=50`;

function sizeGuideNameFilterVariants(categoryKey: string): string[] {
  const variants = new Set<string>([categoryKey]);
  if (categoryKey.endsWith("s")) {
    variants.add(categoryKey.slice(0, -1));
  } else {
    variants.add(`${categoryKey}s`);
  }
  return [...variants];
}

function buildSizeGuideFilterQuery(categoryKey: string): string {
  const variants = sizeGuideNameFilterVariants(categoryKey);
  const filters = variants
    .map((name, index) => `filters[$or][${index}][name][$eqi]=${encodeURIComponent(name)}`)
    .join("&");

  return `${SIZE_GUIDES_POPULATE}&${filters}&pagination[pageSize]=1`;
}

async function fetchSizeGuideByCategoryKey(
  categoryKey: string,
  signal?: AbortSignal,
): Promise<NormalizedSizeGuide | null> {
  try {
    const raw = await apiFetch<StrapiSizeGuide[]>(
      `${STRAPI_ENDPOINTS.sizeGuides}?${buildSizeGuideFilterQuery(categoryKey)}`,
      { signal },
    );
    const guides = mapSizeGuides(raw);
    return findSizeGuideForCategory(guides, categoryKey);
  } catch {
    return null;
  }
}

const getCachedSizeGuideByCategoryKey = cache((categoryKey: string) =>
  fetchSizeGuideByCategoryKey(categoryKey),
);

/** Fetches a single size guide for a product category (server/RSC). */
export async function getSizeGuideForProduct(
  product: {
    categoryUrlKey?: string | null;
    categorySlug?: string | null;
    category?: string | null;
  },
  signal?: AbortSignal,
): Promise<NormalizedSizeGuide | null> {
  const categoryKey = resolveProductSizeGuideCategoryKey(product);
  if (!categoryKey) {
    return null;
  }

  if (signal) {
    return fetchSizeGuideByCategoryKey(categoryKey, signal);
  }

  return getCachedSizeGuideByCategoryKey(categoryKey);
}

/** Client-safe fetch — all guides in one request. */
export async function fetchSizeGuides(signal?: AbortSignal): Promise<NormalizedSizeGuide[]> {
  try {
    const raw = await apiFetch<StrapiSizeGuide[]>(
      `${STRAPI_ENDPOINTS.sizeGuides}?${SIZE_GUIDES_ALL_POPULATE}`,
      { signal },
    );
    return mapSizeGuides(raw);
  } catch {
    return [];
  }
}

/** Server/RSC — all size guides (used where category is unknown). */
export const getSizeGuides = cache(async (signal?: AbortSignal): Promise<NormalizedSizeGuide[]> => {
  return fetchSizeGuides(signal);
});

export type { NormalizedSizeGuide };
