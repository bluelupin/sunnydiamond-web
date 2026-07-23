import { magentoGraphqlFetch } from "../graphqlClient";
import { MAGENTO_GET_CART_QUERY } from "./cart.queries";
import {
  MAGENTO_ADD_PRODUCTS_TO_CART_MUTATION,
  MAGENTO_ADD_SIMPLE_PRODUCTS_TO_CART_MUTATION,
  MAGENTO_CREATE_GUEST_CART_MUTATION,
  MAGENTO_REMOVE_ITEM_FROM_CART_MUTATION,
  MAGENTO_SET_BILLING_ADDRESS_ON_CART_MUTATION,
  MAGENTO_SET_GUEST_EMAIL_ON_CART_MUTATION,
  MAGENTO_SET_PAYMENT_METHOD_ON_CART_MUTATION,
  MAGENTO_SET_SHIPPING_ADDRESSES_ON_CART_MUTATION,
  MAGENTO_SET_SHIPPING_METHODS_ON_CART_MUTATION,
  MAGENTO_PLACE_ORDER_MUTATION,
  MAGENTO_CREATE_PAYMENT_ORDER_MUTATION,
  MAGENTO_ESTIMATE_SHIPPING_METHODS_MUTATION,
  MAGENTO_UPDATE_CART_ITEMS_MUTATION,
  MAGENTO_SYNC_CART_ITEMS_OPTIONS_MUTATION,
} from "./cart.mutations";
import {
  mapMagentoCartItems,
  mapMagentoCartTotals,
  mapEstimateShippingMethods,
  pickDefaultShippingMethod,
} from "./cart.mapper";
import {
  clearGuestCartId,
  getGuestCartId,
  setGuestCartId,
  type CartLineMetadata,
  type StoredCartLineMetadata,
} from "./cartSession";
import type { CartLineOptions } from "@/features/cart/types/cart.types";
import type { ProductCustomOptions } from "@/features/products/types/productCustomOptions";
import { buildMagentoCartItemOptionPayload } from "./cartLineCustomOptions.mapper";
import type {
  MagentoAddSimpleProductsToCartResponse,
  MagentoAddProductsToCartResponse,
  MagentoSyncCartItemsOptionsResponse,
  MagentoCart,
  MagentoCartAddressInput,
  MagentoCartResponse,
  MagentoCreateGuestCartResponse,
  MagentoRemoveItemFromCartResponse,
  MagentoSetBillingAddressOnCartResponse,
  MagentoSetGuestEmailOnCartResponse,
  MagentoSetShippingAddressesOnCartResponse,
  MagentoCreatePaymentOrderResponse,
  MagentoEstimateShippingMethodsResponse,
  MagentoPlaceOrderResponse,
  MagentoPaymentOrder,
  MagentoSetPaymentMethodOnCartResponse,
  MagentoSetShippingMethodsOnCartResponse,
  MagentoShippingAddressInput,
  MagentoShippingMethodOption,
  MagentoBillingAddressInput,
  PlacedGuestOrder,
  MagentoUpdateCartItemsResponse,
  MappedMagentoCart,
} from "./magentoCart.types";
import type { CartLineItem } from "@/features/cart/types/cart.types";
import type { CheckoutFormData, CheckoutPaymentData } from "@/features/checkout/types/checkout.types";
import {
  mapCheckoutFormToBillingAddress,
  mapCheckoutFormToShippingAddress,
  resolveGuestCheckoutEmail,
} from "./checkoutAddress.mapper";
import {
  isOfflineMagentoPaymentCode,
  mapUiMethodToPaymentSource,
  resolveMagentoPaymentCode,
} from "./checkoutPayment.mapper";
import { MagentoGraphqlError } from "../magento.errors";
import { DEFAULT_CART_SHIPPING_ESTIMATE_ADDRESS } from "./cartShippingEstimate";

export type GuestCartState = {
  cart: MagentoCart;
  totals: MappedMagentoCart;
  items: CartLineItem[];
};

function assertCart(cart: MagentoCart | null | undefined): MagentoCart {
  if (!cart?.id?.trim()) {
    throw new Error("Magento cart response was empty");
  }

  return cart;
}

function mapGuestCartState(cart: MagentoCart, lineMetadata: StoredCartLineMetadata): GuestCartState {
  const totals = mapMagentoCartTotals(cart);
  if (!totals) {
    throw new Error("Magento cart totals were unavailable");
  }

  return {
    cart,
    totals,
    items: mapMagentoCartItems(cart, lineMetadata),
  };
}

export async function createGuestCart(signal?: AbortSignal): Promise<string> {
  const data = await magentoGraphqlFetch<MagentoCreateGuestCartResponse>({
    query: MAGENTO_CREATE_GUEST_CART_MUTATION,
    signal,
    cache: "no-store",
  });

  const cartId = data.createGuestCart?.cart?.id?.trim();
  if (!cartId) {
    throw new Error("Failed to create guest cart");
  }

  setGuestCartId(cartId);
  return cartId;
}

export async function fetchGuestCart(
  cartId: string,
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  const data = await magentoGraphqlFetch<MagentoCartResponse>({
    query: MAGENTO_GET_CART_QUERY,
    variables: { cartId },
    signal,
    cache: "no-store",
  });

  return mapGuestCartState(assertCart(data.cart), lineMetadata);
}

export async function ensureGuestCartId(signal?: AbortSignal): Promise<string> {
  const existingCartId = getGuestCartId();
  if (existingCartId) {
    try {
      await magentoGraphqlFetch<MagentoCartResponse>({
        query: MAGENTO_GET_CART_QUERY,
        variables: { cartId: existingCartId },
        signal,
        cache: "no-store",
      });
      return existingCartId;
    } catch {
      clearGuestCartId();
    }
  }

  return createGuestCart(signal);
}

export async function addSimpleProductToGuestCart(
  cartId: string,
  sku: string,
  quantity: number,
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  const data = await magentoGraphqlFetch<MagentoAddSimpleProductsToCartResponse>({
    query: MAGENTO_ADD_SIMPLE_PRODUCTS_TO_CART_MUTATION,
    variables: { cartId, sku, quantity },
    signal,
    cache: "no-store",
  });

  return mapGuestCartState(assertCart(data.addSimpleProductsToCart?.cart), lineMetadata);
}

type AddProductToGuestCartInput = {
  cartId: string;
  sku: string;
  quantity: number;
  lineOptions?: CartLineOptions;
  productCustomOptions?: ProductCustomOptions;
  lineMetadata: StoredCartLineMetadata;
  signal?: AbortSignal;
};

export async function addProductToGuestCart({
  cartId,
  sku,
  quantity,
  lineOptions = {},
  productCustomOptions,
  lineMetadata,
  signal,
}: AddProductToGuestCartInput): Promise<GuestCartState> {
  const optionPayload = buildMagentoCartItemOptionPayload(lineOptions, productCustomOptions);

  if (!optionPayload) {
    return addSimpleProductToGuestCart(cartId, sku, quantity, lineMetadata, signal);
  }

  const data = await magentoGraphqlFetch<MagentoAddProductsToCartResponse>({
    query: MAGENTO_ADD_PRODUCTS_TO_CART_MUTATION,
    variables: {
      cartId,
      cartItems: [
        {
          sku,
          quantity,
          entered_options: optionPayload.enteredOptions,
          selected_options: optionPayload.selectedOptions,
        },
      ],
    },
    signal,
    cache: "no-store",
  });

  const userErrors = data.addProductsToCart?.user_errors ?? [];
  if (userErrors.length > 0) {
    const message =
      userErrors.map((error) => error.message?.trim()).filter(Boolean).join("; ") ||
      "Magento could not add this product with the selected options";
    throw new MagentoGraphqlError(message);
  }

  return mapGuestCartState(assertCart(data.addProductsToCart?.cart), lineMetadata);
}

export async function syncGuestCartLineOptions(
  cartId: string,
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  const currentState = await fetchGuestCart(cartId, lineMetadata, signal);

  const cartItems = currentState.items
    .map((item) => {
      const metadata = lineMetadata[item.id];
      if (!metadata) {
        return null;
      }

      const optionPayload = buildMagentoCartItemOptionPayload(
        metadata.options,
        metadata.productCustomOptions,
      );

      if (!optionPayload) {
        return null;
      }

      return {
        cart_item_uid: item.id,
        quantity: item.quantity,
        customizable_options: optionPayload.customizableOptions,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (cartItems.length === 0) {
    return currentState;
  }

  const data = await magentoGraphqlFetch<MagentoSyncCartItemsOptionsResponse>({
    query: MAGENTO_SYNC_CART_ITEMS_OPTIONS_MUTATION,
    variables: {
      cartId,
      cartItems,
    },
    signal,
    cache: "no-store",
  });

  return mapGuestCartState(assertCart(data.updateCartItems?.cart), lineMetadata);
}

export async function syncGuestCartLineOption(
  cartId: string,
  cartItemUid: string,
  metadata: CartLineMetadata,
  quantity: number,
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  const optionPayload = buildMagentoCartItemOptionPayload(
    metadata.options,
    metadata.productCustomOptions,
  );

  if (!optionPayload) {
    return fetchGuestCart(cartId, lineMetadata, signal);
  }

  const data = await magentoGraphqlFetch<MagentoSyncCartItemsOptionsResponse>({
    query: MAGENTO_SYNC_CART_ITEMS_OPTIONS_MUTATION,
    variables: {
      cartId,
      cartItems: [
        {
          cart_item_uid: cartItemUid,
          quantity,
          customizable_options: optionPayload.customizableOptions,
        },
      ],
    },
    signal,
    cache: "no-store",
  });

  return mapGuestCartState(assertCart(data.updateCartItems?.cart), lineMetadata);
}

export async function updateGuestCartItemQuantity(
  cartId: string,
  cartItemUid: string,
  quantity: number,
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  const data = await magentoGraphqlFetch<MagentoUpdateCartItemsResponse>({
    query: MAGENTO_UPDATE_CART_ITEMS_MUTATION,
    variables: { cartId, cartItemUid, quantity },
    signal,
    cache: "no-store",
  });

  return mapGuestCartState(assertCart(data.updateCartItems?.cart), lineMetadata);
}

export async function removeGuestCartItem(
  cartId: string,
  cartItemUid: string,
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  const data = await magentoGraphqlFetch<MagentoRemoveItemFromCartResponse>({
    query: MAGENTO_REMOVE_ITEM_FROM_CART_MUTATION,
    variables: { cartId, cartItemUid },
    signal,
    cache: "no-store",
  });

  return mapGuestCartState(assertCart(data.removeItemFromCart?.cart), lineMetadata);
}

export async function migrateLegacyLinesToGuestCart(
  legacyLines: Array<{ sku: string; quantity: number }>,
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState | null> {
  if (legacyLines.length === 0) {
    return null;
  }

  const cartId = await createGuestCart(signal);
  let state: GuestCartState | null = null;

  for (const line of legacyLines) {
    state = await addSimpleProductToGuestCart(
      cartId,
      line.sku,
      line.quantity,
      lineMetadata,
      signal,
    );
  }

  return state;
}

export async function setGuestEmailOnCart(
  cartId: string,
  email: string,
  signal?: AbortSignal,
): Promise<void> {
  await magentoGraphqlFetch<MagentoSetGuestEmailOnCartResponse>({
    query: MAGENTO_SET_GUEST_EMAIL_ON_CART_MUTATION,
    variables: { cartId, email },
    signal,
    cache: "no-store",
  });
}

export async function setGuestShippingAddress(
  cartId: string,
  address: MagentoCartAddressInput,
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  const shippingAddresses: MagentoShippingAddressInput[] = [{ address }];

  const data = await magentoGraphqlFetch<MagentoSetShippingAddressesOnCartResponse>({
    query: MAGENTO_SET_SHIPPING_ADDRESSES_ON_CART_MUTATION,
    variables: { cartId, shippingAddresses },
    signal,
    cache: "no-store",
  });

  return mapGuestCartState(assertCart(data.setShippingAddressesOnCart?.cart), lineMetadata);
}

export async function setGuestBillingAddress(
  cartId: string,
  billingAddress: MagentoCartAddressInput | null,
  sameAsShipping: boolean,
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  const billingAddressInput: MagentoBillingAddressInput = sameAsShipping
    ? { same_as_shipping: true }
    : { address: billingAddress ?? undefined };

  if (!sameAsShipping && !billingAddress) {
    throw new Error("Billing address is required when not using shipping address");
  }

  const data = await magentoGraphqlFetch<MagentoSetBillingAddressOnCartResponse>({
    query: MAGENTO_SET_BILLING_ADDRESS_ON_CART_MUTATION,
    variables: {
      cartId,
      billingAddress: billingAddressInput,
    },
    signal,
    cache: "no-store",
  });

  return mapGuestCartState(assertCart(data.setBillingAddressOnCart?.cart), lineMetadata);
}

export async function applyGuestCheckoutAddresses(
  cartId: string,
  form: CheckoutFormData,
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  await setGuestEmailOnCart(cartId, resolveGuestCheckoutEmail(form.phoneOrEmail), signal);

  const shippingAddress = mapCheckoutFormToShippingAddress(form);
  let state = await setGuestShippingAddress(cartId, shippingAddress, lineMetadata, signal);

  if (form.billingSameAsShipping) {
    state = await setGuestBillingAddress(cartId, null, true, lineMetadata, signal);
  } else {
    const billingAddress = mapCheckoutFormToBillingAddress(form);
    state = await setGuestBillingAddress(cartId, billingAddress, false, lineMetadata, signal);
  }

  return state;
}

export async function setGuestShippingMethod(
  cartId: string,
  carrierCode: string,
  methodCode: string,
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  const data = await magentoGraphqlFetch<MagentoSetShippingMethodsOnCartResponse>({
    query: MAGENTO_SET_SHIPPING_METHODS_ON_CART_MUTATION,
    variables: {
      cartId,
      shippingMethods: [{ carrier_code: carrierCode, method_code: methodCode }],
    },
    signal,
    cache: "no-store",
  });

  return mapGuestCartState(assertCart(data.setShippingMethodsOnCart?.cart), lineMetadata);
}

export async function selectFirstAvailableGuestShippingMethod(
  cartId: string,
  state: GuestCartState,
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  const defaultMethod = pickDefaultShippingMethod(state.totals.shippingMethods);

  if (!defaultMethod) {
    return state;
  }

  if (
    state.totals.selectedShippingMethod?.carrierCode === defaultMethod.carrierCode &&
    state.totals.selectedShippingMethod?.methodCode === defaultMethod.methodCode
  ) {
    return state;
  }

  return setGuestShippingMethod(
    cartId,
    defaultMethod.carrierCode,
    defaultMethod.methodCode,
    lineMetadata,
    signal,
  );
}

export async function prepareGuestCheckoutForPayment(
  cartId: string,
  form: CheckoutFormData,
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  const addressedState = await applyGuestCheckoutAddresses(cartId, form, lineMetadata, signal);
  const shippingState = await selectFirstAvailableGuestShippingMethod(
    cartId,
    addressedState,
    lineMetadata,
    signal,
  );
  return syncGuestCartLineOptions(cartId, lineMetadata, signal);
}

export async function setGuestPaymentMethod(
  cartId: string,
  paymentCode: string,
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  const data = await magentoGraphqlFetch<MagentoSetPaymentMethodOnCartResponse>({
    query: MAGENTO_SET_PAYMENT_METHOD_ON_CART_MUTATION,
    variables: {
      cartId,
      paymentMethod: { code: paymentCode },
    },
    signal,
    cache: "no-store",
  });

  return mapGuestCartState(assertCart(data.setPaymentMethodOnCart?.cart), lineMetadata);
}

export async function createGuestPaymentOrder(
  cartId: string,
  methodCode: string,
  paymentSource: string,
  signal?: AbortSignal,
): Promise<MagentoPaymentOrder> {
  const data = await magentoGraphqlFetch<MagentoCreatePaymentOrderResponse>({
    query: MAGENTO_CREATE_PAYMENT_ORDER_MUTATION,
    variables: {
      input: {
        cartId,
        location: "CHECKOUT",
        methodCode,
        paymentSource,
      },
    },
    signal,
    cache: "no-store",
  });

  const paymentOrder = data.createPaymentOrder;
  const id = paymentOrder?.id?.trim();

  if (!paymentOrder || !id) {
    throw new Error("Magento did not return a payment order");
  }

  return {
    id,
    mpOrderId: paymentOrder.mp_order_id?.trim() || null,
    status: paymentOrder.status?.trim() || null,
    amount: paymentOrder.amount ?? null,
    currencyCode: paymentOrder.currency_code?.trim() || null,
  };
}

export async function placeGuestOrder(
  cartId: string,
  signal?: AbortSignal,
): Promise<PlacedGuestOrder> {
  const data = await magentoGraphqlFetch<MagentoPlaceOrderResponse>({
    query: MAGENTO_PLACE_ORDER_MUTATION,
    variables: { cartId },
    signal,
    cache: "no-store",
  });

  const placeOrderResult = data.placeOrder;
  const errors = placeOrderResult?.errors ?? [];

  if (errors.length > 0) {
    const normalizedErrors = errors
      .map((error) => ({
        message: error.message?.trim() || "Magento could not place the order",
      }))
      .filter((error) => error.message);

    throw new MagentoGraphqlError(
      normalizedErrors[0]?.message ?? "Magento could not place the order",
      normalizedErrors,
    );
  }

  const orderNumber = placeOrderResult?.orderV2?.number?.trim();
  const orderId = placeOrderResult?.orderV2?.id?.trim();

  if (!orderNumber) {
    throw new Error("Magento did not return an order number");
  }

  return {
    orderNumber,
    orderId: orderId ?? orderNumber,
  };
}

export async function completeGuestCheckout(
  cartId: string,
  paymentMethod: CheckoutPaymentData["method"],
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<PlacedGuestOrder> {
  const cartState = await fetchGuestCart(cartId, lineMetadata, signal);
  const paymentCode = resolveMagentoPaymentCode(
    paymentMethod,
    cartState.totals.paymentMethods,
  );

  if (!paymentCode) {
    throw new Error("No payment methods are available for this cart");
  }

  if (!isOfflineMagentoPaymentCode(paymentCode)) {
    await createGuestPaymentOrder(
      cartId,
      paymentCode,
      mapUiMethodToPaymentSource(paymentMethod),
      signal,
    );
    throw new Error(
      "Online payment is not fully configured in the storefront yet. Please try Cash on Delivery or contact support.",
    );
  }

  await setGuestPaymentMethod(cartId, paymentCode, lineMetadata, signal);
  await syncGuestCartLineOptions(cartId, lineMetadata, signal);
  return placeGuestOrder(cartId, signal);
}

export async function estimateGuestCartShippingMethods(
  cartId: string,
  signal?: AbortSignal,
): Promise<MagentoShippingMethodOption[]> {
  const data = await magentoGraphqlFetch<MagentoEstimateShippingMethodsResponse>({
    query: MAGENTO_ESTIMATE_SHIPPING_METHODS_MUTATION,
    variables: {
      input: {
        cart_id: cartId,
        address: DEFAULT_CART_SHIPPING_ESTIMATE_ADDRESS,
      },
    },
    signal,
    cache: "no-store",
  });

  return mapEstimateShippingMethods(data.estimateShippingMethods);
}
