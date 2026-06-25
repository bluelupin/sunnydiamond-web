import PageContainer from "@/shared/ui/layout/PageContainer";
import { Skeleton } from "@/shared/ui/skeleton";

const AboutHeirloomSkeleton = () => (
  <section aria-busy="true" aria-label="Loading quote section" className="bg-white">
    <PageContainer className="py-16 md:py-20 desktop:py-100">
      <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
        <Skeleton className="h-4 w-4 shrink-0 rounded-sm bg-gray200 sm:h-19 sm:w-5" aria-hidden />
        <Skeleton className="h-12 w-full max-w-3xl rounded-md bg-gray200" aria-hidden />
        <Skeleton className="hidden h-19 w-5 shrink-0 rounded-sm bg-gray200 lg:block" aria-hidden />
      </div>
    </PageContainer>
  </section>
);

export default AboutHeirloomSkeleton;
