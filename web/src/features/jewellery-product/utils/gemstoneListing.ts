import type { JewelleryFilterFacetOption } from "@/types/magento/jewelleryListing";
import { normalizeGemstoneTypeLabel } from "@/services/magento/products/magentoAttribute.utils";

/** Resolve a selected gemstone label (or raw Magento value) against facet options. */
export function resolveGemstoneTypeFacetOption(
  selected: string | null | undefined,
  gemstoneTypes: readonly JewelleryFilterFacetOption[] = [],
): JewelleryFilterFacetOption | null {
  const raw = selected?.trim();
  if (!raw) {
    return null;
  }

  const exact = gemstoneTypes.find((option) => option.label === raw);
  if (exact) {
    return exact;
  }

  const normalized = raw.toLowerCase();
  const caseInsensitive = gemstoneTypes.find(
    (option) => option.label.toLowerCase() === normalized,
  );
  if (caseInsensitive) {
    return caseInsensitive;
  }

  const normalizedLabel = normalizeGemstoneTypeLabel(raw);
  if (normalizedLabel) {
    const byNormalizedLabel = gemstoneTypes.find((option) => option.label === normalizedLabel);
    if (byNormalizedLabel) {
      return byNormalizedLabel;
    }
  }

  return (
    gemstoneTypes.find((option) => {
      const values = option.value
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);

      return values.includes(normalized) || option.value.trim().toLowerCase() === normalized;
    }) ?? null
  );
}
