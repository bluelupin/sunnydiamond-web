import { cn } from "@/shared/utils/cn";

const shimmer = "animate-pulse bg-gray300";

type ShowroomsLayoutSkeletonProps = {
  className?: string;
  showListHeader?: boolean;
};

/** Matches `ShowroomsLayout` mobile accordion + desktop grid (no section title). */
export function ShowroomsLayoutSkeleton({
  className,
  showListHeader = false,
}: ShowroomsLayoutSkeletonProps) {
  return (
    <section
      className={cn("bg-white lg:pt-16 lg:pb-100 pb-16 lg:h-846 md:h-auto h-auto", className)}
      aria-busy="true"
      aria-label="Loading showrooms"
    >
      <div className="flex flex-col items-left lg:gap-8 gap-4 bg-white lg:hidden">
        {showListHeader ? (
          <div className="w-full px-4">
            <div className={`h-4 w-56 ${shimmer}`} />
          </div>
        ) : null}

        <div className="w-full px-4">
          <div className="flex flex-col gap-4 bg-gray300 py-6">
            <div className={`h-5 w-28 ${shimmer}`} />
            <div className="h-[0.5px] w-full bg-neutral300" aria-hidden />
            <div className={`aspect-[2500/1797] w-full ${shimmer}`} />
            <div className="flex flex-col gap-4">
              <div className={`h-4 w-full ${shimmer}`} />
              <div className={`h-4 w-[80%] ${shimmer}`} />
              <div className={`h-4 w-32 ${shimmer}`} />
            </div>
          </div>

          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="py-6">
              <div className={`h-5 w-32 ${shimmer}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:block">
        {showListHeader ? (
          <div className="2xl:pl-24 lg:pl-10 pl-5 lg:pr-0 pr-5">
            <div className={`mb-6 h-4 w-64 ${shimmer}`} />
          </div>
        ) : null}

        <div className="grid grid-cols-1 items-start gap-[14px] md:grid-cols-2 md:gap-5 lg:static lg:gap-6 relative">
          <div className="lg:px-0 px-5 lg:mb-0 mb-[14px] h-full">
            <div className="flex h-full flex-row overflow-x-auto lg:flex-col">
              <div className="2xl:pl-24 lg:pl-10 w-fit border-b-[3px] border-black bg-gray300 lg:w-full lg:border-b-0 lg:pr-4">
                <div className={`h-50 w-40 lg:h-73 lg:w-full ${shimmer}`} />
                <div className="hidden px-5 py-8 lg:block lg:px-0">
                  <div className={`mb-4 h-4 w-full ${shimmer}`} />
                  <div className={`mb-6 h-4 w-[75%] ${shimmer}`} />
                  <div className={`h-3 w-28 ${shimmer}`} />
                </div>
              </div>

              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="2xl:pl-24 lg:pl-10 w-fit border-b-[3px] border-transparent lg:w-full lg:pr-4"
                >
                  <div className={`h-50 w-40 lg:h-73 lg:w-full ${shimmer}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-[350/480] h-478 w-full overflow-hidden px-5 md:aspect-[850/600] md:h-595 md:px-0 lg:aspect-[850/600]">
            <div className={`h-full w-full ${shimmer}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
