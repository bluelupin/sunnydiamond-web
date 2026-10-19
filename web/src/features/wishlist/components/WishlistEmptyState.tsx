import Image from "next/image";
import Link from "next/link";
import { wishlistPageContent } from "@/features/wishlist/data/content";

const WishlistEmptyState = () => (
  <div className="flex flex-col items-center gap-6 py-16 text-center md:gap-8 md:py-24 lg:gap-6 lg:pt-16 lg:pb-104">
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="md:size-16 size-10" aria-hidden
    >
      <path d="M19.332 8H47.332L61.332 24L33.332 54L5.33203 24L19.332 8Z" stroke="#C5A156" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M33.332 8L33.332 52" stroke="#C5A156" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
