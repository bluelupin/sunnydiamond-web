"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import CopyIcon from "@/assets/Icons/CopyIcon";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { trackOrder } from "@/services/customer/order-tracking.client";
import type { TrackedOrder } from "@/services/customer/order-tracking.types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useToast } from "@/shared/hooks/use-toast";
import { profileTabsContent } from "../data/profileContent";
import { buildProfileOrderDetailHref } from "../utils/profileOrderNavigation";
import type { ProfileOrderUi } from "../types/profileUi.types";
import { resolveProfileOrderTimelineSteps } from "../utils/orderDeliveryTimeline.utils";
import { mapSunnyTrackingToTimeline } from "../utils/orderFlowSteps.mapper";
import { ProfileOrderTrackTimeline } from "./ProfileOrderTrackTimeline";
import { ProfileStatusBadge } from "./profileUi";

type ProfileOrderTrackModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: ProfileOrderUi;
  onTrackedStatusChange?: (status: string) => void;
};

function resolveTrackingId(order: ProfileOrderUi, trackedOrder: TrackedOrder | null): string {
  const shipmentTrackingNumber = trackedOrder?.shipments
    .flatMap((shipment) => shipment.tracking)
    .map((tracking) => tracking.number.trim())
    .find(Boolean);

  return shipmentTrackingNumber ?? order.number;
}

export function ProfileOrderTrackModal({
  open,
  onOpenChange,
  order,
  onTrackedStatusChange,
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

  const onTrackedStatusChangeRef = useRef(onTrackedStatusChange);
  onTrackedStatusChangeRef.current = onTrackedStatusChange;

  useEffect(() => {
    if (!trackedOrder?.status) {
      return;
    }

    onTrackedStatusChangeRef.current?.(trackedOrder.status);
  }, [trackedOrder?.status]);

  const activeStatus = trackedOrder?.status ?? order.status;
  const timelineSteps = useMemo(() => {
    // The freshly tracked order carries the authoritative stepper; the card's mapped
    // timeline stands in until it arrives.
    const trackedSteps = mapSunnyTrackingToTimeline(trackedOrder?.sunnyTracking ?? null);
    const serverSteps =
      trackedSteps.length > 0
        ? trackedSteps
        : order.timelineFromServer
          ? order.timeline
          : null;

    return resolveProfileOrderTimelineSteps(activeStatus, order.timeline, serverSteps);
  }, [activeStatus, order.timeline, order.timelineFromServer, trackedOrder?.sunnyTracking]);
  const trackingId = resolveTrackingId(order, trackedOrder);
  const badgeLabel =
    order.category === "in_progress" ? content.statusInProgress : order.statusLabel;
  const orderDetailsHref = buildProfileOrderDetailHref(order.number);

  const handleCopyTrackingId = async () => {
    try {
      await navigator.clipboard.writeText(trackingId);
      toast({
        title: content.copyOrderIdSuccess,
      });
    } catch {
      toast({
        title: "Unable to copy",
        description: "Please copy the tracking ID manually.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="max-h-[90vh] max-w-[520px] gap-6 overflow-y-auto border-neutral300 bg-white p-6 sm:rounded-none"
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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <ProfileStatusBadge label={badgeLabel} category={order.category} />

            <span className="inline-flex items-center gap-1 font-gill text-base font-light leading-110 text-darkblack">
              {trackDialog.trackingIdLabel}{" "}
              <span className="font-normal">{trackingId}</span>
              <button
                type="button"
                onClick={() => void handleCopyTrackingId()}
                className="text-darkblack"
                aria-label={content.copyOrderIdLabel}
              >
                <CopyIcon className="size-5" />
              </button>
            </span>
          </div>

          {isLoading && timelineSteps.length === 0 ? (
            <div
              className="h-48 animate-pulse bg-gray300"
              aria-busy="true"
              aria-label={trackDialog.loadingLabel}
            />
          ) : null}

          {timelineSteps.length > 0 ? (
            <ProfileOrderTrackTimeline steps={timelineSteps} />
          ) : null}

          {error ? (
            <p className="font-gill text-sm font-light leading-110 text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          {trackedOrder && trackedOrder.shipments.length > 0 ? (
            <div className="border-t border-neutral300 pt-4">
              <h3 className="mb-3 font-gill text-base font-normal leading-110 text-darkblack">
                {trackDialog.shipmentUpdatesTitle}
              </h3>
              <ul className="space-y-3">
                {trackedOrder.shipments.map((shipment) => (
                  <li key={shipment.number}>
                    {shipment.tracking.length > 0 ? (
                      <ul className="space-y-2">
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
                      <p className="font-gill text-sm font-light leading-110 text-neutral500">
                        {trackDialog.trackingPlaceholder}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex justify-end border-t border-neutral300 pt-4">
            <DetailTextLink
              href={orderDetailsHref}
              onClick={() => onOpenChange(false)}
              className="text-sm uppercase"
            >
              {content.viewDetailsLabel}
            </DetailTextLink>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
