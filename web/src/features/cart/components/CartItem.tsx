"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  DEFAULT_ENGRAVING_MAX_CHARACTERS,
  isCartLineEngravingEnabled,
  type EngravingSelection,
} from "@/features/products/constants/engraving";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { cn } from "@/shared/utils/cn";
import { productNameDisplayClassName } from "@/shared/utils/productNameDisplay";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import { useCart } from "../context/CartContext";
import type { CartLineItem, CartLineOptions } from "../types/cart.types";
import { formatCartLineMeta, formatCartPrice, getCartLineDisplayTotal } from "../utils/formatCartLine";
import { getCartItemGiftNote, type CartGiftNoteDisplay } from "../utils/cartGiftNotes";
import { useCartUI } from "../context/CartUIContext";
import { useCartCheckout } from "../hooks/useCartCheckout";
import {
  CartActionLink,
  CartDivider,
  CartGiftBadge,
  CartGiftCheckbox,
  CartMetaRow,
  CartOutlineButton,
} from "./CartFlowUi";
import DeleteIcon from "@/assets/Icons/DeleteIcon";
import { GiftingCheckboxLabelRow } from "@/shared/ui/GiftingCheckboxLabelRow";
import { getProductEditHref } from "@/features/products/utils/productRoutes";

const MetalEngravingPanel = dynamic(
  () => import("@/features/products/components/detail/MetalEngravingPanel"),
  { ssr: false },
);

interface CartItemProps {
  item: CartLineItem;
  giftNoteDisplay: CartGiftNoteDisplay;
  onUpdateQuantity: (lineItemId: string, quantity: number) => void;
  onRemove: (lineItemId: string) => void;
  onUpdateOptions: (lineItemId: string, options: Partial<CartLineOptions>) => Promise<void>;
}

const ENGRAVING_EMPTY_LABEL = "Metal Engraving (Optional)";

const CartItem = ({ item, giftNoteDisplay, onRemove, onUpdateOptions }: CartItemProps) => {
  const { buyNow, getLineItemMetadata, removeItem, showCartStatusToast } = useCart();
  const { isWishlisted, addToWishlist } = useWishlist();
  const { clearGiftingOptionsExplored } = useCartUI();
  const { navigateToCheckout, isNavigatingToCheckout } = useCartCheckout();
  const { product, quantity, options } = item;
  const meta = formatCartLineMeta(item);
  const wishlisted = isWishlisted(product.id);
  const isGift =
    options.isGift === false ? false : Boolean(options.isGift || item.gifting);
  const supportsEngraving = isCartLineEngravingEnabled(options);
  const engravingMaxCharacters = options.engravingMaxCharacters ?? DEFAULT_ENGRAVING_MAX_CHARACTERS;
  const hasEngraving = Boolean(options.engraving?.trim());
  const itemGiftNote = getCartItemGiftNote(item, giftNoteDisplay);
  const [isEngravingOpen, setIsEngravingOpen] = useState(false);
  const [isSavingEngraving, setIsSavingEngraving] = useState(false);
  const [movedToWishlist, setMovedToWishlist] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isMovingToWishlist, setIsMovingToWishlist] = useState(false);

  const engravingFont = options.engravingFont?.trim();
  const lineMetadata = getLineItemMetadata(item.id);
  const fontLabels =
    product.customOptions?.engravingFont?.labels ??
    lineMetadata?.productCustomOptions?.engravingFont?.labels ??
    [];
  const availableEngravingFonts =
    engravingFont && !fontLabels.includes(engravingFont)
      ? [engravingFont, ...fontLabels]
      : fontLabels;

  const initialEngravingSelection = useMemo<EngravingSelection | null>(() => {
    if (!hasEngraving) {
      return null;
    }

    return {
      text: options.engraving!.trim(),
      font: engravingFont || availableEngravingFonts[0] || "",
    };
  }, [
    availableEngravingFonts,
    engravingFont,
    hasEngraving,
    options.engraving,
  ]);

  const openEngravingDrawer = () => {
    if (isNavigatingToCheckout || isSavingEngraving) {
      return;
    }

    setIsEngravingOpen(true);
  };

  const handleEngravingSave = async (value: EngravingSelection | null) => {
    const trimmed = value?.text?.trim() ?? "";
    const nextFont = value?.font?.trim() ?? "";
    const fontChanged =
      trimmed !== "" && nextFont !== "" && nextFont !== (engravingFont ?? "");

    setIsSavingEngraving(true);

    try {
      await onUpdateOptions(item.id, {
        engraving: trimmed,
        ...(fontChanged ? { engravingFont: nextFont } : {}),
      });
    } catch (error) {
      showCartStatusToast(
        error instanceof Error && error.message.trim()
          ? error.message.trim()
          : "Could not save the engraving. Please try again.",
      );
      throw error;
    } finally {
      setIsSavingEngraving(false);
    }
  };

  const handleMoveToWishlist = () => {
    if (isNavigatingToCheckout || isMovingToWishlist) return;

    void (async () => {
      setIsMovingToWishlist(true);
      try {
        await addToWishlist(product.id);
        await removeItem(item.id, { showToast: false });
        setMovedToWishlist(true);
      } catch {
        // Login modal or API failure — keep the cart line unchanged.
      } finally {
        setIsMovingToWishlist(false);
      }
    })();
  };

  const handleBuyNow = () => {
    if (isNavigatingToCheckout) return;
    void (async () => {
      setIsBuyingNow(true);
      try {
        await buyNow(item.id);
        navigateToCheckout();
      } finally {
        setIsBuyingNow(false);
      }
    })();
  };

  const productHref = getProductEditHref(product, item.id);

  return (
    <article className="relative flex flex-col gap-4 bg-white px-4 lg:gap-6 lg:px-6 py-6">
      {isGift ? (
        <CartGiftBadge className="absolute left-0 top-0 z-10" />
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 gap-4 lg:max-w-[499.5px] lg:gap-6">
          <Link
            href={productHref}
            onClick={(event) => {
              if (isNavigatingToCheckout) event.preventDefault();
            }}
            aria-disabled={isNavigatingToCheckout || undefined}
            className={cn(
              "relative size-[68px] shrink-0 overflow-hidden bg-white lg:size-[140px]",
              isNavigatingToCheckout && "pointer-events-none",
            )}
          >
            <OptimizedImage
              src={product.image}
              alt={product.name}
              width={140}
              height={140}
              className="size-full object-contain"
              sizes="(max-width: 1024px) 68px, 140px"
            />
          </Link>

          <div className="flex min-w-0 flex-1 flex-col items-start gap-8 lg:w-[300px] lg:max-w-[300px]">
            <div className="flex flex-col items-start gap-3">
              <Link
                href={productHref}
                onClick={(event) => {
                  if (isNavigatingToCheckout) event.preventDefault();
                }}
                aria-disabled={isNavigatingToCheckout || undefined}
                className={cn(
                  "font-gill text-base font-normal leading-110 text-darkblack transition-colors hover:text-darkMagenta",
                  productNameDisplayClassName,
                  isNavigatingToCheckout && "pointer-events-none",
                )}
              >
                {product.name}
              </Link>

              <CartMetaRow parts={meta} />

              {quantity > 1 ? (
                <p className="font-gill text-sm font-light leading-110 text-neutral500">
                  Qty: {quantity}
                </p>
              ) : null}

              <p className="font-gill text-base font-normal leading-110 text-darkblack">
                {formatCartPrice(getCartLineDisplayTotal(item))}
              </p>
            </div>

            <div className="flex items-start gap-4">
              <CartActionLink href={productHref} disabled={isNavigatingToCheckout}>
                Edit
              </CartActionLink>
              <CartActionLink
                onClick={handleMoveToWishlist}
                disabled={isNavigatingToCheckout || isMovingToWishlist}
              >
                Move to wishlist
              </CartActionLink>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isNavigatingToCheckout) return;
            onRemove(item.id);
          }}
          disabled={isNavigatingToCheckout}
          aria-label={`Remove ${product.name}`}
          className="shrink-0 text-darkblack transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <DeleteIcon className="size-6" />
        </button>
      </div>

      <CartDivider weight={0.5} />

      <label
        className={cn(
          isNavigatingToCheckout ? "cursor-not-allowed" : "cursor-pointer",
        )}
      >
        <GiftingCheckboxLabelRow
          gap={2}
          checkbox={
            <CartGiftCheckbox
              checked={isGift}
              disabled={isNavigatingToCheckout}
              onChange={(checked) => {
                if (isNavigatingToCheckout) return;
                if (checked) {
                  clearGiftingOptionsExplored();
                }
                void onUpdateOptions(item.id, { isGift: checked });
              }}
            />
          }
          label="Mark this as a gift"
        />
      </label>

      {supportsEngraving ? (
        <>
          <CartDivider weight={0.5} />

          <div className="flex flex-col gap-2 self-stretch">
            <p className="font-gill text-base font-normal leading-110 text-darkblack lg:text-xl">
              Engraving
            </p>

            <div className="flex gap-2 self-stretch">
              <div className="flex h-14 min-w-0 flex-1 items-center bg-aboutInactive px-3">
                <p
                  className={
                    hasEngraving
                      ? "truncate font-gill text-sm leading-110 text-darkblack lg:text-base"
                      : "truncate font-gill text-sm leading-110 text-neutral500 lg:text-base"
                  }
                >
                  {hasEngraving ? options.engraving!.trim() : ENGRAVING_EMPTY_LABEL}
                </p>
              </div>
              <CartOutlineButton
                type="button"
                onClick={openEngravingDrawer}
                disabled={isSavingEngraving || isNavigatingToCheckout}
                className="h-14 w-auto shrink-0 px-5 uppercase lg:px-7"
              >
                {hasEngraving ? "Modify" : "Add"}
              </CartOutlineButton>
            </div>

            {/* {hasEngraving && engravingFont ? (
              <p className="font-gill text-sm font-light leading-110 text-neutral500 lg:text-base">
                <span className="font-normal text-darkblack">Font:</span> {engravingFont}
              </p>
            ) : null} */}
          </div>

          <MetalEngravingPanel
            open={isEngravingOpen}
            onClose={() => setIsEngravingOpen(false)}
            previewImage={product.engraving?.previewImage}
            productImage={product.image}
            fonts={availableEngravingFonts}
            maxCharacters={engravingMaxCharacters}
            initialValue={initialEngravingSelection}
            onSave={handleEngravingSave}
          />
        </>
      ) : null}
    </article>
  );
};

export default CartItem;
