"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import {
  clampEngravingText,
  DEFAULT_ENGRAVING_MAX_CHARACTERS,
  ENGRAVING_TEXT_SANITIZE_PATTERN,
  isCartLineEngravingEnabled,
} from "@/features/products/constants/engraving";
import FormFieldError from "@/shared/ui/FormFieldError";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { cn } from "@/shared/utils/cn";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCart } from "../context/CartContext";
import type { CartLineItem, CartLineOptions } from "../types/cart.types";
import { formatCartLineMeta, formatCartPrice, getCartLineDisplayTotal } from "../utils/formatCartLine";
import { getCartItemGiftNote, type CartGiftNoteDisplay } from "../utils/cartGiftNotes";
import { useCartUI } from "../context/CartUIContext";
import { useCartCheckout } from "../hooks/useCartCheckout";
import {
  CartDivider,
  CartGiftBadge,
  CartGiftCheckbox,
  CartMetaRow,
  CartOutlineButton,
  CartTextLink,
} from "./CartFlowUi";
import DeleteIcon from "@/assets/Icons/DeleteIcon";
import { getProductEditHref } from "@/features/products/utils/productRoutes";

interface CartItemProps {
  item: CartLineItem;
  giftNoteDisplay: CartGiftNoteDisplay;
  onUpdateQuantity: (lineItemId: string, quantity: number) => void;
  onRemove: (lineItemId: string) => void;
  onUpdateOptions: (lineItemId: string, options: Partial<CartLineOptions>) => Promise<void>;
}

const ENGRAVING_EMPTY_LABEL = "Metal Engraving (Optional)";

const CartItem = ({ item, giftNoteDisplay, onRemove, onUpdateOptions }: CartItemProps) => {
  const { buyNow } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { status } = useAuth();
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
  const [isEditingEngraving, setIsEditingEngraving] = useState(false);
  const [engravingDraft, setEngravingDraft] = useState(options.engraving ?? "");
  const [engravingError, setEngravingError] = useState<string | null>(null);
  const [isSavingEngraving, setIsSavingEngraving] = useState(false);
  const [movedToWishlist, setMovedToWishlist] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const engravingFont = options.engravingFont?.trim();
  const engravingErrorId = `cart-engraving-error-${item.id}`;

  const clampDraft = (value: string) =>
    engravingMaxCharacters ? clampEngravingText(value, engravingMaxCharacters) : value;

  const sanitizeDraft = (value: string) =>
    clampDraft(value.replace(ENGRAVING_TEXT_SANITIZE_PATTERN, ""));

  useEffect(() => {
    if (!isEditingEngraving) {
      setEngravingDraft(options.engraving ?? "");
    }
  }, [options.engraving, isEditingEngraving]);

  const handleEngravingAction = () => {
    if (isNavigatingToCheckout) {
      return;
    }

    if (!isEditingEngraving) {
      setEngravingDraft(options.engraving ?? "");
      setEngravingError(null);
      setIsEditingEngraving(true);
      return;
    }

    if (isSavingEngraving) {
      return;
    }

    const trimmed = clampDraft(engravingDraft.trim());
    setIsSavingEngraving(true);
    void (async () => {
      try {
        await onUpdateOptions(item.id, { engraving: trimmed });
        setEngravingError(null);
        setIsEditingEngraving(false);
      } catch (error) {
        // Keep the edit row open so the shopper can correct and retry.
        setEngravingError(
          error instanceof Error && error.message.trim()
            ? error.message.trim()
            : "Could not save the engraving. Please try again.",
        );
      } finally {
        setIsSavingEngraving(false);
      }
    })();
  };

  const handleEngravingKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleEngravingAction();
    }

    if (event.key === "Escape") {
      setEngravingDraft(options.engraving ?? "");
      setEngravingError(null);
      setIsEditingEngraving(false);
    }
  };

  const handleMoveToWishlist = () => {
    if (isNavigatingToCheckout) return;
    toggleWishlist(product.id);
    if (status !== "authenticated") {
      return;
    }
    onRemove(item.id);
    setMovedToWishlist(true);
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
      {/* {isGift ? (
        <CartGiftBadge variant="cart" className="absolute left-0 top-0 z-10" />
      ) : null} */}

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

          <div className="flex min-w-0 flex-1 flex-col lg:w-[176px] lg:max-w-[176px] gap-8">
            <div className="flex flex-col gap-2 lg:gap-3">
              <Link
                href={productHref}
                onClick={(event) => {
                  if (isNavigatingToCheckout) event.preventDefault();
                }}
                aria-disabled={isNavigatingToCheckout || undefined}
                className={cn(
                  "font-gill text-sm leading-110 text-darkblack transition-colors hover:text-darkMagenta lg:text-base",
                  isNavigatingToCheckout && "pointer-events-none",
                )}
              >
                {product.name}
              </Link>

              <CartMetaRow parts={meta} />

              {/* {itemGiftNote ? (
                <p className="font-gill text-sm font-light leading-110 text-neutral500 lg:text-base">
                  <span className="font-normal text-darkblack">Gift note:</span> {itemGiftNote}
                </p>
              ) : null} */}

              {quantity > 1 ? (
                <p className="font-gill text-sm font-light leading-110 text-neutral500">
                  Qty: {quantity}
                </p>
              ) : null}

              <p className="font-gill text-sm leading-110 text-darkblack lg:text-base">
                {formatCartPrice(getCartLineDisplayTotal(item))}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <CartTextLink href={productHref} disabled={isNavigatingToCheckout}>EDIT</CartTextLink>
              {/* {movedToWishlist ? (
                <span className="font-gill text-sm uppercase leading-110 text-neutral500 lg:text-base">
                  Moved to Wishlist
                </span>
              ) : (
                <CartTextLink onClick={handleMoveToWishlist}>
                  {wishlisted ? "IN WISHLIST" : "MOVE TO WISHLIST"}
                </CartTextLink>
              )} */}
              <CartTextLink onClick={handleMoveToWishlist} disabled={isNavigatingToCheckout}>
                {!wishlisted && "MOVE TO WISHLIST"}
              </CartTextLink>
              {/* <CartTextLink onClick={handleBuyNow} className={isBuyingNow ? "opacity-50" : ""}>
                BUY NOW
              </CartTextLink> */}
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

      <label className={cn("inline-flex w-fit items-center gap-2", isNavigatingToCheckout ? "cursor-not-allowed" : "cursor-pointer")}>
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
        <span className="font-gill text-sm leading-4 text-darkblack lg:text-base lg:leading-5">
          Mark this as a gift
        </span>
      </label>

      {supportsEngraving ? (
        <>
          <CartDivider weight={0.5} />

          <div className="flex flex-col gap-2 self-stretch">
            <div className="flex items-center justify-between gap-4">
              <p className="font-gill text-base font-normal leading-110 text-darkblack lg:text-xl">
                Engraving
              </p>
              {isEditingEngraving && engravingMaxCharacters ? (
                <span className="font-gill text-sm font-light leading-110 text-neutral500">
                  {engravingDraft.length}/{engravingMaxCharacters}
                </span>
              ) : null}
            </div>

            <div className="flex gap-2 self-stretch">
              <div className="flex h-14 min-w-0 flex-1 items-center bg-aboutInactive px-3">
                {isEditingEngraving ? (
                  <input
                    type="text"
                    value={engravingDraft}
                    disabled={isNavigatingToCheckout}
                    onChange={(event) => {
                      if (isNavigatingToCheckout) return;
                      setEngravingDraft(sanitizeDraft(event.target.value));
                      setEngravingError(null);
                    }}
                    onKeyDown={handleEngravingKeyDown}
                    maxLength={engravingMaxCharacters}
                    aria-label="Engraving text"
                    aria-invalid={engravingError ? true : undefined}
                    aria-describedby={engravingError ? engravingErrorId : undefined}
                    autoFocus
                    className="h-full w-full min-w-0 border-0 bg-transparent font-gill text-sm leading-110 text-darkblack outline-none placeholder:text-neutral500 disabled:cursor-not-allowed lg:text-base"
                  />
                ) : (
                  <p
                    className={
                      hasEngraving
                        ? "truncate font-gill text-sm leading-110 text-darkblack lg:text-base"
                        : "truncate font-gill text-sm leading-110 text-neutral500 lg:text-base"
                    }
                  >
                    {hasEngraving ? options.engraving!.trim() : ENGRAVING_EMPTY_LABEL}
                  </p>
                )}
              </div>
              <CartOutlineButton
                type="button"
                onClick={handleEngravingAction}
                disabled={isSavingEngraving || isNavigatingToCheckout}
                className="h-14 w-auto shrink-0 px-5 uppercase lg:px-7"
              >
                {isEditingEngraving ? "Save" : hasEngraving ? "Modify" : "Add"}
              </CartOutlineButton>
            </div>

            {engravingError ? (
              <FormFieldError id={engravingErrorId} message={engravingError} />
            ) : null}

            {hasEngraving && engravingFont ? (
              <p className="font-gill text-sm font-light leading-110 text-neutral500 lg:text-base">
                <span className="font-normal text-darkblack">Font:</span> {engravingFont}
              </p>
            ) : null}
          </div>
        </>
      ) : null}
    </article>
  );
};

export default CartItem;
