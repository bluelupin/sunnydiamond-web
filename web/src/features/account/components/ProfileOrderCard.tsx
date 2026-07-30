"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import CopyIcon from "@/assets/Icons/CopyIcon";
import {
  CartDivider,
} from "@/features/cart/components/CartFlowUi";
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
import {
  getOrderMobileSubtext,
  ProfileOrderMobileThumbnails,
} from "./ProfileOrderMobileThumbnails";
import { ProfileOrderItemRow } from "./ProfileOrderItemRow";
import { ProfileOrderCancelDialog } from "./ProfileOrderCancelDialog";
import { ProfileOrderCancelReasonDialog } from "./ProfileOrderCancelReasonDialog";
import { ProfileOrderCancelSuccessDialog } from "./ProfileOrderCancelSuccessDialog";
import { ProfileOrderTimeline } from "./ProfileOrderTimeline";
import { ProfileOrderTrackModal } from "./ProfileOrderTrackModal";
import { ProfileMetaDivider, ProfileStatusBadge } from "./profileUi";

type ProfileOrderCardProps = {
  order: ProfileOrderUi;
  onViewDetails?: (orderNumber: string) => void;
  resolvedStatus?: string;
};

export function ProfileOrderCard({
  order,
  onViewDetails,
  resolvedStatus,
}: ProfileOrderCardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReasonDialogOpen, setCancelReasonDialogOpen] = useState(false);
  const [cancelSuccessDialogOpen, setCancelSuccessDialogOpen] = useState(false);
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
  const mobileSubtext = getOrderMobileSubtext(order);

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
    setCancelDialogOpen(true);
  };

  const handleContactSupport = () => {
    setCancelDialogOpen(false);
    router.push(content.cancelDialog.contactHref);
  };

  const handleProceedToCancel = () => {
    setCancelDialogOpen(false);
    setCancelReasonDialogOpen(true);
  };

  const handleConfirmCancellation = (_payload: { reason: string; comments: string }) => {
    setCancelReasonDialogOpen(false);
    setCancelSuccessDialogOpen(true);
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
      <div className="flex flex-col gap-4 lg:gap-6">
        <div className="flex flex-col gap-4 lg:gap-6">
          <ProfileStatusBadge label={order.statusLabel} category={order.category} />

          <div className="flex flex-col gap-2 lg:hidden">
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
            {mobileSubtext ? (
              <p className="font-gill text-base font-light leading-110 text-darkblack">{mobileSubtext}</p>
            ) : null}
          </div>

          <div className="hidden items-center justify-between lg:flex">
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
          <>
            <ProfileOrderMobileThumbnails items={order.items} />
            <div className="hidden flex-col gap-4 lg:flex">
              {order.items.map((item) => (
                <ProfileOrderItemRow key={item.id} item={item} />
              ))}
            </div>
          </>
        ) : null}

        {order.showDownloadInvoice && order.category !== "in_progress" ? (
          <div className="hidden justify-end lg:flex">
            <DetailTextLink onClick={handleDownloadInvoice} className="text-sm uppercase">
              {content.downloadInvoiceLabel}
            </DetailTextLink>
          </div>
        ) : null}

        <div className="hidden lg:flex lg:justify-end">
          <DetailTextLink onClick={handleViewDetails} className="text-sm uppercase">
            {content.viewDetailsLabel}
          </DetailTextLink>
        </div>

        <CartDivider className="hidden lg:block" />

        <div className="flex items-center justify-between border-t border-neutral300 pt-4 font-gill text-base leading-110 text-darkblack lg:border-0 lg:pt-0">
          <span className="font-light lg:font-normal">
            <span className="lg:hidden">{content.mobileTotalLabel}</span>
            <span className="hidden lg:inline">{content.totalLabel}</span>
          </span>
          <span className="font-normal">
            {formatOrderTotal(order.grandTotal, order.currency)}
          </span>
        </div>

        <CartDivider className="hidden lg:block" />

        <div className="hidden gap-6 lg:flex">
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

        <div className="flex flex-col gap-4 lg:hidden">
          {order.showTrack ? (
            <DetailOutlineButton
              type="button"
              className="w-full"
              onClick={handleTrackOrder}
            >
              {content.trackOrderLabel}
            </DetailOutlineButton>
          ) : null}

          {order.showReturn ? (
            <DetailOutlineButton type="button" className="w-full" onClick={handleReturn}>
              {content.returnOrderLabel}
            </DetailOutlineButton>
          ) : null}

          <DetailOutlineButton type="button" className="w-full" onClick={handleViewDetails}>
            {content.viewDetailsLabel}
          </DetailOutlineButton>
        </div>

        {order.footnote ? (
          <div className="hidden items-center gap-2 font-gill text-base font-light leading-110 text-darkblack lg:flex">
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

    <ProfileOrderCancelDialog
      open={cancelDialogOpen}
      onOpenChange={setCancelDialogOpen}
      onContactSupport={handleContactSupport}
      onProceedToCancel={handleProceedToCancel}
    />

    <ProfileOrderCancelReasonDialog
      open={cancelReasonDialogOpen}
      onOpenChange={setCancelReasonDialogOpen}
      onConfirm={handleConfirmCancellation}
    />

    <ProfileOrderCancelSuccessDialog
      open={cancelSuccessDialogOpen}
      onOpenChange={setCancelSuccessDialogOpen}
      orderNumber={order.number}
    />
    </>
  );
}
