import type { Product } from "@/features/products/data/products";
import type { MetalColorOption } from "@/features/products/types/productDetail";
import { getConfigurableMetalOption } from "@/features/products/utils/productVariant.utils";

const METAL_COLOR_SWATCHES: Record<string, string> = {
  "yellow-gold": "#D1B57A",
  "rose-gold": "#D9B0CB",
  "white-gold": "#E8E8E8",
  gold: "#D1B57A",
  rose: "#D9B0CB",
  silver: "#CCCCCC",
  platinum: "#E8E8E8",
};

export function formatMetalColorLabel(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  return trimmed
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export type ConfigurableOrderLineSkuParts = {
  ringSize?: string;
  metalSlug?: string;
};

/**
 * Magento configurable child line SKUs on orders:
 * - `{parent}-{size}-{metalSlug}` e.g. 2120925809802-5-yellow-gold (Diya)
 * - `{parent}-{metalSlug}` e.g. 2120925809846-yellow-gold (Anya)
 * - `{parent}-{size}` e.g. 2120925809802-6 (legacy size-only child)
 */
export function parseConfigurableOrderLineSku(
  sku: string | null | undefined,
): ConfigurableOrderLineSkuParts {
  const normalized = sku?.trim().toLowerCase();
  if (!normalized) {
    return {};
  }

  const metalAndSize = normalized.match(
    /^(\d+)-(\d+)-([a-z][a-z0-9]*(?:-[a-z0-9]+)*)$/,
  );
  if (metalAndSize) {
    return {
      ringSize: metalAndSize[2],
      metalSlug: metalAndSize[3],
    };
  }

  const twoPart = normalized.match(/^(\d+)-([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  const suffix = twoPart?.[2];
  if (!suffix) {
    return {};
  }

  if (/^\d+$/.test(suffix)) {
    return { ringSize: suffix };
  }

  if (/[a-z]/.test(suffix) && !/^\d/.test(suffix)) {
    return { metalSlug: suffix };
  }

  return {};
}

/** Metal slug fallback when order options omit configurable metal (not `{parent}-6`). */
export function metalSlugFromOrderProductSku(sku: string | null | undefined): string | undefined {
  return parseConfigurableOrderLineSku(sku).metalSlug;
}

export function ringSizeFromOrderProductSku(sku: string | null | undefined): string | undefined {
  return parseConfigurableOrderLineSku(sku).ringSize;
}

function normalizeMetalColorKey(value: string): string {
  return value.trim().toLowerCase().replace(/[_\s]+/g, "-");
}

/** PLP metal-type filter chips — same swatch resolution as PDP metal color options. */
export function resolveMetalFilterSwatchColor(
  id: string,
  label: string,
  magentoSwatchHex?: string | null,
): string {
  const fromMagento = magentoSwatchHex?.trim();
  if (fromMagento) {
    return fromMagento;
  }

  return resolveSwatchColor(id, label);
}

function resolveSwatchColor(id: string, label: string): string {
  for (const candidate of [normalizeMetalColorKey(id), normalizeMetalColorKey(label)]) {
    if (METAL_COLOR_SWATCHES[candidate]) {
      return METAL_COLOR_SWATCHES[candidate];
    }
  }

  const combined = `${id} ${label}`.toLowerCase();
  if (combined.includes("rose")) {
    return METAL_COLOR_SWATCHES["rose-gold"];
  }
  if (combined.includes("white") || combined.includes("silver") || combined.includes("platinum")) {
    return METAL_COLOR_SWATCHES["white-gold"];
  }
  if (combined.includes("yellow") || combined.includes("gold")) {
    return METAL_COLOR_SWATCHES["yellow-gold"];
  }

  return "#CCCCCC";
}

function buildMetalColorOption(id: string, label: string, swatchColor?: string): MetalColorOption {
  const normalizedId = normalizeMetalColorKey(id);
  const displayLabel = formatMetalColorLabel(label) || label.trim();

  return {
    id: normalizedId,
    label: displayLabel,
    color: swatchColor?.trim() || resolveSwatchColor(normalizedId, displayLabel),
  };
}

export function isMetalColorSelectable(product: Product): boolean {
  const configurableMetal = getConfigurableMetalOption(product);
  if ((configurableMetal?.values.length ?? 0) > 1) {
    return true;
  }

  return Object.keys(product.customOptions?.metal?.valuesByLabel ?? {}).length > 0;
}

export function getMetalColorOptions(product: Product): MetalColorOption[] {
  const configurableMetal = getConfigurableMetalOption(product);
  if (configurableMetal && configurableMetal.values.length > 0) {
    return configurableMetal.values.map((value) =>
      buildMetalColorOption(value.id, value.label, value.swatchColor),
    );
  }

  const customMetal = product.customOptions?.metal;
  if (customMetal) {
    const options = Object.keys(customMetal.valuesByLabel).map((key) =>
      buildMetalColorOption(key, key),
    );

    if (options.length > 0) {
      return options;
    }
  }

  const metalColorValue = product.metalColorValue?.trim();
  if (metalColorValue) {
    return [buildMetalColorOption(metalColorValue, metalColorValue)];
  }

  return [];
}

export function getDefaultMetalColorId(
  product: Product,
  options: readonly MetalColorOption[],
): string {
  const productValue = product.metalColorValue?.trim();
  if (productValue) {
    const normalizedProductValue = normalizeMetalColorKey(productValue);
    const match = options.find((option) => {
      const normalizedId = normalizeMetalColorKey(option.id);
      const normalizedLabel = normalizeMetalColorKey(option.label);

      return (
        normalizedId === normalizedProductValue ||
        normalizedLabel === normalizedProductValue ||
        option.label.trim().toLowerCase() === productValue.toLowerCase()
      );
    });

    if (match) {
      return match.id;
    }
  }

  return options[0]?.id ?? "";
}
