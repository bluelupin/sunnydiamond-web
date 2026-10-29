import type { StaticImageData } from "next/image";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import {
  isValidProductCatalogImage,
  resolveProductCatalogImageSrc,
} from "@/features/products/utils/productImagePlaceholder";

export function listingImageUrl(image: string | StaticImageData): string {
  return resolveProductCatalogImageSrc(image);
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

/** Order snapshot thumbnail first, then Magento catalog image by SKU; else product placeholder. */
export function resolveOrderItemImageUrl(
  orderImageUrl: string | null | undefined,
  productSku: string | null | undefined,
  imageBySku?: Record<string, string>,
): string {
  if (isValidProductCatalogImage(orderImageUrl)) {
    return resolveProductCatalogImageSrc(orderImageUrl);
  }

  const sku = productSku?.trim();
  if (sku && imageBySku?.[sku] && isValidProductCatalogImage(imageBySku[sku])) {
    return resolveProductCatalogImageSrc(imageBySku[sku]);
  }

  return resolveProductCatalogImageSrc(null);
}
