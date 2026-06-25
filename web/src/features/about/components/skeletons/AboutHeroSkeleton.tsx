import { Skeleton } from "@/shared/ui/skeleton";

const AboutHeroSkeleton = () => (
  <section aria-busy="true" aria-label="Loading hero section" className="relative">
    <Skeleton className="h-580 w-full rounded-none bg-gray200 sm:h-580 lg:h-640" />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-5 pb-16 lg:pb-75">
      <Skeleton className="h-10 w-full max-w-md rounded-md bg-gray300/80" aria-hidden />
    </div>
  </section>
);

export default AboutHeroSkeleton;
