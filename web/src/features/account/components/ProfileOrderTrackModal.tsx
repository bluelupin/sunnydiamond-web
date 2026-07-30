"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, X } from "lucide-react";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import {
  getTrackedOrderStatusMessage,
} from "@/features/order-tracking/utils/orderStatus";
import { trackOrder } from "@/services/customer/order-tracking.client";
import type { TrackedOrder } from "@/services/customer/order-tracking.types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useToast } from "@/shared/hooks/use-toast";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileOrderUi } from "../types/profileUi.types";
import { formatOrderDate } from "../utils/formatAccountData";
import {
  formatOrderStatusLabel,
  resolveProfileOrderTimelineSteps,
} from "../utils/orderDeliveryTimeline.utils";
import { ProfileOrderTimeline } from "./ProfileOrderTimeline";
import { ProfileMetaDivider, ProfileStatusBadge } from "./profileUi";

type ProfileOrderTrackModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: ProfileOrderUi;
};

export function ProfileOrderTrackModal({
  open,
  onOpenChange,
  order,
}: ProfileOrderTrackModalProps) {
  const { toast } = useToast();
  const content = profileTabsContent.orders;
  const trackDialog = content.trackDialog;

  const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setError(null);
      setTrackedOrder(null);

      try {
        const result = await trackOrder(order.number, undefined, controller.signal);
        if (!cancelled) {
          setTrackedOrder(result);
        }
      } catch (loadError) {
        if (!cancelled && !(loadError instanceof DOMException && loadError.name === "AbortError")) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load tracking details");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [open, order.number]);

  const activeStatus = trackedOrder?.status ?? order.status;
  const statusLabel = formatOrderStatusLabel(activeStatus) || order.statusLabel;
  const timelineSteps = useMemo(
    () => resolveProfileOrderTimelineSteps(activeStatus, order.timeline),
    [activeStatus, order.timeline],
  );
  const statusMessage = getTrackedOrderStatusMessage(activeStatus);
  const orderDetailsHref = `/profile/orders/${encodeURIComponent(order.number)}`;

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(order.number);
      toast({
        title: content.copyOrderIdSuccess,
      });
    } catch {
      toast({
        title: "Unable to copy",
        description: "Please copy the order ID manually.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="max-h-[90vh] max-w-[720px] gap-6 overflow-y-auto border-neutral300 bg-white p-6 sm:rounded-none"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="font-larken text-32 font-light leading-110 text-darkblack">
              {trackDialog.title}
            </DialogTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-darkblack"
              aria-label="Close"
            >
              <X className="size-6" strokeWidth={1.5} aria-hidden />
            </button>
          </div>
          <div className="h-px w-full bg-neutral300" aria-hidden />
        </div>

        <div className="flex flex-col gap-6">
          <ProfileStatusBadge label={statusLabel} category={order.category} />

          <div className="flex flex-col gap-2 font-gill text-base leading-110 text-darkblack">
            <span className="inline-flex items-center gap-1 font-light">
              {content.orderIdLabel}{" "}
              <span className="font-normal">{order.number}</span>
              <button
                type="button"
                onClick={() => void handleCopyOrderId()}
                className="text-darkblack"
                aria-label={content.copyOrderIdLabel}
              >
                <Copy className="size-5" strokeWidth={1.5} aria-hidden />
              </button>
            </span>

            <div className="flex flex-wrap items-center gap-4">
              <span className="font-light">
                {content.placedOnLabel}{" "}
                <span className="font-normal">{formatOrderDate(order.orderDate)}</span>
              </span>
              {order.deliveryBy ? (
                <>
                  <ProfileMetaDivider className="hidden h-4 sm:inline-flex" />
                  <span className="font-light">
                    {content.deliveryByLabel}{" "}
                    <span className="font-normal">{formatOrderDate(order.deliveryBy)}</span>
                  </span>
                </>
              ) : null}
            </div>
          </div>

          {timelineSteps.length > 0 ? (
            <ProfileOrderTimeline
              estimatedLabel={order.estimatedDeliveryLabel}
              estimatedValue={order.estimatedDeliveryValue}
              steps={timelineSteps}
              className="border border-neutral300"
            />
          ) : null}

          {isLoading ? (
            <div
              className="h-20 animate-pulse bg-gray300"
              aria-busy="true"
              aria-label={trackDialog.loadingLabel}
            />
          ) : null}

          {error ? (
            <p className="font-gill text-sm font-light leading-110 text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          {!isLoading && !error ? (
            <p className="font-gill text-base font-light leading-110 text-neutral500">
              {statusMessage}
            </p>
          ) : null}

          {trackedOrder && trackedOrder.shipments.length > 0 ? (
            <div className="border border-neutral300 bg-white p-6">
              <h3 className="mb-4 font-gill text-xl font-normal leading-110 text-darkblack">
                {trackDialog.shipmentUpdatesTitle}
              </h3>
              <ul className="space-y-4">
                {trackedOrder.shipments.map((shipment) => (
                  <li key={shipment.number} className="bg-gray300 p-4">
                    <p className="font-gill text-base font-normal leading-110 text-darkblack">
                      Shipment #{shipment.number}
                    </p>
                    {shipment.tracking.length > 0 ? (
                      <ul className="mt-3 space-y-2">
                        {shipment.tracking.map((tracking) => (
                          <li
                            key={`${shipment.number}-${tracking.number}-${tracking.title}`}
                            className="font-gill text-sm font-light leading-110 text-neutral500"
                          >
                            {tracking.title}
                            {tracking.carrier ? ` · ${tracking.carrier}` : ""}
                            {tracking.number ? ` · ${tracking.number}` : ""}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 font-gill text-sm font-light leading-110 text-neutral500">
                        {trackDialog.trackingPlaceholder}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex justify-end border-t border-neutral300 pt-4">
            <DetailTextLink href={orderDetailsHref} className="text-sm uppercase">
              {content.viewDetailsLabel}
            </DetailTextLink>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
