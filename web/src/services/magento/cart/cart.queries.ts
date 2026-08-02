import { MAGENTO_CART_FIELDS } from "./magentoCart.fragments";

export const MAGENTO_GET_CART_QUERY = `
  query MagentoGuestCart($cartId: String!) {
    cart(cart_id: $cartId) {
      ${MAGENTO_CART_FIELDS}
    }
  }
` as const;

export const MAGENTO_GET_CUSTOMER_CART_QUERY = `
  query MagentoCustomerCart {
    customerCart {
      ${MAGENTO_CART_FIELDS}
    }
  }
` as const;
