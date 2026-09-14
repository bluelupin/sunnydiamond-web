import { slugifyOccasionTitle } from "@/features/jewellery-product/utils/occasionListing";
import type { JewelleryFilterFacetOption } from "@/types/magento/jewelleryListing";
import { giftCardFlowContent } from "../data/content";

export type GiftCardOccasionOption = {
  label: string;
  value: string;
};

export function mapMagentoOccasionsToGiftCardOptions(
  options: JewelleryFilterFacetOption[],
): GiftCardOccasionOption[] {
  const mapped = options.map((option) => {
    const slug = slugifyOccasionTitle(option.label);
    return {
      label: option.label,
      value: slug || option.value,
    };
  });

  if (mapped.length > 0) {
    return mapped;
  }

  return giftCardFlowContent.occasion.fallbackOptions.map((option) => ({ ...option }));
}
