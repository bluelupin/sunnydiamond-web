import type { TrackedOrder } from "@/services/customer/order-tracking.types";

const STATUS_MESSAGES: Record<string, string> = {
  pending: "Your order has been received and is awaiting confirmation.",
  pending_payment: "We're waiting for payment confirmation.",
  processing: "Your order is being prepared for shipment.",
  complete: "Your order has been completed.",
  closed: "Your order has been delivered.",
  canceled: "This order was canceled.",
  holded: "Your order is on hold. Please contact support if you need help.",
};

export function formatTrackedOrderStatus(status: string): string {
  return status
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function getTrackedOrderStatusMessage(status: string): string {
  const normalized = status.trim().toLowerCase();
  return STATUS_MESSAGES[normalized] ?? "We're preparing your order update.";
}

export function getTrackedOrderProgress(status: string, order: TrackedOrder): number {
  const normalized = status.trim().toLowerCase();

  if (normalized === "canceled" || normalized === "holded") {
    return 1;
  }

  if (order.shipments.length > 0) {
    return normalized === "complete" || normalized === "closed" ? 4 : 3;
  }

  if (normalized === "processing") {
    return 2;
  }

  return 1;
}

export const TRACKING_PROGRESS_STEPS = [
  "Order placed",
  "Processing",
  "Shipped",
  "Delivered",
] as const;
