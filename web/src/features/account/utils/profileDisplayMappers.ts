import type { CustomerAppointment } from "@/services/customer/customer-appointments.types";
import type { CustomerOrder } from "@/services/customer/customer-account.types";
import type { CustomerSavedCreationRecord } from "@/services/customer/customer-saved-creations.types";
import { profileTabsContent } from "../data/profileContent";
import type {
  AppointmentFilterKey,
  OrderFilterKey,
  ProfileAppointmentUi,
  ProfileBespokeItemUi,
  ProfileOrderItemUi,
  ProfileOrderUi,
} from "../types/profileUi.types";
import {
  formatAppointmentDate,
  formatOrderDate,
} from "./formatAccountData";
import { mapCustomerOrderItemToDisplayFields } from "./orderItemDisplay.mapper";
import {
  buildOrderDeliveryTimelineFromStatus,
  formatOrderStatusLabel,
  normalizeOrderStatus,
} from "./orderDeliveryTimeline.utils";

const PLACEHOLDER_RING_IMAGE = "/images/jewellery/plp/product-ring-transparent.png";
const ordersContent = profileTabsContent.orders;

function categorizeOrderStatus(status: string): OrderFilterKey {
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
  return order.items.map((item, index) => {
    const display = mapCustomerOrderItemToDisplayFields(item);
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
  const category = categorizeOrderStatus(order.status);
  const statusLabel = formatOrderStatusLabel(order.status);
  const deliveryBy = formatOrderDate(order.orderDate);
  const deliveryTimeline = buildOrderDeliveryTimelineFromStatus(order.status);

  const base: ProfileOrderUi = {
    id: order.id,
    number: order.number,
    orderDate: order.orderDate,
    status: order.status,
    statusLabel,
    category,
    deliveryBy,
    items: mapOrderItems(order),
    grandTotal: order.grandTotal,
    currency: order.currency,
    showTrack: category === "in_progress",
    showCancel: category === "in_progress",
    showReturn: category === "delivered",
    showDownloadInvoice: true,
    showCancelNote: category === "in_progress",
    footnote:
      category === "in_progress"
        ? ordersContent.cancelNote
        : category === "delivered"
          ? ordersContent.returnDeadlineNote
          : undefined,
  };

  if (category === "returned") {
    return {
      ...base,
      estimatedDeliveryLabel: ordersContent.estimatedDeliveryLabel,
      estimatedDeliveryValue: ordersContent.estimatedDeliveryPlaceholder,
      timeline: [
        { step: 1, label: "Return Initiated", status: "completed" },
        { step: 2, label: "Order Picked Up", status: "completed" },
        { step: 3, label: "Refund Initiated", status: "current" },
        { step: 4, label: "Refunded Successfully", status: "upcoming" },
      ],
    };
  }

  if (category === "cancelled") {
    return {
      ...base,
      estimatedDeliveryLabel: ordersContent.estimatedDeliveryLabel,
      estimatedDeliveryValue: ordersContent.estimatedDeliveryRangePlaceholder,
      timeline: [
        { step: 1, label: "Order Cancelled", status: "completed" },
        { step: 2, label: "Refund Initiated", status: "current" },
        { step: 3, label: "Refunded Successfully", status: "upcoming" },
      ],
    };
  }

  if (deliveryTimeline.length > 0) {
    return {
      ...base,
      ...(category === "in_progress"
        ? {
            estimatedDeliveryLabel: ordersContent.estimatedDeliveryLabel,
            estimatedDeliveryValue: ordersContent.estimatedDeliveryPlaceholder,
          }
        : {}),
      timeline: deliveryTimeline,
    };
  }

  return base;
}

export function mapCustomerAppointmentToProfileUi(
  appointment: CustomerAppointment,
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

  const products =
    appointment.productName
      ? [
          {
            id: appointment.productId ?? appointment.documentId,
            name: appointment.productName,
            imageSrc: PLACEHOLDER_RING_IMAGE,
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

export { categorizeOrderStatus, inferAppointmentType };
