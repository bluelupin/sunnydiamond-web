export type TrackedOrderItemOption = {
  label: string;
  value: string;
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
};

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

export type TrackedOrderTotals = {
  grandTotal: number;
  subtotalInclTax: number;
  totalTax: number;
  totalShipping: number;
  currency: string;
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
};

export type GuestOrderLookupInput = {
  number: string;
  email: string;
  lastname: string;
};
