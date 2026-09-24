import { ProfileAppointmentCardSkeleton } from "./ProfileAppointmentCardSkeleton";

const shimmer = "animate-pulse bg-gray300";

type ProfileAppointmentsListingSkeletonProps = {
  cardCount?: number;
};

/** Matches `ProfileAppointmentsSection` filter row and appointment list. */
export function ProfileAppointmentsListingSkeleton({
  cardCount = 2,
}: ProfileAppointmentsListingSkeletonProps) {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading appointments">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className={`h-5 w-28 shrink-0 ${shimmer}`} />

        <div className="-mx-4 flex gap-2 overflow-hidden px-4 lg:mx-0 lg:flex-nowrap lg:justify-end lg:px-0">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`h-10 w-[7.5rem] shrink-0 ${shimmer}`} />
          ))}
        </div>
      </div>

      <ul className="flex flex-col gap-6">
        {Array.from({ length: cardCount }).map((_, index) => (
          <li key={index}>
            <ProfileAppointmentCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}
