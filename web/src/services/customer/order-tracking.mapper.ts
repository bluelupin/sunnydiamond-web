import type {
  TrackedOrder,
  TrackedOrderAddress,
  TrackedOrderComment,
  TrackedOrderItem,
  TrackedOrderItemOption,
  TrackedOrderPaymentMethod,
  TrackedOrderShipment,
  TrackedOrderTotals,
} from "./order-tracking.types";

type MagentoMoney = {
  value?: number | null;
  currency?: string | null;
};

type MagentoOrderItemOption = {
  label?: string | null;
  value?: string | null;
};

type MagentoOrderItem = {
  product_name?: string | null;
  quantity_ordered?: number | null;
  product_url_key?: string | null;
  product_sku?: string | null;
  product_sale_price?: MagentoMoney | null;
  selected_options?: MagentoOrderItemOption[] | null;
  entered_options?: MagentoOrderItemOption[] | null;
};

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
  } | null;
  payment_methods?: MagentoOrderPaymentMethod[] | null;
  comments?: MagentoOrderComment[] | null;
  shipping_address?: MagentoOrderAddress | null;
  billing_address?: MagentoOrderAddress | null;
  shipments?: MagentoOrderShipment[] | null;
};

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
  };
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
  };
}
