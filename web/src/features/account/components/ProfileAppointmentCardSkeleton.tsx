const shimmer = "animate-pulse bg-gray200";

function ProductGallerySkeleton() {
  return (
    <div
      className="-mx-4 flex gap-4 overflow-hidden px-4 lg:mx-0 lg:justify-center lg:gap-6 lg:px-0"
      aria-hidden
    >
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="flex w-[135px] shrink-0 flex-col gap-2 lg:w-[176px]">
          <div className={`h-[76px] w-full lg:h-[135px] ${shimmer}`} />
          <div className={`h-4 w-full max-w-[8rem] ${shimmer}`} />
        </div>
      ))}
    </div>
  );
}

function ProfileAppointmentPanelSkeleton() {
  return (
    <div className="flex flex-col gap-6 bg-white p-4 lg:gap-4 lg:p-6" aria-hidden>
      <div className={`h-6 w-40 lg:h-7 lg:w-48 ${shimmer}`} />
      <div className="flex flex-col gap-2">
        <div className={`h-4 w-36 ${shimmer}`} />
        <div className={`h-4 w-28 ${shimmer}`} />
        <div className={`h-4 w-40 ${shimmer}`} />
      </div>
    </div>
  );
}

function ProfileAppointmentBookingDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-6 bg-white p-4 lg:gap-4 lg:p-6" aria-hidden>
      <div className={`h-6 w-40 lg:h-7 lg:w-48 ${shimmer}`} />

      <div className="flex w-full flex-col gap-4 lg:hidden">
        <div className="flex w-full flex-col gap-2">
          <div className={`h-4 w-24 ${shimmer}`} />
          <div className={`h-4 w-32 ${shimmer}`} />
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className={`h-4 w-20 ${shimmer}`} />
          <div className={`h-4 w-28 ${shimmer}`} />
        </div>
      </div>

      <div className="hidden flex-col gap-4 lg:flex lg:flex-row">
        <div className="flex min-h-[82px] flex-1 flex-col justify-between gap-2 lg:gap-0">
          <div className={`h-4 w-24 ${shimmer}`} />
          <div className={`h-14 w-full ${shimmer}`} />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className={`h-4 w-20 ${shimmer}`} />
          <div className={`h-14 w-full ${shimmer}`} />
        </div>
      </div>
    </div>
  );
}

/** Matches `ProfileAppointmentCard` layout. */
export function ProfileAppointmentCardSkeleton() {
  return (
    <article className="relative flex flex-col gap-6 bg-gray300 p-4 lg:p-6" aria-hidden>
      <div className={`absolute left-0 top-0 h-10 w-28 ${shimmer}`} />

      <div className="pt-8">
        <ProductGallerySkeleton />
      </div>

      <ProfileAppointmentPanelSkeleton />
      <ProfileAppointmentBookingDetailsSkeleton />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className={`h-14 w-full lg:order-1 lg:flex-1 ${shimmer}`} />
        <div className={`h-14 w-full lg:order-2 lg:flex-1 ${shimmer}`} />
      </div>
    </article>
  );
}
