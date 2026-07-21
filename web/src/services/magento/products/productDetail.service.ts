import { cache } from "react";
import { magentoGraphqlFetch } from "../graphqlClient";
import { MAGENTO_PRODUCT_BY_URL_KEY_QUERY } from "./productDetail.query";
import { mapMagentoProductDetailToProduct } from "./productDetail.mapper";
import type { MagentoProductByUrlKeyResponse } from "./magentoProduct.types";
import type { Product } from "@/features/products/data/products";

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
