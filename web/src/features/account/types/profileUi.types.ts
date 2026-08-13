export type OrderFilterKey = "in_progress" | "delivered" | "cancelled" | "returned";

export type OrderFilterEmptyStateKey = "delivered" | "cancelled" | "returned";

export type AppointmentFilterKey = "video_call" | "try_at_home" | "store_visit";

export type TimelineStepStatus = "completed" | "current" | "upcoming";

/** Badge shown on top of the tab category while a cancellation/return is being processed. */
export type ProfileOrderSubState = "cancellation_in_progress" | "return_in_progress";

export type ProfileTimelineStep = {
  step: number;
  label: string;
  status: TimelineStepStatus;
  /** Server-provided step copy (`sunny_tracking`); falls back to local descriptions. */
  description?: string;
  /** ISO timestamp the step was reached, when the server reports one. */
  timestamp?: string;
};

export type ProfileOrderItemUi = {
  id: string;
  name: string;
  imageSrc: string;
  size?: string;
  metal?: string;
  engraving?: string;
  engravingFont?: string;
  isGift?: boolean;
  isBespoke?: boolean;
  useIconPlaceholder?: boolean;
  productUrlKey?: string | null;
  quantity: number;
};

export type ProfileOrderDetailItemUi = ProfileOrderItemUi & {
  unitPrice: number;
  currency: string;
  giftNote?: string;
};

export type ProfileOrderPriceBreakdownUi = {
  orderAmount: number;
  orderDiscount: number;
  /** Present when Magento reports shipping on the order (amount may be 0 for free shipping). */
  shipping?: number;
  shippingMethod?: string;
  tax: number;
  orderTotal: number;
  currency: string;
  /** Set for cash-on-delivery orders — the full total is collected at the door. */
  amountPayableAtDelivery?: number;
};

export type ProfileOrderDetailUi = {
  id: string;
  number: string;
  orderDate: string;
  status: string;
  statusLabel: string;
  category: OrderFilterKey;
  subState?: ProfileOrderSubState;
  deliveryBy?: string;
  estimatedDeliveryLabel?: string;
  estimatedDeliveryValue?: string;
  timeline?: ProfileTimelineStep[];
  /** True when `timeline` comes from `sunny_tracking`/`sunny_refund` (never re-derive it). */
  timelineFromServer?: boolean;
  items: ProfileOrderDetailItemUi[];
  priceBreakdown: ProfileOrderPriceBreakdownUi;
  paymentMethod?: string;
  shippingAddress?: {
    fullName: string;
    streetLines: string[];
    city: string;
    region: string;
    pincode: string;
    phone: string;
  };
  footnote?: string;
  showCancel: boolean;
  showReturn: boolean;
  showDownloadInvoice: boolean;
  showContactUs?: boolean;
  /** Invoice button stays visible but inert until Magento has an invoice. */
  invoiceDisabled?: boolean;
  showCancelNote: boolean;
};

export type ProfileOrderUi = {
  id: string;
  number: string;
  orderDate: string;
  /** Raw Magento order status from the API. */
  status: string;
  statusLabel: string;
  category: OrderFilterKey;
  subState?: ProfileOrderSubState;
  deliveryBy?: string;
  estimatedDeliveryLabel?: string;
  estimatedDeliveryValue?: string;
  timeline?: ProfileTimelineStep[];
  /** True when `timeline` comes from `sunny_tracking`/`sunny_refund` (never re-derive it). */
  timelineFromServer?: boolean;
  items: ProfileOrderItemUi[];
  grandTotal: number;
  currency: string;
  footnote?: string;
  showTrack: boolean;
  showCancel: boolean;
  showReturn: boolean;
  showDownloadInvoice: boolean;
  showContactUs?: boolean;
  /** Invoice button stays visible but inert until Magento has an invoice. */
  invoiceDisabled?: boolean;
  showCancelNote: boolean;
};

export type ProfileAppointmentProductUi = {
  id: string;
  name: string;
  imageSrc: string;
};

export type ProfileAppointmentUi = {
  id: string;
  type: AppointmentFilterKey;
  typeLabel: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  products: ProfileAppointmentProductUi[];
  appointmentAddress?: {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone: string;
  };
  storeVisit?: {
    city: string;
    lines: string[];
    directionsHref?: string;
  };
  bookingDate: string;
  bookingTime: string;
  notesLabel: string;
  notes: string;
  rescheduleNote?: string;
  canReschedule: boolean;
  canCancel: boolean;
};

export type ProfileBespokeItemUi = {
  id: string;
  creationDocumentId: string;
  title: string;
  imageSrc: string;
  /** Cover + gallery URLs for the detail panel carousel. */
  images: string[];
  size?: string;
  metal?: string;
  price?: string;
  viewHref: string;
  savedAt?: string;
};
