import { formatMetalColorLabel } from "@/features/products/utils/metalColorOptions.utils";
import { classifyCustomOptionLabel } from "@/services/magento/products/productCustomOptions.mapper";
import type {
  CustomerOrderItem,
  CustomerOrderItemOption,
} from "@/services/customer/customer-account.types";
import type { OrderGiftMetadata } from "./orderGiftDetection.utils";
import { isOrderItemGiftMarked } from "./orderGiftDetection.utils";

function normalizeKey(text: string): string {
  return text.trim().toLowerCase();
}

function getAllOptions(item: CustomerOrderItem): CustomerOrderItemOption[] {
  return [...item.selectedOptions, ...item.enteredOptions];
}

function findOptionValue(
  options: CustomerOrderItemOption[],
  labelPatterns: string[],
): string | undefined {
  for (const option of options) {
    const label = normalizeKey(option.label);
    if (labelPatterns.some((pattern) => label.includes(pattern))) {
      return option.value.trim();
    }
  }

  return undefined;
}

/** The native "Engraving Text" option — canonical classifier keeps font ordering right. */
function isEngravingTextLabel(label: string): boolean {
  return classifyCustomOptionLabel(label) === "engravingText";
}

function detectBespoke(item: CustomerOrderItem, options: CustomerOrderItemOption[]): boolean {
  const sku = item.productSku?.toLowerCase() ?? "";
  const name = item.productName.toLowerCase();

  if (sku.includes("bespoke") || name.includes("bespoke")) {
    return true;
  }

  return options.some((option) => {
    const label = normalizeKey(option.label);
    const value = normalizeKey(option.value);

    // Customer-entered engraving text saying "Bespoke" must not flag the item.
    return label.includes("bespoke") || (!isEngravingTextLabel(label) && value.includes("bespoke"));
  });
}

export function mapCustomerOrderItemToDisplayFields(
  item: CustomerOrderItem,
  giftMetadata?: OrderGiftMetadata,
) {
  const options = getAllOptions(item);
  const size = findOptionValue(options, ["ring size", "size"]);
  const metalRaw = findOptionValue(options, ["metal color", "metal", "color"]);
  const metal = metalRaw ? formatMetalColorLabel(metalRaw) || metalRaw : undefined;
  const engraving = item.enteredOptions
    .find((option) => isEngravingTextLabel(normalizeKey(option.label)))
    ?.value.trim();
  const engravingFont = item.selectedOptions
    .find((option) => classifyCustomOptionLabel(option.label) === "engravingFont")
    ?.value.trim();

  return {
    size,
    metal,
    engraving: engraving || undefined,
    engravingFont: engravingFont || undefined,
    isGift: isOrderItemGiftMarked(
      giftMetadata,
      item.productName,
      item.productSku,
      options,
    ),
    isBespoke: detectBespoke(item, options),
  };
}
