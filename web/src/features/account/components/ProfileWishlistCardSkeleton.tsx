const shimmer = "animate-pulse bg-gray300";

export function ProfileWishlistCardSkeleton() {
  return (
    <article
      className="flex flex-col items-center gap-4 overflow-hidden bg-gray200 px-4 py-6 md:gap-6 md:px-6 md:py-10 lg:gap-4 lg:px-4 lg:py-6"
      aria-hidden
    >
      <div
        className={`h-[110px] w-[110px] sm:h-[240px] sm:w-[240px] md:h-[240px] md:w-[240px] lg:aspect-[372/287] lg:h-auto lg:w-full lg:max-w-full ${shimmer}`}
      />

      <div className="flex w-full flex-col items-center gap-6 lg:gap-4">
        <div className="flex flex-col items-center gap-2 md:gap-3">
          <div className={`h-4 w-32 max-w-full ${shimmer}`} />
          <div className={`h-4 w-20 ${shimmer}`} />
        </div>

        <div className="flex items-center justify-center gap-6">
          <div className={`h-4 w-24 ${shimmer}`} />
          <div className={`hidden h-4 w-16 md:block ${shimmer}`} />
        </div>
      </div>
    </article>
  );
}
