"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import CopyIcon from "@/assets/Icons/CopyIcon";
import { CartDivider } from "@/features/cart/components/CartFlowUi";
import {
  DetailDarkButton,
  DetailOutlineButton,
  DetailTextLink,
} from "@/features/products/components/detail/shared";
import type { TrackedOrder } from "@/services/customer/order-tracking.types";
import { useToast } from "@/shared/hooks/use-toast";
import { cn } from "@/shared/utils/cn";
import { profileTabsContent } from "../data/profileContent";
import { useOrderActionReasons } from "../hooks/useOrderActionReasons";
import { useOrderActions } from "../hooks/useOrderActions";
import { useOrderInvoiceDownload } from "../hooks/useOrderInvoiceDownload";
import type { ProfileOrderUi } from "../types/profileUi.types";
import { formatOrderDate, formatOrderTotal } from "../utils/formatAccountData";
import { resolveProfileOrderTimelineSteps } from "../utils/orderDeliveryTimeline.utils";
import { formatRefundNote } from "../utils/profileDisplayMappers";
import { ProfileOrderMobileThumbnails } from "./ProfileOrderMobileThumbnails";
import { ProfileOrderItemRow } from "./ProfileOrderItemRow";
import { ProfileOrderCancelDialog } from "./ProfileOrderCancelDialog";
import { ProfileOrderCancelReasonDialog } from "./ProfileOrderCancelReasonDialog";
import { ProfileOrderCancelSuccessDialog } from "./ProfileOrderCancelSuccessDialog";
import { ProfileOrderReturnDialog } from "./ProfileOrderReturnDialog";
import { ProfileOrderReturnReasonDialog } from "./ProfileOrderReturnReasonDialog";
import { ProfileOrderReturnSuccessDialog } from "./ProfileOrderReturnSuccessDialog";
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
  onOrderChanged?: (order: TrackedOrder) => void;
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
  onOrderChanged,
}: ProfileOrderCardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReasonDialogOpen, setCancelReasonDialogOpen] = useState(false);
  const [cancelSuccessDialogOpen, setCancelSuccessDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [returnReasonDialogOpen, setReturnReasonDialogOpen] = useState(false);
  const [returnSuccessDialogOpen, setReturnSuccessDialogOpen] = useState(false);
  const [refundNote, setRefundNote] = useState<string | undefined>(undefined);
  const [changedOrder, setChangedOrder] = useState<TrackedOrder | null>(null);
  const [localResolvedStatus, setLocalResolvedStatus] = useState<string | null>(null);
  const content = profileTabsContent.orders;
  const { cancelReasons, returnReasons } = useOrderActionReasons();
  const { isSubmitting, error, clearError, cancelOrder, returnOrder } = useOrderActions();
  const { download, downloadingNumber } = useOrderInvoiceDownload();
  const isDownloadingInvoice = downloadingNumber === order.number;
  const invoiceDisabled = Boolean(order.invoiceDisabled) || isDownloadingInvoice;

  useEffect(() => {
    setLocalResolvedStatus(null);
  }, [order.id, order.status]);

  const timelineSteps = useMemo(
    () =>
      resolveProfileOrderTimelineSteps(
        resolvedStatus ?? localResolvedStatus ?? order.status,
        order.timeline,
        order.timelineFromServer ? order.timeline : null,
      ),
    [
      resolvedStatus,
      localResolvedStatus,
      order.status,
      order.timeline,
      order.timelineFromServer,
    ],
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
    void download(order.number);
  };

  const handleReturnOrder = () => {
    clearError();
    setReturnDialogOpen(true);
  };

  const handleCancelOrder = () => {
    clearError();
    setCancelDialogOpen(true);
  };

  const handleContactSupport = () => {
    setCancelDialogOpen(false);
    setReturnDialogOpen(false);
    router.push(content.cancelDialog.contactHref);
  };

  const handleProceedToCancel = () => {
    setCancelDialogOpen(false);
    setCancelReasonDialogOpen(true);
  };

  const handleProceedToReturn = () => {
    setReturnDialogOpen(false);
    setReturnReasonDialogOpen(true);
  };

  const handleConfirmCancellation = async (payload: { reason: string; comments: string }) => {
    try {
      const freshOrder = await cancelOrder(order.number, {
        orderId: order.id,
        reason: payload.reason,
        ...(payload.comments ? { comment: payload.comments } : {}),
      });

      setRefundNote(formatRefundNote(freshOrder?.sunnyRefund));
      setChangedOrder(freshOrder);
      setCancelReasonDialogOpen(false);
      setCancelSuccessDialogOpen(true);
    } catch {
      // `useOrderActions` keeps the message; the reason dialog renders it.
    }
  };

  const handleConfirmReturn = async (payload: { reason: string; comments: string }) => {
    try {
      const freshOrder = await returnOrder(order.number, {
        orderId: order.id,
        reason: payload.reason,
        ...(payload.comments ? { comment: payload.comments } : {}),
      });

      setRefundNote(formatRefundNote(freshOrder?.sunnyRefund));
      setChangedOrder(freshOrder);
      setReturnReasonDialogOpen(false);
      setReturnSuccessDialogOpen(true);
    } catch {
      // `useOrderActions` keeps the message; the reason dialog renders it.
    }
  };

  // The list drops this card the moment the order changes tab, so the mutated order is
  // handed over once the success dialog is dismissed.
  const handleSuccessDialogChange = (
    setOpen: (open: boolean) => void,
    open: boolean,
  ) => {
    setOpen(open);

    if (!open && changedOrder) {
      onOrderChanged?.(changedOrder);
      setChangedOrder(null);
    }
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
                subState={order.subState}
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

          {order.showContactUs ? (
            <DetailDarkButton type="button" className="w-full" onClick={handleContactSupport}>
              {content.contactUsLabel}
            </DetailDarkButton>
          ) : null}
        </div>

        <div className="hidden flex-col gap-6 lg:flex">
          <div className="flex flex-col gap-6">
            <ProfileStatusBadge
              label={order.statusLabel}
              category={order.category}
              subState={order.subState}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 font-gill text-base leading-110 text-darkblack">
                <span className="inline-flex items-center gap-1 font-light text-darkblack">
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
              <DetailTextLink
                onClick={invoiceDisabled ? undefined : handleDownloadInvoice}
                className={cn(
                  "text-sm uppercase",
                  invoiceDisabled && "pointer-events-none opacity-50",
                )}
              >
                {isDownloadingInvoice
                  ? content.downloadingInvoiceLabel
                  : content.downloadInvoiceLabel}
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
              <DetailOutlineButton type="button" className="flex-1" onClick={handleReturnOrder}>
                {content.returnOrderLabel}
              </DetailOutlineButton>
            ) : null}

            {order.showContactUs ? (
              <DetailDarkButton type="button" className="flex-1" onClick={handleContactSupport}>
                {content.contactUsLabel}
              </DetailDarkButton>
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

      <ProfileOrderCancelDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onContactSupport={handleContactSupport}
        onProceedToCancel={handleProceedToCancel}
      />

      <ProfileOrderCancelReasonDialog
        open={cancelReasonDialogOpen}
        onOpenChange={setCancelReasonDialogOpen}
        onConfirm={(payload) => void handleConfirmCancellation(payload)}
        reasons={cancelReasons}
        isSubmitting={isSubmitting}
        errorMessage={error}
      />

      <ProfileOrderCancelSuccessDialog
        open={cancelSuccessDialogOpen}
        onOpenChange={(open) => handleSuccessDialogChange(setCancelSuccessDialogOpen, open)}
        orderNumber={order.number}
        refundNote={refundNote}
      />

      <ProfileOrderReturnDialog
        open={returnDialogOpen}
        onOpenChange={setReturnDialogOpen}
        onContactSupport={handleContactSupport}
        onProceedToReturn={handleProceedToReturn}
      />

      <ProfileOrderReturnReasonDialog
        open={returnReasonDialogOpen}
        onOpenChange={setReturnReasonDialogOpen}
        onConfirm={(payload) => void handleConfirmReturn(payload)}
        reasons={returnReasons}
        isSubmitting={isSubmitting}
        errorMessage={error}
      />

      <ProfileOrderReturnSuccessDialog
        open={returnSuccessDialogOpen}
        onOpenChange={(open) => handleSuccessDialogChange(setReturnSuccessDialogOpen, open)}
        orderNumber={order.number}
        refundNote={refundNote}
      />
    </>
  );
}
