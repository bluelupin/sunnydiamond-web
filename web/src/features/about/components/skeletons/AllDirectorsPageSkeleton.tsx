import PageContainer from "@/shared/ui/layout/PageContainer";
import { Skeleton } from "@/shared/ui/skeleton";

const AllDirectorsPageSkeleton = () => (
  <div aria-busy="true" aria-label="Loading directors page" className="bg-white pb-16 lg:pb-104">
    <PageContainer className="flex flex-col items-center gap-10 py-16 md:gap-16">
      <Skeleton className="h-12 w-80 max-w-full rounded-md bg-gray200 lg:h-14" aria-hidden />
      <div className="flex w-full max-w-[1200px] flex-col gap-12">
        {[0, 1].map((row) => (
          <div key={row} className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-10">
            <Skeleton className="h-[450px] w-full shrink-0 rounded-none bg-gray200 lg:h-[600px] lg:max-w-[478px]" aria-hidden />
            <div className="flex min-w-0 flex-1 flex-col gap-6">
              <Skeleton className="h-8 w-48 rounded-md bg-gray200" aria-hidden />
              <Skeleton className="h-5 w-64 rounded-md bg-gray200" aria-hidden />
              <Skeleton className="h-24 w-full rounded-md bg-gray200" aria-hidden />
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  </div>
);

export default AllDirectorsPageSkeleton;
