import { slugifyOccasionTitle } from "@/features/jewellery-product/utils/occasionListing";
import type { JewelleryFilterFacetOption } from "@/types/magento/jewelleryListing";

export type GiftCardOccasionOption = {
  label: string;
  value: string;
};

export function mapMagentoOccasionsToGiftCardOptions(
  options: JewelleryFilterFacetOption[],
): GiftCardOccasionOption[] {
  return options
    .map((option) => {
      const slug = slugifyOccasionTitle(option.label);
      const value = slug || option.value?.trim();
      const label = option.label?.trim();
      if (!label || !value) return null;

      return { label, value };
    })
    .filter((option): option is GiftCardOccasionOption => option !== null);
}
