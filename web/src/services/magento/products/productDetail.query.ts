import { MAGENTO_MORE_FOR_YOU_PRODUCT_FIELDS } from "./moreForYouProductFields.fragment";
import { MAGENTO_PRODUCT_CUSTOM_OPTIONS_FIELDS } from "./productCustomOptions.fragment";

const MAGENTO_PRODUCT_DETAIL_CUSTOM_ATTRIBUTES = `
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
` as const;

const MAGENTO_VARIANT_PRICE_BREAKUP_ATTRIBUTES = `
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
` as const;

const MAGENTO_PRODUCT_DETAIL_SHARED_EXTENSIONS = `
  special_price
  related_products {
    ${MAGENTO_MORE_FOR_YOU_PRODUCT_FIELDS}
  }
  ${MAGENTO_PRODUCT_CUSTOM_OPTIONS_FIELDS}
  ${MAGENTO_PRODUCT_DETAIL_CUSTOM_ATTRIBUTES}
` as const;

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
          ${MAGENTO_PRODUCT_DETAIL_SHARED_EXTENSIONS}
        }
        ... on ConfigurableProduct {
          ${MAGENTO_PRODUCT_DETAIL_SHARED_EXTENSIONS}
          configurable_options {
            attribute_code
            uid
            label
            values {
              uid
              label
              swatch_data {
                value
                ... on ColorSwatchData {
                  value
                }
                ... on ImageSwatchData {
                  value
                  thumbnail
                }
              }
            }
          }
          variants {
            attributes {
              code
              uid
              label
              value_index
            }
            product {
              sku
              stock_status
              special_price
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
              ${MAGENTO_VARIANT_PRICE_BREAKUP_ATTRIBUTES}
            }
          }
        }
      }
    }
  }
` as const;
