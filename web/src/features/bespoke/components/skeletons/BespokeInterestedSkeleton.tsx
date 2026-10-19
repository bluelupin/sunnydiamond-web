import { Skeleton } from "@/shared/ui/skeleton";

const BespokeInterestedSkeleton = () => (
  <section
    aria-busy="true"
    aria-label="Loading get in touch section"
    className="relative h-[219px] w-full overflow-hidden md:h-[400px]"
  >
    <Skeleton className="absolute inset-0 rounded-none bg-gray300" aria-hidden />
    <div className="relative flex h-full flex-col items-center justify-center gap-4 px-4">
      <Skeleton className="h-10 w-full max-w-md rounded-md bg-gray400" aria-hidden />
      <Skeleton className="h-6 w-full max-w-sm rounded-md bg-gray400" aria-hidden />
    </div>
  </section>
);

export default BespokeInterestedSkeleton;
