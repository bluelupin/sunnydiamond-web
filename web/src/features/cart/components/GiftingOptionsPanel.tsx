"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useCart } from "../context/CartContext";
import { useCartUI } from "../context/CartUIContext";
import { cartFlowSpec } from "../data/cartFlowSpec";
import { formatCartLineMeta, formatCartPrice } from "../utils/formatCartLine";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/shared/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/shared/ui/sheet";
import {
  CartDivider,
  CartMetaRow,
  CartOutlineButton,
  CartOutlineLink,
  CartPrimaryButton,
} from "./CartFlowUi";

const GiftingPanelBody = ({ onClose }: { onClose: () => void }) => {
  const { items, updateLineItemGifting } = useCart();
  const { giftingStep, openGiftingPanel } = useCartUI();
  const [wrapMode, setWrapMode] = useState<"single" | "separate">("single");
  const [giftNote, setGiftNote] = useState("");

  const applyGifting = () => {
    items.forEach((item) => {
      updateLineItemGifting(item.id, { wrapMode, note: giftNote.trim() || undefined });
    });
    onClose();
  };

  if (giftingStep === "intro") {
    return (
      <div
        className="flex h-full flex-col"
        style={{
          backgroundColor: cartFlowSpec.colors.pageBackground,
          padding: cartFlowSpec.drawer.contentPadding,
        }}
      >
        <div className="flex flex-col" style={{ gap: cartFlowSpec.drawer.sectionGap }}>
          <h2 className="font-larken text-[32px] font-light leading-110 text-darkblack">
            Gifting options
          </h2>
          <CartDivider weight={1} />
          <p className="font-gill text-base font-light leading-110 text-darkblack">
            You can choose to personalise your gifts by adding a note and signature gift bags.
          </p>
        </div>
        <div
          className="mt-auto flex flex-col"
          style={{ gap: cartFlowSpec.priceDetails.ctaGap, paddingTop: 40 }}
        >
          <CartPrimaryButton
            type="button"
            className="w-full uppercase"
            onClick={() => openGiftingPanel("personalise")}
          >
            Personalise Gift
          </CartPrimaryButton>
          <CartOutlineLink href="/checkout" onClick={onClose}>
            Continue to Checkout
          </CartOutlineLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div
        className="flex items-center justify-between border-b border-neutral200"
        style={{ padding: `${cartFlowSpec.card.metaGap * 2}px ${cartFlowSpec.drawer.contentPadding}px` }}
      >
        <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
          Gifting Options
        </h2>
        <button type="button" onClick={onClose} aria-label="Close gifting options">
          <X className="size-6 text-darkblack" />
        </button>
      </div>

      <div
        className="flex flex-1 flex-col overflow-y-auto"
        style={{ padding: cartFlowSpec.drawer.contentPadding, gap: cartFlowSpec.drawer.sectionGap }}
      >
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setWrapMode("single")}
            className={cn(
              "border px-4 py-3 text-left font-gill text-base font-light leading-110",
              wrapMode === "single" ? "border-darkblack bg-gray300" : "border-neutral300 bg-white",
            )}
          >
            Your items will be gift wrapped in a single bag
          </button>
          <button
            type="button"
            onClick={() => setWrapMode("separate")}
            className={cn(
              "border px-4 py-3 text-left font-gill text-base font-light leading-110",
              wrapMode === "separate" ? "border-darkblack bg-gray300" : "border-neutral300 bg-white",
            )}
          >
            Each of your items will be delivered in separate bags
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="gift-note" className="font-gill text-base leading-110 text-neutral500">
            Add Gift Note
          </label>
          <textarea
            id="gift-note"
            value={giftNote}
            onChange={(event) => setGiftNote(event.target.value)}
            rows={4}
            className="resize-none border border-neutral300 bg-white p-3 font-gill text-base leading-110 text-darkblack outline-none focus:border-darkblack"
            placeholder="Write a personalised message..."
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-gill text-base font-light leading-110 text-darkblack">
            Items currently in your shopping bag
          </p>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center border border-neutral200"
              style={{
                gap: cartFlowSpec.card.imageGap,
                padding: `${cartFlowSpec.drawer.previewPaddingY}px ${cartFlowSpec.drawer.previewPaddingX}px`,
                backgroundColor: cartFlowSpec.colors.previewBackground,
              }}
            >
              <div
                className="relative shrink-0 overflow-hidden bg-neutral200"
                style={{
                  width: cartFlowSpec.drawer.previewImage.width,
                  height: cartFlowSpec.drawer.previewImage.height,
                }}
              >
                <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex flex-col" style={{ gap: cartFlowSpec.drawer.previewInfoGap }}>
                <p className="font-gill text-base leading-110 text-darkblack">{item.product.name}</p>
                <CartMetaRow parts={formatCartLineMeta(item)} />
                <p className="font-gill text-base leading-110 text-darkblack">
                  {formatCartPrice(item.product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="border-t border-neutral200"
        style={{ padding: cartFlowSpec.drawer.contentPadding }}
      >
        <CartPrimaryButton type="button" className="w-full uppercase" onClick={applyGifting}>
          Save Gifting Options
        </CartPrimaryButton>
      </div>
    </div>
  );
};

const GiftingOptionsPanel = () => {
  const { isGiftingPanelOpen, closeGiftingPanel } = useCartUI();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (isMobile) {
    return (
      <Drawer open={isGiftingPanelOpen} onOpenChange={(open) => !open && closeGiftingPanel()}>
        <DrawerContent className="max-h-[90vh] rounded-none border-0 p-0 [&>div:first-child]:hidden">
          <DrawerTitle className="sr-only">Gifting options</DrawerTitle>
          <GiftingPanelBody onClose={closeGiftingPanel} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isGiftingPanelOpen} onOpenChange={(open) => !open && closeGiftingPanel()}>
      <SheetContent
        side="right"
        className="w-full border-0 p-0 sm:max-w-[560px] [&>button]:hidden"
      >
        <SheetTitle className="sr-only">Gifting options</SheetTitle>
        <GiftingPanelBody onClose={closeGiftingPanel} />
      </SheetContent>
    </Sheet>
  );
};

export default GiftingOptionsPanel;
