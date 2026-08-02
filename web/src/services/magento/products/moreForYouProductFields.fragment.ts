/** Minimal Magento fields for PDP “More for you” and related_products (carousel cards). */
export const MAGENTO_MORE_FOR_YOU_PRODUCT_FIELDS = `
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
    model_wear_image
    media_gallery {
      url
      label
      position
      disabled
    }
  }
` as const;
