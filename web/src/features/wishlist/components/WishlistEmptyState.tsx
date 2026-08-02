import Link from "next/link";
import { Heart } from "lucide-react";
import { wishlistPageContent } from "@/features/wishlist/data/content";

const WishlistEmptyState = () => (
  <div className="flex flex-col items-center gap-6 py-16 text-center md:gap-8 md:py-24">
    <div className="flex size-16 items-center justify-center rounded-full bg-benefitSurface md:size-20">
      <Heart size={32} strokeWidth={1.5} className="text-neutral500" aria-hidden />
    </div>
    <div className="flex max-w-md flex-col gap-3">
      <h2 className="font-larken text-2xl font-light leading-110 text-darkblack md:text-32">
        {wishlistPageContent.emptyTitle}
      </h2>
      <p className="font-gill text-base font-light leading-110 text-neutral500">
        {wishlistPageContent.emptyDescription}
      </p>
    </div>
    <Link
      href={wishlistPageContent.emptyCtaHref}
      className="btn-dark-slide inline-flex h-14 w-full max-w-[280px] items-center justify-center border border-black px-7 font-gill text-sm uppercase leading-110 text-white"
    >
      <span className="relative z-10">{wishlistPageContent.emptyCta}</span>
    </Link>
  </div>
);

export default WishlistEmptyState;
