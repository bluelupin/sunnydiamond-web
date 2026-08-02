import type { TrackedOrder, TrackedOrderItem } from "@/services/customer/order-tracking.types";
import { profileTabsContent } from "../data/profileContent";
import type {
  ProfileOrderDetailItemUi,
  ProfileOrderDetailUi,
  ProfileOrderPriceBreakdownUi,
} from "../types/profileUi.types";
import { mapCustomerOrderItemToDisplayFields } from "./orderItemDisplay.mapper";
import {
  getOrderItemGiftNote,
  parseOrderGiftMetadataFromComments,
} from "./orderGiftDetection.utils";
import {
  buildOrderDeliveryTimelineFromStatus,
  formatOrderStatusLabel,
} from "./orderDeliveryTimeline.utils";
import { mapSunnyTrackingToTimeline } from "./orderFlowSteps.mapper";
import {
  categorizeOrder,
  formatReturnDeadlineNote,
  LEGACY_CANCELLED_REFUND_STEPS,
  LEGACY_RETURN_REFUND_STEPS,
  resolveEstimatedDeliveryValue,
  resolveOrderDeliveryBy,
  resolveRefundEstimateValue,
  resolveRefundTimeline,
} from "./profileDisplayMappers";

const PLACEHOLDER_RING_IMAGE = "/images/jewellery/plp/product-ring-transparent.png";
const ordersContent = profileTabsContent.orders;

/** Magento payment method codes that collect the money at the door. */
const COD_PAYMENT_TYPES = new Set(["cashondelivery", "cod"]);

function isCashOnDeliveryOrder(order: TrackedOrder): boolean {
  return order.paymentMethods.some((method) =>
    COD_PAYMENT_TYPES.has(method.type.trim().toLowerCase()),
  );
}

function trackedItemToMapperInput(item: TrackedOrderItem) {
  return {
    productName: item.productName,
    quantity: item.quantity,
    productUrlKey: item.productUrlKey,
    productSku: item.productSku,
    imageUrl: null,
    selectedOptions: item.selectedOptions,
    enteredOptions: item.enteredOptions,
    isGift: item.isGift,
    sunnyTag: item.sunnyTag,
    giftMessage: item.giftMessage,
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
    ...(isCashOnDeliveryOrder(order)
      ? { amountPayableAtDelivery: totals.grandTotal }
      : {}),
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
    // GraphQL gift fields win; the REST comment chain still carries engraving notes.
    const giftNote =
      item.giftMessage ?? getOrderItemGiftNote(giftMetadata, item.productName, item.productSku);

    return {
      id: `${order.id}-${item.productSku ?? index}`,
      name: item.productName,
      imageSrc: imageUrl ?? PLACEHOLDER_RING_IMAGE,
      size: display.size,
      metal: display.metal,
      isGift: item.isGift || display.isGift,
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
  const { category, subState } = categorizeOrder(order.sunnyStatus, order.status);
  const statusLabel = formatOrderStatusLabel(order.status);
  const deliveryBy = resolveOrderDeliveryBy(order.sunnyDelivery);
  const actions = order.sunnyActions;
  const trackingTimeline = mapSunnyTrackingToTimeline(order.sunnyTracking);
  const deliveryTimeline =
    trackingTimeline.length > 0
      ? trackingTimeline
      : buildOrderDeliveryTimelineFromStatus(order.status);
  const priceBreakdown = buildPriceBreakdown(order);

  const base: ProfileOrderDetailUi = {
    id: order.id,
    number: order.number,
    orderDate: order.orderDate,
    status: order.status,
    statusLabel,
    category,
    ...(subState ? { subState } : {}),
    ...(deliveryBy ? { deliveryBy } : {}),
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
