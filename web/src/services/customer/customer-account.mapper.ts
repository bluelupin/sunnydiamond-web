import { splitFullName } from "@/services/magento/cart/checkoutAddress.mapper";
import {
  getIndiaMagentoRegionId,
  getIndianStateFromMagentoRegionId,
} from "@/services/magento/regions/indiaRegionIds";
import type {
  CustomerAddress,
  CustomerAddressInput,
  CustomerOrder,
  CustomerOrderItem,
  CustomerOrdersPage,
} from "./customer-account.types";

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
  selected_options?: MagentoOrderItemOption[] | null;
  entered_options?: MagentoOrderItemOption[] | null;
};

type MagentoOrderComment = {
  message?: string | null;
};

type MagentoCustomerOrder = {
  id?: string | null;
  number?: string | null;
  order_date?: string | null;
  status?: string | null;
  comments?: MagentoOrderComment[] | null;
  items?: MagentoOrderItem[] | null;
  total?: {
    grand_total?: MagentoMoney | null;
  } | null;
};

export type MagentoCustomerOrdersResponse = {
  customer?: {
    orders?: {
      total_count?: number | null;
      page_info?: {
        current_page?: number | null;
        page_size?: number | null;
        total_pages?: number | null;
      } | null;
      items?: MagentoCustomerOrder[] | null;
    } | null;
  } | null;
};

type MagentoCustomerAddress = {
  uid?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  street?: string[] | null;
  city?: string | null;
  region?: {
    region?: string | null;
    region_code?: string | null;
    region_id?: number | null;
  } | null;
  postcode?: string | null;
  country_code?: string | null;
  telephone?: string | null;
  default_shipping?: boolean | null;
  default_billing?: boolean | null;
};

export type MagentoCustomerAddressesResponse = {
  customer?: {
    addresses?: MagentoCustomerAddress[] | null;
  } | null;
};

export function mapMagentoCustomerOrders(
  data: MagentoCustomerOrdersResponse,
  fallbackPageSize: number,
  fallbackCurrentPage: number,
): CustomerOrdersPage {
  const orders = data.customer?.orders;
  const pageInfo = orders?.page_info;

  return {
    orders: (orders?.items ?? [])
      .filter((order): order is MagentoCustomerOrder & { id: string; number: string } =>
        Boolean(order?.id && order?.number),
      )
      .map(mapMagentoCustomerOrder),
    totalCount: orders?.total_count ?? 0,
    currentPage: pageInfo?.current_page ?? fallbackCurrentPage,
    pageSize: pageInfo?.page_size ?? fallbackPageSize,
    totalPages: pageInfo?.total_pages ?? 0,
  };
}

function mapMagentoOrderItemOptions(
  options: MagentoOrderItemOption[] | null | undefined,
): CustomerOrderItem["selectedOptions"] {
  return (options ?? [])
    .filter((option) => option.label?.trim() && option.value?.trim())
    .map((option) => ({
      label: option.label!.trim(),
      value: option.value!.trim(),
    }));
}

function mapMagentoCustomerOrder(order: MagentoCustomerOrder): CustomerOrder {
  const commentMessages = (order.comments ?? [])
    .map((comment) => comment.message?.trim() ?? "")
    .filter(Boolean);

  return {
    id: order.id ?? "",
    number: order.number ?? "",
    orderDate: order.order_date ?? "",
    status: order.status ?? "unknown",
    commentMessages,
    items: (order.items ?? []).map((item) => ({
      productName: item.product_name ?? "Product",
      quantity: item.quantity_ordered ?? 0,
      productUrlKey: item.product_url_key ?? null,
      productSku: item.product_sku ?? null,
      imageUrl: null,
      selectedOptions: mapMagentoOrderItemOptions(item.selected_options),
      enteredOptions: mapMagentoOrderItemOptions(item.entered_options),
    })),
    grandTotal: order.total?.grand_total?.value ?? 0,
    currency: order.total?.grand_total?.currency ?? "INR",
  };
}

export function mapMagentoCustomerAddresses(
  data: MagentoCustomerAddressesResponse,
): CustomerAddress[] {
  return (data.customer?.addresses ?? [])
    .filter((address): address is MagentoCustomerAddress & { uid: string } => Boolean(address?.uid))
    .map(mapMagentoCustomerAddress);
}

function mapMagentoCustomerAddress(address: MagentoCustomerAddress): CustomerAddress {
  const regionId = address.region?.region_id ?? null;
  const stateFromRegionId =
    typeof regionId === "number" ? getIndianStateFromMagentoRegionId(regionId) : null;

  return {
    uid: address.uid ?? "",
    fullName: [address.firstname, address.lastname].filter(Boolean).join(" "),
    streetLines: (address.street ?? []).filter(Boolean),
    city: address.city ?? "",
    state: stateFromRegionId ?? address.region?.region ?? "",
    pincode: address.postcode ?? "",
    countryCode: address.country_code ?? "IN",
    phone: address.telephone ?? "",
    isDefaultShipping: Boolean(address.default_shipping),
    isDefaultBilling: Boolean(address.default_billing),
  };
}

export function mapCustomerAddressInputToMagento(input: CustomerAddressInput) {
  const regionId = getIndiaMagentoRegionId(input.state);

  if (!regionId) {
    throw new Error(`Unsupported delivery state: ${input.state}`);
  }

  const { firstname, lastname } = splitFullName(input.name);
  const street = [input.addressLine1.trim(), input.addressLine2?.trim() ?? ""].filter(Boolean);

  if (street.length === 0) {
    throw new Error("Address line 1 is required");
  }

  const phone = input.phone.replace(/\D/g, "");
  if (!phone) {
    throw new Error("Phone number is required");
  }

  return {
    firstname,
    lastname,
    street,
    city: input.city.trim(),
    postcode: input.pincode.trim(),
    country_code: "IN" as const,
    region: {
      region_id: regionId,
      region: input.state.trim(),
    },
    telephone: phone,
    default_shipping: Boolean(input.defaultShipping),
    default_billing: Boolean(input.defaultBilling),
  };
}

export function mapCustomerAddressToFormInput(address: CustomerAddress): CustomerAddressInput {
  return {
    name: address.fullName,
    addressLine1: address.streetLines[0] ?? "",
    addressLine2: address.streetLines.slice(1).join(", "),
    pincode: address.pincode,
    city: address.city,
    state: address.state,
    phone: address.phone,
    defaultShipping: address.isDefaultShipping,
    defaultBilling: address.isDefaultBilling,
  };
}
