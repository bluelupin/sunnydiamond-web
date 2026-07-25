"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { useCart } from "../context/CartContext";
import { useCartUI } from "../context/CartUIContext";
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
  CartGiftBadge,
  CartMetaRow,
  CartMoreItemsNote,
  CartOutlineLink,
  CartPrimaryLink,
  CartSuccessCheck,
} from "./CartFlowUi";
import DeleteIcon from "@/assets/Icons/DeleteIcon";

const BagDrawerContent = ({ onClose }: { onClose: () => void }) => {
  const { items, totalItems, removeItem } = useCart();
  const { lastAddedLineItemId, bagDrawerSnapshot } = useCartUI();

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
      <div className="mx-auto flex w-full flex-1 flex-col gap-6 overflow-y-auto lg:px-6 px-4 pb-5 pt-6 lg:pt-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <CartSuccessCheck />
          <p className="font-gill text-base font-light leading-110 text-darkblack">
            Item added to your bag successfully!
          </p>
        </div>

        <div className="h-px w-full shrink-0 bg-aboutInactive" aria-hidden />

        {addedItem ? (
          <div className="flex min-h-0 flex-1 flex-col justify-between lg:gap-6 gap-4">
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
                    {formatCartPrice(addedItem.product.price)}
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
  const { isBagDrawerOpen, closeBagDrawer } = useCartUI();
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
      <Drawer open={isBagDrawerOpen} onOpenChange={(open) => !open && closeBagDrawer()}>
        <DrawerContent className="max-h-[85vh] rounded-none border-0 p-0 [&>div:first-child]:hidden">
          <DrawerTitle className="sr-only">Item added to your bag</DrawerTitle>
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
          "h-screen max-h-100vh w-full max-w-[472px] border-0 bg-white p-0 sm:max-w-[472px] [&>button]:hidden",
        )}
      >
        <SheetTitle className="sr-only">Item added to your bag</SheetTitle>
        <BagDrawerContent onClose={closeBagDrawer} />
      </SheetContent>
    </Sheet>
  );
};

export default CartBagDrawer;
