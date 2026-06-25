import PageContainer from "@/shared/ui/layout/PageContainer";
import { Skeleton } from "@/shared/ui/skeleton";

const AboutSince1997Skeleton = () => (
  <section aria-busy="true" aria-label="Loading legacy section" className="bg-white py-16 md:py-20 lg:py-100">
    <PageContainer className="pb-0">
      <Skeleton className="h-10 w-48 rounded-md bg-gray200" aria-hidden />
      <Skeleton className="mt-3 h-6 w-full max-w-xl rounded-md bg-gray200 lg:hidden" aria-hidden />
    </PageContainer>
    <PageContainer className="pt-0 !pr-0 pl-5">
      <div className="mt-8 flex gap-6 overflow-hidden md:gap-16 lg:gap-20">
        <Skeleton className="h-600 w-full max-w-[549px] shrink-0 rounded-md bg-gray200" aria-hidden />
        <Skeleton className="hidden h-600 w-463 shrink-0 rounded-md bg-gray200 md:block" aria-hidden />
      </div>
    </PageContainer>
  </section>
);

export default AboutSince1997Skeleton;
