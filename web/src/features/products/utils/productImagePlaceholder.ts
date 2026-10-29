import type { StaticImageData } from "next/image";
import { isMagentoPlaceholderImage } from "@/services/magento/products/magentoAttribute.utils";
import { getImageSrc } from "@/shared/utils/image";

/** Public asset — product catalog images only (PLP / PDP). */
export const PRODUCT_IMAGE_PLACEHOLDER_SRC = "/Image-Placeholder.jpg";

export function isValidProductCatalogImage(
  src: string | StaticImageData | null | undefined,
): boolean {
  const resolved = getImageSrc(src);
  return Boolean(resolved && !isMagentoPlaceholderImage(resolved));
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
