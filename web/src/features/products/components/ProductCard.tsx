"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { cn } from "@/shared/utils/cn";
import type { Product } from "@/features/products/data/products";

type WishlistButtonProps = {
  wishlisted: boolean;
  onToggle: (e: React.MouseEvent) => void;
  white?: boolean;
};

const WishlistButton = ({ wishlisted, onToggle, white = false }: WishlistButtonProps) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-[24px] top-[24px] z-10 flex size-[32px] shrink-0 items-center justify-center"
    aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    aria-pressed={wishlisted}
  >
    <Heart
      size={20}
      strokeWidth={1.5}
      className={cn(
        "transition-colors duration-200",
        wishlisted
          ? "fill-[#AB863B] text-[#AB863B]"
          : white
            ? "fill-none text-white"
            : "fill-none darkblack",
      )}
    />
  </button>
);

const ProductCard = ({ product }: { product: Product }) => {
  const [wishlisted, setWishlisted] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((prev) => !prev);
  };

  /* ── Full-bleed lifestyle card ─────────────────────────────────── */
  if (product.cardVariant === "lifestyle" && product.lifestyleImage) {
    return (
      <Link
        href={`/product/${product.id}`}
        className="group relative flex h-[496px] flex-col items-center gap-[24px] overflow-hidden px-[24px] py-[40px]"
      >
        {/* Full-bleed lifestyle photo + gradient overlay */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <OptimizedImage
            src={product.lifestyleImage}
            alt=""
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.4)] from-[14%] to-[rgba(0,0,0,0)] to-[50%]" />
        </div>

        {/* Spacer so text sits at the bottom */}
        <div className="h-[303px] w-full shrink-0" />

        {/* Name + price — white text */}
        <div className="relative z-10 flex w-full flex-col items-center justify-center gap-[12px] px-[12px]">
          <p className="text-center font-gill text-[20px] font-normal leading-110 text-white">
            {product.name}
          </p>
          <p className="text-center font-gill text-[20px] font-semibold leading-110 text-white">
            ₹ {product.price.toLocaleString("en-IN")}
          </p>
        </div>

        <WishlistButton wishlisted={wishlisted} onToggle={handleWishlist} white />
      </Link>
    );
  }

  /* ── Standard card ─────────────────────────────────────────────── */
  const hasLifestyleHover = !!product.lifestyleImage;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex h-[496px] flex-col items-center gap-[24px] bg-[#FBFAF6] px-[24px] py-[40px]"
    >
      {/* Image area — cross-fades to lifestyle image on hover */}
      <div className="relative h-[303px] w-full shrink-0 overflow-hidden">
        {/* Product-on-white photo */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            hasLifestyleHover ? "group-hover:opacity-0" : "",
          )}
        >
          <OptimizedImage
            src={product.image}
            alt={`${product.name} — ${product.shortDescription}`}
            className="size-full object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        {/* Lifestyle / model photo — fades in on hover */}
        {hasLifestyleHover && (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <OptimizedImage
              src={product.lifestyleImage!}
              alt=""
              className="size-full object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
      </div>

      {/* Name + price */}
      <div className="flex w-full flex-col items-center justify-center gap-[12px] px-[12px]">
        <p className="text-center font-gill text-[20px] font-light leading-110 darkblack">
          {product.name}
        </p>
        <p className="text-center font-gill text-[20px] font-semibold leading-110 darkblack">
          ₹ {product.price.toLocaleString("en-IN")}
        </p>
      </div>

      <WishlistButton wishlisted={wishlisted} onToggle={handleWishlist} />

      {/* Bestseller badge — straddles image / text boundary */}
      {product.bestseller && (
        <div className="absolute left-1/2 top-[331px] z-10 flex h-[36px] -translate-x-1/2 items-center justify-center bg-white px-[12px] drop-shadow-[0px_2px_2px_#c5a156]">
          <span className="font-gill text-[14px] font-semibold leading-110 darkblack">
            BESTSELLER
          </span>
        </div>
      )}
    </Link>
  );
};

export default ProductCard;
