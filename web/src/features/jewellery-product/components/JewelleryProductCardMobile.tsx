"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { formatJewelleryPrice } from "../utils/formatPrice";
import type { StaticImageData } from "next/image";

interface JewelleryProductCardMobileProps {
  title: string;
  price: number;
  primaryImage: string | StaticImageData;
  hoverImage: string | StaticImageData;
  href: string;
  variant: "default" | "lifestyle";
  isBestseller?: boolean;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  badgeStyle?: "top-gold" | "center-white";
}

const resolveImageSrc = (image: string | StaticImageData) =>
  typeof image === "string" ? image : image.src;

const WishlistButton = ({
  isWishlisted,
  onToggleWishlist,
  isLight,
}: {
  isWishlisted: boolean;
  onToggleWishlist?: () => void;
  isLight?: boolean;
}) => (
  <button
    type="button"
    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    aria-pressed={isWishlisted}
    onClick={(event) => {
      event.preventDefault();
      event.stopPropagation();
      onToggleWishlist?.();
    }}
    className="absolute right-2 top-2 z-20 flex size-6 items-center justify-center"
  >
    <Heart
      size={20}
      strokeWidth={1.5}
      className={cn(
        isLight ? "text-white" : "text-darkblack",
        isWishlisted && "fill-primary text-primary",
      )}
    />
  </button>
);

const ProductCopy = ({
  title,
  price,
  href,
  isLight,
}: {
  title: string;
  price: number;
  href: string;
  isLight?: boolean;
}) => (
  <div
    className={cn(
      "relative z-10 flex w-full flex-col items-center justify-center gap-2 px-[4.747px] text-center text-sm leading-110",
      isLight ? "text-white" : "text-darkblack",
    )}
  >
    <Link href={href}>
      <p className={cn("font-gill", isLight ? "font-normal" : "font-light")}>{title}</p>
    </Link>
    <p className="font-gill font-semibold">
      <span aria-hidden>₹ </span>
      {formatJewelleryPrice(price)}
    </p>
  </div>
);

const JewelleryProductCardMobile = ({
  title,
  price,
  primaryImage,
  hoverImage,
  href,
  variant,
  isBestseller = false,
  isWishlisted = false,
  onToggleWishlist,
  badgeStyle = "top-gold",
}: JewelleryProductCardMobileProps) => {
  if (variant === "lifestyle") {
    return (
      <article className="relative flex w-[calc(50%-2px)] shrink-0 flex-col justify-end gap-4 self-stretch overflow-hidden px-4 py-6">
        <Link href={href} className="absolute inset-0 z-0" aria-label={`View ${title}`} />
        <Image
          src={resolveImageSrc(hoverImage)}
          alt=""
          fill
          className="object-cover"
          sizes="185px"
        />
        <div aria-hidden className="absolute inset-0 bg-black/20" />
        <WishlistButton
          isWishlisted={isWishlisted}
          onToggleWishlist={onToggleWishlist}
          isLight
        />
        <ProductCopy title={title} price={price} href={href} isLight />
      </article>
    );
  }

  return (
    <article className="relative flex w-[calc(50%-2px)] shrink-0 flex-col items-center justify-center gap-4 bg-gray200 px-4 py-6">
      {isBestseller && badgeStyle === "top-gold" ? (
        <span className="absolute left-[calc(50%-53px)] top-0 z-20 flex h-7 -translate-x-1/2 items-center justify-center bg-[#C5A156] p-2 font-gill text-xs leading-110 text-darkblack">
          BESTSELLER
        </span>
      ) : null}

      <WishlistButton isWishlisted={isWishlisted} onToggleWishlist={onToggleWishlist} />

      <Link
        href={href}
        className="relative h-[110px] w-[155px] shrink-0 overflow-hidden"
        aria-label={`View ${title}`}
      >
        <Image
          src={resolveImageSrc(primaryImage)}
          alt={title}
          fill
          className="object-contain"
          sizes="155px"
        />
      </Link>

      {isBestseller && badgeStyle === "center-white" ? (
        <span className="absolute left-[51.75px] top-[116px] z-20 flex items-center justify-center bg-white p-1.5 font-gill text-xs font-semibold leading-110 text-darkblack shadow-[0px_2px_2px_#C5A156]">
          BESTSELLER
        </span>
      ) : null}

      <ProductCopy title={title} price={price} href={href} />
    </article>
  );
};

export default JewelleryProductCardMobile;
