import type { MagentoCustomAttributeItem } from "./magentoProduct.types";

export function getMagentoCustomAttributeValue(
  items: MagentoCustomAttributeItem[] | null | undefined,
  code: string,
): string | null {
  const item = (items ?? []).find((attribute) => attribute.code?.trim() === code);
  if (!item) {
    return null;
  }

  const selected = item.selected_options?.[0]?.label?.trim() || item.selected_options?.[0]?.value?.trim();
  if (selected) {
    return selected;
  }

  const value = item.value?.trim();
  return value || null;
}

export function isMagentoBooleanTruthy(value: string | null | undefined): boolean {
  if (!value) {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "yes" || normalized === "true";
}

export function isMagentoBestSeller(
  items: MagentoCustomAttributeItem[] | null | undefined,
): boolean {
  return isMagentoBooleanTruthy(getMagentoCustomAttributeValue(items, "is_best_seller"));
}
