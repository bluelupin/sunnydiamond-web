"use client";

import Link from "next/link";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { getWishlistProductHref } from "@/features/wishlist/utils/wishlistProduct.utils";
import { prefetchWishlistProductDetail } from "@/features/wishlist/utils/wishlistProductDetailPrefetch";
import { wishlistPageContent } from "@/features/wishlist/data/content";

type WishlistListItemProps = {
  product: JewelleryListingProduct;
  onRemove: () => void;
  onAddToBag: () => void;
};

const WishlistListItem = ({ product, onRemove, onAddToBag }: WishlistListItemProps) => {
  const href = getWishlistProductHref(product);

  return (
    <article className="flex flex-col gap-4 px-4 py-6 w-full">
      <Link
        href={href}
        className="sm:w-[300px] sm:h-[300px] mx-auto w-[160px] h-[160px] flex items-center justify-center"
      >
        <OptimizedImage
          src={product.primaryImage}
          alt={product.name}
          width={120}
          height={120}
          className="w-full h-full object-cover"
        />
      </Link>

      <div className="flex flex-col justify-center gap-6 max-w-[345px] mx-auto">
        <div className="flex flex-col gap-2 items-center justify-center">
          <Link
            href={href}
            className="line-clamp-2 max-w-[153px] font-gill text-sm font-light leading-110 text-darkblack text-center"
          >
            {product.name}
          </Link>
          <p className="font-gill text-sm font-normal leading-110 text-darkblack text-center">
            <span aria-hidden>₹ </span>
            {formatJewelleryPrice(product.price)}
          </p>
        </div>
        <div className="flex items-center gap-8">
          <span
            onPointerEnter={() => prefetchWishlistProductDetail(product.urlKey)}
            onFocus={() => prefetchWishlistProductDetail(product.urlKey)}
          >
            <DetailTextLink onClick={onAddToBag}>
              {wishlistPageContent.addToBagLabel}
            </DetailTextLink>
          </span>
          <DetailTextLink onClick={onRemove}>
            {wishlistPageContent.removeLabel}
          </DetailTextLink>
        </div>
      </div>
    </article>
  );
};

export default WishlistListItem;
