import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";
import {
  clearPendingCheckoutPayment,
  getPaidPendingCheckoutPayment,
  markPendingCheckoutPaymentPaid,
} from "./checkoutPendingPayment";

const RAZORPAY_CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = RAZORPAY_CHECKOUT_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load the Razorpay checkout script"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

type RazorpayStoreConfig = {
  keyId: string;
  merchantName: string;
};

async function fetchRazorpayStoreConfig(): Promise<RazorpayStoreConfig> {
  const data = await magentoGraphqlFetch<{
    storeConfig?: {
      razorpay_key_id?: string | null;
      razorpay_merchant_name_override?: string | null;
    };
  }>({
    query: `query GetRazorpayConfig {
      storeConfig {
        razorpay_key_id
        razorpay_merchant_name_override
      }
    }`,
    cache: "no-store",
  });

  const keyId = data.storeConfig?.razorpay_key_id?.trim();

  if (!keyId) {
    throw new Error("Online payment is not configured for this store");
  }

  return {
    keyId,
    merchantName: data.storeConfig?.razorpay_merchant_name_override?.trim() || "Sunny Diamonds",
  };
}

type MagentoRazorpayOrder = {
  rzpOrderId: string;
};

async function createRazorpayOrder(orderNumber: string): Promise<MagentoRazorpayOrder> {
  const data = await magentoGraphqlFetch<{
    placeRazorpayOrder?: {
      success: boolean;
      rzp_order_id?: string | null;
      message?: string | null;
    };
  }>({
    query: `mutation CreateRazorpayOrder($orderId: String, $referrer: String) {
      placeRazorpayOrder(order_id: $orderId, referrer: $referrer) {
        success
        rzp_order_id
        message
      }
    }`,
    variables: { orderId: orderNumber, referrer: window.location.href },
    cache: "no-store",
  });

  const result = data.placeRazorpayOrder;
  const rzpOrderId = result?.rzp_order_id?.trim();

  if (!result?.success || !rzpOrderId) {
    throw new Error(result?.message || "We could not start the payment. Please try again.");
  }

  return { rzpOrderId };
}

/**
 * Next.js local dev is HTTP-only. Razorpay sometimes follows callbacks as HTTPS
 * on localhost, which triggers ERR_SSL_PROTOCOL_ERROR in Chrome.
 */
export function resolveBrowserCheckoutOrigin(origin = window.location.origin): string {
  try {
    const url = new URL(origin);
    if (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "[::1]"
    ) {
      url.protocol = "http:";
      return url.origin;
    }
    return url.origin;
  } catch {
    return origin;
  }
}

export async function verifyRazorpayPayment(input: {
  orderNumber: string;
  paymentId: string;
  signature: string;
  keepalive?: boolean;
}): Promise<void> {
  try {
    await magentoGraphqlFetch<{
      setRzpPaymentDetailsForOrder?: { order?: { order_id?: string | null } };
    }>({
      query: `mutation VerifyRazorpayPayment($input: SetRzpPaymentDetailsForOrderInput) {
        setRzpPaymentDetailsForOrder(input: $input) {
          order {
            order_id
          }
        }
      }`,
      variables: {
        input: {
          order_id: input.orderNumber,
          rzp_payment_id: input.paymentId,
          rzp_signature: input.signature,
        },
      },
      cache: "no-store",
      keepalive: input.keepalive,
    });
  } catch (error) {
    if (isRazorpayPaymentAlreadyRecordedError(error)) {
      return;
    }

    throw error;
  }
}

function isRazorpayPaymentAlreadyRecordedError(error: unknown): boolean {
  const message =
    error instanceof MagentoGraphqlError
      ? error.message
      : error instanceof Error
        ? error.message
        : "";

  return /unique constraint/i.test(message);
}

export async function recoverPendingPaidCheckoutPayment(): Promise<boolean> {
  const pending = getPaidPendingCheckoutPayment();
  if (!pending?.paymentId || !pending.signature) {
    return false;
  }

  try {
    await verifyRazorpayPayment({
      orderNumber: pending.orderNumber,
      paymentId: pending.paymentId,
      signature: pending.signature,
    });
    clearPendingCheckoutPayment();
    return true;
  } catch {
    return false;
  }
}

/** Reactivates the quote behind an unpaid order so the shopper keeps their bag. */
export async function resetRazorpayCart(orderNumber: string): Promise<boolean> {
  try {
    const data = await magentoGraphqlFetch<{ resetCart?: { success: boolean } }>({
      query: `mutation ResetRazorpayCart($orderId: String) {
        resetCart(order_id: $orderId) {
          success
        }
      }`,
      variables: { orderId: orderNumber },
      cache: "no-store",
    });

    return Boolean(data.resetCart?.success);
  } catch {
    return false;
  }
}

export type RazorpayPaymentOutcome =
  | { status: "paid"; paymentId: string; signature: string }
  | { status: "dismissed" };

/**
 * Runs the full Razorpay checkout for an already-placed Magento order:
 * creates the Razorpay order, opens the payment modal, and resolves when
 * the shopper pays or closes the modal. Card/UPI/netbanking details are
 * collected inside Razorpay's modal and never touch our code.
 */
export async function collectRazorpayPayment(input: {
  orderNumber: string;
  method?: "card" | "upi" | "netbanking";
  prefill: { name?: string; email?: string; contact?: string };
}): Promise<RazorpayPaymentOutcome> {
  const [config, order] = await Promise.all([
    fetchRazorpayStoreConfig(),
    createRazorpayOrder(input.orderNumber),
    loadRazorpayScript(),
  ]);

  if (!window.Razorpay) {
    throw new Error("The Razorpay checkout could not be initialised");
  }

  return new Promise<RazorpayPaymentOutcome>((resolve) => {
    let settled = false;

    const settle = (outcome: RazorpayPaymentOutcome) => {
      if (settled) {
        return;
      }
      settled = true;
      resolve(outcome);
    };

    // Standard Checkout: show every method enabled on the Razorpay key.
    // Prefer the in-page handler (no redirect) so localhost never hits
    // https://localhost → ERR_SSL_PROTOCOL_ERROR after UPI/netbanking.
    const razorpay = new window.Razorpay!({
      key: config.keyId,
      order_id: order.rzpOrderId,
      name: config.merchantName,
      description: `Order #${input.orderNumber}`,
      prefill: {
        ...(input.prefill.name ? { name: input.prefill.name } : {}),
        ...(input.prefill.email ? { email: input.prefill.email } : {}),
        ...(input.prefill.contact ? { contact: input.prefill.contact } : {}),
        ...(input.method ? { method: input.method } : {}),
      },
      handler: (response: RazorpayPaymentResponse) => {
        const paymentId = response.razorpay_payment_id;
        const signature = response.razorpay_signature;
        markPendingCheckoutPaymentPaid({ paymentId, signature });
        void verifyRazorpayPayment({
          orderNumber: input.orderNumber,
          paymentId,
          signature,
          keepalive: true,
        }).catch(() => {
          // Payment is already captured; Magento webhook/cron reconcile if this fails.
        });
        settle({
          status: "paid",
          paymentId,
          signature,
        });
      },
      modal: {
        ondismiss: () => {
          const paidPending = getPaidPendingCheckoutPayment();
          if (paidPending?.paymentId && paidPending.signature) {
            settle({
              status: "paid",
              paymentId: paidPending.paymentId,
              signature: paidPending.signature,
            });
            return;
          }
          settle({ status: "dismissed" });
        },
      },
    });

    razorpay.open();
  });
}
