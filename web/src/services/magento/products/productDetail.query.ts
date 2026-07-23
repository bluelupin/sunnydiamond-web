import { MAGENTO_LISTING_PRODUCT_FIELDS } from "./listingProductFields.fragment";

export const MAGENTO_PRODUCT_BY_URL_KEY_QUERY = `
  query MagentoProductByUrlKey($urlKey: String!) {
    products(filter: { url_key: { eq: $urlKey } }) {
      items {
        uid
        sku
        name
        url_key
        meta_title
        meta_description
        meta_keyword
        canonical_url
        stock_status
        description {
          html
        }
        short_description {
          html
        }
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
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
          model_wear_image
          special_price
          related_products {
            ${MAGENTO_LISTING_PRODUCT_FIELDS}
          }
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
