import { magentoGraphqlFetch } from "../graphqlClient";
import { getMagentoJewelleryNavCategories } from "../categories/categories.service";
import { MAGENTO_JEWELLERY_PRODUCTS_QUERY } from "./products.query";
import { MAGENTO_PRODUCTS_BY_SKUS_QUERY } from "./productsBySkus.query";
import {
  mapJewellerySortToMagento,
  mapMagentoProductsToJewelleryListing,
} from "./products.mapper";
import {
  buildMagentoProductsFilter,
  EMPTY_JEWELLERY_FILTER_FACETS,
  mapMagentoAggregationsToFacets,
} from "./products.filters.mapper";
import type { MagentoProductListItem, MagentoProductsResponse } from "./magentoProduct.types";
import type { JewelleryListingProductsData } from "@/types/magento/jewelleryListing";
import type { JewelleryFilterState, JewelleryListingProduct } from "@/features/jewellery-product/types";
import { createEmptyFilterState } from "@/features/jewellery-product/data/filters";

const WISHLIST_SKU_BATCH_SIZE = 50;

type MagentoProductsBySkusResponse = {
  products?: {
    items?: MagentoProductListItem[] | null;
  } | null;
};

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

async function fetchMagentoProductsBySkuBatch(
  skus: string[],
  signal?: AbortSignal,
): Promise<JewelleryListingProduct[]> {
  if (skus.length === 0) {
    return [];
  }

  const data = await magentoGraphqlFetch<MagentoProductsBySkusResponse>({
    query: MAGENTO_PRODUCTS_BY_SKUS_QUERY,
    variables: {
      filter: { sku: { in: skus } },
      pageSize: skus.length,
    },
    signal,
    cache: "no-store",
  });

  return mapMagentoProductsToJewelleryListing(data.products?.items);
}

export async function getMagentoProductsBySkus(
  skus: string[],
  signal?: AbortSignal,
): Promise<JewelleryListingProduct[]> {
  const uniqueSkus = Array.from(
    new Set(skus.map((sku) => sku.trim()).filter((sku) => sku.length > 0)),
  );

  if (uniqueSkus.length === 0) {
    return [];
  }

  const batches: string[][] = [];
  for (let index = 0; index < uniqueSkus.length; index += WISHLIST_SKU_BATCH_SIZE) {
    batches.push(uniqueSkus.slice(index, index + WISHLIST_SKU_BATCH_SIZE));
  }

  const results = await Promise.all(
    batches.map((batch) => fetchMagentoProductsBySkuBatch(batch, signal)),
  );

  return results.flat();
}
