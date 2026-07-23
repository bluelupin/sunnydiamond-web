import type { FeaturedCarouselItem } from "@/features/cms/components/home/FeaturedProductsCarousel";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { getImageSrc } from "@/shared/utils/image";
import { magentoGraphqlFetch } from "../graphqlClient";
import { isMagentoTrending } from "./magentoAttribute.utils";
import type { MagentoProductListItem, MagentoProductsResponse } from "./magentoProduct.types";
import {
  mapMagentoProductsToJewelleryListing,
} from "./products.mapper";
import { MAGENTO_TRENDING_PRODUCTS_SCAN_QUERY } from "./trendingProducts.query";

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
  });
}

/**
 * Magento exposes `sd_trending` on product attributes but not in
 * `ProductAttributeFilterInput`, so we scan catalog pages and filter locally.
 */
export async function getMagentoTrendingProducts(
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

export function mapJewelleryListingToFeaturedCarouselItems(
  products: JewelleryListingProduct[],
): FeaturedCarouselItem[] {
  return products.map((product) => ({
    id: product.sku,
    name: product.name,
    price: product.price,
    image: getImageSrc(product.primaryImage),
    href: `/product/${product.urlKey}`,
  }));
}
