import {
  DEFAULT_ENGRAVING_MAX_CHARACTERS,
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

  const { mediaGallery, referenceImageUrl } = options;

  const previewImageRaw =
    getMagentoCustomAttributeValue(items, "engraving_preview_image") ??
    getMagentoCustomAttributeValue(items, "sd_engraving_preview_image");
  const previewImage =
    resolveMagentoModelWearImageUrl(previewImageRaw, mediaGallery, referenceImageUrl) ||
    undefined;

  return {
    enabled: true,
    maxCharacters: engravingText.maxCharacters ?? DEFAULT_ENGRAVING_MAX_CHARACTERS,
    fonts: customOptions.engravingFont?.labels ?? [],
    previewImage,
  };
}
