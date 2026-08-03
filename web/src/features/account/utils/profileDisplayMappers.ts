import type { CustomerAppointment } from "@/services/customer/customer-appointments.types";
import type { CustomerOrder } from "@/services/customer/customer-account.types";
import type { CustomerSavedCreationRecord } from "@/services/customer/customer-saved-creations.types";
import type {
  SunnyOrderStatus,
  TrackedOrderDelivery,
  TrackedOrderRefundStatus,
  TrackedOrderSunnyFields,
} from "@/services/customer/order-tracking.types";
import { profileTabsContent } from "../data/profileContent";
import type {
  AppointmentFilterKey,
  OrderFilterKey,
  ProfileAppointmentUi,
  ProfileBespokeItemUi,
  ProfileOrderItemUi,
  ProfileOrderSubState,
  ProfileOrderUi,
  ProfileTimelineStep,
} from "../types/profileUi.types";
import {
  formatAppointmentDate,
  formatOrderDate,
} from "./formatAccountData";
import { parseOrderGiftMetadataFromComments } from "./orderGiftDetection.utils";
import { mapCustomerOrderItemToDisplayFields } from "./orderItemDisplay.mapper";
import {
  mapSunnyRefundToTimeline,
  mapSunnyTrackingToTimeline,
} from "./orderFlowSteps.mapper";
import {
  buildOrderDeliveryTimelineFromStatus,
  formatOrderStatusLabel,
  normalizeOrderStatus,
} from "./orderDeliveryTimeline.utils";

const PLACEHOLDER_RING_IMAGE = "/images/jewellery/plp/product-ring-transparent.png";
const ordersContent = profileTabsContent.orders;

/** Rendered only for orders placed before SunnyDiamonds_OrderFlow went live. */
export const LEGACY_RETURN_REFUND_STEPS: ProfileTimelineStep[] = [
  { step: 1, label: "Return Initiated", status: "completed" },
  { step: 2, label: "Order Picked Up", status: "completed" },
  { step: 3, label: "Refund Initiated", status: "current" },
  { step: 4, label: "Refunded Successfully", status: "upcoming" },
];

/** Rendered only for orders placed before SunnyDiamonds_OrderFlow went live. */
export const LEGACY_CANCELLED_REFUND_STEPS: ProfileTimelineStep[] = [
  { step: 1, label: "Order Cancelled", status: "completed" },
  { step: 2, label: "Refund Initiated", status: "current" },
  { step: 3, label: "Refunded Successfully", status: "upcoming" },
];

const CATEGORY_BY_SUNNY_STATUS: Record<
  SunnyOrderStatus,
  { category: OrderFilterKey; subState?: ProfileOrderSubState }
> = {
  IN_PROGRESS: { category: "in_progress" },
  DELIVERED: { category: "delivered" },
  CANCELLED: { category: "cancelled" },
  CANCELLATION_IN_PROGRESS: {
    category: "cancelled",
    subState: "cancellation_in_progress",
  },
  RETURNED: { category: "returned" },
  RETURN_IN_PROGRESS: { category: "returned", subState: "return_in_progress" },
};

/** Pre-deployment fallback: guesses the tab from the Magento status label. */
function categorizeOrderStatusFromLabel(status: string): OrderFilterKey {
  const normalized = normalizeOrderStatus(status);

  if (normalized.includes("cancel")) {
    return "cancelled";
  }

  if (normalized.includes("return") || normalized.includes("refund")) {
    return "returned";
  }

  if (
    normalized.includes("out for delivery") ||
    normalized.includes("production") ||
    normalized.includes("packaged") ||
    normalized === "shipped" ||
    normalized.includes("processing") ||
    normalized.includes("pending")
  ) {
    return "in_progress";
  }

  if (normalized === "delivered" || normalized.includes("complete") || normalized === "closed") {
    return "delivered";
  }

  return "in_progress";
}

/** `sunny_status` maps 1:1 to a tab; the label heuristic only runs when it is absent. */
export function categorizeOrder(
  sunnyStatus: SunnyOrderStatus | null,
  statusLabel: string,
): { category: OrderFilterKey; subState?: ProfileOrderSubState } {
  if (sunnyStatus) {
    return CATEGORY_BY_SUNNY_STATUS[sunnyStatus];
  }

  return { category: categorizeOrderStatusFromLabel(statusLabel) };
}

/** "Delivery by" is a real delivery date or nothing at all — never the order date. */
export function resolveOrderDeliveryBy(
  delivery: TrackedOrderDelivery | null,
): string | undefined {
  const deliveryDate = delivery?.deliveredAt ?? delivery?.estimatedDeliveryAt;

  return deliveryDate ? formatOrderDate(deliveryDate) : undefined;
}

/** Estimated delivery copy — the literal placeholder is a pre-deployment fallback. */
export function resolveEstimatedDeliveryValue(delivery: TrackedOrderDelivery | null): string {
  return delivery?.estimatedDeliveryAt
    ? formatOrderDate(delivery.estimatedDeliveryAt)
    : ordersContent.estimatedDeliveryPlaceholder;
}

/** Refund ETA copy: server date → server window label → literal placeholder. */
export function resolveRefundEstimateValue(
  refund: TrackedOrderRefundStatus | null,
  placeholder: string,
): string {
  if (refund?.estimatedCompletionDate) {
    return formatOrderDate(refund.estimatedCompletionDate);
  }

  return refund?.estimatedWindowLabel.trim() || placeholder;
}

/** Refund line on the cancel/return success dialogs — omitted when the server sends no refund. */
export function formatRefundNote(
  refund: TrackedOrderRefundStatus | null | undefined,
): string | undefined {
  if (!refund) {
    return undefined;
  }

  const mode = refund.refundMode.trim() || ordersContent.refundNoteDefaultMode;

  if (refund.estimatedCompletionDate) {
    return ordersContent.refundNoteDateTemplate
      .replace("{mode}", mode)
      .replace("{date}", formatOrderDate(refund.estimatedCompletionDate));
  }

  const window = refund.estimatedWindowLabel.trim();

  return window
    ? ordersContent.refundNoteWindowTemplate.replace("{mode}", mode).replace("{window}", window)
    : undefined;
}

export function formatReturnDeadlineNote(returnableTill: string | null | undefined): string {
  if (!returnableTill) {
    return ordersContent.returnDeadlineNote;
  }

  return ordersContent.returnDeadlineNoteTemplate.replace(
    "{date}",
    formatOrderDate(returnableTill),
  );
}

/**
 * Refund stepper source: server steps when the module answers with a refund, nothing
 * when it answers without one (unpaid COD cancellation), legacy steps pre-deployment.
 */
export function resolveRefundTimeline(
  order: Pick<TrackedOrderSunnyFields, "sunnyRefund" | "sunnyStatus">,
  legacySteps: ProfileTimelineStep[],
): { steps: ProfileTimelineStep[]; fromServer: boolean } {
  if (order.sunnyRefund) {
    return { steps: mapSunnyRefundToTimeline(order.sunnyRefund), fromServer: true };
  }

  return { steps: order.sunnyStatus ? [] : legacySteps, fromServer: false };
}

function inferAppointmentType(formTag: string): AppointmentFilterKey {
  const normalized = formTag.toLowerCase();

  if (normalized.includes("video")) {
    return "video_call";
  }

  if (normalized.includes("home") || normalized.includes("try")) {
    return "try_at_home";
  }

  return "store_visit";
}

function canModifyAppointment(workflowStatus: string): boolean {
  const normalized = workflowStatus.toLowerCase();
  return (
    !normalized.includes("cancel") &&
    !normalized.includes("complete") &&
    !normalized.includes("done") &&
    !normalized.includes("closed")
  );
}

function mapAppointmentAddressToUi(
  appointment: CustomerAppointment,
): ProfileAppointmentUi["appointmentAddress"] | undefined {
  const addressLine1 = appointment.addressLine1?.trim() ?? "";
  const addressLine2 = appointment.addressLine2?.trim();
  const city = appointment.city?.trim();
  const state = appointment.state?.trim();
  const pincode = appointment.pincode?.trim();

  if (!addressLine1 && !addressLine2 && !city && !state && !pincode) {
    return undefined;
  }

  return {
    name: appointment.customerName,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    phone: appointment.customerPhone,
  };
}

function mapOrderItems(order: CustomerOrder): ProfileOrderItemUi[] {
  const giftMetadata = parseOrderGiftMetadataFromComments(order.commentMessages ?? []);

  return order.items.map((item, index) => {
    const display = mapCustomerOrderItemToDisplayFields(item, giftMetadata);
    const imageUrl = item.imageUrl?.trim() || null;

    return {
      id: `${order.id}-${item.productSku ?? index}`,
      name: item.productName,
      imageSrc: imageUrl ?? PLACEHOLDER_RING_IMAGE,
      size: display.size,
      metal: display.metal,
      isGift: display.isGift,
      isBespoke: display.isBespoke,
      useIconPlaceholder: display.isBespoke && !imageUrl,
      quantity: item.quantity,
      productUrlKey: item.productUrlKey,
    };
  });
}

export function mapCustomerOrderToProfileUi(order: CustomerOrder): ProfileOrderUi {
  const { category, subState } = categorizeOrder(order.sunnyStatus, order.status);
  const statusLabel = formatOrderStatusLabel(order.status);
  const deliveryBy = resolveOrderDeliveryBy(order.sunnyDelivery);
  const actions = order.sunnyActions;
  const trackingTimeline = mapSunnyTrackingToTimeline(order.sunnyTracking);
  const deliveryTimeline =
    trackingTimeline.length > 0
      ? trackingTimeline
      : buildOrderDeliveryTimelineFromStatus(order.status);

  const base: ProfileOrderUi = {
    id: order.id,
    number: order.number,
    orderDate: order.orderDate,
    status: order.status,
    statusLabel,
    category,
    ...(subState ? { subState } : {}),
    ...(deliveryBy ? { deliveryBy } : {}),
    items: mapOrderItems(order),
    grandTotal: order.grandTotal,
    currency: order.currency,
    showTrack: actions ? actions.canTrack : category === "in_progress",
    showCancel: actions ? actions.canCancel : category === "in_progress",
    showReturn: actions ? actions.canReturn : category === "delivered",
    showDownloadInvoice: true,
    ...(actions ? { invoiceDisabled: !actions.canDownloadInvoice } : {}),
    showCancelNote: category === "in_progress",
    footnote:
      category === "in_progress"
        ? ordersContent.cancelNote
        : category === "delivered"
          ? formatReturnDeadlineNote(order.sunnyDelivery?.returnableTill)
          : undefined,
  };

  if (category === "returned" || category === "cancelled") {
    const refundTimeline = resolveRefundTimeline(
      order,
      category === "returned" ? LEGACY_RETURN_REFUND_STEPS : LEGACY_CANCELLED_REFUND_STEPS,
    );

    return {
      ...base,
      showDownloadInvoice: false,
      showContactUs: category === "cancelled",
      estimatedDeliveryLabel: ordersContent.estimatedDeliveryLabel,
      estimatedDeliveryValue: resolveRefundEstimateValue(
        order.sunnyRefund,
        category === "returned"
          ? ordersContent.estimatedDeliveryPlaceholder
          : ordersContent.estimatedDeliveryRangePlaceholder,
      ),
      timeline: refundTimeline.steps,
      ...(refundTimeline.fromServer ? { timelineFromServer: true } : {}),
    };
  }

  if (deliveryTimeline.length > 0) {
    return {
      ...base,
      ...(category === "in_progress"
        ? {
            estimatedDeliveryLabel: ordersContent.estimatedDeliveryLabel,
            estimatedDeliveryValue: resolveEstimatedDeliveryValue(order.sunnyDelivery),
          }
        : {}),
      timeline: deliveryTimeline,
      ...(trackingTimeline.length > 0 ? { timelineFromServer: true } : {}),
    };
  }

  return base;
}

export function mapCustomerAppointmentToProfileUi(
  appointment: CustomerAppointment,
  productImageBySku?: Record<string, string>,
): ProfileAppointmentUi {
  const type = inferAppointmentType(appointment.formTag);
  const typeLabels = profileTabsContent.appointments.filters;
  const typeLabel =
    type === "video_call"
      ? typeLabels.videoCall
      : type === "try_at_home"
        ? typeLabels.tryAtHome
        : typeLabels.storeVisit;

  const showroomParts = [
    appointment.preferredShowroom?.name,
    appointment.preferredShowroom?.city,
    appointment.preferredShowroom?.state,
  ].filter((part): part is string => Boolean(part));

  const productSku = appointment.productId?.trim();
  const productImage =
    productSku && productImageBySku?.[productSku]
      ? productImageBySku[productSku]
      : PLACEHOLDER_RING_IMAGE;

  const products =
    appointment.productName
      ? [
          {
            id: appointment.productId ?? appointment.documentId,
            name: appointment.productName,
            imageSrc: productImage,
          },
        ]
      : [];

  const canModify = canModifyAppointment(appointment.workflowStatus);

  const base: ProfileAppointmentUi = {
    id: appointment.documentId,
    type,
    typeLabel,
    customerName: appointment.customerName,
    customerPhone: appointment.customerPhone,
    customerEmail: appointment.customerEmail,
    products,
    bookingDate: appointment.requestedDate
      ? formatAppointmentDate(appointment.requestedDate)
      : "",
    bookingTime: appointment.selectedTimeSlot,
    notesLabel: profileTabsContent.appointments.notesLabel,
    notes: appointment.customerMessage ?? "",
    rescheduleNote: profileTabsContent.appointments.rescheduleNotePlaceholder,
    canReschedule: canModify,
    canCancel: canModify,
  };

  if (type === "try_at_home") {
    const appointmentAddress = mapAppointmentAddressToUi(appointment);

    return appointmentAddress ? { ...base, appointmentAddress } : base;
  }

  if (type === "store_visit" && showroomParts.length > 0) {
    return {
      ...base,
      storeVisit: {
        city: appointment.preferredShowroom?.city ?? showroomParts[0] ?? "",
        lines: showroomParts,
        directionsHref: "/store-locator",
      },
    };
  }

  return base;
}

export function mapSavedCreationToBespokeUi(
  item: CustomerSavedCreationRecord,
): ProfileBespokeItemUi | null {
  const creation = item.creation;
  if (!creation) return null;

  const coverUrl = creation.coverImage?.url?.trim() ?? "";
  const galleryUrls = creation.gallery
    .map((media) => media.url?.trim() ?? "")
    .filter(Boolean);
  const images = Array.from(
    new Set([coverUrl, ...galleryUrls].filter(Boolean)),
  );
  const imageSrc = images[0] ?? PLACEHOLDER_RING_IMAGE;

  return {
    id: item.documentId,
    creationDocumentId: creation.documentId,
    title: creation.title,
    imageSrc,
    images: images.length > 0 ? images : [imageSrc],
    price: undefined,
    viewHref: creation.cta?.href ?? profileTabsContent.bespoke.emptyCtaHref,
    savedAt: item.savedAt,
  };
}

export function formatBespokePriceDisplay(price?: string): string | undefined {
  return price;
}

export { categorizeOrderStatusFromLabel, inferAppointmentType };
