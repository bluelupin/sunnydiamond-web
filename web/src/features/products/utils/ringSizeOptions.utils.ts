import type { Product } from "@/features/products/data/products";
import type { NormalizedSizeGuide } from "@/services/size-guide/size-guide.types";

/**
 * Size dropdown labels for PDP / wishlist.
 * Prefer Strapi size-guide rows for the product category; else Magento
 * custom option values. No hardcoded fallback — categories without a guide
 * or Magento size option (e.g. earrings) must not show Size.
 */
export function getRingSizeLabels(
  product: Product,
  sizeGuide: NormalizedSizeGuide | null | undefined,
): string[] {
  if (sizeGuide?.sizeLabels?.length) {
    return sizeGuide.sizeLabels;
  }

  const magentoSizes = product.customOptions?.ringSize
    ? Object.keys(product.customOptions.ringSize.valuesByLabel)
    : [];

  return magentoSizes;
}
