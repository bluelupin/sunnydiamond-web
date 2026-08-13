import { magentoGraphqlFetch } from "../graphqlClient";
import { MAGENTO_GET_CART_QUERY, MAGENTO_GET_CUSTOMER_CART_QUERY } from "./cart.queries";
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
  MAGENTO_SET_GIFT_OPTIONS_MUTATION,
} from "./cart.mutations";
import {
  mapMagentoCartItems,
  mapMagentoCartTotals,
  mapEstimateShippingMethods,
  pickDefaultShippingMethod,
  computeCartTotalQuantity,
} from "./cart.mapper";
import {
  clearGuestCartId,
  getGuestCartId,
  setGuestCartId,
  writeCartLineMetadata,
  type CartLineMetadata,
  type StoredCartLineMetadata,
} from "./cartSession";
import type { CartLineOptions } from "@/features/cart/types/cart.types";
import type { ProductCustomOptions } from "@/features/products/types/productCustomOptions";
import {
  buildMagentoCartItemOptionPayload,
  buildMagentoCartItemSyncOptions,
  mapMagentoCartCustomizableOptions,
  syncOptionsMatchServer,
  type CartLineServerCustomOptions,
} from "./cartLineCustomOptions.mapper";
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
  GuestCheckoutResult,
  PlacedGuestOrder,
  MagentoUpdateCartItemsResponse,
  MagentoSetGiftOptionsResponse,
  MappedMagentoCart,
} from "./magentoCart.types";
import type { CartGiftingSelection, CartLineItem } from "@/features/cart/types/cart.types";
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
import { MAGENTO_CUSTOMER_CART_QUERY } from "@/services/customer/customer.gql";
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

  const items = mapMagentoCartItems(cart, lineMetadata);

  return {
    cart,
    totals: {
      ...totals,
      // Badge and bag UI should match visible line items — Magento total_quantity
      // can include lines we skip when product data is incomplete.
      totalQuantity: computeCartTotalQuantity(items),
    },
    items,
  };
}

/** updateCartItems reports option validation failures in errors[], not top-level GraphQL errors. */
function assertNoUpdateCartItemsErrors(
  errors: Array<{ code?: string | null; message?: string | null }> | null | undefined,
): void {
  const messages = (errors ?? [])
    .map((error) => error.message?.trim().replace(/^Could not update cart item:\s*/i, ""))
    .filter((message): message is string => Boolean(message));

  if (messages.length > 0) {
    throw new MagentoGraphqlError(
      messages.join("; "),
      messages.map((message) => ({ message })),
    );
  }
}

function mapServerCustomOptionsByUid(
  cart: MagentoCart,
): Map<string, CartLineServerCustomOptions> {
  const byUid = new Map<string, CartLineServerCustomOptions>();

  for (const item of cart.itemsV2?.items ?? []) {
    const uid = item.uid?.trim();
    if (uid) {
      byUid.set(uid, mapMagentoCartCustomizableOptions(item.customizable_options).serverOptions);
    }
  }

  return byUid;
}

function isCustomerCartRequiredError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("customerCart") || message.includes("CustomerCart");
}

export async function fetchCustomerCart(
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  const data = await magentoGraphqlFetch<{ customerCart: MagentoCart }>({
    query: MAGENTO_GET_CUSTOMER_CART_QUERY,
    signal,
    cache: "no-store",
  });

  const cart = assertCart(data.customerCart);
  setGuestCartId(cart.id!.trim());
  return mapGuestCartState(cart, lineMetadata);
}

async function tryEnsureCustomerCartId(signal?: AbortSignal): Promise<string | null> {
  try {
    const data = await magentoGraphqlFetch<{ customerCart: { id: string } }>({
      query: MAGENTO_CUSTOMER_CART_QUERY,
      signal,
      cache: "no-store",
    });

    const cartId = data.customerCart?.id?.trim();
    if (!cartId) {
      return null;
    }

    setGuestCartId(cartId);
    return cartId;
  } catch {
    return null;
  }
}

export async function ensureCustomerCartId(signal?: AbortSignal): Promise<string> {
  const cartId = await tryEnsureCustomerCartId(signal);
  if (!cartId) {
    throw new Error("Failed to resolve customer cart");
  }

  return cartId;
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
  try {
    const data = await magentoGraphqlFetch<MagentoCartResponse>({
      query: MAGENTO_GET_CART_QUERY,
      variables: { cartId },
      signal,
      cache: "no-store",
    });

    return mapGuestCartState(assertCart(data.cart), lineMetadata);
  } catch (error) {
    if (isCustomerCartRequiredError(error)) {
      return fetchCustomerCart(lineMetadata, signal);
    }

    throw error;
  }
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
    } catch (error) {
      if (isCustomerCartRequiredError(error)) {
        const customerCartId = await tryEnsureCustomerCartId(signal);
        if (customerCartId) {
          return customerCartId;
        }
      }

      clearGuestCartId();
    }
  }

  const customerCartId = await tryEnsureCustomerCartId(signal);
  if (customerCartId) {
    return customerCartId;
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
  configurableOptionUids?: string[];
  lineMetadata: StoredCartLineMetadata;
  signal?: AbortSignal;
};

export async function addProductToGuestCart({
  cartId,
  sku,
  quantity,
  lineOptions = {},
  productCustomOptions,
  configurableOptionUids = [],
  lineMetadata,
  signal,
}: AddProductToGuestCartInput): Promise<GuestCartState> {
  const configurableUids = configurableOptionUids.map((uid) => uid.trim()).filter(Boolean);
  const optionPayload = buildMagentoCartItemOptionPayload(
    lineOptions,
    configurableUids.length > 0 && productCustomOptions
      ? { ...productCustomOptions, metal: undefined }
      : productCustomOptions,
  );
  const selectedOptions = [...(optionPayload?.selectedOptions ?? []), ...configurableUids];
  const enteredOptions = optionPayload?.enteredOptions ?? [];

  if (!optionPayload && configurableUids.length === 0) {
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
          ...(enteredOptions.length > 0 ? { entered_options: enteredOptions } : {}),
          ...(selectedOptions.length > 0 ? { selected_options: selectedOptions } : {}),
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
  let metadata = lineMetadata;
  let metadataChanged = false;
  let state = await fetchGuestCart(cartId, metadata, signal);
  // Lines whose sync the server refused — the server-stored value stands.
  const refused = new Set<string>();

  // One line per mutation: every real update rotates that item's uid, and a
  // batched call gives no way to pair old uids with new ones for re-keying.
  for (;;) {
    const serverOptionsByUid = mapServerCustomOptionsByUid(state.cart);
    let target: { id: string; quantity: number } | null = null;
    let targetOptions: ReturnType<typeof buildMagentoCartItemSyncOptions> = null;

    for (const item of state.items) {
      if (refused.has(item.id)) {
        continue;
      }
      const itemMetadata = metadata[item.id];
      if (!itemMetadata) {
        continue;
      }

      const serverOptions = serverOptionsByUid.get(item.id);
      const syncOptions = buildMagentoCartItemSyncOptions({
        lineOptions: itemMetadata.options,
        serverOptions,
        productCustomOptions: itemMetadata.productCustomOptions,
      });

      if (!syncOptions) {
        continue;
      }

      // A no-op update still rotates the cart item uid and orphans line metadata.
      if (serverOptions && syncOptionsMatchServer(syncOptions, serverOptions)) {
        continue;
      }

      target = item;
      targetOptions = syncOptions;
      break;
    }

    if (!target || !targetOptions) {
      break;
    }

    const data = await magentoGraphqlFetch<MagentoSyncCartItemsOptionsResponse>({
      query: MAGENTO_SYNC_CART_ITEMS_OPTIONS_MUTATION,
      variables: {
        cartId,
        cartItems: [
          {
            cart_item_uid: target.id,
            quantity: target.quantity,
            customizable_options: targetOptions,
          },
        ],
      },
      signal,
      cache: "no-store",
    });

    const errorMessages = (data.updateCartItems?.errors ?? [])
      .map((error) => error.message?.trim())
      .filter(Boolean);

    if (errorMessages.length > 0) {
      // Stale local options the server rejects must not block checkout — the
      // quote keeps its stored (valid) values for that line.
      console.warn(
        `Cart line option sync refused for ${target.id}: ${errorMessages.join("; ")}`,
      );
      refused.add(target.id);
    }

    const cart = assertCart(data.updateCartItems?.cart);

    // Re-key this line's metadata onto the one uid that is new in the response.
    const previousIds = new Set(state.items.map((item) => item.id));
    const rotatedUid = (cart.itemsV2?.items ?? [])
      .map((item) => item.uid?.trim())
      .find((uid): uid is string => Boolean(uid) && !previousIds.has(uid as string));

    if (rotatedUid && rotatedUid !== target.id && metadata[target.id]) {
      const rekeyed = { ...metadata };
      rekeyed[rotatedUid] = rekeyed[target.id];
      delete rekeyed[target.id];
      metadata = rekeyed;
      metadataChanged = true;
    }

    state = mapGuestCartState(cart, metadata);
  }

  if (metadataChanged) {
    writeCartLineMetadata(metadata);
  }

  return state;
}

export async function syncGuestCartLineOption(
  cartId: string,
  cartItemUid: string,
  metadata: CartLineMetadata,
  quantity: number,
  lineMetadata: StoredCartLineMetadata,
  serverOptions?: CartLineServerCustomOptions,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  const syncOptions = buildMagentoCartItemSyncOptions({
    lineOptions: metadata.options,
    serverOptions,
    productCustomOptions: metadata.productCustomOptions,
  });

  if (!syncOptions) {
    throw new MagentoGraphqlError("Selected product options could not be synced to the cart");
  }

  // A no-op update still rotates the cart item uid — skip the mutation entirely.
  if (serverOptions && syncOptionsMatchServer(syncOptions, serverOptions)) {
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
          customizable_options: syncOptions,
        },
      ],
    },
    signal,
    cache: "no-store",
  });

  assertNoUpdateCartItemsErrors(data.updateCartItems?.errors);

  // Item uids rotate on update — the mutation response is the only reliable post-update state.
  return mapGuestCartState(assertCart(data.updateCartItems?.cart), lineMetadata);
}

export async function setCartGiftOptions(
  cartId: string,
  selection: CartGiftingSelection,
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  const data = await magentoGraphqlFetch<MagentoSetGiftOptionsResponse>({
    query: MAGENTO_SET_GIFT_OPTIONS_MUTATION,
    variables: {
      input: {
        cart_id: cartId,
        mode: selection.mode === "separate" ? "SEPARATE" : "GROUPED",
        grouped_note: selection.groupedNote?.trim() || null,
        items: selection.items.map((item) => ({
          cart_item_uid: item.lineItemId,
          is_gift: item.isGift,
          note: item.note?.trim() || null,
        })),
      },
    },
    signal,
    cache: "no-store",
  });

  return mapGuestCartState(assertCart(data.setSunnyGiftOptions?.cart), lineMetadata);
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

export async function setCartShippingAddressByUid(
  cartId: string,
  customerAddressUid: string,
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  const shippingAddresses: MagentoShippingAddressInput[] = [
    { customer_address_uid: customerAddressUid },
  ];

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

export type CheckoutPrepareOptions = {
  isAuthenticated: boolean;
  customerEmail?: string;
};

export async function applyCheckoutAddresses(
  cartId: string,
  form: CheckoutFormData,
  lineMetadata: StoredCartLineMetadata,
  options: CheckoutPrepareOptions,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  if (!options.isAuthenticated) {
    await setGuestEmailOnCart(cartId, resolveGuestCheckoutEmail(form.phoneOrEmail), signal);
  }

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

export async function applyGuestCheckoutAddresses(
  cartId: string,
  form: CheckoutFormData,
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  return applyCheckoutAddresses(
    cartId,
    form,
    lineMetadata,
    { isAuthenticated: false },
    signal,
  );
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

export async function fetchActiveCartState(
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  const cartId = getGuestCartId();

  if (!cartId) {
    throw new Error("Magento cart was not available");
  }

  try {
    return await fetchGuestCart(cartId, lineMetadata, signal);
  } catch (error) {
    if (isCustomerCartRequiredError(error)) {
      return fetchCustomerCart(lineMetadata, signal);
    }

    throw error;
  }
}

export async function prepareCheckoutForPayment(
  cartId: string,
  form: CheckoutFormData,
  lineMetadata: StoredCartLineMetadata,
  options: CheckoutPrepareOptions,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  const addressedState = await applyCheckoutAddresses(cartId, form, lineMetadata, options, signal);
  const syncedState = await syncGuestCartLineOptions(cartId, lineMetadata, signal);
  await selectFirstAvailableGuestShippingMethod(cartId, syncedState, lineMetadata, signal);

  return fetchActiveCartState(lineMetadata, signal);
}

export async function prepareGuestCheckoutForPayment(
  cartId: string,
  form: CheckoutFormData,
  lineMetadata: StoredCartLineMetadata,
  signal?: AbortSignal,
): Promise<GuestCartState> {
  return prepareCheckoutForPayment(
    cartId,
    form,
    lineMetadata,
    { isAuthenticated: false },
    signal,
  );
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
): Promise<GuestCheckoutResult> {
  const cartState = await fetchGuestCart(cartId, lineMetadata, signal);
  const paymentCode = resolveMagentoPaymentCode(
    paymentMethod,
    cartState.totals.paymentMethods,
  );

  if (!paymentCode) {
    // Engraved carts have cod-family methods stripped by the backend — never
    // suggest COD here; the resolver already refused to fall back for it.
    throw new Error(
      paymentMethod === "cod"
        ? "Cash on Delivery is not available for this order."
        : "No payment methods are available for this cart",
    );
  }

  if (paymentCode !== "razorpay" && !isOfflineMagentoPaymentCode(paymentCode)) {
    await createGuestPaymentOrder(
      cartId,
      paymentCode,
      mapUiMethodToPaymentSource(paymentMethod),
      signal,
    );
    throw new Error(
      "Online payment is not fully configured in the storefront yet. Please try again or contact support.",
    );
  }

  // Options before payment: a real sync rotates item uids, and doing it after
  // setPaymentMethodOnCart would leave a selected payment on a cart state the
  // shopper never confirmed if the sync stalls.
  await syncGuestCartLineOptions(cartId, lineMetadata, signal);
  await setGuestPaymentMethod(cartId, paymentCode, lineMetadata, signal);
  const order = await placeGuestOrder(cartId, signal);

  return {
    ...order,
    paymentCode,
    awaitingOnlinePayment: paymentCode === "razorpay",
  };
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
