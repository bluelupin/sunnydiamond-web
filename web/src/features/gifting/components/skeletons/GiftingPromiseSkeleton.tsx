import { Skeleton } from "@/shared/ui/skeleton";

const GiftingPromiseSkeleton = () => (
  <section
    aria-busy="true"
    aria-label="Loading finishing touch section"
    className="bg-gray200 px-2 py-16 md:py-104"
  >
    <Skeleton className="mx-auto mb-10 h-10 w-full max-w-md rounded-md bg-gray300" aria-hidden />
    <div className="flex gap-3 overflow-hidden md:grid md:grid-cols-3 md:gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-[226px] w-[328px] shrink-0 bg-gray300 md:h-[350px] md:w-full" aria-hidden />
      ))}
    </div>
  </section>
);

export default GiftingPromiseSkeleton;
