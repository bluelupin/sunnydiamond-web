"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronUp, Info } from "lucide-react";
import CopyIcon from "@/assets/Icons/CopyIcon";
import {
  DetailDarkButton,
  DetailOutlineButton,
} from "@/features/products/components/detail/shared";
import { useToast } from "@/shared/hooks/use-toast";
import { cn } from "@/shared/utils/cn";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileOrderDetailUi } from "../types/profileUi.types";
import { formatAddressLines, formatOrderDate, formatOrderTotal } from "../utils/formatAccountData";
import { resolveProfileOrderTimelineSteps } from "../utils/orderDeliveryTimeline.utils";
import { ProfileOrderDetailItemCard } from "./ProfileOrderDetailItemCard";
import { ProfileOrderCancelDialog } from "./ProfileOrderCancelDialog";
import { ProfileOrderCancelReasonDialog } from "./ProfileOrderCancelReasonDialog";
import { ProfileOrderCancelSuccessDialog } from "./ProfileOrderCancelSuccessDialog";
import { ProfileOrderTimeline } from "./ProfileOrderTimeline";
import { ProfileMetaDivider } from "./profileUi";

type ProfileOrderDetailViewProps = {
  order: ProfileOrderDetailUi;
  onBack: () => void;
};

export function ProfileOrderDetailView({ order, onBack }: ProfileOrderDetailViewProps) {
  const { toast } = useToast();
  const router = useRouter();
  const content = profileTabsContent.orders;
  const detailContent = content.detail;
  const [totalsExpanded, setTotalsExpanded] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReasonDialogOpen, setCancelReasonDialogOpen] = useState(false);
  const [cancelSuccessDialogOpen, setCancelSuccessDialogOpen] = useState(false);

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(order.number);
      toast({ title: content.copyOrderIdSuccess });
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

  const { priceBreakdown } = order;
  const hasDiscount = priceBreakdown.orderDiscount > 0;
  const timelineSteps = useMemo(
    () => resolveProfileOrderTimelineSteps(order.status, order.timeline),
    [order.status, order.timeline],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-darkblack"
          aria-label={detailContent.backLabel}
        >
          <ChevronLeft className="size-6 shrink-0" strokeWidth={1.5} aria-hidden />
        </button>
        <h1 className="font-larken text-32 font-light leading-110 text-darkblack">
          {detailContent.pageTitle}
        </h1>
      </div>

      <div className="flex flex-col gap-6 bg-gray300 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-4 font-gill text-base leading-110 text-darkblack">
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
            <ProfileMetaDivider className="hidden h-4 lg:block" />
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

        {order.items.length > 0 ? (
          <div className="flex flex-col gap-4">
            {order.items.map((item) => (
              <ProfileOrderDetailItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : null}
      </div>

      {timelineSteps.length > 0 ? (
        <ProfileOrderTimeline
          estimatedLabel={order.estimatedDeliveryLabel}
          estimatedValue={order.estimatedDeliveryValue}
          steps={timelineSteps}
          className="bg-gray300"
        />
      ) : null}

      {order.shippingAddress ? (
        <div className="flex flex-col gap-4 bg-gray300 p-6">
          <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
            {detailContent.deliveryDetailsTitle}
          </h2>
          <div className="font-gill text-base leading-110 text-darkblack">
            <p className="font-normal">{order.shippingAddress.fullName}</p>
            <p className="mt-2 font-light">
              {formatAddressLines(order.shippingAddress.streetLines)}
              <br />
              {order.shippingAddress.city}
              {order.shippingAddress.region ? `, ${order.shippingAddress.region}` : ""}{" "}
              {order.shippingAddress.pincode}
              <br />
              {order.shippingAddress.phone}
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 bg-gray300 p-6">
        <button
          type="button"
          onClick={() => setTotalsExpanded((expanded) => !expanded)}
          className="flex w-full items-center justify-between gap-4 text-left"
          aria-expanded={totalsExpanded}
        >
          <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
            {detailContent.totalOrderValueLabel}
          </h2>
          <span className="inline-flex items-center gap-2">
            <span className="font-gill text-2xl font-normal leading-110 text-darkblack">
              {formatOrderTotal(priceBreakdown.orderTotal, priceBreakdown.currency)}
            </span>
            <ChevronUp
              className={cn(
                "size-6 shrink-0 text-darkblack transition-transform",
                !totalsExpanded && "rotate-180",
              )}
              strokeWidth={1.5}
              aria-hidden
            />
          </span>
        </button>

        {totalsExpanded ? (
          <>
            <div className="h-px w-full bg-neutral300" />

            <div className="flex flex-col gap-3 font-gill text-base leading-110 text-darkblack">
              <div className="flex items-center justify-between">
                <span className="font-light">{detailContent.orderAmountLabel}</span>
                <span className="font-normal">
                  {formatOrderTotal(priceBreakdown.orderAmount, priceBreakdown.currency)}
                </span>
              </div>

              {hasDiscount ? (
                <div className="flex items-center justify-between">
                  <span className="font-light">{detailContent.orderDiscountLabel}</span>
                  <span className="font-normal">
                    -{formatOrderTotal(priceBreakdown.orderDiscount, priceBreakdown.currency)}
                  </span>
                </div>
              ) : null}

              <div className="flex items-center justify-between">
                <span className="font-light">{detailContent.taxLabel}</span>
                <span className="font-normal">
                  {formatOrderTotal(priceBreakdown.tax, priceBreakdown.currency)}
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-neutral300" />

            <div className="flex items-center justify-between font-gill text-base font-normal leading-110 text-darkblack">
              <span>{detailContent.orderTotalLabel}</span>
              <span>
                {formatOrderTotal(priceBreakdown.orderTotal, priceBreakdown.currency)}
              </span>
            </div>
          </>
        ) : null}
      </div>

      {order.paymentMethod ? (
        <div className="bg-gray300 p-6">
          <div className="flex items-center justify-between font-gill text-base leading-110 text-darkblack">
            <span className="font-light">{detailContent.paymentModeLabel}</span>
            <span className="font-normal">{order.paymentMethod}</span>
          </div>
        </div>
      ) : null}

      {(order.showCancel || order.showDownloadInvoice) ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-6 sm:flex-row">
            {order.showCancel ? (
              <DetailOutlineButton
                type="button"
                className="flex-1"
                onClick={handleCancelOrder}
              >
                {content.cancelOrderLabel}
              </DetailOutlineButton>
            ) : null}

            {order.showDownloadInvoice ? (
              <DetailDarkButton
                type="button"
                className="flex-1"
                onClick={handleDownloadInvoice}
              >
                {content.downloadInvoiceLabel}
              </DetailDarkButton>
            ) : null}
          </div>

          {order.showCancelNote && order.footnote ? (
            <div className="flex items-center gap-2 font-gill text-base font-light leading-110 text-darkblack">
              <Info className="size-6 shrink-0" strokeWidth={1.5} aria-hidden />
              <p>{order.footnote}</p>
            </div>
          ) : null}
        </div>
      ) : null}

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
    </div>
  );
}
