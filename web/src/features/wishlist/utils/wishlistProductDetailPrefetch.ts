import type { Product } from "@/features/products/data/products";
import { fetchMagentoProductByUrlKey } from "@/services/magento/products/productDetail.service";

const resolvedProductCache = new Map<string, Product | null>();
const inflightProductRequests = new Map<string, Promise<Product | null>>();

function normalizeUrlKey(urlKey: string): string {
  return urlKey.trim();
}

function loadWishlistProductDetail(urlKey: string): Promise<Product | null> {
  const normalizedUrlKey = normalizeUrlKey(urlKey);
  if (!normalizedUrlKey) {
    return Promise.resolve(null);
  }

  if (resolvedProductCache.has(normalizedUrlKey)) {
    return Promise.resolve(resolvedProductCache.get(normalizedUrlKey) ?? null);
  }

  const inflight = inflightProductRequests.get(normalizedUrlKey);
  if (inflight) {
    return inflight;
  }

  const request = fetchMagentoProductByUrlKey(normalizedUrlKey)
    .then((product) => {
      resolvedProductCache.set(normalizedUrlKey, product);
      return product;
    })
    .finally(() => {
      inflightProductRequests.delete(normalizedUrlKey);
    });

  inflightProductRequests.set(normalizedUrlKey, request);
  return request;
}

export function getCachedWishlistProductDetail(urlKey: string): Product | null | undefined {
  const normalizedUrlKey = normalizeUrlKey(urlKey);
  if (!normalizedUrlKey || !resolvedProductCache.has(normalizedUrlKey)) {
    return undefined;
  }

  return resolvedProductCache.get(normalizedUrlKey) ?? null;
}

export function prefetchWishlistProductDetail(urlKey: string): void {
  void loadWishlistProductDetail(urlKey);
}

export function fetchWishlistProductDetail(
  urlKey: string,
  signal?: AbortSignal,
): Promise<Product | null> {
  const normalizedUrlKey = normalizeUrlKey(urlKey);
  if (!normalizedUrlKey) {
    return Promise.resolve(null);
  }

  const cached = getCachedWishlistProductDetail(normalizedUrlKey);
  if (cached !== undefined) {
    return Promise.resolve(cached);
  }

  if (signal) {
    return fetchMagentoProductByUrlKey(normalizedUrlKey, signal);
  }

  return loadWishlistProductDetail(normalizedUrlKey);
}
