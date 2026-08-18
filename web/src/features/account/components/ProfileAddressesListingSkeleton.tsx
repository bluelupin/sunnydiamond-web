import { ProfileAddAddressCardSkeleton } from "./ProfileAddAddressCardSkeleton";
import { ProfileAddressCardSkeleton } from "./ProfileAddressCardSkeleton";

type ProfileAddressesListingSkeletonProps = {
  cardCount?: number;
};

export function ProfileAddressesListingSkeleton({
  cardCount = 5,
}: ProfileAddressesListingSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
      aria-busy="true"
      aria-label="Loading addresses"
    >
      <ProfileAddAddressCardSkeleton />

      {Array.from({ length: cardCount }).map((_, index) => (
        <ProfileAddressCardSkeleton key={index} showDefaultLabel={index === 0} />
      ))}
    </div>
  );
}
