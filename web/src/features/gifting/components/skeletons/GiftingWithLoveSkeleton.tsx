import PageContainer from "@/shared/ui/layout/PageContainer";
import { Skeleton } from "@/shared/ui/skeleton";

const GiftingWithLoveSkeleton = () => (
  <section aria-busy="true" aria-label="Loading intro section" className="bg-white py-16 lg:py-104">
    <PageContainer className="flex justify-center">
      <div className="flex w-full max-w-[700px] flex-col items-center gap-8 lg:max-w-[950px]">
        <Skeleton className="h-10 w-full max-w-md rounded-md bg-gray200" aria-hidden />
        <Skeleton className="h-[300px] w-[300px] rounded-none bg-gray200 lg:h-[246px] lg:w-[250px]" aria-hidden />
        <Skeleton className="h-5 w-full max-w-lg rounded-md bg-gray200" aria-hidden />
      </div>
    </PageContainer>
  </section>
);

export default GiftingWithLoveSkeleton;
