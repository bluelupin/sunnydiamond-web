"use client";

import Link from "next/link";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { getWishlistProductHref } from "@/features/wishlist/utils/wishlistProduct.utils";
import { wishlistPageContent } from "@/features/wishlist/data/content";
import { cn } from "@/shared/utils/cn";
import DeleteIcon from "@/assets/Icons/DeleteIcon";

type WishlistCardProps = {
  product: JewelleryListingProduct;
  onRemove: () => void;
  onAddToBag: () => void;
  variant?: "page" | "profile";
};

const WishlistCard = ({ product, onRemove, onAddToBag, variant = "page" }: WishlistCardProps) => {
  const href = getWishlistProductHref(product);

  if (variant === "profile") {
    return (
      <article className="flex flex-col items-center gap-6 bg-gray200 px-6 py-10">
        <Link href={href} className="h-[303px] w-full overflow-hidden">
          <OptimizedImage
            src={product.primaryImage}
            alt={product.name}
            width={425}
            height={303}
            className="h-full w-full object-cover"
            sizes="50vw"
          />
        </Link>
        <div className="flex w-full flex-col items-center gap-6">
          <div className="flex w-full flex-col items-center gap-3 px-3">
            <Link
              href={href}
              className="text-center font-gill text-xl font-light leading-110 text-darkblack"
            >
              {product.name}
            </Link>
            <p className="w-full text-center font-gill text-xl font-semibold leading-110 text-darkblack">
              <span aria-hidden>₹ </span>
              {formatJewelleryPrice(product.price)}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <DetailTextLink onClick={onAddToBag} className="text-sm uppercase">
              {wishlistPageContent.addToBagLabel}
            </DetailTextLink>
            <DetailTextLink onClick={onRemove} className="text-sm uppercase">
              {wishlistPageContent.removeLabel}
            </DetailTextLink>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn("relative grid grid-cols-1 grid-rows-1 overflow-hidden md:py-10 md:px-6 py-6 px-4 md:gap-6 gap-4")}>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${product.name}`}
        className="absolute top-2 right-2 md:hidden flex items-center justify-center"
      >
        <DeleteIcon className="size-6 text-darkblack" />
      </button>
      <Link href={href} className="pointer-events-auto block lg:w-[303px] lg:h-[303px] md:h-[240px] md:w-[240px] sm:h-[240px] sm:w-[240px] h-[110px] w-[110px] mx-auto">
        <OptimizedImage
          src={product.primaryImage}
          alt={product.name}
          width={372}
          height={287}
          className="w-full h-full object-cover"
        // sizes="(max-width: 768px) 50vw, 33vw"
        />
      </Link>
      <div className="pointer-events-auto flex flex-col items-center gap-6">
        <div className="flex flex-col items-center md:gap-3 gap-2">
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
          <DetailTextLink onClick={onAddToBag} className="md:text-base text-sm uppercase">
            {wishlistPageContent.addToBagLabel}
          </DetailTextLink>
          <DetailTextLink onClick={onRemove} className="hidden md:inline-flex md:text-base text-sm uppercase">
            {wishlistPageContent.removeLabel}
          </DetailTextLink>
        </div>
      </div>
    </article>
  );
};

export default WishlistCard;
