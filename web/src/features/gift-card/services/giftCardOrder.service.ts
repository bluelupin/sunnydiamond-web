import type { GiftCardOrderPayload, GiftCardPlacedOrder } from "./giftCardOrder.types";

export async function placeGiftCardOrder(
  payload: GiftCardOrderPayload,
  signal?: AbortSignal,
): Promise<GiftCardPlacedOrder> {
  const response = await fetch("/api/gift-card/place-order", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
    signal,
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as
    | (GiftCardPlacedOrder & { error?: string })
    | null;

  if (!response.ok || !data?.orderNumber) {
    throw new Error(data?.error || "We could not place your gift card order. Please try again.");
  }

  return {
    orderNumber: data.orderNumber,
    awaitingOnlinePayment: Boolean(data.awaitingOnlinePayment),
  };
}
