"use client";

import { cn } from "@/shared/utils/cn";

/** Matches bag drawer price line (`text-base leading-110`) to avoid layout shift. */
const CartBagDrawerAmountSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn("h-[18px] w-[88px] animate-pulse bg-gray200", className)}
    aria-hidden
  />
);

export default CartBagDrawerAmountSkeleton;
