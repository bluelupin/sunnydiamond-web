"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getMagentoProductsBySkus } from "@/services/magento/products/products.service";
import { orderWishlistProducts } from "@/features/wishlist/utils/wishlistProduct.utils";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";

type UseMagentoWishlistProductsState = {
  products: JewelleryListingProduct[];
  isLoading: boolean;
  error?: string;
};

export function useMagentoWishlistProducts(wishlistedSkus: string[]): UseMagentoWishlistProductsState {
  const [products, setProducts] = useState<JewelleryListingProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const requestIdRef = useRef(0);

  const skuKey = useMemo(
    () =>
      Array.from(new Set(wishlistedSkus.map((sku) => sku.trim()).filter(Boolean))).join("|"),
    [wishlistedSkus],
  );

  useEffect(() => {
    const skus = skuKey ? skuKey.split("|") : [];
    const requestId = ++requestIdRef.current;

    if (skus.length === 0) {
      setProducts([]);
      setIsLoading(false);
      setError(undefined);
      return;
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

  return { products, isLoading, error };
}
