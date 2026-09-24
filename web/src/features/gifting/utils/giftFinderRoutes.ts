import { createEmptyFilterState } from "@/features/jewellery-product/data/filters";
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

export type GiftFinderSearchParams = {
  occasion?: string | null;
  diamondShape?: string | null;
  fancyColour?: string | null;
  collection?: string | null;
  minPrice?: string | null;
  maxPrice?: string | null;
};

export function buildGiftFinderListingFiltersFromUrl(
  searchParams: GiftFinderSearchParams,
  facets?: Pick<JewelleryFilterFacets, "minPrice" | "maxPrice">,
): JewelleryFilterState {
  const filters = createEmptyFilterState();

  const occasion = searchParams.occasion?.trim();
  if (occasion) {
    filters.occasion = occasion;
  }

  const diamondShape = searchParams.diamondShape?.trim();
  if (diamondShape) {
    filters.diamondShape = diamondShape;
  }

  const fancyColour = searchParams.fancyColour?.trim();
  if (fancyColour) {
    filters.fancyColour = fancyColour;
  }

  const collection = searchParams.collection?.trim();
  if (collection) {
    filters.collection = collection;
  }

  const minFromUrl = parseGiftFinderPriceParam(searchParams.minPrice);
  const maxFromUrl = parseGiftFinderPriceParam(searchParams.maxPrice);

  if (facets && (minFromUrl > 0 || maxFromUrl > 0)) {
    return applyGiftFinderPriceToFilterState(filters, facets, minFromUrl, maxFromUrl);
  }

  if (minFromUrl > 0) {
    filters.minPrice = minFromUrl;
  }

  if (maxFromUrl > 0) {
    filters.maxPrice = maxFromUrl;
  }

  return filters;
}

export function hasGiftFinderSearchParams(searchParams: GiftFinderSearchParams): boolean {
  return Boolean(
    searchParams.occasion?.trim() ||
      searchParams.diamondShape?.trim() ||
      searchParams.fancyColour?.trim() ||
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
  nav: JewelleryNavCategoriesData | null | undefined,
  facets: JewelleryFilterFacets | null | undefined,
): GiftingDiscoverOptions {
  const { discover } = giftingPageContent;

  const categoriesFromNav = (nav?.categories ?? [])
    .filter((category) => category.urlKey && isJewelleryCategoryUrlKey(category.urlKey))
    .map((category) => ({
      label: category.label,
      value: category.urlKey!,
    }));

  const seenOccasionValues = new Set<string>();
  const occasionsFromFacets: GiftingDiscoverSelectOption[] = [];

  for (const option of facets?.occasions ?? []) {
    const label = option.label?.trim();
    if (!label) continue;

    const slug = slugifyOccasionTitle(option.label);
    const value = slug || option.value?.trim();
    if (!value || seenOccasionValues.has(value)) continue;

    seenOccasionValues.add(value);
    occasionsFromFacets.push({ label, value });
  }

  // Magento price aggregation buckets when available; otherwise static UI bands.
  const priceRangesFromMagento = (facets?.priceBuckets ?? []).map((bucket) => ({
    label: bucket.label,
    min: bucket.min,
    max: bucket.max,
  }));

  return {
    categories: categoriesFromNav,
    occasions: occasionsFromFacets,
    priceRanges:
      priceRangesFromMagento.length > 0
        ? priceRangesFromMagento
        : [...discover.priceRanges],
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
