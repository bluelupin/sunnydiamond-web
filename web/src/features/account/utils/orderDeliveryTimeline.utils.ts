import type { ProfileTimelineStep, TimelineStepStatus } from "../types/profileUi.types";
import { formatOrderStatus } from "./formatAccountData";

export const ORDER_DELIVERY_TIMELINE_LABELS = [
  "In Production",
  "Packaged",
  "Shipped",
  "Out for Delivery",
  "Delivered",
] as const;

const LEGACY_STATUS_TO_ACTIVE_STEP: Record<string, number> = {
  processing: 1,
  pending: 1,
  "pending payment": 1,
  complete: 5,
  closed: 5,
};

export function normalizeOrderStatus(status: string): string {
  return status
    .trim()
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\s+/g, " ");
}

export function getOrderDeliveryTimelineActiveStep(status: string): number | null {
  const normalized = normalizeOrderStatus(status);

  if (!normalized) {
    return null;
  }

  const labelIndex = ORDER_DELIVERY_TIMELINE_LABELS.findIndex(
    (label) => normalizeOrderStatus(label) === normalized,
  );
  if (labelIndex >= 0) {
    return labelIndex + 1;
  }

  const legacyStep = LEGACY_STATUS_TO_ACTIVE_STEP[normalized];
  return legacyStep ?? null;
}

export function buildOrderDeliveryTimelineFromStatus(status: string): ProfileTimelineStep[] {
  const activeStep = getOrderDeliveryTimelineActiveStep(status);
  if (activeStep === null) {
    return [];
  }

  return ORDER_DELIVERY_TIMELINE_LABELS.map((label, index) => {
    const step = index + 1;
    let stepStatus: TimelineStepStatus = "upcoming";

    if (step < activeStep) {
      stepStatus = "completed";
    } else if (step === activeStep) {
      stepStatus = "current";
    }

    return { step, label, status: stepStatus };
  });
}

export function resolveProfileOrderTimelineSteps(
  status: string,
  fallbackTimeline?: ProfileTimelineStep[],
): ProfileTimelineStep[] {
  const fromStatus = buildOrderDeliveryTimelineFromStatus(status);
  if (fromStatus.length > 0) {
    return fromStatus;
  }

  return fallbackTimeline ?? [];
}

/** Display label for ProfileStatusBadge — uses canonical timeline label when status matches. */
export function formatOrderStatusLabel(status: string): string {
  const normalized = normalizeOrderStatus(status);

  if (!normalized) {
    return "";
  }

  const matchedLabel = ORDER_DELIVERY_TIMELINE_LABELS.find(
    (label) => normalizeOrderStatus(label) === normalized,
  );
  if (matchedLabel) {
    return matchedLabel;
  }

  return formatOrderStatus(status);
}
