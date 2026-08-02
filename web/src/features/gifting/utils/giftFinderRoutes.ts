import { buildJewelleryCategoryHref, isJewelleryCategoryUrlKey } from "@/features/jewellery-product/utils/jewelleryRoutes";
import { slugifyOccasionTitle } from "@/features/jewellery-product/utils/occasionListing";
import type { JewelleryFilterState } from "@/features/jewellery-product/types";
import type { JewelleryFilterFacets } from "@/types/magento/jewelleryListing";
import type { JewelleryNavCategoriesData } from "@/types/magento/jewelleryNav";
import { giftingPageContent } from "../data/content";

export type GiftingDiscoverSelectOption = {
  label: string;
  value: string;
};

export type GiftingDiscoverPriceOption = {
  label: string;
  min: number;
  max: number;
};

export type GiftingDiscoverOptions = {
  categories: GiftingDiscoverSelectOption[];
  occasions: GiftingDiscoverSelectOption[];
  priceRanges: GiftingDiscoverPriceOption[];
};

export function parseGiftFinderPriceParam(value: string | null | undefined): number {
  if (!value?.trim()) {
    return 0;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return Math.round(parsed);
}

export function hasGiftFinderSearchParams(searchParams: {
  occasion?: string;
  minPrice?: string;
  maxPrice?: string;
}): boolean {
  return Boolean(
    searchParams.occasion?.trim() ||
      parseGiftFinderPriceParam(searchParams.minPrice) > 0 ||
      parseGiftFinderPriceParam(searchParams.maxPrice) > 0,
  );
}

export function buildGiftFinderHref({
  categoryUrlKey,
  occasionSlug,
  minPrice,
  maxPrice,
}: {
  categoryUrlKey: string;
  occasionSlug: string;
  minPrice: number;
  maxPrice: number;
}): string {
  const baseHref = categoryUrlKey
    ? buildJewelleryCategoryHref(categoryUrlKey)
    : "/jewellery";

  const params = new URLSearchParams();

  if (occasionSlug.trim()) {
    params.set("occasion", occasionSlug.trim());
  }

  if (minPrice > 0) {
    params.set("minPrice", String(minPrice));
  }

  if (maxPrice > 0) {
    params.set("maxPrice", String(maxPrice));
  }

  const query = params.toString();
  if (!query) {
    return baseHref;
  }

  return `${baseHref}?${query}`;
}

export function mapGiftingDiscoverOptions(
  nav: JewelleryNavCategoriesData,
  facets: JewelleryFilterFacets,
): GiftingDiscoverOptions {
  const { discover } = giftingPageContent;

  const categoriesFromNav = nav.categories
    .filter((category) => category.urlKey && isJewelleryCategoryUrlKey(category.urlKey))
    .map((category) => ({
      label: category.label,
      value: category.urlKey!,
    }));

  const occasionsFromFacets = facets.occasions.map((option) => ({
    label: option.label,
    value: slugifyOccasionTitle(option.label),
  }));

  return {
    categories:
      categoriesFromNav.length > 0
        ? categoriesFromNav
        : [...discover.categories],
    occasions:
      occasionsFromFacets.length > 0
        ? occasionsFromFacets
        : [...discover.occasions],
    priceRanges: [...discover.priceRanges],
  };
}

export function applyGiftFinderPriceToFilterState(
  filters: JewelleryFilterState,
  facets: Pick<JewelleryFilterFacets, "minPrice" | "maxPrice">,
  minFromUrl: number,
  maxFromUrl: number,
): JewelleryFilterState {
  if (minFromUrl <= 0 && maxFromUrl <= 0) {
    return filters;
  }

  if (facets.maxPrice <= facets.minPrice) {
    return filters;
  }

  const minPrice = minFromUrl > 0 ? minFromUrl : facets.minPrice;
  const maxPrice = maxFromUrl > 0 ? maxFromUrl : facets.maxPrice;
  const clampedMin = Math.max(facets.minPrice, Math.min(minPrice, facets.maxPrice));
  const clampedMax = Math.max(clampedMin, Math.min(maxPrice, facets.maxPrice));

  return {
    ...filters,
    minPrice: clampedMin,
    maxPrice: clampedMax,
  };
}
