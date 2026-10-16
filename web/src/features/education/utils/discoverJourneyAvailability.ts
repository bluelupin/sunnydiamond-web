import { buildGiftFinderListingFiltersFromUrl } from "@/features/gifting/utils/giftFinderRoutes";
import { createEmptyFilterState } from "@/features/jewellery-product/data/filters";
import { getMagentoJewelleryProducts } from "@/services/magento/products/products.service";
import type { JewelleryFilterFacets } from "@/types/magento/jewelleryListing";

export type DiscoverJourneyPriceRange = {
  minPrice: number;
  maxPrice: number;
};

/** Align with PLP client listing cache — facets are stable for the panel session. */
const DISCOVER_JOURNEY_FACET_CACHE_TTL_MS = 60_000;

type DiscoverJourneyFacetCacheEntry = {
  facets: JewelleryFilterFacets;
  fetchedAt: number;
};

const discoverJourneyListingFacetCache = new Map<string, DiscoverJourneyFacetCacheEntry>();
const discoverJourneyListingFacetsInFlight = new Map<string, Promise<JewelleryFilterFacets>>();

function discoverJourneyFacetScopeKey(categoryUrlKey: string | null): string {
  return categoryUrlKey ?? "all";
}

export function isDiscoverJourneyAbortError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === "AbortError") {
    return true;
  }

  return error instanceof Error && error.name === "AbortError";
}

export function clearDiscoverJourneyListingFacetCache(): void {
  discoverJourneyListingFacetCache.clear();
  discoverJourneyListingFacetsInFlight.clear();
}

export function peekDiscoverJourneyListingFacets(
  categoryUrlKey: string | null,
): JewelleryFilterFacets | null {
  const entry = discoverJourneyListingFacetCache.get(
    discoverJourneyFacetScopeKey(categoryUrlKey),
  );

  if (!entry) {
    return null;
  }

  if (Date.now() - entry.fetchedAt > DISCOVER_JOURNEY_FACET_CACHE_TTL_MS) {
    discoverJourneyListingFacetCache.delete(discoverJourneyFacetScopeKey(categoryUrlKey));
    return null;
  }

  return entry.facets;
}

/** Seeds the session cache (e.g. after step-1 global facet load). */
export function primeDiscoverJourneyListingFacetCache(
  categoryUrlKey: string | null,
  facets: JewelleryFilterFacets,
): void {
  discoverJourneyListingFacetCache.set(discoverJourneyFacetScopeKey(categoryUrlKey), {
    facets,
    fetchedAt: Date.now(),
  });
}

async function fetchDiscoverJourneyListingFacetsFromNetwork(
  categoryUrlKey: string | null,
  signal?: AbortSignal,
): Promise<JewelleryFilterFacets> {
  const data = await getMagentoJewelleryProducts({
    categoryUrlKey,
    page: 1,
    pageSize: 1,
    filters: createEmptyFilterState(),
    includeFacets: true,
    signal,
  });

  return data.facets;
}

/** Category-scoped (or all-jewellery) price bounds — matches PLP prefetch clamping. */
export async function getDiscoverJourneyListingFacets(
  categoryUrlKey: string | null,
  signal?: AbortSignal,
): Promise<JewelleryFilterFacets> {
  const cached = peekDiscoverJourneyListingFacets(categoryUrlKey);
  if (cached) {
    return cached;
  }

  const scopeKey = discoverJourneyFacetScopeKey(categoryUrlKey);
  const inFlight = discoverJourneyListingFacetsInFlight.get(scopeKey);
  if (inFlight) {
    return inFlight;
  }

  const fetchPromise = fetchDiscoverJourneyListingFacetsFromNetwork(categoryUrlKey, signal)
    .then((facets) => {
      primeDiscoverJourneyListingFacetCache(categoryUrlKey, facets);
      discoverJourneyListingFacetsInFlight.delete(scopeKey);
      return facets;
    })
    .catch((error) => {
      discoverJourneyListingFacetsInFlight.delete(scopeKey);
      throw error;
    });

  discoverJourneyListingFacetsInFlight.set(scopeKey, fetchPromise);
  return fetchPromise;
}

/** Warms facet cache for step-2 category tiles (deduped in-flight per scope). */
export function prefetchDiscoverJourneyCategoryFacets(
  categoryUrlKeys: readonly (string | null)[],
  signal?: AbortSignal,
): void {
  const seen = new Set<string>();

  for (const categoryUrlKey of categoryUrlKeys) {
    const scopeKey = discoverJourneyFacetScopeKey(categoryUrlKey);
    if (seen.has(scopeKey)) {
      continue;
    }
    seen.add(scopeKey);

    if (peekDiscoverJourneyListingFacets(categoryUrlKey)) {
      continue;
    }

    void getDiscoverJourneyListingFacets(categoryUrlKey, signal).catch((error) => {
      if (isDiscoverJourneyAbortError(error)) {
        return;
      }
    });
  }
}

export function buildDiscoverJourneyListingFilters(
  range: DiscoverJourneyPriceRange,
  diamondShapeSlug: string,
  listingFacets: Pick<JewelleryFilterFacets, "minPrice" | "maxPrice">,
) {
  const minRounded = Math.round(range.minPrice);
  const maxRounded = Math.round(range.maxPrice);

  return buildGiftFinderListingFiltersFromUrl(
    {
      minPrice: minRounded > 0 ? String(minRounded) : null,
      maxPrice: maxRounded > 0 ? String(maxRounded) : null,
      diamondShape: diamondShapeSlug.trim() || null,
    },
    listingFacets,
  );
}

/**
 * Availability check aligned with jewellery PLP (category facets, URL-style price clamp,
 * diamond shape slug + Magento attribute resolution).
 */
export async function discoverJourneyHasMatchingProducts({
  categoryUrlKey,
  range,
  diamondShapeSlug = "",
  listingFacets,
  signal,
}: {
  categoryUrlKey: string | null;
  range: DiscoverJourneyPriceRange;
  diamondShapeSlug?: string;
  listingFacets?: JewelleryFilterFacets;
  signal?: AbortSignal;
}): Promise<{ hasProducts: boolean; listingFacets: JewelleryFilterFacets }> {
  const scopedFacets =
    listingFacets ??
    (await getDiscoverJourneyListingFacets(categoryUrlKey, signal));

  if (listingFacets) {
    primeDiscoverJourneyListingFacetCache(categoryUrlKey, listingFacets);
  }

  const filters = buildDiscoverJourneyListingFilters(range, diamondShapeSlug, scopedFacets);

  const data = await getMagentoJewelleryProducts({
    categoryUrlKey,
    page: 1,
    pageSize: 1,
    filters,
    facets: scopedFacets,
    includeFacets: false,
    signal,
  });

  return {
    hasProducts: data.totalCount > 0,
    listingFacets: scopedFacets,
  };
}
