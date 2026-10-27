import type { JewelleryListingProduct } from "@/features/jewellery-product/types";

/** Small HTML link set; the full product snapshot still seeds the interactive carousel. */
export function getTrendingProductLinks(products: readonly JewelleryListingProduct[]) {
  return products
    .filter((product) => product.urlKey?.trim() && product.name?.trim())
    .slice(0, 8)
    .map((product) => ({
      href: `/product/${encodeURIComponent(product.urlKey)}`,
      label: product.name,
    }));
}
