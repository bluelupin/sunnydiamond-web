import type { CartLineOptions } from "@/features/cart/types/cart.types";
import type { ProductCustomOptions } from "@/features/products/types/productCustomOptions";
import type { Product } from "@/features/products/data/products";

export const DEFAULT_ENGRAVING_FONTS = ["Gill Sans", "Larken"] as const;

export const DEFAULT_ENGRAVING_MAX_CHARACTERS = 30;

/** @deprecated Use DEFAULT_ENGRAVING_FONTS */
export const ENGRAVING_FONTS = DEFAULT_ENGRAVING_FONTS;

export type ProductEngravingConfig = {
  enabled: boolean;
  maxCharacters: number;
  fonts: string[];
  previewImage?: string;
};

export type EngravingSelection = {
  text: string;
  font: string;
};

export function resolveEngravingFonts(fonts?: readonly string[] | null): string[] {
  const cleaned = (fonts ?? [])
    .map((font) => font.trim())
    .filter((font) => font.length > 0);

  return cleaned.length > 0 ? cleaned : [...DEFAULT_ENGRAVING_FONTS];
}

export function resolveEngravingMaxCharacters(
  value: string | number | null | undefined,
): number | null {
  if (value == null) {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value.trim());
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.floor(parsed);
}

export function clampEngravingText(text: string, maxCharacters: number): string {
  return text.slice(0, maxCharacters);
}

/** Tailwind classes for live engraving preview typography. */
export function resolveEngravingPreviewFontClass(font: string): string {
  const normalized = font.trim().toLowerCase();

  if (normalized.includes("larken")) {
    return "font-larken font-light";
  }

  if (normalized.includes("gill")) {
    return "font-gill font-normal";
  }

  return "";
}

/** Class + inline family so Magento font labels render in the preview. */
export function resolveEngravingPreviewTypography(font: string): {
  className: string;
  style: { fontFamily: string };
} {
  const trimmed = font.trim();
  const fallbackFamily = "Gill Sans, sans-serif";

  return {
    className: resolveEngravingPreviewFontClass(trimmed),
    style: {
      fontFamily: trimmed ? `${trimmed}, sans-serif` : fallbackFamily,
    },
  };
}

export function isProductEngravingEnabled(
  engraving?: ProductEngravingConfig | null,
): boolean {
  return engraving?.enabled === true;
}

export function isCartLineEngravingEnabled(
  options: Pick<CartLineOptions, "engravingSupported">,
): boolean {
  return options.engravingSupported === true;
}

export type CartLineEngravingContext = {
  options: Pick<CartLineOptions, "engravingSupported">;
  productCustomOptions?: ProductCustomOptions | null;
};

/** Whether a cart line should expose engraving UI and persist engraving state. */
export function isCartLineEngravingCapable(
  context: CartLineEngravingContext,
): boolean {
  if (context.options.engravingSupported !== true) {
    return false;
  }

  const catalogOptions = context.productCustomOptions;
  if (catalogOptions && !catalogOptions.engravingText) {
    return false;
  }

  return true;
}

export function mergeCartLineOptions(
  lineItemOptions?: CartLineOptions,
  metadataOptions?: CartLineOptions,
): CartLineOptions {
  return {
    ...(metadataOptions ?? {}),
    ...(lineItemOptions ?? {}),
  };
}

export function resolveCartLineEngravingSelection(
  product: Pick<Product, "engraving">,
  lineItem?: { options: CartLineOptions },
  metadata?: {
    options?: CartLineOptions;
    productCustomOptions?: ProductCustomOptions | null;
  },
): EngravingSelection | null {
  if (!isProductEngravingEnabled(product.engraving)) {
    return null;
  }

  const mergedOptions = mergeCartLineOptions(lineItem?.options, metadata?.options);
  const engravingContext: CartLineEngravingContext = {
    options: mergedOptions,
    productCustomOptions: metadata?.productCustomOptions,
  };

  if (!isCartLineEngravingCapable(engravingContext)) {
    return null;
  }

  const text = mergedOptions.engraving?.trim();
  if (!text) {
    return null;
  }

  return {
    text,
    font: mergedOptions.engravingFont?.trim() || DEFAULT_ENGRAVING_FONTS[0],
  };
}

/** Cart line options to persist when adding an engraving-capable product to the bag. */
export function buildEngravingCartLineOptions(
  engraving: ProductEngravingConfig,
  selection: EngravingSelection | null | undefined,
): Pick<
  CartLineOptions,
  "engraving" | "engravingFont" | "engravingMaxCharacters" | "engravingSupported"
> {
  return {
    engraving: selection?.text?.trim() || undefined,
    engravingFont: selection?.font?.trim() || undefined,
    engravingMaxCharacters: engraving.maxCharacters,
    engravingSupported: true,
  };
}
