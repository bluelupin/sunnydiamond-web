import type { StockAlertSubscribeResult } from "./stock-alert.types";

type StockAlertErrorPayload = {
  error?: string;
};

const FRIENDLY_FAILURE_MESSAGE = "We couldn't set up this alert. Please try again.";

export async function subscribeToStockAlert(sku: string): Promise<StockAlertSubscribeResult> {
  let response: Response;

  try {
    response = await fetch("/api/products/stock-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku }),
      cache: "no-store",
    });
  } catch {
    return { status: "error", message: FRIENDLY_FAILURE_MESSAGE };
  }

  if (response.status === 401) {
    return { status: "unauthorized" };
  }

  if (response.status === 503) {
    return { status: "unavailable" };
  }

  if (!response.ok) {
    let message = FRIENDLY_FAILURE_MESSAGE;

    try {
      const payload = (await response.json()) as StockAlertErrorPayload;
      message = payload.error?.trim() || FRIENDLY_FAILURE_MESSAGE;
    } catch {
      // Non-JSON error body — keep the friendly fallback.
    }

    return { status: "error", message };
  }

  return { status: "subscribed" };
}
