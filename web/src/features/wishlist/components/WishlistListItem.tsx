"use client";

import Link from "next/link";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { getWishlistProductHref } from "@/features/wishlist/utils/resolveWishlistProducts";
import { wishlistPageContent } from "@/features/wishlist/data/content";

type WishlistListItemProps = {
  product: JewelleryListingProduct;
  onRemove: () => void;
  onAddToBag: () => void;
};

const WishlistListItem = ({ product, onRemove, onAddToBag }: WishlistListItemProps) => {
  const href = getWishlistProductHref(product.id);

  return (
    <article className="flex gap-4 border-b border-neutral300 bg-white px-4 py-6 last:border-b-0">
      <Link
        href={href}
        className="flex size-[120px] shrink-0 items-center justify-center border border-red-500 bg-gray200 [&_img]:mx-auto [&_picture]:mx-auto [&_picture]:block [&_picture]:w-auto"
      >
        <OptimizedImage
          src={product.primaryImage}
          alt={product.name}
          width={120}
          height={120}
          className="mx-auto max-h-[88px] w-auto border border-red-500 object-contain"
          sizes="120px"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
        <Link
          href={href}
          className="line-clamp-2 max-w-[153px] font-gill text-sm font-light leading-110 text-darkblack"
        >
          {product.name}
        </Link>
        <p className="font-gill text-sm font-semibold leading-110 text-darkblack">
          <span aria-hidden>₹ </span>
          {formatJewelleryPrice(product.price)}
        </p>
        <div className="mt-1 flex items-center gap-6">
          <DetailTextLink onClick={onAddToBag} className="uppercase">
            {wishlistPageContent.addToBagLabel}
          </DetailTextLink>
          <DetailTextLink onClick={onRemove} className="uppercase">
            {wishlistPageContent.removeLabel}
          </DetailTextLink>
        </div>
      </div>
    </article>
  );
};

export default WishlistListItem;
