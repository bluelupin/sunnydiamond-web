"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getMagentoProductsBySkus } from "@/services/magento/products/products.service";
import { MAGENTO_WISHLIST_REVALIDATE_SECONDS } from "@/services/magento/config";
import { orderWishlistProducts } from "@/features/wishlist/utils/wishlistProduct.utils";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";

type UseMagentoWishlistProductsState = {
  products: JewelleryListingProduct[];
  isLoading: boolean;
  error?: string;
};

function hasSameSkuSet(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  const rightSet = new Set(right);
  return left.every((sku) => rightSet.has(sku));
}

export function useMagentoWishlistProducts(
  wishlistedSkus: string[],
  refreshWhileOpen = false,
): UseMagentoWishlistProductsState {
  const [products, setProducts] = useState<JewelleryListingProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const requestIdRef = useRef(0);
  const previousSkusRef = useRef<string[]>([]);
  const productsRef = useRef<JewelleryListingProduct[]>([]);

  productsRef.current = products;

  const skuKey = useMemo(
    () =>
      Array.from(new Set(wishlistedSkus.map((sku) => sku.trim()).filter(Boolean))).join("|"),
    [wishlistedSkus],
  );

  useEffect(() => {
    const skus = skuKey ? skuKey.split("|") : [];
    const requestId = ++requestIdRef.current;
    const previousSkus = previousSkusRef.current;

    if (skus.length === 0) {
      setProducts([]);
      setIsLoading(false);
      setError(undefined);
      previousSkusRef.current = [];
      return;
    }

    if (hasSameSkuSet(skus, previousSkus)) {
      return;
    }

    const previousSkuSet = new Set(previousSkus);
    const isRemovalOnly =
      skus.length < previousSkus.length && skus.every((sku) => previousSkuSet.has(sku));

    if (isRemovalOnly) {
      const skuSet = new Set(skus);
      setProducts((current) =>
        orderWishlistProducts(
          skus,
          current.filter((product) => skuSet.has(product.sku)),
        ),
      );
      previousSkusRef.current = skus;
      return;
    }

    const addedSkus = skus.filter((sku) => !previousSkuSet.has(sku));
    const shouldFetchDelta = addedSkus.length > 0 && productsRef.current.length > 0;

    if (shouldFetchDelta) {
      const controller = new AbortController();

      void getMagentoProductsBySkus(addedSkus, controller.signal)
        .then((fetchedProducts) => {
          if (requestId !== requestIdRef.current) {
            return;
          }

          const skuSet = new Set(skus);
          const existingProducts = productsRef.current.filter(
            (product) => skuSet.has(product.sku) && !addedSkus.includes(product.sku),
          );

          setProducts(orderWishlistProducts(skus, [...existingProducts, ...fetchedProducts]));
          setError(undefined);
          previousSkusRef.current = skus;
        })
        .catch((fetchError) => {
          if (requestId !== requestIdRef.current || controller.signal.aborted) {
            return;
          }

          const message =
            fetchError instanceof Error ? fetchError.message : "Failed to load wishlist products";
          setError(message);
        });

      return () => {
        controller.abort();
      };
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(undefined);

    void getMagentoProductsBySkus(skus, controller.signal)
      .then((fetchedProducts) => {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setProducts(orderWishlistProducts(skus, fetchedProducts));
        setError(undefined);
        previousSkusRef.current = skus;
      })
      .catch((fetchError) => {
        if (requestId !== requestIdRef.current || controller.signal.aborted) {
          return;
        }

        const message =
          fetchError instanceof Error ? fetchError.message : "Failed to load wishlist products";
        setProducts([]);
        setError(message);
      })
      .finally(() => {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [skuKey]);

  useEffect(() => {
    if (!skuKey || !refreshWhileOpen) return;

    const skus = skuKey.split("|");
    const refreshMs = MAGENTO_WISHLIST_REVALIDATE_SECONDS * 1000;
    let lastRefreshAt = Date.now();
    let controller: AbortController | null = null;
    let cancelled = false;

    const refreshPrices = () => {
      if (
        cancelled ||
        document.visibilityState !== "visible" ||
        controller ||
        Date.now() - lastRefreshAt < refreshMs ||
        !hasSameSkuSet(skus, previousSkusRef.current)
      ) return;

      lastRefreshAt = Date.now();
      const activeController = new AbortController();
      controller = activeController;
      const requestId = requestIdRef.current;

      void getMagentoProductsBySkus(skus, activeController.signal)
        .then((fetchedProducts) => {
          if (cancelled || requestId !== requestIdRef.current) return;
          setProducts(orderWishlistProducts(skus, fetchedProducts));
          setError(undefined);
        })
        .catch(() => {
          // Keep already loaded cards visible if a background refresh fails.
        })
        .finally(() => {
          if (controller === activeController) controller = null;
        });
    };

    const interval = window.setInterval(refreshPrices, refreshMs);
    document.addEventListener("visibilitychange", refreshPrices);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshPrices);
      controller?.abort();
    };
  }, [skuKey, refreshWhileOpen]);

  const skus = skuKey ? skuKey.split("|") : [];
  const awaitingInitialProductFetch =
    skus.length > 0 &&
    products.length === 0 &&
    !error &&
    !hasSameSkuSet(skus, previousSkusRef.current);

  return {
    products,
    isLoading: isLoading || awaitingInitialProductFetch,
    error,
  };
}
