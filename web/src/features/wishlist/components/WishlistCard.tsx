"use client";

import Link from "next/link";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { getWishlistProductHref } from "@/features/wishlist/utils/wishlistProduct.utils";
import { prefetchWishlistProductDetail } from "@/features/wishlist/utils/wishlistProductDetailPrefetch";
import { wishlistPageContent } from "@/features/wishlist/data/content";
import DeleteIcon from "@/assets/Icons/DeleteIcon";
import { cn } from "@/shared/utils/cn";
import { productNameDisplayClassName } from "@/shared/utils/productNameDisplay";

type WishlistCardLayout = "default" | "profile";

type WishlistCardProps = {
  product: JewelleryListingProduct;
  layout?: WishlistCardLayout;
  onRemove: () => void;
  onAddToBag: () => void;
};

const WishlistCard = ({
  product,
  layout = "default",
  onRemove,
  onAddToBag,
}: WishlistCardProps) => {
  const href = getWishlistProductHref(product);
  const isProfileLayout = layout === "profile";

  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden gap-4 md:gap-6",
        isProfileLayout ? "bg-gray200 px-4 py-10 md:py-10" : "px-4 py-6 md:px-6 md:py-10",
      )}
    >
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
        className={cn(
          "pointer-events-auto mx-auto block shrink-0",
          isProfileLayout
            ? "h-auto w-full lg:max-w-[400px] md:max-w-[300px] sm:max-w-[240px] max-w-[155px] aspect-[400/300]"
            : "h-auto w-full lg:max-w-[426px] md:max-w-[300px] sm:max-w-[240px] max-w-[155px]  lg:max-h-[426px] md:max-h-[300px] sm:max-h-[240px] max-h-[155px] ",
        )}
      >
        <OptimizedImage
          src={product.primaryImage}
          alt={product.name}
          width={372}
          height={287}
          className="h-full w-full object-cover"
        />
      </Link>
      <div
        className={cn(
          "pointer-events-auto flex min-h-0 w-full flex-1 flex-col items-center justify-start gap-6 lg:gap-6",
          isProfileLayout && "gap-6",
        )}
      >
        <div className="flex w-full shrink-0 flex-col items-center justify-start gap-2 md:gap-3">
          <Link
            href={href}
            className={cn(
              "block line-clamp-2 max-w-[153px] text-center font-gill text-sm font-light leading-[115%] text-darkblack md:max-w-none md:text-base md:leading-110 lg:text-xl",
              isProfileLayout && "lg:text-xl",
              productNameDisplayClassName,
            )}
          >
            {product.name}
          </Link>
          <p
            className={cn(
              "font-gill text-sm font-semibold leading-110 text-darkblack md:text-xl",
              isProfileLayout && "lg:text-xl",
            )}
          >
            <span aria-hidden>₹ </span>
            {formatJewelleryPrice(product.price)}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-center md:gap-6">
          <span
            onPointerEnter={() => prefetchWishlistProductDetail(product.urlKey)}
            onFocus={() => prefetchWishlistProductDetail(product.urlKey)}
          >
            <DetailTextLink onClick={onAddToBag} className="text-sm uppercase md:text-base">
              {wishlistPageContent.addToBagLabel}
            </DetailTextLink>
          </span>
          <span className="max-md:hidden">
            <DetailTextLink onClick={onRemove} className="text-sm uppercase md:text-base">
              {wishlistPageContent.removeLabel}
            </DetailTextLink>
          </span>
        </div>
      </div>
    </article>
  );
};

export default WishlistCard;
