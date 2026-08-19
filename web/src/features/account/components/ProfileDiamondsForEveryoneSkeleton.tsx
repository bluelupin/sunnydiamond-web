import { ProfileDfeInvestmentSummarySkeleton } from "./ProfileDfeInvestmentSummarySkeleton";
import { ProfileDfeReadOnlyFieldSkeleton } from "./ProfileDfeReadOnlyFieldSkeleton";
import { ProfileDfeSectionCardSkeleton } from "./ProfileDfeSectionCardSkeleton";

const shimmer = "animate-pulse bg-gray200";

function ProfileDfePaymentDueBannerSkeleton() {
  return (
    <div className="flex flex-nowrap gap-2 bg-yellow100 px-4 py-4 md:px-6" aria-hidden>
      <div className={`size-6 shrink-0 ${shimmer}`} />
      <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3">
        <div className={`h-4 min-w-0 flex-1 max-w-[20rem] ${shimmer}`} />
        <div className={`h-4 w-16 shrink-0 ${shimmer}`} />
      </div>
    </div>
  );
}

function ProfileDfeAttachmentLinkSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-hidden>
      <div className={`h-4 w-28 ${shimmer}`} />
      <div className="flex items-center gap-2">
        <div className={`size-6 shrink-0 ${shimmer}`} />
        <div className={`h-4 w-24 ${shimmer}`} />
      </div>
    </div>
  );
}

/** Matches `ProfileDfePlanView` layout. */
export function ProfileDiamondsForEveryoneSkeleton() {
  return (
    <div
      className="flex flex-col gap-6 lg:gap-10"
      aria-busy="true"
      aria-label="Loading Diamonds for Everyone plan"
    >
      <ProfileDfePaymentDueBannerSkeleton />

      <div className="flex flex-col gap-6">
        <div className={`h-9 w-64 md:h-10 ${shimmer}`} />

        <ProfileDfeSectionCardSkeleton>
          <div className="flex flex-col gap-6">
            <ProfileDfeReadOnlyFieldSkeleton />
            <ProfileDfeReadOnlyFieldSkeleton />
            <ProfileDfeReadOnlyFieldSkeleton />
          </div>
        </ProfileDfeSectionCardSkeleton>

        <ProfileDfeSectionCardSkeleton>
          <div className="flex flex-col gap-4">
            <div
              className="flex h-[50px] w-full items-center gap-2 border border-black px-3 py-2"
              aria-hidden
            >
              <div className={`h-5 w-4 ${shimmer}`} />
              <div className={`h-4 w-16 ${shimmer}`} />
            </div>
            <div className={`h-4 w-56 ${shimmer}`} />
            <ProfileDfeInvestmentSummarySkeleton />
          </div>
        </ProfileDfeSectionCardSkeleton>

        <ProfileDfeSectionCardSkeleton>
          <div className="flex flex-col gap-6">
            <ProfileDfeReadOnlyFieldSkeleton />
            <ProfileDfeReadOnlyFieldSkeleton />
            <ProfileDfeAttachmentLinkSkeleton />
          </div>
        </ProfileDfeSectionCardSkeleton>

        <ProfileDfeSectionCardSkeleton>
          <div className="flex flex-col gap-6">
            <ProfileDfeReadOnlyFieldSkeleton />
            <ProfileDfeReadOnlyFieldSkeleton />
            <ProfileDfeReadOnlyFieldSkeleton />
            <ProfileDfeReadOnlyFieldSkeleton />
          </div>
        </ProfileDfeSectionCardSkeleton>
      </div>
    </div>
  );
}
