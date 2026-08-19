const shimmer = "animate-pulse bg-gray200";

export function ProfileDfeReadOnlyFieldSkeleton() {
  return (
    <div className="flex max-w-[508px] flex-col gap-2" aria-hidden>
      <div className={`h-4 w-28 ${shimmer}`} />
      <div className={`h-4 w-full max-w-[16rem] ${shimmer}`} />
    </div>
  );
}
