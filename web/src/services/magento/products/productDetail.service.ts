import { cache } from "react";
import { magentoGraphqlFetch } from "../graphqlClient";
import { MAGENTO_PRODUCT_BY_URL_KEY_QUERY } from "./productDetail.query";
import { mapMagentoProductDetailToProduct } from "./productDetail.mapper";
import { resolveMoreForYouProducts } from "./moreForYou.service";
import type { MagentoProductByUrlKeyResponse } from "./magentoProduct.types";
import type { Product } from "@/features/products/data/products";
import type { MoreForYouCarouselItem } from "@/features/products/data/moreForYouContent";

export type MagentoProductDetailPageData = {
  product: Product;
  moreForYou: MoreForYouCarouselItem[];
};

export async function fetchMagentoProductDetailPage(
  urlKey: string,
  signal?: AbortSignal,
): Promise<MagentoProductDetailPageData | null> {
  const normalizedUrlKey = urlKey.trim();
  if (!normalizedUrlKey) {
    return null;
  }

  const data = await magentoGraphqlFetch<MagentoProductByUrlKeyResponse>({
    query: MAGENTO_PRODUCT_BY_URL_KEY_QUERY,
    variables: { urlKey: normalizedUrlKey },
    signal,
    cache: "no-store",
  });

  const item = data.products?.items?.[0];
  if (!item) {
    return null;
  }

  const product = mapMagentoProductDetailToProduct(item);
  if (!product) {
    return null;
  }

  const moreForYou = await resolveMoreForYouProducts(item, signal);

  return { product, moreForYou };
}

export async function fetchMagentoProductByUrlKey(
  urlKey: string,
  signal?: AbortSignal,
): Promise<Product | null> {
  const normalizedUrlKey = urlKey.trim();
  if (!normalizedUrlKey) {
    return null;
  }

  const data = await magentoGraphqlFetch<MagentoProductByUrlKeyResponse>({
    query: MAGENTO_PRODUCT_BY_URL_KEY_QUERY,
    variables: { urlKey: normalizedUrlKey },
    signal,
    cache: "no-store",
  });

  const item = data.products?.items?.[0];
  if (!item) {
    return null;
  }

  return mapMagentoProductDetailToProduct(item);
}

export const getMagentoProductByUrlKey = cache((urlKey: string) =>
  fetchMagentoProductByUrlKey(urlKey),
);
