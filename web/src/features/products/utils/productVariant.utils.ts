import type { Product, ProductConfigurableVariant } from "@/features/products/data/products";

const METAL_ATTRIBUTE_CODE = "sd_metal_color";

function normalizeMetalKey(value: string): string {
  return value.trim().toLowerCase().replace(/[_\s]+/g, "-");
}

function matchesMetalKey(candidate: string | undefined, metalId: string): boolean {
  if (!candidate) {
    return false;
  }

  return normalizeMetalKey(candidate) === normalizeMetalKey(metalId);
}

export function getConfigurableMetalOption(product: Product) {
  const options = product.configurable?.options ?? [];
  return (
    options.find((option) => option.attributeCode === METAL_ATTRIBUTE_CODE) ??
    options.find(
      (option) =>
        /metal/i.test(option.attributeCode) || /metal/i.test(option.label),
    )
  );
}

export function findConfigurableVariantForMetal(
  product: Product,
  metalId: string,
): ProductConfigurableVariant | undefined {
  if (!metalId || !product.configurable?.variants.length) {
    return undefined;
  }

  const metalOption = getConfigurableMetalOption(product);
  const attributeCode = metalOption?.attributeCode ?? METAL_ATTRIBUTE_CODE;

  return product.configurable.variants.find((variant) =>
    matchesMetalKey(variant.attributes[attributeCode], metalId),
  );
}

/** Overlay selected configurable metal variant price/images onto the parent product for PDP display. */
export function applySelectedMetalVariant(product: Product, metalId: string): Product {
  const variant = findConfigurableVariantForMetal(product, metalId);
  if (!variant) {
    return product;
  }

  return {
    ...product,
    price: variant.price,
    originalPrice: variant.originalPrice,
    image: variant.image,
    images: variant.images,
    lifestyleImage: variant.images[1] ?? variant.image,
    inStock: variant.inStock,
    metalColorValue: normalizeMetalKey(metalId),
    ...(variant.priceBreakup ? { priceBreakup: variant.priceBreakup } : {}),
  };
}

export function getConfigurableOptionUidsForMetal(
  product: Product,
  metalId: string,
): string[] {
  return findConfigurableVariantForMetal(product, metalId)?.optionUids ?? [];
}
