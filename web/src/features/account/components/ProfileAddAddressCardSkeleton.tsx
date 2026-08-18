const shimmer = "animate-pulse bg-gray200";

export function ProfileAddAddressCardSkeleton() {
  return (
    <div
      className="flex w-full min-h-[246px] flex-col items-center justify-center gap-6 bg-gray300 p-4 md:min-h-[262px] md:p-6"
      aria-hidden
    >
      <div className={`size-16 shrink-0 rounded-full ${shimmer}`} />
      <div className={`h-4 w-28 ${shimmer}`} />
    </div>
  );
}
