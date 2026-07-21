import type { Product } from "@/features/products/data/products";

export function getProductHref(product: Pick<Product, "urlKey" | "id">): string {
  return `/product/${product.urlKey || product.id}`;
}
