import type {
  SunnyGiftMode,
  SunnyItemTag,
  SunnyOrderStatus,
  SunnyRefundStepCode,
  SunnyRefundType,
  SunnyReturnState,
  SunnyStepState,
  SunnyTrackingStepCode,
  TrackedOrder,
  TrackedOrderAddress,
  TrackedOrderComment,
  TrackedOrderDiscount,
  TrackedOrderItem,
  TrackedOrderItemOption,
  TrackedOrderItemSunnyFields,
  TrackedOrderPaymentMethod,
  TrackedOrderRefundStatus,
  TrackedOrderReturnDetails,
  TrackedOrderShipment,
  TrackedOrderSunnyFields,
  TrackedOrderTotals,
  TrackedOrderTracking,
} from "./order-tracking.types";

type MagentoMoney = {
  value?: number | null;
  currency?: string | null;
};

type MagentoOrderItemOption = {
  label?: string | null;
  value?: string | null;
};

type MagentoOrderDiscount = {
  label?: string | null;
  amount?: MagentoMoney | null;
};

/** Order-flow item fields — absent from the payload while the feature flag is off. */
export type MagentoSunnyOrderItemFields = {
  is_gift?: boolean | null;
  sunny_tag?: SunnyItemTag | null;
  gift_message?: { message?: string | null } | null;
  product?: { thumbnail?: { url?: string | null } | null } | null;
};

export type MagentoSunnyRefundStatus = {
  type?: SunnyRefundType | null;
  steps?: Array<{
    code?: SunnyRefundStepCode | null;
    label?: string | null;
    state?: SunnyStepState | null;
    timestamp?: string | null;
  }> | null;
  refund_amount?: MagentoMoney | null;
  refund_mode?: string | null;
  estimated_completion_date?: string | null;
  estimated_window_label?: string | null;
};

export type MagentoSunnyReturnDetails = {
  state?: SunnyReturnState | null;
  reason?: string | null;
  comment?: string | null;
  requested_at?: string | null;
};

/** Order-flow order fields — absent from the payload while the feature flag is off. */
export type MagentoSunnyOrderFields = {
  sunny_status?: SunnyOrderStatus | null;
  sunny_actions?: {
    can_track?: boolean | null;
    can_cancel?: boolean | null;
    can_return?: boolean | null;
    can_download_invoice?: boolean | null;
    can_contact_support?: boolean | null;
  } | null;
  sunny_tracking?: {
    current_step?: SunnyTrackingStepCode | null;
    steps?: Array<{
      code?: SunnyTrackingStepCode | null;
      label?: string | null;
      state?: SunnyStepState | null;
      timestamp?: string | null;
      description?: string | null;
    }> | null;
  } | null;
  sunny_refund?: MagentoSunnyRefundStatus | null;
  sunny_delivery?: {
    estimated_delivery_at?: string | null;
    delivered_at?: string | null;
    returnable_till?: string | null;
  } | null;
  gift_mode?: SunnyGiftMode | null;
};

type MagentoOrderItem = {
  product_name?: string | null;
  quantity_ordered?: number | null;
  product_url_key?: string | null;
  product_sku?: string | null;
  product_sale_price?: MagentoMoney | null;
  selected_options?: MagentoOrderItemOption[] | null;
  entered_options?: MagentoOrderItemOption[] | null;
} & MagentoSunnyOrderItemFields;

type MagentoOrderAddress = {
  firstname?: string | null;
  lastname?: string | null;
  street?: string[] | null;
  city?: string | null;
  region?: string | null;
  postcode?: string | null;
  telephone?: string | null;
};

type MagentoShipmentTracking = {
  title?: string | null;
  number?: string | null;
  carrier?: string | null;
};

type MagentoOrderShipment = {
  number?: string | null;
  tracking?: MagentoShipmentTracking[] | null;
};

type MagentoOrderPaymentMethod = {
  name?: string | null;
  type?: string | null;
};

type MagentoOrderComment = {
  message?: string | null;
  timestamp?: string | null;
};

export type MagentoCustomerOrderDetail = {
  id?: string | null;
  number?: string | null;
  order_date?: string | null;
  status?: string | null;
  carrier?: string | null;
  shipping_method?: string | null;
  items?: MagentoOrderItem[] | null;
  total?: {
    grand_total?: MagentoMoney | null;
    subtotal_incl_tax?: MagentoMoney | null;
    total_tax?: MagentoMoney | null;
    total_shipping?: MagentoMoney | null;
    discounts?: MagentoOrderDiscount[] | null;
  } | null;
  payment_methods?: MagentoOrderPaymentMethod[] | null;
  comments?: MagentoOrderComment[] | null;
  shipping_address?: MagentoOrderAddress | null;
  billing_address?: MagentoOrderAddress | null;
  shipments?: MagentoOrderShipment[] | null;
} & MagentoSunnyOrderFields;

export type MagentoCustomerOrderByNumberResponse = {
  customer?: {
    orders?: {
      items?: MagentoCustomerOrderDetail[] | null;
    } | null;
  } | null;
};

export type MagentoGuestOrderResponse = {
  guestOrder?: MagentoCustomerOrderDetail | null;
};

function mapMagentoOrderOptions(
  options: MagentoOrderItemOption[] | null | undefined,
): TrackedOrderItemOption[] {
  return (options ?? [])
    .filter((option) => option.label && option.value)
    .map((option) => ({
      label: option.label!.trim(),
      value: option.value!.trim(),
    }));
}

function mapMagentoOrderAddress(address: MagentoOrderAddress | null | undefined): TrackedOrderAddress | null {
  if (!address) {
    return null;
  }

  return {
    fullName: [address.firstname, address.lastname].filter(Boolean).join(" "),
    streetLines: (address.street ?? []).filter(Boolean),
    city: address.city ?? "",
    region: address.region ?? "",
    pincode: address.postcode ?? "",
    phone: address.telephone ?? "",
  };
}

export function mapSunnyOrderItemFields(
  item: MagentoSunnyOrderItemFields,
): TrackedOrderItemSunnyFields {
  return {
    isGift: Boolean(item.is_gift),
    sunnyTag: item.sunny_tag ?? null,
    giftMessage: item.gift_message?.message?.trim() || null,
    thumbnailUrl: item.product?.thumbnail?.url?.trim() || null,
  };
}

export function mapSunnyRefundStatus(
  refund: MagentoSunnyRefundStatus | null | undefined,
): TrackedOrderRefundStatus | null {
  if (!refund?.type) {
    return null;
  }

  return {
    type: refund.type,
    steps: (refund.steps ?? [])
      .filter((step) => step.code && step.state)
      .map((step) => ({
        code: step.code!,
        label: step.label ?? "",
        state: step.state!,
        timestamp: step.timestamp ?? null,
      })),
    refundAmount: refund.refund_amount?.value ?? 0,
    currency: refund.refund_amount?.currency ?? "INR",
    refundMode: refund.refund_mode ?? "",
    estimatedCompletionDate: refund.estimated_completion_date ?? null,
    estimatedWindowLabel: refund.estimated_window_label ?? "",
  };
}

export function mapSunnyReturnDetails(
  details: MagentoSunnyReturnDetails | null | undefined,
): TrackedOrderReturnDetails | null {
  if (!details?.state) {
    return null;
  }

  return {
    state: details.state,
    reason: details.reason ?? "",
    comment: details.comment?.trim() || null,
    requestedAt: details.requested_at ?? "",
  };
}

function mapSunnyTracking(
  tracking: MagentoSunnyOrderFields["sunny_tracking"],
): TrackedOrderTracking | null {
  if (!tracking?.current_step) {
    return null;
  }

  return {
    currentStep: tracking.current_step,
    steps: (tracking.steps ?? [])
      .filter((step) => step.code && step.state)
      .map((step) => ({
        code: step.code!,
        label: step.label ?? "",
        state: step.state!,
        timestamp: step.timestamp ?? null,
        description: step.description?.trim() || null,
      })),
  };
}

export function mapSunnyOrderFields(order: MagentoSunnyOrderFields): TrackedOrderSunnyFields {
  const actions = order.sunny_actions;
  const delivery = order.sunny_delivery;

  return {
    sunnyStatus: order.sunny_status ?? null,
    sunnyActions: actions
      ? {
          canTrack: Boolean(actions.can_track),
          canCancel: Boolean(actions.can_cancel),
          canReturn: Boolean(actions.can_return),
          canDownloadInvoice: Boolean(actions.can_download_invoice),
          canContactSupport: Boolean(actions.can_contact_support),
        }
      : null,
    sunnyTracking: mapSunnyTracking(order.sunny_tracking),
    sunnyRefund: mapSunnyRefundStatus(order.sunny_refund),
    sunnyDelivery: delivery
      ? {
          estimatedDeliveryAt: delivery.estimated_delivery_at ?? null,
          deliveredAt: delivery.delivered_at ?? null,
          returnableTill: delivery.returnable_till ?? null,
        }
      : null,
    giftMode: order.gift_mode ?? null,
  };
}

function mapMagentoOrderItem(item: MagentoOrderItem): TrackedOrderItem {
  return {
    productName: item.product_name ?? "Product",
    quantity: item.quantity_ordered ?? 0,
    productUrlKey: item.product_url_key ?? null,
    productSku: item.product_sku ?? null,
    unitPrice: item.product_sale_price?.value ?? 0,
    currency: item.product_sale_price?.currency ?? "INR",
    selectedOptions: mapMagentoOrderOptions(item.selected_options),
    enteredOptions: mapMagentoOrderOptions(item.entered_options),
    ...mapSunnyOrderItemFields(item),
  };
}

function mapMagentoOrderShipment(shipment: MagentoOrderShipment): TrackedOrderShipment | null {
  if (!shipment.number) {
    return null;
  }

  return {
    number: shipment.number,
    tracking: (shipment.tracking ?? [])
      .filter((entry) => entry.number || entry.title || entry.carrier)
      .map((entry) => ({
        title: entry.title?.trim() || "Tracking",
        number: entry.number?.trim() || "",
        carrier: entry.carrier?.trim() || "",
      })),
  };
}

function mapMagentoOrderTotals(order: MagentoCustomerOrderDetail): TrackedOrderTotals {
  const currency =
    order.total?.grand_total?.currency ??
    order.total?.subtotal_incl_tax?.currency ??
    "INR";

  return {
    grandTotal: order.total?.grand_total?.value ?? 0,
    subtotalInclTax: order.total?.subtotal_incl_tax?.value ?? 0,
    totalTax: order.total?.total_tax?.value ?? 0,
    totalShipping: order.total?.total_shipping?.value ?? 0,
    currency,
    discounts: mapMagentoOrderDiscounts(order.total?.discounts),
  };
}

function mapMagentoOrderDiscounts(
  discounts: MagentoOrderDiscount[] | null | undefined,
): TrackedOrderDiscount[] {
  return (discounts ?? [])
    .filter((discount) => typeof discount.amount?.value === "number")
    .map((discount) => ({
      label: discount.label?.trim() || "Discount",
      amount: discount.amount!.value!,
    }));
}

function mapMagentoOrderComments(comments: MagentoOrderComment[] | null | undefined): TrackedOrderComment[] {
  return (comments ?? [])
    .filter((comment) => comment.message?.trim())
    .map((comment) => ({
      message: comment.message!.trim(),
      timestamp: comment.timestamp ?? null,
    }));
}

function mapMagentoPaymentMethods(
  methods: MagentoOrderPaymentMethod[] | null | undefined,
): TrackedOrderPaymentMethod[] {
  return (methods ?? [])
    .filter((method) => method.name?.trim())
    .map((method) => ({
      name: method.name!.trim(),
      type: method.type?.trim() || "unknown",
    }));
}

export function mapMagentoOrderDetail(order: MagentoCustomerOrderDetail): TrackedOrder | null {
  if (!order.id || !order.number) {
    return null;
  }

  const totals = mapMagentoOrderTotals(order);

  return {
    id: order.id,
    number: order.number,
    orderDate: order.order_date ?? "",
    status: order.status ?? "unknown",
    carrier: order.carrier?.trim() || null,
    shippingMethod: order.shipping_method?.trim() || null,
    items: (order.items ?? []).map(mapMagentoOrderItem),
    totals,
    grandTotal: totals.grandTotal,
    currency: totals.currency,
    shippingAddress: mapMagentoOrderAddress(order.shipping_address),
    billingAddress: mapMagentoOrderAddress(order.billing_address),
    paymentMethods: mapMagentoPaymentMethods(order.payment_methods),
    shipments: (order.shipments ?? [])
      .map(mapMagentoOrderShipment)
      .filter((shipment): shipment is TrackedOrderShipment => Boolean(shipment)),
    comments: mapMagentoOrderComments(order.comments),
    ...mapSunnyOrderFields(order),
  };
}
