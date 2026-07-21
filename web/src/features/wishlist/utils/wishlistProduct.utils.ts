import type { JewelleryListingProduct } from "@/features/jewellery-product/types";

export function normalizeWishlistSkus(ids: string[]): string[] {
  const normalized: string[] = [];

  for (const id of ids) {
    const sku = id.trim();
    if (!sku || normalized.includes(sku)) {
      continue;
    }

    normalized.push(sku);
  }

  return normalized;
}

export function orderWishlistProducts(
  skus: string[],
  products: JewelleryListingProduct[],
): JewelleryListingProduct[] {
  if (skus.length === 0) {
    return [];
  }

  const productBySku = new Map(products.map((product) => [product.sku, product]));

  return skus
    .map((sku) => productBySku.get(sku))
    .filter((product): product is JewelleryListingProduct => product != null);
}

export function getWishlistProductHref(
  product: Pick<JewelleryListingProduct, "urlKey">,
): string {
  return `/product/${product.urlKey}`;
}
