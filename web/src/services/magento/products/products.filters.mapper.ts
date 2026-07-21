import type { MagentoAggregation } from "./magentoProduct.types";
import type { JewelleryFilterFacets } from "@/types/magento/jewelleryListing";
import type { JewelleryFilterState } from "@/features/jewellery-product/types";
import {
  isAllCategoriesSelected,
  isAllMetalPuritiesSelected,
  isDefaultPriceRange,
} from "@/features/jewellery-product/data/filters";

export type MagentoProductFilterInput = Record<string, unknown>;

type BuildMagentoProductsFilterParams = {
  categoryUrlKey?: string | null;
  categoryId?: string | null;
  filters: JewelleryFilterState;
  facets: JewelleryFilterFacets;
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

export function buildMagentoProductsFilter({
  categoryUrlKey,
  categoryId,
  filters,
  facets,
}: BuildMagentoProductsFilterParams): MagentoProductFilterInput | undefined {
  const magentoFilter: MagentoProductFilterInput = {};

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

function mapMetalPurityOptions(
  options: Array<{ label?: string | null; value?: string | null; count?: number | null }> | null | undefined,
) {
  return (options ?? [])
    .map((option) => {
      const label = option.label?.trim();
      const value = option.value?.trim();

      if (!label || !value) {
        return null;
      }

      return {
        label,
        value,
        count: option.count ?? undefined,
      };
    })
    .filter((option): option is NonNullable<typeof option> => option != null);
}

export function mapMagentoAggregationsToFacets(
  aggregations: MagentoAggregation[] | null | undefined,
): JewelleryFilterFacets {
  const aggregationList = aggregations ?? [];
  const priceAggregation = aggregationList.find((item) => item?.attribute_code === "price");
  const categoryAggregation = aggregationList.find((item) => item?.attribute_code === "category_uid");
  const purityAggregation = aggregationList.find((item) => item?.attribute_code === "sd_metal_purity");

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
    metalPurities: mapMetalPurityOptions(purityAggregation?.options),
  };
}

export const EMPTY_JEWELLERY_FILTER_FACETS: JewelleryFilterFacets = {
  minPrice: 0,
  maxPrice: 0,
  categories: [],
  metalPurities: [],
};
