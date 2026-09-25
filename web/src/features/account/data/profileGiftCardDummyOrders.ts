import { profileTabsContent } from "../data/profileContent";
import type {
  ProfileOrderDetailItemUi,
  ProfileOrderDetailUi,
  ProfileOrderItemUi,
  ProfileOrderUi,
  ProfileTimelineStep,
} from "../types/profileUi.types";

/** Toggle off when gift card orders are returned by Magento. */
export const PROFILE_GIFT_CARD_USE_DUMMY_ORDERS = true;

const GIFT_CARD_IMAGE_SRC = "/images/gift-card-success.png";

const ordersContent = profileTabsContent.orders;

const physicalGiftCardTimeline: ProfileTimelineStep[] = [
  { step: 1, label: "In Production", status: "completed" },
  { step: 2, label: "Packaged", status: "completed" },
  { step: 3, label: "Shipped", status: "current" },
  { step: 4, label: "Out for Delivery", status: "upcoming" },
  { step: 5, label: "Delivered", status: "upcoming" },
];

const digitalGiftCardItem: ProfileOrderItemUi = {
  id: "dummy-gc-digital-item",
  name: "Gift Card",
  subtitle: "Digital Card",
  imageSrc: GIFT_CARD_IMAGE_SRC,
  quantity: 1,
};

const DIGITAL_GIFT_CARD_ORDER_TOTAL = 12000;

const physicalGiftCardItem: ProfileOrderItemUi = {
  id: "dummy-gc-physical-item",
  name: "Gift Card",
  subtitle: "Physical Card",
  imageSrc: GIFT_CARD_IMAGE_SRC,
  quantity: 1,
};

/** Figma UI-Production 4858:124116 — delivered digital gift card order. */
const digitalGiftCardListOrder: ProfileOrderUi = {
  id: "dummy-gc-digital-order",
  number: "2148001",
  orderDate: "2026-10-30",
  status: "delivered",
  statusLabel: "Delivered",
  category: "delivered",
  deliveryBy: "2026-04-30",
  items: [digitalGiftCardItem],
  grandTotal: DIGITAL_GIFT_CARD_ORDER_TOTAL,
  currency: "INR",
  showTrack: false,
  showCancel: false,
  showReturn: false,
  showDownloadInvoice: false,
  showContactUs: true,
  showCancelNote: false,
  isDummyPreview: true,
};

/** Figma UI-Production 1480:59562 — in-progress physical gift card order. */
const physicalGiftCardListOrder: ProfileOrderUi = {
  id: "dummy-gc-physical-order",
  number: "2148000",
  orderDate: "2026-10-30",
  status: "shipped",
  statusLabel: ordersContent.statusInProgress,
  category: "in_progress",
  deliveryBy: "2026-10-30",
  estimatedDeliveryLabel: ordersContent.estimatedDeliveryLabel,
  estimatedDeliveryValue: "2 June 2026",
  timeline: physicalGiftCardTimeline,
  timelineFromServer: true,
  items: [physicalGiftCardItem],
  grandTotal: 12140,
  currency: "INR",
  footnote: ordersContent.cancelNote,
  showTrack: true,
  showCancel: true,
  showReturn: false,
  showDownloadInvoice: false,
  showCancelNote: true,
  isDummyPreview: true,
};

export const profileGiftCardDummyOrders: ProfileOrderUi[] = [
  physicalGiftCardListOrder,
  digitalGiftCardListOrder,
];

function toDetailItem(item: ProfileOrderItemUi, unitPrice: number): ProfileOrderDetailItemUi {
  return {
    ...item,
    unitPrice,
    currency: "INR",
  };
}

const digitalGiftCardDetailOrder: ProfileOrderDetailUi = {
  ...digitalGiftCardListOrder,
  items: [toDetailItem(digitalGiftCardItem, DIGITAL_GIFT_CARD_ORDER_TOTAL)],
  priceBreakdown: {
    orderAmount: DIGITAL_GIFT_CARD_ORDER_TOTAL,
    orderDiscount: 0,
    tax: 0,
    orderTotal: DIGITAL_GIFT_CARD_ORDER_TOTAL,
    currency: "INR",
  },
  paymentMethod: "Credit Card",
};

const physicalGiftCardDetailOrder: ProfileOrderDetailUi = {
  ...physicalGiftCardListOrder,
  items: [toDetailItem(physicalGiftCardItem, 12140)],
  priceBreakdown: {
    orderAmount: 12140,
    orderDiscount: 0,
    shipping: 0,
    shippingMethod: "Standard Delivery",
    tax: 0,
    orderTotal: 12140,
    currency: "INR",
  },
  paymentMethod: "Credit Card",
  shippingAddress: {
    fullName: "Priya Sharma",
    streetLines: ["12, Palm Grove Avenue", "Koramangala"],
    city: "Bengaluru",
    region: "Karnataka",
    pincode: "560034",
    phone: "+91 9876543210",
  },
};

const dummyDetailByNumber = new Map<string, ProfileOrderDetailUi>([
  [digitalGiftCardListOrder.number, digitalGiftCardDetailOrder],
  [physicalGiftCardListOrder.number, physicalGiftCardDetailOrder],
]);

export function isProfileGiftCardDummyOrderNumber(orderNumber: string): boolean {
  return dummyDetailByNumber.has(orderNumber.trim());
}

export function getProfileGiftCardDummyDetailOrder(
  orderNumber: string,
): ProfileOrderDetailUi | null {
  return dummyDetailByNumber.get(orderNumber.trim()) ?? null;
}
