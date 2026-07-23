import type { Product } from "@/features/products/data/products";
import type { NormalizedSizeGuide } from "@/services/size-guide/size-guide.types";

export function getRingSizeLabels(
  product: Product,
  sizeGuide: NormalizedSizeGuide | null | undefined,
  fallbackSizes: readonly string[] = [],
): string[] {
  if (sizeGuide?.sizeLabels?.length) {
    return sizeGuide.sizeLabels;
  }

  const magentoSizes = product.customOptions?.ringSize
    ? Object.keys(product.customOptions.ringSize.valuesByLabel)
    : [];

  if (magentoSizes.length > 0) {
    return magentoSizes;
  }

  return [...fallbackSizes];
}
