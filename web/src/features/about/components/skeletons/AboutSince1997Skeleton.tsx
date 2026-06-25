import PageContainer from "@/shared/ui/layout/PageContainer";
import { Skeleton } from "@/shared/ui/skeleton";

const AboutSince1997Skeleton = () => (
  <section
    aria-busy="true"
    aria-label="Loading legacy section"
    className="relative bg-white"
  >
    <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-white pt-16 md:pt-20 lg:pt-100">
      <PageContainer className="shrink-0 pb-8 lg:pb-10">
        <Skeleton className="h-10 w-48 rounded-md bg-gray200 md:h-12" aria-hidden />
        <Skeleton className="mt-3 h-6 w-full max-w-xl rounded-md bg-gray200 lg:hidden" aria-hidden />
      </PageContainer>
      <PageContainer className="flex min-h-0 flex-1 flex-col pb-16 pt-0 md:pb-20 lg:pb-100 max-lg:!pr-0 max-lg:pl-5">
        <div className="flex min-h-0 flex-1 items-center gap-3 overflow-hidden md:gap-5 lg:gap-20">
          <Skeleton className="h-600 w-full shrink-0 rounded-md bg-gray200 lg:w-[549px]" aria-hidden />
          <Skeleton className="hidden h-600 w-358 shrink-0 rounded-md bg-gray200 lg:block" aria-hidden />
          <Skeleton className="h-[240px] w-[256px] shrink-0 rounded-md bg-gray200 lg:h-417 lg:w-320" aria-hidden />
          <Skeleton className="h-[277px] w-[256px] shrink-0 rounded-md bg-gray200 md:h-600 lg:h-600 lg:w-463" aria-hidden />
        </div>
      </PageContainer>
    </div>
  </section>
);

export default AboutSince1997Skeleton;
