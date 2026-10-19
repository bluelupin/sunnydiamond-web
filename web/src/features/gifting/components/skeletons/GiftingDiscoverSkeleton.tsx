import { Skeleton } from "@/shared/ui/skeleton";

const GiftingDiscoverSkeleton = () => (
  <section
    aria-busy="true"
    aria-label="Loading gift finder section"
    className="flex flex-col gap-6 px-4 pb-16 md:flex-row md:pb-104 md:pl-0 md:pr-6"
  >
    <Skeleton className="hidden h-[521px] w-1/2 rounded-none bg-gray200 md:block" aria-hidden />
    <div className="flex w-full flex-col gap-6 md:w-1/2">
      <Skeleton className="h-10 w-full max-w-md rounded-md bg-gray200" aria-hidden />
      <Skeleton className="h-24 w-full rounded-md bg-gray200" aria-hidden />
      <Skeleton className="h-14 w-48 rounded-md bg-gray300" aria-hidden />
    </div>
  </section>
);

export default GiftingDiscoverSkeleton;
