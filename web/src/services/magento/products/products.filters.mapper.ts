import type { MagentoAggregation } from "./magentoProduct.types";
import type { JewelleryFilterFacets, JewelleryFilterFacetOption } from "@/types/magento/jewelleryListing";
import type { JewelleryFilterState } from "@/features/jewellery-product/types";
import type { JewelleryNavCategory } from "@/types/magento/jewelleryNav";
import { resolveDiamondShapeFacetOption } from "@/features/jewellery-product/utils/diamondShapeListing";
import { resolveFancyColourFacetOption } from "@/features/jewellery-product/utils/fancyColourListing";
import { resolveGemstoneTypeFacetOption } from "@/features/jewellery-product/utils/gemstoneListing";
import { resolveOccasionFacetOption } from "@/features/jewellery-product/utils/occasionListing";
import { formatMagentoFacetLabel, normalizeGemstoneTypeLabel } from "./magentoAttribute.utils";
import { getMagentoPriceFilterTaxMultiplier } from "@/services/magento/config";
import {
  isAllCategoriesSelected,
  isAllMetalPuritiesSelected,
  isAllMetalTypesSelected,
  isDefaultPriceRange,
} from "@/features/jewellery-product/data/filters";

export type MagentoProductFilterInput = Record<string, unknown>;

type BuildMagentoProductsFilterParams = {
  categoryUrlKey?: string | null;
  categoryId?: string | null;
  filters: JewelleryFilterState;
  facets: JewelleryFilterFacets;
  /** When false, only the PLP category tab scope is applied (for stable filter options). */
  includeDrawerFilters?: boolean;
};

function resolveSelectedCategoryUids(
  selectedLabels: string[],
  facets: JewelleryFilterFacets,
): string[] {
  const uidByLabel = new Map(
    facets.categories
      .filter((category) => category.value)
      .map((category) => [category.label, category.value]),
  );

  return selectedLabels
    .map((label) => uidByLabel.get(label))
    .filter((value): value is string => Boolean(value));
}

function resolveSelectedMetalPurityValues(
  selectedLabels: string[],
  facets: JewelleryFilterFacets,
): string[] {
  const valueByLabel = new Map(facets.metalPurities.map((option) => [option.label, option.value]));

  return selectedLabels
    .map((label) => valueByLabel.get(label))
    .filter((value): value is string => Boolean(value));
}

function resolveSelectedMetalTypeValues(
  selectedLabels: string[],
  facets: JewelleryFilterFacets,
): string[] {
  const valueByLabel = new Map(facets.metalTypes.map((option) => [option.label, option.value]));

  return selectedLabels
    .map((label) => valueByLabel.get(label))
    .filter((value): value is string => Boolean(value));
}

function resolveSelectedGemstoneTypeValues(
  selectedLabel: string,
  facets: JewelleryFilterFacets,
): string[] {
  const option = resolveGemstoneTypeFacetOption(selectedLabel, facets.gemstoneTypes);
  if (!option) {
    return [];
  }

  return option.value
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

/** Convert PLP display / final price → Magento catalog search indexed price. */
export function toMagentoIndexedPrice(displayPrice: number): number {
  return displayPrice / getMagentoPriceFilterTaxMultiplier();
}

/**
 * Build Magento `price: { from, to }` from UI amounts (final / incl. tax).
 *
 * Magento's search index stores excl-tax prices while PLP cards show `final_price`
 * (incl. tax). Equal from/to also tends to return no hits, so exact matches use a
 * small band around the indexed amount; the listing then keeps products whose
 * rounded final price matches the UI.
 */
export function buildMagentoPriceFilterRange(
  minPrice: number,
  maxPrice: number,
): { from: string; to: string } {
  const fromDisplay = Math.round(minPrice);
  const toDisplay = Math.round(maxPrice);

  if (fromDisplay === toDisplay) {
    const indexed = toMagentoIndexedPrice(fromDisplay);
    return {
      from: String(Math.max(0, Math.floor(indexed) - 1)),
      // Exclusive-friendly upper bound around the indexed excl-tax amount.
      to: String(Math.ceil(indexed) + 1),
    };
  }

  const fromIndexed = toMagentoIndexedPrice(fromDisplay);
  const toIndexed = toMagentoIndexedPrice(toDisplay);

  return {
    from: String(Math.max(0, Math.floor(fromIndexed))),
    // `to` is often exclusive in Magento search — pad so display max stays inclusive.
    to: String(Math.ceil(toIndexed) + 1),
  };
}

export function buildMagentoProductsFilter({
  categoryUrlKey,
  categoryId,
  filters,
  facets,
  includeDrawerFilters = true,
}: BuildMagentoProductsFilterParams): MagentoProductFilterInput | undefined {
  const magentoFilter: MagentoProductFilterInput = {};

  if (!includeDrawerFilters) {
    if (categoryUrlKey && categoryId) {
      magentoFilter.category_id = { eq: categoryId };
    }

    return Object.keys(magentoFilter).length > 0 ? magentoFilter : undefined;
  }

  if (!isDefaultPriceRange(filters, facets)) {
    const from = Math.round(filters.minPrice);
    const to = Math.round(filters.maxPrice);

    if (from > 0 || to > 0) {
      magentoFilter.price = buildMagentoPriceFilterRange(from, to);
    }
  }

  const drawerCategoriesActive = !isAllCategoriesSelected(filters.categories, facets);
  const selectedCategoryUids = resolveSelectedCategoryUids(filters.categories, facets);

  if (drawerCategoriesActive && selectedCategoryUids.length > 0) {
    magentoFilter.category_uid = { in: selectedCategoryUids };
  } else if (categoryUrlKey && categoryId) {
    magentoFilter.category_id = { eq: categoryId };
  }

  if (!isAllMetalPuritiesSelected(filters.metalPurities, facets)) {
    const purityValues = resolveSelectedMetalPurityValues(filters.metalPurities, facets);

    if (purityValues.length > 0) {
      magentoFilter.sd_metal_purity = { in: purityValues };
    }
  }

  if (!isAllMetalTypesSelected(filters.metalTypes, facets)) {
    const typeValues = resolveSelectedMetalTypeValues(filters.metalTypes, facets);

    if (typeValues.length > 0) {
      magentoFilter.sd_metal_type = { in: typeValues };
    }
  }

  if (filters.gemstoneType) {
    let gemstoneValues = resolveSelectedGemstoneTypeValues(filters.gemstoneType, facets);

    if (gemstoneValues.length === 0) {
      const rawGemstone = filters.gemstoneType.trim();
      if (rawGemstone) {
        gemstoneValues = [rawGemstone];
      }
    }

    if (gemstoneValues.length > 0) {
      magentoFilter.sd_gemstone_type = { in: gemstoneValues };
    }
  }

  if (filters.occasion.trim()) {
    // Accept Magento option id ("46") or URL slug ("wedding").
    const occasionOption = resolveOccasionFacetOption(
      filters.occasion,
      facets.occasions,
    );
    const occasionValue = occasionOption?.value ?? filters.occasion.trim();
    magentoFilter.sd_occasions = { in: [occasionValue] };
  }

  if (filters.diamondShape.trim()) {
    // Accept Magento option id ("69") or URL slug ("heart").
    const shapeOption = resolveDiamondShapeFacetOption(
      filters.diamondShape,
      facets.diamondShapes,
    );
    const shapeValue = shapeOption?.value ?? filters.diamondShape.trim();
    magentoFilter.sd_diamond_shape = { in: [shapeValue] };
  }

  if (filters.fancyColour.trim()) {
    // Accept Magento option id ("71") or URL slug ("yellow").
    const colourOption = resolveFancyColourFacetOption(
      filters.fancyColour,
      facets.fancyColours,
    );
    const colourValue = colourOption?.value ?? filters.fancyColour.trim();
    magentoFilter.sd_fancy_colour = { in: [colourValue] };
  }

  return Object.keys(magentoFilter).length > 0 ? magentoFilter : undefined;
}

function parsePriceBounds(
  options: Array<{ label?: string | null }> | null | undefined,
): { minPrice: number; maxPrice: number } {
  let minPrice = Number.POSITIVE_INFINITY;
  let maxPrice = 0;

  for (const option of options ?? []) {
    const label = option.label?.trim();
    if (!label || !label.includes("-")) {
      continue;
    }

    const [fromRaw, toRaw] = label.split("-");
    const from = Number(fromRaw);
    const to = Number(toRaw);

    if (Number.isFinite(from)) {
      minPrice = Math.min(minPrice, from);
    }

    if (Number.isFinite(to)) {
      maxPrice = Math.max(maxPrice, to);
    }
  }

  if (!Number.isFinite(minPrice) || maxPrice <= 0) {
    return { minPrice: 0, maxPrice: 0 };
  }

  return { minPrice, maxPrice };
}

function formatPriceBucketAmount(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function formatPriceBucketLabel(min: number, max: number, index: number, count: number): string {
  if (count === 1) {
    return `${formatPriceBucketAmount(min)} – ${formatPriceBucketAmount(max)}`;
  }
  if (index === 0 && min <= 0) {
    return `Under ${formatPriceBucketAmount(max)}`;
  }
  if (index === count - 1) {
    return `Above ${formatPriceBucketAmount(min)}`;
  }
  return `${formatPriceBucketAmount(min)} – ${formatPriceBucketAmount(max)}`;
}

/** Map Magento `price` aggregation options (`0-25000`) into gift-finder style bands. */
function mapPriceBuckets(
  options: Array<{ label?: string | null }> | null | undefined,
): JewelleryFilterFacets["priceBuckets"] {
  const parsed = (options ?? [])
    .map((option) => {
      const label = option.label?.trim();
      if (!label || !label.includes("-")) {
        return null;
      }

      const [fromRaw, toRaw] = label.split("-");
      const min = Number(fromRaw);
      const max = Number(toRaw);

      if (!Number.isFinite(min) || !Number.isFinite(max) || max < min) {
        return null;
      }

      return {
        min: Math.round(min),
        max: Math.round(max),
      };
    })
    .filter((bucket): bucket is { min: number; max: number } => bucket != null)
    .sort((left, right) => left.min - right.min || left.max - right.max);

  return parsed.map((bucket, index) => ({
    ...bucket,
    label: formatPriceBucketLabel(bucket.min, bucket.max, index, parsed.length),
  }));
}

function mapFacetOptions(
  options: Array<{
    label?: string | null;
    value?: string | number | null;
    count?: number | null;
  }> | null | undefined,
  formatLabel: (label: string) => string = (label) => label,
) {
  return (options ?? [])
    .map((option) => {
      const rawLabel = option.label?.trim();
      const value = option.value == null ? "" : String(option.value).trim();

      if (!rawLabel || !value) {
        return null;
      }

      return {
        label: formatLabel(rawLabel),
        value,
        count: option.count ?? undefined,
      };
    })
    .filter((option): option is NonNullable<typeof option> => option != null);
}

function mapMetalPurityOptions(
  options: Array<{ label?: string | null; value?: string | null; count?: number | null }> | null | undefined,
) {
  return mapFacetOptions(options);
}

function mapMetalTypeOptions(
  options: Array<{ label?: string | null; value?: string | null; count?: number | null }> | null | undefined,
) {
  return mapFacetOptions(options, (label) => formatMagentoFacetLabel(label) ?? label);
}

function mapGemstoneTypeOptions(
  options: Array<{ label?: string | null; value?: string | null; count?: number | null }> | null | undefined,
) {
  const byLabel = new Map<string, { label: string; values: string[]; count?: number }>();

  for (const option of options ?? []) {
    const rawLabel = option.label?.trim();
    const value = option.value?.trim();

    if (!rawLabel || !value) {
      continue;
    }

    const label = normalizeGemstoneTypeLabel(rawLabel);
    if (!label) {
      continue;
    }

    const existing = byLabel.get(label);
    if (existing) {
      existing.values.push(value);
      existing.count = (existing.count ?? 0) + (option.count ?? 0);
      continue;
    }

    byLabel.set(label, {
      label,
      values: [value],
      count: option.count ?? undefined,
    });
  }

  return Array.from(byLabel.values())
    .map(({ label, values, count }) => ({
      label,
      value: values.join(","),
      count,
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
}

/** Merge aggregation facets with live Magento attribute options for filter resolution. */
export function mergeGemstoneTypeFacetOptions(
  primary: readonly JewelleryFilterFacetOption[],
  fallback: readonly JewelleryFilterFacetOption[],
): JewelleryFilterFacetOption[] {
  if (fallback.length === 0) {
    return [...primary];
  }

  const rawOptions: Array<{ label?: string | null; value?: string | null; count?: number | null }> =
    [];

  for (const option of primary) {
    const values = option.value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);

    if (values.length === 0) {
      continue;
    }

    for (const value of values) {
      rawOptions.push({ label: option.label, value, count: option.count });
    }
  }

  for (const option of fallback) {
    rawOptions.push({
      label: option.label,
      value: option.value,
      count: option.count,
    });
  }

  return mapGemstoneTypeOptions(rawOptions);
}

export function enrichFacetsWithNavCategories(
  facets: JewelleryFilterFacets,
  navCategories: JewelleryNavCategory[],
): JewelleryFilterFacets {
  const categoriesByValue = new Map(facets.categories.map((category) => [category.value, category]));

  for (const navCategory of navCategories) {
    if (!navCategory.urlKey || navCategory.slug === "all") {
      continue;
    }

    const value = navCategory.id.trim();
    if (!value || categoriesByValue.has(value)) {
      continue;
    }

    categoriesByValue.set(value, {
      label: navCategory.label,
      value,
      count: navCategory.productCount > 0 ? navCategory.productCount : undefined,
    });
  }

  const categories = Array.from(categoriesByValue.values()).sort((left, right) =>
    left.label.localeCompare(right.label),
  );

  return {
    ...facets,
    categories,
  };
}

export function mapMagentoAggregationsToFacets(
  aggregations: MagentoAggregation[] | null | undefined,
): JewelleryFilterFacets {
  const aggregationList = aggregations ?? [];
  const priceAggregation = aggregationList.find((item) => item?.attribute_code === "price");
  const categoryAggregation = aggregationList.find((item) => item?.attribute_code === "category_uid");
  const metalTypeAggregation = aggregationList.find((item) => item?.attribute_code === "sd_metal_type");
  const purityAggregation = aggregationList.find((item) => item?.attribute_code === "sd_metal_purity");
  const gemstoneTypeAggregation = aggregationList.find(
    (item) => item?.attribute_code === "sd_gemstone_type",
  );
  const occasionsAggregation = aggregationList.find(
    (item) => item?.attribute_code === "sd_occasions",
  );
  const diamondShapeAggregation = aggregationList.find(
    (item) => item?.attribute_code === "sd_diamond_shape",
  );
  const fancyColourAggregation = aggregationList.find(
    (item) => item?.attribute_code === "sd_fancy_colour",
  );

  const priceBounds = parsePriceBounds(priceAggregation?.options);
  const priceBuckets = mapPriceBuckets(priceAggregation?.options);

  const categories = (categoryAggregation?.options ?? [])
    .map((option) => {
      const label = option?.label?.trim();
      const value = option?.value?.trim();

      if (!label || !value) {
        return null;
      }

      return {
        label,
        value,
        count: option?.count ?? undefined,
      };
    })
    .filter((option): option is NonNullable<typeof option> => option != null);

  return {
    minPrice: priceBounds.minPrice,
    maxPrice: priceBounds.maxPrice,
    priceBuckets,
    categories,
    metalTypes: mapMetalTypeOptions(metalTypeAggregation?.options),
    metalPurities: mapMetalPurityOptions(purityAggregation?.options),
    gemstoneTypes: mapGemstoneTypeOptions(gemstoneTypeAggregation?.options),
    occasions: mapFacetOptions(occasionsAggregation?.options, (label) => formatMagentoFacetLabel(label) ?? label),
    diamondShapes: mapFacetOptions(
      diamondShapeAggregation?.options,
      (label) => formatMagentoFacetLabel(label) ?? label,
    ),
    fancyColours: mapFacetOptions(
      fancyColourAggregation?.options,
      (label) => formatMagentoFacetLabel(label) ?? label,
    ),
  };
}

export const EMPTY_JEWELLERY_FILTER_FACETS: JewelleryFilterFacets = {
  minPrice: 0,
  maxPrice: 0,
  priceBuckets: [],
  categories: [],
  metalTypes: [],
  metalPurities: [],
  gemstoneTypes: [],
  occasions: [],
  diamondShapes: [],
  fancyColours: [],
};
