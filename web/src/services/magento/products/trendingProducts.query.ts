import { MAGENTO_LISTING_PRODUCT_FIELDS } from "./listingProductFields.fragment";

export const MAGENTO_TRENDING_PRODUCTS_SCAN_QUERY = `
  query MagentoTrendingProductsScan(
    $search: String!
    $filter: ProductAttributeFilterInput
    $pageSize: Int!
    $currentPage: Int!
    $sort: ProductAttributeSortInput
  ) {
    products(
      search: $search
      filter: $filter
      pageSize: $pageSize
      currentPage: $currentPage
      sort: $sort
    ) {
      total_count
      page_info {
        current_page
        page_size
        total_pages
      }
      items {
        ${MAGENTO_LISTING_PRODUCT_FIELDS}
      }
    }
  }
` as const;
