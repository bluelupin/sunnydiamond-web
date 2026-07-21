export const MAGENTO_JEWELLERY_PRODUCTS_QUERY = `
  query JewelleryProducts(
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
      aggregations {
        attribute_code
        label
        count
        options {
          label
          value
          count
        }
      }
      items {
        uid
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
        media_gallery {
          url
          label
          position
          disabled
        }
        categories {
          id
          name
          url_key
        }
        ... on SimpleProduct {
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
      }
    }
  }
` as const;
