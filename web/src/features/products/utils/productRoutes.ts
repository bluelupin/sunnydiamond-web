import type { Product } from "@/features/products/data/products";

export function getProductHref(product: Pick<Product, "urlKey" | "id">): string {
  return `/product/${product.urlKey || product.id}`;
}

export function getProductEditHref(
  product: Pick<Product, "urlKey" | "id">,
  lineItemId: string,
): string {
  return `${getProductHref(product)}?editLine=${encodeURIComponent(lineItemId)}`;
}
