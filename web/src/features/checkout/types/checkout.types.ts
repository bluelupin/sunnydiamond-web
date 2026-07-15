export type CheckoutFormData = {
  name: string;
  phoneOrEmail: string;
  shippingName: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  city: string;
  state: string;
  shippingPhone: string;
  billingSameAsShipping: boolean;
  billingName: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingPincode: string;
  billingCity: string;
  billingState: string;
  billingPhone: string;
};

export type CheckoutPaymentData = {
  method: "card" | "upi" | "netbanking" | "cod";
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

export type CheckoutStep = "form" | "payment" | "success";

export const createEmptyCheckoutForm = (): CheckoutFormData => ({
  name: "",
  phoneOrEmail: "",
  shippingName: "",
  addressLine1: "",
  addressLine2: "",
  pincode: "",
  city: "",
  state: "",
  shippingPhone: "",
  billingSameAsShipping: true,
  billingName: "",
  billingAddressLine1: "",
  billingAddressLine2: "",
  billingPincode: "",
  billingCity: "",
  billingState: "",
  billingPhone: "",
});

export const createEmptyPaymentForm = (): CheckoutPaymentData => ({
  method: "card",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
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
