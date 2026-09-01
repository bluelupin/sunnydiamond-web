"use client";

import Link from "next/link";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { getWishlistProductHref } from "@/features/wishlist/utils/wishlistProduct.utils";
import { prefetchWishlistProductDetail } from "@/features/wishlist/utils/wishlistProductDetailPrefetch";
import { wishlistPageContent } from "@/features/wishlist/data/content";
import { cn } from "@/shared/utils/cn";

type WishlistListItemLayout = "default" | "profile";

type WishlistListItemProps = {
  product: JewelleryListingProduct;
  layout?: WishlistListItemLayout;
  onRemove: () => void;
  onAddToBag: () => void;
};

/** Mobile list row — Figma 2574:57451 (chalk card, image, ADD TO BAG + REMOVE). */
const WishlistListItem = ({
  product,
  layout = "default",
  onRemove,
  onAddToBag,
}: WishlistListItemProps) => {
  const href = getWishlistProductHref(product);
  const isProfileLayout = layout === "profile";

  return (
    <article
      className={cn(
        "flex w-full flex-col items-center gap-4 bg-gray200 px-4 py-10",
        isProfileLayout && "bg-gray200",
      )}
    >
      <Link
        href={href}
        className="flex h-[140px] w-full items-center justify-center"
      >
        <div className="relative h-[70px] w-[94px] shrink-0">
          <OptimizedImage
            src={product.primaryImage}
            alt={product.name}
            width={94}
            height={70}
            className="h-full w-full object-contain"
          />
        </div>
      </Link>

      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link
            href={href}
            className="line-clamp-2 max-w-full font-gill text-sm font-light leading-110 text-darkblack"
          >
            {product.name}
          </Link>
          <p className="font-gill text-sm font-normal leading-110 text-darkblack">
            <span aria-hidden>₹ </span>
            {formatJewelleryPrice(product.price)}
          </p>
        </div>

        <div className="flex w-full items-start justify-center gap-6">
          <span
            onPointerEnter={() => prefetchWishlistProductDetail(product.urlKey)}
            onFocus={() => prefetchWishlistProductDetail(product.urlKey)}
          >
            <DetailTextLink onClick={onAddToBag} className="text-sm uppercase">
              {wishlistPageContent.addToBagLabel}
            </DetailTextLink>
          </span>
          <DetailTextLink onClick={onRemove} className="text-sm uppercase">
            {wishlistPageContent.removeLabel}
          </DetailTextLink>
        </div>
      </div>
    </article>
  );
};

export default WishlistListItem;
