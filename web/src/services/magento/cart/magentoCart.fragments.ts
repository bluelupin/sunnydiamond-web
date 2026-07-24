export const MAGENTO_CART_FIELDS = `
  id
  total_quantity
  gift_mode
  gift_message {
    message
  }
  prices {
    grand_total {
      value
      currency
    }
    subtotal_excluding_tax {
      value
    }
    applied_taxes {
      label
      amount {
        value
      }
    }
  }
  itemsV2 {
    items {
      uid
      quantity
      ... on SimpleCartItem {
        is_gift
        gift_message {
          message
        }
        customizable_options {
          label
          values {
            label
            value
          }
        }
      }
      product {
        sku
        name
        url_key
        ... on SimpleProduct {
          media_gallery {
            url
            label
            position
            disabled
          }
        }
      }
      prices {
        price {
          value
        }
        row_total {
          value
        }
      }
    }
  }
  shipping_addresses {
    available_shipping_methods {
      carrier_code
      carrier_title
      method_code
      method_title
      amount {
        value
        currency
      }
    }
    selected_shipping_method {
      carrier_code
      carrier_title
      method_code
      method_title
      amount {
        value
        currency
      }
    }
  }
  available_payment_methods {
    code
    title
  }
  selected_payment_method {
    code
    title
  }
` as const;
