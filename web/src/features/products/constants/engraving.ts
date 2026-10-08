import type { CartLineOptions } from "@/features/cart/types/cart.types";
import type { ProductCustomOptions } from "@/features/products/types/productCustomOptions";
import type { Product } from "@/features/products/data/products";
import type { JewelleryCategorySlug } from "@/features/jewellery-product/types";
import { stripLineInstanceFromEngraving } from "@/features/cart/utils/cartLineInstance.utils";

export const DEFAULT_ENGRAVING_MAX_CHARACTERS = 10;

/** Static PDP engraving previews keyed by jewellery PLP category slug. */
export const CATEGORY_ENGRAVING_PREVIEW_IMAGES: Partial<
  Record<JewelleryCategorySlug, string>
> = {
  rings: "/images/products/pdp/ring-engraving-preview.png",
  earrings: "/images/products/pdp/Earrings-engraving-preview.png",
  necklace: "/images/products/pdp/Necklace-engraving-preview.png",
  pendants: "/images/products/pdp/Pendants-engraving-preview.png",
  bracelets: "/images/products/pdp/Bracelet-engraving-preview.png",
  bangles: "/images/products/pdp/Bangle-engraving-preview.png",
};

/** Figma `4903:44930` — shared engraving preview coordinate space (343×214). */
export const ENGRAVING_PREVIEW_VIEWBOX = { width: 343, height: 214 } as const;

/** @deprecated Use ENGRAVING_PREVIEW_VIEWBOX */
export const RING_ENGRAVING_PREVIEW_VIEWBOX = ENGRAVING_PREVIEW_VIEWBOX;

export type EngravingPreviewLayout = {
  viewBox: typeof ENGRAVING_PREVIEW_VIEWBOX;
  textArcPath: string;
  /** Scales resolved font size for smaller engraving surfaces (earring back, name tag). */
  fontSizeScale?: number;
};

/**
 * Inner-band arc calibrated to Figma `4903:44987` ("Diya Gupta" on ring inner wall).
 */
export const RING_ENGRAVING_TEXT_ARC_PATH = "M 137 92 Q 174 84 210 92";

/**
 * Text paths calibrated to category preview assets — same 343×214 viewBox as the panel image.
 * Straight paths use horizontal lines; curved paths follow inner metal surfaces.
 */
export const CATEGORY_ENGRAVING_PREVIEW_LAYOUTS: Partial<
  Record<JewelleryCategorySlug, EngravingPreviewLayout>
> = {
  rings: {
    viewBox: ENGRAVING_PREVIEW_VIEWBOX,
    textArcPath: RING_ENGRAVING_TEXT_ARC_PATH,
  },
  pendants: {
    viewBox: ENGRAVING_PREVIEW_VIEWBOX,
    // Straight line on lower teardrop face — centered, just below the widest point
    textArcPath: "M 108 105 L 234 145",
    fontSizeScale: 0.72,
  },
  bangles: {
    viewBox: ENGRAVING_PREVIEW_VIEWBOX,
    textArcPath: "M 88 76 Q 171 66 254 76",
    fontSizeScale: 0.92,
  },
  necklace: {
    viewBox: ENGRAVING_PREVIEW_VIEWBOX,
    // Oval tag long axis — slopes down left→right on Necklace-engraving-preview.png
    textArcPath: "M 118 98 L 214 130",
    fontSizeScale: 0.68,
  },
  bracelets: {
    viewBox: ENGRAVING_PREVIEW_VIEWBOX,
    textArcPath: "M 118 84 Q 171 76 224 84",
    fontSizeScale: 0.9,
  },
  earrings: {
    viewBox: ENGRAVING_PREVIEW_VIEWBOX,
    textArcPath: "M 142 108 Q 171 100 200 108",
    fontSizeScale: 0.78,
  },
};

const ENGRAVING_PREVIEW_IMAGE_CATEGORY_HINTS: ReadonlyArray<
  readonly [JewelleryCategorySlug, string]
> = [
  ["earrings", "Earrings-engraving-preview"],
  ["necklace", "Necklace-engraving-preview"],
  ["pendants", "Pendants-engraving-preview"],
  ["bracelets", "Bracelet-engraving-preview"],
  ["bangles", "Bangle-engraving-preview"],
  ["rings", "ring-engraving-preview"],
];

const DEFAULT_ENGRAVING_PREVIEW_LAYOUT: EngravingPreviewLayout = {
  viewBox: ENGRAVING_PREVIEW_VIEWBOX,
  textArcPath: RING_ENGRAVING_TEXT_ARC_PATH,
};

export function resolveEngravingPreviewCategorySlug(
  categorySlug?: string | null,
  previewImage?: string | null,
): JewelleryCategorySlug | null {
  if (categorySlug) {
    const normalized = categorySlug.trim().toLowerCase() as JewelleryCategorySlug;
    if (CATEGORY_ENGRAVING_PREVIEW_LAYOUTS[normalized]) {
      return normalized;
    }
  }

  const preview = previewImage?.trim();
  if (!preview) {
    return null;
  }

  for (const [slug, hint] of ENGRAVING_PREVIEW_IMAGE_CATEGORY_HINTS) {
    if (preview.includes(hint)) {
      return slug;
    }
  }

  for (const [slug, path] of Object.entries(CATEGORY_ENGRAVING_PREVIEW_IMAGES) as Array<
    [JewelleryCategorySlug, string]
  >) {
    if (preview.includes(path)) {
      return slug;
    }
  }

  return null;
}

export function resolveEngravingPreviewLayout(
  categorySlug?: string | null,
  previewImage?: string | null,
): EngravingPreviewLayout {
  const slug = resolveEngravingPreviewCategorySlug(categorySlug, previewImage);
  if (slug && CATEGORY_ENGRAVING_PREVIEW_LAYOUTS[slug]) {
    return CATEGORY_ENGRAVING_PREVIEW_LAYOUTS[slug]!;
  }

  return DEFAULT_ENGRAVING_PREVIEW_LAYOUT;
}

export function resolveEngravingPreviewFontSize(text: string, fontSizeScale = 1): number {
  const length = text.trim().length;
  let base: number;
  if (length <= 5) base = 14;
  else if (length <= 8) base = 13.5;
  else if (length <= 12) base = 12.5;
  else base = 11.5;

  const scaled = base * fontSizeScale;
  return Math.round(scaled * 10) / 10;
}

const CATALOG_PRODUCT_IMAGE_PATTERN = /\/catalog\/product\//i;

export function resolveCategoryEngravingPreviewImage(
  categorySlug?: string | null,
): string | undefined {
  if (!categorySlug) {
    return undefined;
  }

  const normalized = categorySlug.trim().toLowerCase() as JewelleryCategorySlug;
  return CATEGORY_ENGRAVING_PREVIEW_IMAGES[normalized];
}

/**
 * Dedicated Magento preview when configured; otherwise category static asset.
 * Ignores Magento catalog product shots. Returns undefined when no preview exists.
 */
export function resolveEngravingPreviewImage(
  previewImage?: string | null,
  categorySlug?: string | null,
): string | undefined {
  const trimmed = previewImage?.trim();
  if (trimmed && !CATALOG_PRODUCT_IMAGE_PATTERN.test(trimmed)) {
    return trimmed;
  }

  return resolveCategoryEngravingPreviewImage(categorySlug);
}

/** @deprecated Use resolveEngravingPreviewImage */
export const resolveRingEngravingPreviewImage = resolveEngravingPreviewImage;

/** Normalize engraving config for PDP, cart, and any engraving drawer entry point. */
export function resolveProductEngravingConfig(
  product: Pick<Product, "engraving" | "customOptions" | "categorySlug">,
): ProductEngravingConfig | undefined {
  const previewImage = resolveEngravingPreviewImage(
    product.engraving?.previewImage,
    product.categorySlug,
  );

  if (isProductEngravingEnabled(product.engraving)) {
    return {
      ...product.engraving!,
      ...(previewImage ? { previewImage } : {}),
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
    ...(previewImage ? { previewImage } : {}),
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
