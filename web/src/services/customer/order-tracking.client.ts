import type { GuestOrderLookupInput, TrackedOrder } from "./order-tracking.types";

type TrackOrderErrorPayload = {
  error?: string;
};

async function parseApiError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as TrackOrderErrorPayload;
    return payload.error ?? `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

export async function trackOrder(
  orderNumber: string,
  guestDetails?: Pick<GuestOrderLookupInput, "email" | "lastname">,
  signal?: AbortSignal,
): Promise<TrackedOrder> {
  const params = new URLSearchParams({ number: orderNumber.trim() });

  if (guestDetails?.email) {
    params.set("email", guestDetails.email.trim());
  }

  if (guestDetails?.lastname) {
    params.set("lastname", guestDetails.lastname.trim());
  }

  const response = await fetch(`/api/orders/track?${params.toString()}`, {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const payload = (await response.json()) as { order: TrackedOrder };
  return payload.order;
}
