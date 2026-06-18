"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { cn } from "@/shared/utils/cn";
import type { Product } from "@/features/products/data/products";

const WishlistButton = ({ white = false }: { white?: boolean }) => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
    className={cn(
      "absolute right-[24px] top-[24px] z-10 flex size-[32px] shrink-0 items-center justify-center",
    )}
    aria-label="Add to wishlist"
  >
    <Heart
      size={20}
      strokeWidth={1.5}
      className={white ? "text-white" : "text-[#0a0a0a]"}
    />
  </button>
);

const ProductCard = ({ product }: { product: Product }) => {
  const isLifestyle = !!product.lifestyleImage;

  if (isLifestyle) {
    return (
      <Link
        href={`/product/${product.id}`}
        className="group relative flex h-[496px] flex-col items-center gap-[24px] overflow-hidden px-[24px] py-[40px]"
      >
        {/* Full-bleed lifestyle photo */}
        <div className="absolute inset-0" aria-hidden>
          <OptimizedImage
            src={product.lifestyleImage!}
            alt=""
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {/* Bottom-to-centre dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.4)] from-[14%] to-[rgba(0,0,0,0)] to-[50%]" />
        </div>

        {/* Spacer pushes text to bottom */}
        <div className="h-[303px] w-full shrink-0" />

        {/* Name + price — white */}
        <div className="relative z-10 flex w-full flex-col items-center justify-center gap-[12px] px-[12px]">
          <p className="text-center font-gill text-[20px] font-normal leading-[110%] text-white">
            {product.name}
          </p>
          <p className="text-center font-gill text-[20px] font-semibold leading-[110%] text-white">
            ₹ {product.price.toLocaleString("en-IN")}
          </p>
        </div>

        <WishlistButton white />
      </Link>
    );
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex h-[496px] flex-col items-center gap-[24px] bg-[#FBFAF6] px-[24px] py-[40px]"
    >
      {/* Product image */}
      <div className="h-[303px] w-full shrink-0 overflow-hidden">
        <OptimizedImage
          src={product.image}
          alt={`${product.name} — ${product.shortDescription}`}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Name + price */}
      <div className="flex w-full flex-col items-center justify-center gap-[12px] px-[12px]">
        <p className="text-center font-gill text-[20px] font-light leading-[110%] text-[#0a0a0a]">
          {product.name}
        </p>
        <p className="text-center font-gill text-[20px] font-semibold leading-[110%] text-[#0a0a0a]">
          ₹ {product.price.toLocaleString("en-IN")}
        </p>
      </div>

      <WishlistButton />

      {/* Bestseller badge — overlaps image/text boundary */}
      {product.bestseller && (
        <div className="absolute left-1/2 top-[331px] z-10 flex h-[36px] -translate-x-1/2 items-center justify-center bg-white px-[12px] drop-shadow-[0px_2px_2px_#c5a156]">
          <span className="font-gill text-[14px] font-semibold leading-[110%] text-[#0a0a0a]">
            BESTSELLER
          </span>
        </div>
      )}
    </Link>
  );
};

export default ProductCard;
