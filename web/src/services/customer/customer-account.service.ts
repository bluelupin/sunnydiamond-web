import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import {
  MAGENTO_CREATE_CUSTOMER_ADDRESS_MUTATION,
  MAGENTO_CUSTOMER_ADDRESSES_QUERY,
  MAGENTO_CUSTOMER_ORDERS_QUERY,
  MAGENTO_DELETE_CUSTOMER_ADDRESS_MUTATION,
  MAGENTO_UPDATE_CUSTOMER_ADDRESS_MUTATION,
  MAGENTO_UPDATE_CUSTOMER_MUTATION,
  SUNNY_DELETE_CUSTOMER_MUTATION,
} from "./customer.gql";
import {
  mapCustomerAddressInputToMagento,
  mapMagentoCustomerAddresses,
  mapMagentoCustomerOrders,
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
