import type { MagentoMediaGalleryItem } from "../products/magentoProduct.types";

export type MagentoCartProduct = {
  sku?: string | null;
  name?: string | null;
  url_key?: string | null;
  media_gallery?: MagentoMediaGalleryItem[] | null;
};

export type MagentoCartCustomizableOption = {
  label?: string | null;
  values?: Array<{
    label?: string | null;
    value?: string | null;
  }> | null;
};

export type MagentoGiftMessage = {
  message?: string | null;
};

export type MagentoGiftMode = "GROUPED" | "SEPARATE";

export type MagentoCartItem = {
  uid?: string | null;
  quantity?: number | null;
  customizable_options?: MagentoCartCustomizableOption[] | null;
  is_gift?: boolean | null;
  gift_message?: MagentoGiftMessage | null;
  product?: MagentoCartProduct | null;
  prices?: {
    price?: { value?: number | null } | null;
    row_total?: { value?: number | null } | null;
  } | null;
};

export type MagentoCartDiscount = {
  label?: string | null;
  applied_to?: string | null;
  amount?: { value?: number | null } | null;
  coupon?: { code?: string | null } | null;
};

export type MagentoCartPrices = {
  grand_total?: { value?: number | null; currency?: string | null } | null;
  subtotal_excluding_tax?: { value?: number | null } | null;
  applied_taxes?: Array<{
    label?: string | null;
    amount?: { value?: number | null } | null;
  }> | null;
  discounts?: MagentoCartDiscount[] | null;
};

export type MagentoShippingMethod = {
  carrier_code?: string | null;
  carrier_title?: string | null;
  method_code?: string | null;
  method_title?: string | null;
  amount?: { value?: number | null; currency?: string | null } | null;
};

export type MagentoPaymentMethod = {
  code?: string | null;
  title?: string | null;
};

export type MagentoCartShippingAddress = {
  available_shipping_methods?: MagentoShippingMethod[] | null;
  selected_shipping_method?: MagentoShippingMethod | null;
};

export type MagentoCart = {
  id?: string | null;
  total_quantity?: number | null;
  gift_mode?: MagentoGiftMode | null;
  gift_message?: MagentoGiftMessage | null;
  prices?: MagentoCartPrices | null;
  shipping_addresses?: MagentoCartShippingAddress[] | null;
  available_payment_methods?: MagentoPaymentMethod[] | null;
  selected_payment_method?: MagentoPaymentMethod | null;
  itemsV2?: {
    items?: MagentoCartItem[] | null;
  } | null;
};

export type MagentoCartResponse = {
  cart?: MagentoCart | null;
};

export type MagentoCreateGuestCartResponse = {
  createGuestCart?: {
    cart?: Pick<MagentoCart, "id"> | null;
  } | null;
};

export type MagentoAddSimpleProductsToCartResponse = {
  addSimpleProductsToCart?: {
    cart?: MagentoCart | null;
  } | null;
};

export type MagentoAddProductsToCartResponse = {
  addProductsToCart?: {
    cart?: MagentoCart | null;
    user_errors?: Array<{
      code?: string | null;
      message?: string | null;
    }> | null;
  } | null;
};

export type MagentoSyncCartItemsOptionsResponse = {
  updateCartItems?: {
    cart?: MagentoCart | null;
  } | null;
};

export type MagentoUpdateCartItemsResponse = {
  updateCartItems?: {
    cart?: MagentoCart | null;
  } | null;
};

export type MagentoRemoveItemFromCartResponse = {
  removeItemFromCart?: {
    cart?: MagentoCart | null;
  } | null;
};

export type MagentoCartAddressInput = {
  firstname: string;
  lastname: string;
  street: string[];
  city: string;
  postcode: string;
  country_code: string;
  region_id: number;
  telephone: string;
};

export type MagentoEstimateAddressInput = {
  postcode: string;
  country_code: string;
  region: {
    region_id: number;
  };
};

export type MagentoShippingAddressInput = {
  address?: MagentoCartAddressInput;
  customer_address_uid?: string;
};

export type MagentoBillingAddressInput = {
  address?: MagentoCartAddressInput;
  customer_address_uid?: string;
  same_as_shipping?: boolean;
};

export type MagentoSetGuestEmailOnCartResponse = {
  setGuestEmailOnCart?: {
    cart?: Pick<MagentoCart, "id"> | null;
  } | null;
};

export type MagentoSetShippingAddressesOnCartResponse = {
  setShippingAddressesOnCart?: {
    cart?: MagentoCart | null;
  } | null;
};

export type MagentoSetBillingAddressOnCartResponse = {
  setBillingAddressOnCart?: {
    cart?: MagentoCart | null;
  } | null;
};

export type MagentoSetShippingMethodsOnCartResponse = {
  setShippingMethodsOnCart?: {
    cart?: MagentoCart | null;
  } | null;
};

export type MagentoShippingMethodOption = {
  carrierCode: string;
  carrierTitle: string;
  methodCode: string;
  methodTitle: string;
  amount: number;
  currency: string;
};

export type MagentoSelectedShippingMethod = {
  carrierCode: string;
  methodCode: string;
  title: string;
  amount: number;
};

export type MagentoPaymentMethodOption = {
  code: string;
  title: string;
};

export type MagentoSelectedPaymentMethod = {
  code: string;
  title: string;
};

export type PlacedGuestOrder = {
  orderNumber: string;
  orderId: string;
};

export type GuestCheckoutResult = PlacedGuestOrder & {
  paymentCode: string;
  /** True when the order is placed but still needs an online (Razorpay) payment. */
  awaitingOnlinePayment: boolean;
};

export type MagentoPaymentOrder = {
  id: string;
  mpOrderId: string | null;
  status: string | null;
  amount: number | null;
  currencyCode: string | null;
};

export type MagentoSetPaymentMethodOnCartResponse = {
  setPaymentMethodOnCart?: {
    cart?: MagentoCart | null;
  } | null;
};

export type MagentoSetGiftOptionsResponse = {
  setSunnyGiftOptions?: {
    cart?: MagentoCart | null;
  } | null;
};

export type MagentoPlaceOrderResponse = {
  placeOrder?: {
    orderV2?: {
      id?: string | null;
      number?: string | null;
    } | null;
    errors?: Array<{
      message?: string | null;
      code?: string | null;
    }> | null;
  } | null;
};

export type MagentoCreatePaymentOrderResponse = {
  createPaymentOrder?: {
    id?: string | null;
    mp_order_id?: string | null;
    status?: string | null;
    amount?: number | null;
    currency_code?: string | null;
  } | null;
};

export type MagentoEstimateShippingMethodsResponse = {
  estimateShippingMethods?: MagentoShippingMethod[] | null;
};

export type MappedMagentoCart = {
  cartId: string;
  totalQuantity: number;
  subtotal: number;
  taxes: number;
  shipping: number;
  offerDiscount: number;
  giftCardDiscount: number;
  appliedGiftCardCode: string | null;
  grandTotal: number;
  currency: string;
  shippingMethods: MagentoShippingMethodOption[];
  selectedShippingMethod: MagentoSelectedShippingMethod | null;
  paymentMethods: MagentoPaymentMethodOption[];
  selectedPaymentMethod: MagentoSelectedPaymentMethod | null;
};
