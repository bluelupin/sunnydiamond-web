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

export function formatMagentoFacetLabel(value: string | null | undefined): string | null {
  if (!value?.trim()) {
    return null;
  }

  return value
    .trim()
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeGemstoneToken(token: string): string {
  return token
    .replace(/_+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function normalizeGemstoneTypeLabel(raw: string | null | undefined): string | null {
  if (!raw?.trim()) {
    return null;
  }

  const parts = raw
    .split(/[,;]/)
    .map((part) => normalizeGemstoneToken(part))
    .filter(Boolean);

  if (parts.length === 0) {
    return null;
  }

  return Array.from(new Set(parts)).join(", ");
}
