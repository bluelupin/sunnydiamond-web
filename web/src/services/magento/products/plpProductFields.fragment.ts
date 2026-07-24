/** Minimal Magento product fields for jewellery PLP cards (no aggregations). */
export const MAGENTO_PLP_PRODUCT_FIELDS = `
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
