"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { useCart } from "../context/CartContext";
import { useCartUI } from "../context/CartUIContext";
import { formatCartLineMeta, formatCartPrice, getCartLineDisplayPrice } from "../utils/formatCartLine";
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
import { RIGHT_PANEL_HEADER_PADDING_CLASS, RIGHT_PANEL_WIDTH_CLASS } from "@/shared/ui/rightPanel";
import { RightPanelCloseButton } from "@/shared/ui/RightPanelCloseButton";
import {
  CartBagDrawerSuccessHeader,
  CartGiftBadge,
  CartMetaRow,
  CartMoreItemsNote,
  CartOutlineLink,
  CartPrimaryLink,
} from "./CartFlowUi";
import DeleteIcon from "@/assets/Icons/DeleteIcon";

const BAG_DRAWER_SUCCESS_MESSAGES = {
  add: "Item added to your bag successfully!",
  update: "Product updated successfully",
} as const;

const BAG_DRAWER_SR_TITLES = {
  add: "Item added to your bag",
  update: "Product updated successfully",
} as const;

const MOBILE_DRAWER_MEDIA_QUERY = "(max-width: 1023px)";

const BagDrawerContent = ({ onClose }: { onClose: () => void }) => {
  const { items, totalItems, removeItem } = useCart();
  const { lastAddedLineItemId, bagDrawerSnapshot, bagDrawerMode } = useCartUI();
  const successMessage = BAG_DRAWER_SUCCESS_MESSAGES[bagDrawerMode];

  const addedItem = useMemo(() => {
    if (!lastAddedLineItemId) return null;
    return (
      items.find((item) => item.id === lastAddedLineItemId) ??
      (bagDrawerSnapshot?.lineItemId === lastAddedLineItemId
        ? bagDrawerSnapshot.lineItem
        : null)
    );
  }, [items, lastAddedLineItemId, bagDrawerSnapshot]);

  const otherCount = addedItem ? Math.max(totalItems - addedItem.quantity, 0) : 0;

  const meta = addedItem ? formatCartLineMeta(addedItem) : [];
  const isGift = Boolean(addedItem?.options.isGift || addedItem?.gifting);

  const handleRemoveAddedItem = () => {
    if (!addedItem) return;
    removeItem(addedItem.id);
    onClose();
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className={cn("flex shrink-0 justify-end", RIGHT_PANEL_HEADER_PADDING_CLASS)}>
        <RightPanelCloseButton onClick={onClose} aria-label="Close bag drawer" />
      </div>

      <div className="mx-auto flex w-full flex-1 flex-col gap-6 overflow-y-auto px-4 pb-5 lg:px-6">
        <CartBagDrawerSuccessHeader message={successMessage} />

        <div className="h-px w-full shrink-0 bg-aboutInactive" aria-hidden />

        {addedItem ? (
          <div className="flex min-h-0 flex-1 flex-col justify-between">
            <div className="relative flex items-start justify-between bg-gray300 px-4 py-6">
              {isGift ? (
                <CartGiftBadge variant="drawer" className="absolute left-0 top-0 z-10" />
              ) : null}

              <div className="flex min-w-0 flex-1 items-center lg:gap-4 gap-2 lg:pr-4 pr-2">
                <div className="relative size-[68px] shrink-0 overflow-hidden bg-white lg:size-[91px]">
                  <Image
                    src={addedItem.product.image}
                    alt={addedItem.product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1023px) 68px, 91px"
                  />
                </div>
                <div className="flex min-w-0 max-w-[176px] flex-col gap-2">
                  <p className="font-gill text-base leading-110 text-darkblack">
                    {addedItem.product.name}
                  </p>
                  <CartMetaRow parts={meta} />
                  <p className="font-gill text-base leading-110 text-darkblack">
                    {formatCartPrice(getCartLineDisplayPrice(addedItem))}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveAddedItem}
                aria-label={`Remove ${addedItem.product.name} from bag`}
                className="shrink-0 text-darkblack transition-opacity hover:opacity-70"
              >
                <DeleteIcon className="size-6" />
              </button>
            </div>

            {otherCount > 0 ? <CartMoreItemsNote count={otherCount} /> : null}
          </div>
        ) : null}
      </div>

      <div className="mt-auto flex flex-col gap-4 border-t border-neutral300 bg-white px-4 py-6 [border-top-width:0.5px]">
        <CartPrimaryLink href="/cart" onClick={onClose} className="uppercase">
          View Shopping Bag
        </CartPrimaryLink>
        <CartOutlineLink href="/jewellery" className="w-full uppercase" onClick={onClose}>
          Continue Shopping
        </CartOutlineLink>
      </div>
    </div>
  );
};

const CartBagDrawer = () => {
  const { isBagDrawerOpen, bagDrawerMode, closeBagDrawer } = useCartUI();
  const drawerTitle = BAG_DRAWER_SR_TITLES[bagDrawerMode];
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_DRAWER_MEDIA_QUERY).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(MOBILE_DRAWER_MEDIA_QUERY);
    const update = () => setIsMobile(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (isMobile) {
    return (
      <Drawer open={isBagDrawerOpen} onOpenChange={(open) => !open && closeBagDrawer()}>
        <DrawerContent className="max-h-[85vh] rounded-none border-0 p-0 [&>div:first-child]:hidden">
          <DrawerTitle className="sr-only">{drawerTitle}</DrawerTitle>
          <BagDrawerContent onClose={closeBagDrawer} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isBagDrawerOpen} onOpenChange={(open) => !open && closeBagDrawer()}>
      <SheetContent
        side="right"
        overlayClassName="bg-[rgba(30,30,30,0.75)] backdrop-blur-[4.5px]"
        className={cn(
          "h-screen max-h-100vh w-full border-0 bg-white p-0",
          RIGHT_PANEL_WIDTH_CLASS,
          "[&>button]:hidden",
        )}
      >
        <SheetTitle className="sr-only">{drawerTitle}</SheetTitle>
        <BagDrawerContent onClose={closeBagDrawer} />
      </SheetContent>
    </Sheet>
  );
};

export default CartBagDrawer;
