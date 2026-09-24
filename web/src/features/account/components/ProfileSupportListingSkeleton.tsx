import { ProfileSupportContactCardSkeleton } from "./ProfileSupportContactCardSkeleton";

/** Matches `ProfileSupportSection` contact options grid. */
const PROFILE_SUPPORT_GRID_CLASS =
  "grid grid-cols-1 gap-6 xl:grid-cols-2 lg:grid-cols-1 md:grid-cols-2";

type ProfileSupportListingSkeletonProps = {
  cardCount?: number;
};

export function ProfileSupportListingSkeleton({
  cardCount = 2,
}: ProfileSupportListingSkeletonProps) {
  return (
    <div
      className="flex flex-col gap-10"
      aria-busy="true"
      aria-label="Loading help and support"
    >
      <div className={PROFILE_SUPPORT_GRID_CLASS}>
        {Array.from({ length: cardCount }).map((_, index) => (
          <ProfileSupportContactCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
