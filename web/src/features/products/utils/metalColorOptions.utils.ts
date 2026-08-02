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

function normalizeMetalColorKey(value: string): string {
  return value.trim().toLowerCase().replace(/[_\s]+/g, "-");
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
