/** Minimal product fields for sitemap generation. */
export const MAGENTO_SITEMAP_PRODUCTS_QUERY = `
  query MagentoSitemapProducts(
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
      page_info {
        current_page
        total_pages
      }
      items {
        url_key
      }
    }
  }
` as const;
