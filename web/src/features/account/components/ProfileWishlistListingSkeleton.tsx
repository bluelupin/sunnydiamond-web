import { ProfileWishlistCardSkeleton } from "./ProfileWishlistCardSkeleton";

const shimmer = "animate-pulse bg-gray300";

/** Matches `WishlistGrid` profile variant grid classes. */
const PROFILE_WISHLIST_GRID_CLASS =
  "grid w-full grid-cols-2 gap-1 bg-gray200 md:grid-cols-2 md:gap-2 lg:grid-cols-2 lg:gap-6 lg:bg-transparent";

type ProfileWishlistListingSkeletonProps = {
  cardCount?: number;
};

function ProfileWishlistMobileHeaderSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 md:hidden">
      <div className={`h-4 w-28 ${shimmer}`} />

      <div className="flex items-center justify-center gap-4">
        <div className={`size-[18px] ${shimmer}`} />
        <div className="h-[18px] w-px bg-neutral300" aria-hidden />
        <div className={`size-[18px] ${shimmer}`} />
      </div>
    </div>
  );
}

export function ProfileWishlistListingSkeleton({
  cardCount = 4,
}: ProfileWishlistListingSkeletonProps) {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading wishlist">
      <ProfileWishlistMobileHeaderSkeleton />

      <div className={PROFILE_WISHLIST_GRID_CLASS}>
        {Array.from({ length: cardCount }).map((_, index) => (
          <ProfileWishlistCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
