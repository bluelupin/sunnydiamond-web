import {
  DEFAULT_ENGRAVING_MAX_CHARACTERS,
  resolveEngravingMaxCharacters,
  resolveEngravingPreviewImage,
  type ProductEngravingConfig,
} from "@/features/products/constants/engraving";
import type { ProductCustomOptions } from "@/features/products/types/productCustomOptions";
import type { MagentoCustomAttributeItem, MagentoMediaGalleryItem } from "./magentoProduct.types";
import {
  getMagentoCustomAttributeValue,
  resolveMagentoModelWearImageUrl,
} from "./magentoAttribute.utils";

type MapMagentoProductEngravingOptions = {
  mediaGallery?: MagentoMediaGalleryItem[] | null;
  referenceImageUrl?: string | null;
  categorySlug?: string | null;
};

/**
 * Native customizable options are the source of truth for engraving —
 * the backend syncs them from admin attributes. Only the preview image
 * still comes from EAV (display only).
 */
export function mapMagentoProductEngraving(
  customOptions: ProductCustomOptions | undefined,
  items: MagentoCustomAttributeItem[] | null | undefined,
  options: MapMagentoProductEngravingOptions = {},
): ProductEngravingConfig | undefined {
  const engravingText = customOptions?.engravingText;
  if (!engravingText) {
    return undefined;
  }

  const { mediaGallery, referenceImageUrl, categorySlug } = options;

  const previewImageRaw =
    getMagentoCustomAttributeValue(items, "engraving_preview_image") ??
    getMagentoCustomAttributeValue(items, "sd_engraving_preview_image");
  const previewImage = resolveEngravingPreviewImage(
    resolveMagentoModelWearImageUrl(previewImageRaw, mediaGallery, referenceImageUrl) || undefined,
    categorySlug,
  );

  return {
    enabled: true,
    maxCharacters:
      resolveEngravingMaxCharacters(engravingText.maxCharacters) ??
      DEFAULT_ENGRAVING_MAX_CHARACTERS,
    fonts: customOptions.engravingFont?.labels ?? [],
    ...(previewImage ? { previewImage } : {}),
  };
}
