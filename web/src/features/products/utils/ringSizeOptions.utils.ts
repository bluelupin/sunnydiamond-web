import type { Product } from "@/features/products/data/products";
import type { NormalizedSizeGuide } from "@/services/size-guide/size-guide.types";
import { getCustomOptionDisplayLabels } from "@/services/magento/products/productCustomOptions.mapper";

/**
 * Size dropdown labels for PDP / wishlist.
 * Prefer Magento custom-option titles when present so selected values resolve to
 * cart UIDs. Fall back to Strapi size-guide labels for display-only categories.
 */
export function getRingSizeLabels(
  product: Product,
  sizeGuide: NormalizedSizeGuide | null | undefined,
): string[] {
  const magentoLabels = getCustomOptionDisplayLabels(product.customOptions?.ringSize);

  if (magentoLabels.length > 0) {
    return magentoLabels;
  }

  return sizeGuide?.sizeLabels ?? [];
}
