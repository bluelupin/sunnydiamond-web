import type { MagentoAggregation } from "./magentoProduct.types";
import type { JewelleryFilterFacets } from "@/types/magento/jewelleryListing";
import type { JewelleryFilterState } from "@/features/jewellery-product/types";
import type { JewelleryNavCategory } from "@/types/magento/jewelleryNav";
import { formatMagentoFacetLabel, normalizeGemstoneTypeLabel } from "./magentoAttribute.utils";
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
  const option = facets.gemstoneTypes.find((gemstoneType) => gemstoneType.label === selectedLabel);
  if (!option) {
    return [];
  }

  return option.value
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
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
    magentoFilter.price = {
      from: String(Math.round(filters.minPrice)),
      to: String(Math.round(filters.maxPrice)),
    };
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
    const gemstoneValues = resolveSelectedGemstoneTypeValues(filters.gemstoneType, facets);

    if (gemstoneValues.length > 0) {
      magentoFilter.sd_gemstone_type = { in: gemstoneValues };
    }
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

function mapFacetOptions(
  options: Array<{ label?: string | null; value?: string | null; count?: number | null }> | null | undefined,
  formatLabel: (label: string) => string = (label) => label,
) {
  return (options ?? [])
    .map((option) => {
      const rawLabel = option.label?.trim();
      const value = option.value?.trim();

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

  const priceBounds = parsePriceBounds(priceAggregation?.options);

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
    categories,
    metalTypes: mapMetalTypeOptions(metalTypeAggregation?.options),
    metalPurities: mapMetalPurityOptions(purityAggregation?.options),
    gemstoneTypes: mapGemstoneTypeOptions(gemstoneTypeAggregation?.options),
  };
}

export const EMPTY_JEWELLERY_FILTER_FACETS: JewelleryFilterFacets = {
  minPrice: 0,
  maxPrice: 0,
  categories: [],
  metalTypes: [],
  metalPurities: [],
  gemstoneTypes: [],
};
