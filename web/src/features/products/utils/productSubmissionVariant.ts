import type { Product } from "@/features/products/data/products";
import { findConfigurableVariantForMetal, getConfigurableMetalOption, getVariantMetalPurity } from "./productVariant.utils";

/** Keep the parent identity for links/cart; snapshot the exact selected child for CMS forms. */
export function getProductSubmissionVariant(product: Product) {
  const variants = product.configurable?.variants ?? [];
  if (variants.length) {
    const variant = product.productSku
      ? variants.find(item => item.sku === product.productSku)
      : findConfigurableVariantForMetal(product, product.metalColorValue ?? "");
    const attribute = getConfigurableMetalOption(product)?.attributeCode ?? "sd_metal_color";
    const colour = variant?.attributes[attribute]?.trim();
    const normalize = (value: string) => value.trim().toLowerCase().replace(/[_\s]+/g, "-");
    if (!variant?.sku?.trim() || !colour || !product.metalColorValue || normalize(colour) !== normalize(product.metalColorValue)) {
      throw new Error("Please select an available metal colour before submitting.");
    }
    return { productSku: variant.sku.trim(), metalColour: colour, metalPurity: getVariantMetalPurity(variant) };
  }
  if (product.configurable?.options.length) {
    throw new Error("This product's variants are unavailable. Please try again later.");
  }
  return { productSku: product.id, metalColour: product.metalColour || product.metalColorValue,
    metalPurity: product.metalPurity || product.detailAttributes?.find(value => /\d+\s*k.*metal/i.test(value))?.match(/\d+\s*k/i)?.[0] };
}
