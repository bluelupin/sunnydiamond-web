import type { Product } from "@/features/products/data/products";
import type { NormalizedSizeGuide } from "@/services/size-guide/size-guide.types";
import { findConfigurableVariantForMetal } from "./productVariant.utils";
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
  const configurableSize = product.configurable?.options.find(option => option.attributeCode === "sd_ring_size");
  if (configurableSize) return configurableSize.values.map(value => value.label);
  const magentoLabels = getCustomOptionDisplayLabels(product.customOptions?.ringSize);

  if (magentoLabels.length > 0) {
    return magentoLabels;
  }

  return sizeGuide?.sizeLabels ?? [];
}

/** Match size UIDs, never array positions: Magento can return variants in any order. */
export function getRingSizeOptions(
  product: Product,
  sizeGuide: NormalizedSizeGuide | null | undefined,
  metalId = "",
  preferredPurities: readonly string[] = [],
) {
  const axis = product.configurable?.options.find(option => option.attributeCode === "sd_ring_size");
  if (!axis) return getRingSizeLabels(product, sizeGuide).map(label => ({ label, inStock: true, variant: undefined }));
  const reference = findConfigurableVariantForMetal(product, metalId, preferredPurities);
  const sizeUids = new Set(axis.values.map(value => value.uid));
  const otherUids = reference?.optionUids.filter(uid => !sizeUids.has(uid)) ?? [];
  return axis.values.map(value => {
    const matches = product.configurable?.variants.filter(variant =>
      variant.optionUids.includes(value.uid) && otherUids.every(uid => variant.optionUids.includes(uid)),
    ) ?? [];
    const variant = matches.find(candidate => candidate.inStock) ?? matches[0];
    return { label: value.label, inStock: matches.some(candidate => candidate.inStock), variant };
  });
}
