"use client";

import Link from "next/link";
import WishlistRemoveIcon from "@/assets/Icons/WishlistRemoveIcon";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { getWishlistProductHref } from "@/features/wishlist/utils/resolveWishlistProducts";
import { wishlistPageContent } from "@/features/wishlist/data/content";
import { cn } from "@/shared/utils/cn";
import DeleteIcon from "@/assets/Icons/DeleteIcon";

type WishlistCardProps = {
  product: JewelleryListingProduct;
  onRemove: () => void;
  onAddToBag: () => void;
};

const WishlistCard = ({ product, onRemove, onAddToBag }: WishlistCardProps) => {
  const href = getWishlistProductHref(product.id);

  return (
    <article
      className={cn(
        "relative grid h-[270px] grid-cols-1 grid-rows-1 overflow-hidden md:h-[521px] bg-transparent",
      )}
    >
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${product.name}`}
        className="absolute top-2 right-2 flex items-center justify-center"
      >
        <DeleteIcon className="md:size-6 size-5 text-darkblack" />
      </button>

      <div className="pointer-events-none col-start-1 row-start-1 flex flex-col items-center md:py-10 md:px-6 py-6 px-4">
        <Link href={href} className="pointer-events-auto block md:max-w-[426px] max-w-[155px] md:max-h-[303px] max-h-[110px] mx-auto border border-blue-300">
          <OptimizedImage
            src={product.primaryImage}
            alt={product.name}
            width={372}
            height={287}
            className="w-full h-full object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </Link>
      </div>

      <div className="pointer-events-none col-start-1 row-start-1 z-10 flex flex-col justify-end px-4 pb-6 md:px-6 md:pb-10">
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
      </div>
    </article>
  );
};

export default WishlistCard;
