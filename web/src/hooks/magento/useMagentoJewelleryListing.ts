"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PAGE_SIZE,
  createEmptyFilterState,
  getJewelleryListingFiltersKey,
  DEFAULT_JEWELLERY_LISTING_SORT,
} from "@/features/jewellery-product/data/filters";
import {
  getMagentoJewelleryProducts,
  seedMagentoJewelleryListingCache,
} from "@/services/magento/products/products.service";
import {
  markJewelleryPlpProductsFetchStart,
  reportJewelleryPlpProductsReady,
} from "@/features/jewellery-product/utils/jewelleryPlpPerformance";
import { EMPTY_JEWELLERY_FILTER_FACETS } from "@/services/magento/products/products.filters.mapper";
import type { JewelleryFilterState } from "@/features/jewellery-product/types";
import type { JewelleryFilterFacets, JewelleryListingProductsData } from "@/types/magento/jewelleryListing";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";

export type JewelleryListingPrefetchParams = {
  categoryUrlKey: string | null;
  sortValue: string;
  pageSize: number;
};

type UseMagentoJewelleryListingParams = {
  categoryUrlKey?: string | null;
  sortValue: string;
  filters: JewelleryFilterState;
  pageSize?: number;
  initialListing?: JewelleryListingProductsData;
  initialListingParams?: JewelleryListingPrefetchParams;
};

const MAX_EMPTY_PAGE_SKIPS = 10;

type UseMagentoJewelleryListingState = {
  products: JewelleryListingProduct[];
  totalCount: number;
  facets: JewelleryFilterFacets;
  isLoading: boolean;
  isLoadingMore: boolean;
  error?: string;
  hasMore: boolean;
  loadMore: () => void;
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
  sortValue: string,
  pageSize: number,
): string {
  return `${categoryUrlKey ?? ""}|${sortValue}|${pageSize}`;
}

export function createJewelleryListingPrefetchParams(
  categoryUrlKey: string | null,
): JewelleryListingPrefetchParams {
  return {
    categoryUrlKey,
    sortValue: DEFAULT_JEWELLERY_LISTING_SORT,
    pageSize: PAGE_SIZE,
  };
}

export function useMagentoJewelleryListing({
  categoryUrlKey,
  sortValue,
  filters,
  pageSize = PAGE_SIZE,
  initialListing,
  initialListingParams,
}: UseMagentoJewelleryListingParams): UseMagentoJewelleryListingState {
  const prefetchedScopeKey = initialListingParams
    ? buildListingScopeKey(
        initialListingParams.categoryUrlKey,
        initialListingParams.sortValue,
        initialListingParams.pageSize,
      )
    : null;

  const [products, setProducts] = useState<JewelleryListingProduct[]>(
    () => initialListing?.products ?? [],
  );
  const [totalCount, setTotalCount] = useState(() => initialListing?.totalCount ?? 0);
  const [totalPages, setTotalPages] = useState(() => initialListing?.totalPages ?? 0);
  const [facets, setFacets] = useState<JewelleryFilterFacets>(
    () => initialListing?.facets ?? EMPTY_JEWELLERY_FILTER_FACETS,
  );
  const [currentPage, setCurrentPage] = useState(() => initialListing?.currentPage ?? 1);
  const [isLoading, setIsLoading] = useState(() => !initialListing);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const requestIdRef = useRef(0);
  const facetsRef = useRef(facets);
  const filtersRef = useRef(filters);
  const currentPageRef = useRef(initialListing?.currentPage ?? 1);
  const totalPagesRef = useRef(initialListing?.totalPages ?? 0);
  const isLoadingMoreRef = useRef(false);
  const appliedFiltersKeyRef = useRef(
    getJewelleryListingFiltersKey(
      filters,
      initialListing?.facets ?? EMPTY_JEWELLERY_FILTER_FACETS,
    ),
  );
  const consumePrefetchedListingRef = useRef(Boolean(initialListing && initialListingParams));
  const seededListingCacheRef = useRef(false);

  useEffect(() => {
    facetsRef.current = facets;
  }, [facets]);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    if (seededListingCacheRef.current || !initialListing || !initialListingParams) {
      return;
    }

    seededListingCacheRef.current = true;
    seedMagentoJewelleryListingCache(
      {
        categoryUrlKey: initialListingParams.categoryUrlKey,
        page: 1,
        pageSize: initialListingParams.pageSize,
        sortValue: initialListingParams.sortValue,
        filters: createEmptyFilterState(),
        facets: initialListing.facets,
        includeFacets: true,
      },
      initialListing,
    );
  }, [initialListing, initialListingParams]);

  const fetchPage = useCallback(
    async (page: number, append: boolean) => {
      const requestId = ++requestIdRef.current;

      if (append) {
        isLoadingMoreRef.current = true;
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setError(undefined);
        markJewelleryPlpProductsFetchStart();
      }

      const fetchStartedAt = !append ? performance.now() : 0;

      try {
        let pageToFetch = page;
        let appendedProducts: JewelleryListingProduct[] = [];
        let data: Awaited<ReturnType<typeof getMagentoJewelleryProducts>> | undefined;

        do {
          data = await getMagentoJewelleryProducts({
            categoryUrlKey,
            page: pageToFetch,
            pageSize,
            sortValue,
            filters: filtersRef.current,
            facets: facetsRef.current,
            includeFacets: !append,
          });

          if (requestId !== requestIdRef.current) {
            return;
          }

          if (!append) {
            break;
          }

          appendedProducts.push(...data.products);

          const shouldSkipEmptyPage =
            data.products.length === 0 &&
            pageToFetch < (data.totalPages ?? 0) &&
            pageToFetch - page < MAX_EMPTY_PAGE_SKIPS;

          if (!shouldSkipEmptyPage) {
            break;
          }

          pageToFetch += 1;
        } while (append);

        if (!data || requestId !== requestIdRef.current) {
          return;
        }

        if (append) {
          setProducts((current) => appendUniqueProducts(current, appendedProducts));
        } else {
          setProducts(data.products);
        }

        setTotalCount(data.totalCount);

        setTotalPages(data.totalPages);
        totalPagesRef.current = data.totalPages;

        if (!append) {
          setFacets(data.facets);
        }

        const resolvedPage = append ? pageToFetch : data.currentPage;
        setCurrentPage(resolvedPage);
        currentPageRef.current = resolvedPage;
        setError(undefined);

        if (!append) {
          const durationMs = performance.now() - fetchStartedAt;
          reportJewelleryPlpProductsReady({
            source: durationMs < 15 ? "cache" : "network",
            productCount: data.products.length,
            categoryUrlKey,
            durationMs,
          });
        }
      } catch (fetchError) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        const message =
          fetchError instanceof Error ? fetchError.message : "Failed to load jewellery products";

        if (!append) {
          setProducts([]);
          setTotalCount(0);
          setTotalPages(0);
          totalPagesRef.current = 0;
        }

        setError(message);
      } finally {
        if (append) {
          isLoadingMoreRef.current = false;
          setIsLoadingMore(false);
        } else if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [categoryUrlKey, pageSize, sortValue],
  );

  useEffect(() => {
    const currentScopeKey = buildListingScopeKey(categoryUrlKey, sortValue, pageSize);

    if (
      consumePrefetchedListingRef.current &&
      initialListing &&
      prefetchedScopeKey === currentScopeKey
    ) {
      consumePrefetchedListingRef.current = false;
      // Prefetch is always empty-filter; only skip the network fetch when the
      // live filter state is also empty. URL filters (occasion/shape/colour)
      // must still trigger a filtered request.
      const emptyFiltersKey = getJewelleryListingFiltersKey(
        createEmptyFilterState(),
        initialListing.facets,
      );
      const liveFiltersKey = getJewelleryListingFiltersKey(
        filtersRef.current,
        initialListing.facets,
      );
      facetsRef.current = initialListing.facets;

      if (liveFiltersKey === emptyFiltersKey) {
        appliedFiltersKeyRef.current = liveFiltersKey;
        return;
      }

      appliedFiltersKeyRef.current = emptyFiltersKey;
    }

    currentPageRef.current = 1;
    setCurrentPage(1);
    void fetchPage(1, false);
  }, [categoryUrlKey, sortValue, pageSize, fetchPage, initialListing, prefetchedScopeKey]);

  useEffect(() => {
    const nextKey = getJewelleryListingFiltersKey(filters, facetsRef.current);
    if (nextKey === appliedFiltersKeyRef.current) {
      return;
    }

    appliedFiltersKeyRef.current = nextKey;
    currentPageRef.current = 1;
    setCurrentPage(1);
    void fetchPage(1, false);
  }, [filters, fetchPage]);

  const loadMore = useCallback(() => {
    if (isLoadingMoreRef.current) {
      return;
    }

    if (currentPageRef.current >= totalPagesRef.current) {
      return;
    }

    const nextPage = currentPageRef.current + 1;
    void fetchPage(nextPage, true);
  }, [fetchPage]);

  const hasMore = totalPages > 0
    ? currentPage < totalPages
    : products.length < totalCount;

  return {
    products,
    totalCount,
    facets,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
  };
}
