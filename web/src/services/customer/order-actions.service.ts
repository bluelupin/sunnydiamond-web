import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";
import {
  SUNNY_CANCEL_ORDER_MUTATION,
  SUNNY_INVOICE_PDF_QUERY,
  SUNNY_ORDER_REASONS_QUERY,
  SUNNY_REQUEST_RETURN_MUTATION,
} from "./customer.gql";
import {
  mapMagentoOrderDetail,
  mapSunnyRefundStatus,
  mapSunnyReturnDetails,
  type MagentoCustomerOrderDetail,
  type MagentoSunnyRefundStatus,
  type MagentoSunnyReturnDetails,
} from "./order-tracking.mapper";
import { enrichTrackedOrderComments } from "./order-tracking.service";
import {
  OrderActionError,
  type OrderActionErrorCode,
  type OrderActionPayload,
  type OrderActionReasons,
  type OrderActionResult,
} from "./order-actions.types";

type SunnyCancelOrderResponse = {
  sunnyCancelOrder?: {
    order?: MagentoCustomerOrderDetail | null;
    refund?: MagentoSunnyRefundStatus | null;
  } | null;
};

type SunnyRequestReturnResponse = {
  requestSunnyOrderReturn?: {
    order?: MagentoCustomerOrderDetail | null;
    return_details?: MagentoSunnyReturnDetails | null;
    refund?: MagentoSunnyRefundStatus | null;
  } | null;
};

type MagentoOrderReason = {
  code?: string | null;
  label?: string | null;
  requires_comment?: boolean | null;
};

type SunnyOrderReasonsResponse = {
  sunnyOrderCancellationReasons?: MagentoOrderReason[] | null;
  sunnyOrderReturnReasons?: MagentoOrderReason[] | null;
};

type SunnyInvoicePdfResponse = {
  sunnyInvoicePdf?: {
    url?: string | null;
    expires_at?: string | null;
  } | null;
};

/** `extensions.category` values raised by SunnyDiamonds_OrderFlow. */
const ERROR_CODE_BY_CATEGORY: Record<string, OrderActionErrorCode> = {
  ALREADY_CANCELLED: "ALREADY_CANCELLED",
  NOT_CANCELLABLE: "NOT_CANCELLABLE",
  RETURN_ALREADY_REQUESTED: "ALREADY_REQUESTED",
  RETURN_WINDOW_EXPIRED: "NOT_RETURNABLE",
  COMMENT_REQUIRED: "COMMENT_REQUIRED",
};

function toOrderActionError(error: unknown, fallbackMessage: string): OrderActionError {
  if (error instanceof MagentoGraphqlError) {
    const category = error.errors[0]?.extensions?.category ?? "";
    return new OrderActionError(error.message, ERROR_CODE_BY_CATEGORY[category] ?? "UNKNOWN");
  }

  const message = error instanceof Error ? error.message : fallbackMessage;
  return new OrderActionError(message);
}

async function mapOrderActionOrder(
  order: MagentoCustomerOrderDetail | null | undefined,
): Promise<OrderActionResult["order"]> {
  const mapped = order ? mapMagentoOrderDetail(order) : null;
  return mapped ? enrichTrackedOrderComments(mapped) : null;
}

export async function cancelCustomerOrder(
  authToken: string,
  payload: OrderActionPayload,
): Promise<OrderActionResult> {
  let data: SunnyCancelOrderResponse;

  try {
    data = await magentoGraphqlFetch<SunnyCancelOrderResponse>({
      query: SUNNY_CANCEL_ORDER_MUTATION,
      variables: {
        input: {
          order_uid: payload.orderId,
          reason: payload.reason,
          ...(payload.comment ? { comment: payload.comment } : {}),
        },
      },
      authToken,
    });
  } catch (error) {
    throw toOrderActionError(error, "Unable to cancel this order");
  }

  return {
    order: await mapOrderActionOrder(data.sunnyCancelOrder?.order),
    refund: mapSunnyRefundStatus(data.sunnyCancelOrder?.refund),
    returnDetails: null,
  };
}

export async function requestCustomerOrderReturn(
  authToken: string,
  payload: OrderActionPayload,
): Promise<OrderActionResult> {
  let data: SunnyRequestReturnResponse;

  try {
    data = await magentoGraphqlFetch<SunnyRequestReturnResponse>({
      query: SUNNY_REQUEST_RETURN_MUTATION,
      variables: {
        input: {
          order_uid: payload.orderId,
          reason: payload.reason,
          ...(payload.comment ? { comment: payload.comment } : {}),
        },
      },
      authToken,
    });
  } catch (error) {
    throw toOrderActionError(error, "Unable to request a return for this order");
  }

  return {
    order: await mapOrderActionOrder(data.requestSunnyOrderReturn?.order),
    refund: mapSunnyRefundStatus(data.requestSunnyOrderReturn?.refund),
    returnDetails: mapSunnyReturnDetails(data.requestSunnyOrderReturn?.return_details),
  };
}

function mapOrderActionReasons(reasons: MagentoOrderReason[] | null | undefined) {
  return (reasons ?? [])
    .filter((reason) => reason.code?.trim() && reason.label?.trim())
    .map((reason) => ({
      code: reason.code!.trim(),
      label: reason.label!.trim(),
      requiresComment: Boolean(reason.requires_comment),
    }));
}

/** Reason lists are admin config, identical for every customer — no auth token needed. */
export async function fetchOrderActionReasons(): Promise<OrderActionReasons> {
  const data = await magentoGraphqlFetch<SunnyOrderReasonsResponse>({
    query: SUNNY_ORDER_REASONS_QUERY,
  });

  return {
    cancelReasons: mapOrderActionReasons(data.sunnyOrderCancellationReasons),
    returnReasons: mapOrderActionReasons(data.sunnyOrderReturnReasons),
  };
}

/** Returns null when Magento has no invoice for the order (resolver errors in that case). */
export async function fetchOrderInvoiceUrl(
  authToken: string,
  orderUid: string,
): Promise<{ url: string; expiresAt: string } | null> {
  let data: SunnyInvoicePdfResponse;

  try {
    data = await magentoGraphqlFetch<SunnyInvoicePdfResponse>({
      query: SUNNY_INVOICE_PDF_QUERY,
      variables: { orderUid },
      authToken,
    });
  } catch (error) {
    if (error instanceof MagentoGraphqlError) {
      return null;
    }

    throw error;
  }

  const url = data.sunnyInvoicePdf?.url?.trim();

  if (!url) {
    return null;
  }

  return { url, expiresAt: data.sunnyInvoicePdf?.expires_at ?? "" };
}
