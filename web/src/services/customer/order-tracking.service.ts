import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import {
  fetchStorefrontLineMetadataComments,
  isStorefrontLineMetadataComment,
} from "@/services/magento/orders/orderLineMetadata.service";
import {
  MAGENTO_CUSTOMER_ORDER_BY_NUMBER_QUERY,
  MAGENTO_GUEST_ORDER_QUERY,
} from "./customer.gql";
import {
  dedupeTrackedOrderComments,
  mapMagentoOrderDetail,
  normalizeOrderCommentKey,
  type MagentoCustomerOrderByNumberResponse,
  type MagentoGuestOrderResponse,
} from "./order-tracking.mapper";
import type { GuestOrderLookupInput, TrackedOrder, TrackedOrderComment } from "./order-tracking.types";

export async function enrichTrackedOrderComments(order: TrackedOrder): Promise<TrackedOrder> {
  const comments = dedupeTrackedOrderComments(order.comments);

  const hasStorefrontMetadata = comments.some((comment) =>
    isStorefrontLineMetadataComment(comment.message),
  );

  if (hasStorefrontMetadata) {
    return comments.length === order.comments.length ? order : { ...order, comments };
  }

  const storefrontComments = await fetchStorefrontLineMetadataComments(order.number);
  if (storefrontComments.length === 0) {
    return comments.length === order.comments.length ? order : { ...order, comments };
  }

  const existingMessages = new Set(comments.map((comment) => normalizeOrderCommentKey(comment.message)));
  const additional: TrackedOrderComment[] = storefrontComments
    .filter((message) => {
      const key = normalizeOrderCommentKey(message);
      return key && !existingMessages.has(key);
    })
    .map((message) => ({ message: message.trim(), timestamp: null }));

  if (additional.length === 0) {
    return comments.length === order.comments.length ? order : { ...order, comments };
  }

  return {
    ...order,
    comments: dedupeTrackedOrderComments([...comments, ...additional]),
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
