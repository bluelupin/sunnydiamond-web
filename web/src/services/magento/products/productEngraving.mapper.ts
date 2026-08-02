import {
  DEFAULT_ENGRAVING_MAX_CHARACTERS,
  resolveEngravingFonts,
  resolveEngravingMaxCharacters,
  type ProductEngravingConfig,
} from "@/features/products/constants/engraving";
import type { MagentoCustomAttributeItem, MagentoMediaGalleryItem } from "./magentoProduct.types";
import type { MagentoEngravingFontOption } from "./engravingFonts.service";
import {
  getMagentoCustomAttributeOptionLabels,
  getMagentoCustomAttributeSelectedValues,
  getMagentoCustomAttributeValue,
  isMagentoBooleanTruthy,
  resolveMagentoModelWearImageUrl,
} from "./magentoAttribute.utils";

type MapMagentoProductEngravingOptions = {
  fontMetadataOptions?: MagentoEngravingFontOption[];
  mediaGallery?: MagentoMediaGalleryItem[] | null;
  referenceImageUrl?: string | null;
};

export function isMagentoProductEngravingEnabled(
  items: MagentoCustomAttributeItem[] | null | undefined,
): boolean {
  return (
    isMagentoBooleanTruthy(getMagentoCustomAttributeValue(items, "engraving_enabled")) ||
    isMagentoBooleanTruthy(getMagentoCustomAttributeValue(items, "sd_engraving_enabled"))
  );
}

export function resolveProductEngravingFonts(
  items: MagentoCustomAttributeItem[] | null | undefined,
  metadataOptions: MagentoEngravingFontOption[],
): string[] {
  const metadataByValue = new Map(
    metadataOptions.map((option) => [option.value, option.label] as const),
  );

  const selectedValues = [
    ...getMagentoCustomAttributeSelectedValues(items, "engraving_fonts"),
    ...getMagentoCustomAttributeSelectedValues(items, "sd_engraving_font"),
  ];

  if (selectedValues.length > 0) {
    const matched = Array.from(
      new Set(
        selectedValues
          .map((value) => metadataByValue.get(value))
          .filter((label): label is string => Boolean(label?.trim())),
      ),
    );

    if (matched.length > 0) {
      return matched;
    }

    const selectedLabels = [
      ...getMagentoCustomAttributeOptionLabels(items, "engraving_fonts"),
      ...getMagentoCustomAttributeOptionLabels(items, "sd_engraving_font"),
    ];

    if (selectedLabels.length > 0) {
      return resolveEngravingFonts(selectedLabels);
    }
  }

  const catalogFonts = metadataOptions.map((option) => option.label);
  return resolveEngravingFonts(catalogFonts);
}

export function mapMagentoProductEngraving(
  items: MagentoCustomAttributeItem[] | null | undefined,
  options: MapMagentoProductEngravingOptions = {},
): ProductEngravingConfig | undefined {
  if (!isMagentoProductEngravingEnabled(items)) {
    return undefined;
  }

  const { fontMetadataOptions = [], mediaGallery, referenceImageUrl } = options;

  const maxRaw =
    getMagentoCustomAttributeValue(items, "engraving_max_characters") ??
    getMagentoCustomAttributeValue(items, "sd_engraving_max_length");
  const maxCharacters =
    resolveEngravingMaxCharacters(maxRaw) ?? DEFAULT_ENGRAVING_MAX_CHARACTERS;

  const fonts = resolveProductEngravingFonts(items, fontMetadataOptions);

  const previewImageRaw =
    getMagentoCustomAttributeValue(items, "engraving_preview_image") ??
    getMagentoCustomAttributeValue(items, "sd_engraving_preview_image");
  const previewImage =
    resolveMagentoModelWearImageUrl(previewImageRaw, mediaGallery, referenceImageUrl) ||
    undefined;

  return {
    enabled: true,
    maxCharacters,
    fonts,
    previewImage,
  };
}
