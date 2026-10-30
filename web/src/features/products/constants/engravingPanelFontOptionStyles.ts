import type { CSSProperties } from "react";
import {
  resolveEngravingFontFamilyStyle,
  resolveEngravingFontPreviewSizePx,
} from "@/features/products/constants/engravingFontAssets";

/** Inline styles for engraving panel font select trigger and list options. */
export function resolveEngravingPanelFontOptionStyle(
  magentoLabel: string,
): CSSProperties | undefined {
  const familyStyle = resolveEngravingFontFamilyStyle(magentoLabel);
  if (!familyStyle) {
    return undefined;
  }

  const fontSizePx = resolveEngravingFontPreviewSizePx(magentoLabel);

  if (fontSizePx == null) {
    return familyStyle;
  }

  return { ...familyStyle, fontSize: fontSizePx };
}
