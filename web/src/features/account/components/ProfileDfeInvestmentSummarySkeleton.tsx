const shimmer = "animate-pulse bg-gray200";

/** Matches `ProfileDfeInvestmentSummary` layout. */
export function ProfileDfeInvestmentSummarySkeleton() {
  return (
    <div className="w-full bg-gray200 p-4" aria-hidden>
      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full items-center justify-between gap-4">
            <div className={`h-4 w-32 ${shimmer}`} />
            <div className={`h-4 w-20 ${shimmer}`} />
          </div>
          <div className="flex w-full items-start justify-between gap-4">
            <div className={`h-4 w-36 ${shimmer}`} />
            <div className={`h-4 w-20 ${shimmer}`} />
          </div>
        </div>

        <div className="h-px w-full shrink-0 bg-neutral300" aria-hidden />

        <div className="flex w-full items-start justify-between gap-4">
          <div className={`h-4 w-24 ${shimmer}`} />
          <div className={`h-4 w-24 ${shimmer}`} />
        </div>
      </div>
    </div>
  );
}
