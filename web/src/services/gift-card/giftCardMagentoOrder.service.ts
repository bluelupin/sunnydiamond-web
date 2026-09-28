import {
  completeGuestCheckout,
  createGuestCart,
  selectFirstAvailableGuestShippingMethod,
  setCheckoutShippingAddress,
  setGuestBillingAddress,
  setGuestEmailOnCart,
} from "@/services/magento/cart/cart.service";
import {
  mapCheckoutFormToBillingAddress,
  mapCheckoutFormToShippingAddress,
  resolveGuestCheckoutEmail,
} from "@/services/magento/cart/checkoutAddress.mapper";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import type { CheckoutFormData } from "@/features/checkout/types/checkout.types";
import type { GiftCardOrderPayload } from "@/features/gift-card/services/giftCardOrder.types";
import type { GiftCardPartyDetails } from "@/features/gift-card/context/GiftCardFlowContext";

// Magento prices the line at the amount and stores the details on the order (SunnyDiamonds_GiftCard).
const ADD_GIFT_CARD_TO_CART_MUTATION = `
  mutation SunnyAddGiftCardToCart($input: SunnyAddGiftCardToCartInput!) {
    sunnyAddGiftCardToCart(input: $input) {
      cart { id }
    }
  }
`;

function formatPhone(party: GiftCardPartyDetails): string {
  return `${party.countryCode.trim() || "+91"} ${party.phone.replace(/\D/g, "")}`;
}

// The address step collects the delivery address (physical) or the billing address (digital).
function mapGiftCardPayloadToCheckoutForm(payload: GiftCardOrderPayload): CheckoutFormData {
  const receiver = payload.receiverSameAsSender ? payload.sender : payload.receiver;
  const address = payload.deliveryAddress;

  return {
    name: payload.sender.fullName.trim(),
    phoneOrEmail: payload.sender.email.trim() || payload.sender.phone.trim(),
    contactCountryCode: payload.sender.countryCode,
    shippingName: receiver.fullName.trim(),
    addressLine1: address.addressLine1.trim(),
    addressLine2: address.addressLine2.trim(),
    pincode: address.pincode.trim(),
    city: address.city.trim(),
    state: address.state.trim(),
    shippingPhone: receiver.phone.trim(),
    shippingCountryCode: receiver.countryCode,
    billingSameAsShipping: false,
    billingName: payload.sender.fullName.trim(),
    billingAddressLine1: address.addressLine1.trim(),
    billingAddressLine2: address.addressLine2.trim(),
    billingPincode: address.pincode.trim(),
    billingCity: address.city.trim(),
    billingState: address.state.trim(),
    billingPhone: payload.sender.phone.trim(),
    billingCountryCode: payload.sender.countryCode,
    selectedShippingAddressUid: null,
    saveAddressToProfile: false,
  };
}

export async function placeGiftCardMagentoOrder(payload: GiftCardOrderPayload) {
  const receiver = payload.receiverSameAsSender ? payload.sender : payload.receiver;
  const isDigital = payload.cardType === "digital";
  const form = mapGiftCardPayloadToCheckoutForm(payload);
  const noLineMetadata = {};

  const cartId = await createGuestCart();
  await magentoGraphqlFetch({
    query: ADD_GIFT_CARD_TO_CART_MUTATION,
    variables: {
      input: {
        cart_id: cartId,
        type: isDigital ? "DIGITAL" : "PHYSICAL",
        amount: payload.amount,
        sender_name: payload.sender.fullName.trim(),
        recipient_name: receiver.fullName.trim(),
        recipient_email: receiver.email.trim() || null,
        recipient_phone: formatPhone(receiver),
        occasion: payload.occasion.trim() || null,
        delivery_date: isDigital ? payload.digitalDeliveryDate?.trim() || null : null,
        message: payload.message.trim() || null,
      },
    },
    cache: "no-store",
  });
  await setGuestEmailOnCart(cartId, resolveGuestCheckoutEmail(form.phoneOrEmail));

  if (!isDigital) {
    const state = await setCheckoutShippingAddress(
      cartId,
      { address: mapCheckoutFormToShippingAddress(form) },
      noLineMetadata,
    );
    await selectFirstAvailableGuestShippingMethod(cartId, state, noLineMetadata);
  }
  await setGuestBillingAddress(cartId, mapCheckoutFormToBillingAddress(form), false, noLineMetadata);

  const order = await completeGuestCheckout(cartId, "card", noLineMetadata);

  return {
    orderNumber: order.orderNumber,
    awaitingOnlinePayment: order.awaitingOnlinePayment,
  };
}
