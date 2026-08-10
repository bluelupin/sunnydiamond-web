import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";

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

function buildRazorpayCheckoutConfig(method?: "card" | "upi" | "netbanking") {
  if (method === "upi") {
    return {
      display: {
        blocks: {
          upi: {
            name: "Pay via UPI",
            instruments: [{ method: "upi" }],
          },
        },
        sequence: ["block.upi"],
        preferences: { show_default_blocks: false },
      },
    };
  }

  if (method === "netbanking") {
    return {
      display: {
        blocks: {
          netbanking: {
            name: "Netbanking",
            instruments: [{ method: "netbanking" }],
          },
        },
        sequence: ["block.netbanking"],
        preferences: { show_default_blocks: false },
      },
    };
  }

  if (method === "card") {
    return {
      display: {
        blocks: {
          card: {
            name: "Pay via Card",
            instruments: [{ method: "card" }],
          },
        },
        sequence: ["block.card"],
        preferences: { show_default_blocks: false },
      },
    };
  }

  return undefined;
}

export async function verifyRazorpayPayment(input: {
  orderNumber: string;
  paymentId: string;
  signature: string;
}): Promise<void> {
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
  });
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
    // Always use the live page origin so UPI/netbanking callbacks return to
    // this same app (not a stale NEXT_PUBLIC_FRONTEND_URL / wrong port).
    const callbackUrl = new URL("/api/checkout/razorpay/callback", window.location.origin);
    callbackUrl.searchParams.set("order", input.orderNumber);

    const usesRedirectFlow = input.method === "netbanking" || input.method === "upi";
    const checkoutConfig = buildRazorpayCheckoutConfig(input.method);

    const razorpay = new window.Razorpay!({
      key: config.keyId,
      order_id: order.rzpOrderId,
      name: config.merchantName,
      description: `Order #${input.orderNumber}`,
      callback_url: callbackUrl.toString(),
      ...(usesRedirectFlow ? { redirect: true } : {}),
      ...(checkoutConfig ? { config: checkoutConfig } : {}),
      prefill: {
        ...(input.prefill.name ? { name: input.prefill.name } : {}),
        ...(input.prefill.email ? { email: input.prefill.email } : {}),
        ...(input.prefill.contact ? { contact: input.prefill.contact } : {}),
        ...(input.method ? { method: input.method } : {}),
      },
      handler: (response: RazorpayPaymentResponse) => {
        resolve({
          status: "paid",
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: () => resolve({ status: "dismissed" }),
      },
    });

    razorpay.open();
  });
}
