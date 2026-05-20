import { magentoFetch } from "../client";

export const SET_SHIPPING_ADDRESSES_MUTATION = `
  mutation SetShippingAddresses($cartId: String!, $shippingAddress: ShippingAddressInput!) {
    setShippingAddressesOnCart(input: {
      cart_id: $cartId
      shipping_addresses: [$shippingAddress]
    }) {
      cart {
        id
      }
    }
  }
`;

export const SET_BILLING_ADDRESS_MUTATION = `
  mutation SetBillingAddress($cartId: String!, $billingAddress: BillingAddressInput!) {
    setBillingAddressOnCart(input: {
      cart_id: $cartId
      billing_address: $billingAddress
    }) {
      cart {
        id
      }
    }
  }
`;

export const SET_SHIPPING_METHODS_MUTATION = `
  mutation SetShippingMethods($cartId: String!, $shippingMethod: ShippingMethodInput!) {
    setShippingMethodsOnCart(input: {
      cart_id: $cartId
      shipping_methods: [$shippingMethod]
    }) {
      cart {
        id
      }
    }
  }
`;

export const SET_PAYMENT_METHOD_MUTATION = `
  mutation SetPaymentMethod($cartId: String!, $paymentMethod: PaymentMethodInput!) {
    setPaymentMethodOnCart(input: {
      cart_id: $cartId
      payment_method: $paymentMethod
    }) {
      cart {
        id
      }
    }
  }
`;

export const PLACE_ORDER_MUTATION = `
  mutation PlaceOrder($cartId: String!) {
    placeOrder(input: { cart_id: $cartId }) {
      order {
        order_number
      }
    }
  }
`;

export async function placeOrder(cartId: string): Promise<string> {
  const data = await magentoFetch<{ placeOrder: { order: { order_number: string } } }>({
    query: PLACE_ORDER_MUTATION,
    variables: { cartId },
  }, { revalidate: 0 });
  return data.placeOrder.order.order_number;
}
