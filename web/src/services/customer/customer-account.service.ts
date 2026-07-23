import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import {
  MAGENTO_CREATE_CUSTOMER_ADDRESS_MUTATION,
  MAGENTO_CUSTOMER_ADDRESSES_QUERY,
  MAGENTO_CUSTOMER_ORDERS_QUERY,
  MAGENTO_DELETE_CUSTOMER_ADDRESS_MUTATION,
  MAGENTO_UPDATE_CUSTOMER_ADDRESS_MUTATION,
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
