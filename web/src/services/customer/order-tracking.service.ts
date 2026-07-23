import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import {
  MAGENTO_CUSTOMER_ORDER_BY_NUMBER_QUERY,
  MAGENTO_GUEST_ORDER_QUERY,
} from "./customer.gql";
import {
  mapMagentoOrderDetail,
  type MagentoCustomerOrderByNumberResponse,
  type MagentoGuestOrderResponse,
} from "./order-tracking.mapper";
import type { GuestOrderLookupInput, TrackedOrder } from "./order-tracking.types";

export async function fetchCustomerOrderByNumber(
  authToken: string,
  orderNumber: string,
): Promise<TrackedOrder | null> {
  const data = await magentoGraphqlFetch<MagentoCustomerOrderByNumberResponse>({
    query: MAGENTO_CUSTOMER_ORDER_BY_NUMBER_QUERY,
    variables: {
      filter: {
        number: { eq: orderNumber.trim() },
      },
    },
    authToken,
  });

  const order = data.customer?.orders?.items?.[0];
  return order ? mapMagentoOrderDetail(order) : null;
}

export async function fetchGuestOrder(input: GuestOrderLookupInput): Promise<TrackedOrder | null> {
  const data = await magentoGraphqlFetch<MagentoGuestOrderResponse>({
    query: MAGENTO_GUEST_ORDER_QUERY,
    variables: {
      input: {
        number: input.number.trim(),
        email: input.email.trim(),
        lastname: input.lastname.trim(),
      },
    },
    cache: "no-store",
  });

  return data.guestOrder ? mapMagentoOrderDetail(data.guestOrder) : null;
}
