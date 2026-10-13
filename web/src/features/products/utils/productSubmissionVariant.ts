import type { Product } from "@/features/products/data/products";
import { findConfigurableVariantForMetal, getConfigurableMetalOption, getVariantMetalPurity } from "./productVariant.utils";

function submissionOptionalText(value: string | null | undefined): string | undefined {
  const text = value?.trim();
  return text ? text : undefined;
}

function resolveConfigurableVariantForSubmission(product: Product) {
  const variants = product.configurable?.variants ?? [];
  if (variants.length === 0) {
    return undefined;
  }

  const byProductSku = product.productSku
    ? variants.find((item) => item.sku === product.productSku)
    : undefined;

  return byProductSku ?? variants.find((variant) => variant.inStock) ?? variants[0];
}

/** Keep the parent identity for links/cart; snapshot the exact selected child for CMS forms. */
export function getProductSubmissionVariant(product: Product) {
  const variants = product.configurable?.variants ?? [];
  const metalOption = getConfigurableMetalOption(product);
  /** Ring-size-only configurables have no metal option row; metal rings always do. */
  const hasMetalConfigurable = Boolean(metalOption);

  if (variants.length) {
    if (!hasMetalConfigurable) {
      const variant = resolveConfigurableVariantForSubmission(product);
      if (!variant?.sku?.trim()) {
        throw new Error("This product's variants are unavailable. Please try again later.");
      }

      return {
        productSku: variant.sku.trim(),
        metalColour: submissionOptionalText(product.metalColour || product.metalColorValue),
        metalPurity: submissionOptionalText(getVariantMetalPurity(variant) || product.metalPurity),
      };
    }

    const variant = product.productSku
      ? variants.find((item) => item.sku === product.productSku)
      : findConfigurableVariantForMetal(product, product.metalColorValue ?? "");
    const attribute = metalOption?.attributeCode ?? "sd_metal_color";
    const colour = variant?.attributes[attribute]?.trim();
    const normalize = (value: string) => value.trim().toLowerCase().replace(/[_\s]+/g, "-");
    if (
      !variant?.sku?.trim() ||
      !colour ||
      !product.metalColorValue ||
      normalize(colour) !== normalize(product.metalColorValue)
    ) {
      throw new Error("Please select an available metal colour before submitting.");
    }
    return {
      productSku: variant.sku.trim(),
      metalColour: colour,
      metalPurity: submissionOptionalText(getVariantMetalPurity(variant)),
    };
  }
  if (product.configurable?.options.length) {
    throw new Error("This product's variants are unavailable. Please try again later.");
  }
  return {
    productSku: product.id,
    metalColour: submissionOptionalText(product.metalColour || product.metalColorValue),
    metalPurity: submissionOptionalText(
      product.metalPurity ||
        product.detailAttributes?.find((value) => /\d+\s*k.*metal/i.test(value))?.match(/\d+\s*k/i)?.[0],
    ),
  };
}
