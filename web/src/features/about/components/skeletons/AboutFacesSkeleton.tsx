import { Skeleton } from "@/shared/ui/skeleton";

const AboutFacesSkeleton = () => (
  <section aria-busy="true" aria-label="Loading team section" className="bg-white pb-16 md:pb-20 lg:pb-100">
    <div className="container mb-8 flex flex-col items-center gap-3 lg:mb-[40px] lg:gap-4">
      <Skeleton className="h-10 w-80 max-w-full rounded-md bg-gray200 md:h-12" aria-hidden />
      <Skeleton className="h-5 w-full max-w-lg rounded-md bg-gray200" aria-hidden />
    </div>
    <div className="pl-4 lg:pl-0">
      <div className="flex gap-2 overflow-hidden lg:h-[600px] lg:gap-1">
        <Skeleton className="h-[560px] w-[343px] shrink-0 rounded-none bg-gray200 md:w-[400px] lg:h-full lg:flex-1" aria-hidden />
        <Skeleton className="hidden h-[560px] w-[343px] shrink-0 rounded-none bg-gray200 md:block md:w-[400px] lg:h-full lg:flex-1" aria-hidden />
        <Skeleton className="hidden h-[560px] w-[343px] shrink-0 rounded-none bg-gray200 lg:block lg:h-full lg:flex-1" aria-hidden />
      </div>
    </div>
  </section>
);

export default AboutFacesSkeleton;
