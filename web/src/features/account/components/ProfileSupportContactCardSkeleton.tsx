const shimmer = "animate-pulse bg-gray200";

export function ProfileSupportContactCardSkeleton() {
  return (
    <div
      className="flex flex-col items-center justify-between gap-6 bg-gray300 p-6 text-center"
      aria-hidden
    >
      <div className="flex w-full flex-col items-center gap-4 md:gap-6">
        <div className={`h-7 w-40 md:h-8 md:w-48 ${shimmer}`} />

        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-4">
            <div className={`h-4 w-56 ${shimmer}`} />
            <div className={`h-4 w-44 ${shimmer}`} />
          </div>

          <div className={`h-4 w-full max-w-[18rem] ${shimmer}`} />

          <div className="flex items-center justify-center gap-2">
            <div className={`size-5 ${shimmer}`} />
            <div className={`h-4 w-36 ${shimmer}`} />
          </div>
        </div>
      </div>

      <div className={`mt-auto h-14 w-full max-w-[14rem] ${shimmer}`} />
    </div>
  );
}
