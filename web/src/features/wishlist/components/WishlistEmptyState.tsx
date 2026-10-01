import Image from "next/image";
import Link from "next/link";
import { wishlistPageContent } from "@/features/wishlist/data/content";

const WishlistEmptyState = () => (
  <div className="flex flex-col items-center gap-6 py-16 text-center md:gap-8 md:py-24 lg:gap-6 lg:pt-16 lg:pb-104">
    <div className="flex size-16 items-center justify-center rounded-full bg-benefitSurface md:size-20 lg:size-16 lg:rounded-none lg:bg-transparent">
      <Image
        src="/images/wishlist-empty-diamond.png"
        alt=""
        width={118}
        height={98}
        className="h-8 w-auto lg:h-[46px]"
        aria-hidden
      />
    </div>
    <div className="flex max-w-md flex-col gap-3 lg:w-[309px] lg:gap-6">
      <h2 className="font-larken text-2xl font-light leading-110 text-darkblack md:text-32">
        {wishlistPageContent.emptyTitle}
      </h2>
      <p className="font-gill text-base font-light leading-110 text-neutral500">
        {wishlistPageContent.emptyDescription}
      </p>
    </div>
    <Link
      href={wishlistPageContent.emptyCtaHref}
      className="btn-dark-slide inline-flex h-14 w-full max-w-[280px] items-center justify-center border border-black px-7 font-gill text-sm uppercase leading-110 text-white lg:w-auto lg:max-w-none"
    >
      <span className="relative z-10">{wishlistPageContent.emptyCta}</span>
    </Link>
  </div>
);

export default WishlistEmptyState;
