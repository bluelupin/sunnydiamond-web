import type { StaticImageData } from "next/image";
import { isMagentoPlaceholderImage } from "@/services/magento/products/magentoAttribute.utils";
import { getImageSrc } from "@/shared/utils/image";

/** Public asset — product catalog images only (PLP, PDP, cart, wishlist, orders, etc.). */
export const PRODUCT_IMAGE_PLACEHOLDER_SRC = "/Image-Placeholder.jpg";

export function isValidProductCatalogImage(
  src: string | StaticImageData | null | undefined,
): boolean {
  const resolved = getImageSrc(src);
  return Boolean(
    resolved &&
      resolved !== PRODUCT_IMAGE_PLACEHOLDER_SRC &&
      !isMagentoPlaceholderImage(resolved),
  );
}

/** Returns API image URL when valid; otherwise the product placeholder. */
export function resolveProductCatalogImageSrc(
  src: string | StaticImageData | null | undefined,
): string {
  const resolved = getImageSrc(src);
  if (resolved && !isMagentoPlaceholderImage(resolved)) {
    return resolved;
  }

  return PRODUCT_IMAGE_PLACEHOLDER_SRC;
}

/** Like {@link resolveProductCatalogImageSrc} but preserves {@link StaticImageData} when valid. */
export function resolveProductCatalogImage(
  src: string | StaticImageData | null | undefined,
): string | StaticImageData {
  if (isValidProductCatalogImage(src)) {
    return src as string | StaticImageData;
  }

  return PRODUCT_IMAGE_PLACEHOLDER_SRC;
}

/**
 * Product catalog fallback chain: variant/configuration → parent product → public placeholder.
 * Skips invalid or Magento placeholder URLs at each step.
 */
export function resolveProductCatalogImagePriority(
  ...candidates: Array<string | StaticImageData | null | undefined>
): string {
  for (const candidate of candidates) {
    if (isValidProductCatalogImage(candidate)) {
      return resolveProductCatalogImageSrc(candidate);
    }
  }

  return PRODUCT_IMAGE_PLACEHOLDER_SRC;
}

/** Same priority as {@link resolveProductCatalogImagePriority} but preserves {@link StaticImageData}. */
export function resolveProductCatalogImagePriorityPreserving(
  ...candidates: Array<string | StaticImageData | null | undefined>
): string | StaticImageData {
  for (const candidate of candidates) {
    if (isValidProductCatalogImage(candidate)) {
      return candidate as string | StaticImageData;
    }
  }

  return PRODUCT_IMAGE_PLACEHOLDER_SRC;
}
