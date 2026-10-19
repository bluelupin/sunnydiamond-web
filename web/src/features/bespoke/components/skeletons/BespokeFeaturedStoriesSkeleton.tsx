import { Skeleton } from "@/shared/ui/skeleton";

const BespokeFeaturedStoriesSkeleton = () => (
  <section
    aria-busy="true"
    aria-label="Loading featured stories section"
    className="relative w-full overflow-hidden bg-white py-16"
  >
    <div className="mx-auto flex max-w-[720px] flex-col items-center gap-4 px-4">
      <Skeleton className="h-10 w-full max-w-sm rounded-md bg-gray200" aria-hidden />
      <Skeleton className="h-6 w-full max-w-md rounded-md bg-gray200" aria-hidden />
    </div>
    <Skeleton className="mx-auto mt-10 h-[400px] w-full max-w-[1440px] rounded-none bg-gray200 md:h-[540px]" aria-hidden />
  </section>
);

export default BespokeFeaturedStoriesSkeleton;
