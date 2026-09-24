const shimmer = "animate-pulse bg-gray200";

/** Matches `ProfileSupportSection` Figma 1480:39360 card layout. */
export function ProfileSupportContactCardSkeleton() {
  return (
    <div
      className="flex flex-col justify-between gap-8 bg-gray300 p-6 text-left"
      aria-hidden
    >
      <div className="flex w-full flex-col items-start gap-6">
        <div className={`h-7 w-40 md:h-8 md:w-48 ${shimmer}`} />

        <div className="flex w-full flex-col items-start gap-4">
          <div className="flex flex-col items-start gap-1">
            <div className={`h-4 w-56 ${shimmer}`} />
            <div className={`h-4 w-44 ${shimmer}`} />
          </div>

          <div className={`h-4 w-40 border-b border-darkblack ${shimmer}`} />
        </div>
      </div>

      <div className={`mt-auto h-14 w-40 border border-darkblack ${shimmer}`} />
    </div>
  );
}
