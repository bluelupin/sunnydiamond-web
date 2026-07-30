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
  ProfileTimelineStep,
} from "../types/profileUi.types";
import {
  formatAppointmentDate,
  formatOrderDate,
  formatOrderStatus,
} from "./formatAccountData";
import { mapCustomerOrderItemToDisplayFields } from "./orderItemDisplay.mapper";

const PLACEHOLDER_RING_IMAGE = "/images/jewellery/plp/product-ring-transparent.png";
const ordersContent = profileTabsContent.orders;

function categorizeOrderStatus(status: string): OrderFilterKey {
  const normalized = status.toLowerCase();

  if (normalized.includes("complete") || normalized.includes("deliver")) {
    return "delivered";
  }

  if (normalized.includes("cancel")) {
    return "cancelled";
  }

  if (normalized.includes("return") || normalized.includes("refund")) {
    return "returned";
  }

  return "in_progress";
}

/**
 * Map CMS `formTag` → My Appointments filter.
 * Only known appointment tags are included — contact / personalisation / etc.
 * must NOT fall through into Store Visit (that was showing Get in Touch there).
 */
function inferAppointmentType(formTag: string): AppointmentFilterKey | null {
  const normalized = formTag.toLowerCase().trim();

  if (!normalized) {
    return null;
  }

  // Video Call — e.g. product-video-call
  if (normalized.includes("video")) {
    return "video_call";
  }

  // Try at Home — e.g. try-at-home / product-try-at-home (not showroom-visit)
  if (normalized.includes("try-at-home") || normalized.includes("try_at_home")) {
    return "try_at_home";
  }
  if (normalized.includes("home") && !normalized.includes("showroom")) {
    return "try_at_home";
  }

  // Book a Visit / Store Visit — e.g. showroom-visit, product-store-visit
  if (
    normalized.includes("showroom") ||
    normalized.includes("store-visit") ||
    normalized.includes("store_visit") ||
    (normalized.includes("store") && normalized.includes("visit"))
  ) {
    return "store_visit";
  }

  // contact-us, product-personalisation (Get in Touch), book-appointment, etc.
  return null;
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

function defaultDeliveryTimeline(): ProfileTimelineStep[] {
  return [
    { step: 1, label: "In Production", status: "completed" },
    { step: 2, label: "Packaged", status: "current" },
    { step: 3, label: "Shipped", status: "upcoming" },
    { step: 4, label: "Out for Delivery", status: "upcoming" },
    { step: 5, label: "Delivered", status: "upcoming" },
  ];
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
  const statusLabel = formatOrderStatus(order.status);
  const deliveryBy = formatOrderDate(order.orderDate);

  const base: ProfileOrderUi = {
    id: order.id,
    number: order.number,
    orderDate: order.orderDate,
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

  if (category === "in_progress") {
    return {
      ...base,
      statusLabel: ordersContent.statusInProgress,
      estimatedDeliveryLabel: ordersContent.estimatedDeliveryLabel,
      estimatedDeliveryValue: ordersContent.estimatedDeliveryPlaceholder,
      timeline: defaultDeliveryTimeline(),
    };
  }

  if (category === "returned") {
    return {
      ...base,
      statusLabel: ordersContent.statusRefundInProgress,
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
      statusLabel: ordersContent.statusCancelled,
      estimatedDeliveryLabel: ordersContent.estimatedDeliveryLabel,
      estimatedDeliveryValue: ordersContent.estimatedDeliveryRangePlaceholder,
      timeline: [
        { step: 1, label: "Order Cancelled", status: "completed" },
        { step: 2, label: "Refund Initiated", status: "current" },
        { step: 3, label: "Refunded Successfully", status: "upcoming" },
      ],
    };
  }

  return base;
}

export function mapCustomerAppointmentToProfileUi(
  appointment: CustomerAppointment,
  productImageBySku?: Record<string, string>,
): ProfileAppointmentUi | null {
  const type = inferAppointmentType(appointment.formTag);
  if (!type) {
    return null;
  }

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

  const productSku =
    typeof appointment.productId === "string"
      ? appointment.productId.trim()
      : appointment.productId != null
        ? String(appointment.productId).trim()
        : "";
  const products =
    appointment.productName
      ? [
          {
            id: productSku || appointment.documentId,
            name: appointment.productName,
            imageSrc:
              (productSku && productImageBySku?.[productSku]) || PLACEHOLDER_RING_IMAGE,
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
    const heading =
      appointment.preferredShowroom?.name?.trim() ||
      appointment.preferredShowroom?.city?.trim() ||
      showroomParts[0] ||
      "";
    const uniqueLines = Array.from(
      new Set(
        showroomParts
          .map((part) => part.trim())
          .filter((part) => part.length > 0)
          .filter((part) => part.toLowerCase() !== heading.toLowerCase()),
      ),
    );

    return {
      ...base,
      storeVisit: {
        city: heading,
        lines: uniqueLines,
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
