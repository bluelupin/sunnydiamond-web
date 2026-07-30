import type { TrackedOrder, TrackedOrderItem } from "@/services/customer/order-tracking.types";
import { profileTabsContent } from "../data/profileContent";
import type {
  ProfileOrderDetailItemUi,
  ProfileOrderDetailUi,
  ProfileOrderPriceBreakdownUi,
} from "../types/profileUi.types";
import { formatOrderDate } from "./formatAccountData";
import { mapCustomerOrderItemToDisplayFields } from "./orderItemDisplay.mapper";
import {
  getOrderItemGiftNote,
  parseOrderGiftMetadataFromComments,
} from "./orderGiftDetection.utils";
import {
  buildOrderDeliveryTimelineFromStatus,
  formatOrderStatusLabel,
} from "./orderDeliveryTimeline.utils";
import { categorizeOrderStatus } from "./profileDisplayMappers";

const PLACEHOLDER_RING_IMAGE = "/images/jewellery/plp/product-ring-transparent.png";
const ordersContent = profileTabsContent.orders;

function trackedItemToMapperInput(item: TrackedOrderItem) {
  return {
    productName: item.productName,
    quantity: item.quantity,
    productUrlKey: item.productUrlKey,
    productSku: item.productSku,
    imageUrl: null,
    selectedOptions: item.selectedOptions,
    enteredOptions: item.enteredOptions,
  };
}

function buildPriceBreakdown(order: TrackedOrder): ProfileOrderPriceBreakdownUi {
  const { totals } = order;
  const lineTotal = order.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const orderAmount = lineTotal > 0 ? lineTotal : totals.subtotalInclTax;
  const preTaxTotal = totals.grandTotal - totals.totalTax - totals.totalShipping;
  const orderDiscount = Math.max(0, orderAmount - preTaxTotal);

  return {
    orderAmount,
    orderDiscount,
    tax: totals.totalTax,
    orderTotal: totals.grandTotal,
    currency: totals.currency,
  };
}

function mapDetailItems(
  order: TrackedOrder,
  imageBySku: Record<string, string>,
): ProfileOrderDetailItemUi[] {
  const commentMessages = order.comments.map((comment) => comment.message);
  const giftMetadata = parseOrderGiftMetadataFromComments(commentMessages);

  return order.items.map((item, index) => {
    const mapperInput = trackedItemToMapperInput(item);
    const display = mapCustomerOrderItemToDisplayFields(mapperInput, giftMetadata);
    const sku = item.productSku?.trim();
    const imageFromSku = sku ? imageBySku[sku] : undefined;
    const imageUrl = imageFromSku?.trim() || null;
    const giftNote = getOrderItemGiftNote(giftMetadata, item.productName, item.productSku);

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
      unitPrice: item.unitPrice,
      currency: item.currency,
      giftNote,
    };
  });
}

export function mapTrackedOrderToProfileDetailUi(
  order: TrackedOrder,
  imageBySku: Record<string, string> = {},
): ProfileOrderDetailUi {
  const category = categorizeOrderStatus(order.status);
  const statusLabel = formatOrderStatusLabel(order.status);
  const deliveryBy = formatOrderDate(order.orderDate);
  const deliveryTimeline = buildOrderDeliveryTimelineFromStatus(order.status);
  const priceBreakdown = buildPriceBreakdown(order);

  const base: ProfileOrderDetailUi = {
    id: order.id,
    number: order.number,
    orderDate: order.orderDate,
    status: order.status,
    statusLabel,
    category,
    deliveryBy,
    items: mapDetailItems(order, imageBySku),
    priceBreakdown,
    paymentMethod: order.paymentMethods[0]?.name,
    shippingAddress: order.shippingAddress
      ? {
          fullName: order.shippingAddress.fullName,
          streetLines: order.shippingAddress.streetLines,
          city: order.shippingAddress.city,
          region: order.shippingAddress.region,
          pincode: order.shippingAddress.pincode,
          phone: order.shippingAddress.phone,
        }
      : undefined,
    showCancel: category === "in_progress",
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
