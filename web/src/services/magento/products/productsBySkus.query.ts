export const MAGENTO_PRODUCTS_BY_SKUS_QUERY = `
  query MagentoProductsBySkus($filter: ProductAttributeFilterInput!, $pageSize: Int!) {
    products(filter: $filter, pageSize: $pageSize) {
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
        image {
          url
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
