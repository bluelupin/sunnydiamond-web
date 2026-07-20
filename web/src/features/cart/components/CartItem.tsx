import { useEffect, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import type { CartLineItem, CartLineOptions } from "../types/cart.types";
import { formatCartLineMeta, formatCartPrice } from "../utils/formatCartLine";
import {
  CartDivider,
  CartGiftBadge,
  CartGiftCheckbox,
  CartMetaRow,
  CartOutlineButton,
  CartTextLink,
} from "./CartFlowUi";
import DeleteIcon from "@/assets/Icons/DeleteIcon";

interface CartItemProps {
  item: CartLineItem;
  onUpdateQuantity: (lineItemId: string, quantity: number) => void;
  onRemove: (lineItemId: string) => void;
  onUpdateOptions: (lineItemId: string, options: Partial<CartLineOptions>) => void;
}

const ENGRAVING_PLACEHOLDER = "Diya Gupta";

const CartItem = ({ item, onRemove, onUpdateOptions }: CartItemProps) => {
  const { product, quantity, options } = item;
  const { toggleWishlist, isWishlisted } = useWishlist();
  const meta = formatCartLineMeta(item);
  const wishlisted = isWishlisted(product.id);
  const isGift = Boolean(options.isGift || item.gifting);
  const [isEditingEngraving, setIsEditingEngraving] = useState(false);
  const [engravingDraft, setEngravingDraft] = useState(options.engraving ?? "");

  useEffect(() => {
    if (!isEditingEngraving) {
      setEngravingDraft(options.engraving ?? "");
    }
  }, [options.engraving, isEditingEngraving]);

  const handleEngravingAction = () => {
    if (!isEditingEngraving) {
      setEngravingDraft(options.engraving ?? "");
      setIsEditingEngraving(true);
      return;
    }

    const trimmed = engravingDraft.trim();
    onUpdateOptions(item.id, { engraving: trimmed || undefined });
    setIsEditingEngraving(false);
  };

  const handleEngravingKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleEngravingAction();
    }

    if (event.key === "Escape") {
      setEngravingDraft(options.engraving ?? "");
      setIsEditingEngraving(false);
    }
  };

  return (
    <article className="relative flex flex-col gap-4 bg-white px-4 lg:gap-6 lg:px-6 py-6">
      {isGift ? (
        <CartGiftBadge variant="cart" className="absolute left-0 top-0 z-10" />
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 gap-4 lg:max-w-[499.5px] lg:gap-6">
          <Link
            href={`/product/${product.id}`}
            className="relative h-[68px] w-[91px] shrink-0 overflow-hidden bg-white lg:h-[105px] lg:w-[140px]"
          >
            <OptimizedImage src={product.image} alt={product.name} />
          </Link>

          <div className="flex min-w-0 flex-1 flex-col lg:w-[176px] lg:max-w-[176px] gap-8">
            <div className="flex flex-col gap-2 lg:gap-3">
              <Link
                href={`/product/${product.id}`}
                className="font-gill text-sm leading-110 text-darkblack transition-colors hover:text-darkMagenta lg:text-base"
              >
                {product.name}
              </Link>

              <CartMetaRow parts={meta} />

              <p className="font-gill text-sm leading-110 text-darkblack lg:text-base">
                {formatCartPrice(product.price * quantity)}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <CartTextLink href={`/product/${product.id}`}>Edit</CartTextLink>
              <CartTextLink onClick={() => toggleWishlist(product.id)}>
                {wishlisted ? "In wishlist" : "Move to wishlist"}
              </CartTextLink>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${product.name}`}
          className="shrink-0 text-darkblack transition-opacity hover:opacity-70"
        >
          <DeleteIcon className="size-6" />
        </button>
      </div>

      <CartDivider weight={0.5} />

      <label className="flex w-fit cursor-pointer items-center gap-2">
        <CartGiftCheckbox
          checked={isGift}
          onChange={(checked) => onUpdateOptions(item.id, { isGift: checked })}
        />
        <span className="font-gill text-sm leading-110 text-darkblack lg:text-base">
          Mark this as a gift
        </span>
      </label>

      <CartDivider weight={0.5} />

      <div className="flex flex-col gap-2 self-stretch">
        <p className="font-gill text-base font-normal leading-110 text-darkblack lg:text-xl">
          Engraving
        </p>

        <div className="flex gap-2 self-stretch">
          <div className="flex h-14 min-w-0 flex-1 items-center bg-aboutInactive px-3">
            {isEditingEngraving ? (
              <input
                type="text"
                value={engravingDraft}
                onChange={(event) => setEngravingDraft(event.target.value)}
                onKeyDown={handleEngravingKeyDown}
                placeholder={ENGRAVING_PLACEHOLDER}
                aria-label="Engraving text"
                autoFocus
                className="h-full w-full min-w-0 border-0 bg-transparent font-gill text-sm leading-110 text-darkblack outline-none placeholder:text-neutral500 lg:text-base"
              />
            ) : (
              <p className="truncate font-gill text-sm leading-110 text-darkblack lg:text-base">
                {options.engraving ?? ENGRAVING_PLACEHOLDER}
              </p>
            )}
          </div>
          <CartOutlineButton
            type="button"
            onClick={handleEngravingAction}
            className="h-14 w-auto shrink-0 px-5 uppercase lg:px-7"
          >
            {isEditingEngraving ? "Save" : "Modify"}
          </CartOutlineButton>
        </div>
      </div>
    </article>
  );
};

export default CartItem;
