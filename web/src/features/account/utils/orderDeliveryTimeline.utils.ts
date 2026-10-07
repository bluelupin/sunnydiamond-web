import type { ProfileTimelineStep, TimelineStepStatus } from "../types/profileUi.types";
import { formatOrderStatus } from "./formatAccountData";

export const ORDER_DELIVERY_TIMELINE_LABELS = [
  "In Production",
  "Packaged",
  "Shipped",
  "Out for Delivery",
  "Delivered",
] as const;

export const ORDER_DELIVERY_STEP_DESCRIPTIONS: Partial<
  Record<(typeof ORDER_DELIVERY_TIMELINE_LABELS)[number], string>
> = {
  "In Production": "Your piece is undergoing final inspection.",
  "Packaged": "Your order has been carefully packed and is ready to ship.",
  "Shipped": "Your order is on its way to you.",
  "Out for Delivery": "Your order will arrive soon.",
  "Delivered": "Your order has been delivered.",
};

/** Custom status codes installed by SunnyDiamonds_OrderFlow — independent of display copy. */
const ORDER_FLOW_STATUS_TO_ACTIVE_STEP: Record<string, number> = {
  in_production: 1,
  packaged: 2,
  shipped: 3,
  out_for_delivery: 4,
  delivered: 5,
};

/** Pre-module Magento statuses — last resort, kept for orders placed before the rollout. */
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
  const statusCode = status.trim().toLowerCase();
  const codeStep = ORDER_FLOW_STATUS_TO_ACTIVE_STEP[statusCode];
  if (codeStep) {
    return codeStep;
  }

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

/**
 * Steps rendered on a profile order card/detail, in preference order:
 * server steps (`sunny_tracking`/`sunny_refund`) → status-derived delivery timeline →
 * whatever the mapper already produced.
 */
export function resolveProfileOrderTimelineSteps(
  status: string,
  fallbackTimeline?: ProfileTimelineStep[],
  serverSteps?: ProfileTimelineStep[] | null,
): ProfileTimelineStep[] {
  if (serverSteps && serverSteps.length > 0) {
    return serverSteps;
  }

  const fromStatus = buildOrderDeliveryTimelineFromStatus(status);
  if (fromStatus.length > 0) {
    return fromStatus;
  }

  return fallbackTimeline ?? [];
}

export function isProfileTimelineStepActive(status: TimelineStepStatus): boolean {
  return status === "completed" || status === "current";
}

export function getProfileTimelineFilledThroughIndex(steps: ProfileTimelineStep[]): number {
  const currentIndex = steps.findIndex((step) => step.status === "current");
  if (currentIndex >= 0) {
    return currentIndex;
  }

  return steps.reduce(
    (max, step, index) => (step.status === "completed" ? index : max),
    -1,
  );
}

export function getProfileTimelineCompletedThroughIndex(steps: ProfileTimelineStep[]): number {
  return steps.reduce(
    (max, step, index) => (step.status === "completed" ? index : max),
    -1,
  );
}

export function getProfileTimelineStepDescription(label: string): string | undefined {
  return ORDER_DELIVERY_STEP_DESCRIPTIONS[
    label as keyof typeof ORDER_DELIVERY_STEP_DESCRIPTIONS
  ];
}

type GiftCardVariantSubtitle = "Digital Card" | "Physical Card";

/** Magento gift card products (SunnyDiamonds_GiftCard::SKU_*) and the label shown under their name. */
const GIFT_CARD_SUBTITLE_BY_SKU: Record<string, GiftCardVariantSubtitle> = {
  "sd-gift-card-digital": "Digital Card",
  "sd-gift-card-physical": "Physical Card",
};

function normalizeGiftCardLookupText(text: string): string {
  return text.trim().toLowerCase().replace(/_/g, "-");
}

function isGiftCardProductText(text: string): boolean {
  const normalized = normalizeGiftCardLookupText(text);
  return (
    /\bgift[\s-]?card\b/.test(normalized) ||
    normalized.includes("gift-card") ||
    /^sd-gift-card/.test(normalized)
  );
}

function inferGiftCardVariantFromText(text: string): GiftCardVariantSubtitle | undefined {
  if (!isGiftCardProductText(text)) {
    return undefined;
  }

  const normalized = normalizeGiftCardLookupText(text);
  if (/\bdigital\b/.test(normalized)) {
    return "Digital Card";
  }
  if (/\bphysical\b/.test(normalized)) {
    return "Physical Card";
  }

  return undefined;
}

function giftCardSubtitleFromSku(sku: string): GiftCardVariantSubtitle | undefined {
  const skuKey = sku.trim().toLowerCase();
  const exact = GIFT_CARD_SUBTITLE_BY_SKU[skuKey];
  if (exact) {
    return exact;
  }

  const normalized = normalizeGiftCardLookupText(sku);
  for (const key of Object.keys(GIFT_CARD_SUBTITLE_BY_SKU) as Array<
    keyof typeof GIFT_CARD_SUBTITLE_BY_SKU
  >) {
    if (normalized === key || normalized.includes(key)) {
      return GIFT_CARD_SUBTITLE_BY_SKU[key];
    }
  }

  return inferGiftCardVariantFromText(normalized);
}

export function giftCardSubtitleForSku(
  sku?: string | null,
  productName?: string | null,
): string | undefined {
  if (sku?.trim()) {
    const fromSku = giftCardSubtitleFromSku(sku);
    if (fromSku) {
      return fromSku;
    }
  }

  if (productName?.trim()) {
    return inferGiftCardVariantFromText(productName);
  }

  return undefined;
}

/** Keep the gift card variant in its subtitle instead of repeating it in the product title. */
export function giftCardNameForSku(name: string, sku?: string | null): string {
  if (!giftCardSubtitleForSku(sku, name)) {
    return name;
  }

  return "Gift Card";
}

function isGiftCardSubtitle(subtitle?: string): boolean {
  const value = subtitle?.trim();
  return value === "Digital Card" || value === "Physical Card";
}

export function isGiftCardProfileOrder(order: {
  items: Array<{ subtitle?: string }>;
}): boolean {
  return order.items.some((item) => isGiftCardSubtitle(item.subtitle));
}

/** Delivery stepper applies to physical gift cards and product orders — not digital gift cards. */
export function isDigitalGiftCardProfileOrder(order: {
  items: Array<{ subtitle?: string }>;
}): boolean {
  if (order.items.length === 0) {
    return false;
  }

  return order.items.every((item) => item.subtitle?.trim() === "Digital Card");
}

/**
 * A digital card that is not cancelled or returned: no delivery steps, Contact Us layout.
 * A cancelled or returned one is shown like any other order, with its refund steps.
 */
export function isActiveDigitalGiftCardOrder(order: {
  items: Array<{ subtitle?: string }>;
  category?: string;
}): boolean {
  return (
    order.category !== "cancelled" &&
    order.category !== "returned" &&
    isDigitalGiftCardProfileOrder(order)
  );
}

/** Figma UI-Production 4858:124270 — right-aligned contact CTA width on desktop. */
export const DIGITAL_GIFT_CARD_CONTACT_CTA_CLASS =
  "h-14 min-h-14 w-full shrink-0 px-7 py-5 font-normal lg:w-[414px] lg:max-w-[414px]";

type DigitalGiftCardContactUsOrder = {
  items: Array<{ subtitle?: string }>;
  category?: string;
  showContactUs?: boolean;
  showCancel: boolean;
  showReturn: boolean;
  showTrack?: boolean;
  showDownloadInvoice?: boolean;
};

/** Digital gift card orders expose Contact Us as the sole action (no track/cancel/return/invoice). */
export function isDigitalGiftCardContactUsOnlyOrder(
  order: DigitalGiftCardContactUsOrder,
): boolean {
  return (
    Boolean(order.showContactUs) &&
    isActiveDigitalGiftCardOrder(order) &&
    !order.showCancel &&
    !order.showReturn &&
    !order.showTrack &&
    !order.showDownloadInvoice
  );
}

/** Display label for ProfileStatusBadge — uses canonical timeline label when status matches. */
export function formatOrderStatusLabel(status: string, sunnyStatus?: string | null): string {
  // An emailed digital gift card is delivered while Magento still calls it "Complete".
  if (sunnyStatus === "DELIVERED") {
    return "Delivered";
  }

  // A cancelled order is "Closed" in Magento once refunded; the customer sees "Cancelled".
  if (sunnyStatus === "CANCELLED") {
    return "Cancelled";
  }

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

  if (normalized.includes("cancel")) {
    return "Cancelled";
  }

  return formatOrderStatus(status);
}
