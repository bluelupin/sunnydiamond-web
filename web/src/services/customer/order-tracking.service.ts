import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { fetchStorefrontLineMetadataComments } from "@/services/magento/orders/orderLineMetadata.service";
import {
  MAGENTO_CUSTOMER_ORDER_BY_NUMBER_QUERY,
  MAGENTO_GUEST_ORDER_QUERY,
} from "./customer.gql";
import {
  mapMagentoOrderDetail,
  type MagentoCustomerOrderByNumberResponse,
  type MagentoGuestOrderResponse,
} from "./order-tracking.mapper";
import type { GuestOrderLookupInput, TrackedOrder, TrackedOrderComment } from "./order-tracking.types";

export async function enrichTrackedOrderComments(order: TrackedOrder): Promise<TrackedOrder> {
  const storefrontComments = await fetchStorefrontLineMetadataComments(order.number);
  if (storefrontComments.length === 0) {
    return order;
  }

  const existingMessages = new Set(order.comments.map((comment) => comment.message));
  const additional: TrackedOrderComment[] = storefrontComments
    .filter((message) => !existingMessages.has(message))
    .map((message) => ({ message, timestamp: null }));

  if (additional.length === 0) {
    return order;
  }

  return {
    ...order,
    comments: [...order.comments, ...additional],
  };
}

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
  const mapped = order ? mapMagentoOrderDetail(order) : null;

  if (!mapped) {
    return null;
  }

  return enrichTrackedOrderComments(mapped);
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

  if (!data.guestOrder) {
    return null;
  }

  const mapped = mapMagentoOrderDetail(data.guestOrder);
  if (!mapped) {
    return null;
  }

  return enrichTrackedOrderComments(mapped);
}
