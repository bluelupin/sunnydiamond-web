import { Skeleton } from "@/shared/ui/skeleton";

const EducationHeroSkeleton = () => (
  <section
    aria-busy="true"
    aria-label="Loading hero section"
    className="relative flex flex-col overflow-hidden bg-white h-580 sm:h-580 lg:h-640 2xl:h-[85vh]"
  >
    <div className="relative flex-1 overflow-hidden p-0">
      <Skeleton className="absolute inset-0 h-full w-full rounded-none bg-gray200" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-5 pb-16 lg:pb-75">
        <Skeleton
          className="h-10 w-full max-w-md rounded-md bg-gray300/80"
          aria-hidden
        />
      </div>
    </div>
  </section>
);

export default EducationHeroSkeleton;
