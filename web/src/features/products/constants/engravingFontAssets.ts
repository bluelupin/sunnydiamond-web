import type { CSSProperties } from "react";
import type { JewelleryCategorySlug } from "@/features/jewellery-product/types";
import { parseJewelleryCategorySlug } from "@/features/jewellery-product/utils/jewelleryRoutes";

/** Same tokenization as Magento custom-option label matching (alphanumeric only). */
export function normalizeEngravingFontLabel(label: string): string {
  return label.trim().toLowerCase().replace(/[^\da-z.]/g, "");
}

type EngravingFontAssetDefinition = {
  /** Must match `font-family` in engraving-fonts.css */
  cssFamily: string;
  /** Normalized Magento labels / aliases that map to this asset */
  matchKeys: readonly string[];
};

const ENGRAVING_FONT_ASSETS: readonly EngravingFontAssetDefinition[] = [
  {
    cssFamily: "SD Engraving Algerian",
    matchKeys: ["algerian"],
  },
  {
    cssFamily: "SD Engraving Edwardian Script",
    matchKeys: ["edwardianscript", "edwardianscriptitc"],
  },
  {
    cssFamily: "SD Engraving Lucida Handwriting",
    matchKeys: ["lucidahandwriting"],
  },
  {
    cssFamily: "SD Engraving Lucida Handwriting Italic",
    matchKeys: ["lucidahandwritingitalic"],
  },
  {
    cssFamily: "SD Engraving Monotype Corsiva",
    matchKeys: ["monotypecorsiva", "monotypecorsivaregular"],
  },
  {
    cssFamily: "SD Engraving Pinyon Script",
    matchKeys: ["pinyonscript"],
  },
  {
    cssFamily: "SD Engraving Script MT Bold",
    matchKeys: ["scriptmtbold", "script"],
  },
  {
    cssFamily: "SD Engraving Vivaldi",
    matchKeys: ["vivaldi", "vivaldiregular"],
  },
  {
    cssFamily: "SD Engraving Pristina",
    matchKeys: ["pristina"],
  },
  {
    cssFamily: "SD Engraving Vladimir Script",
    matchKeys: ["vladimirscript"],
  },
] as const;

const ENGRAVING_FONT_FAMILY_BY_KEY = new Map<string, string>(
  ENGRAVING_FONT_ASSETS.flatMap((asset) =>
    asset.matchKeys.map((key) => [key, asset.cssFamily] as const),
  ),
);

/** Resolves a Magento engraving font label to a loaded @font-face family, if known. */
export function resolveEngravingFontCssFamily(magentoLabel: string): string | null {
  const normalized = normalizeEngravingFontLabel(magentoLabel);
  if (!normalized) {
    return null;
  }

  return ENGRAVING_FONT_FAMILY_BY_KEY.get(normalized) ?? null;
}

export function resolveEngravingFontFamilyStyle(magentoLabel: string): CSSProperties | undefined {
  const cssFamily = resolveEngravingFontCssFamily(magentoLabel);
  if (!cssFamily) {
    return undefined;
  }

  return { fontFamily: `"${cssFamily}", sans-serif` };
}

type EngravingFontSizePxByCssFamily = Readonly<Partial<Record<string, number>>>;

/** Font select trigger / list option size per @font-face family (Magento labels stay dynamic). */
export const ENGRAVING_PANEL_FONT_DROPDOWN_SIZE_PX_BY_CSS_FAMILY: EngravingFontSizePxByCssFamily =
  {
    "SD Engraving Vivaldi": 16,
    "SD Engraving Edwardian Script": 22,
    "SD Engraving Lucida Handwriting": 13,
    "SD Engraving Algerian": 14,
    "SD Engraving Monotype Corsiva": 18,
    "SD Engraving Pinyon Script": 18,
    "SD Engraving Pristina": 19,
    "SD Engraving Script MT Bold": 15,
    "SD Engraving Vladimir Script": 18,
  };

/** Fallback preview base sizes when category is unknown or has no dedicated map. */
export const DEFAULT_ENGRAVING_PREVIEW_FONT_SIZE_PX_BY_CSS_FAMILY: EngravingFontSizePxByCssFamily =
  {
    "SD Engraving Vivaldi": 16,
    "SD Engraving Edwardian Script": 22,
    "SD Engraving Lucida Handwriting": 13,
    "SD Engraving Algerian": 14,
    "SD Engraving Monotype Corsiva": 18,
    "SD Engraving Pinyon Script": 18,
    "SD Engraving Pristina": 19,
    "SD Engraving Script MT Bold": 15,
    "SD Engraving Vladimir Script": 18,
  };

/** Former layout `fontSizeScale` — baked into non-custom category maps below (not applied at render). */
const ENGRAVING_PREVIEW_LEGACY_LAYOUT_FONT_SIZE_SCALE = {
  rings: 1,
  earrings: 0.64,
  necklace: 0.68,
  pendants: 0.72,
  bracelets: 0.7,
  bangles: 1,
} as const satisfies Partial<Record<JewelleryCategorySlug, number>>;

function scaleEngravingPreviewFontSizeMap(
  source: EngravingFontSizePxByCssFamily,
  scale: number,
): EngravingFontSizePxByCssFamily {
  if (scale === 1) {
    return { ...source };
  }

  const scaled: Partial<Record<string, number>> = {};
  for (const [family, px] of Object.entries(source)) {
    if (typeof px === "number") {
      scaled[family] = Math.round(px * scale * 10) / 10;
    }
  }

  return scaled;
}

/**
 * SVG `fontSize` user units per @font-face family and category (before text-length scaling only).
 * Each category owns a separate object so sizes can diverge without affecting others.
 */
export const ENGRAVING_PREVIEW_FONT_SIZE_PX_BY_CSS_FAMILY_BY_CATEGORY: Partial<
  Record<JewelleryCategorySlug, EngravingFontSizePxByCssFamily>
> = {
  rings: {
    "SD Engraving Vivaldi": 16,
    "SD Engraving Edwardian Script": 22,
    "SD Engraving Lucida Handwriting": 13,
    "SD Engraving Algerian": 14,
    "SD Engraving Monotype Corsiva": 18,
    "SD Engraving Pinyon Script": 18,
    "SD Engraving Pristina": 19,
    "SD Engraving Script MT Bold": 15,
    "SD Engraving Vladimir Script": 18,
  },
  earrings:{
    "SD Engraving Vivaldi": 5,
    "SD Engraving Edwardian Script": 12,
    "SD Engraving Lucida Handwriting": 4,
    "SD Engraving Algerian": 9,
    "SD Engraving Monotype Corsiva": 6,
    "SD Engraving Pinyon Script": 6,
    "SD Engraving Pristina": 7,
    "SD Engraving Script MT Bold": 6,
    "SD Engraving Vladimir Script": 7,
  },
  necklace: {
    "SD Engraving Vivaldi": 9,
    "SD Engraving Edwardian Script": 11,
    "SD Engraving Lucida Handwriting": 7,
    "SD Engraving Algerian": 8,
    "SD Engraving Monotype Corsiva": 10,
    "SD Engraving Pinyon Script": 10,
    "SD Engraving Pristina": 11,
    "SD Engraving Script MT Bold": 10,
    "SD Engraving Vladimir Script": 11,
  },
  pendants: {
    "SD Engraving Vivaldi": 10,
    "SD Engraving Edwardian Script": 12,
    "SD Engraving Lucida Handwriting": 7,
    "SD Engraving Algerian": 9,
    "SD Engraving Monotype Corsiva": 11,
    "SD Engraving Pinyon Script": 11,
    "SD Engraving Pristina": 12,
    "SD Engraving Script MT Bold": 10,
    "SD Engraving Vladimir Script": 12,
  },
  bracelets: {
    "SD Engraving Vivaldi": 10,
    "SD Engraving Edwardian Script": 9,
    "SD Engraving Lucida Handwriting": 9,
    "SD Engraving Algerian": 8,
    "SD Engraving Monotype Corsiva": 6,
    "SD Engraving Pinyon Script": 6,
    "SD Engraving Pristina": 7,
    "SD Engraving Script MT Bold": 10,
    "SD Engraving Vladimir Script": 7,
  },
  bangles: {
    "SD Engraving Vivaldi": 12,
    "SD Engraving Edwardian Script": 12,
    "SD Engraving Lucida Handwriting": 9.5,
    "SD Engraving Algerian": 10,
    "SD Engraving Monotype Corsiva": 14,
    "SD Engraving Pinyon Script": 13,
    "SD Engraving Pristina": 13,
    "SD Engraving Script MT Bold": 11,
    "SD Engraving Vladimir Script": 13,
  },
};

function resolveEngravingFontSizePxFromMap(
  magentoLabel: string,
  sizeByCssFamily: EngravingFontSizePxByCssFamily,
): number | null {
  const cssFamily = resolveEngravingFontCssFamily(magentoLabel);
  if (!cssFamily) {
    return null;
  }

  return sizeByCssFamily[cssFamily] ?? null;
}

export function resolveEngravingPanelFontDropdownSizePx(magentoLabel: string): number | null {
  return resolveEngravingFontSizePxFromMap(
    magentoLabel,
    ENGRAVING_PANEL_FONT_DROPDOWN_SIZE_PX_BY_CSS_FAMILY,
  );
}

export function resolveEngravingPreviewFontBaseSizePx(
  magentoLabel: string,
  categorySlug?: JewelleryCategorySlug | string | null,
): number | null {
  const parsedCategory = categorySlug ? parseJewelleryCategorySlug(categorySlug) : null;
  const categoryMap = parsedCategory
    ? ENGRAVING_PREVIEW_FONT_SIZE_PX_BY_CSS_FAMILY_BY_CATEGORY[parsedCategory]
    : undefined;
  const sizeByCssFamily =
    categoryMap ?? DEFAULT_ENGRAVING_PREVIEW_FONT_SIZE_PX_BY_CSS_FAMILY;

  return resolveEngravingFontSizePxFromMap(magentoLabel, sizeByCssFamily);
}
