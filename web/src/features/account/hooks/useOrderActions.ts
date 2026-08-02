"use client";

import { useCallback, useState } from "react";
import {
  cancelOrder as postCancelOrder,
  requestOrderReturn,
} from "@/services/customer/order-actions.client";
import type { OrderActionPayload } from "@/services/customer/order-actions.types";
import type { TrackedOrder } from "@/services/customer/order-tracking.types";

type OrderAction = (
  orderNumber: string,
  payload: OrderActionPayload,
) => Promise<TrackedOrder | null>;

type UseOrderActionsResult = {
  isSubmitting: boolean;
  error: string | null;
  clearError: () => void;
  cancelOrder: OrderAction;
  returnOrder: OrderAction;
};

export function useOrderActions(): UseOrderActionsResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Callers still need the failure (error codes drive dialog copy), so rethrow.
  const runAction = useCallback(
    async (
      action: OrderAction,
      orderNumber: string,
      payload: OrderActionPayload,
      fallbackMessage: string,
    ) => {
      setIsSubmitting(true);
      setError(null);

      try {
        return await action(orderNumber, payload);
      } catch (actionError) {
        setError(actionError instanceof Error ? actionError.message : fallbackMessage);
        throw actionError;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const cancelOrder = useCallback<OrderAction>(
    (orderNumber, payload) =>
      runAction(postCancelOrder, orderNumber, payload, "Failed to cancel order"),
    [runAction],
  );

  const returnOrder = useCallback<OrderAction>(
    (orderNumber, payload) =>
      runAction(requestOrderReturn, orderNumber, payload, "Failed to request return"),
    [runAction],
  );

  return { isSubmitting, error, clearError, cancelOrder, returnOrder };
}
