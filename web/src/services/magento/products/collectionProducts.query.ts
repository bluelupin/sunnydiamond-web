import { MAGENTO_PLP_PRODUCT_FIELDS } from "./plpProductFields.fragment";

const MAGENTO_COLLECTION_SCAN_PRODUCT_FIELDS = `
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
  media_gallery {
    url
    label
    position
    disabled
  }
  ... on SimpleProduct {
    model_wear_image
    custom_attributesV2 {
      items {
        code
        ... on AttributeValue {
          value
        }
        ... on AttributeSelectedOptions {
          selected_options {
            label
            value
          }
        }
      }
    }
  }
` as const;

export const MAGENTO_COLLECTION_PRODUCTS_FILTER_QUERY = `
  query MagentoCollectionProductsFilter(
    $filter: ProductAttributeFilterInput!
    $pageSize: Int!
  ) {
    products(filter: $filter, pageSize: $pageSize) {
      items {
        ${MAGENTO_PLP_PRODUCT_FIELDS}
      }
    }
  }
` as const;

export const MAGENTO_COLLECTION_PRODUCTS_SCAN_QUERY = `
  query MagentoCollectionProductsScan(
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
        ${MAGENTO_COLLECTION_SCAN_PRODUCT_FIELDS}
      }
    }
  }
` as const;
