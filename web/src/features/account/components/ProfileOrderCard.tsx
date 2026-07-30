"use client";

import { useEffect, useMemo, useState } from "react";
import { Info } from "lucide-react";
import CopyIcon from "@/assets/Icons/CopyIcon";
import { CartDivider } from "@/features/cart/components/CartFlowUi";
import {
  DetailDarkButton,
  DetailOutlineButton,
  DetailTextLink,
} from "@/features/products/components/detail/shared";
import { useToast } from "@/shared/hooks/use-toast";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileOrderUi } from "../types/profileUi.types";
import { formatOrderDate, formatOrderTotal } from "../utils/formatAccountData";
import { resolveProfileOrderTimelineSteps } from "../utils/orderDeliveryTimeline.utils";
import { ProfileOrderMobileThumbnails } from "./ProfileOrderMobileThumbnails";
import { ProfileOrderItemRow } from "./ProfileOrderItemRow";
import { ProfileOrderTimeline } from "./ProfileOrderTimeline";
import { ProfileOrderTrackModal } from "./ProfileOrderTrackModal";
import {
  ProfileMetaDivider,
  ProfileOrderCardDivider,
  ProfileOrderMobileStatusBadge,
  ProfileStatusBadge,
} from "./profileUi";

type ProfileOrderCardProps = {
  order: ProfileOrderUi;
  onViewDetails?: (orderNumber: string) => void;
  resolvedStatus?: string;
};

function getMobileDeliveryMeta(order: ProfileOrderUi) {
  const content = profileTabsContent.orders.mobileMeta;

  if (order.category === "in_progress" && order.estimatedDeliveryValue) {
    return {
      label: content.estimatedDelivery,
      value: order.estimatedDeliveryValue,
    };
  }

  if (order.category === "delivered" && order.deliveryBy) {
    return {
      label: content.deliveredOn,
      value: formatOrderDate(order.deliveryBy),
    };
  }

  if (order.category === "returned") {
    return {
      label: content.refundTimeline,
      value: content.refundTimelineValue,
    };
  }

  if (order.category === "cancelled" && order.deliveryBy) {
    return {
      label: content.deliveredOn,
      value: formatOrderDate(order.deliveryBy),
    };
  }

  return null;
}

export function ProfileOrderCard({
  order,
  onViewDetails,
  resolvedStatus,
}: ProfileOrderCardProps) {
  const { toast } = useToast();
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [localResolvedStatus, setLocalResolvedStatus] = useState<string | null>(null);
  const content = profileTabsContent.orders;

  useEffect(() => {
    setLocalResolvedStatus(null);
  }, [order.id, order.status]);

  const timelineSteps = useMemo(
    () =>
      resolveProfileOrderTimelineSteps(
        resolvedStatus ?? localResolvedStatus ?? order.status,
        order.timeline,
      ),
    [resolvedStatus, localResolvedStatus, order.status, order.timeline],
  );

  const mobileDeliveryMeta = getMobileDeliveryMeta(order);
  const mobileStatusLabel =
    order.category === "in_progress" ? content.statusInProgress : order.statusLabel;

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

  const handleDownloadInvoice = () => {
    toast({
      title: content.invoiceUnavailableTitle,
      description: content.invoiceUnavailableDescription,
    });
  };

  const handleReturn = () => {
    toast({
      title: content.returnOrderLabel,
      description: "Returns will be available soon. Contact support for assistance.",
    });
  };

  const handleCancelOrder = () => {
    toast({
      title: content.cancelOrderLabel,
      description: "Order cancellation will be available soon. Contact support for assistance.",
    });
  };

  const handleTrackOrder = () => {
    setTrackModalOpen(true);
  };

  const handleViewDetails = () => {
    onViewDetails?.(order.number);
  };

  return (
    <>
      <article className="bg-gray300 p-4 lg:p-6">
        <div className="flex flex-col gap-6 lg:hidden">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <ProfileOrderMobileStatusBadge
                label={mobileStatusLabel}
                category={order.category}
              />

              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center gap-1 font-gill text-base font-light leading-110 text-darkblack">
                  {content.orderIdLabel}{" "}
                  <span className="font-normal">{order.number}</span>
                  <button
                    type="button"
                    onClick={() => void handleCopyOrderId()}
                    className="text-darkblack"
                    aria-label={content.copyOrderIdLabel}
                  >
                    <CopyIcon className="size-5" />
                  </button>
                </span>

                {mobileDeliveryMeta ? (
                  <p className="font-gill text-base font-light leading-110 text-darkblack">
                    {mobileDeliveryMeta.label}{" "}
                    <span className="font-normal">{mobileDeliveryMeta.value}</span>
                  </p>
                ) : null}
              </div>
            </div>

            {order.items.length > 0 ? (
              <>
                <ProfileOrderCardDivider />
                <ProfileOrderMobileThumbnails items={order.items} />
              </>
            ) : null}

            <ProfileOrderCardDivider />

            <div className="flex items-center justify-between font-gill text-base font-normal leading-110 text-darkblack">
              <span>{content.mobileTotalLabel}</span>
              <span>{formatOrderTotal(order.grandTotal, order.currency)}</span>
            </div>
          </div>

          <DetailDarkButton type="button" className="w-full" onClick={handleViewDetails}>
            {content.viewDetailsLabel}
          </DetailDarkButton>
        </div>

        <div className="hidden flex-col gap-6 lg:flex">
          <div className="flex flex-col gap-6">
            <ProfileStatusBadge label={order.statusLabel} category={order.category} />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 font-gill text-base leading-110 text-darkblack">
                <span className="inline-flex items-center gap-1 font-light">
                  {content.orderIdLabel}{" "}
                  <span className="font-normal">{order.number}</span>
                  <button
                    type="button"
                    onClick={() => void handleCopyOrderId()}
                    className="text-darkblack"
                    aria-label={content.copyOrderIdLabel}
                  >
                    <CopyIcon className="size-5" />
                  </button>
                </span>
                <ProfileMetaDivider className="h-4 self-center" />
                <span className="font-light">
                  {content.placedOnLabel}{" "}
                  <span className="font-normal">{formatOrderDate(order.orderDate)}</span>
                </span>
              </div>

              {order.deliveryBy ? (
                <span className="font-gill text-base leading-110 text-darkblack">
                  <span className="font-light">{content.deliveryByLabel} </span>
                  <span className="font-normal">{formatOrderDate(order.deliveryBy)}</span>
                </span>
              ) : null}
            </div>
          </div>

          {timelineSteps.length > 0 ? (
            <ProfileOrderTimeline
              estimatedLabel={order.estimatedDeliveryLabel}
              estimatedValue={order.estimatedDeliveryValue}
              steps={timelineSteps}
            />
          ) : null}

          {order.items.length > 0 ? (
            <div className="flex flex-col gap-4">
              {order.items.map((item) => (
                <ProfileOrderItemRow key={item.id} item={item} />
              ))}
            </div>
          ) : null}

          {order.showDownloadInvoice && order.category !== "in_progress" ? (
            <div className="flex justify-end">
              <DetailTextLink onClick={handleDownloadInvoice} className="text-sm uppercase">
                {content.downloadInvoiceLabel}
              </DetailTextLink>
            </div>
          ) : null}

          <div className="flex justify-end">
            <DetailTextLink onClick={handleViewDetails} className="text-sm uppercase">
              {content.viewDetailsLabel}
            </DetailTextLink>
          </div>

          <CartDivider />

          <div className="flex items-center justify-between font-gill text-base font-normal leading-110 text-darkblack">
            <span>{content.totalLabel}</span>
            <span>{formatOrderTotal(order.grandTotal, order.currency)}</span>
          </div>

          <CartDivider />

          <div className="flex gap-6">
            {order.showCancel ? (
              <DetailOutlineButton type="button" className="flex-1" onClick={handleCancelOrder}>
                {content.cancelOrderLabel}
              </DetailOutlineButton>
            ) : null}

            {order.showTrack ? (
              <DetailDarkButton type="button" className="flex-1" onClick={handleTrackOrder}>
                {content.trackOrderLabel}
              </DetailDarkButton>
            ) : null}

            {order.showReturn ? (
              <DetailOutlineButton type="button" className="flex-1" onClick={handleReturn}>
                {content.returnOrderLabel}
              </DetailOutlineButton>
            ) : null}
          </div>

          {order.footnote ? (
            <div className="flex items-center gap-2 font-gill text-base font-light leading-110 text-darkblack">
              <Info className="size-6 shrink-0" strokeWidth={1.5} aria-hidden />
              <p>{order.footnote}</p>
            </div>
          ) : null}
        </div>
      </article>

      <ProfileOrderTrackModal
        open={trackModalOpen}
        onOpenChange={setTrackModalOpen}
        order={order}
        onTrackedStatusChange={setLocalResolvedStatus}
      />
    </>
  );
}
