import type {
  TrackedOrder,
  TrackedOrderRefundStatus,
  TrackedOrderReturnDetails,
} from "./order-tracking.types";

export type OrderActionPayload = {
  /** Magento order uid (`CustomerOrder.id`), not the increment number. */
  orderId: string;
  reason: string;
  comment?: string;
};

export type OrderActionErrorCode =
  | "ALREADY_CANCELLED"
  | "NOT_CANCELLABLE"
  | "ALREADY_REQUESTED"
  | "NOT_RETURNABLE"
  | "COMMENT_REQUIRED"
  | "UNKNOWN";

export class OrderActionError extends Error {
  public readonly code: OrderActionErrorCode;
  /** Latest server state of the order, when the failure carries one (409 responses). */
  public readonly order?: TrackedOrder | null;

  constructor(message: string, code: OrderActionErrorCode = "UNKNOWN", order?: TrackedOrder | null) {
    super(message);
    this.name = "OrderActionError";
    this.code = code;
    this.order = order;
  }
}

export type OrderActionResult = {
  order: TrackedOrder | null;
  refund: TrackedOrderRefundStatus | null;
  returnDetails: TrackedOrderReturnDetails | null;
};

export type OrderActionReason = {
  code: string;
  label: string;
  requiresComment: boolean;
};

export type OrderActionReasons = {
  cancelReasons: OrderActionReason[];
  returnReasons: OrderActionReason[];
};
