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
  canModifyAppointmentBeforeDeadline,
  formatTryAtHomeRescheduleDeadline,
} from "@/features/products/utils/tryAtHomeBooking";
import { canCancelAppointmentUntilOneMinuteBefore } from "@/features/products/utils/appointmentCancelDeadline";
import {
  APPOINTMENT_COUNTRY_CODES,
} from "@/shared/constants/appointmentForm";
import {
  formatAppointmentDate,
  formatOrderDate,
  isOrderDateBeforeToday,
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
  giftCardNameForSku,
  giftCardSubtitleForSku,
  isDigitalGiftCardProfileOrder,
  isGiftCardProfileOrder,
  normalizeOrderStatus,
} from "./orderDeliveryTimeline.utils";
import { resolveOrderItemImageUrl } from "./orderItemImage.utils";

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

/** Magento payment method codes that collect the money at the door. */
const COD_PAYMENT_TYPES = new Set(["cashondelivery", "cod"]);

function isCashOnDeliveryPayment(paymentTypes: string[] | undefined): boolean {
  return (paymentTypes ?? []).some((type) => COD_PAYMENT_TYPES.has(type.trim().toLowerCase()));
}

/** Figma cancelled card: "Within 5-7 business days" — Magento sends the bare window. */
function resolveCancellationRefundEstimate(refund: TrackedOrderRefundStatus | null): string {
  if (refund?.estimatedCompletionDate) {
    return formatOrderDate(refund.estimatedCompletionDate);
  }

  const window = refund?.estimatedWindowLabel.trim();
  if (!window) {
    return ordersContent.estimatedDeliveryRangePlaceholder;
  }

  return /^within\b/i.test(window)
    ? window
    : ordersContent.estimatedRefundWindowTemplate.replace("{window}", window);
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

export function formatReturnDeadlineNote(
  returnableTill: string | null | undefined,
): string | undefined {
  if (!returnableTill) {
    return undefined;
  }

  if (isOrderDateBeforeToday(returnableTill)) {
    return ordersContent.returnWindowClosedNote;
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

function splitShowroomAddressLines(address: string): string[] {
  const trimmed = address.trim();
  if (!trimmed) {
    return [];
  }

  const byNewline = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (byNewline.length > 1) {
    return byNewline;
  }

  return trimmed
    .split(/,\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function resolveStoreVisitDisplayName(showroom: {
  name: string;
  city: string;
  address: string;
}): string {
  const city = showroom.city.trim();
  const name = showroom.name.trim();
  if (name && (!city || name.toLowerCase() !== city.toLowerCase())) {
    return name;
  }

  const address = showroom.address.trim();
  const sunnyMatch = address.match(/^(Sunny Diamonds[^,]*)/i);
  if (sunnyMatch?.[1]) {
    return sunnyMatch[1].trim();
  }

  return name || city;
}

function mapStoreVisitDetails(
  appointment: CustomerAppointment,
): ProfileAppointmentUi["storeVisit"] | undefined {
  const showroom = appointment.preferredShowroom;
  if (!showroom) {
    return undefined;
  }

  const city = showroom.city.trim() || showroom.name.trim();
  const storeName = resolveStoreVisitDisplayName(showroom);
  let remainingAddress = showroom.address.trim();
  if (
    storeName &&
    remainingAddress.toLowerCase().startsWith(storeName.toLowerCase())
  ) {
    remainingAddress = remainingAddress.slice(storeName.length).replace(/^[,\s]+/, "");
  }

  const lines = [
    ...(storeName && storeName.toLowerCase() !== city.toLowerCase() ? [storeName] : []),
    ...splitShowroomAddressLines(remainingAddress).filter(
      (line) =>
        line.toLowerCase() !== storeName.toLowerCase() &&
        line.toLowerCase() !== city.toLowerCase(),
    ),
  ];

  const pincode = showroom.pincode.trim();
  const state = showroom.state.trim();
  if (pincode) {
    const stateLineIndex = lines.findIndex(
      (line) => state && line.toLowerCase() === state.toLowerCase(),
    );
    if (stateLineIndex >= 0) {
      if (!lines[stateLineIndex].includes(pincode)) {
        lines[stateLineIndex] = `${lines[stateLineIndex]} ${pincode}`;
      }
    } else if (!lines.some((line) => line.includes(pincode))) {
      lines.push([state, pincode].filter(Boolean).join(" "));
    }
  } else if (
    state &&
    !lines.some((line) => line.toLowerCase().includes(state.toLowerCase()))
  ) {
    lines.push(state);
  }

  if (!city && lines.length === 0) {
    return undefined;
  }

  const directionsHref = showroom.mapUrl.trim() || undefined;

  const showroomDocumentId = showroom.documentId.trim();

  return {
    ...(showroomDocumentId ? { showroomDocumentId } : {}),
    city: city || storeName,
    storeName,
    lines,
    ...(directionsHref ? { directionsHref } : {}),
  };
}

const GENERAL_STORE_VISIT_PRODUCT_ID = "store-visit";

function inferAppointmentType(formTag: string): AppointmentFilterKey {
  const normalized = formTag.trim().toLowerCase();

  if (normalized === "book-an-appointment") {
    return "store_visit";
  }

  if (normalized.includes("video")) {
    return "video_call";
  }

  if (normalized.includes("home") || normalized.includes("try")) {
    return "try_at_home";
  }

  return "store_visit";
}

function canModifyAppointment(workflowStatus: string): boolean {
  const normalized = workflowStatus.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return (
    !normalized.includes("cancel") &&
    !normalized.includes("complete") &&
    !normalized.includes("done") &&
    !normalized.includes("closed")
  );
}

const APPOINTMENT_CANCELLED_ON_DISPLAY: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

/** CMS has no dedicated cancelled-at field; the cancel is the last update on the record. */
export function formatAppointmentCancelledOnNote(updatedAt: string | Date): string | undefined {
  const date = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return profileTabsContent.appointments.cancelledNoteTemplate.replace(
    "{date}",
    date.toLocaleDateString("en-IN", APPOINTMENT_CANCELLED_ON_DISPLAY),
  );
}

function resolveAppointmentWorkflowStatus(
  appointment: CustomerAppointment,
): string {
  const topLevel = appointment.workflowStatus?.trim() ?? "";
  if (topLevel) {
    return topLevel;
  }

  const productStatuses = appointment.products
    .map((product) => product.workflowStatus?.trim())
    .filter(Boolean);

  if (productStatuses.length === 0) {
    return "";
  }

  // If every product is cancelled/closed, treat the card as non-modifiable.
  if (productStatuses.every((status) => !canModifyAppointment(status))) {
    return productStatuses[0] ?? "Cancelled";
  }

  return productStatuses[0] ?? "";
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
    phone: formatAppointmentPhoneDisplay(appointment.customerPhone),
  };
}

/** Figma Personal Details: "+91 9898989989" (country code + space + national number). */
function formatAppointmentPhoneDisplay(rawPhone: string): string {
  const trimmed = rawPhone.trim();
  if (!trimmed) {
    return "";
  }

  if (/^\+\d{1,3}\s+\d+$/.test(trimmed)) {
    return trimmed;
  }

  const sortedCodes = [...APPOINTMENT_COUNTRY_CODES]
    .map((entry) => entry.code)
    .sort((a, b) => b.length - a.length);

  for (const code of sortedCodes) {
    if (trimmed.startsWith(code)) {
      const national = trimmed.slice(code.length).replace(/\D/g, "");
      return national ? `${code} ${national}` : code;
    }
  }

  const spaced = /^(\+\d{1,3})\s*(.*)$/.exec(trimmed);
  if (spaced) {
    const national = spaced[2].replace(/\D/g, "");
    return national ? `${spaced[1]} ${national}` : spaced[1];
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91 ${digits}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2)}`;
  }

  return trimmed;
}

function mapOrderItems(
  order: CustomerOrder,
  imageBySku?: Record<string, string>,
): ProfileOrderItemUi[] {
  const giftMetadata = parseOrderGiftMetadataFromComments(order.commentMessages ?? []);

  return order.items.map((item, index) => {
    const display = mapCustomerOrderItemToDisplayFields(item, giftMetadata);
    const imageUrl = resolveOrderItemImageUrl(item.imageUrl, item.productSku, imageBySku);
    const subtitle = giftCardSubtitleForSku(item.productSku, item.productName);

    return {
      id: `${order.id}-${item.productSku ?? index}`,
      name: giftCardNameForSku(item.productName, item.productSku),
      ...(imageUrl ? { imageSrc: imageUrl } : {}),
      ...(subtitle ? { subtitle } : {}),
      size: display.size,
      metal: display.metal,
      engraving: display.engraving,
      engravingFont: display.engravingFont,
      isGift: item.isGift || display.isGift,
      isBespoke: display.isBespoke,
      useIconPlaceholder: !imageUrl,
      quantity: item.quantity,
      productUrlKey: item.productUrlKey,
    };
  });
}

export function mapCustomerOrderToProfileUi(
  order: CustomerOrder,
  imageBySku?: Record<string, string>,
): ProfileOrderUi {
  const { category, subState } = categorizeOrder(order.sunnyStatus, order.status);
  const statusLabel = formatOrderStatusLabel(order.status, order.sunnyStatus);
  const items = mapOrderItems(order, imageBySku);
  // Digital gift cards have no estimated delivery date, but can show a delivered date.
  const deliveryBy = isDigitalGiftCardProfileOrder({ items }) && category !== "delivered"
    ? undefined
    : resolveOrderDeliveryBy(order.sunnyDelivery);
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
    items,
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

  // Figma: a cancelled COD order was never paid, so there is no refund stepper.
  if (category === "cancelled" && isCashOnDeliveryPayment(order.paymentTypes)) {
    return {
      ...base,
      showDownloadInvoice: false,
      showContactUs: true,
    };
  }

  if (category === "returned" || category === "cancelled") {
    const refundTimeline = resolveRefundTimeline(
      order,
      category === "returned" ? LEGACY_RETURN_REFUND_STEPS : LEGACY_CANCELLED_REFUND_STEPS,
    );

    return {
      ...base,
      // Figma: a returned order card offers Contact Us, not Track.
      ...(category === "returned" ? { showTrack: false } : {}),
      showDownloadInvoice: false,
      showContactUs: true,
      estimatedDeliveryLabel:
        category === "cancelled"
          ? ordersContent.estimatedRefundLabel
          : ordersContent.estimatedDeliveryLabel,
      estimatedDeliveryValue:
        category === "cancelled"
          ? resolveCancellationRefundEstimate(order.sunnyRefund)
          : resolveRefundEstimateValue(order.sunnyRefund, ordersContent.estimatedDeliveryPlaceholder),
      timeline: refundTimeline.steps,
      ...(refundTimeline.fromServer ? { timelineFromServer: true } : {}),
    };
  }

  if (category === "delivered" && isGiftCardProfileOrder(base)) {
    return {
      ...base,
      showTrack: false,
      showCancel: false,
      showReturn: false,
      // The invoice stays for a digital card (success-to-profile flow, 30 Sep).
      showDownloadInvoice: isDigitalGiftCardProfileOrder(base),
      showContactUs: true,
      showCancelNote: false,
      footnote: undefined,
    };
  }

  if (isDigitalGiftCardProfileOrder(base)) {
    // Digital gift cards are emailed: no delivery steps, tracking, cancel or return. Contact Us
    // and the invoice stay (gift card success-to-profile flow, 30 Sep).
    return {
      ...base,
      // Paid but not emailed yet: Magento calls it "Complete", the customer is still waiting.
      ...(category === "in_progress" ? { statusLabel: ordersContent.statusInProgress } : {}),
      showTrack: false,
      showCancel: false,
      showReturn: false,
      showContactUs: true,
      showCancelNote: false,
      footnote: undefined,
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

  // General store visits carry a "store-visit" placeholder product (BookStoreVisitPanel) — not a piece.
  const pieces = appointment.products.filter(
    (product) => product.productId !== GENERAL_STORE_VISIT_PRODUCT_ID,
  );
  const products =
    pieces.length > 0
      ? pieces.map((product, index) => {
          const productSku = product.productId?.trim() ?? "";
          const productImage =
            productSku && productImageBySku?.[productSku]
              ? productImageBySku[productSku]
              : undefined;

          return {
            // Prefer CMS documentId — Magento productId can repeat across clubbed rows.
            id:
              product.documentId ||
              product.productId ||
              `${appointment.documentId}-${index}`,
            name: product.productName ?? appointment.productName ?? "Product",
            ...(productImage ? { imageSrc: productImage } : {}),
          };
        })
      : (() => {
          if (
            !appointment.productName ||
            appointment.productId === GENERAL_STORE_VISIT_PRODUCT_ID
          ) {
            return [];
          }
          const productSku = appointment.productId?.trim() ?? "";
          const productImage =
            productSku && productImageBySku?.[productSku]
              ? productImageBySku[productSku]
              : undefined;
          return [
            {
              id: appointment.documentId,
              name: appointment.productName,
              ...(productImage ? { imageSrc: productImage } : {}),
            },
          ];
        })();

  const workflowStatus = resolveAppointmentWorkflowStatus(appointment);
  const canModify = canModifyAppointment(workflowStatus);
  const rescheduleLimitReached = canModify && appointment.reschedulesLeft === 0;
  const canReschedule =
    canModify &&
    !rescheduleLimitReached &&
    canModifyAppointmentBeforeDeadline(appointment.requestedDate);
  const canCancel =
    canModify &&
    canCancelAppointmentUntilOneMinuteBefore(
      appointment.requestedDate,
      appointment.selectedTimeSlot,
    );
  const rescheduleDeadline = formatTryAtHomeRescheduleDeadline(
    appointment.requestedDate,
  );
  const isCancelled = workflowStatus.toLowerCase().includes("cancel");
  const cancelledOnNote =
    isCancelled && appointment.cancelledAt
      ? formatAppointmentCancelledOnNote(appointment.cancelledAt)
      : undefined;

  const base: ProfileAppointmentUi = {
    id: appointment.documentId,
    formTag: appointment.formTag,
    type,
    typeLabel,
    customerName: appointment.customerName,
    customerPhone: formatAppointmentPhoneDisplay(appointment.customerPhone),
    customerEmail: appointment.customerEmail,
    requestedDate: appointment.requestedDate,
    products,
    bookingDate: appointment.requestedDate
      ? formatAppointmentDate(appointment.requestedDate)
      : "",
    bookingTime: appointment.selectedTimeSlot,
    notesLabel: profileTabsContent.appointments.notesLabel,
    notes: appointment.customerMessage ?? "",
    ...(appointment.purposeOfVisit
      ? { purposeOfVisit: appointment.purposeOfVisit }
      : {}),
    ...(appointment.customerMessage
      ? { yourRequirement: appointment.customerMessage }
      : {}),
    rescheduleNote: rescheduleDeadline
      ? appointment.reschedulesLeft != null && appointment.reschedulesLeft > 0
        ? profileTabsContent.appointments.rescheduleCountNoteTemplate
            .replace("{left}", String(appointment.reschedulesLeft))
            .replace("{date}", rescheduleDeadline)
        : profileTabsContent.appointments.rescheduleNoteTemplate.replace(
            "{date}",
            rescheduleDeadline,
          )
      : undefined,
    canReschedule,
    rescheduleLimitReached,
    canCancel,
    ...(isCancelled ? { isCancelled, ...(cancelledOnNote ? { cancelledOnNote } : {}) } : {}),
  };

  if (type === "try_at_home") {
    const appointmentAddress = mapAppointmentAddressToUi(appointment);

    return appointmentAddress ? { ...base, appointmentAddress } : base;
  }

  if (type === "store_visit") {
    const storeVisit = mapStoreVisitDetails(appointment);
    return storeVisit ? { ...base, storeVisit } : base;
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

  return {
    id: item.documentId,
    creationDocumentId: creation.documentId,
    title: creation.title,
    ...(images[0] ? { imageSrc: images[0] } : {}),
    images,
    price: undefined,
    viewHref: creation.cta?.href ?? profileTabsContent.bespoke.emptyPrimaryCtaHref,
    savedAt: item.savedAt,
  };
}

export function formatBespokePriceDisplay(price?: string): string | undefined {
  return price;
}

export { categorizeOrderStatusFromLabel, inferAppointmentType };
