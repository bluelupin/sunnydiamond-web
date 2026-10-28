import type { CSSProperties } from "react";
import {
  resolveEngravingFontCssFamily,
  resolveEngravingFontFamilyStyle,
} from "@/features/products/constants/engravingFontAssets";

/**
 * Engraving panel font dropdown only — preview size per loaded @font-face family.
 * Magento option labels stay dynamic; sizes apply to any label that resolves to the family.
 */
const ENGRAVING_PANEL_FONT_OPTION_SIZE_PX_BY_CSS_FAMILY: Readonly<
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
  "SD Engraving Vladimir Script": 18 
};

/** Inline styles for engraving panel font select trigger and list options. */
export function resolveEngravingPanelFontOptionStyle(
  magentoLabel: string,
): CSSProperties | undefined {
  const familyStyle = resolveEngravingFontFamilyStyle(magentoLabel);
  if (!familyStyle) {
    return undefined;
  }

  const cssFamily = resolveEngravingFontCssFamily(magentoLabel);
  const fontSizePx =
    cssFamily != null
      ? ENGRAVING_PANEL_FONT_OPTION_SIZE_PX_BY_CSS_FAMILY[cssFamily]
      : undefined;

  if (fontSizePx == null) {
    return familyStyle;
  }

  return { ...familyStyle, fontSize: fontSizePx };
}
