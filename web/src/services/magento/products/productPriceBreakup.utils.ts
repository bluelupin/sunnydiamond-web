import type { MagentoCustomAttributeItem } from "./magentoProduct.types";
import { getMagentoCustomAttributeValue } from "./magentoAttribute.utils";

export type ProductPriceBreakupComponents = {
  metalPrice: number;
  diamondPrice: number;
  gemstonePrice: number;
  makingCharge: number;
  gstRate: number;
};

function parseMagentoDecimalAttribute(value: string | null): number | null {
  if (value == null) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseOptionalMagentoDecimalAttribute(value: string | null): number {
  return parseMagentoDecimalAttribute(value) ?? 0;
}

export function resolveMagentoProductPriceBreakup(
  items: MagentoCustomAttributeItem[] | null | undefined,
): ProductPriceBreakupComponents | null {
  const metalPrice = parseMagentoDecimalAttribute(
    getMagentoCustomAttributeValue(items, "sd_metal_price"),
  );
  const diamondPrice = parseMagentoDecimalAttribute(
    getMagentoCustomAttributeValue(items, "sd_diamond_price"),
  );
  const makingCharge = parseMagentoDecimalAttribute(
    getMagentoCustomAttributeValue(items, "sd_making_charge"),
  );
  const gstRate = parseMagentoDecimalAttribute(
    getMagentoCustomAttributeValue(items, "sd_gst_rate"),
  );

  if (
    metalPrice == null ||
    diamondPrice == null ||
    makingCharge == null ||
    gstRate == null
  ) {
    return null;
  }

  const gemstonePrice = parseOptionalMagentoDecimalAttribute(
    getMagentoCustomAttributeValue(items, "sd_gemstone_price"),
  );

  return {
    metalPrice,
    diamondPrice,
    gemstonePrice,
    makingCharge,
    gstRate,
  };
}
