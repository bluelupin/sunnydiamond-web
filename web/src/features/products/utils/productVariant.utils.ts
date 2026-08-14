import type { Product, ProductConfigurableVariant } from "@/features/products/data/products";

const METAL_ATTRIBUTE_CODE = "sd_metal_color";
const PURITY_ATTRIBUTE_CODE = "sd_metal_purity";

function normalizeMetalKey(value: string): string {
  return value.trim().toLowerCase().replace(/[_\s]+/g, "-");
}

export function normalizeMetalPurityKey(value: string): string {
  const compact = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
  const match = compact.match(/(\d+)k/);
  return match ? `${match[1]}k` : compact;
}

function matchesMetalKey(candidate: string | undefined, metalId: string): boolean {
  if (!candidate) {
    return false;
  }

  return normalizeMetalKey(candidate) === normalizeMetalKey(metalId);
}

function matchesPurityKey(candidate: string | undefined, purity: string): boolean {
  if (!candidate || !purity) {
    return false;
  }

  return normalizeMetalPurityKey(candidate) === normalizeMetalPurityKey(purity);
}

export function getConfigurableMetalOption(product: Product) {
  const options = product.configurable?.options ?? [];
  return (
    options.find((option) => option.attributeCode === METAL_ATTRIBUTE_CODE) ??
    options.find(
      (option) =>
        option.attributeCode !== PURITY_ATTRIBUTE_CODE &&
        (/metal/i.test(option.attributeCode) || /metal/i.test(option.label)) &&
        !/purity/i.test(option.attributeCode) &&
        !/purity/i.test(option.label),
    )
  );
}

export function getVariantMetalPurity(variant: ProductConfigurableVariant): string | undefined {
  return variant.attributes[PURITY_ATTRIBUTE_CODE]?.trim() || undefined;
}

function variantMatchesMetal(
  variant: ProductConfigurableVariant,
  metalId: string,
  attributeCode: string,
): boolean {
  return matchesMetalKey(variant.attributes[attributeCode], metalId);
}

function variantMatchesAnyPurity(
  variant: ProductConfigurableVariant,
  purities: readonly string[],
): boolean {
  if (purities.length === 0) {
    return true;
  }

  const variantPurity = getVariantMetalPurity(variant);
  return purities.some((purity) => matchesPurityKey(variantPurity, purity));
}

export function parsePreferredMetalPurities(value: string | null | undefined): string[] {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function findConfigurableVariantForMetal(
  product: Product,
  metalId: string,
  preferredPurities: readonly string[] = [],
): ProductConfigurableVariant | undefined {
  if (!product.configurable?.variants.length) {
    return undefined;
  }

  if (!metalId) {
    return preferredPurities.length > 0
      ? product.configurable.variants.find((variant) =>
          variantMatchesAnyPurity(variant, preferredPurities),
        )
      : undefined;
  }

  const metalOption = getConfigurableMetalOption(product);
  const attributeCode = metalOption?.attributeCode ?? METAL_ATTRIBUTE_CODE;
  const matchingMetal = product.configurable.variants.filter((variant) =>
    variantMatchesMetal(variant, metalId, attributeCode),
  );

  if (matchingMetal.length === 0) {
    if (preferredPurities.length === 0) {
      return undefined;
    }

    return product.configurable.variants.find((variant) =>
      variantMatchesAnyPurity(variant, preferredPurities),
    );
  }

  return (
    matchingMetal.find((variant) => variantMatchesAnyPurity(variant, preferredPurities)) ??
    matchingMetal[0]
  );
}

function formatPurityDisplayLabel(purity: string): string {
  const key = normalizeMetalPurityKey(purity);
  const karat = key.match(/^(\d+)k$/);
  if (karat) {
    return `${karat[1]}K`;
  }

  return purity.trim();
}

function overlayMetalPurityAttributes(product: Product, purity: string): Product["detailAttributes"] {
  const purityLabel = `${formatPurityDisplayLabel(purity)} Metal`;
  const existing = product.detailAttributes ?? [];

  if (existing.length === 0) {
    return [purityLabel];
  }

  let replaced = false;
  const next = existing.map((attribute) => {
    if (/\d+\s*k/i.test(attribute)) {
      replaced = true;
      return purityLabel;
    }

    return attribute;
  });

  return replaced ? next : [purityLabel, ...next];
}

/** Overlay selected configurable metal variant price/images onto the parent product for PDP display. */
export function applySelectedMetalVariant(
  product: Product,
  metalId: string,
  preferredPurities: readonly string[] = [],
): Product {
  const variant = findConfigurableVariantForMetal(product, metalId, preferredPurities);
  if (!variant) {
    return product;
  }

  const purity = getVariantMetalPurity(variant);
  const metalColorLabel = variant.attributes[METAL_ATTRIBUTE_CODE]?.trim();
  const metal = [purity, metalColorLabel].filter(Boolean).join(" ") || product.metal;

  return {
    ...product,
    price: variant.price,
    originalPrice: variant.originalPrice,
    image: variant.image,
    images: variant.images,
    lifestyleImage: variant.images[1] ?? variant.image,
    inStock: variant.inStock,
    metal,
    metalColorValue: normalizeMetalKey(metalId),
    ...(purity ? { detailAttributes: overlayMetalPurityAttributes(product, purity) } : {}),
    ...(variant.priceBreakup ? { priceBreakup: variant.priceBreakup } : {}),
  };
}

export function getConfigurableOptionUidsForMetal(
  product: Product,
  metalId: string,
  preferredPurities: readonly string[] = [],
): string[] {
  return findConfigurableVariantForMetal(product, metalId, preferredPurities)?.optionUids ?? [];
}

export function getDefaultMetalColorIdForPurities(
  product: Product,
  fallbackMetalId: string,
  preferredPurities: readonly string[],
): string {
  if (preferredPurities.length === 0) {
    return fallbackMetalId;
  }

  const metalOption = getConfigurableMetalOption(product);
  const attributeCode = metalOption?.attributeCode ?? METAL_ATTRIBUTE_CODE;
  const matching = product.configurable?.variants.find((variant) =>
    variantMatchesAnyPurity(variant, preferredPurities),
  );

  if (!matching) {
    return fallbackMetalId;
  }

  const metalFromVariant = matching.attributes[attributeCode]?.trim();
  return metalFromVariant ? normalizeMetalKey(metalFromVariant) : fallbackMetalId;
}
