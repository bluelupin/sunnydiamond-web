import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/utils/cn";

const faceSkeletonClassName =
  "h-[560px] w-[343px] shrink-0 rounded-none bg-gray200 md:h-full md:w-[400px] lg:h-[600px] lg:flex-1 lg:min-w-0 lg:basis-0";

const AboutFacesSkeleton = () => (
  <section aria-busy="true" aria-label="Loading team section" className="bg-white pb-16 md:pb-20 lg:pb-104">
    <div className="container mb-8 flex flex-col items-center gap-3 lg:mb-10 lg:gap-4">
      <Skeleton className="h-10 w-80 max-w-full rounded-md bg-gray200 md:h-12" aria-hidden />
      <Skeleton className="h-5 w-full max-w-lg rounded-md bg-gray200" aria-hidden />
    </div>
    <div className="pl-4 lg:pl-0">
      <div className="flex gap-2 overflow-hidden md:h-[450px] md:gap-1 lg:hidden">
        <Skeleton className={faceSkeletonClassName} aria-hidden />
        <Skeleton className={cn("hidden md:block", faceSkeletonClassName)} aria-hidden />
        <Skeleton className={cn("hidden md:block", faceSkeletonClassName)} aria-hidden />
      </div>
      <div className="hidden flex-col gap-1 lg:flex">
        {[0, 1].map((row) => (
          <div key={row} className="flex h-[600px] gap-1">
            {[0, 1, 2].map((col) => (
              <Skeleton key={col} className={faceSkeletonClassName} aria-hidden />
            ))}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutFacesSkeleton;
