import { WISHLIST_VISIBLE_CAP } from "@/features/wishlist/constants";
import { WishlistPageCardSkeleton } from "./WishlistPageCardSkeleton";

/** Matches `WishlistGrid` page variant grid classes. */
export const WISHLIST_PAGE_GRID_CLASS =
  "grid w-full grid-cols-2 gap-1 md:grid-cols-2 md:gap-2 lg:grid-cols-3";

type WishlistPageGridSkeletonProps = {
  cardCount?: number;
};

export function WishlistPageGridSkeleton({
  cardCount = WISHLIST_VISIBLE_CAP,
}: WishlistPageGridSkeletonProps) {
  return (
    <div
      className="mx-auto w-full max-w-1440 px-0 md:px-8 lg:px-10 2xl:max-w-1920 2xl:px-[60px]"
      aria-busy="true"
      aria-label="Loading wishlist products"
    >
      <p className="sr-only" aria-live="polite">
        Loading wishlist products
      </p>
      <div className={WISHLIST_PAGE_GRID_CLASS}>
        {Array.from({ length: cardCount }).map((_, index) => (
          <WishlistPageCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

type WishlistPageSkeletonProps = {
  cardCount?: number;
};

const WishlistPageSkeleton = ({ cardCount = WISHLIST_VISIBLE_CAP }: WishlistPageSkeletonProps) => {
  return (
    <section className="min-h-screen pb-[calc(64px+env(safe-area-inset-bottom,0px))] md:pb-0">
      <div className="bg-gray200">
        <WishlistPageGridSkeleton cardCount={cardCount} />
      </div>
    </section>
  );
};

export default WishlistPageSkeleton;
