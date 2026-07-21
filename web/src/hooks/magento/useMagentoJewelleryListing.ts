"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createDefaultFilterState,
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

export function useMagentoJewelleryListing({
  categoryUrlKey,
  sortValue,
  filters,
  pageSize = PAGE_SIZE,
}: UseMagentoJewelleryListingParams): UseMagentoJewelleryListingState {
  const [products, setProducts] = useState<JewelleryListingProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [facets, setFacets] = useState<JewelleryFilterFacets>(EMPTY_JEWELLERY_FILTER_FACETS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const requestIdRef = useRef(0);
  const facetsRef = useRef(facets);

  useEffect(() => {
    facetsRef.current = facets;
  }, [facets]);

  const fetchPage = useCallback(
    async (page: number, append: boolean) => {
      const requestId = ++requestIdRef.current;

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setError(undefined);
      }

      try {
        const data = await getMagentoJewelleryProducts({
          categoryUrlKey,
          page,
          pageSize,
          sortValue,
          filters,
          facets: facetsRef.current,
        });

        if (requestId !== requestIdRef.current) {
          return;
        }

        setProducts((current) => (append ? [...current, ...data.products] : data.products));
        setTotalCount(data.totalCount);
        setFacets(data.facets);
        setCurrentPage(data.currentPage);
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
        }

        setError(message);
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [categoryUrlKey, filters, pageSize, sortValue],
  );

  useEffect(() => {
    setCurrentPage(1);
    void fetchPage(1, false);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (isLoading || isLoadingMore || products.length >= totalCount) {
      return;
    }

    void fetchPage(currentPage + 1, true);
  }, [currentPage, fetchPage, isLoading, isLoadingMore, products.length, totalCount]);

  return {
    products,
    totalCount,
    facets,
    isLoading,
    isLoadingMore,
    error,
    hasMore: products.length < totalCount,
    loadMore,
  };
}
