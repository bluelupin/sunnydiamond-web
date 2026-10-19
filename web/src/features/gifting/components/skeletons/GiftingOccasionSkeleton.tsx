import { Skeleton } from "@/shared/ui/skeleton";

const GiftingOccasionSkeleton = () => (
  <section
    aria-busy="true"
    aria-label="Loading occasion gifts section"
    className="flex w-full flex-col items-center gap-8 bg-white pt-16 md:pt-104"
  >
    <div className="flex w-full gap-3 overflow-hidden px-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-[420px] w-[328px] shrink-0 rounded-none bg-gray200"
          aria-hidden
        />
      ))}
    </div>
  </section>
);

export default GiftingOccasionSkeleton;
