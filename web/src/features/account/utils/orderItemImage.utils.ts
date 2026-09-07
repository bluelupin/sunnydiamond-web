import type { StaticImageData } from "next/image";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";

export function listingImageUrl(image: string | StaticImageData): string {
  return typeof image === "string" ? image : image.src;
}

export function buildMagentoProductImageBySku(
  products: JewelleryListingProduct[],
): Record<string, string> {
  const images: Record<string, string> = {};

  for (const product of products) {
    const sku = product.sku?.trim();
    if (!sku) {
      continue;
    }

    images[sku] = listingImageUrl(product.primaryImage);
  }

  return images;
}

/** Order snapshot thumbnail first, then Magento catalog image by SKU (same source as PLP). */
export function resolveOrderItemImageUrl(
  orderImageUrl: string | null | undefined,
  productSku: string | null | undefined,
  imageBySku?: Record<string, string>,
): string | null {
  const fromOrder = orderImageUrl?.trim();
  if (fromOrder) {
    return fromOrder;
  }

  const sku = productSku?.trim();
  if (!sku || !imageBySku) {
    return null;
  }

  return imageBySku[sku]?.trim() || null;
}
