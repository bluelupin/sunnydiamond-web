import type { CheckoutPaymentData } from "@/features/checkout/types/checkout.types";
import type { MagentoPaymentMethodOption } from "./magentoCart.types";

/**
 * Codes that actually mean "pay the courier in cash". checkmo is deliberately
 * NOT one of them — see PAYMENT_CODE_PREFERENCES.cod.
 */
const COD_PAYMENT_CODES = ["cashondelivery", "cod"];

const PAYMENT_CODE_PREFERENCES: Record<CheckoutPaymentData["method"], string[]> = {
  // No checkmo fallback. Magento only offers cashondelivery inside its own
  // min/max range, and when it drops out (an order under the configured floor,
  // an engraved cart) checkmo is usually still enabled — so a fallback here
  // placed the order as "Check / Money order" while the customer believed they
  // had chosen cash on delivery, with no warning on either side.
  cod: COD_PAYMENT_CODES,
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

  // COD must never fall back to an online gateway — e.g. engraved carts, where
  // the backend strips all cod-family methods. Null lets the caller surface
  // "not available" instead of silently opening Razorpay.
  if (uiMethod === "cod") {
    return null;
  }

  return availableMethods[0]?.code ?? null;
}

/**
 * Whether Magento is offering cash on delivery for THIS cart.
 *
 * The backend is the only thing that knows: it applies the configured order
 * minimum and maximum, the engraved-item restriction, and anything else the
 * client cannot see. The storefront used to decide with its own hardcoded
 * ceiling, which disagreed with the backend's floor and let a customer pick COD
 * on an order Magento would not accept it for.
 *
 * An empty list means "not loaded yet", not "unavailable" — callers must treat
 * it as unknown rather than switching the customer's choice out from under them.
 */
export function isCodOfferedByBackend(availableMethods: MagentoPaymentMethodOption[]): boolean {
  return availableMethods.some((method) => COD_PAYMENT_CODES.includes(method.code));
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
