export type TrackedOrderItemOption = {
  label: string;
  value: string;
};

/** Mirrors the `SunnyOrderStatus` enum exposed by SunnyDiamonds_OrderFlow. */
export type SunnyOrderStatus =
  | "IN_PROGRESS"
  | "DELIVERED"
  | "CANCELLED"
  | "CANCELLATION_IN_PROGRESS"
  | "RETURNED"
  | "RETURN_IN_PROGRESS";

export type SunnyStepState = "COMPLETED" | "CURRENT" | "PENDING";

export type SunnyTrackingStepCode =
  | "IN_PRODUCTION"
  | "PACKAGED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";

export type SunnyRefundType = "CANCELLATION" | "RETURN";

export type SunnyRefundStepCode =
  | "ORDER_CANCELLED"
  | "RETURN_INITIATED"
  | "PRODUCT_PICKED"
  | "REFUND_INITIATED"
  | "REFUNDED_SUCCESSFULLY";

export type SunnyReturnState =
  | "REQUESTED"
  | "PICKED_UP"
  | "REFUND_INITIATED"
  | "REFUNDED"
  | "REJECTED";

export type SunnyItemTag = "GIFT" | "BESPOKE";

export type SunnyGiftMode = "GROUPED" | "SEPARATE";

export type TrackedOrderTrackingStep = {
  code: SunnyTrackingStepCode;
  label: string;
  state: SunnyStepState;
  timestamp: string | null;
  description: string | null;
};

export type TrackedOrderTracking = {
  currentStep: SunnyTrackingStepCode;
  steps: TrackedOrderTrackingStep[];
};

export type TrackedOrderRefundStep = {
  code: SunnyRefundStepCode;
  label: string;
  state: SunnyStepState;
  timestamp: string | null;
};

export type TrackedOrderRefundStatus = {
  type: SunnyRefundType;
  steps: TrackedOrderRefundStep[];
  refundAmount: number;
  currency: string;
  refundMode: string;
  estimatedCompletionDate: string | null;
  estimatedWindowLabel: string;
};

export type TrackedOrderReturnDetails = {
  state: SunnyReturnState;
  reason: string;
  comment: string | null;
  requestedAt: string;
};

export type TrackedOrderActions = {
  canTrack: boolean;
  canCancel: boolean;
  canReturn: boolean;
  canDownloadInvoice: boolean;
  canContactSupport: boolean;
};

export type TrackedOrderDelivery = {
  estimatedDeliveryAt: string | null;
  deliveredAt: string | null;
  returnableTill: string | null;
};

/**
 * Order-flow fields. All null until SunnyDiamonds_OrderFlow is deployed and
 * `MAGENTO_ORDER_FLOW_FIELDS` is on — consumers must keep their legacy fallbacks.
 */
export type TrackedOrderSunnyFields = {
  sunnyStatus: SunnyOrderStatus | null;
  sunnyActions: TrackedOrderActions | null;
  sunnyTracking: TrackedOrderTracking | null;
  sunnyRefund: TrackedOrderRefundStatus | null;
  sunnyDelivery: TrackedOrderDelivery | null;
  giftMode: SunnyGiftMode | null;
};

export type TrackedOrderItemSunnyFields = {
  isGift: boolean;
  sunnyTag: SunnyItemTag | null;
  giftMessage: string | null;
  thumbnailUrl: string | null;
};

export type TrackedOrderItem = {
  productName: string;
  quantity: number;
  productUrlKey: string | null;
  productSku: string | null;
  unitPrice: number;
  currency: string;
  selectedOptions: TrackedOrderItemOption[];
  enteredOptions: TrackedOrderItemOption[];
} & TrackedOrderItemSunnyFields;

export type TrackedOrderShipment = {
  number: string;
  tracking: Array<{
    title: string;
    number: string;
    carrier: string;
  }>;
};

export type TrackedOrderAddress = {
  fullName: string;
  streetLines: string[];
  city: string;
  region: string;
  pincode: string;
  phone: string;
};

export type TrackedOrderPaymentMethod = {
  name: string;
  type: string;
};

export type TrackedOrderDiscount = {
  label: string;
  amount: number;
};

export type TrackedOrderTotals = {
  grandTotal: number;
  subtotalExclTax: number;
  subtotalInclTax: number;
  totalTax: number;
  totalShipping: number;
  currency: string;
  discounts: TrackedOrderDiscount[];
};

export type TrackedOrderComment = {
  message: string;
  timestamp: string | null;
};

export type TrackedOrder = {
  id: string;
  number: string;
  orderDate: string;
  status: string;
  carrier: string | null;
  shippingMethod: string | null;
  items: TrackedOrderItem[];
  totals: TrackedOrderTotals;
  /** @deprecated Use totals.grandTotal */
  grandTotal: number;
  /** @deprecated Use totals.currency */
  currency: string;
  shippingAddress: TrackedOrderAddress | null;
  billingAddress: TrackedOrderAddress | null;
  paymentMethods: TrackedOrderPaymentMethod[];
  shipments: TrackedOrderShipment[];
  comments: TrackedOrderComment[];
} & TrackedOrderSunnyFields;

export type GuestOrderLookupInput = {
  number: string;
  email: string;
  lastname: string;
};
