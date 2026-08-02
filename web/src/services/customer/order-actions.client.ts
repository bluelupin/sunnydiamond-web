import {
  OrderActionError,
  type OrderActionErrorCode,
  type OrderActionPayload,
  type OrderActionReasons,
} from "./order-actions.types";
import type { TrackedOrder } from "./order-tracking.types";

type OrderActionResponsePayload = {
  error?: string;
  code?: OrderActionErrorCode;
  order?: TrackedOrder | null;
};

/** Codes that mean the action already happened — the caller treats them as success. */
const IDEMPOTENT_CODES: OrderActionErrorCode[] = ["ALREADY_CANCELLED", "ALREADY_REQUESTED"];

async function parseActionResponse(response: Response): Promise<OrderActionResponsePayload> {
  try {
    return (await response.json()) as OrderActionResponsePayload;
  } catch {
    return {};
  }
}

async function postOrderAction(
  path: string,
  payload: OrderActionPayload,
): Promise<TrackedOrder | null> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const body = await parseActionResponse(response);

  if (response.ok) {
    return body.order ?? null;
  }

  if (response.status === 409 && body.code && IDEMPOTENT_CODES.includes(body.code)) {
    return body.order ?? null;
  }

  throw new OrderActionError(
    body.error ?? `Request failed (${response.status})`,
    body.code ?? "UNKNOWN",
    body.order ?? null,
  );
}

export async function cancelOrder(
  orderNumber: string,
  payload: OrderActionPayload,
): Promise<TrackedOrder | null> {
  return postOrderAction(
    `/api/customer/orders/${encodeURIComponent(orderNumber)}/cancel`,
    payload,
  );
}

export async function requestOrderReturn(
  orderNumber: string,
  payload: OrderActionPayload,
): Promise<TrackedOrder | null> {
  return postOrderAction(
    `/api/customer/orders/${encodeURIComponent(orderNumber)}/return`,
    payload,
  );
}

export async function getOrderActionReasons(signal?: AbortSignal): Promise<OrderActionReasons> {
  try {
    const response = await fetch("/api/customer/orders/reasons", { signal });

    if (!response.ok) {
      return { cancelReasons: [], returnReasons: [] };
    }

    return (await response.json()) as OrderActionReasons;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return { cancelReasons: [], returnReasons: [] };
  }
}
