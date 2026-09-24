const shimmer = "animate-pulse bg-gray200";

type ProfileDfeSectionCardSkeletonProps = {
  children: React.ReactNode;
};

/** Matches `ProfileDfeSectionCard` shell. */
export function ProfileDfeSectionCardSkeleton({ children }: ProfileDfeSectionCardSkeletonProps) {
  return (
    <div className="flex w-full flex-col gap-6 bg-gray300 p-4 md:p-6" aria-hidden>
      <div className={`h-6 w-40 ${shimmer}`} />
      {children}
    </div>
  );
}
