"use client";

import { useState } from "react";
import { ChevronLeft, ChevronUp } from "lucide-react";
import CopyIcon from "@/assets/Icons/CopyIcon";
import InformationIcon from "@/assets/Icons/InformationIcon";
import {
  DetailDarkButton,
  DetailOutlineButton,
} from "@/features/products/components/detail/shared";
import { useToast } from "@/shared/hooks/use-toast";
import { cn } from "@/shared/utils/cn";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileOrderDetailUi } from "../types/profileUi.types";
import { formatOrderDate, formatOrderTotal } from "../utils/formatAccountData";
import { ProfileOrderDetailItemCard } from "./ProfileOrderDetailItemCard";
import { ProfileOrderTimeline } from "./ProfileOrderTimeline";
import { ProfileMetaDivider } from "./profileUi";

type ProfileOrderDetailViewProps = {
  order: ProfileOrderDetailUi;
  onBack: () => void;
};

export function ProfileOrderDetailView({ order, onBack }: ProfileOrderDetailViewProps) {
  const { toast } = useToast();
  const content = profileTabsContent.orders;
  const detailContent = content.detail;
  const [totalsExpanded, setTotalsExpanded] = useState(true);

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
    toast({
      title: content.cancelOrderLabel,
      description: "Order cancellation will be available soon. Contact support for assistance.",
    });
  };

  const { priceBreakdown } = order;
  const hasDiscount = priceBreakdown.orderDiscount > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="text-darkblack"
          aria-label={detailContent.backLabel}
        >
          <ChevronLeft className="size-6 shrink-0" strokeWidth={1.5} aria-hidden />
        </button>
        <h1 className="font-larken text-2xl font-light leading-110 text-darkblack lg:text-32">
          {detailContent.pageTitle}
        </h1>
      </div>

      <div className="h-px w-full bg-neutral300 lg:hidden" aria-hidden />

      <div className="flex flex-col gap-6 bg-gray300 p-4 lg:p-6">
        <div className="flex items-stretch gap-4 lg:hidden">
          <div className="flex min-w-0 flex-1 flex-col gap-2 text-center font-gill text-base leading-110 text-darkblack">
            <span className="font-light">{detailContent.orderIdMetaLabel}</span>
            <span className="inline-flex items-center justify-center gap-1.5">
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
          </div>

          <span className="w-px shrink-0 self-stretch bg-neutral300" aria-hidden />

          <div className="flex min-w-0 flex-1 flex-col justify-between text-center font-gill text-base leading-110 text-darkblack">
            <span className="font-light">{detailContent.placedOnMetaLabel}</span>
            <span className="font-normal">{formatOrderDate(order.orderDate)}</span>
          </div>

          {order.deliveryBy ? (
            <>
              <span className="w-px shrink-0 self-stretch bg-neutral300" aria-hidden />
              <div className="flex min-w-0 flex-1 flex-col justify-between text-center font-gill text-base leading-110 text-darkblack">
                <span className="font-light">{detailContent.deliveryByMetaLabel}</span>
                <span className="font-normal">{formatOrderDate(order.deliveryBy)}</span>
              </div>
            </>
          ) : null}
        </div>

        <div className="hidden flex-col gap-4 lg:flex lg:flex-row lg:items-center lg:justify-between">
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

        {order.items.length > 0 ? (
          <div className="flex flex-col gap-6">
            {order.items.map((item) => (
              <ProfileOrderDetailItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : null}
      </div>

      {order.timeline && order.timeline.length > 0 ? (
        <ProfileOrderTimeline
          variant="detail"
          estimatedLabel={order.estimatedDeliveryLabel}
          estimatedValue={order.estimatedDeliveryValue}
          steps={order.timeline}
          className="bg-gray300"
        />
      ) : null}

      {order.shippingAddress ? (
        <div className="flex flex-col gap-4 bg-gray300 p-4 lg:p-6">
          <h2 className="font-gill text-xl font-normal leading-110 text-darkblack lg:font-larken lg:text-2xl lg:font-light">
            {detailContent.deliveryDetailsTitle}
          </h2>
          <div className="flex flex-col gap-2 font-gill text-base leading-110 text-darkblack">
            <p className="font-normal">{order.shippingAddress.fullName}</p>
            <div className="font-light">
              {order.shippingAddress.streetLines.filter(Boolean).map((line) => (
                <p key={line}>{line}</p>
              ))}
              <p>
                {[
                  order.shippingAddress.city,
                  order.shippingAddress.region,
                  order.shippingAddress.pincode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {order.shippingAddress.phone ? <p>{order.shippingAddress.phone}</p> : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 bg-gray300 p-4 lg:p-6">
        <button
          type="button"
          onClick={() => setTotalsExpanded((expanded) => !expanded)}
          className="flex w-full items-center justify-between gap-4 text-left"
          aria-expanded={totalsExpanded}
          aria-controls="order-totals-breakdown"
        >
          <h2 className="font-gill text-xl font-normal leading-110 text-darkblack lg:font-larken lg:text-2xl lg:font-light">
            {detailContent.totalOrderValueLabel}
          </h2>
          <span className="inline-flex items-center gap-2">
            <span className="font-gill text-base font-normal leading-110 text-darkblack lg:text-2xl">
              {formatOrderTotal(priceBreakdown.orderTotal, priceBreakdown.currency)}
            </span>
            <ChevronUp
              className={cn(
                "size-6 shrink-0 text-darkblack transition-transform duration-500 ease-in-out",
                !totalsExpanded && "rotate-180",
              )}
              strokeWidth={1.5}
              aria-hidden
            />
          </span>
        </button>

        <div
          id="order-totals-breakdown"
          aria-hidden={!totalsExpanded}
          className={cn(
            "grid min-h-0 transition-[grid-template-rows,opacity] duration-500 ease-in-out",
            totalsExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="flex flex-col gap-4 overflow-hidden">
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
              <span className="lg:hidden">{detailContent.totalLabel}</span>
              <span className="hidden lg:inline">{detailContent.orderTotalLabel}</span>
              <span>
                {formatOrderTotal(priceBreakdown.orderTotal, priceBreakdown.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {order.paymentMethod ? (
        <div className="bg-gray300 p-4 lg:p-6">
          <div className="flex items-center justify-between font-gill text-base leading-110 text-darkblack">
            <span className="font-light">{detailContent.paymentModeLabel}</span>
            <span className="font-normal">{order.paymentMethod}</span>
          </div>
        </div>
      ) : null}

      {(order.showCancel || order.showDownloadInvoice) ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
            {order.showDownloadInvoice ? (
              <DetailDarkButton
                type="button"
                className="order-1 h-14 min-h-[56px] w-full shrink-0 px-7 py-5 font-normal lg:order-2 lg:flex-1"
                onClick={handleDownloadInvoice}
              >
                {content.downloadInvoiceLabel}
              </DetailDarkButton>
            ) : null}

            {order.showCancel ? (
              <DetailOutlineButton
                type="button"
                className="order-2 h-14 min-h-[56px] w-full shrink-0 px-7 py-5 font-normal lg:order-1 lg:flex-1"
                onClick={handleCancelOrder}
              >
                {content.cancelOrderLabel}
              </DetailOutlineButton>
            ) : null}
          </div>

          {order.showCancelNote && order.footnote ? (
            <div className="flex items-center gap-2">
              <InformationIcon className="size-6 shrink-0 text-darkblack" />
              <p className="min-w-0 flex-1 font-gill text-base font-light leading-110 text-darkblack">
                {order.footnote}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
