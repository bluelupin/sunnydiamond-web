"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";
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
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { useResponsiveOverlayShell } from "@/shared/hooks/use-responsive-overlay-shell";
import { useCart } from "../context/CartContext";
import { useCartUI } from "../context/CartUIContext";
import { useCartCheckout } from "../hooks/useCartCheckout";
import { formatCartLineMeta, formatCartPrice } from "../utils/formatCartLine";
import {
  CartDivider,
  CartMetaRow,
  CartPrimaryButton,
  CartTextLink,
} from "./CartFlowUi";
import { giftingContent } from "../data/giftingContent";
import { cartFlowSpec } from "../data/cartFlowSpec";

const GIFTING_OVERLAY_CLASS = "bg-[rgba(30,30,30,0.75)] backdrop-blur-[4.5px]";

const GIFTING_MOBILE_QUERY = "(max-width: 1023px)";

const GiftingIntroPanel = ({
  onClose,
  onPersonalise,
}: {
  onClose: () => void;
  onPersonalise: () => void;
}) => {
  const { markGiftingOptionsExplored } = useCartUI();
  const { navigateToCheckout } = useCartCheckout();

  const handlePersonalise = () => {
    markGiftingOptionsExplored();
    onPersonalise();
  };

  const handleContinueToCheckout = () => {
    markGiftingOptionsExplored();
    onClose();
    navigateToCheckout();
  };

  return (
    <div className="flex w-full flex-col gap-6 bg-gray300 lg:px-6 py-6 px-4">
      <div className="flex flex-col gap-6">
        <h2 className="font-larken text-2xl font-light leading-110 text-darkblack lg:text-32">
          Gifting options
        </h2>
        <CartDivider weight={1} />
        <p className="font-gill text-base font-light leading-110 text-darkblack">
          You can choose to personalise your gifts by adding a note and signature gift bags.
        </p>
      </div>
      <hr className="border-neutral300" />
      <div className="flex flex-col gap-4">
        <CartPrimaryButton type="button" className="w-full uppercase" onClick={handlePersonalise}>
          Personalise Gift
        </CartPrimaryButton>
        <div className="flex justify-center">
          <CartTextLink onClick={handleContinueToCheckout} className="uppercase">
            Continue to Checkout
          </CartTextLink>
        </div>
      </div>
    </div>
  );
};

const GiftingItemCheckbox = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={cn(
      "flex size-5 shrink-0 items-center justify-center border-[0.8px] border-darkblack bg-white",
      checked && "border-transparent bg-linkGold",
    )}
  >
    <Check
      className={cn("size-3 text-white transition-opacity", checked ? "opacity-100" : "opacity-0")}
      strokeWidth={2.5}
    />
  </button>
);

const GiftingNoteField = ({
  id,
  value,
  onChange,
  placeholder = "Add Gift Note",
  variant = "single",
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: "single" | "separate";
}) => (
  <div className="flex h-14 items-center gap-4 bg-aboutInactive px-3">
    <input
      id={id}
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={cn(
        "h-14 min-w-0 flex-1 bg-transparent font-gill text-base leading-110 text-darkblack outline-none",
        variant === "single"
          ? "placeholder:font-normal placeholder:text-gray600"
          : "placeholder:font-light placeholder:text-darkblack",
      )}
    />
  </div>
);

const GiftingSeparateToggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label="Send items as separate gifts"
    onClick={() => onChange(!checked)}
    className={cn(
      "relative h-6 w-[44px] shrink-0 rounded-full p-1 transition-colors",
      checked ? "bg-linkGold" : "bg-neutral300",
    )}
  >
    <span
      className={cn(
        "absolute top-1/2 size-[18px] -translate-y-1/2 rounded-full transition-transform",
        checked ? "left-[calc(100%-22px)] bg-aboutInactive" : "left-1 bg-white",
      )}
    />
  </button>
);

const GiftingBagHero = ({ isSeparate }: { isSeparate: boolean }) => {
  const { bagHero, copy } = giftingContent;

  return (
    <div className="flex flex-col gap-4">
      <p className="font-gill text-base font-light leading-110 text-darkblack">
        {isSeparate ? copy.separateBags : copy.singleBag}
      </p>
      <div
        className="relative w-full overflow-hidden bg-gray200"
        style={{ height: cartFlowSpec.gifting.personalise.heroImageHeight }}
      >
        <Image
          src={isSeparate ? bagHero.separate : bagHero.single}
          alt={bagHero.alt}
          width={bagHero.width}
          height={bagHero.height}
          className="absolute inset-x-0 w-full object-cover"
          style={{ top: bagHero.offsetTop, height: bagHero.height }}
          sizes={`${bagHero.width}px`}
        />
      </div>
    </div>
  );
};

const GiftingScrollIndicator = () => (
  <div
    className="pointer-events-none absolute bottom-6 right-0 top-6 flex w-[2px] justify-center rounded-[70px] bg-neutral300"
    aria-hidden
  >
    <div className="h-[246px] w-[3px] bg-gray600" />
  </div>
);

const GiftingPersonalisePanel = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const { items, applyGiftingSelection } = useCart();
  const { markGiftingOptionsExplored } = useCartUI();
  const cartItemIdsKey = useMemo(
    () => items.map((item) => item.id).sort().join("|"),
    [items],
  );
  const initiallySelectedGiftIds = useMemo(
    () => items.filter((item) => item.gifting || item.options.isGift).map((item) => item.id),
    [items],
  );
  const [wrapMode, setWrapMode] = useState<"single" | "separate">(() =>
    items.some((item) => item.gifting?.wrapMode === "separate") ? "separate" : "single",
  );
  const [giftNote, setGiftNote] = useState(
    () =>
      items.find((item) => item.gifting?.wrapMode !== "separate" && item.gifting?.note)?.gifting
        ?.note ?? "",
  );
  const [itemNotes, setItemNotes] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      items
        .filter((item) => item.gifting?.wrapMode === "separate" && item.gifting.note)
        .map((item) => [item.id, item.gifting?.note ?? ""]),
    ),
  );
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(
    () => new Set(initiallySelectedGiftIds),
  );

  useEffect(() => {
    const cartIdSet = new Set(cartItemIdsKey ? cartItemIdsKey.split("|") : []);
    setSelectedItemIds((previous) => {
      const validIds = [...previous].filter((id) => cartIdSet.has(id));
      const unchanged =
        validIds.length === previous.size && validIds.every((id) => previous.has(id));

      if (unchanged) {
        return previous;
      }

      return new Set(validIds);
    });
  }, [cartItemIdsKey]);

  const isSeparate = wrapMode === "separate";

  const toggleItemSelection = (itemId: string, checked: boolean) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(itemId);
      } else {
        next.delete(itemId);
      }
      return next;
    });
  };

  const applyGifting = () => {
    markGiftingOptionsExplored();
    void applyGiftingSelection({
      mode: wrapMode,
      groupedNote: wrapMode === "single" ? giftNote.trim() || undefined : undefined,
      items: items.map((item) => ({
        lineItemId: item.id,
        isGift: selectedItemIds.has(item.id),
        note:
          wrapMode === "separate" && selectedItemIds.has(item.id)
            ? itemNotes[item.id]?.trim() || undefined
            : undefined,
      })),
    });
    onClose();
    router.push("/cart");
  };

  const renderItemRow = (item: (typeof items)[number], mode: "single" | "separate") => (
    <div
      className={cn(
        "flex min-w-0 flex-1 items-center",
        mode === "single" ? "gap-6" : "gap-4",
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-gray200",
          mode === "single" ? "h-[53px] w-[60px]" : "h-[71px] w-20",
        )}
      >
        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <p className="font-gill text-base font-normal leading-110 text-darkblack">
          {item.product.name}
        </p>
        <CartMetaRow parts={formatCartLineMeta(item)} />
        {/* <p className="font-gill text-base font-normal leading-110 text-darkblack">
          {formatCartPrice(item.product.price)}
        </p> */}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <div className="w-full shrink-0 lg:px-6 px-4 lg:pt-10 pt-6">
        <div className="flex h-[26px] items-center justify-between">
          <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
            Gifting Options
          </h2>
          <button type="button" onClick={onClose} aria-label="Close gifting options">
            <X className="size-6 text-darkblack" />
          </button>
        </div>
        <div className="mt-6">
          <CartDivider weight={1} />
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="flex flex-col gap-6 lg:px-6 px-4 py-6">
          <GiftingBagHero isSeparate={isSeparate} />

          {!isSeparate ? (
            <GiftingNoteField
              id="gift-note"
              value={giftNote}
              onChange={setGiftNote}
            />
          ) : null}

          <div className="flex flex-col gap-4">
            <p className="font-gill text-base font-light leading-110 text-darkblack">
              Items currently in your shopping bag
            </p>

            {!isSeparate ? (
              <div className="flex flex-col gap-6 bg-gray300 p-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <GiftingItemCheckbox
                      checked={selectedItemIds.has(item.id)}
                      onChange={(checked) => toggleItemSelection(item.id, checked)}
                      label={`Include ${item.product.name} in gifting`}
                    />
                    {renderItemRow(item, "single")}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 border border-neutral300 bg-white px-4 py-6 [border-width:0.5px]"
                  >
                    <div className="flex items-center gap-3">
                      <GiftingItemCheckbox
                        checked={selectedItemIds.has(item.id)}
                        onChange={(checked) => toggleItemSelection(item.id, checked)}
                        label={`Include ${item.product.name} in gifting`}
                      />
                      {renderItemRow(item, "separate")}
                    </div>
                    <GiftingNoteField
                      id={`gift-note-${item.id}`}
                      value={itemNotes[item.id] ?? ""}
                      onChange={(value) =>
                        setItemNotes((prev) => ({ ...prev, [item.id]: value }))
                      }
                      variant="separate"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 mt-1">
            <p className="font-gill text-base font-normal leading-110 text-darkblack">
              Send items as separate gifts
            </p>
            <GiftingSeparateToggle
              checked={isSeparate}
              onChange={(checked) => setWrapMode(checked ? "separate" : "single")}
            />
          </div>
        </div>

        <GiftingScrollIndicator />
      </div>

      <div className="relative shrink-0 bg-white pb-6 border-t border-neutral300">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-full h-[71px] bg-gradient-to-b from-transparent to-white"
          aria-hidden
        />
        <hr className="border-neutral300 mb-6" />
        <div className="w-full px-4">
          <CartPrimaryButton type="button" className="w-full uppercase" onClick={applyGifting}>
            Save
          </CartPrimaryButton>
        </div>
      </div>
    </div>
  );
};

const GiftingOptionsPanel = () => {
  const { isGiftingPanelOpen, closeGiftingPanel, giftingStep, openGiftingPanel } = useCartUI();
  const { showMobileShell } = useResponsiveOverlayShell(isGiftingPanelOpen, GIFTING_MOBILE_QUERY);
  const showPersonalisePanel = isGiftingPanelOpen && giftingStep === "personalise";

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      closeGiftingPanel();
    }
  };

  const introPanel = (
    <GiftingIntroPanel
      onClose={closeGiftingPanel}
      onPersonalise={() => openGiftingPanel("personalise")}
    />
  );

  const personalisePanel = showPersonalisePanel ? (
    <GiftingPersonalisePanel onClose={closeGiftingPanel} />
  ) : null;

  if (showMobileShell) {
    return (
      <Drawer
        open={isGiftingPanelOpen}
        shouldScaleBackground={false}
        onOpenChange={handleOpenChange}
      >
        <DrawerContent
          overlayClassName={cn("z-[70]", GIFTING_OVERLAY_CLASS)}
          className={cn(
            "flex min-h-0 flex-col overflow-hidden rounded-none border-0 p-0 [&>div:first-child]:hidden",
            giftingStep === "intro"
              ? "max-h-[90vh] bg-gray300"
              : "h-[90vh] max-h-[90vh] bg-white",
          )}
        >
          <DrawerTitle className="sr-only">Gifting options</DrawerTitle>
          {giftingStep === "intro" ? (
            introPanel
          ) : (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{personalisePanel}</div>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  if (giftingStep === "intro") {
    return (
      <Dialog open={isGiftingPanelOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          hideCloseButton
          overlayClassName={cn("z-[70]", GIFTING_OVERLAY_CLASS)}
          className="z-[70] max-w-[560px] gap-0 border-0 bg-transparent p-0 shadow-none sm:rounded-none data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100"
        >
          <DialogTitle className="sr-only">Gifting options</DialogTitle>
          {introPanel}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={isGiftingPanelOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        overlayClassName="bg-[rgba(30,30,30,0.75)] backdrop-blur-[4.5px]"
        className={cn(
          "h-full w-full max-w-[472px] gap-0 border-0 p-0 shadow-none sm:max-w-[472px]",
          "[&>button]:hidden",
        )}
      >
        <SheetTitle className="sr-only">Gifting options</SheetTitle>
        <div className="flex h-full min-h-0 flex-col overflow-hidden">{personalisePanel}</div>
      </SheetContent>
    </Sheet>
  );
};

export default GiftingOptionsPanel;
