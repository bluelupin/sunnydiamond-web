import { MAGENTO_PRODUCT_CUSTOM_OPTIONS_FIELDS } from "../products/productCustomOptions.fragment";

const cartFields = (productCustomOptions: string) => `
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
    discounts {
      label
      applied_to
      amount {
        value
      }
      coupon {
        code
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
          customizable_option_uid
          label
          values {
            customizable_option_value_uid
            label
            value
          }
        }
      }
      ... on ConfigurableCartItem {
        is_gift
        gift_message {
          message
        }
        customizable_options {
          customizable_option_uid
          label
          values {
            customizable_option_value_uid
            label
            value
          }
        }
        configurable_options {
          option_label
          value_label
        }
        configured_variant {
          sku
          image {
            url
          }
          ... on SimpleProduct {
            media_gallery {
              url
              label
              position
              disabled
            }
          }
        }
      }
      product {
        sku
        name
        url_key
        image {
          url
        }
        ... on SimpleProduct {
          media_gallery {
            url
            label
            position
            disabled
          }
        }
        ${productCustomOptions}
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
`;

/** Everything the cart UI needs except the catalog's own option lists. */
export const MAGENTO_CART_FIELDS = cartFields("") as string;

/**
 * Adds each line's product options (engraving fonts, sizes) — the only source that
 * works on a device the line was not added from. Reserved for the two cart reads:
 * a ring carries ~30 size values, which is dead weight on a payment or address
 * mutation. Responses without them keep the options already known for the SKU
 * (see CartContext's applyCartState).
 */
export const MAGENTO_CART_FIELDS_WITH_PRODUCT_OPTIONS = cartFields(
  MAGENTO_PRODUCT_CUSTOM_OPTIONS_FIELDS,
) as string;
