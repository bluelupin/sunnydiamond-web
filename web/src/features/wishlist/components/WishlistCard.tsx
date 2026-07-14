"use client";

import Link from "next/link";
import WishlistRemoveIcon from "@/assets/Icons/WishlistRemoveIcon";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { getWishlistProductHref } from "@/features/wishlist/utils/resolveWishlistProducts";
import { wishlistCardMobileSpec, wishlistPageContent } from "@/features/wishlist/data/content";

type WishlistCardProps = {
  product: JewelleryListingProduct;
  onRemove: () => void;
  onAddToBag: () => void;
};

const WishlistCard = ({ product, onRemove, onAddToBag }: WishlistCardProps) => {
  const href = getWishlistProductHref(product.id);

  return (
    <article className="flex h-[270px] flex-col overflow-hidden bg-white md:h-[521px] md:bg-gray200">
      <div className="flex shrink-0 justify-end px-4 pt-4 md:hidden">
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${product.name}`}
          className="inline-flex items-center justify-center text-darkblack"
          style={{
            width: wishlistCardMobileSpec.trashSize,
            height: wishlistCardMobileSpec.trashSize,
          }}
        >
          <WishlistRemoveIcon size={wishlistCardMobileSpec.trashSize} />
        </button>
      </div>

      <div className="shrink-0 px-4 md:px-6 md:pt-10">
        <Link href={href} className="block w-full">
          <div className="flex h-[120px] w-full items-center justify-center border border-red-500 md:h-[300px] [&_img]:mx-auto [&_picture]:mx-auto [&_picture]:block [&_picture]:w-auto">
            <OptimizedImage
              src={product.primaryImage}
              alt={product.name}
              width={372}
              height={287}
              className="mx-auto max-h-full w-auto object-contain md:max-h-[300px] md:max-w-[372px]"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </div>
        </Link>
      </div>

      <div
        className="flex flex-col items-center px-4 pb-6 md:gap-3 md:px-6 md:pb-10"
        style={{ gap: wishlistCardMobileSpec.copyGap }}
      >
        <Link
          href={href}
          className="line-clamp-2 w-full max-w-[153px] min-h-[30px] text-center font-gill text-sm font-light leading-110 text-darkblack md:max-w-none md:min-h-0 md:text-xl"
        >
          {product.name}
        </Link>
        <p className="font-gill text-sm font-semibold leading-110 text-darkblack md:text-xl">
          <span aria-hidden>₹ </span>
          {formatJewelleryPrice(product.price)}
        </p>

        <div className="mt-1 flex w-full items-center justify-center md:mt-2 md:gap-8">
          <DetailTextLink onClick={onAddToBag} className="uppercase">
            {wishlistPageContent.addToBagLabel}
          </DetailTextLink>
          <DetailTextLink onClick={onRemove} className="hidden uppercase md:inline-flex">
            {wishlistPageContent.removeLabel}
          </DetailTextLink>
        </div>
      </div>
    </article>
  );
};

export default WishlistCard;
