import { ProfileCard } from "./profileUi";

const shimmer = "animate-pulse bg-gray200";

type ProfileAddressCardSkeletonProps = {
  showDefaultLabel?: boolean;
};

export function ProfileAddressCardSkeleton({
  showDefaultLabel = false,
}: ProfileAddressCardSkeletonProps) {
  return (
    <ProfileCard className="flex flex-col gap-6" aria-hidden>
      <div className="flex flex-col gap-3">
        <div className={`h-4 w-36 ${shimmer}`} />

        <div className="flex flex-col gap-2">
          <div className={`h-4 w-full max-w-[16rem] ${shimmer}`} />
          <div className={`h-4 w-full max-w-[12rem] ${shimmer}`} />
          <div className={`h-4 w-28 ${shimmer}`} />
        </div>
      </div>

      {showDefaultLabel ? (
        <div className={`h-4 w-32 ${shimmer}`} />
      ) : (
        <div className={`h-4 w-36 ${shimmer}`} />
      )}

      <div className="flex items-center gap-4">
        <div className={`h-14 min-w-0 flex-1 ${shimmer}`} />
        <div className={`h-14 min-w-0 flex-1 ${shimmer}`} />
      </div>
    </ProfileCard>
  );
}
