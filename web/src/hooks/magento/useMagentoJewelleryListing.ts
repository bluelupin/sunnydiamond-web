"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PAGE_SIZE,
  createEmptyFilterState,
  getExactJewelleryPriceFilter,
  getJewelleryListingFiltersKey,
  DEFAULT_JEWELLERY_LISTING_SORT,
} from "@/features/jewellery-product/data/filters";
import {
  getMagentoJewelleryInitialListing,
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
        filters: createEmptyFilterState(),
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
  const [pendingCount, setPendingCount] = useState(() => initialListing?.pendingProducts?.length ?? 0);
  const [isLoading, setIsLoading] = useState(() => !initialListing);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
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
    seedInitialListingPageCaches(initialListingParams, initialListing, initialListing.facets);
  }, [initialListing, initialListingParams]);

  const applyInitialListing = useCallback((listing: JewelleryListingProductsData) => {
    setProducts(listing.products);
    const exactPrice = getExactJewelleryPriceFilter(filtersRef.current, listing.facets);
    setTotalCount(
      exactPrice != null
        ? listing.products.length + (listing.pendingProducts?.length ?? 0)
        : listing.totalCount,
    );
    setTotalPages(listing.totalPages);
    totalPagesRef.current = listing.totalPages;
    setFacets(listing.facets);
    facetsRef.current = listing.facets;
    setCurrentPage(listing.currentPage);
    currentPageRef.current = listing.currentPage;
    pendingProductsRef.current = listing.pendingProducts ? [...listing.pendingProducts] : [];
    setPendingCount(pendingProductsRef.current.length);
  }, []);

  const fetchInitialListing = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    setIsLoading(true);
    setError(undefined);
    markJewelleryPlpProductsFetchStart();

    const fetchStartedAt = performance.now();

    try {
      const { listing } = await getMagentoJewelleryInitialListing({
        categoryUrlKey,
        pageSize,
        sortValue,
        filters: filtersRef.current,
        facets: facetsRef.current,
        includeFacets: true,
      });

      if (requestId !== requestIdRef.current) {
        return;
      }

      applyInitialListing(listing);
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
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [applyInitialListing, categoryUrlKey, pageSize, sortValue]);

  useEffect(() => {
    const currentScopeKey = buildListingScopeKey(categoryUrlKey, sortValue, pageSize);

    if (
      consumePrefetchedListingRef.current &&
      initialListing &&
      prefetchedScopeKey === currentScopeKey
    ) {
      consumePrefetchedListingRef.current = false;
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
    pendingProductsRef.current = [];
    setPendingCount(0);
    void fetchInitialListing();
  }, [categoryUrlKey, sortValue, pageSize, fetchInitialListing, initialListing, prefetchedScopeKey]);

  useEffect(() => {
    const nextKey = getJewelleryListingFiltersKey(filters, facetsRef.current);
    if (nextKey === appliedFiltersKeyRef.current) {
      return;
    }

    appliedFiltersKeyRef.current = nextKey;
    currentPageRef.current = 1;
    setCurrentPage(1);
    pendingProductsRef.current = [];
    setPendingCount(0);
    void fetchInitialListing();
  }, [filters, fetchInitialListing]);

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
            const next = appendUniqueProducts(current, batch);
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
  }, [categoryUrlKey, pageSize, sortValue]);

  const hasMore =
    pendingCount > 0 ||
    (totalPages > 0 ? currentPage < totalPages : products.length < totalCount);

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
