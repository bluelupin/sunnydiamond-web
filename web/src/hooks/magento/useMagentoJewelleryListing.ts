"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PAGE_SIZE,
} from "@/features/jewellery-product/data/filters";
import { getMagentoJewelleryProducts } from "@/services/magento/products/products.service";
import { EMPTY_JEWELLERY_FILTER_FACETS } from "@/services/magento/products/products.filters.mapper";
import type { JewelleryFilterState } from "@/features/jewellery-product/types";
import type { JewelleryFilterFacets } from "@/types/magento/jewelleryListing";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";

type UseMagentoJewelleryListingParams = {
  categoryUrlKey?: string | null;
  sortValue: string;
  filters: JewelleryFilterState;
  pageSize?: number;
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

export function useMagentoJewelleryListing({
  categoryUrlKey,
  sortValue,
  filters,
  pageSize = PAGE_SIZE,
}: UseMagentoJewelleryListingParams): UseMagentoJewelleryListingState {
  const [products, setProducts] = useState<JewelleryListingProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [facets, setFacets] = useState<JewelleryFilterFacets>(EMPTY_JEWELLERY_FILTER_FACETS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const requestIdRef = useRef(0);
  const facetsRef = useRef(facets);
  const filtersRef = useRef(filters);
  const currentPageRef = useRef(1);
  const totalPagesRef = useRef(0);
  const isLoadingMoreRef = useRef(false);
  const appliedFiltersKeyRef = useRef(JSON.stringify(filters));

  useEffect(() => {
    facetsRef.current = facets;
  }, [facets]);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchPage = useCallback(
    async (page: number, append: boolean) => {
      const requestId = ++requestIdRef.current;

      if (append) {
        isLoadingMoreRef.current = true;
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setError(undefined);
      }

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
    currentPageRef.current = 1;
    setCurrentPage(1);
    void fetchPage(1, false);
  }, [categoryUrlKey, sortValue, fetchPage]);

  useEffect(() => {
    const nextKey = JSON.stringify(filters);
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
