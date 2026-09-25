export type CheckoutFormData = {
  name: string;
  phoneOrEmail: string;
  /** Dial code for `phoneOrEmail` when the contact value is a phone number. */
  contactCountryCode: string;
  shippingName: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  city: string;
  state: string;
  shippingPhone: string;
  shippingCountryCode: string;
  billingSameAsShipping: boolean;
  billingName: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingPincode: string;
  billingCity: string;
  billingState: string;
  billingPhone: string;
  billingCountryCode: string;
  /** Saved profile address uid when checkout shipping matches a saved address. */
  selectedShippingAddressUid: string | null;
  /** Signed-in customers opt in to storing the checkout addresses in their address book. */
  saveAddressToProfile: boolean;
};

/**
 * Card/UPI/netbanking details are collected inside Razorpay's payment modal,
 * never in our forms — the checkout only tracks the chosen method.
 */
export type CheckoutPaymentData = {
  method: "card" | "upi" | "netbanking" | "cod";
};

export type CheckoutStep = "form" | "payment" | "success";

export const createEmptyCheckoutForm = (): CheckoutFormData => ({
  name: "",
  phoneOrEmail: "",
  contactCountryCode: "+91",
  shippingName: "",
  addressLine1: "",
  addressLine2: "",
  pincode: "",
  city: "",
  state: "",
  shippingPhone: "",
  shippingCountryCode: "+91",
  billingSameAsShipping: true,
  billingName: "",
  billingAddressLine1: "",
  billingAddressLine2: "",
  billingPincode: "",
  billingCity: "",
  billingState: "",
  billingPhone: "",
  billingCountryCode: "+91",
  selectedShippingAddressUid: null,
  saveAddressToProfile: false,
});

export const createEmptyPaymentForm = (): CheckoutPaymentData => ({
  method: "card",
});

export const getExpectedDeliveryDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
