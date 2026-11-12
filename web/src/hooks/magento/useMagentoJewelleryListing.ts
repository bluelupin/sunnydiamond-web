"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  PAGE_SIZE,
  createEmptyFilterState,
  getExactJewelleryPriceFilter,
  getJewelleryListingFiltersKey,
  hasActiveFilters,
  hasMagentoFilterFacets,
  mergeListingFiltersWithUrlSearchParams,
  parseJewelleryListingSortParam,
  reconcileJewelleryPriceFilterState,
} from "@/features/jewellery-product/data/filters";
import { buildGiftFinderListingFiltersFromUrl } from "@/features/gifting/utils/giftFinderRoutes";
import {
  clearMagentoJewelleryListingCache,
  getMagentoJewelleryInitialListing,
  getMagentoJewelleryProducts,
  seedMagentoJewelleryListingCache,
} from "@/services/magento/products/products.service";
import { sortJewelleryListingProducts } from "@/services/magento/products/products.mapper";
import {
  markJewelleryPlpProductsFetchStart,
  reportJewelleryPlpProductsReady,
} from "@/features/jewellery-product/utils/jewelleryPlpPerformance";
import { EMPTY_JEWELLERY_FILTER_FACETS } from "@/services/magento/products/products.filters.mapper";
import {
  applyPreservedJewelleryListingSearchToFilterState,
  preserveJewelleryListingSearchParams,
  readJewelleryListingUrlParams,
} from "@/features/jewellery-product/utils/jewelleryRoutes";
import type { JewelleryFilterState } from "@/features/jewellery-product/types";
import type { JewelleryFilterFacets, JewelleryListingProductsData } from "@/types/magento/jewelleryListing";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";

export type JewelleryListingPrefetchParams = {
  categoryUrlKey: string | null;
  sortValue: string;
  pageSize: number;
  filters?: JewelleryFilterState;
};

type UseMagentoJewelleryListingParams = {
  categoryUrlKey?: string | null;
  /** Search text for /search; fixed for the hook's lifetime (the page remounts per query). */
  search?: string;
  sortValue: string;
  filters: JewelleryFilterState;
  pageSize?: number;
  initialListing?: JewelleryListingProductsData;
  initialListingParams?: JewelleryListingPrefetchParams;
  /** Increment to force a full listing refetch (e.g. after Clear All). */
  listingResetNonce?: number;
};

const MAX_EMPTY_PAGE_SKIPS = 10;

type UseMagentoJewelleryListingState = {
  products: JewelleryListingProduct[];
  totalCount: number;
  facets: JewelleryFilterFacets;
  isLoading: boolean;
  isSearching: boolean;
  isLoadingMore: boolean;
  error?: string;
  hasMore: boolean;
  loadMore: () => void;
  retryListing: () => void;
};

function appendUniqueProducts(
  current: JewelleryListingProduct[],
  incoming: JewelleryListingProduct[],
): JewelleryListingProduct[] {
  if (incoming.length === 0) {
    return current;
  }

  const seen = new Set(current.map((product) => product.id));
  const uniqueIncoming = incoming.filter((product) => !seen.has(product.id));

  return uniqueIncoming.length > 0 ? [...current, ...uniqueIncoming] : current;
}

function buildListingScopeKey(
  categoryUrlKey: string | null | undefined,
  search: string,
  sortValue: string,
  pageSize: number,
): string {
  return `${categoryUrlKey ?? ""}|${search.trim()}|${sortValue}|${pageSize}`;
}

function buildListingQueryKey(
  categoryUrlKey: string | null | undefined,
  search: string,
  sortValue: string,
  pageSize: number,
  filters: JewelleryFilterState,
  facets: Pick<JewelleryFilterFacets, "minPrice" | "maxPrice">,
): string {
  return `${buildListingScopeKey(categoryUrlKey, search, sortValue, pageSize)}|${getJewelleryListingFiltersKey(filters, facets)}`;
}

/** Matches the filter payload used for Magento listing requests (replaceState-safe URL params). */
function resolveListingFiltersForQuery(
  filters: JewelleryFilterState,
  facets?: JewelleryFilterFacets,
): JewelleryFilterState {
  if (typeof window === "undefined") {
    return applyPreservedJewelleryListingSearchToFilterState(filters, null, facets);
  }

  const preserved = preserveJewelleryListingSearchParams(readJewelleryListingUrlParams());
  if (facets && hasMagentoFilterFacets(facets)) {
    return reconcileJewelleryPriceFilterState(
      mergeListingFiltersWithUrlSearchParams(filters, facets, preserved),
      facets,
    );
  }

  return applyPreservedJewelleryListingSearchToFilterState(filters, preserved, facets);
}

function seedInitialListingPageCaches(
  params: JewelleryListingPrefetchParams,
  listing: JewelleryListingProductsData,
  facets: JewelleryFilterFacets,
): void {
  const pagesToSeed = Math.min(listing.currentPage, Math.ceil(listing.products.length / params.pageSize));

  for (let page = 1; page <= pagesToSeed; page += 1) {
    const start = (page - 1) * params.pageSize;
    const pageProducts = listing.products.slice(start, start + params.pageSize);

    if (pageProducts.length === 0) {
      continue;
    }

    seedMagentoJewelleryListingCache(
      {
        categoryUrlKey: params.categoryUrlKey,
        page,
        pageSize: params.pageSize,
        sortValue: params.sortValue,
        filters: params.filters ?? createEmptyFilterState(),
        facets,
        includeFacets: page === 1,
      },
      {
        products: pageProducts,
        totalCount: listing.totalCount,
        totalPages: listing.totalPages,
        pageSize: listing.pageSize,
        currentPage: page,
        facets,
      },
    );
  }
}

export function createJewelleryListingPrefetchParams(
  categoryUrlKey: string | null,
  options?: {
    collectionSlug?: string | null;
    occasionSlug?: string | null;
    diamondShapeSlug?: string | null;
    fancyColourSlug?: string | null;
    minPrice?: number;
    maxPrice?: number;
    sortSlug?: string | null;
    metalColor?: string | null;
    purity?: string | null;
    gemstone?: string | null;
    subcategory?: string | null;
    facets?: JewelleryFilterFacets;
  },
): JewelleryListingPrefetchParams {
  const filters = buildGiftFinderListingFiltersFromUrl(
    {
      collection: options?.collectionSlug,
      occasion: options?.occasionSlug,
      diamondShape: options?.diamondShapeSlug,
      fancyColour: options?.fancyColourSlug,
      minPrice: options?.minPrice ? String(options.minPrice) : undefined,
      maxPrice: options?.maxPrice ? String(options.maxPrice) : undefined,
      metalColor: options?.metalColor,
      purity: options?.purity,
      gemstone: options?.gemstone,
      subcategory: options?.subcategory,
    },
    options?.facets,
  );

  return {
    categoryUrlKey,
    sortValue: parseJewelleryListingSortParam(options?.sortSlug),
    pageSize: PAGE_SIZE,
    filters,
  };
}

export function useMagentoJewelleryListing({
  categoryUrlKey,
  search = "",
  sortValue,
  filters,
  pageSize = PAGE_SIZE,
  initialListing,
  initialListingParams,
  listingResetNonce = 0,
}: UseMagentoJewelleryListingParams): UseMagentoJewelleryListingState {
  const prefetchedScopeKey = initialListingParams
    ? buildListingScopeKey(
        initialListingParams.categoryUrlKey,
        search,
        initialListingParams.sortValue,
        initialListingParams.pageSize,
      )
    : null;

  const initialListingQueryKey =
    initialListing && initialListingParams
      ? buildListingQueryKey(
          initialListingParams.categoryUrlKey,
          search,
          initialListingParams.sortValue,
          initialListingParams.pageSize,
          initialListingParams.filters ?? createEmptyFilterState(),
          initialListing.facets,
        )
      : null;

  const prefetchedPageSize = initialListingParams?.pageSize ?? initialListing?.pageSize;
  const hasInitialPageSizeMismatch =
    Boolean(initialListing) &&
    prefetchedPageSize != null &&
    prefetchedPageSize !== pageSize;

  const [products, setProducts] = useState<JewelleryListingProduct[]>(
    () => initialListing?.products ?? [],
  );
  const [totalCount, setTotalCount] = useState(() => initialListing?.totalCount ?? 0);
  const [totalPages, setTotalPages] = useState(() => initialListing?.totalPages ?? 0);
  const [facets, setFacets] = useState<JewelleryFilterFacets>(
    () => initialListing?.facets ?? EMPTY_JEWELLERY_FILTER_FACETS,
  );
  const [currentPage, setCurrentPage] = useState(() => initialListing?.currentPage ?? 1);
  const [pendingCount, setPendingCount] = useState(() => initialListing?.pendingProducts?.length ?? 0);
  const [isLoading, setIsLoading] = useState(
    () => !initialListing || hasInitialPageSizeMismatch,
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [resolvedListingQueryKey, setResolvedListingQueryKey] = useState<string | null>(
    () => initialListingQueryKey,
  );
  const [error, setError] = useState<string | undefined>();
  const requestIdRef = useRef(0);
  const facetsRef = useRef(facets);
  const filtersRef = useRef(filters);
  const currentPageRef = useRef(initialListing?.currentPage ?? 1);
  const totalPagesRef = useRef(initialListing?.totalPages ?? 0);
  const pendingProductsRef = useRef<JewelleryListingProduct[]>(
    initialListing?.pendingProducts ? [...initialListing.pendingProducts] : [],
  );
  const isLoadingMoreRef = useRef(false);
  const initialAppliedFiltersKey = getJewelleryListingFiltersKey(
    filters,
    initialListing?.facets ?? EMPTY_JEWELLERY_FILTER_FACETS,
  );
  const appliedFiltersKeyRef = useRef(initialAppliedFiltersKey);
  const [appliedListingFiltersKey, setAppliedListingFiltersKey] = useState(
    () => initialAppliedFiltersKey,
  );
  const inFlightFiltersKeyRef = useRef<string | null>(null);

  const syncAppliedFiltersKey = useCallback((key: string) => {
    appliedFiltersKeyRef.current = key;
    setAppliedListingFiltersKey(key);
  }, []);
  const consumePrefetchedListingRef = useRef(Boolean(initialListing && initialListingParams));
  const seededListingCacheRef = useRef(false);
  const lastListingResetNonceRef = useRef(listingResetNonce);
  const lastListingScopeKeyRef = useRef(
    buildListingScopeKey(categoryUrlKey, search, sortValue, pageSize),
  );
  const lastAppliedServerListingRef = useRef<JewelleryListingProductsData | null>(
    initialListing ?? null,
  );

  useEffect(() => {
    facetsRef.current = facets;
  }, [facets]);

  filtersRef.current = filters;

  useEffect(() => {
    if (seededListingCacheRef.current || !initialListing || !initialListingParams) {
      return;
    }

    seededListingCacheRef.current = true;
    seedInitialListingPageCaches(initialListingParams, initialListing, initialListing.facets);
  }, [initialListing, initialListingParams]);

  const applyInitialListing = useCallback((listing: JewelleryListingProductsData) => {
    setProducts(listing.products);
    setTotalCount(listing.totalCount);
    setTotalPages(listing.totalPages);
    totalPagesRef.current = listing.totalPages;
    setFacets(listing.facets);
    facetsRef.current = listing.facets;
    setCurrentPage(listing.currentPage);
    currentPageRef.current = listing.currentPage;
    pendingProductsRef.current = listing.pendingProducts ? [...listing.pendingProducts] : [];
    setPendingCount(pendingProductsRef.current.length);
  }, []);

  useEffect(() => {
    if (!initialListing || !initialListingParams) {
      return;
    }

    if (lastAppliedServerListingRef.current === initialListing) {
      return;
    }

    const prefetchedScopeKey = buildListingScopeKey(
      initialListingParams.categoryUrlKey,
      search,
      initialListingParams.sortValue,
      initialListingParams.pageSize,
    );
    const currentScopeKey = buildListingScopeKey(categoryUrlKey, search, sortValue, pageSize);

    if (prefetchedScopeKey !== currentScopeKey) {
      return;
    }

    const listingFilters = resolveListingFiltersForQuery(
      initialListingParams.filters ?? createEmptyFilterState(),
      initialListing.facets,
    );

    lastAppliedServerListingRef.current = initialListing;
    requestIdRef.current += 1;
    consumePrefetchedListingRef.current = false;
    filtersRef.current = listingFilters;
    applyInitialListing(initialListing);
    syncAppliedFiltersKey(
      getJewelleryListingFiltersKey(listingFilters, initialListing.facets),
    );
    setResolvedListingQueryKey(
      buildListingQueryKey(
        categoryUrlKey,
        search,
        sortValue,
        pageSize,
        listingFilters,
        initialListing.facets,
      ),
    );
    setIsLoading(false);
    setError(undefined);
  }, [
    applyInitialListing,
    categoryUrlKey,
    initialListing,
    initialListingParams,
    pageSize,
    search,
    sortValue,
    syncAppliedFiltersKey,
  ]);

  const fetchInitialListing = useCallback(async (filtersOverride?: JewelleryFilterState) => {
    const requestId = ++requestIdRef.current;

    setIsLoading(true);
    setError(undefined);
    markJewelleryPlpProductsFetchStart();

    const fetchStartedAt = performance.now();
    const listingFilters = resolveListingFiltersForQuery(
      filtersOverride ?? filtersRef.current,
      facetsRef.current,
    );
    filtersRef.current = listingFilters;

    let listingApplied = false;

    try {
      const { listing } = await getMagentoJewelleryInitialListing({
        categoryUrlKey,
        search,
        pageSize,
        sortValue,
        filters: listingFilters,
        facets: facetsRef.current,
        includeFacets: true,
      });

      if (requestId !== requestIdRef.current) {
        return;
      }

      applyInitialListing(listing);
      listingApplied = true;
      setError(undefined);

      const durationMs = performance.now() - fetchStartedAt;
      reportJewelleryPlpProductsReady({
        source: durationMs < 15 ? "cache" : "network",
        productCount: listing.products.length,
        categoryUrlKey,
        durationMs,
      });
    } catch (fetchError) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      const message =
        fetchError instanceof Error ? fetchError.message : "Failed to load jewellery products";

      setProducts([]);
      setTotalCount(0);
      setTotalPages(0);
      totalPagesRef.current = 0;
      pendingProductsRef.current = [];
      setPendingCount(0);
      setError(message);
    } finally {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setIsLoading(false);

      const attemptedFiltersKey = getJewelleryListingFiltersKey(
        listingFilters,
        facetsRef.current,
      );
      if (inFlightFiltersKeyRef.current === attemptedFiltersKey) {
        inFlightFiltersKeyRef.current = null;
      }

      if (listingApplied) {
        const appliedKey = attemptedFiltersKey;
        syncAppliedFiltersKey(appliedKey);
        setResolvedListingQueryKey(
          buildListingQueryKey(
            categoryUrlKey,
            search,
            sortValue,
            pageSize,
            listingFilters,
            facetsRef.current,
          ),
        );
      }
    }
  }, [applyInitialListing, categoryUrlKey, search, pageSize, sortValue, syncAppliedFiltersKey]);

  useEffect(() => {
    if (listingResetNonce !== lastListingResetNonceRef.current) {
      return;
    }

    const currentScopeKey = buildListingScopeKey(categoryUrlKey, search, sortValue, pageSize);

    if (lastListingScopeKeyRef.current !== currentScopeKey) {
      lastListingScopeKeyRef.current = currentScopeKey;
      syncAppliedFiltersKey("");
    }

    if (
      consumePrefetchedListingRef.current &&
      initialListing &&
      prefetchedScopeKey !== currentScopeKey
    ) {
      consumePrefetchedListingRef.current = false;
    }

    if (
      consumePrefetchedListingRef.current &&
      initialListing &&
      prefetchedScopeKey === currentScopeKey
    ) {
      consumePrefetchedListingRef.current = false;
      const prefetchedFiltersForKey =
        initialListingParams?.filters ?? createEmptyFilterState();
      const prefetchedFiltersKey = getJewelleryListingFiltersKey(
        prefetchedFiltersForKey,
        initialListing.facets,
      );
      const liveFiltersKey = getJewelleryListingFiltersKey(
        filtersRef.current,
        initialListing.facets,
      );
      facetsRef.current = initialListing.facets;

      if (liveFiltersKey === prefetchedFiltersKey) {
        syncAppliedFiltersKey(liveFiltersKey);
        setResolvedListingQueryKey(
          buildListingQueryKey(
            categoryUrlKey,
            search,
            sortValue,
            pageSize,
            filtersRef.current,
            facetsRef.current,
          ),
        );
        return;
      }

      syncAppliedFiltersKey(prefetchedFiltersKey);
    }

    currentPageRef.current = 1;
    setCurrentPage(1);
    pendingProductsRef.current = [];
    setPendingCount(0);
    void fetchInitialListing(filtersRef.current);
  }, [
    categoryUrlKey,
    search,
    sortValue,
    pageSize,
    fetchInitialListing,
    initialListing,
    prefetchedScopeKey,
    listingResetNonce,
    syncAppliedFiltersKey,
  ]);

  useLayoutEffect(() => {
    if (listingResetNonce !== lastListingResetNonceRef.current) {
      return;
    }

    const queryFilters = resolveListingFiltersForQuery(filters, facetsRef.current);
    const nextKey = getJewelleryListingFiltersKey(queryFilters, facetsRef.current);
    if (nextKey === appliedFiltersKeyRef.current) {
      return;
    }

    if (inFlightFiltersKeyRef.current === nextKey) {
      return;
    }

    inFlightFiltersKeyRef.current = nextKey;
    setResolvedListingQueryKey(null);
    currentPageRef.current = 1;
    setCurrentPage(1);
    pendingProductsRef.current = [];
    setPendingCount(0);
    setIsLoading(true);
    void fetchInitialListing(queryFilters);
  }, [filters, fetchInitialListing, listingResetNonce]);

  useEffect(() => {
    if (listingResetNonce === lastListingResetNonceRef.current) {
      return;
    }

    lastListingResetNonceRef.current = listingResetNonce;
    consumePrefetchedListingRef.current = false;
    clearMagentoJewelleryListingCache();
    facetsRef.current = EMPTY_JEWELLERY_FILTER_FACETS;
    syncAppliedFiltersKey(
      getJewelleryListingFiltersKey(filtersRef.current, EMPTY_JEWELLERY_FILTER_FACETS),
    );
    currentPageRef.current = 1;
    setCurrentPage(1);
    pendingProductsRef.current = [];
    setPendingCount(0);
    setProducts([]);
    setTotalCount(0);
    setTotalPages(0);
    totalPagesRef.current = 0;
    void fetchInitialListing();
  }, [listingResetNonce, fetchInitialListing, syncAppliedFiltersKey]);

  const retryListing = useCallback(() => {
    setError(undefined);
    void fetchInitialListing();
  }, [fetchInitialListing]);

  const loadMore = useCallback(() => {
    if (isLoadingMoreRef.current) {
      return;
    }

    const canLoadMorePages = currentPageRef.current < totalPagesRef.current;
    if (!canLoadMorePages && pendingProductsRef.current.length === 0) {
      return;
    }

    const requestId = ++requestIdRef.current;
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    setError(undefined);

    void (async () => {
      try {
        const batch: JewelleryListingProduct[] = [];

        while (batch.length < pageSize && pendingProductsRef.current.length > 0) {
          const nextProduct = pendingProductsRef.current.shift();
          if (nextProduct) {
            batch.push(nextProduct);
          }
        }

        let pageToFetch = currentPageRef.current + 1;

        while (batch.length < pageSize && pageToFetch <= totalPagesRef.current) {
          let fetchedPage = pageToFetch;
          let fetchedProducts: JewelleryListingProduct[] = [];

          do {
            const data = await getMagentoJewelleryProducts({
              categoryUrlKey,
              search,
              page: fetchedPage,
              pageSize,
              sortValue,
              filters: filtersRef.current,
              facets: facetsRef.current,
              includeFacets: false,
            });

            if (requestId !== requestIdRef.current) {
              return;
            }

            fetchedProducts = data.products;
            currentPageRef.current = fetchedPage;
            setCurrentPage(fetchedPage);
            totalPagesRef.current = data.totalPages;
            setTotalPages(data.totalPages);

            if (getExactJewelleryPriceFilter(filtersRef.current, facetsRef.current) == null) {
              setTotalCount(data.totalCount);
            }

            const shouldSkipEmptyPage =
              data.products.length === 0 &&
              fetchedPage < (data.totalPages ?? 0) &&
              fetchedPage - pageToFetch < MAX_EMPTY_PAGE_SKIPS;

            if (!shouldSkipEmptyPage) {
              break;
            }

            fetchedPage += 1;
          } while (fetchedPage <= totalPagesRef.current);

          pageToFetch = fetchedPage + 1;

          for (const product of fetchedProducts) {
            if (batch.length >= pageSize) {
              pendingProductsRef.current.push(product);
              continue;
            }

            batch.push(product);
          }

          if (fetchedProducts.length === 0) {
            break;
          }
        }

        if (requestId !== requestIdRef.current) {
          return;
        }

        setPendingCount(pendingProductsRef.current.length);

        if (batch.length > 0) {
          setProducts((current) => {
            const merged = appendUniqueProducts(current, batch);
            const next = sortJewelleryListingProducts(merged, sortValue);
            if (getExactJewelleryPriceFilter(filtersRef.current, facetsRef.current) != null) {
              setTotalCount(next.length + pendingProductsRef.current.length);
            }
            return next;
          });
        }
      } catch (fetchError) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        const message =
          fetchError instanceof Error ? fetchError.message : "Failed to load jewellery products";
        setError(message);
      } finally {
        if (requestId === requestIdRef.current) {
          isLoadingMoreRef.current = false;
          setIsLoadingMore(false);
        }
      }
    })();
  }, [categoryUrlKey, search, pageSize, sortValue]);

  const hasMore =
    pendingCount > 0 ||
    (totalPages > 0 ? currentPage < totalPages : products.length < totalCount);

  const listingQueryKey = useMemo(
    () =>
      buildListingQueryKey(
        categoryUrlKey,
        search,
        sortValue,
        pageSize,
        resolveListingFiltersForQuery(filters, facets),
        facets,
      ),
    [categoryUrlKey, search, sortValue, pageSize, filters, facets],
  );

  const liveListingFiltersKey = useMemo(
    () =>
      getJewelleryListingFiltersKey(
        resolveListingFiltersForQuery(filters, facets),
        facets,
      ),
    [filters, facets],
  );

  useEffect(() => {
    if (
      isLoading ||
      resolvedListingQueryKey == null ||
      liveListingFiltersKey !== appliedListingFiltersKey
    ) {
      return;
    }

    if (listingQueryKey !== resolvedListingQueryKey) {
      setResolvedListingQueryKey(listingQueryKey);
    }
  }, [
    appliedListingFiltersKey,
    isLoading,
    liveListingFiltersKey,
    listingQueryKey,
    resolvedListingQueryKey,
  ]);

  const isSearching =
    isLoading ||
    resolvedListingQueryKey == null ||
    listingQueryKey !== resolvedListingQueryKey ||
    liveListingFiltersKey !== appliedListingFiltersKey;

  const displayProducts = useMemo(
    () => sortJewelleryListingProducts(products, sortValue),
    [products, sortValue],
  );

  return {
    products: displayProducts,
    totalCount,
    facets,
    isLoading,
    isSearching,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    retryListing,
  };
}
