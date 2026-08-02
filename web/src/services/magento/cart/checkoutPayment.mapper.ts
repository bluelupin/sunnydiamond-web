import type { CheckoutPaymentData } from "@/features/checkout/types/checkout.types";
import type { MagentoPaymentMethodOption } from "./magentoCart.types";

const PAYMENT_CODE_PREFERENCES: Record<CheckoutPaymentData["method"], string[]> = {
  cod: ["cashondelivery", "cod", "checkmo"],
  card: [
    "razorpay",
    "payment_services_paypal_hosted_fields",
    "payflowpro",
    "braintree",
    "checkmo",
  ],
  upi: ["razorpay", "upi", "checkmo"],
  netbanking: ["razorpay", "netbanking", "checkmo"],
};

const OFFLINE_PAYMENT_CODES = new Set(["checkmo", "cashondelivery", "cod", "free"]);

export function resolveMagentoPaymentCode(
  uiMethod: CheckoutPaymentData["method"],
  availableMethods: MagentoPaymentMethodOption[],
): string | null {
  const availableCodes = new Set(availableMethods.map((method) => method.code));

  for (const code of PAYMENT_CODE_PREFERENCES[uiMethod]) {
    if (availableCodes.has(code)) {
      return code;
    }
  }

  return availableMethods[0]?.code ?? null;
}

export function isOfflineMagentoPaymentCode(paymentCode: string): boolean {
  return OFFLINE_PAYMENT_CODES.has(paymentCode);
}

export function mapUiMethodToPaymentSource(uiMethod: CheckoutPaymentData["method"]): string {
  switch (uiMethod) {
    case "card":
      return "card";
    case "upi":
      return "upi";
    case "netbanking":
      return "netbanking";
    case "cod":
      return "cod";
    default:
      return uiMethod;
  }
}
