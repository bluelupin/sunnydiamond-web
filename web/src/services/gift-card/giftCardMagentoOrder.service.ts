import {
  completeGuestCheckout,
  createGuestCart,
  addSimpleProductToGuestCart,
  prepareGuestCheckoutForPayment,
  setGuestEmailOnCart,
} from "@/services/magento/cart/cart.service";
import type { CheckoutFormData } from "@/features/checkout/types/checkout.types";
import type { GiftCardOrderPayload } from "@/features/gift-card/services/giftCardOrder.types";

function resolveGiftCardSku(cardType: GiftCardOrderPayload["cardType"]): string {
  const physicalSku = process.env.GIFT_CARD_PHYSICAL_SKU?.trim();
  const digitalSku = process.env.GIFT_CARD_DIGITAL_SKU?.trim();
  const sku = cardType === "digital" ? digitalSku : physicalSku;

  if (!sku) {
    throw new Error(
      "Gift card checkout is not configured yet. Please contact support to complete your order.",
    );
  }

  return sku;
}

function mapGiftCardPayloadToCheckoutForm(payload: GiftCardOrderPayload): CheckoutFormData {
  const receiver = payload.receiverSameAsSender ? payload.sender : payload.receiver;
  const contact = payload.sender.email.trim() || `${payload.sender.phone.trim()}@guest.sunnydiamonds.local`;

  return {
    name: payload.sender.fullName.trim(),
    phoneOrEmail: contact,
    contactCountryCode: "+91",
    shippingName: receiver.fullName.trim() || payload.sender.fullName.trim(),
    addressLine1: payload.deliveryAddress.addressLine1.trim() || "Digital Delivery",
    addressLine2: payload.deliveryAddress.addressLine2.trim(),
    pincode: payload.deliveryAddress.pincode.trim() || "000000",
    city: payload.deliveryAddress.city.trim() || "NA",
    state: payload.deliveryAddress.state.trim() || "NA",
    shippingPhone: receiver.phone.trim() || payload.sender.phone.trim(),
    shippingCountryCode: "+91",
    billingSameAsShipping: true,
    billingName: payload.sender.fullName.trim(),
    billingAddressLine1: payload.deliveryAddress.addressLine1.trim() || "Digital Delivery",
    billingAddressLine2: payload.deliveryAddress.addressLine2.trim(),
    billingPincode: payload.deliveryAddress.pincode.trim() || "000000",
    billingCity: payload.deliveryAddress.city.trim() || "NA",
    billingState: payload.deliveryAddress.state.trim() || "NA",
    billingPhone: payload.sender.phone.trim(),
    billingCountryCode: "+91",
    selectedShippingAddressUid: null,
    saveAddressToProfile: false,
  };
}

export async function placeGiftCardMagentoOrder(payload: GiftCardOrderPayload) {
  const sku = resolveGiftCardSku(payload.cardType);
  const cartId = await createGuestCart();
  const lineMetadata = {};
  await addSimpleProductToGuestCart(cartId, sku, 1, lineMetadata);
  const checkoutForm = mapGiftCardPayloadToCheckoutForm(payload);
  const email = payload.sender.email.trim() || checkoutForm.phoneOrEmail;

  await setGuestEmailOnCart(cartId, email);
  await prepareGuestCheckoutForPayment(cartId, checkoutForm, lineMetadata);

  const order = await completeGuestCheckout(cartId, "card", lineMetadata);

  return {
    orderNumber: order.orderNumber,
    awaitingOnlinePayment: order.awaitingOnlinePayment,
  };
}
