"use client";

import Link from "next/link";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { getWishlistProductHref } from "@/features/wishlist/utils/wishlistProduct.utils";
import { wishlistPageContent } from "@/features/wishlist/data/content";
import DeleteIcon from "@/assets/Icons/DeleteIcon";

type WishlistCardProps = {
  product: JewelleryListingProduct;
  onRemove: () => void;
  onAddToBag: () => void;
};

const WishlistCard = ({ product, onRemove, onAddToBag }: WishlistCardProps) => {
  const href = getWishlistProductHref(product);

  return (
    <article className="relative grid grid-cols-1 grid-rows-1 gap-4 overflow-hidden px-4 py-6 md:gap-6 md:px-6 md:py-10">
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${product.name}`}
        className="absolute right-2 top-2 flex items-center justify-center md:hidden"
      >
        <DeleteIcon className="size-6 text-darkblack" />
      </button>
      <Link
        href={href}
        className="pointer-events-auto mx-auto block h-[110px] w-[110px] sm:h-[240px] sm:w-[240px] md:h-[240px] md:w-[240px] lg:h-[303px] lg:w-[303px]"
      >
        <OptimizedImage
          src={product.primaryImage}
          alt={product.name}
          width={372}
          height={287}
          className="h-full w-full object-cover"
        />
      </Link>
      <div className="pointer-events-auto flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 md:gap-3">
          <Link
            href={href}
            className="line-clamp-2 max-w-[153px] min-h-[30px] text-center font-gill text-sm font-light leading-110 text-darkblack md:max-w-none md:min-h-0 md:text-xl"
          >
            {product.name}
          </Link>
          <p className="font-gill text-sm font-semibold leading-110 text-darkblack md:text-xl">
            <span aria-hidden>₹ </span>
            {formatJewelleryPrice(product.price)}
          </p>
        </div>
        <div className="flex items-center justify-center gap-6">
          <DetailTextLink onClick={onAddToBag} className="text-sm uppercase md:text-base">
            {wishlistPageContent.addToBagLabel}
          </DetailTextLink>
          <DetailTextLink
            onClick={onRemove}
            className="hidden text-sm uppercase md:inline-flex md:text-base"
          >
            {wishlistPageContent.removeLabel}
          </DetailTextLink>
        </div>
      </div>
    </article>
  );
};

export default WishlistCard;
