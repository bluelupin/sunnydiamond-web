import type { FeaturedCarouselItem } from "@/types/homepage/featuredCarousel";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { resolveImageSrcString } from "@/shared/utils/image";
import { magentoGraphqlFetch } from "../graphqlClient";
import { MagentoGraphqlError } from "../magento.errors";
import { isMagentoTrending } from "./magentoAttribute.utils";
import type { MagentoProductListItem, MagentoProductsResponse } from "./magentoProduct.types";
import {
  mapMagentoProductsToJewelleryListing,
} from "./products.mapper";
import {
  MAGENTO_TRENDING_PRODUCTS_QUERY,
  MAGENTO_TRENDING_PRODUCTS_SCAN_QUERY,
} from "./trendingProducts.query";
import {
  MAGENTO_TRENDING_CACHE_TAG,
  MAGENTO_TRENDING_REVALIDATE_SECONDS,
} from "../config";

const TRENDING_SCAN_PAGE_SIZE = 50;
const MAX_TRENDING_PRODUCTS = 24;
const MAX_TRENDING_SCAN_PAGES = 10;

function isTrendingMagentoProduct(item: MagentoProductListItem): boolean {
  return isMagentoTrending(item.custom_attributesV2?.items);
}

async function fetchTrendingCatalogPage(
  currentPage: number,
  signal?: AbortSignal,
): Promise<MagentoProductsResponse> {
  return magentoGraphqlFetch<MagentoProductsResponse>({
    query: MAGENTO_TRENDING_PRODUCTS_SCAN_QUERY,
    variables: {
      search: "",
      filter: {},
      pageSize: TRENDING_SCAN_PAGE_SIZE,
      currentPage,
      sort: { position: "ASC" },
    },
    signal,
    revalidateSeconds: MAGENTO_TRENDING_REVALIDATE_SECONDS,
    tags: [MAGENTO_TRENDING_CACHE_TAG],
  });
}

/** Temporary compatibility path for Magento deployments without the indexed filter. */
async function scanMagentoTrendingProducts(
  limit = MAX_TRENDING_PRODUCTS,
  signal?: AbortSignal,
): Promise<JewelleryListingProduct[]> {
  const firstPage = await fetchTrendingCatalogPage(1, signal);
  const totalPages = firstPage.products?.page_info?.total_pages ?? 1;
  const pagesToScan = Math.min(totalPages, MAX_TRENDING_SCAN_PAGES);

  const pageResponses = await Promise.all(
    Array.from({ length: pagesToScan }, (_, index) => {
      const currentPage = index + 1;
      return currentPage === 1 ? Promise.resolve(firstPage) : fetchTrendingCatalogPage(currentPage, signal);
    }),
  );

  const trending: JewelleryListingProduct[] = [];

  for (const page of pageResponses) {
    const pageItems = (page.products?.items ?? []).filter(isTrendingMagentoProduct);
    trending.push(...mapMagentoProductsToJewelleryListing(pageItems));

    if (trending.length >= limit) {
      break;
    }
  }

  return trending.slice(0, limit);
}

/** Fetch only products flagged as trending; old Magento schemas use the scan until upgraded. */
export async function getMagentoTrendingProducts(
  limit = MAX_TRENDING_PRODUCTS,
  signal?: AbortSignal,
): Promise<JewelleryListingProduct[]> {
  try {
    const data = await magentoGraphqlFetch<MagentoProductsResponse>({
      query: MAGENTO_TRENDING_PRODUCTS_QUERY,
      variables: { pageSize: limit },
      preferGet: true,
      signal,
      revalidateSeconds: MAGENTO_TRENDING_REVALIDATE_SECONDS,
      tags: [MAGENTO_TRENDING_CACHE_TAG],
    });

    return mapMagentoProductsToJewelleryListing(data.products?.items).slice(0, limit);
  } catch (error) {
    if (
      !(error instanceof MagentoGraphqlError) ||
      !error.message.includes('sd_trending') ||
      !error.message.includes('ProductAttributeFilterInput')
    ) {
      throw error;
    }

    return scanMagentoTrendingProducts(limit, signal);
  }
}

export function mapJewelleryListingToFeaturedCarouselItems(
  products: JewelleryListingProduct[],
): FeaturedCarouselItem[] {
  return products.map((product) => ({
    id: product.sku,
    name: product.name,
    price: product.price,
    image: resolveImageSrcString(product.primaryImage),
    href: `/product/${product.urlKey}`,
  }));
}
