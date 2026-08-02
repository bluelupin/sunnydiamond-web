"use client";

import { useEffect, useState } from "react";
import { getOrderActionReasons } from "@/services/customer/order-actions.client";
import type {
  OrderActionReason,
  OrderActionReasons,
} from "@/services/customer/order-actions.types";
import { profileTabsContent } from "../data/profileContent";

const ordersContent = profileTabsContent.orders;

/** Reason lists are admin config, identical for everyone — fetched once per page load. */
let reasonsRequest: Promise<OrderActionReasons> | null = null;

function toFallbackReasons(labels: readonly string[]): OrderActionReason[] {
  return labels.map((label) => ({
    code: label,
    label,
    requiresComment: label.trim().toLowerCase() === "other",
  }));
}

const FALLBACK_CANCEL_REASONS = toFallbackReasons(ordersContent.cancelReasonDialog.reasons);
const FALLBACK_RETURN_REASONS = toFallbackReasons(ordersContent.returnReasonDialog.reasons);

type UseOrderActionReasonsResult = OrderActionReasons & {
  isLoading: boolean;
};

export function useOrderActionReasons(): UseOrderActionReasonsResult {
  const [reasons, setReasons] = useState<OrderActionReasons | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // No abort signal: the request is shared, aborting it would break other consumers.
    reasonsRequest ??= getOrderActionReasons();

    void reasonsRequest
      .then((result) => {
        if (!cancelled) {
          setReasons(result);
        }
      })
      .catch(() => {
        reasonsRequest = null;
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    cancelReasons: reasons?.cancelReasons.length
      ? reasons.cancelReasons
      : FALLBACK_CANCEL_REASONS,
    returnReasons: reasons?.returnReasons.length
      ? reasons.returnReasons
      : FALLBACK_RETURN_REASONS,
    isLoading,
  };
}
