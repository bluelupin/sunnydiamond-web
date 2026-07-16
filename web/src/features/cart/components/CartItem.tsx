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
  CartOutlineLink,
  CartTextLink,
} from "./CartFlowUi";
import DeleteIcon from "@/assets/Icons/DeleteIcon";

interface CartItemProps {
  item: CartLineItem;
  onUpdateQuantity: (lineItemId: string, quantity: number) => void;
  onRemove: (lineItemId: string) => void;
  onUpdateOptions: (lineItemId: string, options: Partial<CartLineOptions>) => void;
}

const CartItem = ({ item, onRemove, onUpdateOptions }: CartItemProps) => {
  const { product, quantity, options } = item;
  const { toggleWishlist, isWishlisted } = useWishlist();
  const meta = formatCartLineMeta(item);
  const wishlisted = isWishlisted(product.id);
  const isGift = Boolean(options.isGift || item.gifting);

  return (
    <article className="relative flex flex-col gap-4 bg-white p-4 lg:gap-6 lg:p-6">
      {isGift ? (
        <CartGiftBadge variant="cart" className="absolute left-0 top-0 z-10" />
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 gap-4 lg:max-w-[499.5px] lg:gap-6">
          <Link
            href={`/product/${product.id}`}
            className="relative h-[68px] w-[91px] shrink-0 overflow-hidden bg-white border border-blue-300 lg:h-[105px] lg:w-[140px]"
          >
            <OptimizedImage src={product.image} alt={product.name} />
          </Link>

          <div className="flex min-w-0 flex-1 flex-col gap-3 lg:w-[176px] lg:max-w-[176px] lg:gap-8">
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
            <p className="truncate font-gill text-sm leading-110 text-darkblack lg:text-base">
              {options.engraving ?? "Diya Gupta"}
            </p>
          </div>
          <CartOutlineLink
            href={`/product/${product.id}`}
            className="h-14 w-auto shrink-0 px-5 uppercase lg:px-7"
          >
            Modify
          </CartOutlineLink>
        </div>
      </div>
    </article>
  );
};

export default CartItem;
