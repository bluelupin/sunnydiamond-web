import { magentoGraphqlFetch } from "../graphqlClient";
import { getMagentoJewelleryNavCategories } from "../categories/categories.service";
import { MAGENTO_JEWELLERY_PRODUCTS_QUERY } from "./products.query";
import {
  mapJewellerySortToMagento,
  mapMagentoProductsToJewelleryListing,
} from "./products.mapper";
import {
  buildMagentoProductsFilter,
  EMPTY_JEWELLERY_FILTER_FACETS,
  mapMagentoAggregationsToFacets,
} from "./products.filters.mapper";
import type { MagentoProductsResponse } from "./magentoProduct.types";
import type { JewelleryListingProductsData } from "@/types/magento/jewelleryListing";
import type { JewelleryFilterState } from "@/features/jewellery-product/types";
import { createEmptyFilterState } from "@/features/jewellery-product/data/filters";

export type GetMagentoJewelleryProductsParams = {
  categoryUrlKey?: string | null;
  page?: number;
  pageSize?: number;
  sortValue?: string;
  filters?: JewelleryFilterState;
  facets?: JewelleryListingProductsData["facets"];
  signal?: AbortSignal;
};

async function resolveCategoryIdByUrlKey(
  categoryUrlKey: string,
  signal?: AbortSignal,
): Promise<string | null> {
  const { categories } = await getMagentoJewelleryNavCategories(signal);
  const match = categories.find((category) => category.urlKey === categoryUrlKey);
  return match?.categoryId ?? null;
}

export async function getMagentoJewelleryProducts({
  categoryUrlKey,
  page = 1,
  pageSize = 9,
  sortValue = "featured",
  filters = createEmptyFilterState(),
  facets = EMPTY_JEWELLERY_FILTER_FACETS,
  signal,
}: GetMagentoJewelleryProductsParams): Promise<JewelleryListingProductsData> {
  const categoryId = categoryUrlKey
    ? await resolveCategoryIdByUrlKey(categoryUrlKey, signal)
    : null;

  const magentoFilter = buildMagentoProductsFilter({
    categoryUrlKey,
    categoryId,
    filters,
    facets,
  });

  const data = await magentoGraphqlFetch<MagentoProductsResponse>({
    query: MAGENTO_JEWELLERY_PRODUCTS_QUERY,
    variables: {
      search: "",
      filter: magentoFilter,
      pageSize,
      currentPage: page,
      sort: mapJewellerySortToMagento(sortValue),
    },
    signal,
    cache: "no-store",
  });

  const responseFacets = mapMagentoAggregationsToFacets(data.products?.aggregations);
  const products = mapMagentoProductsToJewelleryListing(data.products?.items);
  const pageInfo = data.products?.page_info;

  return {
    products,
    totalCount: data.products?.total_count ?? 0,
    currentPage: pageInfo?.current_page ?? page,
    pageSize: pageInfo?.page_size ?? pageSize,
    totalPages: pageInfo?.total_pages ?? 0,
    facets: responseFacets,
  };
}
