"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { wishlistPageContent } from "@/features/wishlist/data/content";

type WishlistMovedToastProps = {
  open: boolean;
  onClose: () => void;
};

const WishlistMovedToast = ({ open, onClose }: WishlistMovedToastProps) => {
  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto fixed left-1/2 top-16 z-[80] w-[calc(100%-2rem)] max-w-[300px] -translate-x-1/2 animate-in fade-in slide-in-from-top-2 duration-300 md:top-104",
      )}
    >
      <div className="flex w-full items-center justify-between gap-3 bg-darkblack px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Check size={18} strokeWidth={1.25} aria-hidden className="shrink-0 text-white" />
          <p className="font-gill text-sm font-light leading-110 text-white">
            {wishlistPageContent.movedToWishlistMessage}
          </p>
        </div>

        <Link
          href={wishlistPageContent.movedToWishlistHref}
          onClick={onClose}
          className="text-link-underline inline-flex shrink-0 border-b-[1.5px] border-white pb-1 font-gill text-xs uppercase leading-110 text-white"
        >
          {wishlistPageContent.movedToWishlistViewLabel}
        </Link>
      </div>
    </div>
  );
};

export default WishlistMovedToast;
