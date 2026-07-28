import { formatMetalColorLabel } from "@/features/products/utils/metalColorOptions.utils";
import type {
  CustomerOrderItem,
  CustomerOrderItemOption,
} from "@/services/customer/customer-account.types";

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

function detectGift(options: CustomerOrderItemOption[]): boolean {
  return options.some((option) => {
    const label = normalizeKey(option.label);
    const value = normalizeKey(option.value);

    return (
      label.includes("gift") &&
      (value === "yes" || value === "true" || value.includes("gift wrap"))
    );
  });
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

    return label.includes("bespoke") || value.includes("bespoke");
  });
}

export function mapCustomerOrderItemToDisplayFields(item: CustomerOrderItem) {
  const options = getAllOptions(item);
  const size = findOptionValue(options, ["ring size", "size"]);
  const metalRaw = findOptionValue(options, ["metal color", "metal", "color"]);
  const metal = metalRaw ? formatMetalColorLabel(metalRaw) || metalRaw : undefined;

  return {
    size,
    metal,
    isGift: detectGift(options),
    isBespoke: detectBespoke(item, options),
  };
}
