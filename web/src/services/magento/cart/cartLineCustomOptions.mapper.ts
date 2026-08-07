import type { CartLineOptions } from "@/features/cart/types/cart.types";
import type { ProductCustomOptions } from "@/features/products/types/productCustomOptions";
import { resolveCustomOptionValueUid } from "@/services/magento/products/productCustomOptions.mapper";

export type MagentoCartItemOptionPayload = {
  enteredOptions: Array<{ uid: string; value: string }>;
  selectedOptions: string[];
  customizableOptions: Array<{ uid: string; value_string: string }>;
};

export function buildMagentoCartItemOptionPayload(
  lineOptions: CartLineOptions,
  productCustomOptions?: ProductCustomOptions,
): MagentoCartItemOptionPayload | null {
  if (!productCustomOptions) {
    return null;
  }

  const enteredOptions: Array<{ uid: string; value: string }> = [];
  const selectedOptions: string[] = [];
  const customizableOptions: Array<{ uid: string; value_string: string }> = [];

  const engravingOptionUid = productCustomOptions.engravingText?.optionUid;
  if (engravingOptionUid && lineOptions.engravingSupported) {
    const engraving = lineOptions.engraving?.trim() ?? "";
    if (engraving || "engraving" in lineOptions) {
      enteredOptions.push({
        uid: engravingOptionUid,
        value: engraving,
      });
      customizableOptions.push({
        uid: engravingOptionUid,
        value_string: engraving,
      });
    }
  }

  const engravingFont = lineOptions.engravingFont?.trim();
  const engravingFontUid = resolveCustomOptionValueUid(
    productCustomOptions.engravingFont,
    engravingFont,
  );
  if (engravingFontUid && productCustomOptions.engravingFont?.optionUid && engravingFont) {
    selectedOptions.push(engravingFontUid);
    customizableOptions.push({
      uid: productCustomOptions.engravingFont.optionUid,
      value_string: engravingFont,
    });
  }

  const ringSize = lineOptions.ringSize?.trim();
  const ringSizeUid = resolveCustomOptionValueUid(productCustomOptions.ringSize, ringSize);
  if (ringSizeUid && productCustomOptions.ringSize?.optionUid && ringSize) {
    selectedOptions.push(ringSizeUid);
    customizableOptions.push({
      uid: productCustomOptions.ringSize.optionUid,
      value_string: ringSize,
    });
  }

  const metal = lineOptions.metal?.trim();
  const metalUid = resolveCustomOptionValueUid(productCustomOptions.metal, metal);
  if (metalUid && productCustomOptions.metal?.optionUid && metal) {
    selectedOptions.push(metalUid);
    customizableOptions.push({
      uid: productCustomOptions.metal.optionUid,
      value_string: metal,
    });
  }

  if (
    enteredOptions.length === 0 &&
    selectedOptions.length === 0 &&
    customizableOptions.length === 0
  ) {
    return null;
  }

  return {
    enteredOptions,
    selectedOptions,
    customizableOptions,
  };
}

type MagentoCartCustomizableOption = {
  label?: string | null;
  values?: Array<{
    label?: string | null;
    value?: string | null;
  }> | null;
};

export function mapMagentoCartCustomizableOptionsToLineOptions(
  options: MagentoCartCustomizableOption[] | null | undefined,
): Partial<CartLineOptions> {
  const mapped: Partial<CartLineOptions> = {};

  for (const option of options ?? []) {
    const label = option.label?.trim();
    const value = option.values?.[0];
    const valueLabel = value?.label?.trim();
    const valueText = value?.value?.trim() || valueLabel;
    if (!label || !valueText) {
      continue;
    }

    const normalized = label.toLowerCase();
    if (normalized.includes("engrav")) {
      mapped.engraving = valueText;
      continue;
    }

    if (normalized.includes("font")) {
      mapped.engravingFont = valueLabel || valueText;
      continue;
    }

    if (normalized.includes("size")) {
      mapped.ringSize = valueLabel || valueText;
      continue;
    }

    if (normalized.includes("metal")) {
      mapped.metal = valueLabel || valueText;
    }
  }

  return mapped;
}
