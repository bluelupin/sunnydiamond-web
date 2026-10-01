import { slugifyOccasionTitle } from "@/features/jewellery-product/utils/occasionListing";
import type { JewelleryFilterFacetOption } from "@/types/magento/jewelleryListing";

export type GiftCardOccasionOption = {
  label: string;
  value: string;
};

/** Display labels in title case (e.g. `evening & parties` → `Evening & Parties`). */
export function formatGiftCardOccasionLabel(label: string): string {
  return label
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      if (word.length <= 1) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

export function mapMagentoOccasionsToGiftCardOptions(
  options: JewelleryFilterFacetOption[],
): GiftCardOccasionOption[] {
  return options
    .map((option) => {
      const slug = slugifyOccasionTitle(option.label);
      const value = slug || option.value?.trim();
      const label = option.label?.trim();
      if (!label || !value) return null;

      return { label: formatGiftCardOccasionLabel(label), value };
    })
    .filter((option): option is GiftCardOccasionOption => option !== null);
}
