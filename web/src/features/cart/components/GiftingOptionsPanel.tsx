"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
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
import { useCart } from "../context/CartContext";
import { useCartUI } from "../context/CartUIContext";
import { formatCartLineMeta, formatCartPrice } from "../utils/formatCartLine";
import {
  CartDivider,
  CartMetaRow,
  CartPrimaryButton,
  CartTextLink,
} from "./CartFlowUi";

const giftingFadeClassName = "transition-opacity duration-300 ease-out motion-reduce:transition-none";

const useGiftingModalEffects = (open: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);
};

const GiftingIntroPanel = ({
  onClose,
  onPersonalise,
}: {
  onClose: () => void;
  onPersonalise: () => void;
}) => {
  const router = useRouter();

  const handleContinueToCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
  <div className="flex w-full flex-col gap-6 bg-gray300 p-6">
    <div className="flex flex-col gap-6">
      <h2 className="font-larken text-[32px] font-light leading-110 text-darkblack">
        Gifting options
      </h2>
      <CartDivider weight={1} />
      <p className="font-gill text-base font-light leading-110 text-darkblack">
        You can choose to personalise your gifts by adding a note and signature gift bags.
      </p>
    </div>

    <div className="flex flex-col gap-4 border-t border-neutral300 pt-6 [border-top-width:0.5px]">
      <CartPrimaryButton type="button" className="w-full uppercase" onClick={onPersonalise}>
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

const GiftingBagHero = ({ isSeparate }: { isSeparate: boolean }) => (
  <div className="flex flex-col gap-6">
    <p className="font-gill text-base font-light leading-110 text-darkblack">
      {isSeparate
        ? "Each of your items will be delivered in separate bags"
        : "Your items will be gift wrapped in a single bag"}
    </p>
    <div className="relative h-[140px] w-full overflow-hidden bg-gray200">
      <div
        className="absolute inset-x-0 top-[-26px] h-[192px] bg-gradient-to-b from-gray200 via-gray300/60 to-gray200"
        aria-hidden
      />
    </div>
  </div>
);

const GiftingScrollIndicator = () => (
  <div
    className="pointer-events-none absolute bottom-6 right-0 top-6 flex w-[2px] justify-center rounded-[70px] bg-neutral300"
    aria-hidden
  >
    <div className="h-[246px] w-[3px] bg-gray600" />
  </div>
);

const GiftingPersonalisePanel = ({ onClose }: { onClose: () => void }) => {
  const { items, updateLineItemGifting } = useCart();
  const [wrapMode, setWrapMode] = useState<"single" | "separate">("single");
  const [giftNote, setGiftNote] = useState("");
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(
    () => new Set(items.map((item) => item.id)),
  );

  useEffect(() => {
    setSelectedItemIds(new Set(items.map((item) => item.id)));
  }, [items]);

  const isSeparate = wrapMode === "separate";

  const selectedItems = useMemo(
    () => items.filter((item) => selectedItemIds.has(item.id)),
    [items, selectedItemIds],
  );

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
    selectedItems.forEach((item) => {
      const note =
        wrapMode === "separate"
          ? itemNotes[item.id]?.trim()
          : giftNote.trim();

      updateLineItemGifting(item.id, {
        wrapMode,
        note: note || undefined,
      });
    });
    onClose();
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
        <p className="font-gill text-base font-normal leading-110 text-darkblack">
          {formatCartPrice(item.product.price)}
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-white">
      <div className="w-full shrink-0 px-6 pt-10">
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

      <div className="relative min-h-0 flex-1 pb-5">
        <div className="flex h-full min-h-0 flex-col gap-6 overflow-y-auto px-6 pb-6 pt-6">
          <GiftingBagHero isSeparate={isSeparate} />

          {!isSeparate ? (
            <GiftingNoteField
              id="gift-note"
              value={giftNote}
              onChange={setGiftNote}
            />
          ) : null}

          <div className="flex flex-col gap-6">
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

          <div className="flex items-center justify-between gap-4">
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

      <div className="relative shrink-0 border-t border-neutral300 bg-white px-4 py-6 [border-top-width:0.5px]">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-full h-[71px] bg-gradient-to-b from-transparent to-white"
          aria-hidden
        />
        <CartPrimaryButton type="button" className="w-full uppercase" onClick={applyGifting}>
          Save
        </CartPrimaryButton>
      </div>
    </div>
  );
};

const GiftingDesktopModal = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useGiftingModalEffects(open, onClose);

  useEffect(() => {
    if (!open) {
      setIsVisible(false);
      return;
    }

    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      cancelAnimationFrame(frame);
      setIsVisible(false);
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="pointer-events-none absolute inset-0 backdrop-blur-[4.5px]" aria-hidden />
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center p-4",
          giftingFadeClassName,
          isVisible ? "opacity-100" : "opacity-0",
        )}
      >
        <button
          type="button"
          aria-label="Close gifting options"
          onClick={onClose}
          className="absolute inset-0 bg-[rgba(30,30,30,0.75)]"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gifting options"
          className="relative z-10 w-full max-w-[560px]"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const GiftingOptionsPanel = () => {
  const { isGiftingPanelOpen, closeGiftingPanel, giftingStep, openGiftingPanel } = useCartUI();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const introPanel = (
    <GiftingIntroPanel
      onClose={closeGiftingPanel}
      onPersonalise={() => openGiftingPanel("personalise")}
    />
  );

  const personalisePanel = <GiftingPersonalisePanel onClose={closeGiftingPanel} />;

  if (isMobile) {
    return (
      <Drawer
        open={isGiftingPanelOpen}
        shouldScaleBackground={false}
        onOpenChange={(open) => !open && closeGiftingPanel()}
      >
        <DrawerContent
          className={cn(
            "max-h-[90vh] rounded-none border-0 p-0 [&>div:first-child]:hidden",
            giftingStep === "intro" ? "bg-gray300" : "bg-white",
          )}
        >
          <DrawerTitle className="sr-only">Gifting options</DrawerTitle>
          {giftingStep === "intro" ? introPanel : personalisePanel}
        </DrawerContent>
      </Drawer>
    );
  }

  if (giftingStep === "intro") {
    return (
      <GiftingDesktopModal open={isGiftingPanelOpen} onClose={closeGiftingPanel}>
        {introPanel}
      </GiftingDesktopModal>
    );
  }

  return (
    <Sheet open={isGiftingPanelOpen} onOpenChange={(open) => !open && closeGiftingPanel()}>
      <SheetContent
        side="right"
        overlayClassName="bg-[rgba(30,30,30,0.75)] backdrop-blur-[4.5px]"
        className={cn(
          "h-full w-full max-w-[472px] gap-0 border-0 p-0 shadow-none sm:max-w-[472px]",
          "[&>button]:hidden",
        )}
      >
        <SheetTitle className="sr-only">Gifting options</SheetTitle>
        <div className="h-full max-h-screen overflow-hidden">{personalisePanel}</div>
      </SheetContent>
    </Sheet>
  );
};

export default GiftingOptionsPanel;
