/** Minimal fields for trending catalog scan — avoids heavy media_gallery payloads. */
const MAGENTO_TRENDING_SCAN_PRODUCT_FIELDS = `
  sku
  name
  url_key
  price_range {
    minimum_price {
      final_price {
        value
        currency
      }
    }
  }
  image {
    url
  }
  ... on SimpleProduct {
    custom_attributesV2 {
      items {
        code
        ... on AttributeValue {
          value
        }
      }
    }
  }
` as const;

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
        ${MAGENTO_TRENDING_SCAN_PRODUCT_FIELDS}
      }
    }
  }
` as const;
