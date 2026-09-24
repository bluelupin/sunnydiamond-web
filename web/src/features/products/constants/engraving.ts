import type { CartLineOptions } from "@/features/cart/types/cart.types";
import type { ProductCustomOptions } from "@/features/products/types/productCustomOptions";
import type { Product } from "@/features/products/data/products";
import { stripLineInstanceFromEngraving } from "@/features/cart/utils/cartLineInstance.utils";

export const DEFAULT_ENGRAVING_MAX_CHARACTERS = 10;

/** Figma `4903:44931` — default ring close-up when Magento has no preview image. */
export const RING_ENGRAVING_PREVIEW_IMAGE = "/images/products/pdp/ring-engraving-preview.png";

/** Figma `4903:44930` preview frame. */
export const RING_ENGRAVING_PREVIEW_VIEWBOX = { width: 343, height: 214 } as const;

/**
 * Inner-band arc calibrated to Figma `4903:44987` ("Diya Gupta" placement).
 * Quadratic path bows upward at center to match the ring perspective.
 */
export const RING_ENGRAVING_TEXT_ARC_PATH = "M 137 92 Q 174 84 210 92";

export function resolveEngravingPreviewFontSize(text: string): number {
  const length = text.trim().length;
  if (length <= 5) return 14;
  if (length <= 8) return 13.5;
  if (length <= 12) return 12.5;
  return 11.5;
}

const CATALOG_PRODUCT_IMAGE_PATTERN = /\/catalog\/product\//i;

/**
 * Ring engraving preview asset for all engraving-enabled products.
 * Ignores Magento catalog product shots — only dedicated preview assets pass through.
 */
export function resolveEngravingPreviewImage(previewImage?: string | null): string {
  const trimmed = previewImage?.trim();
  if (trimmed && !CATALOG_PRODUCT_IMAGE_PATTERN.test(trimmed)) {
    return trimmed;
  }

  return RING_ENGRAVING_PREVIEW_IMAGE;
}

/** @deprecated Use resolveEngravingPreviewImage */
export const resolveRingEngravingPreviewImage = resolveEngravingPreviewImage;

/** Normalize engraving config for PDP, cart, and any engraving drawer entry point. */
export function resolveProductEngravingConfig(
  product: Pick<Product, "engraving" | "customOptions">,
): ProductEngravingConfig | undefined {
  if (isProductEngravingEnabled(product.engraving)) {
    return {
      ...product.engraving!,
      previewImage: resolveEngravingPreviewImage(product.engraving!.previewImage),
    };
  }

  if (!hasCatalogEngravingText(product.customOptions)) {
    return undefined;
  }

  return {
    enabled: true,
    maxCharacters:
      resolveEngravingMaxCharacters(product.customOptions?.engravingText?.maxCharacters) ??
      DEFAULT_ENGRAVING_MAX_CHARACTERS,
    fonts: product.customOptions?.engravingFont?.labels ?? [],
    previewImage: RING_ENGRAVING_PREVIEW_IMAGE,
  };
}

/** Mirrors the Magento engraving charset validation (add path errors loudly, update path only via errors[]). */
export const ENGRAVING_TEXT_PATTERN = /^[A-Za-z0-9 ./-]*$/;

export const ENGRAVING_TEXT_SANITIZE_PATTERN = /[^A-Za-z0-9 ./-]/g;

export const ENGRAVING_CHARSET_MESSAGE =
  "Only English letters, numbers, spaces, and . / - characters are allowed.";

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

/** No fallback fonts — only backend font values exist as selectable options. */
export function resolveEngravingFonts(fonts?: readonly string[] | null): string[] {
  return (fonts ?? [])
    .map((font) => font.trim())
    .filter((font) => font.length > 0);
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

export function hasCatalogEngravingText(
  productCustomOptions?: ProductCustomOptions | null,
): boolean {
  return Boolean(productCustomOptions?.engravingText);
}

/** Ensures engraving flags are set whenever the catalog exposes an engraving text option. */
export function ensureEngravingCartLineOptions(
  options: CartLineOptions,
  productCustomOptions?: ProductCustomOptions | null,
  engraving?: ProductEngravingConfig | null,
): CartLineOptions {
  if (!hasCatalogEngravingText(productCustomOptions) && !isProductEngravingEnabled(engraving)) {
    return options;
  }

  const maxCharacters =
    options.engravingMaxCharacters ??
    resolveEngravingMaxCharacters(productCustomOptions?.engravingText?.maxCharacters) ??
    engraving?.maxCharacters ??
    DEFAULT_ENGRAVING_MAX_CHARACTERS;

  return {
    ...options,
    engravingSupported: true,
    engravingMaxCharacters: maxCharacters,
  };
}

export function isCartLineEngravingEnabled(
  options: Pick<CartLineOptions, "engravingSupported">,
  productCustomOptions?: ProductCustomOptions | null,
): boolean {
  if (options.engravingSupported === true) {
    return true;
  }

  return hasCatalogEngravingText(productCustomOptions);
}

export type CartLineEngravingContext = {
  options: Pick<CartLineOptions, "engravingSupported">;
  productCustomOptions?: ProductCustomOptions | null;
};

/** Whether a cart line should expose engraving UI and persist engraving state. */
export function isCartLineEngravingCapable(
  context: CartLineEngravingContext,
): boolean {
  return hasCatalogEngravingText(context.productCustomOptions);
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

  const text = stripLineInstanceFromEngraving(mergedOptions.engraving ?? "").trim();
  if (!text) {
    return null;
  }

  return {
    text,
    // Fall back only to a font the product actually offers — never fabricate one.
    font: mergedOptions.engravingFont?.trim() || product.engraving?.fonts?.[0] || "",
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
