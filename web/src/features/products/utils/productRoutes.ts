import type { Product } from "@/features/products/data/products";

export function getProductHref(
  product: Pick<Product, "urlKey" | "id">,
  options?: { purity?: string | null },
): string {
  const path = `/product/${product.urlKey || product.id}`;
  const purity = options?.purity?.trim();
  if (!purity) {
    return path;
  }

  return `${path}?purity=${encodeURIComponent(purity)}`;
}

export function getProductEditHref(
  product: Pick<Product, "urlKey" | "id">,
  lineItemId: string,
): string {
  return `${getProductHref(product)}?editLine=${encodeURIComponent(lineItemId)}`;
}
