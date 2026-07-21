import { MAGENTO_CART_FIELDS } from "./magentoCart.fragments";

export const MAGENTO_CREATE_GUEST_CART_MUTATION = `
  mutation MagentoCreateGuestCart {
    createGuestCart {
      cart {
        id
      }
    }
  }
` as const;

export const MAGENTO_ADD_SIMPLE_PRODUCTS_TO_CART_MUTATION = `
  mutation MagentoAddSimpleProductsToCart($cartId: String!, $sku: String!, $quantity: Float!) {
    addSimpleProductsToCart(
      input: {
        cart_id: $cartId
        cart_items: [{ data: { quantity: $quantity, sku: $sku } }]
      }
    ) {
      cart {
        ${MAGENTO_CART_FIELDS}
      }
    }
  }
` as const;

export const MAGENTO_UPDATE_CART_ITEMS_MUTATION = `
  mutation MagentoUpdateCartItems($cartId: String!, $cartItemUid: ID!, $quantity: Float!) {
    updateCartItems(
      input: {
        cart_id: $cartId
        cart_items: [{ cart_item_uid: $cartItemUid, quantity: $quantity }]
      }
    ) {
      cart {
        ${MAGENTO_CART_FIELDS}
      }
    }
  }
` as const;

export const MAGENTO_REMOVE_ITEM_FROM_CART_MUTATION = `
  mutation MagentoRemoveItemFromCart($cartId: String!, $cartItemUid: ID!) {
    removeItemFromCart(input: { cart_id: $cartId, cart_item_uid: $cartItemUid }) {
      cart {
        ${MAGENTO_CART_FIELDS}
      }
    }
  }
` as const;

export const MAGENTO_SET_GUEST_EMAIL_ON_CART_MUTATION = `
  mutation MagentoSetGuestEmailOnCart($cartId: String!, $email: String!) {
    setGuestEmailOnCart(input: { cart_id: $cartId, email: $email }) {
      cart {
        id
      }
    }
  }
` as const;

export const MAGENTO_SET_SHIPPING_ADDRESSES_ON_CART_MUTATION = `
  mutation MagentoSetShippingAddressesOnCart(
    $cartId: String!
    $shippingAddresses: [ShippingAddressInput!]!
  ) {
    setShippingAddressesOnCart(
      input: { cart_id: $cartId, shipping_addresses: $shippingAddresses }
    ) {
      cart {
        ${MAGENTO_CART_FIELDS}
      }
    }
  }
` as const;

export const MAGENTO_SET_BILLING_ADDRESS_ON_CART_MUTATION = `
  mutation MagentoSetBillingAddressOnCart(
    $cartId: String!
    $billingAddress: BillingAddressInput!
  ) {
    setBillingAddressOnCart(
      input: {
        cart_id: $cartId
        billing_address: $billingAddress
      }
    ) {
      cart {
        ${MAGENTO_CART_FIELDS}
      }
    }
  }
` as const;

export const MAGENTO_SET_SHIPPING_METHODS_ON_CART_MUTATION = `
  mutation MagentoSetShippingMethodsOnCart(
    $cartId: String!
    $shippingMethods: [ShippingMethodInput!]!
  ) {
    setShippingMethodsOnCart(
      input: { cart_id: $cartId, shipping_methods: $shippingMethods }
    ) {
      cart {
        ${MAGENTO_CART_FIELDS}
      }
    }
  }
` as const;

export const MAGENTO_SET_PAYMENT_METHOD_ON_CART_MUTATION = `
  mutation MagentoSetPaymentMethodOnCart($cartId: String!, $paymentMethod: PaymentMethodInput!) {
    setPaymentMethodOnCart(input: { cart_id: $cartId, payment_method: $paymentMethod }) {
      cart {
        ${MAGENTO_CART_FIELDS}
      }
    }
  }
` as const;

export const MAGENTO_PLACE_ORDER_MUTATION = `
  mutation MagentoPlaceOrder($cartId: String!) {
    placeOrder(input: { cart_id: $cartId }) {
      orderV2 {
        id
        number
      }
      errors {
        message
        code
      }
    }
  }
` as const;

export const MAGENTO_CREATE_PAYMENT_ORDER_MUTATION = `
  mutation MagentoCreatePaymentOrder($input: CreatePaymentOrderInput!) {
    createPaymentOrder(input: $input) {
      id
      mp_order_id
      status
      amount
      currency_code
    }
  }
` as const;
