import { magentoGraphqlFetch } from "../graphqlClient";
import { getMagentoJewelleryNavCategories } from "../categories/categories.service";
import {
  MAGENTO_JEWELLERY_PRODUCT_FACETS_QUERY,
  MAGENTO_JEWELLERY_PRODUCTS_QUERY,
} from "./products.query";
import { MAGENTO_PRODUCTS_BY_SKUS_QUERY } from "./productsBySkus.query";
import {
  mapJewellerySortToMagento,
  mapMagentoProductsToJewelleryListing,
} from "./products.mapper";
import {
  buildMagentoProductsFilter,
  EMPTY_JEWELLERY_FILTER_FACETS,
  enrichFacetsWithNavCategories,
  mapMagentoAggregationsToFacets,
  mergeGemstoneTypeFacetOptions,
} from "./products.filters.mapper";
import {
  getMagentoProductAttributeOptions,
  mergeFacetOptions,
} from "./productAttributeOptions.service";
import { resolveOccasionFacetOption } from "@/features/jewellery-product/utils/occasionListing";
import type { MagentoProductListItem, MagentoProductsResponse } from "./magentoProduct.types";
import type { JewelleryFilterFacets, JewelleryListingProductsData } from "@/types/magento/jewelleryListing";
import type { JewelleryFilterState, JewelleryListingProduct } from "@/features/jewellery-product/types";
import {
  createEmptyFilterState,
  getExactJewelleryPriceFilter,
  getJewelleryListingFiltersKey,
  isDefaultPriceRange,
  PAGE_SIZE,
} from "@/features/jewellery-product/data/filters";
import { measureJewelleryPlpGraphql } from "@/features/jewellery-product/utils/jewelleryPlpPerformance";
import { magentoQueryKeys } from "@/hooks/magento/queryKeys";
import {
  getCmsCacheEntry,
  isCmsCacheFresh,
  seedCmsCacheEntry,
  setCmsCacheEntry,
} from "@/lib/homepage/cmsCache";
import type { JewelleryNavCategoriesData } from "@/types/magento/jewelleryNav";

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
  /** When false, skips the extra aggregation query (use for pagination). */
  includeFacets?: boolean;
  signal?: AbortSignal;
};

const NAV_CATEGORIES_CACHE_TTL_MS = 5 * 60 * 1000;
const JEWELLERY_NAV_CACHE_KEY = magentoQueryKeys.jewelleryNav;
const LISTING_RESULT_CACHE_TTL_MS = 60_000;

const listingInFlight = new Map<string, Promise<JewelleryListingProductsData>>();
const listingResultCache = new Map<
  string,
  { data: JewelleryListingProductsData; fetchedAt: number }
>();

function buildJewelleryListingRequestKey(params: GetMagentoJewelleryProductsParams): string {
  const filters = params.filters ?? createEmptyFilterState();
  const facets = params.facets ?? EMPTY_JEWELLERY_FILTER_FACETS;

  return JSON.stringify({
    categoryUrlKey: params.categoryUrlKey ?? null,
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 9,
    sortValue: params.sortValue ?? "featured",
    filtersKey: getJewelleryListingFiltersKey(filters, facets),
    includeFacets: params.includeFacets !== false,
  });
}

async function getJewelleryNavCategoriesCached(signal?: AbortSignal): Promise<JewelleryNavCategoriesData> {
  if (typeof window !== "undefined") {
    const cached = getCmsCacheEntry<JewelleryNavCategoriesData>(JEWELLERY_NAV_CACHE_KEY);

    if (cached?.value && isCmsCacheFresh(JEWELLERY_NAV_CACHE_KEY, NAV_CATEGORIES_CACHE_TTL_MS)) {
      return cached.value;
    }

    if (cached?.promise) {
      return cached.promise;
    }
  }

  const fetchPromise = getMagentoJewelleryNavCategories(signal);

  if (typeof window !== "undefined") {
    const existing = getCmsCacheEntry<JewelleryNavCategoriesData>(JEWELLERY_NAV_CACHE_KEY);
    setCmsCacheEntry(JEWELLERY_NAV_CACHE_KEY, {
      value: existing?.value,
      promise: fetchPromise,
      error: undefined,
      updatedAt: existing?.updatedAt ?? 0,
    });
  }

  try {
    const data = await fetchPromise;

    if (typeof window !== "undefined") {
      seedCmsCacheEntry(JEWELLERY_NAV_CACHE_KEY, data);
    }

    return data;
  } catch (error) {
    if (typeof window !== "undefined") {
      const existing = getCmsCacheEntry<JewelleryNavCategoriesData>(JEWELLERY_NAV_CACHE_KEY);
      setCmsCacheEntry(JEWELLERY_NAV_CACHE_KEY, {
        value: existing?.value,
        promise: undefined,
        error: error instanceof Error ? error.message : "Failed to load jewellery nav",
        updatedAt: existing?.updatedAt ?? 0,
      });
    }

    throw error;
  }
}

export async function getMagentoJewelleryProducts(
  params: GetMagentoJewelleryProductsParams,
): Promise<JewelleryListingProductsData> {
  const key = buildJewelleryListingRequestKey(params);

  if (typeof window !== "undefined") {
    const cached = listingResultCache.get(key);
    if (cached && Date.now() - cached.fetchedAt < LISTING_RESULT_CACHE_TTL_MS) {
      return cached.data;
    }

    const inFlight = listingInFlight.get(key);
    if (inFlight) {
      return inFlight;
    }
  }

  const promise = fetchMagentoJewelleryProducts(params).then((data) => {
    if (typeof window !== "undefined") {
      listingResultCache.set(key, { data, fetchedAt: Date.now() });
    }
    return data;
  });

  if (typeof window !== "undefined") {
    listingInFlight.set(key, promise);
    void promise.finally(() => {
      listingInFlight.delete(key);
    });
  }

  return promise;
}

/** Seeds the client listing cache after a server prefetch so hydration does not refetch. */
export function seedMagentoJewelleryListingCache(
  params: GetMagentoJewelleryProductsParams,
  data: JewelleryListingProductsData,
): void {
  if (typeof window === "undefined") {
    return;
  }

  listingResultCache.set(buildJewelleryListingRequestKey(params), {
    data,
    fetchedAt: Date.now(),
  });
}

async function enrichFacetsWithOccasionAttributeOptions(
  filters: JewelleryFilterState,
  facets: JewelleryFilterFacets,
  signal?: AbortSignal,
): Promise<JewelleryFilterFacets> {
  const occasion = filters.occasion.trim();
  if (!occasion) {
    return facets;
  }

  // Already resolvable from listing aggregations (or already an option id present there).
  if (resolveOccasionFacetOption(occasion, facets.occasions)) {
    return facets;
  }

  try {
    const magentoOccasions = await getMagentoProductAttributeOptions("sd_occasions", signal);
    return {
      ...facets,
      occasions: mergeFacetOptions(facets.occasions, magentoOccasions),
    };
  } catch {
    // Fall through — filter builder will pass the raw slug if metadata is unavailable.
    return facets;
  }
}

async function enrichFacetsWithGemstoneAttributeOptions(
  filters: JewelleryFilterState,
  facets: JewelleryFilterFacets,
  signal?: AbortSignal,
): Promise<JewelleryFilterFacets> {
  const gemstoneType = filters.gemstoneType.trim();
  if (!gemstoneType) {
    return facets;
  }

  try {
    const magentoGemstones = await getMagentoProductAttributeOptions("sd_gemstone_type", signal);
    return {
      ...facets,
      gemstoneTypes: mergeGemstoneTypeFacetOptions(facets.gemstoneTypes, magentoGemstones),
    };
  } catch {
    // Fall through — filter builder uses aggregation values when metadata is unavailable.
    return facets;
  }
}

async function enrichFacetsWithDrawerAttributeOptions(
  filters: JewelleryFilterState,
  facets: JewelleryFilterFacets,
  signal?: AbortSignal,
): Promise<JewelleryFilterFacets> {
  const withOccasions = await enrichFacetsWithOccasionAttributeOptions(filters, facets, signal);
  return enrichFacetsWithGemstoneAttributeOptions(filters, withOccasions, signal);
}

async function fetchMagentoJewelleryProducts({
  categoryUrlKey,
  page = 1,
  pageSize = 9,
  sortValue = "featured",
  filters = createEmptyFilterState(),
  facets = EMPTY_JEWELLERY_FILTER_FACETS,
  includeFacets = true,
  signal,
}: GetMagentoJewelleryProductsParams): Promise<JewelleryListingProductsData> {
  const needsNavCategories = includeFacets || Boolean(categoryUrlKey);
  const navCategories = needsNavCategories
    ? (
        await measureJewelleryPlpGraphql(
          "nav-categories",
          () => getJewelleryNavCategoriesCached(signal),
          { category: categoryUrlKey ?? "all" },
        )
      ).categories
    : [];

  const categoryId = categoryUrlKey
    ? navCategories.find((category) => category.urlKey === categoryUrlKey)?.categoryId ?? null
    : null;

  // Resolve CMS/URL slugs and drawer labels via live Magento attribute options.
  const facetsForFilter = await enrichFacetsWithDrawerAttributeOptions(
    filters,
    facets,
    signal,
  );

  const magentoFilter = buildMagentoProductsFilter({
    categoryUrlKey,
    categoryId,
    filters,
    facets: facetsForFilter,
  });

  const sort = mapJewellerySortToMagento(sortValue);

  const fetchProducts = () =>
    magentoGraphqlFetch<MagentoProductsResponse>({
      query: MAGENTO_JEWELLERY_PRODUCTS_QUERY,
      variables: {
        search: "",
        filter: magentoFilter,
        pageSize,
        currentPage: page,
        sort,
      },
      signal,
    });

  if (!includeFacets) {
    const data = await measureJewelleryPlpGraphql("products", fetchProducts, {
      page,
      pageSize,
      category: categoryUrlKey ?? "all",
    });
    const rawProducts = mapMagentoProductsToJewelleryListing(data.products?.items);
    const products = refineListingProductsForExactPrice(rawProducts, filters, facetsForFilter);
    const pageInfo = data.products?.page_info;

    return {
      products,
      totalCount: resolveListingTotalCount(
        products,
        data.products?.total_count ?? 0,
        filters,
        facetsForFilter,
      ),
      currentPage: pageInfo?.current_page ?? page,
      pageSize: pageInfo?.page_size ?? pageSize,
      totalPages: pageInfo?.total_pages ?? 0,
      facets: facetsForFilter,
    };
  }

  const facetScopeFilter = buildMagentoProductsFilter({
    categoryUrlKey,
    categoryId,
    filters,
    facets: facetsForFilter,
    includeDrawerFilters: false,
  });

  const [data, facetScopeData] = await Promise.all([
    measureJewelleryPlpGraphql("products", fetchProducts, {
      page,
      pageSize,
      category: categoryUrlKey ?? "all",
    }),
    measureJewelleryPlpGraphql(
      "facets",
      () =>
        magentoGraphqlFetch<MagentoProductsResponse>({
          query: MAGENTO_JEWELLERY_PRODUCT_FACETS_QUERY,
          variables: {
            search: "",
            filter: facetScopeFilter,
            sort,
          },
          signal,
        }),
      { category: categoryUrlKey ?? "all" },
    ),
  ]);

  const responseFacets = enrichFacetsWithNavCategories(
    mapMagentoAggregationsToFacets(facetScopeData.products?.aggregations),
    navCategories,
  );
  const rawProducts = mapMagentoProductsToJewelleryListing(data.products?.items);
  const products = refineListingProductsForExactPrice(rawProducts, filters, facetsForFilter);
  const pageInfo = data.products?.page_info;

  return {
    products,
    totalCount: resolveListingTotalCount(
      products,
      data.products?.total_count ?? 0,
      filters,
      facetsForFilter,
    ),
    currentPage: pageInfo?.current_page ?? page,
    pageSize: pageInfo?.page_size ?? pageSize,
    totalPages: pageInfo?.total_pages ?? 0,
    // Keep Magento attribute options available for URL slug → option id sync.
    facets: {
      ...responseFacets,
      occasions: mergeFacetOptions(responseFacets.occasions, facetsForFilter.occasions),
      gemstoneTypes: mergeGemstoneTypeFacetOptions(
        responseFacets.gemstoneTypes,
        facetsForFilter.gemstoneTypes,
      ),
    },
  };
}

export type MagentoJewelleryInitialListingResult = {
  listing: JewelleryListingProductsData;
  pendingProducts: JewelleryListingProduct[];
};

function refineListingProductsForExactPrice(
  products: JewelleryListingProduct[],
  filters: JewelleryFilterState,
  facets: JewelleryFilterFacets,
): JewelleryListingProduct[] {
  const exactPrice = getExactJewelleryPriceFilter(filters, facets);
  if (exactPrice != null) {
    return products.filter((product) => Math.round(product.price) === exactPrice);
  }

  if (isDefaultPriceRange(filters, facets)) {
    return products;
  }

  // Magento filters on excl-tax index amounts; keep only products whose displayed
  // final price falls in the UI range the shopper entered.
  const minPrice = Math.round(filters.minPrice);
  const maxPrice = Math.round(filters.maxPrice);

  return products.filter((product) => {
    const displayPrice = Math.round(product.price);
    return displayPrice >= minPrice && displayPrice <= maxPrice;
  });
}

function resolveListingTotalCount(
  products: JewelleryListingProduct[],
  apiTotalCount: number,
  filters: JewelleryFilterState,
  facets: JewelleryFilterFacets,
): number {
  // Client refine runs for any active price filter (tax index ≠ display price).
  if (!isDefaultPriceRange(filters, facets)) {
    return products.length;
  }

  return apiTotalCount;
}

/** Fetches the first PLP page ({@link PAGE_SIZE} products) with facets. */
export async function getMagentoJewelleryInitialListing(
  params: Omit<GetMagentoJewelleryProductsParams, "page"> & {
    pageSize?: number;
  },
): Promise<MagentoJewelleryInitialListingResult> {
  const pageSize = params.pageSize ?? PAGE_SIZE;
  const filters = params.filters ?? createEmptyFilterState();

  const firstPage = await getMagentoJewelleryProducts({
    ...params,
    page: 1,
    pageSize,
    includeFacets: params.includeFacets !== false,
  });

  const products = refineListingProductsForExactPrice(
    firstPage.products,
    filters,
    firstPage.facets,
  );

  return {
    listing: {
      products,
      totalCount: resolveListingTotalCount(
        products,
        firstPage.totalCount,
        filters,
        firstPage.facets,
      ),
      totalPages: firstPage.totalPages,
      pageSize: firstPage.pageSize,
      currentPage: 1,
      facets: firstPage.facets,
      pendingProducts: [],
    },
    pendingProducts: [],
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
