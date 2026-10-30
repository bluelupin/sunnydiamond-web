import type { CSSProperties } from "react";

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

/**
 * Preview / panel dropdown size per loaded @font-face family (Magento labels stay dynamic).
 */
export const ENGRAVING_FONT_PREVIEW_SIZE_PX_BY_CSS_FAMILY: Readonly<
  Partial<Record<string, number>>
> = {
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

export function resolveEngravingFontPreviewSizePx(magentoLabel: string): number | null {
  const cssFamily = resolveEngravingFontCssFamily(magentoLabel);
  if (!cssFamily) {
    return null;
  }

  return ENGRAVING_FONT_PREVIEW_SIZE_PX_BY_CSS_FAMILY[cssFamily] ?? null;
}
