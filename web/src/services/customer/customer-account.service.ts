import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import {
  MAGENTO_CREATE_CUSTOMER_ADDRESS_MUTATION,
  MAGENTO_CUSTOMER_ADDRESSES_QUERY,
  MAGENTO_CUSTOMER_LATEST_ORDER_SHIPPING_QUERY,
  MAGENTO_CUSTOMER_ORDERS_QUERY,
  MAGENTO_DELETE_CUSTOMER_ADDRESS_MUTATION,
  MAGENTO_UPDATE_CUSTOMER_ADDRESS_MUTATION,
  MAGENTO_UPDATE_CUSTOMER_MUTATION,
  SUNNY_DELETE_CUSTOMER_MUTATION,
} from "./customer.gql";
import {
  doesCustomerAddressMatchInput,
  mapCustomerAddressInputToMagento,
  mapMagentoCustomerAddresses,
  mapMagentoCustomerOrders,
  mapOrderShippingAddressToCustomerAddressInput,
  type MagentoCustomerAddressesResponse,
  type MagentoCustomerOrdersResponse,
} from "./customer-account.mapper";
import type {
  CustomerAddress,
  CustomerAddressInput,
  CustomerOrdersPage,
} from "./customer-account.types";

const DEFAULT_ORDERS_PAGE_SIZE = 10;

export async function fetchCustomerOrders(
  authToken: string,
  currentPage = 1,
  pageSize = DEFAULT_ORDERS_PAGE_SIZE,
): Promise<CustomerOrdersPage> {
  const data = await magentoGraphqlFetch<MagentoCustomerOrdersResponse>({
    query: MAGENTO_CUSTOMER_ORDERS_QUERY,
    variables: { pageSize, currentPage },
    authToken,
  });

  return mapMagentoCustomerOrders(data, pageSize, currentPage);
}

export async function fetchCustomerAddresses(authToken: string): Promise<CustomerAddress[]> {
  const data = await magentoGraphqlFetch<MagentoCustomerAddressesResponse>({
    query: MAGENTO_CUSTOMER_ADDRESSES_QUERY,
    authToken,
  });

  return mapMagentoCustomerAddresses(data);
}

export async function createCustomerAddress(
  authToken: string,
  input: CustomerAddressInput,
): Promise<CustomerAddress[]> {
  await magentoGraphqlFetch({
    query: MAGENTO_CREATE_CUSTOMER_ADDRESS_MUTATION,
    variables: { input: mapCustomerAddressInputToMagento(input) },
    authToken,
  });

  return fetchCustomerAddresses(authToken);
}

export async function updateCustomerAddress(
  authToken: string,
  uid: string,
  input: CustomerAddressInput,
): Promise<CustomerAddress[]> {
  await magentoGraphqlFetch({
    query: MAGENTO_UPDATE_CUSTOMER_ADDRESS_MUTATION,
    variables: {
      uid,
      input: mapCustomerAddressInputToMagento(input),
    },
    authToken,
  });

  return fetchCustomerAddresses(authToken);
}

export async function deleteCustomerAddress(
  authToken: string,
  uid: string,
): Promise<CustomerAddress[]> {
  await magentoGraphqlFetch({
    query: MAGENTO_DELETE_CUSTOMER_ADDRESS_MUTATION,
    variables: { uid },
    authToken,
  });

  return fetchCustomerAddresses(authToken);
}

type MagentoLatestOrderShippingResponse = {
  customer?: {
    orders?: {
      items?: Array<{
        number?: string | null;
        shipping_address?: {
          firstname?: string | null;
          lastname?: string | null;
          street?: string[] | null;
          city?: string | null;
          region?: string | null;
          postcode?: string | null;
          telephone?: string | null;
        } | null;
      }> | null;
    } | null;
  } | null;
};

/**
 * When a guest later signs in, their checkout address may exist only on the order.
 * Backfill the profile address book from the most recent order when it is missing.
 */
export async function syncCustomerAddressFromLatestOrder(
  authToken: string,
): Promise<CustomerAddress[]> {
  const existingAddresses = await fetchCustomerAddresses(authToken);
  const data = await magentoGraphqlFetch<MagentoLatestOrderShippingResponse>({
    query: MAGENTO_CUSTOMER_LATEST_ORDER_SHIPPING_QUERY,
    authToken,
    cache: "no-store",
  });

  const shippingAddress = data.customer?.orders?.items?.[0]?.shipping_address ?? null;
  const input = mapOrderShippingAddressToCustomerAddressInput(shippingAddress);

  if (!input) {
    return existingAddresses;
  }

  if (existingAddresses.some((address) => doesCustomerAddressMatchInput(input, address))) {
    return existingAddresses;
  }

  const isFirstAddress = existingAddresses.length === 0;

  return createCustomerAddress(authToken, {
    ...input,
    defaultShipping: isFirstAddress || !existingAddresses.some((address) => address.isDefaultShipping),
    defaultBilling: false,
  });
}

export async function updateCustomerName(
  authToken: string,
  input: { firstname: string; lastname: string },
): Promise<{ firstname: string; lastname: string; email: string }> {
  const data = await magentoGraphqlFetch<{
    updateCustomerV2?: {
      customer?: {
        firstname?: string | null;
        lastname?: string | null;
        email?: string | null;
      } | null;
    } | null;
  }>({
    query: MAGENTO_UPDATE_CUSTOMER_MUTATION,
    variables: {
      input: {
        firstname: input.firstname.trim(),
        lastname: input.lastname.trim() || "-",
      },
    },
    authToken,
  });

  const customer = data.updateCustomerV2?.customer;

  return {
    firstname: customer?.firstname?.trim() || input.firstname,
    lastname: customer?.lastname?.trim() || input.lastname,
    email: customer?.email?.trim() || "",
  };
}

/**
 * Throws `MagentoGraphqlError` on failure — the caller branches on
 * `errors[0].extensions.category` (e.g. `ACTIVE_ORDERS`).
 */
export async function deleteCustomerAccount(
  authToken: string,
  payload: { reason?: string; comment?: string },
): Promise<void> {
  await magentoGraphqlFetch({
    query: SUNNY_DELETE_CUSTOMER_MUTATION,
    variables: {
      input: {
        ...(payload.reason ? { reason: payload.reason } : {}),
        ...(payload.comment ? { comment: payload.comment } : {}),
      },
    },
    authToken,
  });
}
